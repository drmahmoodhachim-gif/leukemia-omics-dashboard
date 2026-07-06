import type { Metadata } from "next";

const SITE = "LeukemiaOmics Resource Library";

export function pageMetadata(
  title: string,
  description: string,
  opts?: { path?: string }
): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE}`,
      description,
      url: opts?.path,
    },
  };
}

export const PAGE_DESCRIPTIONS = {
  overview:
    "Curated leukemia omics library — publications, datasets, analysis workspace, and publication-ready figures from GEO, PRIDE, SRA, and PubMed.",
  publications: "Browse 300+ indexed leukemia publications from PubMed and curated seed records.",
  datasets:
    "Explore 200+ public leukemia omics datasets — GEO, PRIDE, microbiota, TARGET, Beat AML, and reference atlases.",
  analysis:
    "Run differential expression and build volcano, PCA, and heatmap figures from public GEO and repository data.",
  research:
    "Generate hypothesis-driven research plans with matched publications, datasets, and figure outlines.",
  figures:
    "Publication-ready leukemia figures with SVG, PNG, and PDF export for manuscripts and proposals.",
  methods:
    "Standardized protocols for leukemia transcriptomics, proteomics, single-cell, microbiota, and pathway analysis.",
  ingest:
    "Automated ingestion status for GEO, PubMed, PRIDE, and microbiota pipelines feeding the resource library.",
  search: "Full-text search across publications, datasets, and methods in the LeukemiaOmics library.",
} as const;
