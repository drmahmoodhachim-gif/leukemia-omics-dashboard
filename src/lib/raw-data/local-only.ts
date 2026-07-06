import type { OmicsType } from "@/lib/types";

export interface RawFileLike {
  name: string;
  url: string;
  type: string;
  analyzable?: boolean;
}

export interface LocalOnlyAssessment {
  localOnly: boolean;
  reasons: string[];
  repositoryUrl?: string;
  mode?: "single_cell" | "bulk_raw" | "unknown";
}

const LOCAL_ONLY_ERROR =
  /RAW\.tar|No parseable quantification|Excel|scRNA|Seurat|RDS|only provide raw|local analysis|local DESeq2|ArrayExpress download failed|only raw IDAT|IDAT raw|single-cell object/i;

export function isLocalOnlyError(message: string | null | undefined): boolean {
  if (!message) return false;
  return LOCAL_ONLY_ERROR.test(message);
}

function isRawArchive(name: string): boolean {
  const lower = name.toLowerCase();
  if (/filelist\.txt$/i.test(lower)) return false;
  return (
    /_raw\.tar(\.gz)?$/.test(lower) ||
    (lower.endsWith(".tar") && lower.includes("raw")) ||
    (lower.endsWith(".tar.gz") && lower.includes("raw"))
  );
}

function isSpreadsheet(name: string): boolean {
  return /\.(xlsx|xls|ods)$/i.test(name);
}

function isSequencingRaw(name: string): boolean {
  return /\.(fastq|fq|bam|sam|cram)(\.gz|\.bz2)?$/i.test(name);
}

function isSingleCellObject(name: string): boolean {
  const lower = name.toLowerCase();
  return (
    lower.includes("seurat") ||
    lower.endsWith(".h5ad") ||
    lower.endsWith(".h5ad.gz") ||
    lower.endsWith(".rds") ||
    lower.endsWith(".rds.gz") ||
    lower.includes("singlecell") ||
    lower.includes("single_cell") ||
    lower.includes("scrna")
  );
}

function isIdatRaw(name: string): boolean {
  return /\.idat$/i.test(name);
}

export function inferLocalOnlyMode(
  files: RawFileLike[],
  omicsType?: OmicsType
): LocalOnlyAssessment["mode"] {
  if (omicsType === "single_cell") return "single_cell";
  if (files.some((f) => isSingleCellObject(f.name))) return "single_cell";
  if (files.some((f) => isRawArchive(f.name) || isSequencingRaw(f.name))) return "bulk_raw";
  return "unknown";
}

export function classifyRawFileAvailability(
  files: RawFileLike[],
  accession?: string,
  omicsType?: OmicsType
): LocalOnlyAssessment {
  const analyzable = files.filter((f) => f.analyzable);
  const repositoryUrl =
    files.find((f) => f.type === "other" && /geo|pride|arrayexpress|biostudies/i.test(f.url))
      ?.url ??
    files.find((f) => f.type === "other")?.url ??
    (accession?.startsWith("GSE")
      ? `https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=${accession}`
      : accession?.match(/^E-MTAB|^E-MEXP/i)
        ? `https://www.ebi.ac.uk/biostudies/arrayexpress/studies/${accession}`
        : undefined);

  const mode = inferLocalOnlyMode(files, omicsType);

  if (analyzable.length > 0) {
    return { localOnly: false, reasons: [], repositoryUrl, mode };
  }

  const reasons: string[] = [];
  if (files.length === 0) {
    reasons.push("Could not list files from repository");
  }
  for (const f of files) {
    if (isSingleCellObject(f.name) && !reasons.some((r) => r.includes("Seurat"))) {
      reasons.push("Seurat / single-cell object (.RDS, .h5ad) — needs local Seurat/Scanpy");
    }
    if (isRawArchive(f.name) && !reasons.some((r) => r.includes("RAW.tar"))) {
      const hasFilelistMerge = files.some(
        (x) => x.analyzable && /merged_per_sample|filelist/i.test(x.name)
      );
      if (!hasFilelistMerge) {
        reasons.push("RAW.tar only (raw FASTQ inside the archive)");
      }
    }
    if (isSpreadsheet(f.name) && !reasons.some((r) => r.includes("metadata"))) {
      reasons.push("Excel metadata only (sample sheet — pair with RDS for scRNA)");
    }
    if (isSequencingRaw(f.name) && !reasons.some((r) => r.includes("BAM/FASTQ"))) {
      reasons.push("BAM/FASTQ without processed counts");
    }
    if (isIdatRaw(f.name) && !reasons.some((r) => r.includes("IDAT"))) {
      reasons.push("Illumina IDAT raw files (.idat) — needs local preprocessing");
    }
  }

  if (mode === "single_cell" && !reasons.some((r) => r.includes("Seurat"))) {
    reasons.push("Single-cell study — no bulk count matrix on GEO");
  }

  return {
    localOnly: true,
    reasons:
      reasons.length > 0 ? reasons : ["No parseable quantification files for in-browser analysis"],
    repositoryUrl,
    mode,
  };
}
