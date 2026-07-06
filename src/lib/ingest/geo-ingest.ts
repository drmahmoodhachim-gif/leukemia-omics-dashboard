import type { IngestRecord } from "./ingest-types";
import { esearch, esummary } from "./ncbi-client";

const QUERIES = [
  "acute myeloid leukemia RNA-seq",
  "acute lymphoblastic leukemia transcriptome",
  "chronic lymphocytic leukemia single cell",
  "AML bone marrow scRNA-seq",
  "leukemia minimal residual disease MRD",
  "myelodysplastic syndrome RNA-seq",
  "leukemia epigenetics methylation",
  "FLT3 NPM1 AML genomics",
];

function inferOmics(title: string, summary: string): string {
  const t = `${title} ${summary}`.toLowerCase();
  if (t.includes("microbi") || t.includes("16s") || t.includes("metagenom")) return "microbiota";
  if (t.includes("single cell") || t.includes("single-cell") || t.includes("scrna"))
    return "single_cell";
  if (t.includes("proteom") || t.includes("mass spectrom")) return "proteomics";
  if (t.includes("methyl") || t.includes("epigen")) return "epigenomics";
  if (t.includes("metabolom")) return "metabolomics";
  if (t.includes("microarray") || t.includes("array")) return "microarray";
  if (t.includes("genome") || t.includes("exome") || t.includes("wgs") || t.includes("wes"))
    return "genomics";
  return "transcriptomics";
}

function inferTissue(title: string, summary: string): string {
  const t = `${title} ${summary}`.toLowerCase();
  if (t.includes("bone marrow") || t.includes("bonemarrow")) return "bone_marrow";
  if (t.includes("pbmc") || t.includes("peripheral blood")) return "pbmc";
  if (t.includes("blast") || t.includes("leukemia cell")) return "blast";
  if (t.includes("gut") || t.includes("fecal") || t.includes("intestinal")) return "gut";
  if (t.includes("blood")) return "blood";
  return "other";
}

function inferSpecies(title: string, summary: string): string {
  const t = `${title} ${summary}`.toLowerCase();
  if (/\b(mouse|mus musculus)\b/.test(t)) return "mouse";
  if (/\b(rat|rattus)\b/.test(t)) return "rat";
  return "human";
}

export async function ingestGeo(retmax = 25): Promise<IngestRecord[]> {
  const seen = new Set<string>();
  const records: IngestRecord[] = [];
  const now = new Date().toISOString();

  for (const query of QUERIES) {
    try {
      const ids = await esearch("gds", query, retmax);
      const summaries = await esummary("gds", ids);

      for (const id of ids) {
        const item = summaries[id];
        if (!item) continue;
        const accession = String(item.accession ?? item.gse ?? id);
        if (seen.has(accession)) continue;
        seen.add(accession);

        const title = String(item.title ?? "Untitled");
        const summary = String(item.summary ?? "");
        records.push({
          accession,
          repository: "GEO",
          title,
          summary,
          omicsType: inferOmics(title, summary),
          species: inferSpecies(title, summary),
          tissue: inferTissue(title, summary),
          sampleCount: Number(item.n_samples ?? item.samples ?? 0) || undefined,
          platform: String(item.platform ?? item.gpl ?? "") || undefined,
          pubdate: String(item.pdat ?? item.pubdate ?? "") || undefined,
          url: `https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=${accession}`,
          source: "geo",
          ingestedAt: now,
        });
      }
    } catch {
      /* skip failed query */
    }
  }

  return records;
}
