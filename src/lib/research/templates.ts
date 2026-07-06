import type { ResearchTemplate } from "./types";

export const RESEARCH_TEMPLATES: ResearchTemplate[] = [
  {
    id: "differential_expression",
    label: "Differential expression (case vs control)",
    description:
      "Compare molecular profiles between leukemia blasts and normal hematopoietic cells or remission vs relapse.",
    hypothesisStem:
      "We hypothesize that {focus} exhibits a reproducible molecular signature distinguishing {case} from {control}, detectable by bulk or single-cell omics.",
    defaultFigures: ["volcano", "heatmap", "pca", "table"],
    methodCategories: ["Transcriptomics", "Proteomics", "Functional Analysis"],
  },
  {
    id: "biomarker_discovery",
    label: "Biomarker discovery & validation",
    description:
      "Identify candidate RNA, protein, or MRD markers for diagnosis, risk stratification, or relapse prediction.",
    hypothesisStem:
      "We hypothesize that a compact panel of {focus} biomarkers in {tissue} can stratify {case} with sufficient sensitivity for clinical decision-making.",
    defaultFigures: ["volcano", "bar", "table", "heatmap"],
    methodCategories: ["Transcriptomics", "Proteomics", "Clinical Assays"],
  },
  {
    id: "mechanism_pathway",
    label: "Mechanism & pathway analysis",
    description:
      "Explain leukemia phenotypes through enriched pathways, differentiation blocks, or signaling cascades.",
    hypothesisStem:
      "We hypothesize that {focus} dysregulation converges on conserved hematopoietic and leukemia hallmark pathways (e.g., HOX, MYC, MAPK, ribosome biogenesis).",
    defaultFigures: ["pathway", "heatmap", "volcano", "bar"],
    methodCategories: ["Functional Analysis", "Transcriptomics", "Proteomics"],
  },
  {
    id: "cross_omics",
    label: "Cross-omics integration",
    description:
      "Integrate transcriptomic, proteomic, epigenomic, and/or microbiota layers in leukemia cohorts.",
    hypothesisStem:
      "We hypothesize that discordance between {focus} RNA and protein abundance reveals post-transcriptional regulation or microenvironment effects in {case}.",
    defaultFigures: ["scatter", "venn", "heatmap", "table"],
    methodCategories: ["Transcriptomics", "Proteomics", "Microbiota", "Functional Analysis"],
  },
  {
    id: "clinical_association",
    label: "Clinical phenotype association",
    description:
      "Link treatment response, MRD status, or transplant outcomes to molecular or microbiota readouts.",
    hypothesisStem:
      "We hypothesize that {focus} in {tissue} correlates with clinical leukemia subtypes ({case}) and predicts treatment response.",
    defaultFigures: ["pca", "bar", "table", "scatter"],
    methodCategories: ["Single-cell Analysis", "Transcriptomics", "Clinical Assays"],
  },
  {
    id: "microbiota_leukemia",
    label: "Microbiota & treatment toxicity",
    description:
      "Relate gut microbiome composition, SCFAs, or dysbiosis to chemotherapy, HSCT, or infection risk in leukemia.",
    hypothesisStem:
      "We hypothesize that {focus} gut microbiota profiles modulate treatment tolerance and infection risk in {case} beyond standard clinical predictors.",
    defaultFigures: ["bar", "table", "scatter", "heatmap"],
    methodCategories: ["Microbiota", "Functional Analysis", "Clinical Assays"],
  },
  {
    id: "mrd_monitoring",
    label: "MRD & relapse prediction",
    description:
      "Minimal residual disease detection and molecular predictors of relapse in AML or ALL.",
    hypothesisStem:
      "We hypothesize that {focus} molecular MRD signatures in {tissue} predict relapse earlier than conventional flow cytometry in {case}.",
    defaultFigures: ["bar", "table", "volcano", "scatter"],
    methodCategories: ["Clinical Assays", "Transcriptomics", "Single-cell Analysis"],
  },
  {
    id: "ffar_in_silico_year1",
    label: "FFAR / butyrate in silico Year-1 (public data)",
    description:
      "De-risk FFAR–butyrate–immunogenicity aims using TARGET, Beat AML, scRNA, LINCS/DepMap, and pediatric microbiome cohorts before UAE primary sampling.",
    hypothesisStem:
      "We hypothesize that {focus} FFAR-axis and butyrate-responsive programs are epigenetically silenced in cold, relapse-prone pediatric leukemias, with concordant gut butyrate-producer depletion on treatment — testable in public COG/TARGET data before same-patient UAE linkage.",
    defaultFigures: ["bar", "scatter", "heatmap", "table"],
    methodCategories: [
      "Transcriptomics",
      "Epigenomics",
      "Single-cell Analysis",
      "Microbiota",
      "Functional Analysis",
    ],
  },
];

export function getTemplate(id: string) {
  return RESEARCH_TEMPLATES.find((t) => t.id === id) ?? RESEARCH_TEMPLATES[0];
}
