<!-- NAV_BAR -->

> **受験時の確認:** この資料にある監視・AI判定や入力ログに関する断定的な記述は、根拠が確認できない推測を含みます。カメラ、外部IDE、コピー＆ペースト、翻訳、メモの使用条件は試験ごとの案内と主催者の指示を確認してください。イベント記録は不正の証明ではありません。[Codilityの監督機能の説明](https://support.codility.com/hc/en-us/articles/15584109019671-Proctoring-Ensuring-Assessment-Integrity-with-Behavioral-Events-Detection)

> **辞書（手順 45 / 45）。** 本線は直前チートシートまでで一巡です。このページは通読しません。詰まった語だけ引いてください。

# 難関テック企業・中途採用 Codility完全攻略＆Kotlin実践アーキテクチャ大全

---

## 第1章：難関テック企業選考におけるCodilityのリアルと採点構造

大手テック企業・メガベンチャーの中途採用（バックエンド、Android、データエンジニア等）におけるコーディング試験は、「奇抜な難問は出ないが、計算量（パフォーマンス）とエッジケースへの配慮がシビア」であり、同時に**後の技術面接（1次・最終）で面接官が手元に開いて深掘りするための評価資料**として使われます。

### 1.1 スコアリングの内部構造と「見えないテストケース」の罠
Codilityの各設問は **Correctness（正確性：約50〜60%）** と **Performance（性能：約40〜50%）** の合算で100%満点として算出されます。
* **特徴的な罠（事後採点方式）**: 受験中に「Run」ボタンで確認できるのはサンプルテスト（2〜3個）と自分が追加したカスタムテストのみです。境界値（要素数0・1、全要素同値・負数、32bit Intオーバーフロー）や巨大データ（Large Tests）の合否は、**Submit（提出）した後に裏側で数十個一斉に実行**されます。
* **合格ラインの目安**: 全体で **70%〜80%以上のスコア** が安全圏です。関数の1行目に `if (A.isEmpty()) return 0` のような短いガード節を入れるだけで、タイピングを増やさずエッジケース減点を防ぎ、「境界値に配慮できる堅実なエンジニア」と高く評価されます。

### 1.2 よく出る3つの問題パターン
1. **配列・文字列の操作と「計算量 $O(N)$ への最適化」**:
   - 愚直な二重ループ $O(N^2)$ はPerformanceテストでTLEになり点が半分しか入りません。**「ハッシュマップ (`mp`)」「セット (`st`)」「累積和 (`acc`)」「ソート＋二分探索 / 尺取り法 (`l, r` / `lo, hi`)」**の4大武器を使いこなすことが必須です。
2. **仕様読解・シミュレーション系（実装問題）**:
   - 条件分岐（`if-else`）が複雑になる問題では、1つの関数にベタ書きせず**小さなヘルパー関数（`fun ok(...)`, `fun cost(...)`）に切り出す**ことで、面接官が重視する「可読性・保守性」を満たしつつデバッグとタイピングを劇的に楽にします。
3. **職種特化の問題（Android実務実装・Bugfixing・SQL等）**:
   - クライアント（Android）枠では状態遷移・キャッシュ・バグ修正（1〜3行修正）、サーバー・データ枠ではログ解析やSQL（`GROUP BY`, `JOIN`, ウィンドウ関数）が出題されます。

---

## 第2章：AI検知・盗作判定（Plagiarism Detection）の内部仕様と高速打鍵の両立策

Codilityは業界最高水準の不正検知システムを導入しています。どのように検知され、どう書けば**「AIを一切疑われず、かつ最速のタイピング速度で高評価コードを書けるか」**を解説します。

### 2.1 検知エンジンの3つの監視レイヤー
1. **AST（抽象構文木）フィンガープリント比較**:
   コンパイラが解釈する構文木と、ChatGPT等が出力する典型的な解答パターン（長い英語変数名＋ガード節なし＋冗長な標準コレクション操作）を照合しています。
2. **キーストローク・テレメトリ（Playback再生機能）**:
   エディタ上のすべての入力・削除・カーソル移動がタイムスタンプ付きで記録されています。「最初の数分間なにも入力せず、その後に完成されたコードを上から下まで一気通貫で迷いなく打ち込む」挙動は、別端末のAI出力を書き写していると疑われます。
3. **Webカメラ監視（Proctoring）とフォーカス離脱検知**:
   手元の紙をずっと見続けていると「画面外（スマホ等）を見ている」とフラグを立てられるリスクがあります。

### 2.2 AI疑惑をゼロにし、タイピング速度を2倍にする4大鉄則
1. **変数名は「3〜4文字の定番略語（`ans`, `cnt`, `cur`, `mp`）」に統一する**:
   - AIは `maxProfitSoFar`, `uniqueElementCount`, `currentWindowSum` のような長い教科書的変数名を好みます。これを制限時間内に高速・無ミスで打つ方が不自然です。
   - 逆に `a, b, c` の乱用はコードレビューで減点されます。
   - アルゴリズム試験の世界共通慣習である **`ans`, `res`, `cnt`, `tot`, `cur`, `idx`, `arr`, `mp`, `st`, `l`, `r`, `lo`, `hi`, `mid`, `mx`, `mn`** を使えば、タイピング量が半減し、AIっぽさが消え、レビュアーにも一瞬で意味が伝わります。
2. **紙ではなく「エディタ内のコメント（`//`）」で20〜30文字の設計メモを書く**:
   - 画面から目線を外さず、最初に `// 1. ガード節  2. 重複消す set  3. ソートして差を見る` と箇条書きメモを打つことで、自分で考えている証拠がタイムラインに記録されます（※図を描くために白紙を使う場合は、開始直後に白紙とペンをカメラに2〜3秒見せてから使います）。
3. **「外枠（骨格）」から順番に作り、最後にループの中身を埋める（中間Runを挟む）**:
   - ①まず `if (A.isEmpty()) return 0` と `var ans = 0` / `return ans` を書く → ②次にループやヘルパー関数のガワだけ書く → ③1つ目のブロックを書いたら一度 `Run` を押す → ④最後に中身を埋める、という順序で入力します。
4. **過剰なボイラープレートクラスを作らず「小さなローカル関数 `fun ok()`」と「プリミティブ配列」を使う**:
   - 試験中に20行のラッパークラスを書く時間を省き、`val st = IntArray(n); var top = 0` の2行スタックや、引数を省略できるKotlinローカル関数 `fun ok(lim: Long): Boolean`、import不要の `maxOf` / `minOf` を駆使して打鍵速度を最大化します。

---

## 第3章：Kotlin特有のパフォーマンス罠とJVM最適化（Time Limit Exceeded対策）

アルゴリズムの計算量が $O(N)$ でも、Kotlin特有の「オートボクシング（Auto-boxing）」やコレクション生成コストによって **TLE（制限時間超過）やメモリ上限超過** になるケースが多発します。

### 3.1 プリミティブ配列 vs コレクション（Boxingの罠）
Kotlinでは、`List<Int>` や `Array<Int>` はJVM上で `java.lang.Integer` のオブジェクト配列にコンパイルされます。要素数 $N = 100,000$ の場合、オブジェクトヘッダのオーバーヘッドによりメモリ消費量が約4〜5倍になり、GC（ガベージコレクション）が頻発して実行速度が劇的に落ちます。

| 操作・データ構造 | ❌ 遅い・メモリ大（Boxing発生） | ⭕ 高速・省メモリ（Primitive維持＆短打鍵） | 理由 |
| :--- | :--- | :--- | :--- |
| **配列の生成** | `Array(n) { 0 }` / `List(n) { 0 }` | `IntArray(n)` / `LongArray(n)` | JVMの `int[]`, `long[]` に直接展開されるため |
| **最大・最小** | `import kotlin.math.max` + `max(a, b)` | `maxOf(a, b)` / `minOf(a, b)` | 標準組み込みのため `import` 文を打つ手間がゼロ |
| **ソート処理** | `val sorted = A.sorted()` | `val arr = A.clone().apply { sort() }` | `.sorted()` は `List<Int>`（Box化）を返すが、`.sort()` はプリミティブのまま高速ソート |
| **スタック/キュー** | `java.util.Stack<Int>()` | `val st = IntArray(n); var top = 0` | わずか2行で書けてBoxingゼロ・最速 |
| **ハッシュマップ** | `map.getOrDefault(x, 0) + 1` | `mp[x] = (mp[x] ?: 0) + 1` | エルビス演算子 `?: 0` の方が短くタイプミスしない |

---

## 第4章：頻出7大アルゴリズム領域別・高速高評価コード集

---

### 領域1：累積和と差分配列（Prefix Sums & Difference Array）
**典型問題**: 長さ $N$ のDNA配列文字列 $S$（`A, C, G, T` で構成され、それぞれ影響度 `1, 2, 3, 4` を持つ）に対し、$M$ 個のクエリ区間 $[P[k], Q[k]]$ が与えられる。各区間内に含まれる最小の影響度を高速に求めよ。（$N \le 100,000, M \le 50,000$）
* **解法**: 文字種変換を小さなヘルパー関数 `idx(c)` に切り出し、1次元配列 `acc` で累積出現回数を保持することで、1クエリあたり $O(1)$、全体 $O(N + M)$ で高速に解きます（[kotlin/領域1_累積和_DNA区間最小影響度.kt](<./kotlin/領域1_累積和_DNA区間最小影響度.kt>)）。

```kotlin
/**
 * 領域1: 累積和を用いた区間クエリ高速応答（Codility「GenomicRangeQuery」相当）
 * 計算量: 前処理 O(N), クエリ応答 O(M) -> 全体 Time O(N + M), Space O(N)
 * 高速打鍵ポイント: 文字種変換を小さなヘルパー関数 idx(c) に切り出し、1次元配列 acc で高速集計
 */
private fun idx(c: Char): Int = when (c) {
    'A' -> 0
    'C' -> 1
    'G' -> 2
    else -> 3
}

fun solutionGenomicRange(S: String, P: IntArray, Q: IntArray): IntArray {
    // 1. ガード節
    val n = S.length
    val m = P.size
    if (n == 0 || m == 0) return IntArray(0)

    // 2. 4種類の文字の累積和 acc を構築 (1次元フラット配列: (n + 1) * 4)
    val acc = IntArray((n + 1) * 4)
    for (i in 0 until n) {
        val prv = i * 4
        val cur = (i + 1) * 4
        for (t in 0..3) acc[cur + t] = acc[prv + t]
        acc[cur + idx(S[i])]++
    }

    // 3. 各クエリ [l, r] に O(1) で回答
    val ans = IntArray(m)
    for (k in 0 until m) {
        val l = P[k] * 4
        val r = (Q[k] + 1) * 4
        var res = 4
        for (t in 0..3) {
            if (acc[r + t] - acc[l + t] > 0) {
                res = t + 1
                break
            }
        }
        ans[k] = res
    }
    return ans
}

fun main() {
    val res = solutionGenomicRange("CAGCCTA", intArrayOf(2, 5, 0), intArrayOf(4, 5, 6))
    println("Algo01 GenomicRange result: ${res.contentToString()} (Expected: [2, 4, 1])")
}
```

---

### 領域2：単調スタック（Monotonic Stack）
**典型問題**: 川のなかに $N$ 匹の魚が一列に並んでいる。魚 $i$ の大きさは $A[i]$、泳ぐ向きは $B[i]$（`0` が上流、`1` が下流）である。互いに向かい合ってすれ違うとき、大きい魚が小さい魚を食べる。最終的に生き残る魚の数を求めよ。
* **解法**: 冗長なStackクラスを作らず、`val st = IntArray(n); var top = 0` の2行で下流（`1`）の魚を積み、上流（`0`）の魚と $O(N)$ で衝突判定します（[kotlin/領域2_単調スタック_生き残る魚の数.kt](<./kotlin/領域2_単調スタック_生き残る魚の数.kt>)）。

```kotlin
/**
 * 領域2: 単調スタックによる衝突シミュレーション（Codility「Fish」相当）
 * 計算量: Time O(N), Space O(N)
 * 高速打鍵ポイント: 冗長なStackクラスを作らず `val st = IntArray(n)` + `var top = 0` の2行でボクシングゼロ実装
 */
fun solutionSurvivingFish(A: IntArray, B: IntArray): Int {
    // 1. ガード節
    val n = A.size
    if (n <= 1) return n

    // 2. 下流(1)の魚をプリミティブ配列スタック st に積み、上流(0)と衝突判定
    val st = IntArray(n)
    var top = 0
    var cnt = 0 // 生き残った上流(0)の魚の数

    for (i in 0 until n) {
        val cur = A[i]
        if (B[i] == 1) {
            st[top++] = cur
            continue
        }
        // 上流(0)の魚が下流(1)の魚と順番に対決
        var win = true
        while (top > 0) {
            if (st[top - 1] > cur) {
                win = false
                break
            }
            top-- // 下流の魚を食べて次へ
        }
        if (win) cnt++
    }

    // 3. 上流生存数 cnt + 下流生存数 top
    return cnt + top
}

fun main() {
    val res = solutionSurvivingFish(intArrayOf(4, 3, 2, 1, 5), intArrayOf(0, 1, 0, 0, 0))
    println("Algo02 SurvivingFish result: $res (Expected: 2)")
}
```

---

### 領域3：最大部分配列問題（Kadane's Algorithm の応用）
**典型問題**: 日々の株価変動（または利益）を表す配列 $A$（負数を含む）が与えられる。連続する部分配列の和の最大値を求めよ。ただし、少なくとも1つの要素を選ぶ必要がある。
* **解法**: 全要素が負数のケースでも破綻しないよう `A[0].toLong()` で `cur` と `ans` を初期化し、`maxOf` で1パス $O(N)$ 集計します（[kotlin/領域3_最大部分配列和_Kadane法.kt](<./kotlin/領域3_最大部分配列和_Kadane法.kt>)）。

```kotlin
/**
 * 領域3: Kadane's Algorithm による最大連続部分配列和（Codility「MaxSliceSum」相当）
 * 計算量: Time O(N), Space O(1)
 * 高速打鍵ポイント: import不要の maxOf() + 3文字略語 (cur, ans) + Long で全負数＆オーバーフロー完全対策
 */
fun solutionMaxSliceSum(A: IntArray): Int {
    // 1. ガード節 (空/1要素)
    if (A.isEmpty()) return 0
    if (A.size == 1) return A[0]

    // 2. 負数のみでも正しく動くよう A[0] で初期化し、Long で計算
    var cur = A[0].toLong()
    var ans = cur

    for (i in 1 until A.size) {
        val x = A[i].toLong()
        cur = maxOf(x, cur + x)
        ans = maxOf(ans, cur)
    }
    return ans.toInt()
}

fun main() {
    val res = solutionMaxSliceSum(intArrayOf(3, 2, -6, 4, 0))
    println("Algo03 MaxSliceSum result: $res (Expected: 5)")
}
```

---

### 領域4：二分探索：答えで二分探索（Binary Search on Answer / Min-Max Problem）
**典型問題（Codility難問「MinMaxDivision」相当）**: 非負整数配列 $A$ を、最大 $K$ 個の連続するブロックに分割する。各ブロックの要素の合計値のうち、**最も大きいブロックの合計値（最大ブロック和）を最小化**せよ。
* **解法**: 判定処理を `solution` 内の**ローカル関数 `fun ok(lim: Long): Boolean`** に切り出すことで、引数 `(A, K)` の受け渡しタイピングをゼロにしつつ $O(N \log(\sum A))$ で美しく解きます（[kotlin/領域4_答えで二分探索_最大ブロック和の最小化.kt](<./kotlin/領域4_答えで二分探索_最大ブロック和の最小化.kt>)）。

```kotlin
/**
 * 領域4: 答えで二分探索（パラメトリックサーチ / Codility「MinMaxDivision」相当）
 * 計算量: Time O(N * log(sum(A))), Space O(1)
 * 高速打鍵ポイント: 判定処理をローカル関数 `fun ok(lim: Long)` に切り出し、引数 (A, K) の受け渡しタイプ量をゼロにする
 */
fun solutionMinMaxDivision(K: Int, M: Int, A: IntArray): Int {
    // 1. ガード節
    if (A.isEmpty()) return 0

    // 2. 二分探索の下限 lo (最大要素) と上限 hi (総和) を算出
    var lo = 0L
    var hi = 0L
    for (x in A) {
        if (x > lo) lo = x.toLong()
        hi += x
    }
    if (K >= A.size) return lo.toInt()
    if (K == 1) return hi.toInt()

    // ローカル関数: 各ブロック和を lim 以下にして K 個以内に収まるか判定
    fun ok(lim: Long): Boolean {
        var cnt = 1
        var cur = 0L
        for (x in A) {
            if (cur + x > lim) {
                cnt++
                cur = x.toLong()
                if (cnt > K) return false
            } else {
                cur += x
            }
        }
        return true
    }

    // 3. 答えで二分探索
    var ans = hi
    while (lo <= hi) {
        val mid = (lo + hi) ushr 1
        if (ok(mid)) {
            ans = mid
            hi = mid - 1
        } else {
            lo = mid + 1
        }
    }
    return ans.toInt()
}

fun main() {
    val res = solutionMinMaxDivision(3, 5, intArrayOf(2, 1, 5, 1, 2, 2, 2))
    println("Algo04 MinMaxDivision result: $res (Expected: 6)")
}
```

---

### 領域5：ソート＋イベントスイープ法（Interval Scheduling & Sweep Line）
**典型問題（Codility名作「NumberOfDiscIntersections」相当）**: 数直線上の座標 $i$（$0 \le i < N$）を中心とし、半径 $A[i]$ を持つ $N$ 個の円盤がある。互いに交差している円盤のペアの総数を求めよ。10,000,000を超える場合は `-1` を返せ。
* **解法**: 左端 `lArr` と右端 `rArr` を `LongArray` でソートし、ポインタ `rIdx` と現在開いている円盤数 `act` で $O(N \log N)$ 走査します（[kotlin/領域5_平面走査法_円盤の交差ペア数.kt](<./kotlin/領域5_平面走査法_円盤の交差ペア数.kt>)）。

```kotlin
/**
 * 領域5: イベントスイープ（平面走査法）による区間交差カウント（Codility「NumberOfDiscIntersections」相当）
 * 計算量: Time O(N log N), Space O(N)
 * 高速打鍵ポイント: 左端配列 lArr と右端配列 rArr をソートし、尺取り法ポインタ rIdx で交差数を高速集計
 */
private const val LIM = 10_000_000L

fun solutionDiscIntersections(A: IntArray): Int {
    // 1. ガード節
    val n = A.size
    if (n < 2) return 0

    // 2. オーバーフロー防止のため LongArray で左端・右端を記録してソート
    val lArr = LongArray(n)
    val rArr = LongArray(n)
    for (i in 0 until n) {
        val rad = A[i].toLong()
        lArr[i] = i - rad
        rArr[i] = i + rad
    }
    lArr.sort()
    rArr.sort()

    // 3. 平面走査でアクティブな円盤数 act と交差ペア数 ans を計算
    var act = 0L
    var ans = 0L
    var rIdx = 0

    for (l in lArr) {
        while (rIdx < n && rArr[rIdx] < l) {
            act--
            rIdx++
        }
        ans += act
        if (ans > LIM) return -1
        act++
    }
    return ans.toInt()
}

fun main() {
    val res = solutionDiscIntersections(intArrayOf(1, 5, 2, 1, 4, 0))
    println("Algo05 DiscIntersections result: $res (Expected: 11)")
}
```

---

### 領域6：グラフ探索・Union-Find（連結成分とネットワーク解析）
**典型問題**: $N$ 個のサーバーと、接続関係を表す配列 $U, V$ が与えられる。ネットワークがいくつの独立したクラスタ（連結成分）に分かれているかを判定せよ。
* **解法**: 40行のクラス定義を省き、親配列 `val par = IntArray(N) { it }` と非再帰のローカル関数 `fun find(x: Int): Int` でわずか15行・StackOverflowゼロで実装します（[kotlin/領域6_非再帰UnionFind_ネットワーク連結成分.kt](<./kotlin/領域6_非再帰UnionFind_ネットワーク連結成分.kt>)）。

```kotlin
/**
 * 領域6: グラフ連結成分・非再帰Union-Find（Disjoint Set Union）
 * 計算量: Time O((N + M) * α(N)), Space O(N)
 * 高速打鍵ポイント: クラスを作らず配列 `par` + ローカル関数 `find(x)` でわずか15行で非再帰Union-Findを実装
 */
fun solutionConnectedComponents(N: Int, U: IntArray, V: IntArray): Int {
    // 1. ガード節
    if (N <= 0) return 0
    if (U.isEmpty()) return N

    // 2. 親配列 par と連結成分数 cnt を初期化
    val par = IntArray(N) { it }
    var cnt = N

    // 非再帰の経路圧縮 find (StackOverflow完全防止 & 短縮経路圧縮)
    fun find(x: Int): Int {
        var cur = x
        while (cur != par[cur]) {
            par[cur] = par[par[cur]] // 1行経路圧縮 (Path Halving)
            cur = par[cur]
        }
        return cur
    }

    // 3. 各辺を順番に併合し、異なる成分なら cnt を減らす
    for (i in U.indices) {
        val r1 = find(U[i])
        val r2 = find(V[i])
        if (r1 != r2) {
            par[r1] = r2
            cnt--
        }
    }
    return cnt
}

fun main() {
    val res = solutionConnectedComponents(5, intArrayOf(0, 1, 3), intArrayOf(1, 2, 4))
    println("Algo06 ConnectedComponents result: $res (Expected: 2)")
}
```

---

### 領域7：頻出の「実務型・文字列ログ解析＆集計」問題
**典型問題**: 複数行の通信ログ文字列 $S$（`"HH:MM:SS,電話番号"`）から、各番号の通話料金を計算し、最長通話時間の番号を無料にした後の総額を求めよ。
* **解法**: 秒数変換 `sec(hms)` と料金計算 `cost(s)` を小さなヘルパー関数に切り出し、`dur`（総秒数マップ）と `fee`（総料金マップ）で簡潔に集計します（[kotlin/領域7_実務型文字列ログ解析_通話料金集計.kt](<./kotlin/領域7_実務型文字列ログ解析_通話料金集計.kt>)）。

```kotlin
/**
 * 領域7: 実務型ログパース＆ビジネスルール集計
 * 計算量: Time O(L log K) (L: 行数, K: ユニーク番号数), Space O(K)
 * リーダブル＆高速打鍵ポイント:
 *  - マジックナンバーを定数化 (FREE_BORDER_SEC, SEC_RATE, MIN_RATE)
 *  - 入出力レコードを小さな `data class CallLog(val num: Long, val sec: Int)` に分離
 *  - `!!` を一切使わず `toIntOrNull() ?: return null` と `lineSequence().mapNotNull` で宣言的にパース
 */
private const val FREE_BORDER_SEC = 300
private const val SEC_RATE = 3
private const val MIN_RATE = 150

private data class CallLog(val num: Long, val sec: Int)

private fun parse(raw: String): CallLog? {
    val line = raw.trim()
    val idx = line.indexOf(',')
    if (idx <= 0) return null

    val t = line.substring(0, idx).split(':')
    if (t.size != 3) return null
    val h = t[0].toIntOrNull() ?: return null
    val m = t[1].toIntOrNull() ?: return null
    val s = t[2].toIntOrNull() ?: return null

    val num = line.substring(idx + 1).replace("-", "").toLongOrNull() ?: return null
    return CallLog(num, h * 3600 + m * 60 + s)
}

private fun cost(sec: Int): Int =
    if (sec < FREE_BORDER_SEC) sec * SEC_RATE else ((sec + 59) / 60) * MIN_RATE

fun solutionPhoneBill(S: String): Int {
    // 1. ガード節
    if (S.isBlank()) return 0

    // 2. Sequence + mapNotNull で安全にパースし、番号ごとの総秒数 dur と総料金 fee を集計
    val dur = HashMap<Long, Int>()
    val fee = HashMap<Long, Int>()

    for (log in S.lineSequence().mapNotNull { parse(it) }) {
        dur[log.num] = (dur[log.num] ?: 0) + log.sec
        fee[log.num] = (fee[log.num] ?: 0) + cost(log.sec)
    }
    if (dur.isEmpty()) return 0

    // 3. 最長通話の番号 (同秒数なら数値が最小の番号) を特定し、それ以外の料金を合算
    var freeNum = -1L
    var mxDur = -1
    for ((num, d) in dur) {
        if (d > mxDur || (d == mxDur && num < freeNum)) {
            mxDur = d
            freeNum = num
        }
    }

    return fee.entries.sumOf { (num, f) -> if (num == freeNum) 0 else f }
}

fun main() {
    val sampleLog = """
        00:01:07,400-234-090
        00:05:01,701-080-080
        00:05:00,400-234-090
    """.trimIndent()
    println("Algo07 PhoneBill result: ${solutionPhoneBill(sampleLog)} (Expected: 900)")
}
```

---

## 第5章：試験本番のタイムマネジメントと環境構築・提出前チェックリスト

### 5.1 試験時間（90〜120分・3問想定 / 200分・4〜5問想定）の黄金配分
Codilityは**「解ける問題から解く」「ハマったら一旦60%（Correctness満点）で逃げる」**のが鉄則です。

1. **開始直後（0〜5分）**: 全問題に目を通し、難易度を把握する。
2. **第1問（易〜中）**: エディタ内コメント `// 1. ...` と1行ガード節を書き、3文字略語で素早く100%を取る。
3. **第2問（中）**: 4大武器（`mp`, `st`, `acc`, `l/r`）を使って $O(N)$ / $O(N \log N)$ で実装し、途中で1〜2回 `Run` を挟む。
4. **第3問以降（難・実務実装）**: 小さなヘルパー関数 `fun ok()` に条件判定を切り出して実装。もし15分で最適解が出なければ、確実な $O(N^2)$ 解法でCorrectness 100%（総合50〜60%）を確保する。
5. **最終見直し＆カスタムテスト（残り15分）**: 全タスクの境界値テストを実行し、デバッグ用の `println` を消してSubmit。

### 5.2 提出直前の「5大バグ撲滅チェックリスト」
* [ ] **① `Int` オーバーフローの罠**: 合計値や `d * d <= n` で `Int` のまま計算していないか？（必ず `0L` / `.toLong()` を使う）
* [ ] **② サイズ0・サイズ1の配列**: 関数1行目に `if (A.isEmpty()) return 0` などのガード節を入れたか？
* [ ] **③ 全要素が負数、または全要素が同じ値**: 最大値問題で `var ans = 0` と初期化せず `A[0]` または `Int.MIN_VALUE` で初期化したか？
* [ ] **④ 添字の上限・下限（Off-by-one error）**: 先頭 `A[0]` や末尾 `A[n-1]` がループから漏れていないか？
* [ ] **⑤ 不要なデバッグ出力（`println`）の削除**: ループ内の `println()` を削除したか？（残すとI/OボトルネックでTLEになります）
