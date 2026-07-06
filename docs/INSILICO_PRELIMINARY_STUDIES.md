# In Silico Preliminary Studies (Year 1)

Public multi-omic and microbiome datasets de-risk the FFAR–butyrate–immunogenicity hypothesis **before** UAE cohort consent. Analyses produce proposal-ready figures; the UAE cohort then supplies same-patient gut–marrow–MRD linkage that no public resource can.

## Rationale

| Public data delivers | UAE cohort uniquely delivers |
|----------------------|------------------------------|
| Large-cohort expression, methylation, survival | Same-child butyrate ↔ FFAR methylation ↔ MRD |
| scRNA immune microenvironment at diagnosis/relapse | Longitudinal microbiome + marrow sampling on protocol |
| Butyrate-producer depletion on treatment (Western COG) | Gulf/MENA population; infection-reduction (Rung 2) endpoint |

**Examiner framing:** Western COG/TARGET cohorts validate biology; UAE data is **non-redundant** and **causally linked** within individuals.

---

## Dataset map (analysis → aim → figure)

| # | Analysis | Primary datasets | Modality | De-risks | Access | Output figure |
|---|----------|------------------|----------|----------|--------|---------------|
| 1 | FFAR expression atlas + prognosis | TARGET-AML, TARGET-ALL, Beat AML (Vizome) | Bulk RNA-seq + clinical | **Aim 1** — receptor axis expressed; mutational null | [GDC](https://portal.gdc.cancer.gov/projects/TARGET-AML), [cBioPortal](https://www.cbioportal.org/study/summary?id=aml_target_2018), [Xena](https://xenabrowser.net), [Vizome](https://vizome.org) | FFAR panel by subtype + KM EFS/OS; mutation frequency table |
| 2 | Methylation silencing | TARGET-AML 450K | DNA methylation + RNA | **Aim 2** — promoter hypermethylation at GPR39, IRF4, CCNA1, LAMA4 | GDC harmonized methylation + expression | Promoter β-value vs expression scatter; volcano of Δβ |
| 3 | Cold-to-hot / dual compartment | Pediatric AML scRNA atlas (GSE289435); TARGET bulk + CIBERSORTx | scRNA-seq; bulk deconvolution | **Novel angle** — exhausted T vs M1; MHC-II / FFAR program | GEO / LeukemiaOmics workspace; [CIBERSORTx](https://cibersortx.stanford.edu) | Dot plot FFAR/AP genes by compartment; immunogenicity score vs relapse |
| 4 | Butyrate / HDACi signature + line selection | LINCS L1000, GEO butyrate lines, DepMap 24Q4 | Perturbation + CRISPR dependency | **Aim 2/3** — HDAC dependency; NALM-6 / MV4-11 FFAR status | [CLUE.io](https://clue.io), [DepMap](https://depmap.org), GEO GSE* butyrate | Signature projection on TARGET; DepMap receptor + HDAC1/2/3 heatmap |
| 5 | Butyrate-producer depletion | PRJNA533024 (longitudinal ALL 16S); pre-chemo ALL cohort; pediatric HSCT 16S; curatedMetagenomicData | 16S / shotgun | **Microbiome arm** — Faecalibacterium/Roseburia loss on Rx | SRA / ENA; Bioconductor `curatedMetagenomicData` | Abundance trajectory plot; infection overlay |

---

## Gene and signature lists (ready to run)

Config file: `scripts/year1-prelim/config/genes-and-signatures.json`

**FFAR / SCFA receptors:** `FFAR2`, `FFAR3`, `FFAR4`, `HCAR2` (GPR109A), `GPR39`

**Methylation candidates (Aim 2):** `GPR39`, `IRF4`, `CCNA1`, `LAMA4`

**Immunogenicity / exhaustion:** `HLA-DRA`, `HLA-DRB1`, `CIITA`, `CD74`, `PDCD1`, `LAG3`, `HAVCR2`, `TOX`

**Butyrate-producer genera (16S):** *Faecalibacterium*, *Roseburia*, *Lachnospiraceae* (family-level)

**Wet-lab lines (DepMap check first):** NALM-6 (ALL), MV4-11 (AML)

---

## Execution order (fastest figures first)

1. **Portal (afternoon):** cBioPortal/Xena — Analysis 1 survival panel; DepMap portal — Analysis 4 line/receptor check  
2. **R/Bioconductor:** `02-methylation-silencing.R` (minfi) → `04-butyrate-depmap.R`  
3. **Seurat:** `03-scrna-immunogenicity.R` (GSE289435 or TARGET-linked atlas)  
4. **QIIME2/DADA2:** `05-microbiome-depletion.sh` (PRJNA533024)  
5. **Integration (budgeted):** mixOmics/DIABIO — cross-block FFAR + methylation + immune + microbiome **signatures** (not same-patient merge)

Starter scripts: `scripts/year1-prelim/README.md`  
Figure legends (proposal-ready): [`docs/FIGURE_LEGENDS_PRELIMINARY.md`](FIGURE_LEGENDS_PRELIMINARY.md)

---

## Honest caveats (include in proposal)

1. **Population:** TARGET/COG cohorts are predominantly Western; validates mechanism, not UAE epidemiology.  
2. **Linkage:** Public expression, methylation, and microbiome come from **different patients** — cross-compartment correlation in one child is reserved for the UAE study.  
3. **Platform:** 450K array validates **loci**; PacBio native methylation validates **mechanism** (complementary, not duplicate).

---

## One-paragraph proposal insert

> **In silico preliminary studies (Year 1).** Before primary sample collection, we will leverage public pediatric leukemia resources to de-risk each aim. TARGET-AML/ALL and Beat AML (n≈1,000+ profiled children on COG trials including AAML0531) will test FFAR-family expression and survival (Aim 1), 450K methylation at GPR39/IRF4/CCNA1/LAMA4 (Aim 2), and bulk immune deconvolution. A published pediatric AML single-cell atlas (diagnosis, end-of-induction, relapse) will map FFAR-pathway and antigen-presentation genes across blast, T-cell, and myeloid compartments to operationalize the cold-to-hot hypothesis in patient data. LINCS/Connectivity Map and DepMap will define a butyrate/HDACi response signature and confirm FFAR and HDAC dependency in intended lines (NALM-6, MV4-11). Longitudinal pediatric ALL 16S data (PRJNA533024) will quantify butyrate-producer depletion across chemotherapy. These analyses yield proposal figures and wet-lab go/no-go criteria; the UAE cohort provides the same-patient gut–marrow–MRD causal thread absent from public archives.
