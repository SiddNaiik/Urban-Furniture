# Urban-Furniture

A full-stack business accounting platform for managing contacts, products, sales, purchases, invoices, payments, double-entry journal entries, budgets, and real-time financial reports (Balance Sheet, Profit & Loss).

**Features:**
- **Contacts:** Manage customers and suppliers.
- **Products:** Catalog, pricing and inventory basics.
- **Sales & Purchases:** Orders, invoices, and payments flow.
- **Accounting:** Double-entry journal entries, journals, and reporting.
- **Dashboard:** Real-time financial summaries and charts.

**Tech Stack:**
- **Backend:** Python (FastAPI), SQLAlchemy, Alembic for migrations.
- **Frontend:** Next.js (React + TypeScript).
- **Dev tooling:** Docker Compose for local development (optional).

**Prerequisites:**
- Python 3.10+ (for backend)
- Node.js 16+ / npm (for frontend)
- Docker & Docker Compose (optional, recommended)
- A running database (Postgres, or the one you configure via env)

**Quickstart (local, recommended):**

1. Clone the repo

	git clone <repo-url>

2. Run with Docker Compose (recommended)

	docker compose up --build

	- This will build and run both `backend` and `frontend` services if configured in `docker-compose.yml`.

3. Backend (manual)

	cd backend
	python -m venv .venv
	source .venv/bin/activate
	pip install -r requirements.txt
	# set environment variables such as DATABASE_URL
	alembic upgrade head
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

4. Frontend (manual)

	cd frontend
	npm install
	npm run dev

	- Open http://localhost:3000 for the frontend and http://localhost:8000/docs for backend API docs (Swagger/OpenAPI) by default.

**Database & Migrations:**
- Migrations are managed with Alembic located in `backend/alembic`.
- Update `DATABASE_URL` environment variable and run `alembic upgrade head` after making schema changes.

**Running Tests:**
- Backend tests: `cd backend && pytest` (requires test dependencies)

**Contributing:**
- Create feature branches, add tests for new functionality, open a PR with a clear description.

**Where to look:**
- Backend code: backend/app
- Frontend code: frontend/src

If you'd like, I can also add example `.env` files, a contributor guide, or update the `frontend/README.md` and `backend/README.md` with more detailed commands.
