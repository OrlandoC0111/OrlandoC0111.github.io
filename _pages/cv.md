---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

<!-- TODO: put a PDF of your CV at files/Ziyu_Orlando_Chen_CV.pdf and uncomment the next line. -->
<!-- [Download PDF version](/files/Ziyu_Orlando_Chen_CV.pdf) -->

Education
======
* **Virginia Tech**, School of Plant and Environmental Sciences, Blacksburg, VA — January 2026–present <!-- TODO: add degree (M.S./Ph.D.) and program -->
  * Graduate student, advisor: Dr. Huijie Gan
* **Duke University School of Medicine**, Durham, NC — 2023–2025
  * Master of Biostatistics (Mathematical Statistics track)
  * Thesis: comparison of methods that control confounding between guide RNA and gene expression in single-cell CRISPR screens
* **Cornell University**, Ithaca, NY — 2021–2023
  * Bachelor's degree, Environment & Sustainability
  * Honors thesis in soil microbiology, advisor: Dr. Janice E. Thies
* **Zhejiang University**, Hangzhou, China — 2019–2021
  * Agricultural Resources and Environmental Science

Research experience
======
* **Graduate Researcher**, Virginia Tech, School of Plant and Environmental Sciences — Jan 2026–present
  * Advisor: Dr. Huijie Gan
  * Soil environment and genotype effects on soybean rhizosphere bacterial communities across two Virginia field sites (16S rRNA amplicon sequencing, community assembly with iCAMP, mixed models)
  * Remote sensing and drone (UAV) applications in agricultural research; machine learning for biological data
* **Statistical Genetics Thesis Research**, Duke University School of Medicine — 2024–2025 <!-- TODO: confirm dates and advisor -->
  * Compared methods (SCEPTRE, Biased Urn) for controlling confounding between guide RNA and gene expression in single-cell CRISPR screens; evaluated type I error and power
* **Biostatistics Research, Electronic Health Records**, Duke University School of Medicine — 2023–2025 <!-- TODO: confirm dates, lab and PI -->
  * Applied Bayesian latent class models and machine learning to EHR data (Duke PACE / Clinical Research Data Mart, SQL) to identify pain trajectories in breast cancer survivors
* **Undergraduate Honors Research**, Cornell University, Soil and Crop Sciences — 2022–2023 <!-- TODO: confirm dates -->
  * Advisor: Dr. Janice E. Thies
  * How biochar amendment changes soil microbial communities and key soil exoenzyme activities in South Carolina and Oregon soils (sequencing, PCoA, PERMANOVA, generalized linear models)

Skills
======
* **Statistical modeling:** generalized linear models, linear mixed-effects models, Bayesian statistics, Bayesian latent class models, latent class analysis, statistical inference and power analysis
* **Machine learning:** random forest, k-nearest neighbors, k-means clustering, predictive and risk-profile modeling
* **Statistical genetics:** single-cell CRISPR screen analysis (SCEPTRE, Biased Urn), type I error and power evaluation
* **Microbial ecology and bioinformatics:** 16S rRNA and ITS amplicon sequencing (QIIME 2, DADA2, cutadapt), PCoA, PERMANOVA, ANCOM-BC2, iCAMP / βNTI, co-occurrence networks
* **Data and geospatial:** electronic health records and SQL, ArcGIS, remote sensing and drone imagery
* **Programming and computing:** R, Python, SAS, SQL, Java; Linux, Slurm HPC, Git, LaTeX; JMP, GraphPad Prism

Publications
======
  <ul>{% if site.publications.size == 0 %}<li>Manuscripts in preparation.</li>{% endif %}{% for post in site.publications reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>

Presentations
======
  <ul>{% for post in site.talks reversed %}
    {% include archive-single-talk-cv.html  %}
  {% endfor %}</ul>

<!-- TODO: add an "Honors and awards" section (scholarships, dean's list, travel grants) from your résumé. -->
