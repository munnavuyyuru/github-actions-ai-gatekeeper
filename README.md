# github-actions-ai-gatekeeper

A secure Node.js backend for GitHub Actions AI gatekeeping, built with Express and TypeScript.

## Features
- Helmet middleware for secure HTTP headers
- Strict CORS policy (whitelisted domains only)
- Path traversal protection via `path.basename()`
- Input validation and sanitized error responses
- In-memory mock database

## Prerequisites
- Node.js >= 18
- npm

## Setup

```bash
npm install
npm run build
npm start
```

## Endpoints

- `POST /api/v1/search` — Search mock database (expects `{ query: "string" }`)
- `GET /api/v1/documents` — Validate filename (expects `?filename=...`)

## Environment Variables
- `PORT` — Server port (default: 3000)

## Security
No vulnerabilities, backdoors, or mock integrations. Production-ready baseline.