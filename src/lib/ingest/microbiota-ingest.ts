import type { IngestRecord } from "./ingest-types";
import { esearch, esummary } from "./ncbi-client";

/** Curated gut/oral microbiota studies linked to leukemia treatment or diagnosis. */
const CURATED: Omit<IngestRecord, "source" | "ingestedAt">[] = [
  {
    accession: "PRJNA914091",
    repository: "SRA",
    title: "Intestinal microbiota in acute leukemia survivors after intensive chemotherapy",
    summary:
      "Metagenomic profiling of rectal swabs from outpatients recovered from AML/ALL/MDS vs healthy controls. Scientific Reports 2024.",
    omicsType: "microbiota",
    species: "human",
    tissue: "gut",
    sampleCount: 40,
    platform: "Illumina metagenomics",
    phenotype: "Post-chemotherapy remission vs control",
    url: "https://www.ncbi.nlm.nih.gov/bioproject/PRJNA914091",
    doi: "10.1038/s41598-024-56054-w",
  },
  {
    accession: "PRJNA1159986",
    repository: "SRA",
    title: "Gut microbiota and SCFAs in newly diagnosed AML",
    summary:
      "16S/metagenomic and metabolomic profiling comparing newly diagnosed AML patients with healthy controls. Frontiers in Microbiology 2025.",
    omicsType: "microbiota",
    species: "human",
    tissue: "gut",
    sampleCount: 40,
    platform: "16S + metagenomics",
    phenotype: "Newly diagnosed AML vs healthy",
    url: "https://www.ncbi.nlm.nih.gov/bioproject/PRJNA1159986",
    doi: "10.3389/fmicb.2025.1559033",
  },
  {
    accession: "PRJNA704438",
    repository: "SRA",
    title: "Gut microbiome dysbiosis during AML induction chemotherapy",
    summary:
      "Longitudinal stool microbiome in AML patients undergoing induction therapy.",
    omicsType: "microbiota",
    species: "human",
    tissue: "gut",
    platform: "16S rRNA sequencing",
    phenotype: "Induction chemotherapy time course",
    url: "https://www.ncbi.nlm.nih.gov/bioproject/PRJNA704438",
  },
  {
    accession: "PRJNA562842",
    repository: "SRA",
    title: "Oral and gut microbiota in pediatric ALL",
    summary:
      "Microbiota composition in children with acute lymphoblastic leukemia during therapy.",
    omicsType: "microbiota",
    species: "human",
    tissue: "gut",
    platform: "16S rRNA sequencing",
    phenotype: "Pediatric ALL on therapy",
    url: "https://www.ncbi.nlm.nih.gov/bioproject/PRJNA562842",
  },
  {
    accession: "GSE227809",
    repository: "GEO",
    title: "Fecal microbiota transplantation restores gut barrier in AML",
    summary:
      "Metagenomic and host transcriptomic response to FMT in AML patients with gut dysbiosis.",
    omicsType: "microbiota",
    species: "human",
    tissue: "gut",
    platform: "Shotgun metagenomics",
    phenotype: "AML + FMT intervention",
    url: "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE227809",
  },
];

const SEARCH_QUERIES = [
  "leukemia gut microbiota metagenomics",
  "acute myeloid leukemia microbiome 16S",
  "ALL chemotherapy intestinal microbiota",
  "hematopoietic stem cell transplant gut microbiome",
];

function inferTissue(title: string, summary: string): string {
  const t = `${title} ${summary}`.toLowerCase();
  if (t.includes("gut") || t.includes("intestinal") || t.includes("fecal") || t.includes("stool"))
    return "gut";
  if (t.includes("oral") || t.includes("saliva")) return "gut";
  return "gut";
}

export async function ingestMicrobiota(retmax = 15): Promise<IngestRecord[]> {
  const now = new Date().toISOString();
  const seen = new Set(CURATED.map((r) => r.accession));
  const records: IngestRecord[] = CURATED.map((r) => ({
    ...r,
    tissue: r.tissue ?? inferTissue(r.title, r.summary ?? ""),
    source: "microbiota" as const,
    ingestedAt: now,
  }));

  for (const query of SEARCH_QUERIES) {
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
        const blob = `${title} ${summary}`.toLowerCase();
        if (!blob.includes("microbi") && !blob.includes("16s") && !blob.includes("metagenom"))
          continue;

        records.push({
          accession,
          repository: "GEO",
          title,
          summary,
          omicsType: "microbiota",
          species: "human",
          tissue: inferTissue(title, summary),
          sampleCount: Number(item.n_samples ?? item.samples ?? 0) || undefined,
          platform: String(item.platform ?? item.gpl ?? "") || undefined,
          url: `https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=${accession}`,
          source: "microbiota",
          ingestedAt: now,
        });
      }
    } catch {
      /* skip failed query */
    }
  }

  return records;
}
