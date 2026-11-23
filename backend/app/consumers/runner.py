import argparse
import asyncio
import logging
import signal
import sys
from backend.app.consumers.order_worker import OrderWorker
from backend.app.consumers.payment_worker import PaymentWorker
from backend.app.consumers.notification_worker import NotificationWorker
from backend.app.consumers.dlq_worker import DeadLetterWorker
from backend.app.db.mongodb import connect_to_mongodb, close_mongodb_connection
from backend.app.producers.rabbitmq import mq_producer

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("homies.runner")

async def run_workers(target: str = "all"):
    """
    Main background consumer daemon runner.
    Supports running all workers in a single process or sharding per worker queue.
    """
    logger.info(f"🚀 Initializing Homies Clean RabbitMQ Consumer Runner (Target: {target})...")

    # Connect to MongoDB & ensure RabbitMQ topology is initialized
    await connect_to_mongodb()
    await mq_producer.connect()

    workers = []
    if target in ("all", "orders"):
        workers.append(OrderWorker())
    if target in ("all", "payments"):
        workers.append(PaymentWorker())
    if target in ("all", "notifications"):
        workers.append(NotificationWorker())
    if target in ("all", "dlq"):
        workers.append(DeadLetterWorker())

    if not workers:
        logger.error(f"Invalid worker target '{target}'. Choose from: all, orders, payments, notifications, dlq.")
        return

    stop_event = asyncio.Event()

    def signal_handler():
        logger.info("🛑 Received termination signal. Initiating graceful worker shutdown...")
        stop_event.set()

    loop = asyncio.get_running_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        try:
            loop.add_signal_handler(sig, signal_handler)
        except NotImplementedError:
            pass # Windows or limited signal support

    # Launch all selected workers as background tasks
    tasks = [asyncio.create_task(w.start()) for w in workers]

    logger.info(f"✨ {len(workers)} worker(s) successfully active and consuming.")

    # Wait until stop signal is received
    try:
        await stop_event.wait()
    except asyncio.CancelledError:
        pass
    finally:
        logger.info("Stopping all workers...")
        for w in workers:
            await w.stop()
        for t in tasks:
            t.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)
        await mq_producer.close()
        await close_mongodb_connection()
        logger.info("✅ All consumer workers cleanly terminated.")

def main():
    parser = argparse.ArgumentParser(description="Homies Clean RabbitMQ Workers Runner")
    parser.add_argument(
        "--workers",
        type=str,
        default="all",
        choices=["all", "orders", "payments", "notifications", "dlq"],
        help="Specify which worker group to run (default: all)",
    )
    args = parser.parse_args()

    try:
        asyncio.run(run_workers(args.workers))
    except KeyboardInterrupt:
        logger.info("Runner stopped by user.")

if __name__ == "__main__":
    main()
