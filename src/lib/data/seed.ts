import type {
  Dataset,
  Figure,
  Measurement,
  Method,
  Publication,
} from "../types";

export const publications: Publication[] = [
  {
    id: "pub-001",
    pmid: "38451234",
    title: "Single-cell transcriptional atlas of hematopoiesis in AML",
    authors: "van Galen P, et al.",
    journal: "Cell",
    year: 2025,
    abstract:
      "Reference atlas of human hematopoiesis mapped to 318 AML samples revealing recurrent aberrant differentiation states and genotype-phenotype associations.",
    keywords: ["AML", "single-cell", "hematopoiesis", "GSE289435"],
    url: "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE289435",
  },
  {
    id: "pub-002",
    title: "Multi-omics CLL microenvironment under ibrutinib",
    authors: "CLL Research Consortium",
    journal: "Nature Communications",
    year: 2024,
    abstract:
      "Longitudinal multi-omics of CLL patients on BTK inhibition reveals T cell reprogramming and early resistance mechanisms.",
    keywords: ["CLL", "ibrutinib", "multi-omics", "GSE254718"],
    url: "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE254718",
  },
  {
    id: "pub-003",
    doi: "10.1038/s41598-024-56054-w",
    title:
      "Intestinal microbiota in acute leukemia survivors after intensive chemotherapy",
    authors: "Multiple authors",
    journal: "Scientific Reports",
    year: 2024,
    abstract:
      "Metagenomic profiling of gut microbiota in AML/ALL survivors post-chemotherapy vs healthy controls (PRJNA914091).",
    keywords: ["microbiota", "AML", "chemotherapy", "PRJNA914091"],
    url: "https://doi.org/10.1038/s41598-024-56054-w",
  },
  {
    id: "pub-004",
    doi: "10.3389/fmicb.2025.1559033",
    title: "Gut microbiota and SCFAs in newly diagnosed AML",
    authors: "Multiple authors",
    journal: "Frontiers in Microbiology",
    year: 2025,
    abstract:
      "Enterococcus enrichment and reduced SCFAs in newly diagnosed AML; PRJNA1159986 metagenomic and metabolomic data.",
    keywords: ["microbiota", "AML", "SCFA", "Enterococcus"],
    url: "https://www.frontiersin.org/journals/microbiology/articles/10.3389/fmicb.2025.1559033/full",
  },
  {
    id: "pub-005",
    title: "Beat AML: ex vivo drug sensitivity in primary AML",
    authors: "Tyner JW, et al.",
    journal: "Cancer Cell",
    year: 2018,
    abstract:
      "Functional genomics and ex vivo drug response profiling of primary AML samples with matched molecular data.",
    keywords: ["Beat AML", "drug sensitivity", "Vizome"],
    url: "https://vizome.org/aml/",
    citationCount: 890,
  },
  {
    id: "pub-006",
    title: "AMLdb: comprehensive multi-omics platform for AML",
    authors: "AMLdb Consortium",
    journal: "bioRxiv",
    year: 2023,
    abstract:
      "Integrated AML resource linking GEO expression, methylation, CRISPR screens, and GDSC drug sensitivity.",
    keywords: ["AMLdb", "multi-omics", "biomarkers"],
    url: "https://bioinfo.uth.edu/AMLdb/",
    doi: "10.1101/2023.05.19.541403",
  },
  {
    id: "pub-007",
    title: "MILE study: acute leukemia expression classifier",
    authors: "Haferlach T, et al.",
    journal: "Blood",
    year: 2010,
    abstract:
      "Multi-center microarray classifier distinguishing AML, ALL, CML, and MDS (GSE13159).",
    keywords: ["MILE", "AML", "ALL", "classifier"],
    url: "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE13159",
  },
  {
    id: "pub-008",
    title: "TARGET-AML: NCI pediatric AML multi-omic program",
    authors: "NCI TARGET",
    journal: "Cancer Research",
    year: 2012,
    abstract:
      "Therapeutically Applicable Research to Generate Effective Treatments for pediatric AML with WES, RNA-seq, and clinical data.",
    keywords: ["TARGET", "pediatric AML", "WES"],
    url: "https://ocg.cancer.gov/programs/target",
  },
];

export const datasets: Dataset[] = [
  {
    id: "ds-001",
    publicationId: "pub-001",
    accession: "GSE289435",
    repository: "GEO",
    title: "scRNA-seq atlas of AML aberrant differentiation",
    omicsType: "single_cell",
    species: "human",
    tissue: "bone_marrow",
    sampleCount: 318,
    platform: "10x Genomics 5'",
    phenotype: "AML vs normal hematopoiesis",
    url: "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE289435",
  },
  {
    id: "ds-002",
    publicationId: "pub-002",
    accession: "GSE254718",
    repository: "GEO",
    title: "Multi-omics CLL under ibrutinib",
    omicsType: "transcriptomics",
    species: "human",
    tissue: "blood",
    platform: "Multi-omics",
    phenotype: "CLL longitudinal BTKi",
    url: "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE254718",
  },
  {
    id: "ds-003",
    publicationId: "pub-003",
    accession: "PRJNA914091",
    repository: "SRA",
    title: "Gut microbiota in leukemia survivors post-chemotherapy",
    omicsType: "microbiota",
    species: "human",
    tissue: "gut",
    sampleCount: 40,
    platform: "Metagenomics",
    phenotype: "Remission vs healthy control",
    url: "https://www.ncbi.nlm.nih.gov/bioproject/PRJNA914091",
  },
  {
    id: "ds-004",
    publicationId: "pub-004",
    accession: "PRJNA1159986",
    repository: "SRA",
    title: "Newly diagnosed AML gut microbiota and SCFAs",
    omicsType: "microbiota",
    species: "human",
    tissue: "gut",
    sampleCount: 40,
    platform: "16S + metagenomics",
    phenotype: "Newly diagnosed AML",
    url: "https://www.ncbi.nlm.nih.gov/bioproject/PRJNA1159986",
  },
  {
    id: "ds-005",
    publicationId: "pub-005",
    accession: "BEAT-AML",
    repository: "Vizome",
    title: "Beat AML primary sample drug sensitivity",
    omicsType: "transcriptomics",
    species: "human",
    tissue: "bone_marrow",
    sampleCount: 672,
    platform: "RNA-seq + ex vivo screen",
    phenotype: "Drug response heterogeneity",
    url: "https://vizome.org/aml/",
  },
  {
    id: "ds-006",
    publicationId: "pub-007",
    accession: "GSE13159",
    repository: "GEO",
    title: "MILE acute leukemia expression classifier",
    omicsType: "microarray",
    species: "human",
    tissue: "bone_marrow",
    sampleCount: 1043,
    platform: "Affymetrix U133 Plus 2.0",
    phenotype: "AML/ALL/CML/MDS classification",
    url: "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE13159",
  },
  {
    id: "ds-007",
    publicationId: "pub-008",
    accession: "TARGET-AML",
    repository: "TARGET",
    title: "TARGET pediatric AML multi-omic cohort",
    omicsType: "genomics",
    species: "human",
    tissue: "bone_marrow",
    platform: "WES + RNA-seq",
    phenotype: "Pediatric AML",
    url: "https://ocg.cancer.gov/programs/target",
  },
  {
    id: "ds-008",
    accession: "TCGA-LAML",
    repository: "GDC",
    title: "TCGA acute myeloid leukemia cohort",
    omicsType: "genomics",
    species: "human",
    tissue: "bone_marrow",
    sampleCount: 200,
    platform: "WES + RNA-seq",
    phenotype: "Adult AML",
    url: "https://portal.gdc.cancer.gov/projects/TCGA-LAML",
  },
  {
    id: "ds-009",
    accession: "GSE12417",
    repository: "GEO",
    title: "AML gene expression — TCGA-LAML array subset",
    omicsType: "transcriptomics",
    species: "human",
    tissue: "bone_marrow",
    sampleCount: 542,
    platform: "Affymetrix U133",
    phenotype: "AML risk stratification",
    url: "https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE12417",
  },
  {
    id: "ds-010",
    accession: "PXD023950",
    repository: "PRIDE",
    title: "AML bone marrow proteome diagnosis vs relapse",
    omicsType: "proteomics",
    species: "human",
    tissue: "bone_marrow",
    platform: "LC-MS/MS",
    phenotype: "Diagnosis vs relapse",
    url: "https://www.ebi.ac.uk/pride/archive/projects/PXD023950",
  },
];

export const methods: Method[] = [
  {
    id: "meth-001",
    name: "Bulk RNA-seq differential expression (DESeq2)",
    category: "Transcriptomics",
    description: "Negative binomial GLM for AML vs control or remission vs relapse contrasts.",
    protocol:
      "1. Align reads (STAR) or use provided counts\n2. Filter low-count genes\n3. DESeq2 design ~ condition\n4. BH-adjusted p < 0.05, |log2FC| > 1",
    software: ["DESeq2", "STAR", "R"],
    parameters: { padj: 0.05, log2fc: 1 },
    references: ["Love MI et al., Genome Biology, 2014"],
  },
  {
    id: "meth-002",
    name: "Single-cell clustering (Seurat)",
    category: "Single-cell Analysis",
    description: "Standard Seurat workflow for bone marrow scRNA-seq in AML/ALL.",
    protocol:
      "QC → NormalizeData → FindVariableFeatures → ScaleData → PCA → FindNeighbors → FindClusters → UMAP",
    software: ["Seurat", "R"],
    references: ["Hao Y et al., Cell, 2021"],
  },
  {
    id: "meth-003",
    name: "16S / metagenomic microbiota profiling",
    category: "Microbiota",
    description: "Gut microbiome analysis for leukemia patients during therapy.",
    protocol:
      "DADA2 or QIIME2 denoising → taxonomy assignment → alpha/beta diversity → differential abundance (ANCOM-BC)",
    software: ["QIIME2", "DADA2", "ANCOM-BC"],
    references: ["Bolyen E et al., Nature Biotechnology, 2019"],
  },
  {
    id: "meth-004",
    name: "MRD monitoring by flow / molecular assay",
    category: "Clinical Assays",
    description: "Minimal residual disease detection workflows for AML and ALL.",
    protocol:
      "Flow cytometry (LAIP) or RT-qPCR/digital PCR for fusion transcripts; threshold 0.1% for AML MRD",
    software: ["FlowJo", "BD FACSDiva"],
    parameters: { mrd_threshold: 0.001 },
  },
  {
    id: "meth-005",
    name: "Proteomics label-free quantification",
    category: "Proteomics",
    description: "LFQ pipeline for bone marrow or PBMC proteomics in leukemia.",
    protocol: "MaxQuant LFQ → Perseus t-test → GO/KEGG enrichment",
    software: ["MaxQuant", "Perseus"],
  },
  {
    id: "meth-006",
    name: "Pathway enrichment (GSEA / fgsea)",
    category: "Functional Analysis",
    description: "Gene set enrichment for leukemia hallmark and MSigDB hematopoiesis sets.",
    protocol: "Rank genes by log2FC → fgsea with MSigDB H, C2, and HSC signatures",
    software: ["fgsea", "clusterProfiler", "R"],
  },
];

export const figures: Figure[] = [
  {
    id: "fig-001",
    publicationId: "pub-001",
    datasetId: "ds-001",
    title: "Volcano: AML blast vs normal HSC",
    figureType: "volcano",
    caption: "Differential expression in AML blast cells compared to normal hematopoietic stem cells.",
    isPublicationReady: true,
  },
  {
    id: "fig-002",
    datasetId: "ds-006",
    title: "MILE leukemia subtype classifier heatmap",
    figureType: "heatmap",
    caption: "Expression heatmap distinguishing AML, ALL, CML, and MDS in the MILE cohort.",
    isPublicationReady: true,
  },
  {
    id: "fig-003",
    datasetId: "ds-003",
    title: "Gut microbiota diversity: AML survivors vs controls",
    figureType: "bar",
    caption: "Alpha diversity (Shannon index) in post-chemotherapy leukemia survivors.",
    isPublicationReady: true,
  },
  {
    id: "fig-004",
    datasetId: "ds-005",
    title: "Beat AML drug sensitivity landscape",
    figureType: "heatmap",
    caption: "Ex vivo AUC matrix across primary AML samples and targeted agents.",
    isPublicationReady: true,
  },
  {
    id: "fig-005",
    datasetId: "ds-001",
    title: "AML single-cell UMAP by genetic driver",
    figureType: "pca",
    caption: "UMAP embedding colored by recurrent AML driver mutations.",
    isPublicationReady: true,
  },
];

export const measurements: Measurement[] = [
  {
    id: "m-001",
    datasetId: "ds-001",
    featureName: "RUNX1",
    featureType: "gene",
    groupA: "AML blast",
    groupB: "Normal HSC",
    foldChange: 2.4,
    pValue: 0.0001,
    adjPValue: 0.002,
  },
  {
    id: "m-002",
    datasetId: "ds-001",
    featureName: "FLT3",
    featureType: "gene",
    groupA: "FLT3-ITD AML",
    groupB: "FLT3-WT",
    foldChange: 3.1,
    pValue: 0.0003,
    adjPValue: 0.004,
  },
  {
    id: "m-003",
    datasetId: "ds-004",
    featureName: "Enterococcus",
    featureType: "genus",
    groupA: "Newly diagnosed AML",
    groupB: "Healthy",
    foldChange: 4.2,
    pValue: 0.001,
    adjPValue: 0.01,
  },
  {
    id: "m-004",
    datasetId: "ds-010",
    featureName: "MPO",
    featureType: "protein",
    groupA: "Diagnosis",
    groupB: "Relapse",
    foldChange: 0.45,
    pValue: 0.008,
    adjPValue: 0.03,
  },
  {
    id: "m-005",
    datasetId: "ds-006",
    featureName: "HOXA9",
    featureType: "gene",
    groupA: "AML",
    groupB: "ALL",
    foldChange: 5.8,
    pValue: 0.00001,
    adjPValue: 0.0001,
  },
];

export function getPublicationById(id: string) {
  return publications.find((p) => p.id === id);
}

export function getDatasetById(id: string) {
  return datasets.find((d) => d.id === id);
}

export function getMethodById(id: string) {
  return methods.find((m) => m.id === id);
}

export function getFiguresForDataset(datasetId: string) {
  return figures.filter((f) => f.datasetId === datasetId);
}

export function getMeasurementsForDataset(datasetId: string) {
  return measurements.filter((m) => m.datasetId === datasetId);
}

export function getDatasetsForPublication(publicationId: string) {
  return datasets.filter((d) => d.publicationId === publicationId);
}

export function searchLibrary(query: string) {
  const q = query.toLowerCase();
  return {
    publications: publications.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.authors.toLowerCase().includes(q) ||
        p.keywords?.some((k) => k.toLowerCase().includes(q))
    ),
    datasets: datasets.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.accession.toLowerCase().includes(q) ||
        d.phenotype?.toLowerCase().includes(q)
    ),
    methods: methods.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
    ),
  };
}

export function getDashboardStats() {
  const omicsCounts = datasets.reduce(
    (acc, d) => {
      acc[d.omicsType] = (acc[d.omicsType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const yearCounts = publications.reduce(
    (acc, p) => {
      acc[p.year] = (acc[p.year] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  const tissueCounts = datasets.reduce(
    (acc, d) => {
      acc[d.tissue] = (acc[d.tissue] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalPublications: publications.length,
    totalDatasets: datasets.length,
    totalMethods: methods.length,
    totalFigures: figures.length,
    omicsBreakdown: Object.entries(omicsCounts).map(([type, count]) => ({
      type: type as Dataset["omicsType"],
      count,
    })),
    yearBreakdown: Object.entries(yearCounts)
      .map(([year, count]) => ({ year: Number(year), count }))
      .sort((a, b) => a.year - b.year),
    tissueBreakdown: Object.entries(tissueCounts).map(([tissue, count]) => ({
      tissue: tissue as Dataset["tissue"],
      count,
    })),
  };
}
