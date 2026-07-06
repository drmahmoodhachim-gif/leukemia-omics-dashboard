import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { ingestGeo } from "./geo-ingest";
import { ingestPride } from "./pride-ingest";
import { ingestPubMed } from "./pubmed-ingest";
import { ingestMicrobiota } from "./microbiota-ingest";
import { ingestLeukemiaResources } from "./leukemia-resources-ingest";
import type { IngestManifest, IngestRecord, PubMedRecord } from "./ingest-types";
import { mergeIngestedLibrary } from "./merge-library";
import { loadEnvFiles } from "./load-env";
import { hasNcbiApiKey } from "./ncbi-client";

const DATA_DIR = path.join(process.cwd(), "data");

export async function runFullIngest(): Promise<IngestManifest> {
  loadEnvFiles();
  const start = Date.now();
  const errors: string[] = [];
  await mkdir(DATA_DIR, { recursive: true });

  console.log("LeukemiaOmics Full Ingestion Pipeline");
  console.log("====================================");
  console.log(
    hasNcbiApiKey()
      ? "NCBI API key: loaded (10 req/s rate limit)"
      : "NCBI API key: not set — using 3 req/s. Add NCBI_API_KEY to .env.local"
  );
  console.log("");

  let geo: IngestRecord[] = [];
  let pride: IngestRecord[] = [];
  let microbiota: IngestRecord[] = [];
  let resources: IngestRecord[] = [];
  let pubmed: PubMedRecord[] = [];

  console.log("[1/5] GEO datasets...");
  try {
    geo = await ingestGeo();
    await writeFile(path.join(DATA_DIR, "geo-ingest.json"), JSON.stringify(geo, null, 2));
    console.log(`  ✓ ${geo.length} GEO datasets`);
  } catch (e) {
    errors.push(`GEO: ${e}`);
    console.error("  ✗ GEO failed:", e);
  }

  console.log("[2/5] PRIDE proteomics...");
  try {
    pride = await ingestPride();
    await writeFile(path.join(DATA_DIR, "pride-ingest.json"), JSON.stringify(pride, null, 2));
    console.log(`  ✓ ${pride.length} PRIDE projects`);
  } catch (e) {
    errors.push(`PRIDE: ${e}`);
    console.error("  ✗ PRIDE failed:", e);
  }

  console.log("[3/5] PubMed literature...");
  try {
    pubmed = await ingestPubMed();
    await writeFile(path.join(DATA_DIR, "pubmed-ingest.json"), JSON.stringify(pubmed, null, 2));
    console.log(`  ✓ ${pubmed.length} PubMed articles`);
  } catch (e) {
    errors.push(`PubMed: ${e}`);
    console.error("  ✗ PubMed failed:", e);
  }

  console.log("[4/5] Microbiota catalog...");
  try {
    microbiota = await ingestMicrobiota();
    await writeFile(path.join(DATA_DIR, "microbiota-ingest.json"), JSON.stringify(microbiota, null, 2));
    console.log(`  ✓ ${microbiota.length} microbiota entries`);
  } catch (e) {
    errors.push(`Microbiota: ${e}`);
    console.error("  ✗ Microbiota failed:", e);
  }

  console.log("[5/5] Leukemia resources atlas...");
  try {
    resources = await ingestLeukemiaResources();
    await writeFile(path.join(DATA_DIR, "resources-ingest.json"), JSON.stringify(resources, null, 2));
    console.log(`  ✓ ${resources.length} curated resources`);
  } catch (e) {
    errors.push(`Resources: ${e}`);
    console.error("  ✗ Resources failed:", e);
  }

  const allDatasets = [...geo, ...pride, ...microbiota, ...resources];
  const merged = mergeIngestedLibrary(allDatasets, pubmed);
  await writeFile(
    path.join(DATA_DIR, "library-merged.json"),
    JSON.stringify(merged, null, 2)
  );

  const manifest: IngestManifest = {
    lastRun: new Date().toISOString(),
    duration_ms: Date.now() - start,
    counts: {
      geo: geo.length,
      pride: pride.length,
      pubmed: pubmed.length,
      microbiota: microbiota.length,
      resources: resources.length,
      total_datasets: merged.datasets.length,
      total_publications: merged.publications.length,
    },
    errors,
    schedule: process.env.INGEST_SCHEDULE ?? "0 3 * * 0",
  };

  await writeFile(path.join(DATA_DIR, "ingest-manifest.json"), JSON.stringify(manifest, null, 2));

  console.log("\n====================================");
  console.log(`Done in ${(manifest.duration_ms / 1000).toFixed(1)}s`);
  console.log(`Merged library: ${manifest.counts.total_publications} pubs, ${manifest.counts.total_datasets} datasets`);
  if (errors.length) console.log(`Errors: ${errors.length}`);

  try {
    const { syncLibraryToSupabase } = await import("./sync-supabase");
    await syncLibraryToSupabase(manifest);
  } catch (e) {
    errors.push(`Supabase sync: ${e}`);
    console.error("  ✗ Supabase sync failed:", e);
  }

  return manifest;
}
