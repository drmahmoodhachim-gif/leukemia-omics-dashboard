#!/usr/bin/env Rscript
# Analysis 4 — Butyrate/HDACi signature + DepMap line selection
#
# Part A (portal, no code): https://depmap.org — search NALM-6, MV4-11 for FFAR2/3 expression
#   and HDAC1/2/3 dependency scores before ordering CRISPR reagents.
#
# Part B (this script): project butyrate-response signature onto TARGET-AML tumors
#
# Output: data/year1-prelim/output/A4_butyrate_depmap.pdf

suppressPackageStartupMessages({
  library(jsonlite)
  library(dplyr)
  library(ggplot2)
  library(pheatmap)
})

cfg <- fromJSON("scripts/year1-prelim/config/genes-and-signatures.json")
out_dir <- "data/year1-prelim/output"
dir.create(out_dir, recursive = TRUE, showWarnings = FALSE)

# --- DepMap tables (download from depmap.org portal → Data Downloads) ---
depmap_expr <- "data/year1-prelim/depmap/OmicsExpressionProteinCodingGenesTPMLogp1.csv"
depmap_dep <- "data/year1-prelim/depmap/CRISPRGeneDependency.csv"
depmap_meta <- "data/year1-prelim/depmap/Model.csv"

lines_of_interest <- c(cfg$wet_lab_lines$ALL, cfg$wet_lab_lines$AML)
check_genes <- unique(c(cfg$ffar_receptors, cfg$hdac_targets))

if (file.exists(depmap_expr) && file.exists(depmap_meta)) {
  meta <- read.csv(depmap_meta, check.names = FALSE)
  expr <- read.csv(depmap_expr, check.names = FALSE, row.names = 1)
  # DepMap column naming varies by release — match ModelID to cell line name
  meta_sub <- meta %>%
    filter(OncotreePrimaryDisease %in% c("Acute Myeloid Leukemia", "B-Lymphoblastic Leukemia/lymphoma") |
             StrippedCellLineName %in% lines_of_interest)

  message("DepMap: annotate lines in portal if script column names differ by release.")

  # Heatmap skeleton — user aligns model IDs
  if (nrow(meta_sub) > 0 && length(intersect(check_genes, rownames(expr))) > 0) {
    genes_hit <- intersect(check_genes, rownames(expr))
    ids <- intersect(meta_sub$ModelID, colnames(expr))
    if (length(ids) > 2 && length(genes_hit) > 0) {
      mat <- as.matrix(expr[genes_hit, ids, drop = FALSE])
      pdf(file.path(out_dir, "A4_depmap_ffar_hdac_heatmap.pdf"), width = 8, height = 5)
      pheatmap(mat, scale = "row", main = "DepMap: FFAR + HDAC expression (log TPM+1)")
      dev.off()
    }
  }
} else {
  message("DepMap files not found — complete Part A in portal (see script header).")
}

# --- Butyrate signature from LINCS / manual gene list ---
# Replace with CLUE.io exported butyrate connectivity score genes or GSEA leading edge
BUTYRATE_SIG_FILE <- "data/year1-prelim/lincs/butyrate_up_genes.txt"
TARGET_EXPR <- "data/year1-prelim/target-aml/expression/target-aml.rds"

if (file.exists(BUTYRATE_SIG_FILE) && file.exists(TARGET_EXPR)) {
  sig_genes <- readLines(BUTYRATE_SIG_FILE)
  sig_genes <- sig_genes[nzchar(sig_genes)]
  expr <- readRDS(TARGET_EXPR)
  hit <- intersect(sig_genes, rownames(expr))
  if (length(hit) >= 10) {
    # Single-sample enrichment: mean z-score of signature genes
    zmat <- t(scale(t(as.matrix(expr[hit, , drop = FALSE]))))
    butyrate_score <- colMeans(zmat, na.rm = TRUE)
    clinical_file <- "data/year1-prelim/target-aml/clinical/target-aml-clinical.csv"
    if (file.exists(clinical_file)) {
      clin <- read.csv(clinical_file)
      # Expect columns: sample_id, relapse (0/1) or EFS_event
      id_col <- intersect(c("sample_id", "bcr_patient_barcode", "cases.submitter_id"), names(clin))[1]
      df <- data.frame(sample = names(butyrate_score), butyrate_score = butyrate_score) %>%
        left_join(clin, by = setNames(id_col, "sample"))
      if ("relapse" %in% names(df)) {
        p <- ggplot(df, aes(x = factor(relapse), y = butyrate_score, fill = factor(relapse))) +
          geom_violin(alpha = 0.7) +
          geom_boxplot(width = 0.15, outlier.shape = NA) +
          scale_fill_manual(values = c("#94a3b8", "#dc2626")) +
          labs(
            title = "Butyrate-response signature in TARGET-AML",
            subtitle = "Relapse-prone tumors expected lower if butyrate-repressed",
            x = "Relapse",
            y = "Signature score"
          ) +
          theme_minimal() +
          theme(legend.position = "none")
        ggsave(file.path(out_dir, "A4_butyrate_signature_relapse.pdf"), p, width = 6, height = 4)
      }
    }
  }
} else {
  message(
    "LINCS signature: export upregulated genes after butyrate perturbation from CLUE.io\n",
    "  → save one gene per line to ", BUTYRATE_SIG_FILE
  )
}

message("Analysis 4 complete (check ", out_dir, ").")
