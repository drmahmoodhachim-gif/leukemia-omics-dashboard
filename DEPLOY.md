# Deploy: GitHub + Netlify + Supabase (LeukemiaOmics)

## New project only

This app must **not** share infrastructure with SpermOmics:

| Resource | LeukemiaOmics | Do NOT reuse |
|----------|---------------|--------------|
| GitHub repo | New repository | sperm-omics-dashboard |
| Supabase | New project, schema `leukemia_omics` | kgstszoegfruakzuhvtd / sperm_omics |
| Netlify site | New site | sperm-omics-dashboard |

## Auto-deploy (GitHub Actions → Netlify)

Pushes to `master` run `.github/workflows/netlify-deploy.yml`:

1. Build on GitHub-hosted runners with `AUTH_*` from GitHub secrets (inlined via `next.config.ts`)
2. `netlify deploy --prod --build` publishes to your **new** Netlify site

Required GitHub secrets: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`, `AUTH_SECRET`, `AUTH_USERNAME`, `AUTH_PASSWORD`

## Netlify environment variables (production)

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | **New** Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Anon key from new project |
| `NEXT_PUBLIC_SUPABASE_SCHEMA` | Yes | `leukemia_omics` |
| `CRON_SECRET` | Yes | For `/api/cron/ingest` |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Server-side ingest sync |
| `NCBI_API_KEY` | Optional | Faster GEO/PubMed ingest |
| `AUTH_SECRET` | Optional | Login protection |
| `AUTH_USERNAME` / `AUTH_PASSWORD` | Optional | Approved user |

## Supabase setup

```bash
# Apply migrations in Supabase SQL editor or CLI
# supabase/migrations/001_leukemia_omics_standalone.sql
npm run sync:supabase   # after ingest, with service role key
npm run db:verify
```
