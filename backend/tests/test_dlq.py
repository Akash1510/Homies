import asyncio
import json
import aio_pika
from backend.app.core.config import settings
from backend.app.producers.rabbitmq import mq_producer
from backend.app.consumers.base import BaseConsumer
from backend.app.consumers.dlq_worker import DeadLetterWorker, dlq_memory_store

class FailingTestWorker(BaseConsumer):
    def __init__(self):
        super().__init__(
            queue_name=settings.QUEUE_ORDERS,
            prefetch_count=5,
            worker_name="FailingWorker",
        )

    async def process_event(self, event_type, data, raw_message):
        if data.get("is_poison"):
            raise ValueError("Intentional crash to test Dead-Letter Exchange (DLX) forwarding")

async def test_dlq_routing():
    print("🧪 Testing Dead Letter Queue (DLX) forwarding on exceeding max retries...")
    await mq_producer.connect()

    # Publish poison pill
    poison_data = {"is_poison": True, "test_ref": "POISON_TEST_1"}
    await mq_producer.publish(
        routing_key="order.created",
        event_type="order.created",
        payload=poison_data,
        correlation_id="POISON_CORR_1",
    )

    failing_worker = FailingTestWorker()
    dlq_worker = DeadLetterWorker()

    worker_task = asyncio.create_task(failing_worker.start())
    dlq_task = asyncio.create_task(dlq_worker.start())

    # Allow retries and DLQ routing to complete (retries with small backoff: 0.5s + 1s + 2s = 3.5s)
    await asyncio.sleep(6.0)

    # Check DLQ store
    print(f"DLQ Memory Store Count: {len(dlq_memory_store)}")
    assert len(dlq_memory_store) > 0, "Poison message should have reached DLQ!"
    poison_record = next((r for r in dlq_memory_store if r.get("correlation_id") == "POISON_CORR_1"), None)
    assert poison_record is not None, "Poison message record should be stored in DLQ!"
    print(f"✅ DLQ Routing verified! Caught dead-letter message: {poison_record['correlation_id']}")

    await failing_worker.stop()
    await dlq_worker.stop()
    worker_task.cancel()
    dlq_task.cancel()
    await asyncio.gather(worker_task, dlq_task, return_exceptions=True)
    await mq_producer.close()
    print("🎉 DLQ TEST PASSED!")

if __name__ == "__main__":
    asyncio.run(test_dlq_routing())
