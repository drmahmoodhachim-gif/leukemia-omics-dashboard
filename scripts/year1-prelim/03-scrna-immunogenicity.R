#!/usr/bin/env Rscript
# Analysis 3 — scRNA cold-to-hot / immunogenicity (Seurat)
# Maps FFAR pathway + antigen presentation across blast, T, myeloid compartments
# Default atlas: GSE270894 (TCH/COG pediatric AML chemoresistance scRNA) or GSE289435
#
# Output: data/year1-prelim/output/A3_scrna_immunogenicity.pdf

suppressPackageStartupMessages({
  library(jsonlite)
  library(dplyr)
  library(ggplot2)
  library(Seurat)
})

cfg <- fromJSON("scripts/year1-prelim/config/genes-and-signatures.json")
out_dir <- "data/year1-prelim/output"
dir.create(out_dir, recursive = TRUE, showWarnings = FALSE)

ffar_genes <- cfg$ffar_receptors
ap_genes <- cfg$immunogenicity$antigen_presentation
exh_genes <- cfg$immunogenicity$exhaustion
feature_panel <- unique(c(ffar_genes, ap_genes, exh_genes))

# --- Load Seurat object (download GSE289435 or build from 10x h5) ---
seurat_rds <- "data/year1-prelim/gse270894/GSE270894_TCH_and_COG_Pediatric_AML_scRNAseq_Data_AND_Annotation.RDS"
if (!file.exists(seurat_rds)) {
  stop(
    "Build Seurat object first:\n",
    "  1. Download GSE270894 Seurat RDS + metadata xlsx from GEO (see Analysis Workspace file list)\n",
    "  2. readRDS() → standard QC if needed → annotate blast / T / myeloid compartments\n",
    "  3. saveRDS(seu, '", seurat_rds, "') OR point seurat_rds at readRDS path\n",
    "See LeukemiaOmics: Published findings tab OR /analysis?accession=GSE270894\n"
  )
}

seu <- readRDS(seurat_rds)

# Required metadata columns (adapt to your object)
required_cols <- c("cell_type", "disease_state")  # e.g. diagnosis / EOI / relapse
missing <- setdiff(required_cols, colnames(seu@meta.data))
if (length(missing) > 0) {
  stop("Add metadata columns: ", paste(missing, collapse = ", "))
}

present <- intersect(feature_panel, rownames(seu))
if (length(present) < 5) stop("Too few genes in object. Check gene symbol casing.")

# DotPlot — compartment × gene
p_dot <- DotPlot(seu, features = present, group.by = "cell_type") +
  RotatedAxis() +
  labs(title = "FFAR / immunogenicity panel by compartment") +
  theme_minimal()

# Immunogenicity score per cell (z-scored AP − exhaustion)
ap_present <- intersect(ap_genes, rownames(seu))
ex_present <- intersect(exh_genes, rownames(seu))
expr <- GetAssayData(seu, layer = "data")
z <- function(x) (x - mean(x)) / sd(x)
ap_score <- colMeans(t(scale(t(as.matrix(expr[ap_present, , drop = FALSE])))))
ex_score <- colMeans(t(scale(t(as.matrix(expr[ex_present, , drop = FALSE])))))
seu$immunogenicity_score <- ap_score - ex_score

p_violin <- VlnPlot(
  seu,
  features = "immunogenicity_score",
  group.by = "disease_state",
  pt.size = 0
) + labs(title = "Immunogenicity score: diagnosis vs EOI vs relapse")

# FFAR program in blasts only
blast_cells <- WhichCells(seu, expression = cell_type %in% c("Blast", "AML blast", "Malignant"))
if (length(blast_cells) > 50) {
  seu_blast <- subset(seu, cells = blast_cells)
  ff_present <- intersect(ffar_genes, rownames(seu_blast))
  p_ffar <- VlnPlot(seu_blast, features = ff_present, group.by = "disease_state", ncol = 2, pt.size = 0)
} else {
  p_ffar <- ggplot() + annotate("text", x = 0.5, y = 0.5, label = "Annotate blast cells in metadata") + theme_void()
}

pdf(file.path(out_dir, "A3_scrna_immunogenicity.pdf"), width = 10, height = 8)
print(p_dot)
print(p_violin)
print(p_ffar)
dev.off()

# Export per-sample summary if sample_id present
if ("sample_id" %in% colnames(seu@meta.data)) {
  blast_summary <- seu@meta.data %>%
    filter(cell_type %in% c("Blast", "AML blast", "Malignant")) %>%
    group_by(sample_id, disease_state) %>%
    summarise(
      mean_immunogenicity = mean(immunogenicity_score, na.rm = TRUE),
      n_cells = n(),
      .groups = "drop"
    )
  write.csv(blast_summary, file.path(out_dir, "A3_blast_immunogenicity_by_sample.csv"), row.names = FALSE)
}

message("Wrote ", file.path(out_dir, "A3_scrna_immunogenicity.pdf"))
