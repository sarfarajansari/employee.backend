## Employee Backend Service

This repository contains the backend service for the Verto employee demo app. It's a small Express + TypeORM service that stores employee records in a SQLite database and exposes a simple REST API consumed by the frontend.

Frontend repo: https://github.com/sarfarajansari/employee.frontend

## Key backend features

1. CRUD APIs for employee
2. TypeORM + SQLite DB to store data
3. 100% test coverage & data validation
4. Data validation

### Tech stack

- Node.js + Express (TypeScript)
- TypeORM (SQLite)
- Jest + Supertest for tests



---------------------------------

## Getting started

Clone, install, and run the app in development:

```bash
git clone https://github.com/sarfarajansari/employee.backend
cd employee.backend
npm install
npm run dev
```


## Testing

- Unit and integration tests live under `src/` as `.spec.ts` files and are run with Jest and Supertest. The test script in this repo already runs coverage and will create a coverage report.Current test coverage is 100%





## Quick summary

- Entry: `src/index.ts`
- Router: `src/routes/employee.router.ts` mounted at `/api/employees`
- Controller: `src/controllers/employee.controller.ts`
- Service: `src/services/employee.service.ts` (uses TypeORM repository)
- Model / Entity: `src/models/employee.ts`
- Data source: `src/connector/dataSource.ts` (SQLite)




## API Reference

Base URL: http://localhost:8000 (or the PORT set in environment)

All endpoints are under `/api/employees`.

1) Create employee

- POST /api/employees
- Body (json):

```json
{
	"name": "Jane Doe",
	"email_address": "jane@example.com",
	"position": "Software Engineer",
	"department": "Engineering",
	"status": "active"
}
```

- Success: 201 Created — returns created employee JSON (including id, created_at, updated_at)

2) Get all employees

- GET /api/employees
- Success: 200 OK — returns array of employees ordered by `updated_at` descending

3) Get single employee

- GET /api/employees/:id
- Success: 200 OK — returns employee object
- Failure: 404 Not Found — when id does not exist

4) Update employee

- PUT /api/employees/:id
- Body: same shape as create
- Success: 200 OK — returns updated employee
- Failure: 400 Bad Request (invalid body), 404 Not Found (id not found)

5) Delete employee

- DELETE /api/employees/:id
- Success: 204 No Content
- Failure: 404 Not Found

Notes

- Controllers validate that the request body contains `name`, `email_address`, and `position` as strings. Email uniqueness is enforced at the DB level.
- Error responses use JSON in the shape: `{ "error": "message" }`.

---------------------------------

## Data model (Employee)

Fields (TypeORM entity `src/models/employee.ts`):

- id: number (PrimaryGeneratedColumn)
- name: string (max 120)
- email_address: string (max 150, unique)
- position: text
- department: text
- status: text
- created_at: Date (CreateDateColumn)
- updated_at: Date (UpdateDateColumn)

---------------------------------

## Scripts (from package.json)

- `npm run dev` — start development server (ts-node-dev)
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run compiled app (`node dist/index.js`)
- `npm test` — run tests (Jest) with coverage

---------------------------------

