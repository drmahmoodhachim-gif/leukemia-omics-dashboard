import { getDatasetsPage, getPublicationsPage, getMethods } from "@/lib/data/library";
import { resolveRawAccession, supportsRawAnalysis } from "@/lib/raw-data/accession";
import { hasAnalysisData } from "@/lib/analysis/catalog";
import { OMICS_LABELS, TISSUE_LABELS } from "@/lib/utils";
import type { Dataset, Method, Publication } from "@/lib/types";
import { getTemplate, RESEARCH_TEMPLATES } from "./templates";
import type {
  FigurePlan,
  ResearchPlan,
  ResearchTemplateId,
  ScoredDataset,
  ScoredPublication,
  ValidationSuggestion,
} from "./types";

const STOP = new Set(
  "a an the and or of in on for to with from by is are was were be been being this that these those it its at as vs versus between".split(
    " "
  )
);

const DOMAIN_TERMS: Record<string, string[]> = {
  proteomics: ["protein", "proteome", "proteomics", "mass", "spectrometry", "pxd"],
  transcriptomics: ["rna", "mrna", "transcript", "transcriptome", "rnaseq", "expression", "gse"],
  epigenomics: ["methylation", "epigenetic", "epigenomics", "450k", "epic", "dna"],
  single_cell: ["single", "cell", "scrna", "scrnaseq", "cluster", "blast", "hsc"],
  microbiota: ["microbiota", "microbiome", "gut", "16s", "metagenom", "scfa", "fecal", "intestinal", "butyrate", "faecalibacterium"],
  ffar: ["ffar", "ffar2", "ffar3", "gpr39", "hcar2", "butyrate", "scfa", "hdac", "immunogenic", "cold", "hot"],
  leukemia: ["aml", "all", "cll", "leukemia", "myeloid", "lymphoblastic", "mrd", "relapse", "remission"],
  genomics: ["wes", "wgs", "mutation", "flt3", "npm1", "target", "tcga", "genomic"],
};

function tokenize(text: string): string[] {
  return [...new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w))
  )];
}

function scoreText(text: string, tokens: string[]): { score: number; reasons: string[] } {
  const lower = text.toLowerCase();
  let score = 0;
  const reasons: string[] = [];

  for (const t of tokens) {
    if (lower.includes(t)) {
      score += 3;
      if (reasons.length < 3) reasons.push(`matches “${t}”`);
    }
  }

  for (const [domain, terms] of Object.entries(DOMAIN_TERMS)) {
    const hit = terms.some((term) => tokens.includes(term) && lower.includes(term));
    if (hit) {
      score += 4;
      reasons.push(domain.replace("_", " "));
    }
  }

  return { score, reasons: [...new Set(reasons)] };
}

function scorePublication(pub: Publication, tokens: string[]): ScoredPublication {
  const blob = [pub.title, pub.abstract, pub.keywords?.join(" "), pub.authors].filter(Boolean).join(" ");
  const { score, reasons } = scoreText(blob, tokens);
  return { ...pub, score, matchReasons: reasons };
}

function scoreDataset(ds: Dataset, tokens: string[]): ScoredDataset {
  const blob = [ds.title, ds.summary, ds.phenotype, ds.accession, ds.platform, ds.omicsType, ds.tissue].filter(
    Boolean
  ).join(" ");
  const { score, reasons } = scoreText(blob, tokens);

  let analysisUrl = `/analysis?study=${encodeURIComponent(ds.accession)}`;
  if (!hasAnalysisData(ds)) {
    const raw = resolveRawAccession(ds);
    if (raw) analysisUrl = `/analysis?study=${encodeURIComponent(raw)}&mode=raw`;
  }

  const rawAcc = resolveRawAccession(ds);
  return {
    ...ds,
    score: score + (hasAnalysisData(ds) ? 5 : supportsRawAnalysis(ds) ? 3 : 0),
    matchReasons: reasons,
    analysisUrl,
    rawAnalysisUrl: rawAcc ? `/analysis?study=${encodeURIComponent(rawAcc)}&mode=raw` : undefined,
  };
}

function inferFocus(tokens: string[], question: string): string {
  const joined = tokens.join(" ");
  if (/microbiota|microbiome|gut|16s|scfa/i.test(joined + question)) return "gut microbiota";
  if (/protein|proteom|pxd/i.test(joined + question)) return "leukemia proteome";
  if (/methyl|epigen/i.test(joined + question)) return "leukemia epigenome";
  if (/single.?cell|scrna|blast|hsc/i.test(joined + question)) return "leukemia cell states";
  if (/ffar|butyrate|scfa|gpr39|hcar2/i.test(joined + question)) return "FFAR/butyrate axis";
  if (/rna|transcript|gse/i.test(joined + question)) return "leukemia transcriptome";
  return "leukemia molecular profiles";
}

function inferCaseControl(question: string): { case: string; control: string; tissue: string } {
  const q = question.toLowerCase();
  let caseLabel = "leukemia patients";
  if (/aml|myeloid/.test(q)) caseLabel = "AML patients";
  if (/all|lymphoblastic/.test(q)) caseLabel = "ALL patients";
  if (/cll|lymphocytic/.test(q)) caseLabel = "CLL patients";
  if (/relapse/.test(q)) caseLabel = "relapsed leukemia";
  if (/remission|cr\b/.test(q)) caseLabel = "patients in remission";

  let tissue = "bone marrow";
  if (/pbmc|peripheral/.test(q)) tissue = "PBMC";
  if (/gut|microbiota|fecal|intestinal/.test(q)) tissue = "gut microbiota";
  if (/blood/.test(q)) tissue = "peripheral blood";

  return { case: caseLabel, control: "healthy donors or normal hematopoietic cells", tissue };
}

function buildHypothesis(
  templateId: ResearchTemplateId,
  question: string,
  tokens: string[]
): { hypothesis: string; aims: string[]; predictions: string[] } {
  const template = getTemplate(templateId);
  const { case: caseLabel, control, tissue } = inferCaseControl(question);
  const focus = inferFocus(tokens, question);

  const hypothesis = template.hypothesisStem
    .replace("{focus}", focus)
    .replace("{case}", caseLabel)
    .replace("{control}", control)
    .replace("{tissue}", tissue);

  const aims =
    templateId === "ffar_in_silico_year1"
      ? [
          "Analysis 1: FFAR2/3/4/HCAR2/GPR39 expression and EFS/OS in TARGET-AML/ALL (cBioPortal/Xena); Beat AML replication.",
          "Analysis 2: Promoter methylation vs expression for GPR39, IRF4, CCNA1, LAMA4 in TARGET-AML 450K data (minfi).",
          "Analysis 3: scRNA immunogenicity (GSE289435) — FFAR/AP genes across blast, T, myeloid; CIBERSORTx on bulk TARGET.",
          "Analysis 4: LINCS butyrate/HDACi signature projected onto TARGET; DepMap FFAR + HDAC dependency in NALM-6/MV4-11.",
          "Analysis 5: PRJNA533024 longitudinal 16S — butyrate-producer trajectories (QIIME2); UAE cohort for same-patient linkage.",
        ]
      : [
          `Curate and harmonize public datasets addressing: “${question.trim()}”.`,
          `Quantify differential features (${focus}) between ${caseLabel} and ${control}.`,
          `Interpret results with pathway and hematopoiesis/leukemia-focused functional analysis.`,
          `Draft publication-ready figures and propose experimental validation.`,
        ];

  const predictions =
    templateId === "ffar_in_silico_year1"
      ? [
          "FFAR-family somatic mutation frequency will be negligible in TARGET (epigenetic control premise).",
          "GPR39/IRF4/CCNA1/LAMA4 promoter methylation will anti-correlate with expression in independent TARGET-AML.",
          "Relapse-associated marrows will show lower immunogenicity scores (MHC-II down, exhaustion up) and lower FFAR-program activity.",
          "Butyrate-producer abundance will decline during chemotherapy in PRJNA533024, aligning with infection-risk windows.",
        ]
      : [
          `At least one public dataset in the library will show significant separation on PCA/volcano plots.`,
          `Top features will map to known leukemia genes (e.g., RUNX1, FLT3, HOXA9, NPM1) or microbiota markers when relevant.`,
          `Pathway enrichment will highlight hematopoietic differentiation, MYC signaling, or ribosome biogenesis when ${focus} is involved.`,
        ];

  return { hypothesis, aims, predictions };
}

function pickMethods(templateId: ResearchTemplateId, topDatasets: ScoredDataset[]): Method[] {
  const template = getTemplate(templateId);
  const all = getMethods();
  const omics = new Set(topDatasets.map((d) => d.omicsType));

  return all
    .filter((m) => {
      if (template.methodCategories.includes(m.category)) return true;
      if (omics.has("proteomics") && m.category === "Proteomics") return true;
      if (omics.has("transcriptomics") && m.category === "Transcriptomics") return true;
      if (omics.has("epigenomics") && m.category === "Epigenomics") return true;
      if (omics.has("single_cell") && m.category === "Single-cell Analysis") return true;
      if (omics.has("microbiota") && m.category === "Microbiota") return true;
      return false;
    })
    .slice(0, 4);
}

function buildMaterialsAndMethods(
  question: string,
  methods: Method[],
  datasets: ScoredDataset[]
): string {
  const accList = datasets.slice(0, 4).map((d) => d.accession).join(", ");
  const methodNames = methods.map((m) => m.name).join("; ");

  return [
    "Data sources. Public datasets were retrieved from the LeukemiaOmics Resource Library, integrating GEO, PRIDE, SRA microbiota studies, curated leukemia atlases, and PubMed.",
    `Study selection. Resources were ranked by relevance to the research question: “${question.trim()}”. Primary accessions: ${accList || "top-scoring library matches"}.`,
    `Computational analysis. ${methodNames || "Standard omics QC, normalization, and differential testing"} were applied following repository-specific best practices. Differential expression used Welch t-tests with Benjamini–Hochberg FDR correction (or DESeq2 for raw RNA-seq counts when analyzed locally).`,
    "Functional interpretation. Enriched pathways were assessed with curated hematopoiesis and leukemia gene sets and GO/KEGG databases. Figures were generated in the Analysis Workspace (volcano, PCA, heatmap, pathway plots).",
    "Reproducibility. Analysis parameters, accession IDs, and figure exports are documented for manuscript Methods sections.",
  ].join("\n\n");
}

function buildFfarYear1FigurePlan(): FigurePlan[] {
  return [
    {
      panel: "Prelim Fig. 1",
      figureType: "bar",
      title: "FFAR expression atlas + Kaplan–Meier survival",
      description:
        "TARGET-AML/ALL: FFAR2/3/4/HCAR2/GPR39 by subtype; EFS/OS by high/low expression; mutation frequency table. Portal: cBioPortal, Xena. Script: scripts/year1-prelim/01-ffar-portal-guide.md",
      suggestedDataset: "TARGET-AML",
    },
    {
      panel: "Prelim Fig. 2",
      figureType: "scatter",
      title: "Methylation silencing at candidate loci",
      description:
        "Promoter 450K β vs RNA for GPR39, IRF4, CCNA1, LAMA4 (TARGET-AML). Script: scripts/year1-prelim/02-methylation-silencing.R",
      suggestedDataset: "TARGET-AML",
    },
    {
      panel: "Prelim Fig. 3",
      figureType: "heatmap",
      title: "Cold-to-hot scRNA immunogenicity",
      description:
        "Dot plot FFAR/AP/exhaustion genes by compartment; immunogenicity score diagnosis vs relapse (GSE289435). Script: scripts/year1-prelim/03-scrna-immunogenicity.R",
      suggestedDataset: "GSE289435",
    },
    {
      panel: "Prelim Fig. 4",
      figureType: "scatter",
      title: "Butyrate signature + DepMap line selection",
      description:
        "LINCS butyrate score on TARGET tumors; DepMap FFAR + HDAC1/2/3 in NALM-6/MV4-11. Script: scripts/year1-prelim/04-butyrate-depmap.R",
      suggestedDataset: "BEAT-AML",
    },
    {
      panel: "Prelim Fig. 5",
      figureType: "bar",
      title: "Butyrate-producer depletion on treatment",
      description:
        "Faecalibacterium/Roseburia/Lachnospiraceae trajectory in PRJNA533024 longitudinal ALL 16S. Script: scripts/year1-prelim/05-microbiome-depletion.sh",
      suggestedDataset: "PRJNA533024",
    },
    {
      panel: "Table 1",
      figureType: "table",
      title: "In silico dataset map",
      description:
        "See docs/INSILICO_PRELIMINARY_STUDIES.md — accession, modality, aim de-risked, access route for all five analyses.",
    },
  ];
}

function buildFigurePlan(
  templateId: ResearchTemplateId,
  datasets: ScoredDataset[]
): FigurePlan[] {
  if (templateId === "ffar_in_silico_year1") return buildFfarYear1FigurePlan();

  const template = getTemplate(templateId);
  const primary = datasets[0];

  const descriptions: Record<string, (ds?: ScoredDataset) => FigurePlan> = {
    volcano: (ds) => ({
      panel: "Fig. 1A",
      figureType: "volcano",
      title: "Differential feature volcano plot",
      description: `Volcano plot of features significantly altered in ${ds?.phenotype ?? "case vs control"} (${ds?.accession ?? "primary dataset"}). X-axis: log2 fold-change; Y-axis: −log10(p). Label top leukemia candidates.`,
      suggestedDataset: ds?.accession,
    }),
    heatmap: (ds) => ({
      panel: "Fig. 1B",
      figureType: "heatmap",
      title: "Heatmap of top differential features",
      description: `Z-score heatmap of top 30 differential features across samples, grouped by disease status. Use to show consistency of ${OMICS_LABELS[ds?.omicsType ?? "transcriptomics"]} signal.`,
      suggestedDataset: ds?.accession,
    }),
    pca: (ds) => ({
      panel: "Fig. 1C",
      figureType: "pca",
      title: "PCA sample clustering",
      description: `Principal component analysis of ${TISSUE_LABELS[ds?.tissue ?? "bone_marrow"]} profiles colored by group. Report variance explained by PC1/PC2.`,
      suggestedDataset: ds?.accession,
    }),
    pathway: () => ({
      panel: "Fig. 2A",
      figureType: "pathway",
      title: "Pathway enrichment analysis",
      description:
        "Dot plot or bar chart of enriched GO/KEGG terms among significant features. Highlight hematopoiesis, MYC, and ribosome biogenesis pathways.",
    }),
    bar: (ds) => ({
      panel: "Fig. 2B",
      figureType: "bar",
      title: "Candidate biomarker abundance",
      description: `Bar chart comparing mean abundance of top candidate features between groups in ${ds?.accession ?? "selected cohort"}.`,
      suggestedDataset: ds?.accession,
    }),
    table: () => ({
      panel: "Table 1",
      figureType: "table",
      title: "Cohort and dataset summary",
      description:
        "Summary table: accession, omics type, tissue, species, sample size, platform, and comparison groups for all datasets used.",
    }),
    scatter: () => ({
      panel: "Fig. 3A",
      figureType: "scatter",
      title: "Cross-omics correlation",
      description:
        "Scatter plot correlating RNA and protein log2FC (or MRD score vs molecular feature) for matched features where multi-omics data exist.",
    }),
    venn: () => ({
      panel: "Fig. 3B",
      figureType: "venn",
      title: "Overlap of significant features",
      description:
        "Venn diagram of significant genes/proteins shared across independent cohorts to prioritize robust biomarkers.",
    }),
  };

  return template.defaultFigures.map((ft, i) => {
    const factory = descriptions[ft] ?? descriptions.table;
    const plan = factory(primary);
    if (i > 0 && plan.panel.startsWith("Fig. 1")) {
      plan.panel = plan.panel.replace("Fig. 1", "Fig. 2");
    }
    return plan;
  });
}

function buildValidations(
  templateId: ResearchTemplateId,
  datasets: ScoredDataset[],
  question: string
): ValidationSuggestion[] {
  const omics = datasets[0]?.omicsType ?? "transcriptomics";
  const tissue = datasets[0]?.tissue ?? "bone_marrow";
  const validations: ValidationSuggestion[] = [];

  validations.push({
    type: "in_vitro",
    title: "Leukemia cell line / primary sample assays",
    rationale: `Validate top molecular hits from ${omics} analysis using leukemia model systems.`,
    readouts: [
      "Flow cytometry for blast markers (CD34, CD33, CD19) and MRD panels",
      "RT-qPCR or digital PCR for fusion transcripts and driver mutations",
      "Ex vivo drug sensitivity (Beat AML-style) for top candidates",
      "Colony-forming unit (CFU) assays in primary bone marrow samples",
    ],
  });

  if (/microbiota|microbiome|gut|scfa/i.test(question) || tissue === "gut") {
    validations.push({
      type: "in_vivo",
      title: "Microbiota intervention cohort",
      rationale: "Confirm gut dysbiosis and SCFA changes in an independent leukemia cohort.",
      readouts: [
        "16S or shotgun metagenomics at diagnosis and post-chemotherapy",
        "Short-chain fatty acid quantification (GC-MS)",
        "Correlation with infection episodes and treatment toxicity",
        "Optional: FMT or probiotic intervention pilot",
      ],
    });
  } else {
    validations.push({
      type: "in_vivo",
      title: "Independent clinical cohort replication",
      rationale: "Test generalizability of biomarkers in a new leukemia vs remission cohort.",
      readouts: [
        "Prospective bone marrow or PBMC collection with clinical annotation",
        "qRT-PCR or targeted proteomics for top 3–5 candidates",
        "ROC analysis for MRD/diagnosis performance (AUC, sensitivity/specificity)",
        "Relapse-free survival association if longitudinal data available",
      ],
    });
  }

  if (templateId === "biomarker_discovery" || /biomarker|panel|diagnostic|mrd/i.test(question)) {
    validations.push({
      type: "in_vitro",
      title: "CRISPR / pharmacologic validation",
      rationale: "Establish causality for top ranked genes in leukemia models.",
      readouts: [
        "CRISPR knockout in AML/ALL cell lines (DepMap dependency confirmation)",
        "Viability and apoptosis readouts post-knockdown",
        "Rescue with wild-type or inhibitor rescue experiments",
      ],
    });
  }

  if (datasets.some((d) => d.species === "mouse")) {
    validations.push({
      type: "in_vivo",
      title: "Mouse leukemia model validation",
      rationale: "Use syngeneic or PDX models to validate conserved mechanisms.",
      readouts: [
        "MLL-AF9 or BCR-ABL transplant models for candidate gene perturbation",
        "Bone marrow engraftment and blast counts",
        "Survival and MRD monitoring by flow cytometry",
      ],
    });
  }

  return validations.slice(0, 4);
}

export async function generateResearchPlan(opts: {
  question: string;
  templateId: ResearchTemplateId;
}): Promise<ResearchPlan> {
  const { question, templateId } = opts;
  const tokens = tokenize(question);
  const template = getTemplate(templateId);

  const [pubPage, dsPage] = await Promise.all([
    getPublicationsPage({ limit: 500 }),
    getDatasetsPage({ limit: 2000 }),
  ]);

  const publications = pubPage.rows
    .map((p) => scorePublication(p, tokens))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const datasets = dsPage.rows
    .map((d) => scoreDataset(d, tokens))
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  const fallbackPubs = publications.length
    ? publications
    : pubPage.rows.slice(0, 4).map((p) => ({ ...p, score: 1, matchReasons: ["library showcase"] }));
  const fallbackDs = datasets.length
    ? datasets
    : dsPage.rows
        .filter((d) => hasAnalysisData(d) || supportsRawAnalysis(d))
        .slice(0, 5)
        .map((d) => scoreDataset(d, tokens.length ? tokens : ["leukemia", "aml"]));

  const { hypothesis, aims, predictions } = buildHypothesis(templateId, question, tokens);
  const methodsUsed = pickMethods(templateId, fallbackDs);
  const figurePlan = buildFigurePlan(templateId, fallbackDs);
  const validations = buildValidations(templateId, fallbackDs, question);

  const analysisLinks = [
    ...(templateId === "ffar_in_silico_year1"
      ? [
          {
            label: "Year-1 in silico plan (proposal doc)",
            href: "https://github.com/drmahmoodhachim-gif/leukemia-omics-dashboard/blob/master/docs/INSILICO_PRELIMINARY_STUDIES.md",
          },
        ]
      : []),
    ...fallbackDs.slice(0, 3).map((d) => ({
      label: `Analyze ${d.accession}`,
      href: d.analysisUrl,
    })),
    ...fallbackDs
      .filter((d) => d.rawAnalysisUrl && d.rawAnalysisUrl !== d.analysisUrl)
      .slice(0, 2)
      .map((d) => ({
        label: `Raw data: ${d.accession}`,
        href: d.rawAnalysisUrl!,
      })),
  ];

  return {
    question,
    templateId,
    templateLabel: template.label,
    hypothesis,
    specificAims: aims,
    predictions,
    publications: fallbackPubs,
    datasets: fallbackDs,
    materialsAndMethods: buildMaterialsAndMethods(question, methodsUsed, fallbackDs),
    methodsUsed: methodsUsed.map((m) => ({ id: m.id, name: m.name, category: m.category })),
    figurePlan,
    validations,
    analysisLinks,
  };
}

export { RESEARCH_TEMPLATES };
