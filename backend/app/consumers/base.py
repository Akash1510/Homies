import abc
import asyncio
import json
import logging
from typing import Dict, Any, Optional
import aio_pika
from backend.app.core.config import settings

logger = logging.getLogger("homies.consumer")

class BaseConsumer(abc.ABC):
    """
    Abstract Base RabbitMQ Consumer with:
    - High-throughput prefetch tuning
    - Structured JSON payload deserialization
    - Dead Letter Exchange (DLX) forwarding on maximum retries
    - Exponential backoff retry logic
    """
    def __init__(
        self,
        queue_name: str,
        prefetch_count: int = 20,
        worker_name: str = "BaseWorker",
    ):
        self.queue_name = queue_name
        self.prefetch_count = prefetch_count
        self.worker_name = worker_name
        self._connection: Optional[aio_pika.abc.AbstractRobustConnection] = None
        self._channel: Optional[aio_pika.abc.AbstractChannel] = None
        self._queue: Optional[aio_pika.abc.AbstractQueue] = None
        self._is_running: bool = False

    @abc.abstractmethod
    async def process_event(self, event_type: str, data: Dict[str, Any], raw_message: aio_pika.abc.AbstractIncomingMessage):
        """Process business logic for the incoming event."""
        pass

    async def start(self):
        """Connect to broker, configure QoS, and begin consuming."""
        self._is_running = True
        logger.info(f"[{self.worker_name}] Connecting to RabbitMQ for queue '{self.queue_name}'...")

        self._connection = await aio_pika.connect_robust(
            settings.RABBITMQ_URL,
            client_properties={"connection_name": f"homies_{self.worker_name.lower()}"}
        )
        self._channel = await self._connection.channel()
        await self._channel.set_qos(prefetch_count=self.prefetch_count)

        queue_args = {}
        if self.queue_name != settings.QUEUE_DEAD_LETTER:
            queue_args = {"x-dead-letter-exchange": settings.RABBITMQ_DLX_EXCHANGE}

        self._queue = await self._channel.declare_queue(
            self.queue_name,
            durable=True,
            arguments=queue_args if queue_args else None,
        )
        logger.info(f"[{self.worker_name}] 🚀 Worker started. Listening on '{self.queue_name}' (prefetch={self.prefetch_count}).")

        async with self._queue.iterator() as queue_iter:
            async for message in queue_iter:
                if not self._is_running:
                    break
                await self._handle_message(message)

    async def _handle_message(self, message: aio_pika.abc.AbstractIncomingMessage):
        """Standardized message dispatcher with retry and DLQ routing."""
        headers = dict(message.headers or {})
        retry_count = int(headers.get("x-retry-count", 0))

        try:
            payload = json.loads(message.body.decode("utf-8"))
            event_type = payload.get("event_type", "unknown")
            data = payload.get("data", {})
            event_id = payload.get("event_id", "unknown")

            logger.info(f"[{self.worker_name}] 📥 Processing event={event_type} id={event_id} (retry={retry_count})")
            
            # Execute worker-specific business logic
            await self.process_event(event_type, data, message)
            
            # Explicit acknowledgement upon success
            await message.ack()
            logger.info(f"[{self.worker_name}] ✅ Successfully processed event={event_type} id={event_id}")

        except Exception as e:
            logger.error(f"[{self.worker_name}] ❌ Error processing message: {e}", exc_info=True)
            await self._handle_failure(message, retry_count, e)

    async def _handle_failure(
        self,
        message: aio_pika.abc.AbstractIncomingMessage,
        retry_count: int,
        error: Exception,
    ):
        """
        Retries message with exponential backoff up to RABBITMQ_MAX_RETRIES.
        On exceeding max retries, rejects message without requeue (routing to DLX).
        """
        if retry_count < settings.RABBITMQ_MAX_RETRIES:
            new_retry_count = retry_count + 1
            delay_sec = min(15.0, 0.5 * (2 ** (new_retry_count - 1)))
            logger.warning(
                f"[{self.worker_name}] 🔄 Retrying in {delay_sec:.1f}s (Attempt {new_retry_count}/{settings.RABBITMQ_MAX_RETRIES})..."
            )
            await asyncio.sleep(delay_sec)

            # Re-publish message with updated retry count header
            headers = dict(message.headers or {})
            headers["x-retry-count"] = new_retry_count
            headers["x-last-error"] = str(error)

            retry_msg = aio_pika.Message(
                body=message.body,
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
                content_type="application/json",
                headers=headers,
                correlation_id=message.correlation_id,
            )

            # Re-publish to current queue
            await self._channel.default_exchange.publish(
                retry_msg,
                routing_key=self.queue_name,
            )
            # Acknowledge the old message since the retry is queued
            await message.ack()
        else:
            logger.error(
                f"[{self.worker_name}] 💀 Max retries ({settings.RABBITMQ_MAX_RETRIES}) reached. Routing message to Dead Letter Queue (DLQ)."
            )
            # Reject without requeue -> RabbitMQ moves it to DLX (homies.dlx)
            await message.reject(requeue=False)

    async def stop(self):
        """Gracefully stop worker."""
        self._is_running = False
        if self._channel:
            await self._channel.close()
        if self._connection:
            await self._connection.close()
        logger.info(f"[{self.worker_name}] Stopped.")
