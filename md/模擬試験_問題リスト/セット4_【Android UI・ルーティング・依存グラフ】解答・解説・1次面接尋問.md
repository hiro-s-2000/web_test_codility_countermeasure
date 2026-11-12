<!-- NAV_BAR -->
> **手順 35 / 45。** 左メニューの上から 35 番目です。読み終えたら、すぐ下の「セット5_【本番完全再現・5問200分フル模試】問題冊子」を開いてください。

# 【模擬試験セット4：Android UI・ルーティング・依存グラフ応用】解答・解説 ＆ 1次面接尋問対策

---

## Task 1：縦スクロールリスト（LazyColumn / RecyclerView）の可視アイテム高速特定

### 🚨 解法の急所（累積和 ＋ 二分探索による半開区間交差判定）
- アイテム $i$ の区間 $[st[i], ed[i])$ と Viewport $[topY, botY)$ が重なる条件は **「$ed[i] > topY$」かつ「$st[i] < botY$」** です。
- 累積和配列 `st`, `ed` を作り、ローカル関数 `calc(topY, botY)` 内で二分探索を行えば、クラス定義なしで高速に1クエリ $O(\log N)$ で求まります。

### ⭕ 100%満点＆高速打鍵（累積和＋ローカル二分探索）Kotlin模範解答
```kotlin
fun solution(
    itemHeights: IntArray,
    viewportTop: LongArray,
    viewportBottom: LongArray
): IntArray {
    // 1. ガード節
    val n = itemHeights.size
    val m = viewportTop.size
    if (n == 0 || m == 0) return IntArray(0)

    // 2. 各アイテムの開始Y座標 st と終了Y座標 ed を前計算
    val st = LongArray(n)
    val ed = LongArray(n)
    var cur = 0L
    for (i in 0 until n) {
        st[i] = cur
        cur += itemHeights[i].toLong()
        ed[i] = cur
    }

    // ローカル関数: [topY, botY) と重なるアイテム数を二分探索で算出
    fun calc(topY: Long, botY: Long): Int {
        if (botY <= topY) return 0

        // ed[i] > topY となる最小の l
        var lo = 0
        var hi = n - 1
        var l = n
        while (lo <= hi) {
            val mid = (lo + hi) ushr 1
            if (ed[mid] > topY) { l = mid; hi = mid - 1 } else lo = mid + 1
        }
        if (l == n) return 0

        // st[i] < botY となる最大の r
        lo = l
        hi = n - 1
        var r = -1
        while (lo <= hi) {
            val mid = (lo + hi) ushr 1
            if (st[mid] < botY) { r = mid; lo = mid + 1 } else hi = mid - 1
        }
        return if (r < l) 0 else (r - l + 1)
    }

    // 3. 全クエリに回答
    val ans = IntArray(m)
    for (k in 0 until m) {
        ans[k] = calc(viewportTop[k], viewportBottom[k])
    }
    return ans
}
```

### 🎤 1次面接（Android面接官）からの尋問と100点回答
- **Q. `(lo + hi) ushr 1` という書き方をしているのはなぜですか？**
  - **A.** 符号なし右シフト `ushr 1` は `lo + hi` が万が一 `Int.MAX_VALUE` を超えて符号ビットが反転しても、論理シフトにより正しく2で割った中央インデックスを計算できるJVMの高速イディオム（`java.util.Arrays.binarySearch` の内部実装と同じ手法）だからです。
- **Q. もしスクロール中に一部のアイテムの高さが動的に変わる（アコーディオン展開や画像ロード完了）場合、どう設計しますか？**
  - **A.** 累積和配列だと1箇所の高さ変更で以降の全要素の更新に $O(N)$ かかるため、動的更新が頻繁にある場合は **Fenwick Tree（Binary Indexed Tree: BIT）** を使います。BITを使えば「特定のアイテムの高さ更新」と「先頭からの累積Y座標の取得・二分探索」の両方を $O(\log N)$ で処理できます。

---

## Task 2：DeepLink URIのクエリパラメータ正規化と署名文字列生成

### ⭕ 100%満点＆高速打鍵（3文字略語＋TreeMap）Kotlin模範解答
```kotlin
import java.util.TreeMap

fun solution(uri: String): String {
    // 1. ガード節 & '#' フラグメント除去
    if (uri.isEmpty()) return ""
    val hIdx = uri.indexOf('#')
    val base = if (hIdx >= 0) uri.substring(0, hIdx) else uri

    // 2. '?' クエリ部分の抽出
    val qIdx = base.indexOf('?')
    if (qIdx < 0 || qIdx == base.lastIndex) return ""
    val raw = base.substring(qIdx + 1)

    // 3. TreeMap mp でキー昇順ソート＆重複上書き (utm_ は除外)
    val mp = TreeMap<String, String>()
    for (tok in raw.splitToSequence('&')) {
        val eq = tok.indexOf('=')
        if (eq <= 0) continue
        val k = tok.substring(0, eq)
        if (k.startsWith("utm_")) continue
        mp[k] = tok.substring(eq + 1)
    }
    if (mp.isEmpty()) return ""

    val sb = StringBuilder(raw.length)
    for ((k, v) in mp) {
        if (sb.isNotEmpty()) sb.append('&')
        sb.append(k).append('=').append(v)
    }
    return sb.toString()
}
```

### 🎤 1次面接（Android面接官）からの尋問と100点回答
- **Q. `split('&')` ではなく `splitToSequence('&')` を使い、`tok.split('=')` ではなく `indexOf('=')` を使った理由は？**
  - **A.** 2つ理由があります。1つ目は不要な中間 `List<String>` の生成を抑えるためです。2つ目は、もし値の中に `=` が含まれているケース（例：`token=abc=def==` のようなBase64文字列）があった場合、`split('=')` で要素数2を前提にするとバグになりますが、最初の `=` の位置だけを `indexOf('=')` で探して `substring(eq + 1)` を取れば、値に含まれる `=` を壊さずに安全に抽出できるためです。

---

## Task 3：非同期初期化タスクの依存関係解決と循環依存（デッドロック）検知

### 🚨 解法の急所（入次数 `deg` と優先度付きキュー `pq` を用いた非再帰Kahn法）
1. 再帰DFSによるトポロジカルソートは深いグラフで `StackOverflowError` になるうえ、「辞書順最小の実行順序」を求めることができません。
2. 各ノードの入次数 `deg` を数え、`deg == 0` になったタスクを最小ヒープ `PriorityQueue<Int>` に入れて小さい番号から順に取り出す **Kahn法** を使えば、非再帰で安全に「辞書順最小のトポロジカル順序」と「サイクル検知（完了数 `cnt == N`）」を同時に達成できます。

### ⭕ 100%満点＆高速打鍵（Forward Star配列＋Kahn法）Kotlin模範解答
```kotlin
import java.util.PriorityQueue

fun solution(N: Int, prerequisite: IntArray, dependent: IntArray): IntArray {
    // 1. ガード節
    if (N <= 0) return IntArray(0)
    val m = prerequisite.size

    // 2. プリミティブ配列で有向グラフ (hd, to, nxt) と入次数 deg を構築
    val hd = IntArray(N) { -1 }
    val to = IntArray(m)
    val nxt = IntArray(m)
    val deg = IntArray(N)

    for (e in 0 until m) {
        val u = prerequisite[e]
        val v = dependent[e]
        to[e] = v
        nxt[e] = hd[u]
        hd[u] = e
        deg[v]++
    }

    // 3. 入次数 0 の頂点を最小ヒープ pq に入れ、番号が小さい順に処理
    val pq = PriorityQueue<Int>(N)
    for (i in 0 until N) {
        if (deg[i] == 0) pq.add(i)
    }

    val ans = IntArray(N)
    var cnt = 0
    while (pq.isNotEmpty()) {
        val u = pq.poll()
        ans[cnt++] = u
        var e = hd[u]
        while (e != -1) {
            val v = to[e]
            if (--deg[v] == 0) pq.add(v)
            e = nxt[e]
        }
    }

    return if (cnt == N) ans else IntArray(0)
}
```

### 🎤 1次面接（Android面接官）からの尋問と100点回答
- **Q. この問題はAndroidのどのライブラリや仕組みと同じアルゴリズムですか？**
  - **A.** Android Jetpackの **`App Startup`（`Initializer<T>` の `dependencies()` 解決）** や、Dagger/Hiltの依存グラフ検証、Gradleのタスク実行順序解決そのものです。もし循環依存があれば起動時に `StartupException`（Cycle detected）を投げる仕組みと完全に一致しています。
- **Q. `Array(N) { ArrayList<Int>() }` ではなく3本の `IntArray`（`hd`, `to`, `nxt`）を使った理由は？**
  - **A.** $N = 100,000$ のときに10万個の `ArrayList` インスタンスとボクシングされた `Integer` を生成すると、それだけで十数MBのヒープを消費しGCが走るため、プリミティブ配列3本によるチェイン法（静的隣接リスト）でオブジェクト数を定数個に抑えました。
