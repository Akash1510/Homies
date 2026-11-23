# Homies Clean - FastAPI Backend

Fast, modern, asynchronous REST API for the **Homies Clean** Home Hygiene E-Commerce application.

---

## 🚀 Features

- **Authentication & Roles**:
  - Secure signup & login with **bcrypt** password hashing and **JWT** tokens.
  - Pre-configured Admin access for **Akash** (`akashgj777@gmail.com` / `+91 7776032964`).
- **Database (MongoDB Atlas)**:
  - Asynchronous driver (`motor`) connecting directly to your MongoDB Atlas cluster.
  - Graceful local fallback if Atlas URI is not configured yet.
- **Payment Gateway (Razorpay)**:
  - Server-side order creation (`/api/payment/razorpay/create-order`).
  - Signature verification (`/api/payment/razorpay/verify`).
- **RabbitMQ Maximum Output Event Pipeline**:
  - Ultra-fast non-blocking event publishing (< 5ms response time on webhook & checkout).
  - Durable Topic Exchange (`homies.events`) and Dead Letter Exchange (`homies.dlx`).
  - Dedicated queues: `queue:orders`, `queue:payments`, `queue:notifications`, `queue:dead_letter`.
  - Independent background worker daemon (`backend/app/consumers/runner.py`).
  - Automated GST-compliant PDF Tax Invoice generator via ReportLab.
  - Rate-limited WhatsApp dispatch worker (Token Bucket).
  - Exponential backoff retry and poisoned message DLQ forwarding.
  - Real-time queue monitoring at `/api/queue/stats`.
- **Order Tracking & Admin APIs**:
  - Status updates (`Pending` -> `Confirmed` -> `Processing` -> `Shipped` -> `Delivered`).
  - Customer contact via WhatsApp integration.

---

## 🛠️ Quick Start

### 1. Set Up Python Virtual Environment
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables (`.env`)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Open `.env` and configure your credentials:
```env
# MongoDB Atlas Connection String
MONGODB_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/homies_store?retryWrites=true&w=majority"
MONGODB_DB_NAME="homies_store"

# Admin Information
ADMIN_EMAIL="akashgj777@gmail.com"
ADMIN_PHONE="+91 7776032964"

# Razorpay API Keys
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
```

### 3. Run the Development Server
```bash
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Run RabbitMQ Background Consumer Workers
In a separate terminal or service supervisor:
```bash
# Run all background workers concurrently
python -m backend.app.consumers.runner --workers all

# Or run sharded workers individually:
python -m backend.app.consumers.runner --workers orders
python -m backend.app.consumers.runner --workers payments
python -m backend.app.consumers.runner --workers notifications
python -m backend.app.consumers.runner --workers dlq
```

Interactive API documentation will be available at:
- Swagger UI: **http://localhost:8000/docs**
- Queue Metrics: **http://localhost:8000/api/queue/stats**
- ReDoc: **http://localhost:8000/redoc**
- Health check: **http://localhost:8000/api/health**
