# CLAUDE.md — RT-Tool

> **這份是給下次 Claude 看的工作上下文，不是文件。**
> 判斷標準只有一個：下次 Claude 讀完，能不能直接動手？
> 維護章法見 `SELA-Starter-Kit/conventions/CLAUDE-MD-章法.md`，每次升版前複習。
> 每升一版至少更新三處：踩過的坑、版本歷程、下版候選工作。

---

## 〇、當前狀態

- **版本：** V3.6.2
- **狀態：** 上線中（GitHub Pages）
- **一句話定位：** 放射腫瘤科臨床工具 App，醫師查劑量建議、腫瘤分期（AJCC 9th cTNM/pTNM）、計算 BED/EQD2、Roach、Child-Pugh 等
- **技術棧：** Vanilla JS + Tailwind CDN，無框架、無 build step，開 index.html 即跑
- **入口點：** `index.html`（載入所有 script，最後 `app.js` 呼叫 `App.init()`）
- **使用 Kit 版本：** V1.25.0

---

## 一、技術棧決策

| 選擇 | 替代品 | 選這個的理由 |
|------|--------|------------|
| Vanilla JS | React / Vue | 無 build step，GitHub Pages 直接部署，臨床端不需要 node 環境 |
| Tailwind CDN | 自寫 CSS / PostCSS | 快速原型，不需要 build step |
| localStorage | IndexedDB / 後端 | 無後端需求，個人設定存本機即可 |
| 多模組 JS 檔 | 單一 index.html | 超過 3000 行後可讀性崩潰，分拆維護 |

---

## 二、業務對映表（改什麼→動哪些檔）

| 想改什麼 | 主要動的檔 |
|---------|----------|
| 新增 RT 計算工具 | `js/tools-rt.js`（renderX + calcX + ALL_TOOLS 條目）+ `js/app.js`（enabledTools + settings 清單） |
| 新增臨床計算工具 | `js/tools-calc.js`（同上，ALL_CALC） |
| 新增評分工具 | `js/tools-score.js`（同上，ALL_SCORE） |
| 新增分期癌種 | `js/staging.js`（renderX + StageX + CANCER_LIST + stagingModePills） |
| 更新劑量建議 | `data/dose-recs.js`（DOSE_RECS array） |
| 更新 OAR 限制 | `data/constraints.js`（CONSTRAINTS array） |
| 更新 ICD-10 | `data/icd10.js` |
| 改全域配色 | `index.html` → `<style>` → `:root` CSS 變數 |
| 改 header / nav | `index.html` |
| 改工具預設開關 | `js/app.js` → `DEFAULT_SETTINGS.enabledTools` |
| 改設定頁工具清單 | `js/app.js` → `renderSettings()` |

**script 載入順序（不能調整）：**
`utils.js` → `icd10.js` → `constraints.js` → `dose-recs.js` → `tools-rt.js` → `tools-calc.js` → `tools-score.js` → `staging.js` → `ui-icd.js` → `ui-constraints.js` → `app.js`

改這張表 = 動以上對應的 js 檔 + `app.js` 的 settings 清單。

---

## 三、關鍵設計規則

**配色（北歐霧藍，保留不動）：**
```
--bg:#ECEEF3  --card:#F7F7F9  --border:#D8DAE2
--t1:#1F2029  --t2:#585A6B   --t3:#9A9BAA
--accent:#3D6494  --acc-bg:#DDE6F0  --hdr:#3C4257  --danger:#8B3A33
```
橘色只用在 Logo 圖片，UI 元素不用（Kit 預設 `#5A7A8B`，但 RT-Tool 已驗證 `#3D6494`，見衝突仲裁）。

**LocalStorage keys（全部 `rttool_` 前綴）：**
`rttool_settings` / `rttool_cisplatin` / `rttool_custom_constraints` / `rttool_starred_constraints` / `rttool_override_constraints`

---

## 四、踩過的坑（編號累積，永不重排）

**#1 outerHTML 替換讓 id 消失（最常踩）**
- 症狀：第一次計算正常，第二次點計算沒反應（靜默失敗，無 console error）
- 原因：`e.outerHTML = '<div>...</div>'` 換掉含 id 的 DOM 節點，新 div 沒帶回同一個 id，下次 `gel('X-result')` 回傳 null
- 做法：工具計算結果用 `setResult(id, html)` 或 `e.outerHTML = resultBox(html, id)` 傳 id；分期結果用 `setStageResult(id, ...)` 寫 innerHTML 保留外層 id

**#2 U.cardWrap body 預設 hidden，切換工具後當掉**
- 症狀：切到不同工具 pill，工具體消失、按鈕不可點（看起來「當掉」）
- 原因：`U.cardWrap` 的 body div 是 `class="hidden"`，每次重新 render 後沒人展開
- 做法：`app.js` render dispatch `case 'tools'` 末尾固定呼叫 `toggleCard(activeKey)`

**#3 script 載入順序不能動**
- 症狀：`U is not defined` / `App is not defined` ReferenceError
- 原因：utils.js 必須最先，app.js 必須最後
- 做法：index.html script 順序如二節所列，不要調整

**#4 版本號用 regex 更新**
- 症狀：版本號沒換到（靜默失敗）
- 原因：格式在 V3.2 vs V3.2.0 間漂移，純字串 replace 找不到
- 做法：`re.sub(r'V\d+\.\d+(?:\.\d+)?', TARGET, content)`

**#5 Python 寫檔後確認大小**
- 症狀：寫完檔案變 0 bytes，工具模組消失
- 原因：Python `open('w')` 後邏輯中途出錯，檔案已截斷但沒寫入
- 做法：寫完立刻 `node --check 檔案.js` + `wc -l` 確認行數合理

**#6 sel() 已移除**
- 症狀：`sel is not defined` ReferenceError
- 原因：舊版 `sel()` 已統一換成 `selVal()`
- 做法：新增程式只用 `selVal(id)`

**#7 Roach Formula SV 公式（V3.2.1 修）**
- 症狀：SV 風險值偏低
- 原因：SV 應為 `PSA + 10×(GS-6)`，原本誤寫為 `PSA/3 + ...`
- 做法：三公式（SV/LN/ECE）全列，`tools-calc.js` calcRoach()

**#8 Claude 工作環境跨對話重置（對應 Kit 坑 #48）**
- 症狀：新對話開頭 `/home/claude/rt-tool/` 不存在，bash 報 `No such file or directory`
- 原因：Anthropic 平台跨對話後可能重置 `/home/claude/`，但 `/mnt/user-data/outputs/` 是持久的
- 做法：每次新對話先執行：
  ```bash
  ls /home/claude/rt-tool/js/ 2>/dev/null || (cd /home/claude && unzip -q /mnt/user-data/outputs/"RT-Tool V3.2.2.zip")
  ```
  然後確認 `node --check /home/claude/rt-tool/js/app.js`

**#9 Python 字串切片重寫程式碼會吞夾層定義（對應 Kit 坑 #55）**
- 症狀：用「函式 A → 函式 B」區段替換後，夾在中間的其他 helper 被一起刪掉，程式跑不起來，但 replace 本身靜默成功
- 原因：兩錨點之間可能夾著後來插入的定義，切片連同夾層一起吞掉
- 做法：替換前先 grep 確認區間內容：
  ```bash
  sed -n '/function renderX/,/function renderY/p' tools-rt.js | grep -n "^  function \|^  window\."
  ```
  確認只有目標函式才替換；每次 replace 都用 assert 確認有換到

**#10 分期版本標示必須逐癌別查核（AJCC Version 9 是分站發布）**
- 症狀：把所有癌別標成「AJCC 9th」，實際上多數仍是第8版 → 臨床醫師會質疑正確性
- 原因：AJCC 自 2024 起從「Edition」改為「Version」，逐癌別（disease site）分批發布 V9，不是整套換版
- 現況（2026）：僅 **肺癌（2025生效）、鼻咽（2024）、口咽 p16+（2026生效）** 有 V9；其餘全部仍是第8版
- 做法：每個分期卡片標題標明實際版本；改分期邏輯前先查該癌別是否已發布 V9，沒有就用第8版；肺癌 9th 的 N2a/N2b、M1c1/M1c2 stage group 與 8th 不同，改動需逐格驗證（用 node 測試表窮舉）

**#11 PWA on GitHub Pages（對應 Kit 坑 #13/#14/#39/#60）**
- 症狀：SW 快取到 POST 或跨域資源、版本更新後使用者看到舊版、子路徑部署資源 404
- 做法：sw.js 只快取同源 GET（跨域 Tailwind/Fonts 直接放行）；`CACHE_VERSION` 每次發版跟著 app 版本改（本專案 = `rt-tool-x.y.z`）；所有路徑用相對路徑（`./`）；manifest 與 sw.js 都是真實檔案，不用 blob
- 發版：改版本號時，index.html + app.js + **sw.js CACHE_VERSION** 三處一起改（regex）

**#12 卡片展開動畫用 max-height 會裁切內容 / 分期頁自己的展開邏輯沒同步**
- 症狀：分期頁卡片只顯示標題 + 半截內容，下方被裁掉、大片空白；工具頁正常
- 原因：(1) V3.3.0 的 `.card-body { max-height:1400px }` 動畫會裁掉超過高度的內容（結果表格）；(2) staging.js 的 `afterRender`/`StagingFilter` 仍用舊的 `remove('hidden')`，沒加 `.open`，與新 CSS 不相容
- 做法：卡片展開一律走 `toggleCard(id)`（加 `.open`）；`.card-body` 用 `display:none` + `.open{display:block}` + opacity/transform fade（不用 max-height，永不裁切）；所有展開路徑（tools render、staging afterRender/filter、jumpTo）統一呼叫 toggleCard
- 教訓：改共用元件的顯隱機制（CSS class）時，要 grep 所有直接操作 `-body` class 的地方一起改，不能只改 toggleCard

**#13 CDN 依賴的 PWA 在醫院網路會失去樣式（對應 Kit 坑 #75）**
- 症狀：院內網路封鎖 cdn.tailwindcss.com / fonts.googleapis.com → PWA 開得起來但**完全沒有樣式**；README 宣稱的「離線可用」實際是假的
- 原因：sw.js 的 fetch handler 對跨域 `return`（不快取），CDN 檔案永遠不進 cache；離線時 Tailwind 載不到 = 無 CSS
- 做法：兩段式安裝 —— 本地 App Shell 用 `cache.addAll(SHELL)`（缺檔就該失敗）；CDN 用 `Promise.allSettled(CDN.map(u => cache.add(new Request(u,{mode:'no-cors'}))))`（封鎖時降級、不擋安裝）。fetch handler 要認得 CDN 網域並快取；`no-cors` 回的是 opaque response（`status===0`），判斷式要收 `res.type === 'opaque'`，否則永遠存不進去
- 教訓：醫院是本 app 的主場，受限網路是常態不是例外

**#14 localStorage key 改名沒寫 migration = 使用者資料直接消失（對應 Kit 坑 #69）**
- 症狀：V3.2.0 專案更名 RT-Tool，把 `sela_*` 全改成 `rttool_*`，舊使用者的設定 / Cisplatin 記錄 / 自訂 constraint 全部讀不到（不會報錯，就是空的）
- 原因：localStorage key 是**資料層 ID**，不是可以跟著品牌名一起換的字串。改名 = 換一組全新的儲存空間
- 做法：key 上線即凍結。V3.6.2 已補一次性 `migrateLegacyKeys()`（只在新 key 不存在時搬、搬完標記 `rttool_migrated_v320`）。**往後不論專案怎麼更名，key 前綴一律維持 `rttool_`**

---

## 五、煙霧測試（升版打包前必跑）

```bash
BASE=/home/claude/rt-tool

# 1. 語法驗證（所有 JS 檔）
for f in $BASE/js/*.js; do
  node --check "$f" && echo "✅ $(basename $f)" || echo "❌ $(basename $f)"
done

# 2. 版本號一致性
grep -h "V[0-9]" $BASE/index.html $BASE/js/app.js | grep -oE "V[0-9]+\.[0-9]+\.[0-9]+" | sort -u
# 預期：只出現一個版本號

# 3. 確認 localStorage 沒有舊 sela_ 前綴
grep -r "sela_" $BASE/js/ && echo "❌ 舊 key 殘留" || echo "✅ key 全部 rttool_"

# 4. 確認 sel() 沒有殘留
grep -rn "\bsel(" $BASE/js/ | grep -v "selVal\|select\|// " && echo "❌ sel() 殘留" || echo "✅"

# 5. 資料筆數 count assertion（Kit 坑 #72：交付訊息報的數字要當場實測）
echo "constraints: $(grep -c '{id:' $BASE/data/constraints.js)"
echo "dose-recs:   $(grep -c '{id:' $BASE/data/dose-recs.js)"
echo "icd10:       $(grep -c '{code:' $BASE/data/icd10.js)"

# 6. PWA：CDN 有沒有被 SW 快取（Kit 坑 #75）
grep -q "allSettled" $BASE/sw.js && echo "✅ CDN 走 allSettled" || echo "❌ CDN 未快取，醫院網路會沒樣式"

# 7. 三處版本號一致（index.html / app.js / sw.js CACHE_VERSION）
grep -ohE "V[0-9]+\.[0-9]+\.[0-9]+" $BASE/index.html $BASE/js/app.js | sort -u
grep -oE "rt-tool-[0-9]+\.[0-9]+\.[0-9]+" $BASE/sw.js
```

全部綠才打包。

---

## 六、版本歷程（近 10 版）

| 版本 | 重點 |
|------|------|
| V3.0.0 | ANC、NCCN 攝護腺風險、EQD2 累加、等效方形野 |
| V3.1.0 | 工具當掉根本修復（toggleCard auto-expand，坑 #2） |
| V3.2.0 | cTNM/pTNM 切換、setStageResult、版本號三碼 |
| V3.2.1 | Roach Formula 完整三公式（SV/LN/ECE），CLAUDE.md 首次對齊 Kit V1.11.1 |
| V3.3.0 | 對齊 Kit V1.21.0：補 .gitignore、煙霧測試、升版必讀、一句話總結；新增坑 #8 #9；zip 命名改空格格式 |

---

## 七、下版候選工作（按優先序）

1. **更多 AJCC 9th 分期（Bladder、Cervix）** — 臨床端最常問的兩個缺口，且分期邏輯套現有 staging.js 架構可快速完成
2. PWA / Service Worker（離線使用）— 臨床環境常斷網
3. 個人化 Constraint 匯出 / 雲端同步
4. GBM / 腦轉移專屬計算器（SRS 劑量選擇）
5. 手機 UX 優化：數字鍵盤觸發（type="number" 在 iOS 有坑）

---

## 八、升版必讀

### Kit 衝突仲裁（保留不動）

| Kit 規則 | RT-Tool 實際 | 裁決 |
|---------|------------|------|
| 主題色用 `#5A7A8B` | 北歐霧藍 `#3D6494`（臨床端已驗證數月） | ✗ 保留 `#3D6494` |
| zip 命名空格分隔 | 原用連字號 `rt-tool-v3.2.1.zip` | ✓ V3.2.2 起改為 `RT-Tool V3.2.2.zip` |

### V3.2.2 部署動作

- [ ] 語法驗證：`五、煙霧測試` 全綠
- [ ] 推 `main` 分支
- [ ] GitHub Pages 約 1-2 分鐘後生效，確認 header 顯示 V3.2.2

---

## 九、一句話總結

V3.2.2 完成對齊 Kit V1.21.0（補 `.gitignore`、煙霧測試、升版必讀、zip 命名空格格式、坑 #8/#9），下版第一優先是 Bladder + Cervix 分期（直接套現有 staging.js 架構，最快補齊臨床缺口）。
