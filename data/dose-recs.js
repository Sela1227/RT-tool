// ──────────────────────────────────────────────────────────
//  DOSE_RECS — NCCN dose recommendations by cancer (2024)
//  format: { id, cancer, site, tech, dose, fx, note, source }
// ──────────────────────────────────────────────────────────
const DOSE_RECS = [

  // ── Lung (NSCLC) ──────────────────────────────────────
  {id:1, cancer:'Lung',    site:'NSCLC — Stage I/II (中央型)', tech:'SBRT', dose:'50–54', fx:5,  note:'RTOG 0813/0915；中央型 ≥2 cm from PBT', source:'NCCN NSCLC 2024'},
  {id:2, cancer:'Lung',    site:'NSCLC — Stage I/II (周邊型)', tech:'SBRT', dose:'48–54', fx:3,  note:'RTOG 0236；T1-2N0 周邊型首選', source:'NCCN NSCLC 2024'},
  {id:3, cancer:'Lung',    site:'NSCLC — Stage I/II (周邊型超低)', tech:'SBRT', dose:'25–34', fx:1,  note:'單次適用小腫瘤 ≤2 cm，距胸壁 ≥1 cm', source:'NCCN NSCLC 2024'},
  {id:4, cancer:'Lung',    site:'NSCLC — Stage III (根治性 CRT)', tech:'IMRT/VMAT', dose:'60–66', fx:30, note:'同步 Carboplatin/Paclitaxel 或 Cisplatin/VP-16；RTOG 0617', source:'NCCN NSCLC 2024'},
  {id:5, cancer:'Lung',    site:'NSCLC — 術後輔助 (pN2)', tech:'IMRT', dose:'50–54', fx:'25–27', note:'切緣陰性 pN2 可考慮；PORT 存活效益仍有爭議', source:'NCCN NSCLC 2024'},
  {id:6, cancer:'Lung',    site:'NSCLC — 寡轉移鞏固', tech:'SBRT', dose:'45–60', fx:'3–5', note:'Driver mutation+ systemic Rx 後 ≤3 個病灶', source:'NCCN NSCLC 2024'},

  // ── Lung (SCLC) ───────────────────────────────────────
  {id:7, cancer:'Lung',    site:'SCLC — Limited stage (TRT)', tech:'IMRT', dose:'45', fx:30, note:'每日兩次 1.5 Gy；CONVERT trial；同步 PE', source:'NCCN SCLC 2024'},
  {id:8, cancer:'Lung',    site:'SCLC — Limited stage (alt)', tech:'IMRT', dose:'60–70', fx:'30–35', note:'每日一次替代方案', source:'NCCN SCLC 2024'},
  {id:9, cancer:'Lung',    site:'SCLC — PCI', tech:'WBI', dose:'25', fx:10, note:'PCI 25 Gy/10fx；Limited 或 Extensive response', source:'NCCN SCLC 2024'},

  // ── Breast ────────────────────────────────────────────
  {id:10, cancer:'Breast',  site:'全乳 — 標準分割', tech:'IMRT/3DCRT', dose:'50', fx:25, note:'BCS 後全乳照射標準方案', source:'NCCN Breast 2024'},
  {id:11, cancer:'Breast',  site:'全乳 — 中度低分次', tech:'IMRT', dose:'40–42.56', fx:'15–16', note:'START B / FAST Forward；T1-2N0-1 首選', source:'NCCN Breast 2024'},
  {id:12, cancer:'Breast',  site:'全乳 — APBI (IORT/外照)', tech:'PBSI/IORT', dose:'38.5 (外) / 21 (IORT)', fx:'10 / 1', note:'TARGIT / ELIOT 選擇標準；低風險患者', source:'NCCN Breast 2024'},
  {id:13, cancer:'Breast',  site:'胸壁術後 (PMRT)', tech:'IMRT', dose:'50', fx:25, note:'≥4 陽性淋巴結 或 T3-4；含/不含 Boost', source:'NCCN Breast 2024'},
  {id:14, cancer:'Breast',  site:'胸壁低分次 (PMRT)', tech:'IMRT', dose:'40–42.56', fx:'15–16', note:'NCIC-CTG MA.20 衍伸方案', source:'NCCN Breast 2024'},
  {id:15, cancer:'Breast',  site:'局部加強 (Boost)', tech:'電子線/IMRT', dose:'10–16', fx:'4–8', note:'切緣陽性/近切緣/年輕患者', source:'NCCN Breast 2024'},

  // ── Prostate ──────────────────────────────────────────
  {id:16, cancer:'Prostate', site:'低/中風險 — 標準分割', tech:'IMRT/VMAT', dose:'75.6–81', fx:'42–45', note:'DART、Scandinavian 試驗；勃起保留功能', source:'NCCN Prostate 2024'},
  {id:17, cancer:'Prostate', site:'低/中風險 — 中度低分次', tech:'IMRT/VMAT', dose:'60–70.2', fx:'20–28', note:'CHHiP / RTOG 0415；≈等效 BED₃ 180–220', source:'NCCN Prostate 2024'},
  {id:18, cancer:'Prostate', site:'低/中風險 — SBRT', tech:'SBRT', dose:'36.25', fx:5,  note:'HYPO-RT-PC；建議 VMAT + IGRT（fiducial marker）', source:'NCCN Prostate 2024'},
  {id:19, cancer:'Prostate', site:'高風險 — 根治性 RT + ADT', tech:'IMRT', dose:'75.6–81', fx:'42–45', note:'+ 長程 ADT 2–3 年；骨盆淋巴結選擇性照射', source:'NCCN Prostate 2024'},
  {id:20, cancer:'Prostate', site:'高風險 — 骨盆淋巴結 ENI', tech:'IMRT', dose:'44–46 (骨盆) + 6–10 (前列腺 boost)', fx:'25+boost', note:'RTOG 9413 方案；骨盆 44–46 Gy', source:'NCCN Prostate 2024'},
  {id:21, cancer:'Prostate', site:'術後輔助/挽救 RT', tech:'IMRT', dose:'64–72', fx:'32–36', note:'PSA undetectable: adjuvant；PSA rising: salvage', source:'NCCN Prostate 2024'},

  // ── Rectum ────────────────────────────────────────────
  {id:22, cancer:'Rectum',   site:'術前長程 CRT', tech:'IMRT/3DCRT', dose:'45–50.4', fx:'25–28', note:'同步 Capecitabine；≥4–6 週後手術', source:'NCCN Rectal 2024'},
  {id:23, cancer:'Rectum',   site:'術前短程 RT', tech:'3DCRT/IMRT', dose:'25', fx:5,  note:'Swedish trial；1 週內手術 或 RAPIDO 延後手術', source:'NCCN Rectal 2024'},
  {id:24, cancer:'Rectum',   site:'術前 SCRT + Consolidation chemo', tech:'IMRT', dose:'25', fx:5,  note:'RAPIDO：短程 RT → CAPOX×6 → TME', source:'NCCN Rectal 2024'},
  {id:25, cancer:'Rectum',   site:'局部晚期不可切除 (根治性)', tech:'IMRT', dose:'54–59.4', fx:'30–33', note:'R0 切除困難或拒絕手術者', source:'NCCN Rectal 2024'},

  // ── HCC / Liver ───────────────────────────────────────
  {id:26, cancer:'Liver',    site:'HCC — SBRT (Child-Pugh A)', tech:'SBRT', dose:'27.5–40', fx:5,  note:'RTOG 1112；不可 TACE/RFA 或 TACE failure', source:'NCCN HCC 2024'},
  {id:27, cancer:'Liver',    site:'HCC — SBRT (Child-Pugh B7)', tech:'SBRT', dose:'25–40', fx:5,  note:'Child-Pugh B7 可考慮，總劑量酌減', source:'NCCN HCC 2024'},
  {id:28, cancer:'Liver',    site:'HCC — 常規分割 (大病灶)', tech:'IMRT', dose:'50–60', fx:'25–30', note:'腫瘤 >5 cm 或無法 SBRT；與 TACE 搭配', source:'NCCN HCC 2024'},
  {id:29, cancer:'Liver',    site:'Liver mets — SBRT', tech:'SBRT', dose:'45–60', fx:'3–5', note:'可切除但不適合手術；≤3 個轉移', source:'NCCN 2024'},

  // ── Esophagus ─────────────────────────────────────────
  {id:30, cancer:'Esophagus',site:'術前 CRT (Siewert I/II)', tech:'IMRT', dose:'41.4–50.4', fx:'23–28', note:'CROSS trial 41.4 Gy；同步 Carboplatin/Paclitaxel', source:'NCCN Esophagus 2024'},
  {id:31, cancer:'Esophagus',site:'根治性 CRT (不可手術)', tech:'IMRT', dose:'50–50.4', fx:'25–28', note:'RTOG 85-01 50.4 Gy；或 60–64 Gy (爭議)', source:'NCCN Esophagus 2024'},
  {id:32, cancer:'Esophagus',site:'頸段食道 — 根治性 CRT', tech:'IMRT', dose:'60–66', fx:'30–33', note:'可提升劑量，手術複雜度高', source:'NCCN Esophagus 2024'},

  // ── Gastric ───────────────────────────────────────────
  {id:33, cancer:'Stomach',  site:'術後輔助 CRT', tech:'IMRT', dose:'45', fx:25, note:'INT 0116 方案；+ 5-FU/LV；D1 切除後', source:'NCCN Gastric 2024'},
  {id:34, cancer:'Stomach',  site:'術前 CRT (GEJ, Siewert II/III)', tech:'IMRT', dose:'45', fx:25, note:'FLOT4 無 RT；CRT 主要用於 GEJ 腺癌', source:'NCCN Gastric 2024'},
  {id:35, cancer:'Stomach',  site:'局部晚期不可切除', tech:'IMRT', dose:'50.4–54', fx:'28–30', note:'化放療同步；出血/疼痛緩解亦可用低劑量', source:'NCCN Gastric 2024'},

  // ── Pancreas ──────────────────────────────────────────
  {id:36, cancer:'Pancreas', site:'術後輔助 CRT', tech:'IMRT', dose:'50.4', fx:28, note:'+ 5-FU 或 Gemcitabine；R0/R1 切除後', source:'NCCN Pancreas 2024'},
  {id:37, cancer:'Pancreas', site:'Borderline resectable — CRT', tech:'IMRT', dose:'45–54', fx:'25–30', note:'+ FOLFIRINOX 或 Gem/nab-P 誘導後降期', source:'NCCN Pancreas 2024'},
  {id:38, cancer:'Pancreas', site:'Locally advanced (SBRT)', tech:'SBRT', dose:'33–40', fx:5,  note:'LAP07 / LAPC-SBRT；注意十二指腸限制', source:'NCCN Pancreas 2024'},
  {id:39, cancer:'Pancreas', site:'Locally advanced (SBRT 強化)', tech:'SBRT', dose:'45–50', fx:5,  note:'Ablative SBRT；嚴格選擇病例', source:'NCCN Pancreas 2024'},

  // ── Head & Neck ───────────────────────────────────────
  {id:40, cancer:'H&N',      site:'口咽/口腔 — 根治性 IMRT', tech:'IMRT SIB', dose:'70 (GTV) / 59.4 (CTV2) / 54 (CTV1)', fx:33, note:'SIB 70/59.4/54 Gy；HPV+ 口咽降劑量試驗進行中', source:'NCCN H&N 2024'},
  {id:41, cancer:'H&N',      site:'鼻咽 — 根治性 IMRT', tech:'IMRT SIB', dose:'70 (GTVp) / 66 (GTVnd) / 60 (CTV1) / 54 (CTV2)', fx:33, note:'同步 Cisplatin 100 mg/m²；T3-4 加 Adjuvant 化療', source:'NCCN NPC 2024'},
  {id:42, cancer:'H&N',      site:'喉癌 — 早期 (T1-2N0)', tech:'IMRT/3DCRT', dose:'63–66', fx:'28–33', note:'聲門型 T1 66 Gy/33fx 或 63 Gy/28fx', source:'NCCN H&N 2024'},
  {id:43, cancer:'H&N',      site:'術後輔助 — 高風險', tech:'IMRT', dose:'60–66', fx:'30–33', note:'+ Cisplatin；切緣+ 或 ECE 者 66 Gy', source:'NCCN H&N 2024'},
  {id:44, cancer:'H&N',      site:'術後輔助 — 低風險', tech:'IMRT', dose:'57.6–60', fx:'32–33', note:'pN1 無 ECE；不含化療', source:'NCCN H&N 2024'},

  // ── CNS ───────────────────────────────────────────────
  {id:45, cancer:'CNS',      site:'GBM — 標準 Stupp', tech:'IMRT', dose:'60', fx:30, note:'+ 同步 TMZ → 輔助 TMZ 6 週期；MGMT methylation 預測效益', source:'NCCN CNS 2024'},
  {id:46, cancer:'CNS',      site:'GBM — 高齡/PS 差 (低分次)', tech:'IMRT', dose:'34–40', fx:'10–15', note:'Nordic 40 Gy/15fx 或 25 Gy/5fx；+ TMZ (MGMT+)', source:'NCCN CNS 2024'},
  {id:47, cancer:'CNS',      site:'腦轉移 — SRS 單一', tech:'SRS', dose:'18–24', fx:1,  note:'≤4 cm：21–24 Gy；4–6 cm：18 Gy (RTOG 9508)', source:'NCCN CNS 2024'},
  {id:48, cancer:'CNS',      site:'腦轉移 — SRS 多發', tech:'SRS', dose:'18–24', fx:1,  note:'1–10 個病灶；各別大小決定劑量', source:'NCCN CNS 2024'},
  {id:49, cancer:'CNS',      site:'腦轉移 — SRS 分次', tech:'fSRS', dose:'25–30', fx:5,  note:'>2.5 cm 或靠近重要功能區；5 fx', source:'NCCN CNS 2024'},
  {id:50, cancer:'CNS',      site:'WBRT ± Hippocampal Avoidance', tech:'IMRT', dose:'30', fx:10, note:'HA-WBRT + Memantine；多發或不適合 SRS', source:'NCCN CNS 2024'},
  {id:51, cancer:'CNS',      site:'脊椎轉移 — SBRT', tech:'SBRT', dose:'16–24', fx:1,  note:'RTOG 0631；單次 16–18 Gy (reirradiation 可用)', source:'NCCN CNS 2024'},
  {id:52, cancer:'CNS',      site:'脊椎轉移 — cEBRT', tech:'3DCRT', dose:'30', fx:10, note:'症狀緩解標準方案', source:'NCCN CNS 2024'},

  // ── Lymphoma ──────────────────────────────────────────
  {id:53, cancer:'Lymphoma', site:'DLBCL — Consolidation RT', tech:'IMRT', dose:'30–36', fx:'15–18', note:'ISRT；Bulky 或 initial extranodal；+ R-CHOP', source:'NCCN Lymphoma 2024'},
  {id:54, cancer:'Lymphoma', site:'DLBCL — Early stage (RT alone)', tech:'IMRT', dose:'30–36', fx:'15–18', note:'Stage I/II no bulky；+ RCHOP abbreviated', source:'NCCN Lymphoma 2024'},
  {id:55, cancer:'Lymphoma', site:'HL — Early stage favorable', tech:'IMRT', dose:'20', fx:10, note:'GHSG HD10/16；ABVD ×2 → ISRT 20 Gy', source:'NCCN HL 2024'},
  {id:56, cancer:'Lymphoma', site:'HL — Early stage unfavorable', tech:'IMRT', dose:'30', fx:15, note:'ABVD ×4 → ISRT 30 Gy；或 BEACOPP', source:'NCCN HL 2024'},
  {id:57, cancer:'Lymphoma', site:'MALT — Gastric / Orbital', tech:'IMRT', dose:'24–30', fx:'12–15', note:'H. pylori 陰性或無法根除；Orbital MALT 24 Gy', source:'NCCN Lymphoma 2024'},

  // ── Bone / Mets ───────────────────────────────────────
  {id:58, cancer:'Bone/Mets',site:'骨轉移 — 緩解性', tech:'3DCRT', dose:'8 / 20 / 30', fx:'1 / 5 / 10', note:'8 Gy/1fx = 30 Gy/10fx for pain response (RTOG 9714)', source:'NCCN Supportive 2024'},
  {id:59, cancer:'Bone/Mets',site:'骨轉移 — 術後 (穩定)', tech:'3DCRT', dose:'30', fx:10, note:'術後防止局部進展', source:'NCCN Supportive 2024'},
  {id:60, cancer:'Bone/Mets',site:'骨轉移 — SBRT (寡轉移)', tech:'SBRT', dose:'20–24', fx:1,  note:'單次 SBRT；或 24 Gy/2fx / 30 Gy/3fx', source:'NCCN 2024'},
];
