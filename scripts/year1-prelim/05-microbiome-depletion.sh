#!/usr/bin/env bash
# Analysis 5 — Butyrate-producer depletion across pediatric ALL treatment (PRJNA533024)
# QIIME2 / DADA2 skeleton — produces abundance trajectories for proposal Figure 5
#
# Usage:
#   bash scripts/year1-prelim/05-microbiome-depletion.sh
#
# Requires: conda QIIME2 amplicon environment OR standalone DADA2 in R

set -euo pipefail

PROJECT="PRJNA533024"
WORKDIR="data/year1-prelim/prjna533024"
OUT="data/year1-prelim/output"
MANIFEST="${WORKDIR}/sample-metadata.tsv"

mkdir -p "${WORKDIR}/raw" "${WORKDIR}/qiime2" "${OUT}"

echo "=== Analysis 5: ${PROJECT} ==="

if [[ ! -f "${MANIFEST}" ]]; then
  cat > "${MANIFEST}" <<'EOF'
# TSV: sample-id	forward-absolute-filepath	reverse-absolute-filepath	timepoint	subject	infection
# Example rows (fill after SRA download):
# SRRxxxx	/path/to_R1.fastq.gz	/path/to_R2.fastq.gz	pre_chemo	P001	0
# SRRyyyy	/path/to_R1.fastq.gz	/path/to_R2.fastq.gz	mid_chemo	P001	1
EOF
  echo "Created template ${MANIFEST} — download SRA reads first:"
  echo "  prefetch ${PROJECT} && fasterq-dump --split-files ..."
  exit 1
fi

# --- QIIME2 pipeline (uncomment when reads + metadata ready) ---
# source activate qiime2-amplicon 2>/dev/null || conda activate qiime2-amplicon

# qiime tools import \\
#   --type 'SampleData[PairedEndSequencesWithQuality]' \\
#   --input-path "${WORKDIR}/manifest_pe.csv" \\
#   --output-path "${WORKDIR}/qiime2/demux.qza" \\
#   --input-format PairedEndFastqManifestPhred33V2

# qiime dada2 denoise-paired \\
#   --i-demultiplexed-seqs "${WORKDIR}/qiime2/demux.qza" \\
#   --p-trunc-len-f 240 --p-trunc-len-r 200 \\
#   --o-table "${WORKDIR}/qiime2/table.qza" \\
#   --o-representative-sequences "${WORKDIR}/qiime2/rep-seqs.qza" \\
#   --o-denoising-stats "${WORKDIR}/qiime2/stats.qza"

# qiime feature-classifier classify-sklearn \\
#   --i-classifier silva-138-99-nb-classifier.qza \\
#   --i-reads "${WORKDIR}/qiime2/rep-seqs.qza" \\
#   --o-classification "${WORKDIR}/qiime2/taxonomy.qza"

# qiime taxa barplot \\
#   --i-table "${WORKDIR}/qiime2/table.qza" \\
#   --i-taxonomy "${WORKDIR}/qiime2/taxonomy.qza" \\
#   --m-metadata-file "${MANIFEST}" \\
#   --o-visualization "${OUT}/A5_taxa_barplot.qzv"

echo ""
echo "Post-QIIME2: run R script 05-microbiome-plot.R for butyrate-producer trajectories"
echo "Target genera: Faecalibacterium, Roseburia, Lachnospiraceae (see genes-and-signatures.json)"
