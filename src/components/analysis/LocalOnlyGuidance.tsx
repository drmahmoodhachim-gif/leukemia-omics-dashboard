import { AlertCircle, BarChart3, Download, Terminal } from "lucide-react";
import type { OmicsType } from "@/lib/types";

const YEAR1_SCRNA_SCRIPT =
  "https://github.com/drmahmoodhachim-gif/leukemia-omics-dashboard/blob/master/scripts/year1-prelim/03-scrna-immunogenicity.R";

export function LocalOnlyGuidance({
  accession,
  reasons,
  repositoryUrl,
  omicsType,
  hasCatalogAnalysis = false,
  compact = false,
}: {
  accession: string;
  reasons?: string[];
  repositoryUrl?: string;
  omicsType?: OmicsType;
  /** Published-findings tab has curated panels for this accession */
  hasCatalogAnalysis?: boolean;
  compact?: boolean;
}) {
  const isSingleCell =
    omicsType === "single_cell" ||
    reasons?.some((r) => /seurat|single-cell|\.rds|h5ad/i.test(r));

  const geoUrl =
    repositoryUrl ??
    (accession.startsWith("GSE")
      ? `https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=${accession}`
      : undefined);

  const bullets = reasons?.length
    ? reasons
    : isSingleCell
      ? [
          "Seurat RDS object (processed scRNA-seq counts + metadata)",
          "Excel sample metadata — not a bulk expression matrix",
        ]
      : [
          "RAW.tar only (raw FASTQ)",
          "Excel / Seurat objects (.xlsx, single-cell)",
          "BAM/FASTQ without processed counts",
        ];

  return (
    <div
      className={
        compact
          ? "rounded-xl border border-amber-200 bg-amber-50/80 p-4"
          : "rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/50 p-6 shadow-sm"
      }
    >
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h4 className="font-semibold text-amber-950">
              {isSingleCell
                ? "Single-cell study — use Seurat locally"
                : "This study cannot be analyzed in the browser"}
            </h4>
            <p className="mt-1 text-sm text-amber-900/90">
              <span className="font-mono font-medium">{accession}</span>
              {isSingleCell ? (
                <>
                  {" "}
                  distributes a Seurat RDS and sample metadata, not a bulk count matrix. Netlify
                  cannot run in-browser differential expression on single-cell objects.
                </>
              ) : (
                <>
                  {" "}
                  only provides file formats that Netlify cannot parse for inline differential
                  expression.
                </>
              )}
            </p>
          </div>

          {hasCatalogAnalysis && (
            <div className="rounded-lg border border-teal-200 bg-teal-50/80 px-3 py-2 text-sm text-teal-950">
              <p className="flex items-start gap-2 font-medium">
                <BarChart3 className="mt-0.5 h-4 w-4 shrink-0" />
                You can still use <strong>Published findings</strong> for this accession — curated
                gene panels and summary figures are available without downloading raw files.
              </p>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
              What won&apos;t work in-browser
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-amber-950/90">
              {bullets.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
              {isSingleCell ? "Recommended workflow" : "For those, use"}
            </p>
            <ul className="mt-2 space-y-2 text-sm text-amber-950/90">
              <li className="flex items-start gap-2">
                <Download className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Download the{" "}
                  <strong>Seurat RDS</strong> and <strong>metadata .xlsx</strong> from the file
                  list below
                  {geoUrl && (
                    <>
                      {" "}
                      or{" "}
                      <a
                        href={geoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary underline-offset-2 hover:underline"
                      >
                        NCBI GEO
                      </a>
                    </>
                  )}
                </span>
              </li>
              {isSingleCell ? (
                <li className="flex items-start gap-2">
                  <Terminal className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Local Seurat: adapt{" "}
                    <a
                      href={YEAR1_SCRNA_SCRIPT}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary underline-offset-2 hover:underline"
                    >
                      scripts/year1-prelim/03-scrna-immunogenicity.R
                    </a>{" "}
                    — load the RDS, annotate compartments, map FFAR / immunogenicity genes (Year-1
                    Prelim Fig. 3)
                  </span>
                </li>
              ) : (
                <li className="flex items-start gap-2">
                  <Terminal className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Local DESeq2: run{" "}
                    <code className="rounded bg-amber-100/80 px-1.5 py-0.5 font-mono text-xs">
                      npm run analyze:deseq2
                    </code>{" "}
                    with a count matrix and sample sheet after extracting files locally
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
