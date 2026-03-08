// SELA RadOnc Tools — Dose Constraint Data
// Sources: RTOG, QUANTEC (Red Journal 2010), AAPM TG-101 (SBRT)

// id format: source_organ_technique_index
const CONSTRAINTS_DATA = [

  // ══════════════════════════════════════════
  //  CONVENTIONAL FRACTIONATION (1.8–2.0 Gy/fx)
  // ══════════════════════════════════════════

  // ── SPINAL CORD (Conv) ──
  { id:'rtog_cord_conv_1',   organ:'Spinal Cord 脊髓',    tech:'Conv',     source:'RTOG',    constraint:'Dmax ≤ 45 Gy',       note:'Standard fractionation' },
  { id:'quant_cord_conv_1',  organ:'Spinal Cord 脊髓',    tech:'Conv',     source:'QUANTEC', constraint:'Dmax ≤ 50 Gy',       note:'<0.2% myelopathy risk; 45Gy if prior RT' },
  { id:'quant_cord_conv_2',  organ:'Spinal Cord 脊髓',    tech:'Conv',     source:'QUANTEC', constraint:'V50 < 0.03 cc',      note:'Cord volume receiving 50Gy' },

  // ── BRAIN (Conv) ──
  { id:'quant_brain_conv_1', organ:'Brain Stem 腦幹',      tech:'Conv',     source:'QUANTEC', constraint:'Dmax ≤ 54 Gy',       note:'1.8Gy/fx; <5% neuropathy risk' },
  { id:'quant_brain_conv_2', organ:'Brain Stem 腦幹',      tech:'Conv',     source:'QUANTEC', constraint:'D1cc ≤ 59 Gy',       note:'Small volume tolerance' },
  { id:'quant_optic_conv_1', organ:'Optic Nerve/Chiasm 視神經/視交叉', tech:'Conv', source:'QUANTEC', constraint:'Dmax ≤ 55 Gy', note:'<3% optic neuropathy' },
  { id:'quant_optic_conv_2', organ:'Optic Nerve/Chiasm 視神經/視交叉', tech:'Conv', source:'QUANTEC', constraint:'Dmax ≤ 60 Gy', note:'<7% risk; use with caution' },
  { id:'quant_retina_conv_1',organ:'Retina 視網膜',         tech:'Conv',     source:'QUANTEC', constraint:'Dmax < 45 Gy',       note:'<1% retinopathy' },
  { id:'quant_lens_conv_1',  organ:'Lens 水晶體',           tech:'Conv',     source:'QUANTEC', constraint:'Dmax < 10 Gy',       note:'<5% cataract requiring surgery' },
  { id:'quant_cochlea_conv_1',organ:'Cochlea 耳蝸',         tech:'Conv',     source:'QUANTEC', constraint:'Dmean < 45 Gy',      note:'<30% hearing loss risk' },
  { id:'quant_cochlea_conv_2',organ:'Cochlea 耳蝸',         tech:'Conv',     source:'QUANTEC', constraint:'Dmean < 35 Gy',      note:'Preferred; concurrent cisplatin' },

  // ── PAROTID (Conv) ──
  { id:'quant_parotid_conv_1',organ:'Parotid 腮腺 (bilateral)', tech:'Conv', source:'QUANTEC', constraint:'Dmean < 25 Gy (both)', note:'<20% xerostomia risk' },
  { id:'quant_parotid_conv_2',organ:'Parotid 腮腺 (one side)', tech:'Conv',  source:'QUANTEC', constraint:'Dmean < 20 Gy (one)', note:'Spare at least one parotid' },

  // ── LUNG (Conv) ──
  { id:'quant_lung_conv_1',  organ:'Lung 肺（雙側）',        tech:'Conv',     source:'QUANTEC', constraint:'MLD < 20 Gy',        note:'<20% pneumonitis risk; V20<30%' },
  { id:'quant_lung_conv_2',  organ:'Lung 肺（雙側）',        tech:'Conv',     source:'QUANTEC', constraint:'V20 < 30%',          note:'Grade ≥3 pneumonitis risk <10%' },
  { id:'quant_lung_conv_3',  organ:'Lung 肺（雙側）',        tech:'Conv',     source:'QUANTEC', constraint:'V5 < 65%',           note:'Combined with V20' },
  { id:'rtog_lung_conv_1',   organ:'Lung 肺（雙側）',        tech:'Conv',     source:'RTOG',    constraint:'V20 < 35%',          note:'RTOG 0617; lung cancer' },
  { id:'rtog_lung_conv_2',   organ:'Lung 肺（雙側）',        tech:'Conv',     source:'RTOG',    constraint:'MLD < 20 Gy',        note:'RTOG 0617' },

  // ── HEART (Conv) ──
  { id:'quant_heart_conv_1', organ:'Heart 心臟',             tech:'Conv',     source:'QUANTEC', constraint:'V25 < 10%',          note:'<1% pericarditis' },
  { id:'quant_heart_conv_2', organ:'Heart 心臟',             tech:'Conv',     source:'QUANTEC', constraint:'Dmean < 26 Gy',      note:'Long-term cardiac toxicity' },
  { id:'rtog_heart_conv_1',  organ:'Heart 心臟',             tech:'Conv',     source:'RTOG',    constraint:'V30 < 46%',          note:'RTOG 0617; lung' },
  { id:'rtog_heart_conv_2',  organ:'Heart 心臟',             tech:'Conv',     source:'RTOG',    constraint:'Dmean < 20 Gy',      note:'Breast: reduce cardiac dose' },

  // ── ESOPHAGUS (Conv) ──
  { id:'quant_esoph_conv_1', organ:'Esophagus 食道',         tech:'Conv',     source:'QUANTEC', constraint:'Dmean < 34 Gy',      note:'<30% Grade 2+ esophagitis' },
  { id:'quant_esoph_conv_2', organ:'Esophagus 食道',         tech:'Conv',     source:'QUANTEC', constraint:'V35 < 50%',          note:'Concurrent chemo' },
  { id:'rtog_esoph_conv_1',  organ:'Esophagus 食道',         tech:'Conv',     source:'RTOG',    constraint:'V60 < 17%',          note:'RTOG 0617' },

  // ── LIVER (Conv) ──
  { id:'quant_liver_conv_1', organ:'Liver 肝臟',             tech:'Conv',     source:'QUANTEC', constraint:'Dmean < 28 Gy',      note:'<5% RILD risk; normal liver' },
  { id:'quant_liver_conv_2', organ:'Liver 肝臟',             tech:'Conv',     source:'QUANTEC', constraint:'Dmean < 32 Gy',      note:'Child-Pugh A' },
  { id:'quant_liver_conv_3', organ:'Liver 肝臟',             tech:'Conv',     source:'QUANTEC', constraint:'Normal liver V30 > 700cc', note:'Maintain functional liver volume' },

  // ── KIDNEY (Conv) ──
  { id:'quant_kidney_conv_1',organ:'Kidney 腎臟（雙側）',   tech:'Conv',     source:'QUANTEC', constraint:'Dmean < 18 Gy (both)', note:'<5% nephropathy' },
  { id:'quant_kidney_conv_2',organ:'Kidney 腎臟（雙側）',   tech:'Conv',     source:'QUANTEC', constraint:'V20 < 32% (both)',    note:'Combined kidney constraint' },
  { id:'quant_kidney_conv_3',organ:'Kidney 腎臟（雙側）',   tech:'Conv',     source:'QUANTEC', constraint:'V12 < 55% (both)',    note:'V12 combined' },

  // ── BOWEL/SMALL INTESTINE (Conv) ──
  { id:'quant_bowel_conv_1', organ:'Small Bowel 小腸',       tech:'Conv',     source:'QUANTEC', constraint:'V45 < 195cc',        note:'<10% Grade 3+ toxicity' },
  { id:'quant_bowel_conv_2', organ:'Small Bowel 小腸',       tech:'Conv',     source:'QUANTEC', constraint:'Dmax < 50 Gy',       note:'Hotspot constraint' },
  { id:'rtog_bowel_conv_1',  organ:'Bowel Bag 腹腔腸袋',    tech:'Conv',     source:'RTOG',    constraint:'V45 < 195cc',        note:'RTOG 1203; GI toxicity' },

  // ── RECTUM (Conv) ──
  { id:'quant_rect_conv_1',  organ:'Rectum 直腸',            tech:'Conv',     source:'QUANTEC', constraint:'V50 < 50%',          note:'<15% Grade 3+ toxicity' },
  { id:'quant_rect_conv_2',  organ:'Rectum 直腸',            tech:'Conv',     source:'QUANTEC', constraint:'V60 < 35%',          note:'Rectal bleeding endpoint' },
  { id:'quant_rect_conv_3',  organ:'Rectum 直腸',            tech:'Conv',     source:'QUANTEC', constraint:'V65 < 25%',          note:'' },
  { id:'quant_rect_conv_4',  organ:'Rectum 直腸',            tech:'Conv',     source:'QUANTEC', constraint:'V70 < 20%',          note:'Prostate RT' },
  { id:'rtog_rect_conv_1',   organ:'Rectum 直腸',            tech:'Conv',     source:'RTOG',    constraint:'V75 < 15%',          note:'RTOG 0415; prostate' },

  // ── BLADDER (Conv) ──
  { id:'quant_blad_conv_1',  organ:'Bladder 膀胱',           tech:'Conv',     source:'QUANTEC', constraint:'V65 < 50%',          note:'<6% Grade 3 toxicity' },
  { id:'quant_blad_conv_2',  organ:'Bladder 膀胱',           tech:'Conv',     source:'QUANTEC', constraint:'V80 < 15%',          note:'Prostate/cervix RT' },
  { id:'rtog_blad_conv_1',   organ:'Bladder 膀胱',           tech:'Conv',     source:'RTOG',    constraint:'V80 < 15%',          note:'RTOG 0415' },

  // ── FEMORAL HEAD (Conv) ──
  { id:'quant_fem_conv_1',   organ:'Femoral Head 股骨頭',    tech:'Conv',     source:'QUANTEC', constraint:'V52 < 5%',           note:'<5% necrosis' },

  // ── BRACHIAL PLEXUS (Conv) ──
  { id:'rtog_bp_conv_1',     organ:'Brachial Plexus 臂神經叢', tech:'Conv',   source:'RTOG',    constraint:'Dmax ≤ 66 Gy',       note:'H&N; neuropathy risk' },

  // ══════════════════════════════════════════
  //  SBRT — 1 FRACTION (Single)
  // ══════════════════════════════════════════

  // ── SPINAL CORD (1fx) ──
  { id:'tg101_cord_1fx_1',   organ:'Spinal Cord 脊髓',       tech:'SBRT-1fx', source:'TG-101',  constraint:'Dmax ≤ 14 Gy',       note:'Point max; 1fx' },
  { id:'tg101_cord_1fx_2',   organ:'Spinal Cord 脊髓',       tech:'SBRT-1fx', source:'TG-101',  constraint:'V10 < 0.35cc',        note:'Cord volume constraint' },
  { id:'tg101_cauda_1fx_1',  organ:'Cauda Equina 馬尾',      tech:'SBRT-1fx', source:'TG-101',  constraint:'Dmax ≤ 16 Gy',        note:'1fx' },

  // ── BRAIN (1fx) — SRS ──
  { id:'rtog_brain_1fx_1',   organ:'Brain 腦（total）',      tech:'SBRT-1fx', source:'RTOG',    constraint:'V12 Gy < 10cc',       note:'SRS; radionecrosis risk' },
  { id:'rtog_brain_1fx_2',   organ:'Brain Stem 腦幹',        tech:'SBRT-1fx', source:'RTOG',    constraint:'Dmax ≤ 15 Gy',        note:'SRS' },
  { id:'rtog_brain_1fx_3',   organ:'Optic Apparatus 視神經/視交叉', tech:'SBRT-1fx', source:'RTOG', constraint:'Dmax ≤ 8 Gy', note:'SRS; optic neuropathy' },
  { id:'rtog_brain_1fx_4',   organ:'Cochlea 耳蝸',           tech:'SBRT-1fx', source:'RTOG',    constraint:'Dmean ≤ 9 Gy',        note:'SRS' },

  // ── LUNG (1fx) ──
  { id:'tg101_lung_1fx_1',   organ:'Ipsilateral Lung 同側肺', tech:'SBRT-1fx',source:'TG-101',  constraint:'V13.5 Gy < 1000cc',   note:'SBRT 1fx; lung' },
  { id:'tg101_lung_1fx_2',   organ:'Ipsilateral Lung 同側肺', tech:'SBRT-1fx',source:'TG-101',  constraint:'V7 Gy < 1500cc',      note:'Proximal zone' },
  { id:'tg101_chest_1fx_1',  organ:'Chest Wall 胸壁',         tech:'SBRT-1fx',source:'TG-101',  constraint:'V22 Gy < 30cc',        note:'Rib fracture risk' },
  { id:'tg101_trachea_1fx_1',organ:'Trachea/Bronchi 氣管支氣管',tech:'SBRT-1fx',source:'TG-101',constraint:'Dmax ≤ 22 Gy',        note:'1fx' },
  { id:'tg101_esoph_1fx_1',  organ:'Esophagus 食道',          tech:'SBRT-1fx',source:'TG-101',  constraint:'Dmax ≤ 15.4 Gy',      note:'1fx' },
  { id:'tg101_heart_1fx_1',  organ:'Heart/Pericardium 心臟',  tech:'SBRT-1fx',source:'TG-101',  constraint:'Dmax ≤ 22 Gy',        note:'1fx' },
  { id:'tg101_great_1fx_1',  organ:'Great Vessels 大血管',    tech:'SBRT-1fx',source:'TG-101',  constraint:'Dmax ≤ 37 Gy',        note:'1fx' },

  // ── LIVER (1fx) ──
  { id:'tg101_liver_1fx_1',  organ:'Liver 肝臟',              tech:'SBRT-1fx',source:'TG-101',  constraint:'Normal liver > 700cc < 9.1 Gy', note:'1fx; HCC/mets' },

  // ── KIDNEY (1fx) ──
  { id:'tg101_kidney_1fx_1', organ:'Kidney 腎臟（each）',    tech:'SBRT-1fx',source:'TG-101',  constraint:'V8.4 Gy < 200cc',     note:'1fx' },

  // ══════════════════════════════════════════
  //  SBRT — 3 FRACTIONS
  // ══════════════════════════════════════════

  // ── SPINAL CORD (3fx) ──
  { id:'tg101_cord_3fx_1',   organ:'Spinal Cord 脊髓',       tech:'SBRT-3fx', source:'TG-101',  constraint:'Dmax ≤ 18 Gy',       note:'3fx point max' },
  { id:'tg101_cord_3fx_2',   organ:'Spinal Cord 脊髓',       tech:'SBRT-3fx', source:'TG-101',  constraint:'V12 Gy < 0.35cc',    note:'3fx cord volume' },
  { id:'tg101_cauda_3fx_1',  organ:'Cauda Equina 馬尾',      tech:'SBRT-3fx', source:'TG-101',  constraint:'Dmax ≤ 21.9 Gy',     note:'3fx' },

  // ── LUNG (3fx) — Lung SABR ──
  { id:'tg101_lung_3fx_1',   organ:'Ipsilateral Lung 同側肺', tech:'SBRT-3fx',source:'TG-101',  constraint:'V20 Gy < 10%',        note:'3fx Lung SABR' },
  { id:'tg101_lung_3fx_2',   organ:'Both Lungs 雙側肺',       tech:'SBRT-3fx',source:'TG-101',  constraint:'V12.5 Gy < 1500cc',   note:'3fx; RTOG 0236' },
  { id:'rtog_lung_3fx_1',    organ:'Both Lungs 雙側肺（V20）',tech:'SBRT-3fx',source:'RTOG',    constraint:'V20 Gy < 1500cc',     note:'RTOG 0236' },
  { id:'rtog_lung_3fx_2',    organ:'Both Lungs 雙側肺（MLD）',tech:'SBRT-3fx',source:'RTOG',    constraint:'MLD < 4 Gy',          note:'3fx Lung SABR' },
  { id:'rtog_lung_3fx_3',    organ:'Both Lungs 雙側肺（V5）', tech:'SBRT-3fx',source:'RTOG',    constraint:'V5 Gy < 3000cc',      note:'Low dose lung volume' },
  { id:'tg101_chest_3fx_1',  organ:'Chest Wall 胸壁',         tech:'SBRT-3fx',source:'TG-101',  constraint:'V30 Gy < 30cc',       note:'3fx; rib fracture' },
  { id:'tg101_trachea_3fx_1',organ:'Trachea/Bronchi 氣管支氣管',tech:'SBRT-3fx',source:'TG-101',constraint:'Dmax ≤ 30 Gy',       note:'3fx' },
  { id:'tg101_esoph_3fx_1',  organ:'Esophagus 食道',          tech:'SBRT-3fx',source:'TG-101',  constraint:'Dmax ≤ 25.2 Gy',     note:'3fx' },
  { id:'tg101_heart_3fx_1',  organ:'Heart/Pericardium 心臟',  tech:'SBRT-3fx',source:'TG-101',  constraint:'Dmax ≤ 30 Gy',       note:'3fx' },
  { id:'tg101_great_3fx_1',  organ:'Great Vessels 大血管',    tech:'SBRT-3fx',source:'TG-101',  constraint:'Dmax ≤ 45 Gy',       note:'3fx' },
  { id:'tg101_cord_3fx_brain',organ:'Brain Stem 腦幹',         tech:'SBRT-3fx',source:'TG-101',  constraint:'Dmax ≤ 23.1 Gy',     note:'3fx; SRS/SBRT' },

  // ── LIVER (3fx) ──
  { id:'tg101_liver_3fx_1',  organ:'Liver 肝臟',              tech:'SBRT-3fx',source:'TG-101',  constraint:'Normal liver > 700cc < 19.2 Gy', note:'3fx' },
  { id:'tg101_liver_3fx_2',  organ:'Liver 肝臟',              tech:'SBRT-3fx',source:'TG-101',  constraint:'Normal liver Dmean < 15 Gy', note:'Child-Pugh A' },

  // ── KIDNEY (3fx) ──
  { id:'tg101_kidney_3fx_1', organ:'Kidney 腎臟（each）',    tech:'SBRT-3fx',source:'TG-101',  constraint:'V15 Gy < 200cc',      note:'3fx' },

  // ── DUODENUM/BOWEL (3fx) ──
  { id:'tg101_duo_3fx_1',    organ:'Duodenum 十二指腸',       tech:'SBRT-3fx',source:'TG-101',  constraint:'Dmax ≤ 30 Gy',       note:'3fx; hotspot' },
  { id:'tg101_duo_3fx_2',    organ:'Duodenum 十二指腸',       tech:'SBRT-3fx',source:'TG-101',  constraint:'V18 Gy < 5cc',        note:'3fx volume constraint' },
  { id:'tg101_bowl_3fx_1',   organ:'Small Bowel 小腸',        tech:'SBRT-3fx',source:'TG-101',  constraint:'Dmax ≤ 30 Gy',       note:'3fx' },
  { id:'tg101_bowl_3fx_2',   organ:'Small Bowel 小腸',        tech:'SBRT-3fx',source:'TG-101',  constraint:'V18 Gy < 5cc',        note:'3fx volume constraint' },

  // ══════════════════════════════════════════
  //  SBRT — 5 FRACTIONS
  // ══════════════════════════════════════════

  // ── SPINAL CORD (5fx) ──
  { id:'tg101_cord_5fx_1',   organ:'Spinal Cord 脊髓',       tech:'SBRT-5fx', source:'TG-101',  constraint:'Dmax ≤ 25 Gy',       note:'5fx point max' },
  { id:'tg101_cord_5fx_2',   organ:'Spinal Cord 脊髓',       tech:'SBRT-5fx', source:'TG-101',  constraint:'V20 Gy < 0.35cc',    note:'5fx' },
  { id:'tg101_cauda_5fx_1',  organ:'Cauda Equina 馬尾',      tech:'SBRT-5fx', source:'TG-101',  constraint:'Dmax ≤ 30 Gy',       note:'5fx' },

  // ── LUNG (5fx) — Lung SABR ──
  { id:'tg101_lung_5fx_1',   organ:'Ipsilateral Lung 同側肺', tech:'SBRT-5fx',source:'TG-101',  constraint:'V20 Gy < 10%',        note:'5fx Lung SABR' },
  { id:'rtog_lung_5fx_1',    organ:'Both Lungs 雙側肺（V20）',tech:'SBRT-5fx',source:'RTOG',    constraint:'V20 < 1500cc',        note:'5fx RTOG; peripheral lesion' },
  { id:'rtog_lung_5fx_2',    organ:'Both Lungs 雙側肺（V12.5）',tech:'SBRT-5fx',source:'RTOG', constraint:'V12.5 < 1500cc',      note:'RTOG 0813; central lesion' },
  { id:'rtog_lung_5fx_3',    organ:'Both Lungs 雙側肺（MLD）',tech:'SBRT-5fx',source:'RTOG',    constraint:'MLD < 7 Gy',          note:'5fx RTOG SABR' },
  { id:'rtog_lung_5fx_4',    organ:'Both Lungs 雙側肺（V5）', tech:'SBRT-5fx',source:'RTOG',    constraint:'V5 < 3000cc',         note:'Low dose volume' },
  { id:'tg101_chest_5fx_1',  organ:'Chest Wall 胸壁',         tech:'SBRT-5fx',source:'TG-101',  constraint:'V32 Gy < 30cc',       note:'5fx; rib fracture' },
  { id:'tg101_trachea_5fx_1',organ:'Trachea/Bronchi 氣管支氣管',tech:'SBRT-5fx',source:'TG-101',constraint:'Dmax ≤ 38 Gy',       note:'5fx central; RTOG 0813' },
  { id:'tg101_esoph_5fx_1',  organ:'Esophagus 食道',          tech:'SBRT-5fx',source:'TG-101',  constraint:'Dmax ≤ 35 Gy',       note:'5fx' },
  { id:'tg101_esoph_5fx_2',  organ:'Esophagus 食道',          tech:'SBRT-5fx',source:'TG-101',  constraint:'V27.5 Gy < 5cc',      note:'5fx volume' },
  { id:'tg101_heart_5fx_1',  organ:'Heart/Pericardium 心臟',  tech:'SBRT-5fx',source:'TG-101',  constraint:'Dmax ≤ 38 Gy',       note:'5fx' },
  { id:'tg101_heart_5fx_2',  organ:'Heart/Pericardium 心臟',  tech:'SBRT-5fx',source:'TG-101',  constraint:'V32 Gy < 15cc',       note:'5fx volume' },
  { id:'tg101_great_5fx_1',  organ:'Great Vessels 大血管',    tech:'SBRT-5fx',source:'TG-101',  constraint:'Dmax ≤ 47 Gy',       note:'5fx' },
  { id:'tg101_brain_5fx_1',  organ:'Brain Stem 腦幹',         tech:'SBRT-5fx',source:'TG-101',  constraint:'Dmax ≤ 31 Gy',       note:'5fx' },
  { id:'tg101_brain_5fx_2',  organ:'Brain Stem 腦幹',         tech:'SBRT-5fx',source:'TG-101',  constraint:'V23 Gy < 10cc',       note:'5fx' },

  // ── LIVER (5fx) ──
  { id:'tg101_liver_5fx_1',  organ:'Liver 肝臟',              tech:'SBRT-5fx',source:'TG-101',  constraint:'Normal liver > 700cc < 21 Gy', note:'5fx' },
  { id:'tg101_liver_5fx_2',  organ:'Liver 肝臟',              tech:'SBRT-5fx',source:'TG-101',  constraint:'Normal liver Dmean < 13 Gy',   note:'Child-Pugh A/B' },

  // ── KIDNEY (5fx) ──
  { id:'tg101_kidney_5fx_1', organ:'Kidney 腎臟（each）',    tech:'SBRT-5fx',source:'TG-101',  constraint:'V18 Gy < 200cc',      note:'5fx' },
  { id:'tg101_kidney_5fx_2', organ:'Kidney 腎臟（each）',    tech:'SBRT-5fx',source:'TG-101',  constraint:'Dmean < 8 Gy',        note:'5fx; function preservation' },

  // ── DUODENUM/BOWEL (5fx) ──
  { id:'tg101_duo_5fx_1',    organ:'Duodenum 十二指腸',       tech:'SBRT-5fx',source:'TG-101',  constraint:'Dmax ≤ 38 Gy',       note:'5fx' },
  { id:'tg101_duo_5fx_2',    organ:'Duodenum 十二指腸',       tech:'SBRT-5fx',source:'TG-101',  constraint:'V20 Gy < 5cc',        note:'5fx volume' },
  { id:'tg101_bowl_5fx_1',   organ:'Small Bowel 小腸',        tech:'SBRT-5fx',source:'TG-101',  constraint:'Dmax ≤ 38 Gy',       note:'5fx' },
  { id:'tg101_bowl_5fx_2',   organ:'Small Bowel 小腸',        tech:'SBRT-5fx',source:'TG-101',  constraint:'V20 Gy < 10cc',       note:'5fx' },

  // ── STOMACH (5fx) ──
  { id:'tg101_stom_5fx_1',   organ:'Stomach 胃',              tech:'SBRT-5fx',source:'TG-101',  constraint:'Dmax ≤ 32 Gy',       note:'5fx' },
  { id:'tg101_stom_5fx_2',   organ:'Stomach 胃',              tech:'SBRT-5fx',source:'TG-101',  constraint:'V18 Gy < 10cc',       note:'5fx' },

  // ── COLON (5fx) ──
  { id:'tg101_colon_5fx_1',  organ:'Colon 大腸',              tech:'SBRT-5fx',source:'TG-101',  constraint:'Dmax ≤ 38 Gy',       note:'5fx; perforation risk' },

  // ── PROSTATE SBRT (5fx) ──
  { id:'rtog_rect_5fx_1',    organ:'Rectum 直腸',             tech:'SBRT-5fx',source:'RTOG',    constraint:'V32 < 20%',          note:'5fx prostate SBRT' },
  { id:'rtog_rect_5fx_2',    organ:'Rectum 直腸',             tech:'SBRT-5fx',source:'RTOG',    constraint:'V36 < 1cc',          note:'5fx prostate SBRT' },
  { id:'rtog_blad_5fx_1',    organ:'Bladder 膀胱',            tech:'SBRT-5fx',source:'RTOG',    constraint:'V37 < 20%',          note:'5fx prostate SBRT' },
  { id:'rtog_blad_5fx_2',    organ:'Bladder 膀胱',            tech:'SBRT-5fx',source:'RTOG',    constraint:'Dmax < 42 Gy',       note:'5fx prostate SBRT' },
  { id:'rtog_urethra_5fx_1', organ:'Urethra 尿道',            tech:'SBRT-5fx',source:'RTOG',    constraint:'Dmax ≤ 42 Gy',       note:'5fx prostate' },
  { id:'rtog_fem_5fx_1',     organ:'Femoral Head 股骨頭',     tech:'SBRT-5fx',source:'RTOG',    constraint:'V30 < 5%',           note:'5fx prostate SBRT' },
];
