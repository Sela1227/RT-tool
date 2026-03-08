# 🦎 SELA RadOnc Tools

> 放射腫瘤科臨床工具 by SELA  
> Mobile-first 設計，適用於 GitHub Pages 靜態部署

---

## 版本規則

| 版號格式 | 說明 | 範例 |
|---------|------|------|
| `+1.0.0` | 架構重寫、大量新功能 | V1.0.0 → V2.0.0 |
| `+0.1.0` | 新增工具、功能擴充、UI 大改 | V1.0.0 → V1.1.0 |
| `+0.0.1` | Bug fix、文字修正、小調整 | V1.1.0 → V1.1.1 |

---

## 版本歷程

### V1.1.0 — 2025-xx-xx
**Phase 2 評分工具全數上線**

**新增功能**
- ALBI Score（肝功能評估）
- MELD Score（肝病嚴重度）
- Treatment Gap Correction（療程中斷補償）
- Hypofractionation Converter（分次方案等效換算）
- Calvert Formula + Cockcroft-Gault（Carboplatin 劑量 + CrCl）
- BSA Calculator（DuBois + Mosteller）
- Cisplatin 累積劑量追蹤器
- GPA Score — DS-GPA（NSCLC / SCLC / Breast / Melanoma / GI / Renal）
- SINS Score（脊椎不穩定評估）
- Tokuhashi Score（脊椎轉移存活預測）
- RPA Class（腦轉移 RPA 分類）
- ECOG ↔ KPS 對照表

---

### V1.0.0 — 2025-xx-xx
**Phase 1 初版上線**

**新增功能**
- 整體 App 框架：Bottom Navigation（工具 / 分期 / 限制 / ICD / 設定）
- BED / EQD2 計算器：支援 α/β ratio 預設值（10 / 3 / 1.5）及自訂
- Child-Pugh Score 計算器：5 項指標評分，輸出 Grade A/B/C + 存活率
- Child-Pugh 串接 BCLC 分期：整合 ECOG PS、腫瘤數目、大小、血管侵犯、肝外轉移
- Roach Formula：LN risk + SV risk，自動計算 D'Amico Risk Group
- 設定頁：每個工具獨立開關、Preset（全開 / 放腫核心 / 精簡）
- localStorage 設定儲存 + JSON 匯出/匯入

**設計**
- 北歐冷灰藍 + SELA 橘色品牌點綴
- Mobile-first，App-ready（PWA 準備中）
- 自訂 gecko SVG logo，橘底白壁虎

---

## 開發計劃

### Phase 2（V1.1.0）— 評分工具
- [x] ALBI Score
- [x] MELD Score
- [x] Treatment Gap Correction
- [x] Hypofractionation Converter
- [x] Calvert Formula（Carboplatin AUC）
- [x] Cockcroft-Gault（CrCl）
- [x] BSA Calculator
- [x] Cisplatin 累積劑量
- [x] GPA Score（腦轉移）
- [x] SINS Score（脊椎轉移）
- [x] Tokuhashi Score
- [x] RPA Class
- [x] ECOG ↔ Karnofsky
- [ ] Treatment Gap Correction
- [ ] Hypofractionation Converter
- [ ] Calvert Formula（Carboplatin AUC）
- [ ] Cockcroft-Gault（CrCl）
- [ ] BSA Calculator
- [ ] Cisplatin 累積劑量
- [ ] GPA Score（腦轉移）
- [ ] SINS Score（脊椎轉移）
- [ ] Tokuhashi Score
- [ ] RPA Class
- [ ] D'Amico / CAPRA（獨立頁）
- [ ] ECOG ↔ Karnofsky 換算

### Phase 3（V1.2.0）— 查詢資料庫
- [ ] ICD-10 搜尋 + 分類瀏覽（CNS / H&N / Thorax / GI / GU / GYN / Breast / Lymphoma / Bone&STS）
- [ ] Dose Constraint 查詢（Conventional / SBRT 1fx / 3fx / 5fx）
  - RTOG / QUANTEC / TG-101
  - Lung SABR：V20、V5、MLD、V12.5
  - 個人化 Override（保留原始值對照）
  - ⭐ 收藏常用條目
  - 結果頁直接編輯

### Phase 4（V1.3.0）— AJCC 9th 分期
- [ ] Lung
- [ ] Rectum
- [ ] Prostate（含 Grade Group）
- [ ] HCC（含 vascular invasion）
- [ ] Breast — Anatomic Stage
- [ ] Breast — Prognostic Stage（ER / PR / HER2 / Grade / Ki67）

### Phase 5（V1.4.0）— 參考頁 & 收尾
- [ ] Palliative RT 劑量對照表
- [ ] CTCAE 毒性分級查詢
- [ ] 淋巴結分區圖示（縱膈腔 / 頸部）
- [ ] PWA manifest.json + Service Worker（離線可用）
- [ ] 設定頁個人化 Constraint 管理介面

---

## 功能清單（完整）

### 計算工具
| 工具 | 狀態 | Phase |
|------|------|-------|
| BED / EQD2 | ✅ 完成 | 1 |
| Child-Pugh + BCLC | ✅ 完成 | 1 |
| Roach Formula | ✅ 完成 | 1 |
| ALBI Score | ✅ 完成 | 2 |
| MELD Score | ✅ 完成 | 2 |
| Treatment Gap | ✅ 完成 | 2 |
| Hypofractionation Converter | ✅ 完成 | 2 |
| Calvert Formula | ✅ 完成 | 2 |
| Cockcroft-Gault | ✅ 完成 | 2 |
| BSA Calculator | ✅ 完成 | 2 |
| Cisplatin 累積劑量 | ✅ 完成 | 2 |

### 評分工具
| 工具 | 狀態 | Phase |
|------|------|-------|
| GPA Score | ✅ 完成 | 2 |
| SINS Score | ✅ 完成 | 2 |
| Tokuhashi Score | ✅ 完成 | 2 |
| RPA Class | ✅ 完成 | 2 |
| D'Amico / CAPRA | ✅ 完成（Roach 整合）| 2 |
| ECOG ↔ KPS | ✅ 完成 | 2 |

### 分期（AJCC 9th）
| 癌種 | 狀態 | Phase |
|------|------|-------|
| Lung | ⏳ 待開發 | 4 |
| Rectum | ⏳ 待開發 | 4 |
| Prostate | ⏳ 待開發 | 4 |
| HCC | ⏳ 待開發 | 4 |
| Breast（Anatomic） | ⏳ 待開發 | 4 |
| Breast（Prognostic） | ⏳ 待開發 | 4 |

### 查詢
| 工具 | 狀態 | Phase |
|------|------|-------|
| ICD-10 | ⏳ 待開發 | 3 |
| Dose Constraint | ⏳ 待開發 | 3 |

---

## 技術架構

```
GitHub Pages（純靜態）
│
├── index.html          單一入口，所有功能
├── README.md           版本歷程與說明
└── （未來）
    ├── manifest.json   PWA 設定
    └── sw.js           Service Worker（離線）
```

**技術選型**
- Vanilla JS（無框架，零依賴）
- Tailwind CSS CDN
- Google Fonts（Noto Sans TC + DM Mono）
- localStorage 儲存設定

---

## 部署到 GitHub Pages

1. Fork 或 clone 此 repo
2. Settings → Pages → Source: Deploy from branch `main` / `root`
3. 等待約 1 分鐘後即可訪問 `https://{username}.github.io/{repo}/`

---

## 免責聲明

本工具僅供臨床參考，所有醫療決策請依據最新指引及臨床判斷。計算結果不能取代專業醫療意見。
