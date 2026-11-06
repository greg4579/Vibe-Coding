// Editable learning content, exercise answers, and mixed recall for chapters 2–4.
const q = (chapter, text, options, answer, explanation) => ({chapter,text,options,answer,explanation});
const philips = ['Philips · conventional electrode placement','https://www.philips.com/c-dam/b2bhc/master/Products/Category/supplies/ecg/ecg-lead-placements-poster.pdf'];
const scst = ['SCST · recording a standard 12-lead ECG','https://www.bmj.com/sites/default/files/response_attachments/2016/09/CAC_SCST_Recording_a_12-lead_ECG_final_version_2014_CS2v2.0.pdf'];
const axes = ['MIT OpenCourseWare · introduction to clinical electrocardiography','https://ocw.mit.edu/courses/hst-582j-biomedical-signal-and-image-processing-spring-2007/b3eebd1d65ca56833cf61e7c3975512b_l3_ecg_reisner.pdf'];
const vectors = ['BMJ · leads, rate, rhythm, and cardiac axis','https://pmc.ncbi.nlm.nih.gov/articles/PMC1122339/'];
const regions = ['Maine EMS · 12-lead acquisition and conventional lead groups','https://www.maine.gov/ems/sites/maine.gov.ems/files/inline-files/20211116-MEMS-EMT-12-Lead-Placement-JobAid.pdf'];
const foundational = q(1,'A standard 12-lead ECG uses how many physical electrodes?',['6','8','10','12'],'10','Four limb electrodes plus six chest electrodes give 10 physical contacts, used to obtain 12 electrical views.');
const planes = q(1,'Which lead family views the frontal plane?',['V1–V6','I, II, III, aVR, aVL, aVF','Only V1 and V2','Only V5 and V6'],'I, II, III, aVR, aVL, aVF','The six limb leads view the frontal plane; the chest leads view the horizontal plane.');
export const chapters = {
  2: {
    title:'Place the electrodes', sources:[philips,scst],
    lessons:[
      {tab:'V1 & V2', title:'Anchor the sternal pair', paragraphs:['Use the patient’s right and left. Viewed from the front, their right appears on your left. An intercostal space is a gap between ribs.','V1 sits in the fourth intercostal space at the right sternal border; V2 sits in the fourth space at the left sternal border. Locate each side’s landmark.'], visual:'placement', highlights:['V1','V2'], cue:'V1 right. V2 left. Both fourth space.', point:'Count the spaces; a visually plausible spot high on the chest is not enough.', legend:['V1 · 4th space, right sternal border','V2 · 4th space, left sternal border']},
      {tab:'V4 before V3', title:'Set V4, then bridge the gap', paragraphs:['V4 belongs in the fifth intercostal space on the left midclavicular line: a vertical line through the midpoint of the collarbone.','Place V3 midway between the V2 and V4 electrode positions. Find V4 first so that “midway” has two defined endpoints.'], visual:'placement', highlights:['V3','V4'], cue:'Locate V4 before V3.', point:'V3 is halfway between two electrode positions; it has no separate fixed intercostal-space rule.', legend:['V4 · 5th space, left midclavicular line','V3 · midway between V2 and V4']},
      {tab:'Stay level', title:'Carry V4’s level around the left chest', paragraphs:['V5 is on the left anterior axillary line, along the front fold of the armpit. V6 is on the left midaxillary line, down from the middle of the armpit.','Both stay horizontally level with V4. Do not follow a rib downwards to place V5 and V6.','For standard diagnostic placement, RA and LA go on the arms and RL and LL on the lower legs. Torso configurations used for some monitoring workflows are a different placement. RL is the reference electrode.'], visual:'placement', highlights:['V4','V5','V6'], cue:'V4 → V5 → V6: one horizontal level.', point:'Six chest electrodes plus four limb electrodes. A location on the body is an electrode site; the resulting lead is an electrical view.', legend:['V5 · anterior axillary line, level with V4','V6 · midaxillary line, level with V4']}
    ],
    practiceTitle:'Match each chest electrode to its landmark', practiceIntro:'Choose an electrode, then its landmark. Correct a mistake immediately; complete all six pairs.',
    items:['V1','V2','V3','V4','V5','V6'],
    choices:['4th space · right sternal border','5th space · left midclavicular line','Left midaxillary line · level with V4','4th space · left sternal border','Midway between V2 and V4','Left anterior axillary line · level with V4'],
    matches:{V1:0,V2:3,V3:4,V4:1,V5:5,V6:2},
    recall:[
      q(2,'Which site is correct for V1?',['4th space, left sternal border','5th space, left midclavicular line','4th space, right sternal border','Left anterior axillary line'],'4th space, right sternal border','V1 is at the right sternal border in the fourth intercostal space. V2 uses the left sternal border.'),
      q(2,'Which electrode should be located before placing V3 midway between its endpoints?',['V4','V5','V6','RL'],'V4','V3 lies midway between V2 and V4, so both endpoints must be located first.'),
      q(2,'How should V5 and V6 align?',['Follow the fifth rib downwards','Align with V2 at the sternum','Use the same distance from the navel','Stay horizontally level with V4'],'Stay horizontally level with V4','V5 and V6 use their axillary landmarks at the horizontal level of V4.'), foundational, planes
    ]
  },
  3: {
    title:'Read the viewing angles', sources:[axes,vectors],
    lessons:[
      {tab:'The limb compass', title:'Each limb lead has a positive direction', paragraphs:['Imagine a compass centered on the heart in the frontal plane. Lead I points toward the patient’s left at 0°; aVF points toward the feet at +90°.','The other positive directions are II +60°, III +120°, aVL −30°, and aVR −150°. These are lead directions, not an individual patient’s measured cardiac axis.'], visual:'axes', cue:'I points left. aVF points down.', point:'Right and left refer to the patient. On this front view, the patient’s left is on your right.'},
      {tab:'Toward & away', title:'Why the same electrical event can point up or down', paragraphs:['For ventricular depolarization, a net vector toward a lead’s positive pole produces a positive net QRS deflection. A net vector away produces a negative net deflection.','When the mean direction is perpendicular to the lead, the net QRS is near zero. A changing activation sequence can produce an approximately balanced positive and negative complex.'], visual:'direction', cue:'Toward positive → net up. Away → net down.', point:'These are simplified depolarization examples. “Down” on the tracing describes voltage polarity, not the physical direction the heart is moving.'},
      {tab:'Connect the views', title:'Separate the viewing direction from the patient’s axis', paragraphs:['The lead directions stay fixed by convention. The patient’s net ventricular depolarization direction can vary; comparing lead polarities helps describe it.','The six limb leads form the frontal compass. V1–V6 provide complementary horizontal-plane views; their locations do not belong on this limb-lead compass.'], visual:'axes', cue:'Lead angle is the viewpoint; cardiac axis is the net direction.', point:'First learn the viewpoints and polarity. Calculating a clinical axis and interpreting abnormal patterns come later.'}
    ],
    practiceTitle:'Build the limb-lead compass', practiceIntro:'Choose a limb lead, then its positive direction. Match all six without opening the diagram.',
    items:['aVF','I','aVR','II','aVL','III'], choices:['−150°','+90°','+120°','0°','−30°','+60°'], matches:{aVF:1,I:3,aVR:0,II:5,aVL:4,III:2},
    recall:[
      q(3,'Which lead’s positive direction points straight toward the feet?',['I','aVL','aVR','aVF'],'aVF','aVF points inferiorly at +90° in the frontal plane.'),
      q(3,'A net ventricular depolarization vector points away from a lead’s positive pole. What net QRS polarity is expected?',['Positive','Negative','Always perfectly flat','Unrelated to direction'],'Negative','The projection away from the positive pole is negative. This refers to the net QRS in this simplified example.'),
      q(3,'What is lead I’s positive direction?',['+90°','−150°','0°','+120°'],'0°','Lead I points toward the patient’s left at 0°. This is the lead’s direction, rather than the patient’s measured cardiac axis.'),
      q(2,'V3 lies midway between which two electrode sites?',['V2 and V4','V1 and V2','V4 and V6','V5 and V6'],'V2 and V4','Locate V2 and V4, then place V3 midway between them.'), planes
    ]
  },
  4: {
    title:'Connect leads to heart regions', sources:[regions],
    lessons:[
      {tab:'Inferior', title:'Recognize the inferior lead group', paragraphs:['II, III, and aVF are the conventional inferior group. They provide related views toward the lower aspect of the heart.','Use the group as a memory unit: II, III, aVF. Look at related leads together when you later learn waveform interpretation.'], visual:'regions', region:'Inferior', cue:'Inferior = II, III, aVF.', point:'This chapter teaches conventional lead groups. A group label does not by itself establish a diagnosis or identify a coronary artery.'},
      {tab:'Lateral', title:'Connect limb and chest views of the lateral region', paragraphs:['I and aVL are commonly called high lateral leads. V5 and V6 are the lateral chest leads.','One region can therefore have views in two planes: I and aVL in the frontal plane, V5 and V6 in the horizontal plane.'], visual:'regions', region:'Lateral', cue:'Lateral = I, aVL, V5, V6.', point:'“Limb versus chest” and “inferior versus lateral” answer different questions: viewing plane and conventional regional grouping.'},
      {tab:'Chest groups', title:'Add the conventional septal and anterior groups', paragraphs:['In the traditional introductory map, V1–V2 are labeled septal and V3–V4 anterior. You will also see V1–V4 discussed together as anterior or anteroseptal leads. These are simplified labels, not a precise anatomical map.','aVR retains a useful rightward/superior view but sits outside this four-group memory exercise. Do not treat it as a missing or disposable lead.','Position on the printed report is not the same as anatomical adjacency. For example, I, II, and III may be stacked together while belonging to different regional groups.'], visual:'regions', region:'Septal', cue:'V1–V2 septal; V3–V4 anterior; V5–V6 lateral.', point:'Learn the conventional labels first. Precise localization needs the full ECG and clinical context.'}
    ],
    practiceTitle:'Sort leads into their conventional regions', practiceIntro:'Choose a lead, then its introductory region group. This drill uses 11 leads; aVR remains outside these four groups.',
    items:['V3','aVF','I','V1','V5','III','V4','aVL','V2','II','V6'], choices:['Inferior','Septal','Anterior','Lateral'], matches:{V3:2,aVF:0,I:3,V1:1,V5:3,III:0,V4:2,aVL:3,V2:1,II:0,V6:3},
    recall:[
      q(4,'Which set forms the conventional inferior group?',['I, aVL, V5, V6','V1, V2','II, III, aVF','V3, V4'],'II, III, aVF','II, III, and aVF form the inferior group.'),
      q(4,'Which group combines I, aVL, V5, and V6?',['Lateral','Inferior','Septal','Anterior'],'Lateral','The lateral group includes limb leads I and aVL plus chest leads V5 and V6.'),
      q(4,'In the traditional introductory map, how are V3 and V4 grouped?',['Inferior','Lateral','Septal','Anterior'],'Anterior','V3 and V4 are conventionally called anterior. These teaching labels do not precisely map every anatomical structure.'),
      q(3,'A net ventricular depolarization vector points toward a lead’s positive pole. What net QRS polarity is expected?',['Always flat','Positive','Negative','Determined only by heart rate'],'Positive','A vector directed toward the positive pole has a positive projection in that lead.'),
      q(2,'V5 should be at which vertical level?',['Level with V1','Always at the bottom of the fifth rib','Horizontally level with V4','Level with the navel'],'Horizontally level with V4','Place V5 at the left anterior axillary line, horizontally level with V4; V6 also stays at that level.')
    ]
  }
};
export const freshRecall = () => ({index:0,selected:null,checked:false,score:0,finished:false,missed:[]});
