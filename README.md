# 🦎 SELA RadOnc Tools

> 放射腫瘤科臨床工具 by SELA  
> Mobile-first 設計，適用於 GitHub Pages 靜態部署

---

## 版本歷程

### V2.3 — 移除非必要 UI 說明文字

**清理**
- 移除 BED/EQD2 卡片副標題「一組方案自動顯示…」
- 移除 Hypofractionation 卡片副標題「輸入原方案…」
- 移除電子線結果面板「公式依據：E(MeV) 近似法，僅供參考」
- 移除肺癌分期副標題「Non-small cell lung cancer — T/N/M staging」
- 移除乳癌分期副標題「Anatomic stage（不含生物標記）」
- 移除口咽分期副標題「p16+ (HPV-associated)」
- 移除分期頁面 header 「AJCC 9th Edition (2024)」
- 移除分期頁面底部免責聲明段落
- 移除設定頁免責聲明段落

---

### V2.2 — 程式碼優化：共用模組抽離

**重構**
- 新增 `js/utils.js`：統一所有模組依賴的 DOM util、互動控件、HTML builder
  - DOM: `gel()` / `numVal()` / `selVal()`
  - 控件: `toggleCard()` / `stepAdj()` / `stepClamp()` / `pillSelect()`
  - HTML builder: `U.stepper` / `U.pills` / `U.fld` / `U.calcBtn` / `U.cardWrap` / `U.stageResult`
- `tools-rt.js`：移除重複的 `v/el/setH/stepAdj/stepClamp/pillSelect/RTToggle/stepper/pills/cardWrap`，全改用 `U.*`
- `tools-calc.js`：移除同上重複宣告；移除 `pillSelect` monkey-patch，改以獨立 `calvModeChange()` 處理 Calvert 模式切換
- `tools-score.js`：移除重複 `gel/setH/toggleCard/cardWrap/calcBtn`
- `staging.js`：移除重複 `v/el/sel/fld/calcBtn/stageResult/card2/StagingToggle`，`StagingToggle` 統一為 `toggleCard`
- `index.html`：移除廢棄的 `.tab-bar/.tab-btn` CSS（已由 `.fpill` 取代）
- 總行數：2706 → 2526（減少 180 行）

---

### V2.1 — 分期點選修復 + 篩選樣式統一

**Bug fix**
- staging.js 被清空導致分期頁面全部無法點選 → 完整重建
- 頁籤（工具 RT/計算/評分）、劑量建議/限制 Tab、所有分類篩選 pill 全部統一使用 `.fpill` / `.fpill.on`
- 移除 `.tab-bar` / `.tab-btn` 的差異化樣式，視覺語言一致

---

### V2.0 — 設定預設修復 + 北歐 UI 全面整理

**Bug fix**
- 設定頁「快速預設」按鈕固定顯示「放腫核心」為選中 → 加入 `activePreset` 狀態追蹤，按下後才反白對應按鈕

**UI 全面整理**
- 新增 `.fpill` / `.fpill.on` CSS class，取代所有篩選 pill 的 inline style
- staging / ICD / 劑量頁所有篩選 pill 改用 `classList.toggle('on')` 更新
- CSS 變數統整：所有頁面的硬編碼 hex 值全改為 `var(--t1/t2/t3/accent/bg/card/border)`
- Tab bar 背景改用 `var(--border)` 取代固定灰值；input focus 加白底回饋
- 北歐配色微調：`--bg #ECEEF3`、`--card #F7F7F9`、`--accent #3D6494`、`--hdr #252831`

---

### V1.9 — 劑量 Tab 點選修復

**Bug fix**
- 劑量頁 Tab / 癌別 pill 無法點選 → ConTab / ConRecCancer 改為呼叫 `App.navigate('constraints')` 重渲染
- README 重整：版本號與歷程統一管理

---

### V1.8 — 劑量建議頁籤 + Nav 穿透修復

**Bug fix**
- 底部導航列背景消失（nav 上兩個 `style` 屬性互蓋）→ 合併修正，畫面不再穿透
- 桌機 FAB (+) 跑出容器外 → 改用 `calc(50% - 14rem + 16px)` 定位

**新功能**
- 「劑量」頁改為雙頁籤：**劑量建議**（NCCN 2024）/ **劑量限制**（OAR constraints）
- 劑量建議：60 筆各癌種建議劑量，按癌別 pill 篩選（Lung / Breast / Prostate / Rectum / Liver / Esophagus / Stomach / Pancreas / H&N / CNS / Lymphoma / Bone/Mets）
- 新增 `data/dose-recs.js` 資料檔

---

### V1.7 — 桌機導航修復 + 橫向捲軸改善

**Bug fix**
- 桌機 header / nav 無法置中（`fixed left-0 right-0 max-w-md` 失效）→ 改用 `translateX(-50%)`
- 所有 pill 篩選列改 `flex-wrap:wrap`，不再出現橫向捲軸

---

### V1.6 — 緊急修復：非工具頁白畫面

**Bug fix**
- 重構 Tools 頁時誤刪 `pageWrap()` 函式，導致 staging / constraints / icd / settings 全部白畫面

---

### V1.5 — 每頁單選篩選器 + Sticky 篩選列

**改善**
- 工具頁三個 Tab（RT / 計算 / 評分）改為 pill 單選遮蔽，選了只顯示該工具
- 分期、ICD、劑量限制篩選器全改 sticky（捲動時固定在 header 下方）
- NCCN SBRT 劑量限制新增 43 筆（Lung / Liver / Spine / Prostate）

---

### V1.4 — RT 工具擴充 + Nordic 重新設計

**新增功能**
- 電子線劑量計算、MU 計算（光子線）、SSD 修正（Mayneord）、ISL、HVL 屏蔽
- 劑量限制按器官分組（CNS / HN / Thorax / Abdomen / Pelvis）
- Nordic 配色系統（暖米白底 + 炭灰 accent）

---

### V1.3 — Phase 4：AJCC 9th 分期

**新增功能**
- 分期系統：肺癌 / 直腸 / 前列腺 / HCC / 乳癌 / 食道 / 胃癌 / 胰臟 / 頭頸（6 子部位）
- AJCC 9th Edition（2024）互動查詢，pill 單選切換各癌種

---

### V1.2 — Phase 3：ICD-10 + 劑量限制查詢

**新增功能**
- ICD-10 查詢：100+ 筆腫瘤診斷碼，支援代碼 / 中文 / 英文模糊搜尋，11 個分類
- 劑量限制查詢：100+ 筆 RTOG / QUANTEC / TG-101，技術 + 來源篩選
- Lung SABR 專項限制（V20、V5、MLD、V12.5）
- 個人化 Override / 新增自訂條目 / ☆ 收藏置頂

---

### V1.1 — Phase 2：計算 + 評分工具擴充

**新增功能**

計算工具：ALBI Score、MELD Score、Treatment Gap Correction、Hypofractionation Converter、Calvert Formula、Cockcroft-Gault、BSA Calculator、Cisplatin 累積劑量追蹤

評分工具：GPA Score（DS-GPA，6 癌種）、SINS Score、Tokuhashi Score、RPA Class、ECOG ↔ KPS

---

### V1.0 — Phase 1：初版上線

**新增功能**
- 整體 App 框架：Bottom Navigation（工具 / 分期 / 劑量 / ICD / 設定）
- SELA 品牌 Header：橘底白壁虎 Logo
- BED / EQD2 計算器（α/β ratio 預設 10 / 3 / 1.5 及自訂）
- Child-Pugh Score（Grade A/B/C + 存活率 + BCLC 分期串接）
- Roach Formula（LN risk + SV risk + D'Amico Risk Group）
- 設定頁：每個工具獨立開關、Preset（全開 / 放腫核心 / 精簡）
- localStorage 自動儲存 + JSON 匯出/匯入

---

## 功能清單

### 放療工具 (RT)
| 工具 | 版本 |
|------|------|
| BED / EQD2 | V1.0 |
| Child-Pugh + BCLC | V1.0 |
| Roach Formula + D'Amico | V1.0 |
| Treatment Gap Correction | V1.1 |
| Hypofractionation Converter | V1.1 |
| 電子線劑量計算 | V1.4 |
| MU 計算（光子線） | V1.4 |
| SSD 修正（Mayneord） | V1.4 |
| ISL（平方反比定律） | V1.4 |
| HVL 屏蔽計算 | V1.4 |

### 計算工具
| 工具 | 版本 |
|------|------|
| ALBI Score | V1.1 |
| MELD Score | V1.1 |
| Calvert Formula | V1.1 |
| Cockcroft-Gault (CrCl) | V1.1 |
| BSA Calculator | V1.1 |
| Cisplatin 累積劑量 | V1.1 |

### 評分工具
| 工具 | 版本 |
|------|------|
| GPA Score (DS-GPA) | V1.1 |
| SINS Score | V1.1 |
| Tokuhashi Score | V1.1 |
| RPA Class | V1.1 |
| ECOG ↔ KPS | V1.1 |

### 分期（AJCC 9th）
| 癌種 | 版本 |
|------|------|
| 肺癌、直腸、前列腺、HCC、乳癌 | V1.3 |
| 食道、胃癌、胰臟、頭頸（6 子部位） | V1.3 |

### 劑量查詢
| 功能 | 版本 |
|------|------|
| ICD-10 查詢 | V1.2 |
| 劑量限制（RTOG / QUANTEC / TG-101 / NCCN） | V1.2 / V1.5 |
| 劑量建議（NCCN 2024，各癌種） | V1.8 |

---

## 技術架構

```
sela-radonc/
├── index.html            主殼（HTML + CSS + Tailwind CDN）
├── README.md             版本歷程
├── assets/
│   └── logo.jpg          SELA 壁虎 Logo
├── data/
│   ├── icd10.js          ICD-10 腫瘤診斷碼（107 筆）
│   ├── constraints.js    劑量限制資料（132 筆）
│   └── dose-recs.js      NCCN 劑量建議（60 筆）
└── js/
    ├── app.js            路由、設定、localStorage（VERSION）
    ├── staging.js        AJCC 9th 分期（9 癌種）
    ├── tools-rt.js       放療工具
    ├── tools-calc.js     計算工具
    ├── tools-score.js    評分工具
    ├── ui-icd.js         ICD-10 查詢 UI
    └── ui-constraints.js 劑量建議 + 劑量限制 UI
```

**技術選型**：Vanilla JS（零依賴）、Tailwind CSS CDN、Google Fonts、localStorage

---

## 部署

```
GitHub → Settings → Pages → Source: main / root
https://{username}.github.io/{repo}/
```

注意：`data/` 與 `js/` 資料夾必須與 `index.html` 同層。

---

## 免責聲明

本工具僅供臨床參考，所有醫療決策請依據最新指引及臨床判斷。計算結果不能取代專業醫療意見。劑量限制與建議數據以原始文獻為準，使用前請核對最新版本。
