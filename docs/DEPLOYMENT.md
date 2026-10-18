# Deployment

BellGrinda has two independently deployable parts:

- `apps/web`: the installable React PWA;
- `apps/api`: the optional sync API and PostgreSQL persistence layer.

The PWA remains useful without the API. The API is for safe backup and future multi-device synchronization, not for keeping an active workout running.

## Recommended hosting

| Part | Host | Why |
| --- | --- | --- |
| PWA | Cloudflare Pages | Global static delivery for the PWA shell, icons, and exercise media. |
| API and database | Railway | One GitHub-connected Node service plus managed PostgreSQL, matching the Express and Drizzle implementation. |

## Deploy the API on Railway

1. Create a Railway project from the GitHub repository.
2. Add a PostgreSQL service in that project.
3. Add the API service from the repository root. Railway reads `railway.toml` to build and run `@bellgrinda/api`.
4. Set these API variables:

   ```text
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   NODE_ENV=production
   CORS_ORIGIN=https://YOUR-PWA-DOMAIN
   LOCAL_USER_ID=00000000-0000-4000-8000-000000000001
   ```

5. Run the initial migration from the Railway service shell:

   ```bash
   npm run db:migrate --workspace @bellgrinda/api
   ```

6. Generate a Railway public domain and verify:

   ```text
   https://YOUR-API-DOMAIN/api/v1/health
   https://YOUR-API-DOMAIN/api/v1/health/ready
   ```

`/health` confirms the service is alive. `/health/ready` additionally checks PostgreSQL.

## Deploy the PWA on Cloudflare Pages

Connect the same GitHub repository and configure:

```text
Build command: npm ci && npm run build --workspace @bellgrinda/web
Build output: apps/web/dist
Node version: 22
```

Once the PWA has an API client, set its public API base URL to the Railway domain and update `CORS_ORIGIN` on Railway to the Pages URL. Do not put `DATABASE_URL` or other server credentials into Pages variables.

## Before opening accounts to users

The current API uses one configured development identity (`LOCAL_USER_ID`) only so the first sync flow can be exercised. Replace it with real account authentication before collecting other people’s training data. Add authenticated user IDs to every query, use HTTPS-only production domains, enable PostgreSQL backups, and set a custom email provider before enabling account sign-up.
