# ATHNIC CLOTHING — E-Commerce Platform

> **Catch the vibe. Join the tribe.** Raw, unapologetic Indian streetwear for Gen Z.

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Django 4.2 + Django REST Framework |
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Admin | Django Admin + Jazzmin theme |
| Auth | JWT (SimpleJWT) |
| Payments | Razorpay |

## 📁 Project Structure

```
Athnic Clothing/
├── backend/               # Django backend
│   ├── backend/           # Django project settings
│   ├── store/             # Products, categories, coupons
│   ├── accounts/          # User auth, shipping addresses
│   ├── orders/            # Orders, cart, payments
│   └── manage.py
├── frontend/              # Next.js frontend
│   └── src/
│       ├── app/           # App Router pages
│       ├── components/    # Shared components
│       └── lib/           # API client
└── .env.example
```

## 🚀 Local Development

You can now run services from the root directory using the following commands:

-   `npm run frontend` — Starts the Next.js dev server.
-   `npm run backend` — Starts the Django dev server.
-   `npm run install:all` — Installs both frontend and backend dependencies.

### Manual Setup (Traditional)

#### Backend

```bash
cd backend
pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py runserver
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

### Environment Variables

Copy `.env.example` to `.env` and fill in:
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — Get from [Razorpay Dashboard](https://dashboard.razorpay.com/)
- `DJANGO_SECRET_KEY` — Generate a secure key for production

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/` | Product list (filters, search, pagination) |
| GET | `/api/products/<slug>/` | Product detail |
| GET | `/api/products/featured/` | Featured products |
| GET | `/api/categories/` | All categories |
| POST | `/api/cart/add/` | Add to cart |
| GET | `/api/cart/` | Get cart |
| POST | `/api/orders/create/` | Create Razorpay order |
| POST | `/api/orders/verify/` | Verify payment |
| POST | `/api/auth/register/` | Register |
| POST | `/api/auth/login/` | Login |
| POST | `/api/newsletter/subscribe/` | Newsletter signup |

## 🔑 Default Admin Credentials

- **Username:** admin
- **Password:** admin123

⚠️ Change these in production!

## 📄 License

Private — Athnic Clothing © 2026
