# Year 1 in silico preliminary analyses

Proposal text: [`docs/INSILICO_PRELIMINARY_STUDIES.md`](../../docs/INSILICO_PRELIMINARY_STUDIES.md)

Gene/signature lists: [`config/genes-and-signatures.json`](config/genes-and-signatures.json)  
Dataset table: [`config/datasets.json`](config/datasets.json)

## Recommended order

| Step | Script / portal | Time estimate | Coding |
|------|-----------------|---------------|--------|
| 1 | cBioPortal + UCSC Xena (see `01-ffar-portal-guide.md`) | Half day | Minimal |
| 2 | DepMap portal (see `04-butyrate-depmap.R` header) | 2 hours | Minimal |
| 3 | `02-methylation-silencing.R` | 1–2 days | R + minfi |
| 4 | `03-scrna-immunogenicity.R` | 2–3 days | R + Seurat |
| 5 | `04-butyrate-depmap.R` (full pipeline) | 1–2 days | R |
| 6 | `05-microbiome-depletion.sh` | 2–3 days | QIIME2/DADA2 |

## Prerequisites

```bash
# R (4.3+)
install.packages(c("jsonlite", "survival", "survminer", "ggplot2", "dplyr", "tidyr"))
# Bioconductor
if (!require("BiocManager")) install.packages("BiocManager")
BiocManager::install(c("minfi", "limma", "Seurat", "GEOquery"))

# Optional: GDC client for TARGET downloads
# https://docs.gdc.cancer.gov/Data_Transfer_Tool/Users_Guide/Data_Download_and_Upload/

# Microbiome: conda env with QIIME2 2024.x
# conda create -n qiime2-amplicon -c qiime2 -c conda-forge qiime2-amplicon
```

## Data directories (create locally, not committed)

```
data/year1-prelim/
  target-aml/          # GDC downloads
  gse289435/           # GEO Matrix / h5
  prjna533024/         # SRA fastq
  output/              # figures for proposal
```

## Outputs

All scripts write figures to `data/year1-prelim/output/` (gitignored). Copy panels into the proposal as **Preliminary Figure 1–5**.
