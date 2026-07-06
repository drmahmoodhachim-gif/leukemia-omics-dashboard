# LeukemiaOmics Resource Library

Standalone dashboard for **leukemia omics** — curated and automatically ingested public datasets, publications, microbiota studies, and analysis tools.

**Completely independent** from the SpermOmics project: separate codebase, Supabase schema (`leukemia_omics`), GitHub repo, and Netlify site.

## Features

- **Data sources:** GEO, PRIDE, PubMed, SRA gut microbiota studies, curated leukemia atlases (TARGET, Beat AML, TCGA-LAML, AMLdb, MILE, scRNA-seq references)
- **Research Planner:** hypothesis generation, dataset ranking, figure plans, validation suggestions
- **Analysis Workspace:** precomputed DE stats + live GEO/PRIDE raw analysis
- **Optional auth:** session cookie login when `AUTH_*` env vars are set
- **Supabase sync:** isolated `leukemia_omics` schema (optional)

## Quick start

```bash
cd LeukemiaOmics
npm install
npm run dev
```

Open http://localhost:3000

## Ingest public data

```bash
npm run ingest
```

Writes `data/*.json` and optionally syncs to Supabase if `SUPABASE_SERVICE_ROLE_KEY` is set.

## Environment (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_SCHEMA=leukemia_omics

# Optional server sync
SUPABASE_SERVICE_ROLE_KEY=

# Optional faster NCBI ingest
NCBI_API_KEY=

# Optional cron + auth
CRON_SECRET=
AUTH_SECRET=
AUTH_USERNAME=
AUTH_PASSWORD=
```

See `STANDALONE_DB.md` for Supabase setup and `DEPLOY.md` for Netlify/GitHub Actions.

## Deploy (new project)

1. Create a **new** Supabase project → run migrations in `supabase/migrations/`
2. Create a **new** GitHub repository → push this folder
3. Create a **new** Netlify site → link repo, set env vars
4. Do **not** reuse SpermOmics credentials, site IDs, or schema

## Developer

Dr. Mahmood Yaseen Hachim Al Mashhadani — MBRU, Dubai, UAE
