---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

<!-- TODO: put a PDF of your CV at files/Orlando_Chen_CV.pdf and uncomment the next line. -->
<!-- [Download PDF version](/files/Orlando_Chen_CV.pdf) -->

Education
======
<!-- TODO: fill in degrees, institutions and years. -->
* [M.S./Ph.D.] in [Program], Virginia Tech, School of Plant and Environmental Sciences, [start year]–present
  * Advisor: Dr. Huijie Gan
* [B.S.] in [Major], [University], [year]

Research experience
======
* [Start year]–present: Graduate Research Assistant
  * Virginia Tech, School of Plant and Environmental Sciences
  * Soybean bulk soil and rhizosphere bacterial communities across two Virginia sites and nine genotypes (16S rRNA amplicon sequencing, community assembly analysis)
  * Supervisor: Dr. Huijie Gan

Skills
======
* Bioinformatics: QIIME 2, DADA2, cutadapt, SILVA taxonomy, PICRUSt2
* Statistics in R: phyloseq, vegan, linear mixed models, PERMANOVA, ANCOM-BC2, iCAMP, network analysis
* Computing: Linux, Slurm HPC (Virginia Tech ARC), Python, Git/GitHub
* Field and lab: soil and rhizosphere sampling <!-- TODO: add lab skills (DNA extraction, PCR, etc.) -->

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

Awards
======
<!-- TODO: add awards, fellowships and travel grants, or delete this section. -->
* [Award name], [year]

Service
======
<!-- TODO: add service, outreach, mentoring, or delete this section. -->
* [Activity], [year]
