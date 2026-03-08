// ──────────────────────────────────────────────────────────
//  DOSE_RECS — NCCN dose recommendations (2025–2026)
//  format: { id, cancer, site, tech, dose, fx, note, source }
// ──────────────────────────────────────────────────────────
const DOSE_RECS = [

  // ── Lung (NSCLC) ──────────────────────────────────────
  {id:1,  cancer:'Lung', site:'NSCLC — Stage I/II 周邊型', tech:'SBRT', dose:'48–54', fx:3, note:'RTOG 0236；T1-2N0 周邊型距胸壁 ≥1 cm', source:'NCCN NSCLC 2025'},
  {id:2,  cancer:'Lung', site:'NSCLC — Stage I/II 周邊型超低分', tech:'SBRT', dose:'25–34', fx:1, note:'單次適用 ≤2 cm、距胸壁 ≥1 cm', source:'NCCN NSCLC 2025'},
  {id:3,  cancer:'Lung', site:'NSCLC — Stage I/II 中央型', tech:'SBRT', dose:'50–60', fx:5, note:'RTOG 0813；中央型 ≥2 cm from PBT；嚴格劑量限制', source:'NCCN NSCLC 2025'},
  {id:4,  cancer:'Lung', site:'NSCLC — Stage III 根治性 CRT', tech:'IMRT/VMAT', dose:'60–66', fx:30, note:'同步 Carboplatin/Paclitaxel 或 Cisplatin/Etoposide；RTOG 0617', source:'NCCN NSCLC 2025'},
  {id:5,  cancer:'Lung', site:'NSCLC — Stage III CRT + Durvalumab', tech:'IMRT/VMAT', dose:'60', fx:30, note:'PACIFIC：CRT 後 Durvalumab 12 個月；OS 獲益確立', source:'NCCN NSCLC 2025'},
  {id:6,  cancer:'Lung', site:'NSCLC — 術後輔助 pN2 (PORT)', tech:'IMRT', dose:'50–54', fx:'25–27', note:'切緣陰性 pN2；PORT-C 顯示 DFS 獲益，OS 仍有爭議', source:'NCCN NSCLC 2025'},
  {id:7,  cancer:'Lung', site:'NSCLC — 寡轉移鞏固 SBRT', tech:'SBRT', dose:'45–60', fx:'3–5', note:'靶向或免疫治療後 ≤5 個殘存病灶；SINDAS 試驗', source:'NCCN NSCLC 2025'},
  {id:8,  cancer:'Lung', site:'NSCLC — 腦轉移 SRS (1–10 個)', tech:'SRS', dose:'18–24', fx:1, note:'各別劑量依大小：≤2 cm 24 Gy、2–3 cm 18–21 Gy', source:'NCCN NSCLC 2025'},

  // ── Lung (SCLC) ───────────────────────────────────────
  {id:9,  cancer:'Lung', site:'SCLC — Limited stage 胸腔放療', tech:'IMRT', dose:'45', fx:30, note:'BID 1.5 Gy；CONVERT trial；或 66 Gy/33fx QD (non-inferior)', source:'NCCN SCLC 2025'},
  {id:10, cancer:'Lung', site:'SCLC — PCI 或海馬迴保護 WBI', tech:'IMRT/WBI', dose:'25', fx:10, note:'HA-PCI 可降低神經認知副作用；Extensive stage 可 MRI 監測替代', source:'NCCN SCLC 2025'},

  // ── Breast ────────────────────────────────────────────
  {id:11, cancer:'Breast', site:'全乳 — 標準分割', tech:'IMRT/3DCRT', dose:'50', fx:25, note:'BCS 後全乳照射；含/不含 Boost', source:'NCCN Breast 2025'},
  {id:12, cancer:'Breast', site:'全乳 — 中度低分次', tech:'IMRT', dose:'40–42.56', fx:'15–16', note:'FAST-Forward 40 Gy/15fx；START B；T1-2N0-1 首選', source:'NCCN Breast 2025'},
  {id:13, cancer:'Breast', site:'全乳 — 極低分次 5fx', tech:'IMRT', dose:'26–28.5', fx:5, note:'FAST-Forward 5fx 方案；早期乳癌 N0 選項；2025 納入指引', source:'NCCN Breast 2025'},
  {id:14, cancer:'Breast', site:'全乳 — APBI (外照射)', tech:'3DCRT/IMRT', dose:'38.5', fx:10, note:'NSABP B-39/RTOG 0413；低風險 BCS 後；BID 3.85 Gy/fx', source:'NCCN Breast 2025'},
  {id:15, cancer:'Breast', site:'胸壁 PMRT — 標準', tech:'IMRT', dose:'50', fx:25, note:'≥4 陽性淋巴結 或 T3-4；+ 局部區域淋巴結照射', source:'NCCN Breast 2025'},
  {id:16, cancer:'Breast', site:'胸壁 PMRT — 低分次', tech:'IMRT', dose:'40–42.56', fx:'15–16', note:'FAST-Forward 延伸方案；2025 指引納入', source:'NCCN Breast 2025'},
  {id:17, cancer:'Breast', site:'Boost — 高風險', tech:'電子線/IMRT', dose:'10–16', fx:'4–8', note:'切緣+ / 近切緣 / 年輕（< 40歲）', source:'NCCN Breast 2025'},
  {id:18, cancer:'Breast', site:'腋窩淋巴結 — Post-ALND / SLNB', tech:'IMRT', dose:'50', fx:25, note:'1–3 陽性 cN+ 或高風險 SLNB；AMAROS 數據支持', source:'NCCN Breast 2025'},

  // ── Prostate ──────────────────────────────────────────
  {id:19, cancer:'Prostate', site:'低/中危 — 標準分割', tech:'IMRT/VMAT', dose:'75.6–81', fx:'42–45', note:'Scandinavian / DART 試驗；IGRT 必備', source:'NCCN Prostate 2025'},
  {id:20, cancer:'Prostate', site:'低/中危 — 中度低分次', tech:'IMRT/VMAT', dose:'60–70.2', fx:'20–28', note:'CHHiP / RTOG 0415；60 Gy/20fx 或 70 Gy/28fx', source:'NCCN Prostate 2025'},
  {id:21, cancer:'Prostate', site:'低/中危 — SBRT (ultra-hypo)', tech:'SBRT', dose:'36.25', fx:5, note:'HYPO-RT-PC；PACE-B；fiducial marker + IGRT 必備', source:'NCCN Prostate 2025'},
  {id:22, cancer:'Prostate', site:'高危 — 根治性 RT + ADT', tech:'IMRT/VMAT', dose:'78–81', fx:'43–45', note:'長程 ADT 18–36 個月；ENI 視情況加入', source:'NCCN Prostate 2025'},
  {id:23, cancer:'Prostate', site:'高危 — 骨盆淋巴結 ENI', tech:'IMRT', dose:'44–46', fx:25, note:'同步前列腺 boost；RTOG 9413；DART 可加劑量', source:'NCCN Prostate 2025'},
  {id:24, cancer:'Prostate', site:'術後輔助 / 挽救 RT', tech:'IMRT', dose:'64–72', fx:'32–36', note:'PSA < 0.1 adjuvant；PSA rising salvage；RADICALS-RT', source:'NCCN Prostate 2025'},
  {id:25, cancer:'Prostate', site:'寡轉移 — SBRT (MDT)', tech:'SBRT', dose:'24–45', fx:'3–5', note:'轉移導向治療；STOMP / ORIOLE 試驗；延緩 ADT', source:'NCCN Prostate 2025'},

  // ── Rectum ────────────────────────────────────────────
  {id:26, cancer:'Rectum', site:'術前長程 CRT', tech:'IMRT/3DCRT', dose:'45–50.4', fx:'25–28', note:'同步 Capecitabine；≥4–6 週後 TME', source:'NCCN Rectal 2025'},
  {id:27, cancer:'Rectum', site:'術前短程 RT', tech:'3DCRT/IMRT', dose:'25', fx:5, note:'Swedish trial；RAPIDO；1 週內手術 或 延後 + 化療', source:'NCCN Rectal 2025'},
  {id:28, cancer:'Rectum', site:'Total Neoadjuvant Therapy (TNT)', tech:'IMRT', dose:'25 (SCRT) or 50.4 (LCRT)', fx:'5 or 28', note:'RAPIDO / PRODIGE 23；Induction chemo + RT → TME；高 pCR 率', source:'NCCN Rectal 2025'},
  {id:29, cancer:'Rectum', site:'局部晚期不可切除', tech:'IMRT', dose:'54–59.4', fx:'30–33', note:'根治性劑量；Watch-and-wait 策略對 cCR 患者可行', source:'NCCN Rectal 2025'},

  // ── HCC / Liver ───────────────────────────────────────
  {id:30, cancer:'Liver', site:'HCC — SBRT (Child-Pugh A)', tech:'SBRT', dose:'27.5–50', fx:5, note:'RTOG 1112；NRG/RTOG BED > 100 Gy；OS 獲益確認', source:'NCCN HCC 2025'},
  {id:31, cancer:'Liver', site:'HCC — SBRT (Child-Pugh B7)', tech:'SBRT', dose:'25–40', fx:5, note:'劑量酌減；嚴格肝臟劑量限制（mean liver dose < 13 Gy）', source:'NCCN HCC 2025'},
  {id:32, cancer:'Liver', site:'HCC — 大病灶常規分割', tech:'IMRT', dose:'50–60', fx:'25–30', note:'腫瘤 > 6 cm 或無法 SBRT；TACE 後鞏固', source:'NCCN HCC 2025'},
  {id:33, cancer:'Liver', site:'肝轉移 — SBRT', tech:'SBRT', dose:'45–60', fx:'3–5', note:'可切除但不適合手術；≤3 個；BED ≥ 100 Gy 目標', source:'NCCN 2025'},

  // ── Esophagus ─────────────────────────────────────────
  {id:34, cancer:'Esophagus', site:'術前 CRT (CROSS 方案)', tech:'IMRT', dose:'41.4', fx:23, note:'CROSS：Carboplatin/Paclitaxel 同步；SCC & Adeno 均適用', source:'NCCN Esophagus 2025'},
  {id:35, cancer:'Esophagus', site:'術前強化 CRT', tech:'IMRT', dose:'50.4', fx:28, note:'Cisplatin/5-FU 或 FOLFOX 同步；GEJ 腺癌可用', source:'NCCN Esophagus 2025'},
  {id:36, cancer:'Esophagus', site:'根治性 CRT (不可手術)', tech:'IMRT', dose:'50–50.4', fx:'25–28', note:'RTOG 85-01；> 50 Gy 無明顯生存優勢但增加毒性', source:'NCCN Esophagus 2025'},
  {id:37, cancer:'Esophagus', site:'頸段食道 — 根治性', tech:'IMRT', dose:'60–66', fx:'30–33', note:'手術複雜度高，根治性 CRT 為主；SCC 首選保器官', source:'NCCN Esophagus 2025'},

  // ── Gastric ───────────────────────────────────────────
  {id:38, cancer:'Stomach', site:'術後輔助 CRT (FLOT 後)', tech:'IMRT', dose:'45', fx:25, note:'INT-0116；R1 切除或 D0/D1 切除後；+ 5-FU 或 Capecitabine', source:'NCCN Gastric 2025'},
  {id:39, cancer:'Stomach', site:'GEJ 腺癌 術前/術後', tech:'IMRT', dose:'45–50.4', fx:'25–28', note:'Siewert II/III；FLOT4 為 Adeno 首選，CRT 為替代', source:'NCCN Gastric 2025'},
  {id:40, cancer:'Stomach', site:'局部晚期不可切除', tech:'IMRT', dose:'50.4–54', fx:'28–30', note:'化放療同步；出血/梗阻緩解亦可用低劑量 20–30 Gy', source:'NCCN Gastric 2025'},

  // ── Pancreas ──────────────────────────────────────────
  {id:41, cancer:'Pancreas', site:'術後輔助 CRT', tech:'IMRT', dose:'50.4', fx:28, note:'+ 5-FU 或 Gemcitabine；R0/R1 切除後；CONKO-001 術後化療優先', source:'NCCN Pancreas 2025'},
  {id:42, cancer:'Pancreas', site:'Borderline resectable — 誘導後 CRT', tech:'IMRT', dose:'45–54', fx:'25–30', note:'FOLFIRINOX 或 Gem/nab-P 誘導 → CRT → 再評估手術', source:'NCCN Pancreas 2025'},
  {id:43, cancer:'Pancreas', site:'Locally advanced — SBRT', tech:'SBRT', dose:'33–40', fx:5, note:'LAP07；注意十二指腸 D_max < 30 Gy (5fx)', source:'NCCN Pancreas 2025'},
  {id:44, cancer:'Pancreas', site:'Locally advanced — Ablative SBRT', tech:'SBRT', dose:'45–50', fx:5, note:'LAPC-SBRT；高 BED；嚴格病例選擇；V20 十二指腸 < 3 cc', source:'NCCN Pancreas 2025'},

  // ── Head & Neck ───────────────────────────────────────
  {id:45, cancer:'H&N', site:'口咽/口腔 — 根治性 IMRT SIB', tech:'IMRT SIB', dose:'70 / 59.4 / 54', fx:33, note:'GTV / CTV2 / CTV1；HPV+ 降劑量試驗（NRG HN002：60 Gy）仍在驗證中', source:'NCCN H&N 2025'},
  {id:46, cancer:'H&N', site:'鼻咽 — 根治性 IMRT SIB', tech:'IMRT SIB', dose:'70 / 66 / 60 / 54', fx:33, note:'GTVp / GTVnd / CTV1 / CTV2；Cisplatin 100 mg/m² Q3W；T3-4 加 Adjuvant IC', source:'NCCN NPC 2025'},
  {id:47, cancer:'H&N', site:'喉癌 — 早期 T1-2N0 聲門型', tech:'IMRT/3DCRT', dose:'63–66', fx:'28–33', note:'T1 66 Gy/33fx 或 63 Gy/28fx；2.25 Gy/fx 低分次被接受', source:'NCCN H&N 2025'},
  {id:48, cancer:'H&N', site:'術後高風險 — 輔助 CRT', tech:'IMRT', dose:'60–66', fx:'30–33', note:'切緣+ 或 ECE：66 Gy + Cisplatin；RTOG 9501 / EORTC 22931', source:'NCCN H&N 2025'},
  {id:49, cancer:'H&N', site:'術後低風險 — 輔助 RT', tech:'IMRT', dose:'57.6–60', fx:'32–33', note:'pN1 無 ECE；不含化療；或 SIB 60/54 Gy', source:'NCCN H&N 2025'},
  {id:50, cancer:'H&N', site:'H&N — 再程放療 (reirradiation)', tech:'IMRT/SBRT', dose:'44–60', fx:'20–30 (IMRT) / 5 (SBRT)', note:'謹慎選擇；RTOG 9610 / NRG HN001；SBRT 適合局限複發', source:'NCCN H&N 2025'},

  // ── CNS ───────────────────────────────────────────────
  {id:51, cancer:'CNS', site:'GBM — 標準 Stupp', tech:'IMRT', dose:'60', fx:30, note:'+ 同步 TMZ → 輔助 TMZ 6 週期；MGMT methylation 預測效益', source:'NCCN CNS 2025'},
  {id:52, cancer:'CNS', site:'GBM — 高齡/PS 差 低分次', tech:'IMRT', dose:'34–40', fx:'10–15', note:'Nordic：40 Gy/15fx 或 25 Gy/5fx；MGMT+ 加 TMZ (CCTG CE.6)', source:'NCCN CNS 2025'},
  {id:53, cancer:'CNS', site:'GBM — EF-14 TTFields 合併', tech:'IMRT + TTF', dose:'60', fx:30, note:'EF-14 試驗；TTFields + TMZ vs TMZ alone；OS 20.9 vs 16.0 mo', source:'NCCN CNS 2025'},
  {id:54, cancer:'CNS', site:'腦轉移 — SRS 單次', tech:'SRS', dose:'18–24', fx:1, note:'≤4 cm；21–24 Gy (≤2 cm)；18 Gy (2–3 cm)；RTOG 9508', source:'NCCN CNS 2025'},
  {id:55, cancer:'CNS', site:'腦轉移 — 分次 SRS', tech:'fSRS', dose:'25–30', fx:5, note:'> 2.5 cm 或功能區鄰近；3 fx 27 Gy 或 5 fx 25–30 Gy', source:'NCCN CNS 2025'},
  {id:56, cancer:'CNS', site:'腦轉移 — HA-WBRT + Memantine', tech:'IMRT', dose:'30', fx:10, note:'多發或不適合 SRS；HA-WBRT 保護海馬迴認知功能；NRG CC001', source:'NCCN CNS 2025'},
  {id:57, cancer:'CNS', site:'脊椎轉移 — SBRT 單次', tech:'SBRT', dose:'16–24', fx:1, note:'RTOG 0631；SINS 穩定；距脊髓 ≥ 2 mm', source:'NCCN CNS 2025'},
  {id:58, cancer:'CNS', site:'脊椎轉移 — cEBRT 緩解', tech:'3DCRT', dose:'8 / 20 / 30', fx:'1 / 5 / 10', note:'8 Gy/1fx = 30 Gy/10fx 疼痛緩解率（RTOG 9714）', source:'NCCN CNS 2025'},

  // ── Lymphoma ──────────────────────────────────────────
  {id:59, cancer:'Lymphoma', site:'DLBCL — Consolidation ISRT', tech:'IMRT', dose:'30–36', fx:'15–18', note:'+ R-CHOP；Bulky 或 extranodal；FDG-PET 指引降量可行', source:'NCCN Lymphoma 2025'},
  {id:60, cancer:'Lymphoma', site:'HL — Early favorable', tech:'IMRT', dose:'20', fx:10, note:'GHSG HD10/16；ABVD ×2 → ISRT 20 Gy；PET-guided de-escalation', source:'NCCN HL 2025'},
  {id:61, cancer:'Lymphoma', site:'HL — Early unfavorable', tech:'IMRT', dose:'30', fx:15, note:'ABVD ×4 → ISRT 30 Gy；或 BrECADD ×4 (HD21 試驗)', source:'NCCN HL 2025'},
  {id:62, cancer:'Lymphoma', site:'MALT — Gastric / Orbital', tech:'IMRT', dose:'24–30', fx:'12–15', note:'H. pylori 陰性或根除失敗；Orbital MALT 24 Gy/12fx 首選', source:'NCCN Lymphoma 2025'},

  // ── Bone / Mets ───────────────────────────────────────
  {id:63, cancer:'Bone/Mets', site:'骨轉移 — 緩解性', tech:'3DCRT', dose:'8 / 20 / 30', fx:'1 / 5 / 10', note:'8 Gy/1fx ≈ 30 Gy/10fx 疼痛緩解（RTOG 9714）；再程可重複 8 Gy', source:'NCCN Supportive 2025'},
  {id:64, cancer:'Bone/Mets', site:'骨轉移 — SBRT 寡轉移', tech:'SBRT', dose:'24 / 27 / 30', fx:'1–3', note:'24 Gy/1fx 或 27 Gy/3fx 或 30 Gy/3fx；高 LC > 90%', source:'NCCN 2025'},
  {id:65, cancer:'Bone/Mets', site:'骨轉移 — 術後鞏固', tech:'3DCRT', dose:'30', fx:10, note:'術後防止局部進展；SRS 可用於脊椎術後', source:'NCCN Supportive 2025'},
];
