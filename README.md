### V1.4 — RT 工具大擴充 + 劑量限制分區 + 頁標修正

**新增 RT 工具（放療 RT Tab 共 8 項）**
- 電子線劑量計算：依能量（4–20 MeV）計算 PDD、治療深度估算、R50/Rp 顯示
- MU 計算（光子線）：PDD/TMR × OF × Sc × Wedge × Tray × DR → Monitor Units
- SSD 修正（Mayneord F-factor）：不同 SSD 下 PDD 修正係數
- 平方反比定律（ISL）：劑量率換算至任意距離
- 屏蔽 / HVL 計算：HVL 層數、TVL、穿透劑量、衰減百分比

**劑量限制分區**
- 新增「部位」篩選列：CNS / 頭頸 / 胸腔 / 腹部 / 骨盆 / 其他
- 結果依器官名稱分組顯示，避免長清單

**頁標修正**
- 快速跳轉全部改用 jumpTo() global helper
- 點擊頁標自動展開卡片 + 平滑滾動定位
- 分期頁、工具計算頁、評分頁、RT 頁均修正

---

### V1.3.2 — 完整功能 + 北歐霧藍配色

**新增**
- Breast Prognostic Stage：補上 ER / PR / HER2 / Grade 欄位，內建 Anatomic ↔ Prognostic 切換 Tab
- 分期頁頂部快速跳轉（肺癌 / 直腸 / 前列腺 / HCC / 乳癌）
- 工具計算頁和評分頁頂部快速跳轉索引

**配色更新（Nordic Mist）**
- 背景：霧藍 #E8EAF0
- 卡片：灰粉 #F7F5F6
- 文字：暖灰黑 #2C2D35
- 邊框：中性暖灰 #D6D4D8
- Accent：消光板岩藍 #4A6D8C
- 來源標籤：低飽和色（RTOG/QUANTEC/TG-101）

**已完成所有 Phase 1–4 功能，待開發表格全部標記完成**

---

### V1.3.1 — 大改版：RT 獨立 / 北歐冷調 / Stepper UI

**改善**

**RT 工具獨立**
- 工具頁新增第三 Tab「放療 RT」
- BED/EQD2 一次輸入，自動列出三種組織（α/β 10/3/1.5）的 BED 與 EQD2 對照表
- Treatment Gap、Hypofractionation Converter 移至 RT Tab

**北歐冷調配色**
- 整體背景：#E8EEF5（冷藍灰）
- Header：深藍板（#1A2540）
- Accent：石板藍（#2B4D8E）
- 結果面板：#EDF2FA
- 告別暖米色，全面升級冷調

**Stepper UI（減少手輸）**
- 所有數值輸入改為 − value + 步進按鈕
- 選項類改為 pill 點選（性別、分組、部位等）
- 保留鍵盤直接輸入作為 fallback

**頁面一致性**
- 全站統一 pageWrap（px-4 pt-4）
- 卡片統一 .card 類（border + rounded-xl）
- 所有顏色改用 CSS variables

---

### V1.3 — Phase 4：AJCC 9th 分期工具

**新增功能**

**腫瘤分期（AJCC 9th Edition 2024）**
- Lung：T1a–T4 / N0–N3 / M0–M1c → Stage IA1 ～ IVB
- Rectum：T1–T4b / N0–N2b / M0–M1c → Stage 0 ～ IVC
- Prostate：T1–T4 / N0–N1 / M0–M1c + PSA + Grade Group → Stage I ～ IVB
- HCC：T1a–T4 / N0–N1 / M0–M1 → Stage IA ～ IVB
- Breast（Anatomic）：T1mi–T4d / N0–N3c / M0–M1 → Stage 0 ～ IV
- 每個癌種展開卡片，下拉選擇 T/N/M 後一鍵判定
- 結果顯示分期 + T/N/M 明細 + 備註

---

# 🦎 SELA RadOnc Tools

> 放射腫瘤科臨床工具 by SELA  
> Mobile-first 設計，適用於 GitHub Pages 靜態部署

---

## 版本規則

| 版號 | 說明 | 範例 |
|------|------|------|
| `+1.0` | 架構重寫、重大新功能 | V1.0 → V2.0 |
| `+0.1` | 新增工具模組、大功能擴充 | V1.0 → V1.1 |
| `+0.0.1` | Bug fix、文字修正、小調整 | V1.1 → V1.1.1 |

---

## 更新歷程

### V1.8 — 底部 Nav 穿透修復 + 劑量建議頁籤

**Bug fix**
- 底部導航列背景透明（兩個 `style` 屬性互相覆蓋）→ 合併修正，內容不再穿透
- 桌機 FAB (+) 按鈕跑出容器外 → 改用 `calc(50% - 14rem + 16px)` 定位

**新功能**
- 「劑量」頁改為雙頁籤：**劑量建議**（NCCN）/ **劑量限制**（RTOG/QUANTEC/TG-101/NCCN）
- 劑量建議：60 筆 NCCN 2024 各癌種建議劑量，可依癌別篩選（Lung / Breast / Prostate / Rectum / Liver / Esophagus / Stomach / Pancreas / H&N / CNS / Lymphoma / Bone/Mets）
- 新增 `data/dose-recs.js` 資料檔

---

### V1.7 — 桌機導航修復 + 橫向捲軸改善

**Bug fix**
- 桌機 header/nav 無法置中（`fixed left-0 right-0 max-w-md mx-auto` 失效）→ 改用 `translateX(-50%)`
- 所有 pill 篩選列改 `flex-wrap:wrap`，不再出現橫向捲軸

---

### V1.6 — 緊急修復：非工具頁白畫面

**Bug fix**
- 重構 Tools 頁時誤刪 `pageWrap()` 函式，導致 staging / constraints / icd / settings 全部白畫面

---

### V1.5 — 每頁單選篩選器 + Sticky 篩選列

**改善**
- 工具頁三個 Tab（RT/計算/評分）改為 pill 單選遮蔽，選了只顯示該工具
- 分期、ICD、劑量限制篩選器全改 sticky（捲動時固定在 header 下方）
- 新增 NCCN SBRT 劑量限制 43 筆（Lung/Liver/Spine/Prostate）

---


### V1.2.2 — 視覺重設計

**改善**
- Header 改為白底，橘色僅保留在 LOGO 本身
- 工具卡片 icon 全部換為極簡指向性 SVG 線條圖示（不再使用 emoji）
- 每個工具有語意化專屬圖示（劑量曲線、靶心、血管、脊椎、量規…）

---

### V1.2.2 — 視覺重設計

**改善**
- Header 改為白底，橘色僅保留在 LOGO 本身
- 工具卡片 icon 全部換為極簡指向性 SVG 線條圖示（不再使用 emoji）

---

### V1.2.1 — Bug fix & UI 改善

**改善**
- 工具頁新增分頁 Tab（計算工具 / 評分工具），避免長頁面捲動
- ICD-10 分類列上方留白過多，已修正

---

### V1.2 — Phase 3：ICD-10 + 劑量限制查詢

**新增功能**

**ICD-10 查詢**
- 常用腫瘤診斷碼資料庫（100+ 筆）
- 模糊搜尋：代碼、中文診斷名、英文診斷名
- 分類瀏覽：CNS / Head&Neck / Thorax / GI / GU / Gynecology / Breast / Lymphoma / Bone&STS / Skin / 轉移
- 一鍵複製 ICD 代碼

**劑量限制查詢**
- 內建資料庫（100+ 條限制）：RTOG / QUANTEC / TG-101
- 技術篩選：Conventional / SBRT 1fx / 3fx / 5fx
- 來源篩選：RTOG / QUANTEC / TG-101 / 自訂
- Lung SABR 專項限制：V20、V5、MLD、V12.5（RTOG、TG-101）
- 個人化 Override：覆蓋內建條目並保留原始值對照
- 新增自訂限制條目（院內 Protocol）
- ☆ 收藏常用條目（置頂顯示）
- 雙入口：查詢結果直接編輯 + 設定頁管理

**資料結構改進**
- localStorage 新增 customConstraints / starredConstraints 欄位
- JSON 匯出/匯入同步備份自訂 Constraint

---

### V1.1 — Phase 2：計算 + 評分工具擴充

**新增功能**

**計算工具**
- ALBI Score（Bilirubin + Albumin → Grade 1/2/3）
- MELD Score（Bilirubin + Creatinine + INR，含風險分層）
- Treatment Gap Correction（H&N 0.6 Gy/天、其他 0.5 Gy/天，可自訂）
- Hypofractionation Converter（BED 等效換算任意分次方案）
- Calvert Formula（內建 Cockcroft-Gault，算出 Carboplatin mg）
- Cockcroft-Gault（獨立 CrCl，含 Cisplatin 適用判斷 + CKD 分期）
- BSA Calculator（DuBois + Mosteller 雙公式 + BMI）
- Cisplatin 累積劑量追蹤器（逐次記錄，≥300 mg/m² 自動警示）

**評分工具**
- GPA Score（DS-GPA）：NSCLC / SCLC / Breast / Melanoma / GI / Renal 六種癌種
- SINS Score（脊椎不穩定評估，六項 0–18 分）
- Tokuhashi Score（脊椎轉移存活預測，0–15 分）
- RPA Class（腦轉移 Class I/II/III + 中位存活）
- ECOG ↔ KPS 對照表與互動換算

---

### V1.0 — Phase 1：初版上線

**新增功能**
- 整體 App 框架：Bottom Navigation（工具 / 分期 / 限制 / ICD / 設定）
- SELA 品牌 Header：橘底白壁虎 Logo + 版本號
- BED / EQD2 計算器（α/β ratio 預設 10 / 3 / 1.5 及自訂）
- Child-Pugh Score（五項評分 → Grade A/B/C + 存活率 + BCLC 分期串接）
- Roach Formula（LN risk + SV risk + D'Amico Risk Group 自動判定）
- 設定頁：每個工具獨立開關、Preset（全開 / 放腫核心 / 精簡）
- localStorage 自動儲存 + JSON 匯出/匯入

---

## 功能清單

### 計算工具
| 工具 | 狀態 |
|------|------|
| BED / EQD2 | ✅ V1.0 |
| Child-Pugh + BCLC | ✅ V1.0 |
| Roach Formula + D'Amico | ✅ V1.0 |
| ALBI Score | ✅ V1.1 |
| MELD Score | ✅ V1.1 |
| Treatment Gap Correction | ✅ V1.1 |
| Hypofractionation Converter | ✅ V1.1 |
| Calvert Formula | ✅ V1.1 |
| Cockcroft-Gault (CrCl) | ✅ V1.1 |
| BSA Calculator | ✅ V1.1 |
| Cisplatin 累積劑量 | ✅ V1.1 |

### 評分工具
| 工具 | 狀態 |
|------|------|
| GPA Score (DS-GPA) | ✅ V1.1 |
| SINS Score | ✅ V1.1 |
| Tokuhashi Score | ✅ V1.1 |
| RPA Class | ✅ V1.1 |
| ECOG ↔ KPS | ✅ V1.1 |

### 查詢
| 工具 | 狀態 |
|------|------|
| ICD-10（搜尋 + 分類） | ✅ V1.2 |
| Dose Constraint（RTOG/QUANTEC/TG-101）| ✅ V1.2 |

### 待開發（Phase 4）
| 工具 | 狀態 |
|------|------|
| AJCC 9th — Lung | ✅ V1.3 |
| AJCC 9th — Rectum | ✅ V1.3 |
| AJCC 9th — Prostate | ✅ V1.3 |
| AJCC 9th — HCC | ✅ V1.3 |
| AJCC 9th — Breast（Anatomic + Prognostic）| ✅ V1.3.2 |

---

## 技術架構

```
sela-radonc/
├── index.html          主程式（Vanilla JS + Tailwind CDN）
├── README.md           版本歷程
└── data/
    ├── icd10.js        ICD-10 腫瘤診斷碼資料
    └── constraints.js  劑量限制資料（RTOG/QUANTEC/TG-101）
```

**技術選型**
- Vanilla JS（無框架，零依賴）
- Tailwind CSS CDN
- Google Fonts（Noto Sans TC + DM Mono）
- localStorage（設定 + 個人化 Constraint）

---

## 部署到 GitHub Pages

1. 將整個資料夾 push 到 GitHub repo
2. Settings → Pages → Source: Deploy from branch `main` / `root`
3. 約 1 分鐘後訪問 `https://{username}.github.io/{repo}/`

**注意：** 需保留資料夾結構，`data/` 資料夾必須與 `index.html` 同層。

---

## 個人化 Constraint 使用說明

1. 進入「限制」頁面
2. 點擊任意條目的「編輯 / 覆蓋」按鈕
3. 修改數值並儲存 → 原始值保留在卡片下方供對照
4. 點 ☆ 收藏常用條目，會置頂顯示
5. 點右下角 **+** 新增全新自訂條目
6. 所有個人化資料可在「設定」→「匯出 JSON」備份

---

## 免責聲明

本工具僅供臨床參考，所有醫療決策請依據最新指引及臨床判斷。計算結果不能取代專業醫療意見。劑量限制數據以原始文獻為準，使用前請核對最新版本。
