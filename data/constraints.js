const CONSTRAINTS_DATA = [
  // ── Spinal Cord ──────────────────────────────────────
  {id:1,organ:"Spinal Cord",param:"Dmax",limit:45,unit:"Gy",tech:"Conventional",source:"RTOG",notes:"Serial OAR"},
  {id:2,organ:"Spinal Cord",param:"Dmax",limit:50,unit:"Gy",tech:"Conventional",source:"QUANTEC",notes:"≤0.2% myelopathy risk"},
  {id:3,organ:"Spinal Cord",param:"Dmax",limit:14,unit:"Gy",tech:"SBRT_1fx",source:"TG-101",notes:"Point max (0.035cc)"},
  {id:4,organ:"Spinal Cord",param:"Dmax",limit:10,unit:"Gy",tech:"SBRT_1fx",source:"RTOG 0631",notes:""},
  {id:5,organ:"Spinal Cord",param:"Dmax",limit:21.9,unit:"Gy",tech:"SBRT_3fx",source:"TG-101",notes:"Point max"},
  {id:6,organ:"Spinal Cord",param:"Dmax",limit:30,unit:"Gy",tech:"SBRT_5fx",source:"TG-101",notes:"Point max"},
  // ── Brainstem ─────────────────────────────────────────
  {id:7,organ:"Brainstem",param:"Dmax",limit:54,unit:"Gy",tech:"Conventional",source:"QUANTEC",notes:"<5% necrosis risk"},
  {id:8,organ:"Brainstem",param:"Dmax",limit:60,unit:"Gy",tech:"Conventional",source:"RTOG",notes:"Small volume acceptable"},
  {id:9,organ:"Brainstem",param:"Dmax",limit:15,unit:"Gy",tech:"SBRT_1fx",source:"TG-101",notes:"Point max"},
  {id:10,organ:"Brainstem",param:"Dmax",limit:23.1,unit:"Gy",tech:"SBRT_3fx",source:"TG-101",notes:"Point max"},
  // ── Optic Nerve / Chiasm ──────────────────────────────
  {id:11,organ:"Optic Nerve",param:"Dmax",limit:54,unit:"Gy",tech:"Conventional",source:"QUANTEC",notes:"<1% neuropathy"},
  {id:12,organ:"Optic Chiasm",param:"Dmax",limit:54,unit:"Gy",tech:"Conventional",source:"QUANTEC",notes:""},
  {id:13,organ:"Optic Nerve",param:"Dmax",limit:12,unit:"Gy",tech:"SBRT_1fx",source:"TG-101",notes:""},
  {id:14,organ:"Optic Chiasm",param:"Dmax",limit:12,unit:"Gy",tech:"SBRT_1fx",source:"TG-101",notes:""},
  // ── Cochlea ───────────────────────────────────────────
  {id:15,organ:"Cochlea",param:"Dmean",limit:35,unit:"Gy",tech:"Conventional",source:"QUANTEC",notes:"<30% hearing loss"},
  {id:16,organ:"Cochlea",param:"Dmean",limit:45,unit:"Gy",tech:"Conventional",source:"RTOG 0225",notes:""},
  // ── Parotid ───────────────────────────────────────────
  {id:17,organ:"Parotid (bilateral)",param:"Dmean",limit:25,unit:"Gy",tech:"Conventional",source:"QUANTEC",notes:"<20% xerostomia risk"},
  {id:18,organ:"Parotid (one)",param:"Dmean",limit:20,unit:"Gy",tech:"Conventional",source:"QUANTEC",notes:"Spare one gland"},
  // ── Lung ──────────────────────────────────────────────
  {id:19,organ:"Lung",param:"MLD",limit:20,unit:"Gy",tech:"Conventional",source:"QUANTEC",notes:"<20% pneumonitis risk"},
  {id:20,organ:"Lung",param:"MLD",limit:7,unit:"Gy",tech:"Conventional",source:"RTOG 0617",notes:"Bilateral lung"},
  {id:21,organ:"Lung",param:"V20",limit:37,unit:"%",tech:"Conventional",source:"QUANTEC",notes:"<20% symptomatic pneumonitis"},
  {id:22,organ:"Lung",param:"V20",limit:35,unit:"%",tech:"Conventional",source:"RTOG",notes:""},
  {id:23,organ:"Lung",param:"V5",limit:65,unit:"%",tech:"Conventional",source:"RTOG 0617",notes:"Bilateral V5"},
  {id:24,organ:"Lung",param:"V12.5",limit:1500,unit:"cc",tech:"SBRT_1fx",source:"RTOG 0915/TG-101",notes:"Total lung - ITV"},
  {id:25,organ:"Lung",param:"V12.5",limit:1000,unit:"cc",tech:"SBRT_3fx",source:"TG-101",notes:""},
  {id:26,organ:"Lung",param:"V11.6",limit:700,unit:"cc",tech:"SBRT_5fx",source:"TG-101",notes:""},
  // ── Heart ─────────────────────────────────────────────
  {id:27,organ:"Heart",param:"Dmean",limit:26,unit:"Gy",tech:"Conventional",source:"QUANTEC",notes:"<15% cardiac mortality risk"},
  {id:28,organ:"Heart",param:"V30",limit:46,unit:"%",tech:"Conventional",source:"QUANTEC",notes:""},
  {id:29,organ:"Heart",param:"V25",limit:10,unit:"%",tech:"Conventional",source:"RTOG 0617",notes:""},
  {id:30,organ:"Pericardium",param:"Dmean",limit:26,unit:"Gy",tech:"Conventional",source:"RTOG",notes:""},
  {id:31,organ:"Heart",param:"Dmax",limit:22,unit:"Gy",tech:"SBRT_1fx",source:"TG-101",notes:""},
  {id:32,organ:"Heart",param:"Dmax",limit:30,unit:"Gy",tech:"SBRT_3fx",source:"TG-101",notes:""},
  // ── Esophagus ─────────────────────────────────────────
  {id:33,organ:"Esophagus",param:"Dmax",limit:74,unit:"Gy",tech:"Conventional",source:"QUANTEC",notes:"<30% stenosis/fistula"},
  {id:34,organ:"Esophagus",param:"Dmean",limit:34,unit:"Gy",tech:"Conventional",source:"QUANTEC",notes:""},
  {id:35,organ:"Esophagus",param:"V35",limit:50,unit:"%",tech:"Conventional",source:"RTOG 0617",notes:""},
  {id:36,organ:"Esophagus",param:"Dmax",limit:15.4,unit:"Gy",tech:"SBRT_1fx",source:"TG-101",notes:""},
  {id:37,organ:"Esophagus",param:"Dmax",limit:25.2,unit:"Gy",tech:"SBRT_3fx",source:"TG-101",notes:""},
  // ── Liver ─────────────────────────────────────────────
  {id:38,organ:"Liver",param:"Dmean",limit:30,unit:"Gy",tech:"Conventional",source:"QUANTEC",notes:"<5% RILD at 1 yr"},
  {id:39,organ:"Liver",param:"Dmean",limit:32,unit:"Gy",tech:"Conventional",source:"QUANTEC",notes:"<50% RILD at 1 yr"},
  {id:40,organ:"Liver",param:"V30",limit:60,unit:"%",tech:"Conventional",source:"QUANTEC",notes:"Normal liver function"},
  {id:41,organ:"Liver (normal)",param:"Volume",limit:700,unit:"cc",tech:"SBRT_3fx",source:"TG-101",notes:"Normal liver ≥700cc"},
  {id:42,organ:"Liver (normal)",param:"Volume",limit:700,unit:"cc",tech:"SBRT_5fx",source:"TG-101",notes:""},
  // ── Kidney ────────────────────────────────────────────
  {id:43,organ:"Kidney (bilateral)",param:"Dmean",limit:18,unit:"Gy",tech:"Conventional",source:"QUANTEC",notes:"<5% nephropathy"},
  {id:44,organ:"Kidney (bilateral)",param:"Dmean",limit:28,unit:"Gy",tech:"Conventional",source:"QUANTEC",notes:"<50% nephropathy"},
  {id:45,organ:"Kidney",param:"V20",limit:32,unit:"%",tech:"Conventional",source:"QUANTEC",notes:"Each kidney"},
  {id:46,organ:"Kidney (contralateral)",param:"Dmean",limit:15,unit:"Gy",tech:"SBRT_3fx",source:"TG-101",notes:""},
  // ── Bowel / Small Intestine ───────────────────────────
  {id:47,organ:"Small Bowel",param:"V45",limit:195,unit:"cc",tech:"Conventional",source:"QUANTEC",notes:"<10% grade≥3 toxicity"},
  {id:48,organ:"Small Bowel",param:"Dmax",limit:50,unit:"Gy",tech:"Conventional",source:"RTOG",notes:""},
  {id:49,organ:"Small Bowel",param:"Dmax",limit:15.4,unit:"Gy",tech:"SBRT_1fx",source:"TG-101",notes:""},
  {id:50,organ:"Small Bowel",param:"Dmax",limit:22.2,unit:"Gy",tech:"SBRT_3fx",source:"TG-101",notes:""},
  {id:51,organ:"Small Bowel",param:"Dmax",limit:35,unit:"Gy",tech:"SBRT_5fx",source:"TG-101",notes:""},
  // ── Colon / Rectum ────────────────────────────────────
  {id:52,organ:"Rectum",param:"V50",limit:50,unit:"%",tech:"Conventional",source:"QUANTEC",notes:"Prostate RT"},
  {id:53,organ:"Rectum",param:"V65",limit:25,unit:"%",tech:"Conventional",source:"RTOG",notes:""},
  {id:54,organ:"Rectum",param:"V70",limit:20,unit:"%",tech:"Conventional",source:"RTOG",notes:""},
  {id:55,organ:"Rectum",param:"V75",limit:15,unit:"%",tech:"Conventional",source:"QUANTEC",notes:""},
  {id:56,organ:"Colon",param:"Dmax",limit:18.4,unit:"Gy",tech:"SBRT_1fx",source:"TG-101",notes:""},
  {id:57,organ:"Colon",param:"Dmax",limit:28.2,unit:"Gy",tech:"SBRT_3fx",source:"TG-101",notes:""},
  // ── Bladder ───────────────────────────────────────────
  {id:58,organ:"Bladder",param:"V65",limit:50,unit:"%",tech:"Conventional",source:"RTOG",notes:"Prostate RT"},
  {id:59,organ:"Bladder",param:"V80",limit:15,unit:"%",tech:"Conventional",source:"RTOG",notes:""},
  {id:60,organ:"Bladder",param:"Dmax",limit:18.4,unit:"Gy",tech:"SBRT_1fx",source:"TG-101",notes:""},
  {id:61,organ:"Bladder",param:"Dmax",limit:28.2,unit:"Gy",tech:"SBRT_3fx",source:"TG-101",notes:""},
  // ── Femoral Heads ─────────────────────────────────────
  {id:62,organ:"Femoral Head (bilateral)",param:"V50",limit:5,unit:"%",tech:"Conventional",source:"RTOG",notes:"Pelvic RT"},
  {id:63,organ:"Femoral Head",param:"Dmax",limit:52,unit:"Gy",tech:"Conventional",source:"QUANTEC",notes:"<5% fracture risk"},
  // ── Brachial Plexus ───────────────────────────────────
  {id:64,organ:"Brachial Plexus",param:"Dmax",limit:66,unit:"Gy",tech:"Conventional",source:"QUANTEC",notes:"<5% neuropathy"},
  {id:65,organ:"Brachial Plexus",param:"Dmax",limit:17.5,unit:"Gy",tech:"SBRT_1fx",source:"TG-101",notes:""},
  {id:66,organ:"Brachial Plexus",param:"Dmax",limit:24,unit:"Gy",tech:"SBRT_3fx",source:"TG-101",notes:""},
  {id:67,organ:"Brachial Plexus",param:"Dmax",limit:32,unit:"Gy",tech:"SBRT_5fx",source:"TG-101",notes:""},
  // ── Trachea / Bronchus ────────────────────────────────
  {id:68,organ:"Trachea/Bronchus",param:"Dmax",limit:20.2,unit:"Gy",tech:"SBRT_1fx",source:"TG-101",notes:"Proximal airway"},
  {id:69,organ:"Trachea/Bronchus",param:"Dmax",limit:30,unit:"Gy",tech:"SBRT_3fx",source:"TG-101",notes:""},
  {id:70,organ:"Trachea/Bronchus",param:"Dmax",limit:40,unit:"Gy",tech:"SBRT_5fx",source:"TG-101",notes:""},
  // ── Great Vessels ─────────────────────────────────────
  {id:71,organ:"Great Vessels",param:"Dmax",limit:37,unit:"Gy",tech:"SBRT_1fx",source:"TG-101",notes:"Aorta, SVC, IVC, PA"},
  {id:72,organ:"Great Vessels",param:"Dmax",limit:45,unit:"Gy",tech:"SBRT_3fx",source:"TG-101",notes:""},
  // ── Brain ─────────────────────────────────────────────
  {id:73,organ:"Brain",param:"Dmax",limit:72,unit:"Gy",tech:"Conventional",source:"QUANTEC",notes:"<5% necrosis"},
  {id:74,organ:"Brain",param:"V60",limit:3,unit:"%",tech:"Conventional",source:"RTOG",notes:"SRS context"},
  {id:75,organ:"Lens",param:"Dmax",limit:7,unit:"Gy",tech:"Conventional",source:"QUANTEC",notes:"<5% cataract"},
  {id:76,organ:"Retina",param:"Dmax",limit:50,unit:"Gy",tech:"Conventional",source:"QUANTEC",notes:""},
  // ── Stomach ───────────────────────────────────────────
  {id:77,organ:"Stomach",param:"Dmax",limit:18,unit:"Gy",tech:"SBRT_1fx",source:"TG-101",notes:""},
  {id:78,organ:"Stomach",param:"Dmax",limit:22.2,unit:"Gy",tech:"SBRT_3fx",source:"TG-101",notes:""},
  {id:79,organ:"Stomach",param:"Dmax",limit:35,unit:"Gy",tech:"SBRT_5fx",source:"TG-101",notes:""},
  // ── Duodenum ──────────────────────────────────────────
  {id:80,organ:"Duodenum",param:"Dmax",limit:16,unit:"Gy",tech:"SBRT_1fx",source:"TG-101",notes:""},
  {id:81,organ:"Duodenum",param:"Dmax",limit:22.2,unit:"Gy",tech:"SBRT_3fx",source:"TG-101",notes:""},
  {id:82,organ:"Duodenum",param:"V25",limit:45,unit:"cc",tech:"Conventional",source:"QUANTEC",notes:"Pancreas/UGI RT"},
  // ── Mandible ──────────────────────────────────────────
  {id:83,organ:"Mandible",param:"Dmax",limit:70,unit:"Gy",tech:"Conventional",source:"RTOG",notes:"<10% osteoradionecrosis"},
  {id:84,organ:"Mandible",param:"Dmean",limit:39,unit:"Gy",tech:"Conventional",source:"QUANTEC",notes:""},
  // ── Skin ──────────────────────────────────────────────
  {id:85,organ:"Skin",param:"Dmax",limit:26,unit:"Gy",tech:"SBRT_1fx",source:"TG-101",notes:"Surface dose"},
  {id:86,organ:"Skin",param:"Dmax",limit:33,unit:"Gy",tech:"SBRT_3fx",source:"TG-101",notes:""},
  // ── Chest Wall ────────────────────────────────────────
  {id:87,organ:"Chest Wall",param:"V30",limit:30,unit:"cc",tech:"SBRT_1fx",source:"TG-101",notes:"Rib fracture risk"},
  {id:88,organ:"Chest Wall",param:"V32",limit:30,unit:"cc",tech:"SBRT_3fx",source:"TG-101",notes:""},
  {id:89,organ:"Chest Wall",param:"V35",limit:200,unit:"cc",tech:"SBRT_5fx",source:"TG-101",notes:""},
];
