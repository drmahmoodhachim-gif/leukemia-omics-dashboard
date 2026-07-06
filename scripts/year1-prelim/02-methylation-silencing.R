#!/usr/bin/env Rscript
# Analysis 2 — TARGET-AML methylation silencing (minfi)
# Validates Aim 2: GPR39, IRF4, CCNA1, LAMA4 promoter hypermethylation vs expression
#
# Input: GDC 450K beta matrices + RNA-seq (same TARGET-AML cases)
# Output: data/year1-prelim/output/A2_methylation_silencing.pdf

suppressPackageStartupMessages({
  library(jsonlite)
  library(dplyr)
  library(ggplot2)
  library(minfi)
})

cfg <- fromJSON("scripts/year1-prelim/config/genes-and-signatures.json")
genes <- cfg$methylation_candidates
out_dir <- "data/year1-prelim/output"
dir.create(out_dir, recursive = TRUE, showWarnings = FALSE)

# --- CONFIGURE PATHS after GDC download ---
METH_DIR <- "data/year1-prelim/target-aml/methylation"  # IDAT or beta TSV from GDC
EXPR_FILE <- "data/year1-prelim/target-aml/expression/target-aml.rds"

if (!dir.exists(METH_DIR) || !file.exists(EXPR_FILE)) {
  stop(
    paste(
      "Download TARGET-AML methylation + expression from GDC first.",
      "See docs/INSILICO_PRELIMINARY_STUDIES.md and 01-ffar-portal-guide.md"
    ),
    call. = FALSE
  )
}

# Load expression (rows = genes, cols = samples — adjust if transposed)
expr <- readRDS(EXPR_FILE)

# Example: beta matrix from GDC harmonized TSV (adapt column names to your export)
beta_files <- list.files(METH_DIR, pattern = "beta", full.names = TRUE)
if (length(beta_files) == 0) stop("No beta files in ", METH_DIR)
beta <- read.delim(beta_files[1], row.names = 1, check.names = FALSE)

# Map CpG probes to gene promoters (use manifest or annotatr in production)
# Skeleton: user supplies probe-gene map CSV with columns: probe, gene, relation
probe_map_file <- "data/year1-prelim/target-aml/methylation/probe_gene_map.csv"
if (!file.exists(probe_map_file)) {
  stop(
    "Create probe_gene_map.csv from IlluminaHumanMethylation450kanno.ilmn12.hg19 ",
    "or GDC probe annotations for: ", paste(genes, collapse = ", ")
  )
}
probe_map <- read.csv(probe_map_file)

common_samples <- intersect(colnames(beta), colnames(expr))
message("Matched samples: ", length(common_samples))

plots <- list()
for (g in genes) {
  probes <- probe_map$probe[probe_map$gene == g]
  if (length(probes) == 0) {
    warning("No probes for ", g)
    next
  }
  promoter_beta <- colMeans(beta[probes, common_samples, drop = FALSE], na.rm = TRUE)
  gene_expr <- as.numeric(expr[g, common_samples])
  df <- data.frame(beta = promoter_beta, expression = gene_expr, gene = g)
  cor_r <- cor(df$beta, df$expression, use = "complete.obs")

  p <- ggplot(df, aes(x = beta, y = log2(expression + 1))) +
    geom_point(alpha = 0.35, size = 1.2) +
    geom_smooth(method = "lm", se = TRUE, color = "#0d9488") +
    labs(
      title = paste0(g, " promoter methylation vs expression"),
      subtitle = sprintf("TARGET-AML | r = %.2f (expect negative if silenced)", cor_r),
      x = "Mean promoter β",
      y = "log2(expression + 1)"
    ) +
    theme_minimal(base_size = 11)
  plots[[g]] <- p
}

if (length(plots) > 0) {
  pdf(file.path(out_dir, "A2_methylation_silencing.pdf"), width = 8, height = 6)
  for (p in plots) print(p)
  dev.off()
  message("Wrote ", file.path(out_dir, "A2_methylation_silencing.pdf"))
}

# Summary table for proposal
summary_rows <- lapply(genes, function(g) {
  probes <- probe_map$probe[probe_map$gene == g]
  if (length(probes) == 0) return(NULL)
  promoter_beta <- colMeans(beta[probes, common_samples, drop = FALSE], na.rm = TRUE)
  gene_expr <- as.numeric(expr[g, common_samples])
  data.frame(
    gene = g,
    n_probes = length(probes),
    cor_beta_expr = cor(promoter_beta, gene_expr, use = "complete.obs"),
    median_beta = median(promoter_beta, na.rm = TRUE)
  )
})
summary_df <- bind_rows(summary_rows)
write.csv(summary_df, file.path(out_dir, "A2_methylation_summary.csv"), row.names = FALSE)
message("Done.")
