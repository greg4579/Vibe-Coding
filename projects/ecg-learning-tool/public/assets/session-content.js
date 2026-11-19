// Dated practice content. Each question lists its topic, prompt, and model answer.
export const sessionContent = [
  {
    "id": "2026-11-09",
    "questions": [
      [
        "Chapter 1 · delayed recall",
        "Name all six limb leads and their viewing plane. Then name the chest leads and their viewing plane.",
        "I, II, III, aVR, aVL, aVF: frontal plane. V1–V6: horizontal (transverse) plane. There is no standard limb lead IV. These planes describe electrical perspectives, not electrode counts."
      ],
      [
        "Chapter 1 · mental model",
        "How can 10 electrodes produce 12 leads? Explain the difference between an electrode and a lead.",
        "An electrode is a skin sensor. A lead records a defined voltage difference, giving an electrical perspective. Four limb electrodes and six chest electrodes support six limb leads and six chest leads; the electrodes are shared in forming voltage differences."
      ],
      [
        "Chapter 2 · placement recall",
        "From memory, describe the standard positions of V1 and V2. Include the intercostal space, sternal border, and whose right and left you mean.",
        "V1: fourth intercostal space at the patient’s right sternal border. V2: fourth intercostal space at the patient’s left sternal border. Intercostal spaces are gaps between ribs."
      ],
      [
        "Chapter 2 · hypothetical application",
        "V1 was recorded at the correct height but on the patient’s left sternal border. A colleague proposes moving the V1 waveform to the other side of the screen. Explain why that does not correct the recording and what must change.",
        "Screen position does not change the voltage already recorded. The V1 electrode belongs at the fourth intercostal space at the patient’s right sternal border; correct the physical placement and acquire a new recording. Placement can change waveforms, so a difference alone cannot establish a new cardiac abnormality."
      ]
    ],
    "title": "Electrical views and reproducible placement"
  },
  {
    "id": "2026-11-10",
    "questions": [
      [
        "Chapter 1 · delayed recall",
        "Without opening earlier lessons, list all six limb leads and their viewing plane. Which leads supply the other viewing plane, and what is that plane?",
        "I, II, III, aVR, aVL, aVF: frontal plane. V1–V6: horizontal (transverse) plane. There is no standard limb lead IV. These planes describe electrical perspectives, not electrode counts."
      ],
      [
        "Chapter 2 · three-day recall",
        "You are instructing a colleague who is facing the patient. Specify the exact standard locations of V1 and V2, including whose right and left you mean.",
        "V1: fourth intercostal space at the patient’s right sternal border. V2: fourth intercostal space at the patient’s left sternal border. Intercostal spaces are gaps between ribs."
      ],
      [
        "Chapter 2 · hypothetical application",
        "Two recordings have different V1/V2 waveforms. The second used electrodes two rib spaces above the standard locations. What measurement changed, and what can you conclude about a change in the heart from this difference alone?",
        "The physical recording sites changed, altering the electrical measurement. High V1/V2 placement can alter waveforms and mimic abnormalities. The difference alone cannot establish a cardiac change or exclude one; correct placement, repeat acquisition, and clinical assessment are needed."
      ],
      [
        "Chapter 2 · product explanation",
        "A colleague says: “Our serial-comparison software detected a difference, so it has established disease progression.” Explain the missing reasoning in two sentences, including one acquisition check.",
        "Detecting a waveform difference does not establish its clinical cause. Check electrode placement and recording comparability; clinical context and qualified interpretation are needed to decide whether the difference reflects disease, acquisition variation, or both."
      ]
    ],
    "title": "Compare recordings and check placement",
    "objective": "distinguish a recording difference from a change in the heart"
  },
  {
    "id": "2026-11-11",
    "objective": "distinguish an electrical view, its recording site, and its position on the screen",
    "teaching": "A lead is a defined voltage measurement, an electrode position helps determine the signal recorded, and the screen layout determines where that signal is displayed. Changing the display alone does not change the recorded measurement. Moving an electrode can. Use that distinction before attributing a serial difference to the heart.",
    "questions": [
      [
        "Chapter 1 · corrected-error recall",
        "Rebuild the standard 12-lead set from memory: name the six limb leads and six chest leads, and assign each group its viewing plane.",
        "I, II, III, aVR, aVL, aVF: frontal plane. V1–V6: horizontal (transverse) plane. There is no standard limb lead IV. These planes describe electrical perspectives, not electrode counts."
      ],
      [
        "Chapter 2 · overdue recall",
        "Give placement instructions for V1 and V2 that someone standing opposite the patient could follow without guessing. Include the rib-space number, anatomical landmark, and patient side.",
        "V1: fourth intercostal space at the patient’s right sternal border. V2: fourth intercostal space at the patient’s left sternal border. Intercostal spaces are gaps between ribs."
      ],
      [
        "Chapter 2 · hypothetical comparison",
        "In two ECGs, the limb leads look similar but V1/V2 differ. You learn that the second recording used chest electrodes two intercostal spaces too high. Does the unchanged limb-lead appearance prove the heart is unchanged? Explain what must be checked before attributing the difference to disease.",
        "No. Similar limb-lead appearance does not establish that the heart is unchanged. The changed V1/V2 recording sites offer an acquisition-related explanation for their differences. Verify and correct placement, repeat acquisition as appropriate, and interpret the ECG in clinical context; misplacement and disease can coexist."
      ],
      [
        "Chapters 1–2 · explain the measurement",
        "A product demo rearranges the existing V1 waveform on screen. A technician instead moves the V1 electrode from an incorrect site to its standard site and records again. Which action can change the measured waveform, and why?",
        "Moving the electrode and recording again can change the measured waveform because the physical recording site helps determine the voltage measured. Rearranging an existing waveform changes its display location, not the voltage already recorded. Standard V1 is at the fourth intercostal space at the patient’s right sternal border."
      ]
    ],
    "title": "Electrical views and reproducible placement",
    "sources": [
      [
        "LITFL: lead positioning",
        "https://litfl.com/ecg-lead-positioning/"
      ],
      [
        "LITFL: V1/V2 misplacement",
        "https://litfl.com/misplacement-of-v1-and-v2/"
      ]
    ]
  },
  {
    "id": "2026-11-12",
    "cumulative": true,
    "objective": "reconstruct the lead system and apply reproducible V1/V2 placement without prompts",
    "questions": [
      [
        "Chapter 1 · delayed corrected-error check",
        "On a blank sheet, reconstruct both lead families in a standard 12-lead ECG. Name every lead and give the viewing plane for each family.",
        "Limb leads: I, II, III, aVR, aVL, aVF — frontal (coronal) plane. Chest leads: V1, V2, V3, V4, V5, V6 — horizontal (transverse) plane. IV is not a standard lead. These are conventional electrical perspectives, not literal pictures of separate heart structures."
      ],
      [
        "Chapter 2 · placement recall",
        "A colleague is facing the patient and asks where to place V1 and V2 for a standard diagnostic ECG. Give instructions that specify the anatomical level, landmark, and side for each.",
        "V1: fourth intercostal space at the patient’s right sternal border. V2: fourth intercostal space at the patient’s left sternal border. Right and left refer to the patient."
      ],
      [
        "Chapter 1 · measurement model",
        "Someone counts 10 skin electrodes and says two sensors must be missing because the report contains 12 leads. Explain the counting error in two sentences.",
        "Electrodes are physical sensors; a lead is a defined voltage difference that provides an electrical view. A standard ECG uses four limb electrodes and six chest electrodes to obtain six limb leads and six chest leads, sharing electrodes when forming the measurements."
      ],
      [
        "Chapters 1–2 · hypothetical serial comparison",
        "Yesterday V1/V2 used standard sites; today both were placed two intercostal spaces higher and their waveforms differ. A colleague says rearranging the traces on screen will fix the recording. Explain what that changes, what needs correcting, and why the difference alone does not establish cardiac deterioration.",
        "Rearranging traces changes the display, not the recorded voltage. Correct the physical V1/V2 sites to the fourth intercostal spaces at the patient’s right/left sternal borders and acquire a new ECG as appropriate. High placement can change waveforms and mimic abnormalities; acquisition variation and disease can coexist, so the difference alone does not establish deterioration or exclude disease."
      ]
    ],
    "title": "Cumulative checkpoint: lead system and placement",
    "sources": [
      [
        "Merck Manual: electrocardiography",
        "https://www.merckmanuals.com/professional/cardiovascular-disorders/cardiovascular-tests-and-procedures/electrocardiography"
      ],
      [
        "LITFL: V1/V2 misplacement",
        "https://litfl.com/misplacement-of-v1-and-v2/"
      ]
    ]
  },
  {
    "id": "2026-11-13",
    "cumulative": false,
    "objective": "reconstruct the lead families and distinguish physical recording sites from display layout",
    "teaching": "Application — acquisition versus display. The electrode locations help determine the voltage differences recorded. Rearranging already recorded traces on a screen changes their presentation, not the original measurement. When comparing ECGs, ask whether acquisition changed before interpreting a difference as a change in the heart.",
    "questions": [
      [
        "Chapter 1 · seven-day recall",
        "Build a standard 12-lead report from memory: list the six limb leads and six chest leads, then name the viewing plane of each family. No looking back.",
        "Limb: I, II, III, aVR, aVL, aVF — frontal (coronal) plane. Chest: V1–V6 — horizontal (transverse) plane. IV is not a standard lead. These are electrical perspectives, not photographs of separate structures."
      ],
      [
        "Chapter 2 · placement recall",
        "Imagine dictating instructions to someone standing across from the patient. Specify exactly where V1 and V2 belong: numbered space, anatomical landmark, and whose right or left.",
        "V1: fourth intercostal space at the patient’s right sternal border. V2: fourth intercostal space at the patient’s left sternal border. The patient’s sides determine placement, regardless of where the operator stands."
      ],
      [
        "Chapter 1 · explain the measurement",
        "A product trainer says, “Twelve leads means twelve separate skin sensors.” Correct the statement: give the actual electrode count and explain what a lead measures. Keep it to two sentences.",
        "A standard 12-lead ECG uses 10 electrodes: four limb and six chest electrodes. A lead represents a defined voltage difference, providing an electrical view; shared electrode signals and derived references allow more leads than physical electrodes."
      ],
      [
        "Chapters 1–2 · hypothetical UI review",
        "A software update displays V1 and V2 in different screen positions using exactly the same stored ECG data. A colleague claims the new layout corrects any original electrode-placement error. Explain why that claim fails and what must be corrected to obtain a recording from the intended sites.",
        "The same stored signals retain their original acquisition conditions. Reordering traces cannot change where the electrodes were placed. If placement was wrong, physically correct it and obtain a new recording as appropriate; the screen layout alone cannot repair the original measurement."
      ]
    ],
    "title": "Seven-day recall: electrical views and recording sites",
    "sources": [
      [
        "Merck Manual: electrocardiography",
        "https://www.merckmanuals.com/professional/cardiovascular-disorders/cardiovascular-tests-and-procedures/electrocardiography"
      ],
      [
        "LITFL: ECG lead positioning",
        "https://litfl.com/ecg-lead-positioning/"
      ]
    ]
  },
  {
    "id": "2026-11-14",
    "cumulative": false,
    "objective": "describe V1/V2 placement so another person can reproduce it",
    "teaching": "Chapter 2 application — precise anatomical instructions. An intercostal space is the gap between adjacent ribs: the fourth space lies between ribs 4 and 5. A reproducible position needs the space number, a named landmark, and the patient’s side. “On the fourth rib” and “near the breastbone” do not specify the standard V1/V2 sites. The operator’s viewpoint does not change the patient’s right and left.",
    "questions": [
      [
        "Chapter 2 · seven-day placement recall",
        "Without looking back, write one exact placement instruction for V1 and one for V2. Specify the anatomical level, landmark, and side; say whose side you mean.",
        "V1 belongs in the fourth intercostal space at the patient’s right sternal border; V2 in the fourth intercostal space at the patient’s left sternal border. Intercostal means between ribs. The patient’s right and left apply regardless of the operator’s viewpoint."
      ],
      [
        "Chapter 1 · delayed corrected-error check",
        "Reconstruct both lead families in a standard 12-lead ECG: name all six leads in each family and identify the viewing plane of each. Use the actual lead names, not just a total.",
        "Limb leads: I, II, III, aVR, aVL, aVF — frontal (coronal) plane. Chest leads: V1, V2, V3, V4, V5, V6 — horizontal (transverse) plane. IV is not a standard lead; aVL is. These are electrical perspectives rather than literal pictures of separate structures."
      ],
      [
        "Chapter 2 · instruction audit",
        "A draft training card says: “Place V2 on the fourth rib near the breastbone.” Identify the two anatomical ambiguities or errors and rewrite it as a reproducible instruction.",
        "A rib is not an intercostal space, and “near” omits the precise landmark and side. Rewrite: V2 in the fourth intercostal space, between ribs 4 and 5, at the patient’s left sternal border."
      ],
      [
        "Chapters 1–2 · hypothetical viewpoint error",
        "Standing face-to-face with the patient, an operator places V1 beside the sternum on the operator’s own right, at the correct height. What is wrong, where should V1 go, and why does retaining the label “V1” not make the recording correct?",
        "The operator’s right is the patient’s left, so the electrode is on the wrong side for V1. V1 belongs at the patient’s right sternal border in the fourth intercostal space. The physical electrode location helps determine the measured electrical perspective; a label cannot make an incorrectly acquired signal equivalent to one recorded at the intended site."
      ]
    ],
    "title": "Chapter 2: make placement instructions reproducible",
    "sources": [
      [
        "Merck Manual: electrocardiography",
        "https://www.merckmanuals.com/professional/cardiovascular-disorders/cardiovascular-tests-and-procedures/electrocardiography"
      ],
      [
        "LITFL: ECG lead positioning",
        "https://litfl.com/ecg-lead-positioning/"
      ]
    ]
  },
  {
    "id": "2026-11-15",
    "cumulative": false,
    "objective": "distinguish consistent electrode placement from correct electrode placement",
    "teaching": "Chapter 2 application — consistency versus correctness. Repeating an electrode-placement error can make recordings look consistent without making the placement standard. A later recording with corrected positions may look different because the measurement changed. Therefore, waveform similarity does not prove correct placement, and a difference after correction does not by itself prove a cardiac change. Placement variation and disease can coexist.",
    "questions": [
      [
        "Chapter 1 · delayed corrected-error recall",
        "Without looking back, name all six limb leads and their viewing plane. Then name the chest-lead series and its viewing plane.",
        "Limb leads: I, II, III, aVR, aVL, aVF — frontal (coronal) plane. Chest leads: V1 through V6 — horizontal (transverse) plane. IV is not a standard lead; aVL is. These are electrical views, rather than photographs of isolated structures."
      ],
      [
        "Chapter 2 · delayed placement recall",
        "An operator is about to mark the standard diagnostic V1 and V2 sites. Give both exact locations, including the numbered space, landmark, and patient side.",
        "V1: fourth intercostal space at the patient’s right sternal border. V2: fourth intercostal space at the patient’s left sternal border. Right and left always refer to the patient."
      ],
      [
        "Chapter 2 · hypothetical consistency check",
        "A department repeatedly places V1 and V2 in the second intercostal spaces. Its recordings look similar from visit to visit. A trainer concludes: “Their consistency proves the locations are correct.” Explain why this conclusion fails and state what should be checked.",
        "A repeated error can produce similar recordings. Similarity does not verify anatomical placement. Check the actual intercostal spaces and sternal borders against standard V1/V2 sites: fourth intercostal space, patient’s right for V1 and left for V2."
      ],
      [
        "Chapters 1–2 · hypothetical corrected recording",
        "Today the department corrects those electrode locations, and the new V1/V2 waveforms differ. In two sentences, explain why neither “the heart definitely changed” nor “the difference is definitely harmless” follows from that observation alone.",
        "Changing electrode position changes the electrical measurement and can account for waveform differences without a cardiac change. That possibility neither establishes the cause in this case nor excludes disease; clinical interpretation must consider acquisition conditions and the patient’s clinical context."
      ]
    ],
    "title": "Chapter 2: consistent placement can still be wrong",
    "sources": [
      [
        "Merck Manual: electrocardiography",
        "https://www.merckmanuals.com/professional/cardiovascular-disorders/cardiovascular-tests-and-procedures/electrocardiography"
      ],
      [
        "LITFL: V1/V2 misplacement",
        "https://litfl.com/misplacement-of-v1-and-v2/"
      ]
    ]
  },
  {
    "id": "2026-11-16",
    "cumulative": false,
    "objective": "explain why a complete electrode set does not establish correct anatomical placement",
    "teaching": "Chapter 2 application — count and location answer different questions. Counting electrodes checks whether the expected physical sensors are present. Checking anatomical landmarks asks whether they occupy the intended recording sites. A standard 12-lead ECG uses 10 electrodes, but the right count can coexist with misplaced electrodes. A lead label identifies the intended electrical view; it does not independently verify physical placement.",
    "questions": [
      [
        "Chapter 1 · delayed corrected-error recall",
        "Recreate the two lead families of a standard 12-lead ECG from memory. Write every lead name and assign a viewing plane to each family.",
        "Limb leads: I, II, III, aVR, aVL, aVF — frontal (coronal) plane. Chest leads: V1, V2, V3, V4, V5, V6 — horizontal (transverse) plane. IV is not a standard lead; aVL is. Leads are electrical perspectives, not photographs of separate structures."
      ],
      [
        "Chapter 2 · delayed placement recall",
        "Imagine checking a patient before recording. Describe where V1 and V2 should be relative to the ribs and sternum. Make the right/left convention explicit.",
        "V1: fourth intercostal space at the patient’s right sternal border. V2: fourth intercostal space at the patient’s left sternal border. The intercostal space is between ribs; right and left refer to the patient, not the operator."
      ],
      [
        "Chapters 1–2 · hypothetical completeness audit",
        "A training checklist reads: “All 10 electrodes present; all 12 lead labels displayed; therefore standard placement confirmed.” What does this checklist establish, what does it leave unverified, and which two sites would you inspect using what you know today?",
        "It establishes the reported electrode count and presence of 12 display labels; those facts do not establish where the electrodes are located. Inspect V1 at the fourth intercostal space/right sternal border and V2 at the fourth intercostal space/left sternal border, using the patient’s sides. This checks those two sites; it does not certify the other eight electrodes."
      ],
      [
        "Chapter 1 · explain it to a product colleague",
        "In two sentences, explain why counting 10 electrodes and displaying 12 leads are compatible, then explain why neither number alone establishes correct placement.",
        "Electrodes are physical sensors, while leads represent defined voltage differences that provide electrical views; shared signals and calculated references permit 12 standard leads from 10 electrodes. Those counts describe the recording system, whereas correct placement requires checking the anatomical locations."
      ]
    ],
    "title": "Chapter 2: complete connections, correct locations",
    "sources": [
      [
        "Merck Manual: electrocardiography",
        "https://www.merckmanuals.com/professional/cardiovascular-disorders/cardiovascular-tests-and-procedures/electrocardiography"
      ],
      [
        "LITFL: ECG lead positioning",
        "https://litfl.com/ecg-lead-positioning/"
      ]
    ]
  },
  {
    "id": "2026-11-17",
    "cumulative": false,
    "objective": "distinguish what a corrected repeat ECG establishes from what remains uncertain about the earlier ECG",
    "teaching": "Chapter 2 application — a repeat recording is a new measurement. Correcting electrode positions improves the anatomical basis of the repeat ECG; it does not rewrite the original signals. If waveforms change, placement is a possible contributor. The repeat alone cannot establish that every earlier abnormality was caused by placement or exclude a cardiac change between recordings. Interpret the pair using acquisition information and clinical context.",
    "questions": [
      [
        "Chapter 1 · retrieve the viewing system",
        "From memory, list the leads that provide the frontal-plane views, then list those that provide the horizontal-plane views. Name each group’s usual lead-family label.",
        "Frontal (coronal) views: I, II, III, aVR, aVL, aVF — limb leads. Horizontal (transverse) views: V1 through V6 — chest or precordial leads. IV is not a standard lead; aVL is. These are electrical perspectives rather than literal anatomical images."
      ],
      [
        "Chapter 2 · retrieve the anatomical sites",
        "Sketch a sternum and label the patient’s right and left. Add V1 and V2 from memory, specifying the numbered intercostal space for each and its relation to the sternum. A written description is fine.",
        "V1: fourth intercostal space at the patient’s right sternal border. V2: fourth intercostal space at the patient’s left sternal border. The patient’s sides determine placement, regardless of the viewer’s position."
      ],
      [
        "Chapter 2 · hypothetical repeat recording",
        "An initial ECG used V1/V2 in the second intercostal spaces. A repeat uses the standard sites and looks different. A colleague concludes: “Every unusual feature in the first recording was therefore a placement artifact.” What does the repeat establish, and why is that conclusion stronger than the evidence?",
        "The repeat records signals from corrected V1/V2 locations; the initial recording remains acquired from nonstandard sites. Placement can contribute to the difference, but a changed recording alone cannot attribute every earlier feature to placement or exclude disease or a cardiac change between recordings."
      ],
      [
        "Chapters 1–2 · explain the comparison",
        "Write a two-sentence handoff note for this hypothetical pair. State the acquisition difference precisely and describe the limit on interpreting the waveform difference, without assigning a diagnosis.",
        "Example: Initial V1/V2 were recorded in the second intercostal spaces; the repeat used the fourth intercostal spaces at the patient’s right and left sternal borders, respectively. The acquisition change can affect the waveforms, so the difference alone does not establish improvement, deterioration, or the absence of disease. Equivalent wording is acceptable."
      ]
    ],
    "title": "Chapter 2: what a repeat recording establishes",
    "sources": [
      [
        "Merck Manual: electrocardiography",
        "https://www.merckmanuals.com/professional/cardiovascular-disorders/cardiovascular-tests-and-procedures/electrocardiography"
      ],
      [
        "LITFL: V1/V2 misplacement",
        "https://litfl.com/misplacement-of-v1-and-v2/"
      ]
    ]
  },
  {
    "id": "2026-11-18",
    "cumulative": false,
    "objective": "distinguish a physical electrode, an electrical lead, and a displayed trace",
    "teaching": "Application — separate the sensor, the measurement, and its presentation. A lead represents a defined voltage difference, giving an electrical perspective. A waveform trace displays that lead over time. Showing the same lead twice, or showing it for longer, does not create a new electrical view. Electrode position remains part of how the signal was acquired.",
    "concepts": [
      [
        "Electrode",
        "A physical sensor attached to the patient."
      ],
      [
        "Lead",
        "A defined voltage difference providing an electrical view."
      ],
      [
        "Displayed trace",
        "A waveform representation of a lead over time; copies can repeat the same view."
      ]
    ],
    "questions": [
      [
        "Chapter 1 · delayed corrected-error recall",
        "You are rebuilding an ECG display from a blank list. Name the six limb leads and their viewing plane, then the six chest leads and their viewing plane.",
        "Limb leads: I, II, III, aVR, aVL, aVF — frontal (coronal) plane. Chest leads: V1, V2, V3, V4, V5, V6 — horizontal (transverse) plane. IV is not a standard lead; aVL is. A lead is an electrical perspective, not an anatomical photograph."
      ],
      [
        "Chapter 2 · delayed placement recall",
        "Before attaching V1 and V2, explain to a trainee how to locate each standard site. Include the numbered space, exact sternal landmark, and whose right/left you use.",
        "V1: fourth intercostal space at the patient’s right sternal border. V2: fourth intercostal space at the patient’s left sternal border. Intercostal spaces lie between ribs; the patient’s sides determine placement."
      ],
      [
        "Chapter 1 · hypothetical report layout",
        "A report shows all 12 standard leads as short traces and also displays a longer strip of lead II. A colleague counts 13 traces and concludes there are 13 distinct electrical views. Explain the counting error.",
        "There are 13 displayed traces in this hypothetical layout but only 12 distinct standard leads. The additional strip repeats lead II over a longer duration; it adds time information, not another electrical perspective or another electrode."
      ],
      [
        "Chapters 1–2 · hypothetical duplicated signal",
        "A demo duplicates the stored V1 waveform into a second panel and labels that panel V2. The original V2 signal was not used. Explain why this does not supply a genuine V2 recording, then state the intended V2 electrode site.",
        "Copying a waveform changes presentation, not its underlying electrical measurement. The duplicate still represents the recorded V1 signal despite its V2 label. A standard V2 recording uses the chest electrode at the fourth intercostal space at the patient’s left sternal border, with the appropriate electrical reference; relabeling V1 cannot substitute for that acquisition."
      ]
    ],
    "title": "Chapters 1–2: a displayed trace is not another lead",
    "sources": [
      [
        "Merck Manual: electrocardiography",
        "https://www.merckmanuals.com/professional/cardiovascular-disorders/cardiovascular-tests-and-procedures/electrocardiography"
      ],
      [
        "LITFL: ECG lead positioning",
        "https://litfl.com/ecg-lead-positioning/"
      ]
    ]
  },
  {
    "id": "2026-11-19",
    "cumulative": true,
    "objective": "reconstruct the lead system and apply standard V1/V2 placement without reminders",
    "questions": [
      [
        "Chapter 1 · physical sensors and electrical views",
        "A trainee expects 12 skin electrodes for a standard 12-lead ECG. From memory, give the actual electrode count and explain why the number of leads can exceed the number of electrodes.",
        "A standard 12-lead ECG uses 10 electrodes: four limb and six chest electrodes. An electrode is a physical sensor; a lead represents a defined voltage difference providing an electrical view. Shared electrode signals and calculated references allow 12 leads from 10 electrodes."
      ],
      [
        "Chapter 2 · reconstruct placement",
        "Create a two-line anatomical checklist for V1 and V2. Include the exact intercostal space, sternal border, and whose right and left determine the location.",
        "V1: fourth intercostal space at the patient’s right sternal border. V2: fourth intercostal space at the patient’s left sternal border. Intercostal spaces are gaps between ribs; sides always refer to the patient, regardless of the operator’s viewpoint."
      ],
      [
        "Chapter 1 · corrected-error retrieval",
        "Without consulting a lead list, reconstruct all six limb-lead names. Then name the viewing plane of the limb leads and of V1–V6.",
        "The six limb leads are I, II, III, aVR, aVL, aVF. They provide frontal (coronal) views; V1–V6 are chest/precordial leads providing horizontal (transverse) views. IV is not a standard lead; aVL is. These are electrical perspectives, not literal pictures of separate structures."
      ],
      [
        "Chapters 1–2 · hypothetical comparison audit",
        "Two reports have identical lead labels. The first used V1/V2 in the second intercostal spaces; the second used standard placement, and the waveforms differ. A colleague says matching labels guarantee equivalent recording sites and the difference therefore proves a cardiac change. Identify both reasoning errors and describe what the comparison leaves uncertain.",
        "Matching labels identify intended views but do not verify physical electrode locations. The documented placement difference changes acquisition conditions and can contribute to waveform differences. The comparison alone does not determine whether placement, a cardiac change, or both explain the difference, and it does not exclude disease."
      ]
    ],
    "title": "Day 14: reconstruct and apply Chapters 1–2",
    "sources": [
      [
        "Merck Manual: electrocardiography",
        "https://www.merckmanuals.com/professional/cardiovascular-disorders/cardiovascular-tests-and-procedures/electrocardiography"
      ],
      [
        "LITFL: V1/V2 misplacement",
        "https://litfl.com/misplacement-of-v1-and-v2/"
      ]
    ]
  }
];
