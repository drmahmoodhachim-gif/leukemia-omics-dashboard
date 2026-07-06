import type { IngestRecord } from "./ingest-types";

/** Curated public leukemia omics portals, atlases, and reference datasets. */
const LEUKEMIA_RESOURCES: Omit<IngestRecord, "source" | "ingestedAt">[] = [
  {
    accession: "GSE289435",
    repository: "GEO",
    title: "Single-cell atlas of hematopoiesis and aberrant AML differentiation",
    summary:
      "318 AML samples mapped to a 55-state hematopoietic reference atlas; genotype-to-phenotype associations for 45+ drivers.",
    omicsType: "single_cell",
    species: "human",
    tissue: "bone_marrow",
    sampleCount: 318,
    platform: "10x Genomics 5'",
    phenotype: "AML subtypes vs normal hematopoiesis",
    url: "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE289435",
  },
  {
    accession: "GSE254718",
    repository: "GEO",
    title: "Multi-omics CLL microenvironment under ibrutinib",
    summary:
      "Longitudinal multi-omics of CLL patients on BTK inhibitor therapy; T cell and CLL cell adaptation.",
    omicsType: "transcriptomics",
    species: "human",
    tissue: "blood",
    platform: "Multi-omics",
    phenotype: "CLL ibrutinib longitudinal",
    url: "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE254718",
  },
  {
    accession: "GSE12417",
    repository: "GEO",
    title: "AML gene expression — TCGA-LAML cohort",
    summary:
      "Classic AML expression profiling used in risk stratification and biomarker discovery.",
    omicsType: "transcriptomics",
    species: "human",
    tissue: "bone_marrow",
    sampleCount: 542,
    platform: "Affymetrix U133",
    phenotype: "AML vs normal bone marrow",
    url: "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE12417",
  },
  {
    accession: "GSE13159",
    repository: "GEO",
    title: "MILE study — acute leukemia expression classifier",
    summary:
      "Large multi-center AML/ALL expression dataset for lineage and subtype classification.",
    omicsType: "microarray",
    species: "human",
    tissue: "bone_marrow",
    sampleCount: 1043,
    platform: "Affymetrix U133 Plus 2.0",
    phenotype: "AML, ALL, CML, MDS classification",
    url: "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE13159",
  },
  {
    accession: "GSE144561",
    repository: "GEO",
    title: "Pediatric ALL single-cell transcriptomics",
    summary:
      "scRNA-seq of diagnostic pediatric B-cell ALL with treatment response annotations.",
    omicsType: "single_cell",
    species: "human",
    tissue: "bone_marrow",
    platform: "10x Genomics",
    phenotype: "Pediatric B-ALL",
    url: "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE144561",
  },
  {
    accession: "TARGET-AML",
    repository: "TARGET",
    title: "Therapeutically Applicable Research to Generate Effective Treatments — AML",
    summary:
      "NCI-COG multi-omic pediatric AML program: WES, RNA-seq, miRNA, methylation, clinical data.",
    omicsType: "genomics",
    species: "human",
    tissue: "bone_marrow",
    platform: "Multi-omic",
    phenotype: "Pediatric and young adult AML",
    url: "https://ocg.cancer.gov/programs/target",
  },
  {
    accession: "BEAT-AML",
    repository: "Vizome",
    title: "Beat AML functional genomics and drug sensitivity",
    summary:
      "Primary AML ex vivo drug response with matched genomic and transcriptomic profiling.",
    omicsType: "transcriptomics",
    species: "human",
    tissue: "bone_marrow",
    sampleCount: 672,
    platform: "RNA-seq + ex vivo drug screen",
    phenotype: "AML drug sensitivity",
    url: "https://vizome.org/aml/",
  },
  {
    accession: "TCGA-LAML",
    repository: "GDC",
    title: "The Cancer Genome Atlas — Acute Myeloid Leukemia",
    summary:
      "WES, RNA-seq, miRNA, methylation, and clinical data for adult AML (GDC portal).",
    omicsType: "genomics",
    species: "human",
    tissue: "bone_marrow",
    sampleCount: 200,
    platform: "WES + RNA-seq",
    phenotype: "Adult AML",
    url: "https://portal.gdc.cancer.gov/projects/TCGA-LAML",
  },
  {
    accession: "AMLdb",
    repository: "AMLdb",
    title: "AMLdb multi-omics platform",
    summary:
      "Integrated AML resource: GEO expression/methylation, CRISPR screens, GDSC drug sensitivity.",
    omicsType: "genomics",
    species: "human",
    tissue: "bone_marrow",
    platform: "Multi-omic portal",
    phenotype: "AML biomarker discovery",
    url: "https://bioinfo.uth.edu/AMLdb/",
    doi: "10.1101/2023.05.19.541403",
  },
  {
    accession: "DepMap-AML",
    repository: "DepMap",
    title: "Cancer Dependency Map — leukemia cell lines",
    summary:
      "CRISPR dependency, omics, and drug sensitivity across AML and ALL cell lines.",
    omicsType: "genomics",
    species: "human",
    tissue: "blast",
    platform: "CRISPR + RNA-seq",
    phenotype: "Leukemia cell line dependencies",
    url: "https://depmap.org/portal/",
  },
  {
    accession: "PXD023950",
    repository: "PRIDE",
    title: "AML bone marrow proteome — diagnosis and relapse",
    summary:
      "Quantitative proteomics comparing diagnosis and relapse AML bone marrow samples.",
    omicsType: "proteomics",
    species: "human",
    tissue: "bone_marrow",
    platform: "LC-MS/MS",
    phenotype: "Diagnosis vs relapse",
    url: "https://www.ebi.ac.uk/pride/archive/projects/PXD023950",
  },
  {
    accession: "GSE17855",
    repository: "GEO",
    title: "CLL B-cell receptor signaling and microenvironment",
    summary:
      "Expression profiling of CLL cells in lymph node microenvironment vs peripheral blood.",
    omicsType: "transcriptomics",
    species: "human",
    tissue: "blood",
    platform: "Affymetrix",
    phenotype: "CLL microenvironment",
    url: "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE17855",
  },
];

export async function ingestLeukemiaResources(): Promise<IngestRecord[]> {
  const now = new Date().toISOString();
  return LEUKEMIA_RESOURCES.map((r) => ({
    ...r,
    source: "resources" as const,
    ingestedAt: now,
    summary: r.summary ?? `Curated leukemia resource: ${r.accession}`,
  }));
}
