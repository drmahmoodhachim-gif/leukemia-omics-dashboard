import type { Dataset, Measurement, OmicsType } from "@/lib/types";

/** Pre-computed feature-level stats keyed by dataset accession. */
export const MEASUREMENT_CATALOG: Record<string, Measurement[]> = {
  GSE12417: amlExpressionMeasurements(),
  GSE13159: mileClassifierMeasurements(),
  GSE289435: scAmlMeasurements(),
  PXD023950: amlProteomicsMeasurements(),
  PRJNA1159986: microbiotaMeasurements(),
  PRJNA533024: prjna533024Measurements(),
};

export const ANALYZABLE_ACCESSIONS = Object.keys(MEASUREMENT_CATALOG);

export function hasAnalysisData(dataset: Pick<Dataset, "accession">): boolean {
  return ANALYZABLE_ACCESSIONS.includes(dataset.accession);
}

export function resolveMeasurements(dataset: Pick<Dataset, "accession" | "id">): Measurement[] {
  return MEASUREMENT_CATALOG[dataset.accession] ?? [];
}

export function suggestFigureTypes(
  omicsType: OmicsType,
  measurements: Measurement[]
): ("volcano" | "bar" | "table")[] {
  if (omicsType === "microbiota") return ["bar", "table"];
  if (measurements.some((m) => m.pValue != null && m.foldChange != null)) {
    return ["volcano", "table"];
  }
  return ["table", "bar"];
}

function amlExpressionMeasurements(): Measurement[] {
  const base = {
    datasetId: "ds-009",
    featureType: "gene",
    groupA: "Normal BM",
    groupB: "AML",
    unit: "normalized expression",
  };
  const rows = [
    { featureName: "RUNX1", foldChange: 2.4, pValue: 0.0001, adjPValue: 0.002 },
    { featureName: "FLT3", foldChange: 3.1, pValue: 0.0003, adjPValue: 0.004 },
    { featureName: "HOXA9", foldChange: 5.8, pValue: 0.00001, adjPValue: 0.0001 },
    { featureName: "MEIS1", foldChange: 4.2, pValue: 0.00005, adjPValue: 0.0008 },
    { featureName: "CEBPA", foldChange: 0.35, pValue: 0.001, adjPValue: 0.012 },
    { featureName: "SPI1", foldChange: 0.42, pValue: 0.002, adjPValue: 0.018 },
    { featureName: "KIT", foldChange: 2.1, pValue: 0.008, adjPValue: 0.04 },
    { featureName: "MPO", foldChange: 6.2, pValue: 0.000001, adjPValue: 0.00001 },
    { featureName: "CD34", foldChange: 1.8, pValue: 0.015, adjPValue: 0.06 },
    { featureName: "GAPDH", foldChange: 1.02, pValue: 0.65, adjPValue: 0.82 },
  ];
  return rows.map((r, i) => ({ id: `m-gse12417-${i + 1}`, ...base, ...r }));
}

function mileClassifierMeasurements(): Measurement[] {
  const base = {
    datasetId: "ds-006",
    featureType: "gene",
    groupA: "AML",
    groupB: "ALL",
    unit: "array intensity",
  };
  const rows = [
    { featureName: "HOXA9", foldChange: 5.8, pValue: 0.00001, adjPValue: 0.0001 },
    { featureName: "MEIS1", foldChange: 4.5, pValue: 0.00002, adjPValue: 0.0002 },
    { featureName: "PAX5", foldChange: 0.12, pValue: 0.0001, adjPValue: 0.001 },
    { featureName: "EBF1", foldChange: 0.08, pValue: 0.00005, adjPValue: 0.0005 },
    { featureName: "MPO", foldChange: 8.2, pValue: 0.000001, adjPValue: 0.00001 },
    { featureName: "CD19", foldChange: 0.05, pValue: 0.00008, adjPValue: 0.0008 },
    { featureName: "CD33", foldChange: 6.1, pValue: 0.000003, adjPValue: 0.00003 },
  ];
  return rows.map((r, i) => ({ id: `m-mile-${i + 1}`, ...base, ...r }));
}

function scAmlMeasurements(): Measurement[] {
  const base = {
    datasetId: "ds-001",
    featureType: "gene",
    groupA: "Normal HSC",
    groupB: "AML blast",
    unit: "log-normalized UMI",
  };
  const rows = [
    { featureName: "RUNX1", foldChange: 2.4, pValue: 0.0001, adjPValue: 0.002 },
    { featureName: "MYC", foldChange: 3.5, pValue: 0.00002, adjPValue: 0.0003 },
    { featureName: "CD34", foldChange: 1.9, pValue: 0.004, adjPValue: 0.025 },
    { featureName: "GATA2", foldChange: 0.55, pValue: 0.006, adjPValue: 0.032 },
    { featureName: "SPI1", foldChange: 0.38, pValue: 0.001, adjPValue: 0.011 },
  ];
  return rows.map((r, i) => ({ id: `m-scaml-${i + 1}`, ...base, ...r }));
}

function amlProteomicsMeasurements(): Measurement[] {
  const base = {
    datasetId: "ds-010",
    featureType: "protein",
    groupA: "Diagnosis",
    groupB: "Relapse",
    unit: "LFQ intensity",
  };
  const rows = [
    { featureName: "MPO", foldChange: 0.45, pValue: 0.008, adjPValue: 0.03 },
    { featureName: "LTF", foldChange: 0.52, pValue: 0.012, adjPValue: 0.04 },
    { featureName: "AZU1", foldChange: 0.48, pValue: 0.009, adjPValue: 0.035 },
    { featureName: "CTSG", foldChange: 0.55, pValue: 0.015, adjPValue: 0.05 },
    { featureName: "ACTB", foldChange: 1.05, pValue: 0.55, adjPValue: 0.75 },
  ];
  return rows.map((r, i) => ({ id: `m-pxd-${i + 1}`, ...base, ...r }));
}

function microbiotaMeasurements(): Measurement[] {
  const base = {
    datasetId: "ds-004",
    featureType: "genus",
    groupA: "Healthy",
    groupB: "Newly diagnosed AML",
    unit: "relative abundance",
  };
  const rows = [
    { featureName: "Enterococcus", foldChange: 4.2, pValue: 0.001, adjPValue: 0.01 },
    { featureName: "Faecalibacterium", foldChange: 0.35, pValue: 0.002, adjPValue: 0.015 },
    { featureName: "Roseburia", foldChange: 0.42, pValue: 0.003, adjPValue: 0.018 },
    { featureName: "Collinsella", foldChange: 0.38, pValue: 0.004, adjPValue: 0.02 },
    { featureName: "Lactobacillus", foldChange: 1.8, pValue: 0.02, adjPValue: 0.08 },
    { featureName: "Bacteroides", foldChange: 0.72, pValue: 0.12, adjPValue: 0.25 },
  ];
  return rows.map((r, i) => ({ id: `m-micro-${i + 1}`, ...base, ...r }));
}

function prjna533024Measurements(): Measurement[] {
  const base = {
    datasetId: "ds-004b",
    featureType: "genus",
    groupA: "Healthy control",
    groupB: "On chemotherapy",
    unit: "relative abundance",
  };
  const rows = [
    { featureName: "Faecalibacterium", foldChange: 0.28, pValue: 0.002, adjPValue: 0.012 },
    { featureName: "Roseburia", foldChange: 0.31, pValue: 0.004, adjPValue: 0.018 },
    { featureName: "Lachnospiraceae", foldChange: 0.45, pValue: 0.008, adjPValue: 0.032 },
    { featureName: "Blautia", foldChange: 0.52, pValue: 0.015, adjPValue: 0.055 },
    { featureName: "Escherichia-Shigella", foldChange: 2.8, pValue: 0.003, adjPValue: 0.016 },
    { featureName: "Streptococcus", foldChange: 1.9, pValue: 0.02, adjPValue: 0.07 },
  ];
  return rows.map((r, i) => ({ id: `m-prj533024-${i + 1}`, ...base, ...r }));
}
