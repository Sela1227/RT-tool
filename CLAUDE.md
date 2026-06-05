# CLAUDE.md — RT-Tool

> **這份是給下次 Claude 看的工作上下文，不是文件。**
> 判斷標準只有一個：下次 Claude 讀完，能不能直接動手？
> 每升一版至少更新三處：踩過的坑、版本歷程、下版候選工作。

---

## 〇、當前狀態

- **版本：** V3.2.0
- **狀態：** 上線中（GitHub Pages）
- **一句話定位：** 放射腫瘤科臨床工具 App，供醫師計算 BED/EQD2、查劑量限制、腫瘤分期、評分工具
- **技術棧：** Vanilla JS + Tailwind CDN，無框架、無 build step，直接開 index.html 即可跑
- **入口點：** `index.html`（載入所有 script，app.js 最後，呼叫 `App.init()`）

---

## 一、技術棧決策

| 選擇 | 替代品 | 選這個的理由 |
|------|--------|------------|
| Vanilla JS | React / Vue | 無 build step，GitHub Pages 直接部署，給臨床醫師用不需要 node 環境 |
| Tailwind CDN | 自寫 CSS | 快速原型，不需要 PostCSS / purge |
| localStorage | IndexedDB / 後端 | 無後端需求，個人設定存本機即可 |
| 多檔模組化 | 單一 index.html | 超過 3000 行後可讀性崩潰，分拆維護 |

---

## 二、業務對映表

| 想改什麼 | 動哪些檔 |
|---------|---------|
| 新增 RT 計算工具 | `js/tools-rt.js`：加 renderX() + calcX() + ALL_TOOLS 條目；`js/app.js`：加 enabledTools 預設 + settings 清單 |
| 新增臨床計算工具 | `js/tools-calc.js`：同上，ALL_CALC |
| 新增評分工具 | `js/tools-score.js`：同上，ALL_SCORE |
| 新增分期癌種 | `js/staging.js`：加 renderX() + StageX() + CANCER_LIST 條目 + stagingModePills |
| 更新劑量建議 | `data/dose-recs.js`（DOSE_RECS array） |
| 更新 OAR 限制 | `data/constraints.js`（CONSTRAINTS array） |
| 更新 ICD-10 | `data/icd10.js` |
| 改全域配色 | `index.html` `<style>` `:root` 區塊 |
| 改 header / nav | `index.html` |
| 改工具預設開關 | `js/app.js` `DEFAULT_SETTINGS.enabledTools` |
| 改設定頁工具清單 | `js/app.js` `renderSettings()` |

**script 載入順序（不能動）：**
`utils.js` → `icd10.js` → `constraints.js` → `dose-recs.js` → `tools-rt.js` → `tools-calc.js` → `tools-score.js` → `staging.js` → `ui-icd.js` → `ui-constraints.js` → `app.js`

---

## 三、關鍵設計規則（違反會當掉）

**配色（北歐霧藍，保留不動）：**
```
--bg:#ECEEF3  --card:#F7F7F9  --border:#D8DAE2
--t1:#1F2029  --t2:#585A6B   --t3:#9A9BAA
--accent:#3D6494  --acc-bg:#DDE6F0  --hdr:#3C4257  --danger:#8B3A33
```
橘色 `#E8550A` / `#F36825` 只用在 Logo 圖片，UI 元素不用。

**LocalStorage keys（全部 `rttool_` 前綴）：**
`rttool_settings` / `rttool_cisplatin` / `rttool_custom_constraints` / `rttool_starred_constraints` / `rttool_override_constraints`

---

## 四、踩過的坑（編號累積，永不重排）

**#1 outerHTML 替換讓 id 消失（最常踩）**
- 症狀：第一次計算正常，第二次點計算沒反應（靜默失敗）
- 原因：`e.outerHTML = '<div>...</div>'` 換掉含 id 的元素，新 div 如果沒寫同一個 id，下次 `gel('X-result')` 回傳 null
- 做法：工具計算結果用 `e.outerHTML = resultBox(html, 'X-result')` 傳 id；分期結果改用 `setStageResult('X-result', stage, details, note)`（innerHTML 寫法，保留外層 id）

**#2 U.cardWrap body 預設 hidden，切換工具後當掉**
- 症狀：切到不同工具 pill，工具體消失、按鈕不可點
- 原因：`U.cardWrap` 的 body div 是 `class="hidden"`，每次重新 render 後需手動展開
- 做法：`app.js` render dispatch `case 'tools'` 末尾固定呼叫 `toggleCard(activeKey)`

**#3 script 載入順序不能動**
- 症狀：`U is not defined` / `App is not defined` 之類的 ReferenceError
- 原因：utils.js 必須最先（定義全域 U / gel / numVal 等），app.js 必須最後（依賴所有模組）
- 做法：index.html script 順序如二節所列，不要調整

**#4 版本號用 regex 更新**
- 症狀：版本號沒更新到（靜默失敗）
- 原因：格式在 V2.x / V3.x.x 間漂移，純字串 replace 找不到
- 做法：`re.sub(r'V\d+\.\d+(?:\.\d+)?', TARGET, content)` 統一用

**#5 Python 寫檔前確認大小**
- 症狀：寫完檔案變 0 bytes，整個工具檔消失
- 原因：Python open('w') + 邏輯錯誤 = 清空檔案
- 做法：寫完立刻 `node --check` 語法驗證；`wc -l` 確認行數合理

**#6 sel() 已移除**
- 症狀：`sel is not defined` ReferenceError
- 原因：舊版 `sel()` 已統一換成 `selVal()`，殘留呼叫會爆
- 做法：新增程式只用 `selVal(id)`，不用 `sel(id)`

**#7 Roach Formula SV 公式錯誤（V3.2.1 修）**
- 症狀：SV 風險值偏低（原本用 PSA/3，應為 PSA）
- 原因：實作時公式寫錯，SV 應為 `PSA + 10×(GS-6)`，不是 `PSA/3 + ...`
- 做法：`tools-calc.js` calcRoach()，三公式（SV / LN / ECE）全部列出並顯示

---

## 五、發版 Checklist

```
□ js/app.js       VERSION 常數（regex 更新）
□ index.html      header badge 版本
□ CLAUDE.md       〇節版本號、九節歷程表
□ README.md       版本歷程條目
□ node --check    所有修改過的 .js
□ zip 打包        rt-tool-vX.X.X.zip → /mnt/user-data/outputs/
```

---

## 六、Kit 衝突仲裁

| Kit 規則 | RT-Tool 實際 | 裁決 |
|---------|------------|------|
| 主題色用 Kit 預設（#5A7A8B） | 北歐霧藍 #3D6494（已被臨床端驗證） | ✗ 保留 #3D6494，Kit 色不動 |
| SELA 橘 #F36825 | Logo 用 #E8550A | ✗ 保留現有，差異微小且 logo 已驗證 |
| Python coding style | Vanilla JS 專案 | ✗ 不適用，JS 命名參考 Kit 命名慣例 |

---

## 七、版本歷程

| 版本 | 關鍵變更 |
|------|---------|
| V1.0–V2.2 | 工具初版、ICD、Constraint、Nordic UI、utils.js 提取 |
| V2.3–V2.9 | 分期修正、GPA 修復、BED 重設計、劑量建議 NCCN 2025、PSA DT |
| V3.0.0 | ANC、NCCN 攝護腺風險、EQD2 累加、等效方形野 |
| V3.1.0 | 工具當掉根本修復（toggleCard auto-expand，坑 #2）|
| V3.2.0 | cTNM/pTNM 切換、setStageResult、版本號三碼、CLAUDE.md 對齊 Kit |
| V3.2.1 | Roach Formula 完整（SV/LN/ECE）、CLAUDE.md 套 Kit 章法 |

---

## 八、下版候選工作

- 更多 AJCC 9th 分期（Bladder、Cervix）
- PWA / Service Worker（離線使用）
- 個人化 Constraint 雲端同步
