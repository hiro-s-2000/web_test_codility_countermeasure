<!-- NAV_BAR -->
> **手順 40 / 45。** 左メニューの上から 40 番目です。読み終えたら、すぐ下の「02_例題1_奇数回出現要素の特定_XOR独自実装」を開いてください。

# 試験直前用 Kotlin高速イディオム＆境界値チートシート（爆速打鍵＆AI誤認ゼロ版）

> **⚠️ 鉄則**: Codility本番ではコピー＆ペーストを行わず、このシートの**3〜4文字定番略語（`ans`, `cnt`, `cur`, `mp`, `st`, `l`, `r`, `lo`, `hi`）**と**短縮イディオム**を使って**Webエディタ上で直接タイピング**してください（打鍵量を50%削減しつつPlayback履歴の安全を100%確保するため）。

---

## 1. 冒頭3分で書く「骨格テンプレート」＆入力再生ログ（Playback）4大原則

### 💡 AI利用を一切疑われず、かつタイピング速度を2倍にする4原則
1. **紙ではなく「エディタ内コメント（`//`）」で20〜30文字の思考メモを最初に打つ**:
   - 何分も無入力のまま画面外（紙）を見続けると、Webカメラ監視（Proctoring）やタイムライン再生で「別端末のAIを見ているのでは？」と疑われます。
   - 問題を読んだらまず `// 1. ガード節  2. ソート  3. 差が1か見る` のように単語メモをエディタに直接打ちます（※図を描くために白紙を使う場合は、開始直後にカメラへ白紙とペンを2〜3秒見せてから使います）。
2. **「外枠（骨格）」から順番に作り、最後にループの中身を埋める（アウトサイド・イン入力）**:
   - 1行目から最終行まで順番通りにベタ打ちするのは「AI写経」の典型ログです。
   - ①まず1行ガード節 `if (A.isEmpty()) return 0` と `var ans = 0` / `return ans` を書く → ②次にループやローカル関数 `fun ok()` のガワだけ書く → ③最後にループの中身を埋める、という人間らしいトップダウン順序で入力します。
3. **1つ目のブロックを書いたら必ず一度 `Run` を押す**:
   - 完成まで一度も `Run` しないのは不自然です。ガード節や最初の初期化・ループを書いた段階で1〜2回 `Run` を挟み、試行錯誤の自然なログを残します（Submit前のRunは何回押しても減点ゼロです）。
4. **変数名は「3〜4文字の定番略語」に統一し、`maxOf` / `minOf` で `import` すら省く**:
   - 生成AIは `uniqueElementCount` や `maxProfitSoFar` のような長い教科書的変数名を好みます。制限時間内にそれを高速・無ミスで打つとタイムロスになるうえAI写経を疑われます。
   - 一方で `a`, `b`, `c` の乱用は人間によるコードレビューで可読性減点になります。
   - **`ans`, `res`, `cnt`, `tot`, `cur`, `idx`, `arr`, `mp`, `st`, `l`, `r`, `lo`, `hi`, `mid`, `mx`, `mn`** の定番略語を使い、`import kotlin.math.max` が不要な標準組み込みの **`maxOf(a, b)` / `minOf(a, b)`** を徹底活用します。

```kotlin
fun solution(A: IntArray): Int {
    // 1. ガード節 (空/1要素)
    // 2. 累積カウントで1パス集計 O(N)
    val n = A.size
    if (n == 0) return 0
    if (n == 1) return A[0]

    var ans = 0
    var cur = 0L
    for (i in 0 until n) {
        // 中身を埋める（ガワを書いた段階で一度 Run を押すと自然）
        cur += A[i]
        ans = maxOf(ans, cur.toInt())
    }
    return ans
}
```

---

## 2. コーディング速度を2倍にする「ボクシングゼロ＆最短打鍵イディオム」

### ① プリミティブ配列の生成・ソート・逆順走査
```kotlin
val cnt = IntArray(n)
val acc = LongArray(n + 1)

// 元配列を壊さずインプレースソート（Boxingゼロ）
val arr = A.clone().apply { sort() }

// 降順ループ（reversedArray()はコピー発生のため downTo が最速）
for (i in arr.lastIndex downTo 0) {
    val x = arr[i]
}
```

### ② 二重ループ $O(N^2)$ を $O(N)$ に落とす「4大武器」の最短記述

#### 武器1：ハッシュマップ集計 (`mp`) ＆ セット重複排除 (`st`)
```kotlin
val mp = HashMap<Int, Int>(A.size * 4 / 3 + 1)
for (x in A) {
    mp[x] = (mp[x] ?: 0) + 1
}

val st = HashSet<Int>(A.size * 4 / 3 + 1)
for (x in A) st.add(x)
```

#### 武器2：累積和 (`acc`) — 区間 $[l, r]$ の和を $O(1)$ 取得
```kotlin
val acc = LongArray(A.size + 1)
for (i in A.indices) acc[i + 1] = acc[i] + A[i]
// 区間 [l, r] (両端含む) の和: acc[r + 1] - acc[l]
```

#### 武器3：尺取り法 (`l`, `r`) — 条件を満たす最小/最長区間を $O(N)$ 走査
```kotlin
var l = 0
var cur = 0L
var ans = Int.MAX_VALUE
for (r in A.indices) {
    cur += A[r]
    while (cur >= target && l <= r) {
        ans = minOf(ans, r - l + 1)
        cur -= A[l++]
    }
}
```

#### 武器4：答えで二分探索 (`lo`, `hi`, `mid` + ローカル関数 `fun ok()`)
`solution` 内にローカル関数 `fun ok(lim: Long)` を書けば、`A` や `K` を引数で渡すタイピングがゼロになります！
```kotlin
var lo = 0L
var hi = 1_000_000_000L
var ans = hi

fun ok(lim: Long): Boolean {
    var cnt = 1
    var cur = 0L
    for (x in A) {
        if (cur + x > lim) { cnt++; cur = x.toLong() } else cur += x
    }
    return cnt <= K
}

while (lo <= hi) {
    val mid = (lo + hi) ushr 1
    if (ok(mid)) { ans = mid; hi = mid - 1 } else lo = mid + 1
}
```

### ③ 2行で書ける超高速プリミティブ Stack / Queue / 非再帰Union-Find
試験中に20行のラッパークラスを書く必要はありません。配列＋ポインタ変数で書けば5秒で打てて実行速度も最速です。
```kotlin
// 1. Intスタック（2行）
val st = IntArray(n); var top = 0
// push: st[top++] = x  |  peek: st[top - 1]  |  pop: val v = st[--top]

// 2. Intキュー（2行・2次元グリッドBFSは r * w + c で1次元化）
val q = IntArray(n); var hd = 0; var tl = 0
// enqueue: q[tl++] = s  |  dequeue: val u = q[hd++]  |  notEmpty: hd < tl

// 3. 非再帰Union-Find（ローカル関数で7行）
val par = IntArray(n) { it }
fun find(x: Int): Int {
    var cur = x
    while (cur != par[cur]) { par[cur] = par[par[cur]]; cur = par[cur] }
    return cur
}
```

### ④ 切り上げ除算と約数列挙のオーバーフロー防止
```kotlin
// 切り上げ除算 ceil(a / b)
val up = (a + b - 1) / b

// 約数列挙 O(sqrt(N)) ※ d * d が Int.MAX_VALUE で溢れないよう必ず Long にする！
var d = 1L
val nL = N.toLong()
while (d * d <= nL) {
    if (nL % d == 0L) { /* 処理 */ }
    d++
}
```

---

## 3. Submit直前に「見えないテストケース」を撃破するカスタムテスト5行

Submitボタンを押す前に、画面下部の「Test cases」タブに以下の境界値を入れて「Run」を実行してください。

1. **最小サイズ**: `[0]` または `[1]`（空配列が許容されるなら `[]`）
2. **2要素（同値・異値）**: `[5, 5]`, `[1, 2]`, `[2, 1]`
3. **極端な負数・32bit上限**: `[-1000000000, -1000000000]`, `[2147483647, 2147483647]`
4. **単調増加・単調減少**: `[1, 2, 3, 4, 5]`, `[5, 4, 3, 2, 1]`
5. **全要素ゼロまたは同一**: `[0, 0, 0, 0]`

---

## 4. 【5問・200分 / 3問・120分 両対応】解く順番＆タスク別チェックリスト

### ⏱ 冒頭5分で全問題のタブを開き、以下の順番で解く！
1. **第1優先（15〜20分）**: **知識問題（MCQ）** または **バグ修正問題（Bugfixing）**
2. **第2優先（30〜40分×1〜2問）**: **アルゴリズム問題**（脳がフレッシュな前半〜中盤で処理）
3. **第3優先（40〜50分×1〜2問）**: **Android実務実装 / シミュレーション / 単体テスト問題**
4. **ラスト15分**: 全問題のコンパイル確認・`println` 削除・未Submit防止チェック

### 🐛 Bugfixing（バグ修正問題）の絶対鉄則
- **「at most X lines」の行数制限を絶対に守る！**（全書き換えは即0点。迷ったら右上の `Reset` で初期コードに戻してから該当行だけ直す）
- **見るべき6大ポイント**:
  1. ループ開始・終了が `1 until n` や `n - 1` になっていて先頭 `A[0]` / 末尾 `A[n-1]` が漏れていないか？
  2. ループ末尾まで連続したときに `else` に入らず `max` 更新が漏れていないか？
  3. 初期値が `0` や `-1` のせいで、全要素負数や全要素1回出現時に破綻しないか？
  4. 二分探索の `mid = (l + r) / 2` と `l = mid` で2要素時に無限ループになっていないか？（→ `(l + r + 1) / 2` に直す）
  5. `if ... else if` で本来両方チェックすべき条件が排他になっていないか？
  6. `&&` と `||`、`if` と `while` が逆になっていないか？

### 📱 Android実務実装タスクの失点ゼロ4大チェック
1. **ViewModel + Coroutines**:
   - `try-catch` で `catch (e: CancellationException) { throw e }` を必ず入れてキャンセルを握り潰さない！
   - 新規リクエスト時に古い `searchJob?.cancel()` を呼んでいるか？
2. **Form Validation（EditText / Button）**:
   - **`init` ブロック（初期化直後）** で一度 `submitButton.isEnabled = ...` を評価して初期状態を正しくセットしたか？
3. **RecyclerView.Adapter**:
   - `onBindViewHolder` で `if` だけでなく **`else` 側のリセット処理（`visibility = View.GONE`, `text = ""` 等）** を明示したか？（ViewHolder再利用バグ防止）
4. **OkHttp Interceptor**:
   - 401や503でリトライ（2回目の `chain.proceed`）を呼ぶ直前に、必ず **`res.close()`** を呼んだか？
