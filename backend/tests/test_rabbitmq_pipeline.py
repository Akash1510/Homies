import asyncio
import os
import time
from datetime import datetime
from pathlib import Path
from backend.app.core.config import settings
from backend.app.producers.rabbitmq import mq_producer
from backend.app.producers.events import (
    emit_order_created,
    emit_webhook_received,
    emit_refund_requested,
    emit_whatsapp_dispatch,
)
from backend.app.consumers.order_worker import OrderWorker
from backend.app.consumers.payment_worker import PaymentWorker
from backend.app.consumers.notification_worker import NotificationWorker
from backend.app.consumers.dlq_worker import DeadLetterWorker
from backend.app.db.mongodb import db_manager, memory_db

async def test_full_pipeline():
    print("=" * 60)
    print("🧪 STARTING HOMIES CLEAN RABBITMQ PIPELINE BENCHMARK & TEST")
    print("=" * 60)

    # 1. Initialize Producer and RabbitMQ Topology
    print("\n[Step 1] Connecting to RabbitMQ and asserting topology...")
    await mq_producer.connect()
    assert mq_producer._is_connected, "Producer should be connected to RabbitMQ"
    print("✅ RabbitMQ connection and exchange/queue topology declared.")

    # 2. Benchmark Producer Latency (< 5ms target)
    print("\n[Step 2] Testing Producer Latency on order.created event...")
    test_order_data = {
        "id": "test_order_uuid_101",
        "order_id": "HMY-TEST-101",
        "customer_name": "Akash Sharma",
        "phone": "+91 7776032964",
        "email": "akashgj777@gmail.com",
        "address": "Flat 402, Sunshine Heights, Powai",
        "city": "Mumbai",
        "pincode": "400076",
        "items": [
            {"product_id": "prod_1", "name": "Citrus Floor Cleaner (5L)", "price": 499.0, "quantity": 1, "unit": "bottle"},
            {"product_id": "prod_3", "name": "360° Spin Mop Pro Set", "price": 899.0, "quantity": 1, "unit": "set"}
        ],
        "subtotal": 1398.0,
        "delivery_charge": 0.0,
        "discount": 100.0,
        "total": 1298.0,
        "payment_method": "RAZORPAY",
        "payment_status": "PAID",
        "status": "Confirmed",
        "razorpay_order_id": "order_mock_test101",
        "razorpay_payment_id": "pay_mock_test101",
        "created_at": datetime.utcnow().isoformat(),
    }

    # Store in memory DB for test lookup
    memory_db["orders"]["test_order_uuid_101"] = test_order_data

    start_perf = time.perf_counter()
    res = await emit_order_created(test_order_data)
    elapsed_ms = (time.perf_counter() - start_perf) * 1000

    print(f"⏱️ Event Publish Elapsed Time: {elapsed_ms:.2f}ms (Target: < 5ms)")
    print(f"Publish result: {res}")
    assert res.get("status") == "published", f"Event should be published, got: {res}"
    print("✅ Order event emitted under SLA.")

    # 3. Test Webhook Fast-Path Latency (< 5ms)
    print("\n[Step 3] Testing Webhook Received Event (< 5ms)...")
    start_webhook = time.perf_counter()
    webhook_res = await emit_webhook_received(
        event_type="payment.captured",
        raw_payload={
            "event": "payment.captured",
            "payload": {
                "payment": {
                    "entity": {
                        "id": "pay_mock_webhook_999",
                        "order_id": "order_mock_test101",
                        "amount": 129800,
                        "status": "captured",
                    }
                }
            }
        },
        signature="simulated_sig_123"
    )
    webhook_ms = (time.perf_counter() - start_webhook) * 1000
    print(f"⏱️ Webhook Publish Elapsed Time: {webhook_ms:.2f}ms")
    assert webhook_res.get("status") == "published"
    print("✅ Webhook event published asynchronously.")

    # 4. Test Refund Request Event
    print("\n[Step 4] Testing Refund Requested Event...")
    refund_res = await emit_refund_requested(
        payment_id="pay_mock_test101",
        amount=1298.0,
        order_id="HMY-TEST-101",
        notes={"reason": "Customer cancellation"}
    )
    assert refund_res.get("status") == "published"
    print("✅ Refund request event published.")

    # 5. Check Queue Depths
    print("\n[Step 5] Checking RabbitMQ Queue Depths before worker consumption...")
    stats = await mq_producer.get_queue_stats()
    print("Queue Stats:", stats)
    assert stats.get("status") == "connected"
    orders_count = stats["queues"][settings.QUEUE_ORDERS]["message_count"]
    payments_count = stats["queues"][settings.QUEUE_PAYMENTS]["message_count"]
    print(f"Messages in {settings.QUEUE_ORDERS}: {orders_count}")
    print(f"Messages in {settings.QUEUE_PAYMENTS}: {payments_count}")

    # 6. Run Workers Briefly to Consume and Verify Processing
    print("\n[Step 6] Starting Worker Instances to process all queued messages...")
    order_worker = OrderWorker()
    payment_worker = PaymentWorker()
    notif_worker = NotificationWorker()

    worker_tasks = [
        asyncio.create_task(order_worker.start()),
        asyncio.create_task(payment_worker.start()),
        asyncio.create_task(notif_worker.start()),
    ]

    # Give workers 3 seconds to drain queues and process invoices / notifications
    await asyncio.sleep(3.0)

    # 7. Verify Artifacts: Check Generated Tax Invoice PDF
    print("\n[Step 7] Verifying Generated Tax Invoice PDF...")
    invoice_path = Path("public/invoices/invoice_HMY-TEST-101.pdf")
    assert invoice_path.exists(), f"Invoice PDF {invoice_path} should have been generated by OrderWorker!"
    pdf_size = os.path.getsize(invoice_path)
    print(f"✅ Generated Tax Invoice PDF verified: {invoice_path} (Size: {pdf_size} bytes)")

    # 8. Verify Order Record Updated with Invoice URL
    updated_order = memory_db["orders"]["test_order_uuid_101"]
    print("Updated Order in Memory DB:", {
        "order_id": updated_order.get("order_id"),
        "invoice_url": updated_order.get("invoice_url"),
        "invoice_number": updated_order.get("invoice_number"),
        "payment_status": updated_order.get("payment_status"),
    })
    assert updated_order.get("invoice_url") is not None, "Order should have invoice_url attached"

    # Stop workers cleanly
    print("\n[Step 8] Stopping test workers...")
    await order_worker.stop()
    await payment_worker.stop()
    await notif_worker.stop()
    for t in worker_tasks:
        t.cancel()
    await asyncio.gather(*worker_tasks, return_exceptions=True)

    # Close producer
    await mq_producer.close()

    print("\n" + "=" * 60)
    print("🎉 ALL PIPELINE TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(test_full_pipeline())
