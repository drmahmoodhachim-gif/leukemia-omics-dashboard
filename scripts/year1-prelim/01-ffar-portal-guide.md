# Analysis 1 — FFAR expression + survival (portal-first)

Fastest path to **Preliminary Figure 1** without coding. Use this checklist, then optionally export matrices for `04-butyrate-depmap.R`.

## cBioPortal — TARGET-AML

1. Open: https://www.cbioportal.org/study/summary?id=aml_target_2018  
2. **Query genes:** `FFAR2 FFAR3 FFAR4 HCAR2 GPR39`  
3. **Charts → Expression:** box plot by FAB subtype / cytogenetic risk  
4. **Charts → Survival:** pick **Event-free survival** and **Overall survival**; quartile split on each gene  
5. **Mutations tab:** confirm FFAR-family alteration frequency ≈ 0 (supports epigenetic-not-mutational premise)

## UCSC Xena — replicate survival quickly

1. Open: https://xenabrowser.net  
2. Dataset: `TARGET-AML` (TOIL or TARGET hub)  
3. **Kaplan–Meier:** gene expression vs OS/EFS  
4. Export PDF for proposal panel

## Beat AML — adult replication

1. Open: https://vizome.org  
2. Expression heatmap for FFAR genes across drug-response clusters  
3. Note concordance / discordance with pediatric TARGET

## GDC — raw data (for scripted follow-up)

```bash
# Example manifest filter (run from GDC Data Portal UI or API)
# Project: TARGET-AML
# Data types: Gene Expression Quantification, Masked Copy Number Segment, Methylation Beta Value
# Download to: data/year1-prelim/target-aml/
```

## Panel layout (proposal)

| Panel | Content |
|-------|---------|
| A | FFAR2/3/4/HCAR2/GPR39 expression by leukemia subtype |
| B | KM EFS — high vs low FFAR2 (repeat for top hit) |
| C | Mutation/oncoplex summary — FFAR loci |
| D | Beat AML replication heatmap (optional) |

## Script hook

After portal QC, run `04-butyrate-depmap.R` section **"Project FFAR expression onto butyrate signature"** using exported TARGET expression matrix.
