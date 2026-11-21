#!/usr/bin/env python3
"""
Homies Clean - Production Roadmap & GitHub Issues Generator
Creates the complete set of 20 production readiness issues on Akash1510/Homies.
"""

import os
import sys
import json
import subprocess
import urllib.request
import urllib.error

ISSUES = [
    {
        "title": "[Payment] Configure Live / Test Razorpay API Keys & Webhook Secret in Environment",
        "labels": ["payments", "security", "critical"],
        "body": """### Summary
The repository currently uses placeholder demo keys (`rzp_test_HomiesDemoKey` and `rzp_secret_HomiesDemoSecret`) in `.env.example` and frontend settings. Real online card and UPI payments via Razorpay Standard Checkout will fail with "Invalid Key ID" until real keys are loaded.

### Current Behavior
- `STORE_SETTINGS.razorpayKeyId` defaults to placeholder.
- `backend/app/core/config.py` defaults to placeholder.

### Expected Behavior
- Real Razorpay Test (`rzp_test_...`) and Live (`rzp_live_...`) keys are configured via `.env.local` and `backend/.env`.
- Keys are never committed to Git.

### Action Items
1. Generate API Keys in [Razorpay Dashboard](https://dashboard.razorpay.com) -> Settings -> API Keys.
2. Populate `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET`.
3. Add `RAZORPAY_WEBHOOK_SECRET` for webhook validation.
"""
    },
    {
        "title": "[Database] Persist Checkout Orders to FastAPI MongoDB in Real Time",
        "labels": ["database", "backend", "critical"],
        "body": """### Summary
When a customer completes checkout on the storefront (`CheckoutModal.tsx`), the order is currently saved into client-side `localStorage` (`homies_orders`). It is not persisted to the FastAPI MongoDB backend (`POST /api/orders`).

### Impact
- Orders placed by customers on their mobile phones or computers do not show up on Akash's admin portal unless placed on the exact same browser.
- Order tracking (`/track`) by other users or devices cannot retrieve the order details.

### Implementation Steps
1. In `src/context/CartContext.tsx`, update `createOrder()` to dispatch an asynchronous `POST` to `/api/orders`.
2. Save customer relationship: link `user_id`, customer phone, and line items in MongoDB `orders` collection.
3. Handle offline caching gracefully if backend is temporarily unreachable.
"""
    },
    {
        "title": "[Admin] Connect Admin Hub directly to MongoDB Orders API instead of LocalStorage",
        "labels": ["admin", "frontend", "critical"],
        "body": """### Summary
The Admin Control Hub (`src/app/admin/page.tsx`) currently reads order items and statuses from `useCart().orders` (the browser's local state).

### Expected Behavior
- Admin Hub should query `GET /api/orders` from the FastAPI backend on mount and when changing filters.
- Updating an order status (`Pending` -> `Confirmed` -> `Shipped` -> `Delivered`) should issue a `PATCH /api/orders/{order_id}/status` call to MongoDB.

### Implementation Steps
1. Add `fetchOrders()` in `admin/page.tsx` calling `/api/orders`.
2. Add live auto-refresh or polling every 30 seconds for new incoming orders.
3. Update metrics (Gross Sales, Pending, In Transit, Delivered) based on MongoDB aggregated statistics (`/api/orders/stats/summary`).
"""
    },
    {
        "title": "[Frontend] Replace Hardcoded `http://127.0.0.1:8000` with Configurable `NEXT_PUBLIC_API_URL`",
        "labels": ["frontend", "bug", "critical"],
        "body": """### Summary
In `src/context/AuthContext.tsx` (lines 64 & 87) and `src/app/api/payment/razorpay/create-order/route.ts`, backend API endpoints are hardcoded to `http://127.0.0.1:8000`.

### Impact
When deployed on the web (e.g. Vercel at `https://homiesclean.com`), visiting customer browsers will attempt to make requests to `127.0.0.1` (their own local machine) rather than your backend server, causing connection errors and mixed-content blocking.

### Implementation Steps
1. Replace `http://127.0.0.1:8000` with `process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'`.
2. Document `NEXT_PUBLIC_API_URL` in `.env.example`.
"""
    },
    {
        "title": "[Database] Migrate from Local MongoDB (`127.0.0.1:27017`) to Cloud MongoDB Atlas",
        "labels": ["database", "devops"],
        "body": """### Summary
The FastAPI backend currently connects to local MongoDB on `mongodb://127.0.0.1:27017/homies`. For multi-server and cloud hosting (e.g. Render, Railway, AWS), a managed MongoDB Atlas cluster is required.

### Implementation Steps
1. Create a free M0/M10 cluster on [MongoDB Atlas](https://cloud.mongodb.com).
2. Configure database user credentials and IP access whitelist (allow cloud hosting IPs or `0.0.0.0/0`).
3. Set `MONGODB_URL=\"mongodb+srv://<user>:<password>@cluster.mongodb.net/homies?retryWrites=true&w=majority\"` in production environment.
4. Run `init_db.py` to create unique indexes on `email` and `order_id`.
"""
    },
    {
        "title": "[Media Storage] Integrate Cloudinary or AWS S3 for Dynamic Product Image Uploads",
        "labels": ["backend", "devops", "enhancement"],
        "body": """### Summary
The in-admin image uploader (`src/app/api/upload/route.ts`) writes uploaded product photos to local disk (`public/products/`).

### Impact on Serverless Deployment
On serverless platforms like Vercel or AWS Lambda, filesystems are ephemeral and read-only. Images uploaded at runtime will be wiped when the function container sleeps.

### Implementation Steps
1. Connect Cloudinary, AWS S3, or Supabase Storage.
2. Update `/api/upload` to stream file buffers to cloud object storage.
3. Return persistent CDN URLs for new products.
"""
    },
    {
        "title": "[Assets] Replace Unsplash Mock Images with High-Res Branded Product Photography",
        "labels": ["frontend", "ui/ux"],
        "body": """### Summary
The initial cleaning products in `src/data/products.ts` use Unsplash stock photography URLs.

### Implementation Steps
1. Photograph Homies Clean floor cleaners, mops, toilet care gels, and bundles.
2. Optimize images (WebP format, 800x800 square aspect ratio, compressed < 100KB).
3. Place files in `public/products/` (e.g., `floor-cleaner-citrus.webp`, `spin-mop-set.webp`).
4. Update `image` and `additionalImages` paths in `src/data/products.ts`.
"""
    },
    {
        "title": "[Build] Update `dev` Script in `package.json` to Use `--webpack`",
        "labels": ["frontend", "dx"],
        "body": """### Summary
In `package.json`, `"build": "next build --webpack"`, but `"dev": "next dev"`. On some macOS environments with Next.js 16 and `@tailwindcss/turbopack`, running `npm run dev` can occasionally encounter Turbopack IPC worker panics.

### Implementation Steps
Update `package.json` scripts:
```json
\"dev\": \"next dev --webpack\"
```
"""
    },
    {
        "title": "[Security] Implement Server-Side Next.js Middleware for `/admin` Route Protection",
        "labels": ["security", "frontend"],
        "body": """### Summary
The Admin Hub (`src/app/admin/page.tsx`) currently validates Akash's PIN in React state.

### Implementation Steps
1. Create `src/middleware.ts` in Next.js.
2. Intercept requests to `/admin/:path*`.
3. Check for authenticated JWT session cookie or redirect unauthorized users to `/login`.
"""
    },
    {
        "title": "[Payment] Register and Secure Asynchronous Razorpay Webhook Handler",
        "labels": ["payments", "backend"],
        "body": """### Summary
While standard checkout handles client-side callbacks, asynchronous payment events (e.g., UPI delayed confirmations, net-banking pending captures) require a webhook.

### Implementation Steps
1. Register webhook URL `https://<api-domain>/api/payment/razorpay/webhook` in Razorpay Dashboard.
2. Enable events: `payment.captured`, `payment.failed`, `order.paid`.
3. Verify `X-Razorpay-Signature` against `RAZORPAY_WEBHOOK_SECRET` in `backend/app/routes/payment.py`.
4. Update order payment status in MongoDB to `PAID`.
"""
    },
    {
        "title": "[Notifications] Automate WhatsApp Dispatch via Business API Gateway (Wati / Twilio)",
        "labels": ["integrations", "enhancement"],
        "body": """### Summary
Currently, customer WhatsApp updates use `window.open('https://wa.me/...')` which requires manual user clicks.

### Implementation Steps
1. Integrate WhatsApp Business API (via Twilio, Gupshup, or Wati).
2. Trigger automated order confirmation templates upon checkout.
3. Trigger automated dispatch tracking messages when order status becomes `Shipped`.
"""
    },
    {
        "title": "[Email] Automated Tax Invoice Emailing via SendGrid / Resend / Amazon SES",
        "labels": ["backend", "notifications"],
        "body": """### Summary
Customers should receive an official GST tax invoice email immediately after successful order placement.

### Implementation Steps
1. Integrate an email service (Resend / SendGrid / Amazon SES).
2. Generate HTML tax invoice using the template from `InvoiceModal.tsx`.
3. Send order confirmation email with PDF attachment.
"""
    },
    {
        "title": "[Auth] Implement JWT Refresh Token Rotation & Session Expiry Notification",
        "labels": ["security", "backend"],
        "body": """### Summary
Access tokens expire after 7 days, but there is no refresh rotation. If a token expires while shopping, requests fail silently.

### Implementation Steps
1. Issue short-lived Access Token (15-60 min) and long-lived Refresh Token (30 days).
2. Add `POST /api/auth/refresh` endpoint in FastAPI.
3. Automatically refresh token in `AuthContext.tsx` on 401 response.
"""
    },
    {
        "title": "[Security] Configure Strict Production CORS Policies in FastAPI",
        "labels": ["security", "backend"],
        "body": """### Summary
In `backend/app/main.py`, CORS currently allows `allow_origins=[\"*\"]` for rapid development.

### Implementation Steps
1. In production, restrict `allow_origins` to verified domains: `https://homiesclean.com`, `https://www.homiesclean.com`.
2. Allow localhost only when `ENVIRONMENT == 'development'`.
"""
    },
    {
        "title": "[SEO] Implement Dynamic OpenGraph Tags, JSON-LD Schema & Sitemap for Cleaning Products",
        "labels": ["frontend", "seo"],
        "body": """### Summary
To maximize organic search ranking on Google for "floor cleaner online", "spin mop set", etc., structured metadata is needed.

### Implementation Steps
1. Add `generateMetadata` in `src/app/page.tsx` and product pages.
2. Add JSON-LD schema for `Product`, `Offer`, `AggregateRating`, and `Store`.
3. Generate dynamic `/sitemap.xml` and `/robots.txt`.
"""
    },
    {
        "title": "[Search] Add MongoDB Full-Text Search Index & Faceted Price / Fragrance Filters",
        "labels": ["database", "performance"],
        "body": """### Summary
Enhance the search bar to support full-text fuzzy matching across product names, benefits, and fragrances.

### Implementation Steps
1. Create MongoDB text index: `db.products.createIndex({ name: \"text\", description: \"text\", fragranceOrType: \"text\" })`.
2. Support price range filters (e.g. Under ₹200, ₹200-₹500).
"""
    },
    {
        "title": "[Payment] Add Automated Refund Processing in Admin Hub via Razorpay API",
        "labels": ["payments", "admin", "enhancement"],
        "body": """### Summary
When an order is cancelled in the Admin Hub, the admin should be able to trigger an instant refund to the customer's source account.

### Implementation Steps
1. Add `POST /api/payment/razorpay/refund` in FastAPI calling Razorpay Payments Refund API.
2. Add "Issue Refund" button in `admin/page.tsx` for cancelled prepaid orders.
"""
    },
    {
        "title": "[DevOps] Add Unified Dockerfile and Docker Compose Setup",
        "labels": ["devops", "infrastructure"],
        "body": """### Summary
Provide a 1-command deployment configuration for local or cloud VPS hosting.

### Implementation Steps
1. Add `Dockerfile` for Next.js standalone build.
2. Add `backend/Dockerfile` for FastAPI Uvicorn service.
3. Add `docker-compose.yml` linking Next.js, FastAPI, and MongoDB with health checks.
"""
    },
    {
        "title": "[CI/CD] Add GitHub Actions Workflow for Automated Build, Lint & Tests",
        "labels": ["devops", "ci/cd"],
        "body": """### Summary
Prevent regressions by automating test and build validation on every push and pull request.

### Implementation Steps
1. Create `.github/workflows/ci.yml`.
2. Jobs:
   - Next.js: `npm ci`, `npm run lint`, `npm run build`.
   - FastAPI: `pip install -r requirements.txt`, `pytest`.
"""
    },
    {
        "title": "[Monitoring] Integrate Sentry Error Tracking & Performance Monitoring",
        "labels": ["observability", "devops"],
        "body": """### Summary
Real-time alerting for runtime exceptions in production.

### Implementation Steps
1. Configure `@sentry/nextjs` in frontend.
2. Configure `sentry-sdk[fastapi]` in FastAPI.
3. Capture client-side checkout errors and backend database timeouts.
"""
    }
]

def main():
    print(f"Total production issues prepared: {len(ISSUES)}")
    token = os.environ.get("GITHUB_TOKEN")

    if token:
        print("Using provided GITHUB_TOKEN to create issues on Akash1510/Homies...")
        for i, issue in enumerate(ISSUES, 1):
            url = "https://api.github.com/repos/Akash1510/Homies/issues"
            payload = json.dumps({
                "title": issue["title"],
                "body": issue["body"],
                "labels": issue["labels"]
            }).encode('utf-8')
            req = urllib.request.Request(
                url,
                data=payload,
                headers={
                    "Authorization": f"Bearer {token}",
                    "Accept": "application/vnd.github+json",
                    "User-Agent": "Homies-Issue-Creator"
                }
            )
            try:
                with urllib.request.urlopen(req) as resp:
                    data = json.loads(resp.read().decode())
                    print(f"[{i}/{len(ISSUES)}] Created #{data.get('number')}: {issue['title']}")
            except urllib.error.HTTPError as e:
                print(f"[{i}/{len(ISSUES)}] HTTP Error {e.code}: {e.read().decode()[:150]}")
            except Exception as e:
                print(f"[{i}/{len(ISSUES)}] Error: {e}")
    else:
        # Check if gh CLI is available
        gh_available = subprocess.run(["which", "gh"], capture_output=True).returncode == 0
        if gh_available:
            print("Using 'gh' CLI to create issues...")
            for i, issue in enumerate(ISSUES, 1):
                cmd = [
                    "gh", "issue", "create",
                    "--repo", "Akash1510/Homies",
                    "--title", issue["title"],
                    "--body", issue["body"]
                ]
                for l in issue["labels"]:
                    cmd.extend(["--label", l])
                res = subprocess.run(cmd, capture_output=True, text=True)
                if res.returncode == 0:
                    print(f"[{i}/{len(ISSUES)}] Created: {res.stdout.strip()}")
                else:
                    print(f"[{i}/{len(ISSUES)}] Failed: {res.stderr.strip()[:120]}")
        else:
            print("Neither GITHUB_TOKEN nor 'gh' CLI authenticated.")
            print("Export GITHUB_TOKEN=<your_token> and run this script, or run with gh.")

if __name__ == "__main__":
    main()
