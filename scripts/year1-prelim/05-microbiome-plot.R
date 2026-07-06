#!/usr/bin/env Rscript
# Companion to 05-microbiome-depletion.sh — plot butyrate-producer trajectories
# Input: QIIME2 exported feature table + taxonomy (TSV) OR phyloseq object RDS

suppressPackageStartupMessages({
  library(jsonlite)
  library(dplyr)
  library(tidyr)
  library(ggplot2)
})

cfg <- fromJSON("scripts/year1-prelim/config/genes-and-signatures.json")
out_dir <- "data/year1-prelim/output"
dir.create(out_dir, recursive = TRUE, showWarnings = FALSE)

genera <- cfg$butyrate_producers_16s$genera
families <- cfg$butyrate_producers_16s$families

# Expected export from: qiime tools export --input-path table.qza --output-path exported/
table_tsv <- "data/year1-prelim/prjna533024/exported/feature-table.biom.tsv"
tax_tsv <- "data/year1-prelim/prjna533024/exported/taxonomy.tsv"
meta_tsv <- "data/year1-prelim/prjna533024/sample-metadata.tsv"

if (!all(file.exists(c(table_tsv, tax_tsv, meta_tsv)))) {
  stop("Export QIIME2 artifacts first (see 05-microbiome-depletion.sh)")
}

meta <- read.delim(meta_tsv, comment.char = "#", check.names = FALSE)
# Normalize relative abundance per sample, aggregate butyrate producers
# (Implementation depends on exported format — skeleton below)

message("Merge feature table with taxonomy; sum genera: ", paste(genera, collapse = ", "))
message("Plot abundance ~ timepoint with infection overlay → ", file.path(out_dir, "A5_butyrate_producer_trajectory.pdf"))

# Template figure structure for student:
timepoint_order <- c("healthy_control", "pre_chemo", "mid_chemo", "post_chemo", "end_induction")

p <- ggplot(data.frame(
  timepoint = factor(timepoint_order, levels = timepoint_order),
  rel_abund = c(0.18, 0.12, 0.06, 0.04, 0.05)
), aes(x = timepoint, y = rel_abund, group = 1)) +
  geom_line(color = "#0d9488", linewidth = 1) +
  geom_point(size = 3, color = "#0d9488") +
  labs(
    title = "Butyrate-producer relative abundance across ALL treatment",
    subtitle = "Replace with PRJNA533024 data | Faecalibacterium + Roseburia + Lachnospiraceae",
    x = "Timepoint",
    y = "Relative abundance"
  ) +
  theme_minimal(base_size = 11) +
  theme(axis.text.x = element_text(angle = 30, hjust = 1))

ggsave(file.path(out_dir, "A5_butyrate_producer_trajectory_TEMPLATE.pdf"), p, width = 7, height = 4)
message("Template saved — replace with real counts after QIIME2 export.")
