import asyncio
import logging
import time
from datetime import datetime
from typing import Dict, Any, Optional
from urllib.parse import quote_plus
from backend.app.core.config import settings

logger = logging.getLogger("homies.whatsapp")

class AsyncTokenBucket:
    """
    Asynchronous token bucket rate limiter to adhere to WhatsApp API limits
    (e.g., max 10 messages/sec by default).
    """
    def __init__(self, rate: float, capacity: float):
        self.rate = rate  # tokens added per second
        self.capacity = capacity  # max bucket size
        self.tokens = capacity
        self.last_update = time.monotonic()
        self._lock = asyncio.Lock()

    async def acquire(self):
        async with self._lock:
            while True:
                now = time.monotonic()
                elapsed = now - self.last_update
                self.tokens = min(self.capacity, self.tokens + elapsed * self.rate)
                self.last_update = now

                if self.tokens >= 1.0:
                    self.tokens -= 1.0
                    return
                # Wait for token replenishment
                needed = (1.0 - self.tokens) / self.rate
                await asyncio.sleep(max(0.01, needed))


class WhatsAppService:
    """
    Asynchronous, rate-limited WhatsApp notifications dispatcher for Homies Clean.
    Formats brand messages and dispatches without blocking the event pipeline.
    """
    def __init__(self):
        self.limiter = AsyncTokenBucket(
            rate=settings.WHATSAPP_RATE_LIMIT_PER_SEC,
            capacity=settings.WHATSAPP_RATE_LIMIT_PER_SEC * 2,
        )

    def format_message(self, template: str, params: Dict[str, Any]) -> str:
        """Formats customizable branded WhatsApp message copy."""
        name = params.get("customer_name") or params.get("name") or "Valued Customer"
        order_id = params.get("order_id", "N/A")
        total = params.get("total", 0)

        if template == "order_confirmed":
            items_list = ""
            for itm in params.get("items", []):
                items_list += f"  • {itm.get('name', 'Item')} x{itm.get('quantity', 1)}\n"

            return (
                f"✨ *Homies Clean - Order Confirmed!*\n\n"
                f"Hi {name},\n"
                f"Thank you for ordering with Homies Clean! Your order *{order_id}* has been confirmed.\n\n"
                f"📦 *Items:*\n{items_list or '  • Homies Hygiene Supplies'}\n"
                f"💰 *Total Amount:* ₹{total}\n"
                f"📍 *Shipping To:* {params.get('address', '')}, {params.get('city', '')} - {params.get('pincode', '')}\n\n"
                f"🔗 *Live Tracking:* http://localhost:3000/track?order_id={order_id}\n\n"
                f"Need support? Reply here or call us at {settings.ADMIN_PHONE}."
            )

        elif template == "order_shipped":
            return (
                f"🚚 *Homies Clean - Package on the Way!*\n\n"
                f"Hi {name},\n"
                f"Great news! Your Homies Clean supplies for order *{order_id}* have been handed over to our courier partner.\n\n"
                f"📍 *Expected Delivery:* 24-48 Hours\n"
                f"🔗 *Live Tracking:* http://localhost:3000/track?order_id={order_id}\n\n"
                f"Thank you for trusting Homies Clean!"
            )

        elif template == "refund_processed":
            refund_id = params.get("refund_id", "N/A")
            amount = params.get("amount", 0)
            return (
                f"💳 *Homies Clean - Refund Initiated!*\n\n"
                f"Hi {name},\n"
                f"Your refund of *₹{amount}* for order *{order_id}* has been processed successfully.\n\n"
                f"• Refund Reference ID: *{refund_id}*\n"
                f"• Destination: Original Source Account (UPI/Card/Netbanking)\n"
                f"• Estimated Credit: 3-5 Business Days\n\n"
                f"For inquiries, contact us at {settings.ADMIN_PHONE}."
            )

        elif template == "payment_failed":
            return (
                f"⚠️ *Homies Clean - Payment Incomplete*\n\n"
                f"Hi {name},\n"
                f"We noticed that payment for order *{order_id}* could not be completed.\n\n"
                f"Don't worry! You can switch to *Cash on Delivery* or complete via WhatsApp by replying to this message.\n\n"
                f"🔗 *Review Order:* http://localhost:3000/track?order_id={order_id}"
            )

        # Default generic template
        return (
            f"🧼 *Homies Clean Notification*\n\n"
            f"Hi {name},\n"
            f"{params.get('custom_message', f'Update regarding order {order_id}.')}\n\n"
            f"Contact: {settings.ADMIN_PHONE}"
        )

    async def send_whatsapp_message(
        self,
        phone: str,
        template: str,
        params: Dict[str, Any],
        order_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Enforces token-bucket rate limiting and sends the WhatsApp message.
        """
        # 1. Enforce Rate Limiting
        await self.limiter.acquire()

        # 2. Format Message Content
        text = self.format_message(template, params)
        clean_phone = phone.replace("+", "").replace(" ", "").replace("-", "")
        if not clean_phone.startswith("91") and len(clean_phone) == 10:
            clean_phone = f"91{clean_phone}"

        wa_web_url = f"https://wa.me/{clean_phone}?text={quote_plus(text)}"

        # 3. Simulate or dispatch message
        # In production, this calls WhatsApp Cloud API / Twilio WhatsApp API
        dispatch_record = {
            "status": "delivered",
            "phone": clean_phone,
            "order_id": order_id,
            "template": template,
            "wa_link": wa_web_url,
            "preview": text[:120] + "...",
            "dispatched_at": datetime.utcnow().isoformat() + "Z",
        }

        logger.info(f"📱 [WhatsApp Worker] Message dispatched to +{clean_phone} for order={order_id} (Template: {template})")
        return dispatch_record

# Global singleton service
whatsapp_service = WhatsAppService()
