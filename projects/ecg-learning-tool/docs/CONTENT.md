# Content guide

## Edit an existing chapter

Chapter 1 uses markup in `public/index.html` and interaction data in `public/assets/foundations.js`. Chapters 2–4 use `public/assets/chapters.js`:

- `lessons`: three lessons per chapter, each with a tab, heading, paragraphs, visual type, memory cue, and takeaway.
- `items`: the practice items in display order.
- `choices`: the answer buttons for guided matching.
- `matches`: maps each item to an index in `choices`.
- `recall`: five questions, including three current-chapter and two earlier-chapter items.
- Each recall question stores its source chapter, question, four distinct options, exact correct-answer string, and explanation.
- `sources`: reference title and URL pairs shown in the lesson's expandable reference section.

The supported visuals are `placement`, `axes`, `direction`, and `regions`. Their renderers live in `public/assets/app.js`. Placement diagrams are cloned from the original SVG in chapter 1, with IDs removed so multiple views do not create duplicate IDs.

When changing options, update the matching index and verify the displayed answer independently. Run `npm run check` after edits. For a new chapter, also add its selector option in `public/index.html`, its initialized ID in `app.js`, and appropriate tests. The UI currently initializes chapters 2, 3, and 4 explicitly.

## Clinical sources

| Topic | Reference |
| --- | --- |
| Conventional limb and chest electrode positions | [Philips ECG Lead Placements](https://www.philips.com/c-dam/b2bhc/master/Products/Category/supplies/ecg/ecg-lead-placements-poster.pdf) and [IntelliVue MX400–550 IFU, conventional 12-lead ECG, p. 166](https://www.documents.philips.com/assets/Instruction%20for%20Use/20260424/83cba6c0fe91400ea93ab436008655e7.pdf) |
| Chest landmarks and placement sequence | [SCST: Recording a standard 12-lead ECG](https://www.bmj.com/sites/default/files/response_attachments/2016/09/CAC_SCST_Recording_a_12-lead_ECG_final_version_2014_CS2v2.0.pdf), pp. 12–13 |
| Limb-lead angles and vector concepts | [MIT OpenCourseWare: Introduction to Clinical Electrocardiography](https://ocw.mit.edu/courses/hst-582j-biomedical-signal-and-image-processing-spring-2007/b3eebd1d65ca56833cf61e7c3975512b_l3_ecg_reisner.pdf) and [BMJ: Leads, rate, rhythm, and cardiac axis](https://pmc.ncbi.nlm.nih.gov/articles/PMC1122339/) |
| Conventional region labels | [Maine EMS: 12-lead ECG acquisition job aid](https://www.maine.gov/ems/sites/maine.gov.ems/files/inline-files/20211116-MEMS-EMT-12-Lead-Placement-JobAid.pdf) |
| General lead families and planes | [Merck Manual: Electrocardiography](https://www.merckmanuals.com/professional/cardiovascular-disorders/cardiovascular-tests-and-procedures/electrocardiography) |

The diagrams are simplified teaching schematics. Limb vs. chest groups describe viewing planes; regional groups use conventional teaching labels. V1–V2 as “septal” is an introductory convention, rather than a precise anatomical map. The app does not infer a diagnosis or culprit artery from a group label. The polarity examples refer to simplified ventricular depolarization, not a universal rule for every ECG component.

## Recall behavior

Practice permits correction after an error. Recall records the first checked selection, shows feedback, and provides a retry after the final question. Retrying clears that round's score, missed-question list, selections, feedback, and progress indicator. Learning and matching progress remain available during the same page session.

Intervals of about 1, 3, 7, 14, and 30 days, then monthly, remain suggested study intervals. There is no calendar, notification engine, or durable learner record in this release.
