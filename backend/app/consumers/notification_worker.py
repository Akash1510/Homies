import logging
from typing import Dict, Any
import aio_pika
from backend.app.consumers.base import BaseConsumer
from backend.app.core.config import settings
from backend.app.services.whatsapp_service import whatsapp_service

logger = logging.getLogger("homies.notification_worker")

class NotificationWorker(BaseConsumer):
    """
    Consumer worker for queue:notifications.
    Rate-limited background processor for WhatsApp order confirmation,
    dispatch tracking, and refund status messages.
    """
    def __init__(self):
        super().__init__(
            queue_name=settings.QUEUE_NOTIFICATIONS,
            prefetch_count=20,
            worker_name="NotificationWorker",
        )

    async def process_event(
        self,
        event_type: str,
        data: Dict[str, Any],
        raw_message: aio_pika.abc.AbstractIncomingMessage
    ):
        if event_type == "notification.whatsapp_dispatch":
            phone = data.get("phone")
            template = data.get("template", "order_confirmed")
            params = data.get("params", {})
            order_id = data.get("order_id")

            if not phone:
                logger.warning("[NotificationWorker] Skipped dispatch: No phone number provided.")
                return

            await whatsapp_service.send_whatsapp_message(
                phone=phone,
                template=template,
                params=params,
                order_id=order_id,
            )
        else:
            logger.info(f"[NotificationWorker] Unhandled event type: {event_type}")
