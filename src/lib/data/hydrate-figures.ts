import type { Figure } from "@/lib/types";
import { measurementsToVolcano } from "@/lib/analysis/build-figure";
import { figures, getMeasurementsForDataset } from "./seed";

function mileHeatmapData() {
  const genes = ["HOXA9", "MEIS1", "PAX5", "MPO", "CD19", "CD33"];
  const samples = ["AML-1", "AML-2", "ALL-1", "ALL-2", "CML-1", "MDS-1"];
  const groups = ["AML", "AML", "ALL", "ALL", "CML", "MDS"];
  const cells = genes.flatMap((gene, gi) =>
    samples.map((sample, si) => ({
      gene,
      sample,
      value: Math.sin((gi + 1) * (si + 2)) * 1.8,
      group: groups[si],
    }))
  );
  return { genes, samples, cells, min: -2, max: 2 };
}

function beatAmlHeatmapData() {
  const genes = ["Venetoclax", "Quizartinib", "Midostaurin", "Cytarabine", "Azacitidine"];
  const samples = ["Sample A", "Sample B", "Sample C", "Sample D"];
  const cells = genes.flatMap((gene, gi) =>
    samples.map((sample, si) => ({
      gene,
      sample,
      value: -Math.log10(0.05 + ((gi * 3 + si * 2) % 7) * 0.08),
      group: "AUC",
    }))
  );
  return { genes, samples, cells, min: 0.5, max: 2.5 };
}

/** Ensure gallery figures have renderable chart data (seed entries may omit `data`). */
export function hydrateFigure(figure: Figure): Figure {
  if (figure.data && Object.keys(figure.data).length > 0) return figure;

  switch (figure.id) {
    case "fig-001": {
      const ms = getMeasurementsForDataset("ds-001");
      const volcanoSource =
        ms.length >= 5
          ? ms
          : [
              { id: "m-v1", datasetId: "ds-001", featureName: "RUNX1", featureType: "gene" as const, groupA: "AML blast", groupB: "Normal HSC", foldChange: 2.4, pValue: 0.0001, adjPValue: 0.002 },
              { id: "m-v2", datasetId: "ds-001", featureName: "FLT3", featureType: "gene" as const, groupA: "AML blast", groupB: "Normal HSC", foldChange: 3.1, pValue: 0.0003, adjPValue: 0.004 },
              { id: "m-v3", datasetId: "ds-001", featureName: "HOXA9", featureType: "gene" as const, groupA: "AML blast", groupB: "Normal HSC", foldChange: 5.8, pValue: 0.00001, adjPValue: 0.0001 },
              { id: "m-v4", datasetId: "ds-001", featureName: "MEIS1", featureType: "gene" as const, groupA: "AML blast", groupB: "Normal HSC", foldChange: 4.2, pValue: 0.00005, adjPValue: 0.0008 },
              { id: "m-v5", datasetId: "ds-001", featureName: "CEBPA", featureType: "gene" as const, groupA: "AML blast", groupB: "Normal HSC", foldChange: 0.35, pValue: 0.001, adjPValue: 0.012 },
              { id: "m-v6", datasetId: "ds-001", featureName: "SPI1", featureType: "gene" as const, groupA: "AML blast", groupB: "Normal HSC", foldChange: 0.42, pValue: 0.002, adjPValue: 0.018 },
              { id: "m-v7", datasetId: "ds-001", featureName: "MPO", featureType: "gene" as const, groupA: "AML blast", groupB: "Normal HSC", foldChange: 6.2, pValue: 0.000001, adjPValue: 0.00001 },
              { id: "m-v8", datasetId: "ds-001", featureName: "GAPDH", featureType: "gene" as const, groupA: "AML blast", groupB: "Normal HSC", foldChange: 1.02, pValue: 0.65, adjPValue: 0.82 },
            ];
      return { ...figure, data: { points: measurementsToVolcano(volcanoSource) } };
    }
    case "fig-002":
      return { ...figure, data: mileHeatmapData() };
    case "fig-003":
      return {
        ...figure,
        data: {
          categories: [
            { name: "Shannon (survivors)", count: 2.1 },
            { name: "Shannon (controls)", count: 3.4 },
            { name: "Observed ASV (survivors)", count: 142 },
            { name: "Observed ASV (controls)", count: 218 },
          ],
        },
      };
    case "fig-004":
      return { ...figure, data: beatAmlHeatmapData() };
    case "fig-005":
      return {
        ...figure,
        data: {
          points: [
            { x: -2.8, y: 1.2, group: "Normal HSC", sample: "HSC-1" },
            { x: -3.1, y: 0.9, group: "Normal HSC", sample: "HSC-2" },
            { x: 2.6, y: -1.1, group: "FLT3-ITD", sample: "AML-F1" },
            { x: 3.0, y: -0.8, group: "FLT3-ITD", sample: "AML-F2" },
            { x: 1.8, y: 1.4, group: "NPM1-mut", sample: "AML-N1" },
            { x: 2.1, y: 1.6, group: "NPM1-mut", sample: "AML-N2" },
            { x: -0.5, y: -2.2, group: "Complex karyotype", sample: "AML-C1" },
          ],
          variance: { pc1: 28, pc2: 14 },
        },
      };
    default:
      return figure;
  }
}

export function getHydratedFigures(): Figure[] {
  return figures.map(hydrateFigure);
}
