# Preliminary Figure Legends (Proposal Insert)

Copy-paste ready for Word or LaTeX. Panel dimensions assume a single full-width figure (~180 mm) unless noted.

---

## Preliminary Figure 1. FFAR-family expression and prognostic value in pediatric leukemia (Aim 1)

**Title (short):** FFAR receptor expression across pediatric leukemia subtypes and association with event-free survival.

**Data:** NCI TARGET-AML and TARGET-ALL (COG trials including AAML0531); Beat AML (Vizome) for adult replication. Generated via cBioPortal / UCSC Xena; mutation frequencies from cBioPortal OncoPrint.

**(A)** Box-and-whisker plots of log₂-normalized RNA-seq expression for *FFAR2*, *FFAR3*, *FFAR4*, *HCAR2* (GPR109A), and *GPR39* in TARGET-AML, stratified by FAB morphologic subtype (or ELN/cytogenetic risk group where sample size permits). Overlay points show individual tumors; horizontal brackets denote pairwise Wilcoxon comparisons versus normal bone marrow reference where available. **(B)** Kaplan–Meier curves for event-free survival (EFS) in TARGET-AML, splitting patients at the median expression of the top-ranked FFAR gene from panel A (high vs low). Number at risk table below; log-rank *P* and hazard ratio (95% CI) from Cox proportional hazards model adjusted for age and cytogenetic risk. **(C)** OncoPrint summary of somatic mutation and copy-number alteration frequency at *FFAR2*, *FFAR3*, *FFAR4*, *HCAR2*, and *GPR39* loci across TARGET-AML (*n* ≈ 1,000). **(D)** Heatmap of median FFAR-gene expression z-scores across Beat AML molecular clusters (Vizome), demonstrating concordance or discordance with pediatric TARGET patterns.

**Interpretation line for proposal:** Near-zero FFAR locus mutation burden with subtype-specific expression and EFS association supports an **epigenetically controlled**, druggable SCFA-sensing axis rather than a mutationally inactivated pathway.

**Methods one-liner:** Public RNA-seq and clinical data were accessed through cBioPortal (TARGET-AML study `aml_target_2018`) and UCSC Xena; survival analyses used R `survival`/`survminer` with Benjamini–Hochberg correction for multi-gene testing.

**Script / guide:** `scripts/year1-prelim/01-ffar-portal-guide.md`

---

## Preliminary Figure 2. Promoter methylation silencing of candidate loci (Aim 2)

**(A–D)** Scatter plots of mean promoter CpG β-value (Illumina 450K) versus log₂ RNA-seq expression for *GPR39*, *IRF4*, *CCNA1*, and *LAMA4* in TARGET-AML (*n* matched DNA/RNA pairs). Spearman ρ and *P* shown; dashed line = linear regression. **(E)** Volcano plot of Δβ (AML vs normal hematopoietic reference) for probes mapping to candidate promoters.

**Data:** GDC TARGET-AML harmonized methylation and expression. **Script:** `02-methylation-silencing.R`

---

## Preliminary Figure 3. Cold-to-hot immunogenicity across compartments (novel angle)

**(A)** Single-cell dot plot of *FFAR2/3*, *GPR39*, antigen-presentation genes (*HLA-DRA*, *CIITA*, *CD74*), and exhaustion markers (*PDCD1*, *LAG3*, *HAVCR2*) by annotated compartment (blast, T cell, myeloid) in pediatric AML scRNA-seq (GSE289435). **(B)** Violin plot of composite immunogenicity score (z-scored AP − exhaustion) by disease state (diagnosis, end-of-induction, relapse). **(C)** UMAP of T cells colored by exhaustion module score.

**Script:** `03-scrna-immunogenicity.R`

---

## Preliminary Figure 4. Butyrate-response signature and DepMap line selection (Aim 2/3)

**(A)** Violin plot of LINCS-derived butyrate/HDACi response signature projected onto TARGET-AML tumors, stratified by relapse status. **(B)** Heatmap of *FFAR2/3*, *GPR39*, and *HDAC1/2/3* expression plus CRISPR dependency scores in NALM-6, MV4-11, and reference AML/ALL lines (DepMap).

**Script:** `04-butyrate-depmap.R`

---

## Preliminary Figure 5. Butyrate-producer depletion during pediatric ALL treatment (microbiome arm)

**(A)** Longitudinal line plot (mean ± SEM) of relative abundance of butyrate-producing taxa (*Faecalibacterium*, *Roseburia*, Lachnospiraceae) in pediatric ALL (PRJNA533024) at pre-chemotherapy, on-treatment, and post-cessation timepoints versus age-matched healthy controls. **(B)** Stacked bar or heatmap of top genera by timepoint. **(C)** Optional overlay of febrile neutropenia / infection episodes on the timeline (where metadata available).

**Data:** SRA PRJNA533024 (Chua et al., *BMC Cancer* 2020, doi:10.1186/s12885-020-6654-5). **Script:** `05-microbiome-depletion.sh`, `05-microbiome-plot.R`

---

## LaTeX snippet (Figure 1 only)

```latex
\begin{figure}[htbp]
  \centering
  \includegraphics[width=\textwidth]{figures/PrelimFig1_FFFAR_TARGET.pdf}
  \caption{\textbf{FFAR-family expression and prognostic value in pediatric leukemia.}
  \textbf{(A)} Expression of FFAR-pathway genes across TARGET-AML subtypes.
  \textbf{(B)} Kaplan--Meier EFS by high vs low FFAR expression.
  \textbf{(C)} Somatic alteration frequency at FFAR loci (OncoPrint).
  \textbf{(D)} Beat AML replication heatmap.
  Data: TARGET-AML/ALL, Beat AML (Vizome); cBioPortal/Xena.}
  \label{fig:prelim-ffar}
\end{figure}
```

---

## Cross-reference

| Figure | Primary accession | LeukemiaOmics workspace |
|--------|-------------------|-------------------------|
| 1 | TARGET-AML | Research Planner → FFAR Year-1 template |
| 2 | TARGET-AML | — |
| 3 | GSE289435 | `/analysis?accession=GSE289435` |
| 4 | BEAT-AML / DepMap | `/datasets` → Beat AML |
| 5 | PRJNA533024 | `/datasets` → filter Microbiota |
