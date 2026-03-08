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
| AJCC 9th — Lung | ⏳ V1.3 |
| AJCC 9th — Rectum | ⏳ V1.3 |
| AJCC 9th — Prostate | ⏳ V1.3 |
| AJCC 9th — HCC | ⏳ V1.3 |
| AJCC 9th — Breast（Anatomic + Prognostic）| ⏳ V1.3 |

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
