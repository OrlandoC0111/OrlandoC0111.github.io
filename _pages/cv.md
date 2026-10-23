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
  * Advisor: Dr. Huijie Gan
* **Duke University School of Medicine**, Durham, NC — 2023–2025
  * Master of Biostatistics
* **Zhejiang University** and **Cornell University** — 2019–2023
  * Undergraduate degree in Environmental Science
  * Honors thesis in soil microbiology, mentor: Dr. Janice Thies

Research experience
======
* **Virginia Tech**, School of Plant and Environmental Sciences — January 2026–present
  * Advisor: Dr. Huijie Gan
  * Remote sensing and drone applications in agricultural research, soil microbiology, and machine learning applications in biological research
  * Soil environment and genotype effects on soybean rhizosphere bacterial communities at two Virginia field sites
* **Duke University School of Medicine**, Department of Biostatistics & Bioinformatics — 2023–2025
  * Statistical genetics
  * Bayesian analysis of electronic health record (EHR) data
* **Cornell University**, honors thesis in soil microbiology
  * Mentor: Dr. Janice Thies

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
