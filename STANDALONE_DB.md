# LeukemiaOmics — standalone Supabase database

Use a **new Supabase project** (not the SpermOmics project).

## Schema

All tables live in the isolated schema **`leukemia_omics`**:

- `publications`, `datasets`, `methods`, `figures`, `measurements`, `ingest_manifest`
- RPC: `leukemia_omics.dashboard_stats()`
- Public read RLS; writes via service role only

## Setup

1. Create project at https://supabase.com/dashboard
2. SQL Editor → run migrations in order:
   - `supabase/migrations/001_leukemia_omics_standalone.sql`
   - `supabase/migrations/002_bulk_upsert_rpc.sql`
   - `supabase/migrations/20260703_performance.sql`
3. Copy URL + anon key + service role to `.env.local`
4. Set `NEXT_PUBLIC_SUPABASE_SCHEMA=leukemia_omics`

## Sync data

```bash
npm run ingest
npm run sync:supabase
npm run db:verify
```
