<!-- NAV_BAR -->

> **受験時の確認:** この資料にある監視・AI判定や入力ログに関する断定的な記述は、根拠が確認できない推測を含みます。カメラ、外部IDE、コピー＆ペースト、翻訳、メモの使用条件は試験ごとの案内と主催者の指示を確認してください。イベント記録は不正の証明ではありません。[Codilityの監督機能の説明](https://support.codility.com/hc/en-us/articles/15584109019671-Proctoring-Ensuring-Assessment-Integrity-with-Behavioral-Events-Detection)

> **手順 2 / 45。** 左メニューの上から 2 番目です。読み終えたら、すぐ下の「10_【試験本番・入力ログ対策①】紙ではなくエディタ内コメント設計＆外枠入力の極意」を開いてください。

# 難関テック企業・中途採用 Codility対策＆Kotlin高速実装ガイド（基礎編）

## 1. 難関テック企業のCodility出題傾向と評価軸

大手テック企業・メガベンチャーの中途採用（サーバーサイド／Android等）で実施されるCodilityは、「奇抜な難問は出ないが、計算量（パフォーマンス）とエッジケースへの配慮がシビア」という特徴があります。

| 項目 | 内容・目安 |
| :--- | :--- |
| **問題数・制限時間** | **2〜3問 ／ 90〜120分程度**（1問30〜40分ペース ※大型枠は **4〜5問 ／ 200分**） |
| **難易度レベル** | **LeetCode の Easy 〜 Medium**（AtCoderなら **B 〜 C問題、一部D問題** 相当） |
| **合格ラインの目安** | 満点である必要はなく、**全体で70%〜80%以上のスコア**が安全圏 |

### 評価される3つの指標
1. **Correctness（正確性）**: 基本テストケースおよび**Submit後にのみ走る「見えないテストケース（要素数0・1、全要素同値・負数、32bit Intオーバーフロー）」**をパスしているか。
2. **Performance（計算量）**: 大規模データ（$N = 100,000$ など）に対して二重ループ $O(N^2)$ でTLEにならず、$O(N)$ や $O(N \log N)$ で処理が終わるか。
3. **Code Quality（可読性・保守性）**: 通過後に人間のエンジニアによるコードレビューが行われます。複雑な条件判定を1つの関数にベタ書きせず小さなヘルパー関数に分けるなど、読みやすい構造になっているかが評価されます。

### よく出る3つの問題パターンと4大武器
1. **配列・文字列の操作と「計算量 $O(N)$ への最適化」**:
   - 二重ループを避けるための4大武器：**「ハッシュマップ (`mp`)」「セット (`st`)」「累積和 (`acc`)」「ソートして二分探索 / 尺取り法 (`l, r` / `lo, hi`)」**は必ず即座に使えるようにします。
2. **仕様読解・シミュレーション系（実装問題）**:
   - 条件分岐（`if-else`）が複雑になりやすいため、条件判定やコスト計算だけを**小さなヘルパー関数（`fun ok(...)`, `fun cost(...)`）**に切り出すとデバッグもタイピングも圧倒的に楽になります。
3. **職種特化の問題（Android状態遷移 / バグ修正 / SQL・データ集計）**:
   - ポジションに応じた実務実装タスクや、既存コードの1〜3行だけを直すBugfixingが出題されます。

---

## 2. AI疑惑を完全回避し、かつコーディング速度を2倍にする4大戦略

### ① 変数名は「3〜4文字の定番略語（`ans`, `cnt`, `cur`, `mp`）」に統一する
ChatGPTなどの生成AIは、問題文の英単語を拾って `maxProfitSoFar`, `uniqueElementCount`, `currentWindowSum` のような**丁寧で長い変数名**を出力する強いクセがあります。制限時間内に20文字近い変数名を高速・無ミスで打ち込むと、かえって「AIのコードを写しているのでは？」と疑われます。
逆に `a, b, c` のような意味不明な1文字の乱用はコードレビューで減点されます。
* **最適解**: アルゴリズム試験の世界共通慣習である **3〜4文字の定番略語（`ans`, `res`, `cnt`, `tot`, `cur`, `idx`, `arr`, `mp`, `st`, `l`, `r`, `lo`, `hi`, `mid`, `mx`, `mn`）** を使うことで、**タイピング量を半減させ、AI疑惑も回避し、人間のレビュアーにも一瞬で意味が伝わる**ベストバランスを実現します。

### ② 関数1行目に「15文字のガード節」を入れて隠れテストケースを防ぐ
画面上の「Run」で走るサンプルテストは2〜3個だけです。Submit後に走る数十個の意地悪なエッジケース（空配列、1要素など）を防ぐため、関数の1行目に `if (A.isEmpty()) return 0` のような短いガード節を必ず入れます。わずか十数文字のタイピングでスコアを守り、「エッジケースに配慮できる堅実なエンジニア」と高く評価されます。

### ③ 紙ではなく「エディタ内コメント（`//`）」で設計し、「外枠→中身」の順で打つ
最初の数分間なにも入力せずに紙ばかり見てから完成コードを一気に打ち込むと、Playback（入力再生ログ）やWebカメラ監視で「別端末のAIを写しているのでは？」と疑われます。
1. まずエディタ内に直接 `// 1. ガード節  2. ソート  3. 差を見る` と20〜30文字のメモを打つ。
2. 先に `var ans = 0` と `return ans`、ループのガワ（外枠）だけを作り、最後に中身を埋める。
3. 1つ目のブロックを書いた段階で一度 `Run` を押し、試行錯誤の自然なログを残す。

### ④ Kotlin標準の短縮イディオム（`maxOf` / `minOf` / ローカル関数）を活用する
* `import kotlin.math.max` を書かずに標準組み込みの `maxOf(a, b)` / `minOf(a, b)` を使う。
* スタックやキューは20行のラッパークラスを作らず、`val st = IntArray(n); var top = 0` の2行で書く。
* 二分探索などの判定関数は `solution` 内の**ローカル関数 `fun ok(lim: Long): Boolean`** として定義し、引数受け渡しのタイピングを省略する。

---

## 3. Kotlin実践コーディング例（❌ AI典型例 vs ⭕ 3文字略語・高速高評価コード）

### 例題1：ペアの探索と頻度集計（OddOccurrencesInArray）
**問題設定**: 奇数個の整数からなる配列 `A` が与えられる。1つの要素を除き、他のすべての要素は偶数回出現する。ペアを持たない（奇数回出現する）要素の値を返せ。

#### ❌ AIが生成しがちな典型コード（長い変数名＋HashMapのボクシング）
```kotlin
fun solution(A: IntArray): Int {
    val elementFrequencyMap = HashMap<Int, Int>()
    for (currentNumber in A) {
        elementFrequencyMap[currentNumber] = elementFrequencyMap.getOrDefault(currentNumber, 0) + 1
    }
    for (entry in elementFrequencyMap.entries) {
        if (entry.value % 2 != 0) {
            return entry.key
        }
    }
    return -1
}
```

#### ⭕ 高速打鍵＆高評価コード（[02_例題1_奇数回出現要素の特定_XOR独自実装.kt](<../kotlin/02_例題1_奇数回出現要素の特定_XOR独自実装.kt>))
```kotlin
/**
 * 例題1：ペアの探索と頻度集計（Codility「OddOccurrencesInArray」相当）
 * 計算量: Time O(N), Space O(1)
 * 高速打鍵ポイント: HashMapを使わずXOR（x xor x = 0）でO(1)空間・最短タイプ数で解く
 */
fun solution(A: IntArray): Int {
    // 1. ガード節 (空/1要素)
    if (A.isEmpty()) return -1
    if (A.size == 1) return A[0]

    // 2. x xor x = 0 の性質より、fold で奇数回出現要素のみを残す (var不要)
    return A.fold(0) { acc, x -> acc xor x }
}
```

---

### 例題2：累積和・すれ違うペアの数え上げ（PassingCars）
**問題設定**: 道路上の車の進行方向を表す配列 `A`（`0` が東行き、`1` が西行き）が与えられる。東行きの車 `P` と西行きの車 `Q` が $0 \le P < Q < N$ の関係にあるとき「すれ違うペア」とみなす。すれ違うペアの総数を求めよ。ただし総数が `1,000,000,000` を超える場合は `-1` を返せ。

#### ❌ AIが生成しがちな典型コード（避けるべき例：[03_例題2_すれ違う車のペア集計_AI典型NG例.kt](<../kotlin/03_例題2_すれ違う車のペア集計_AI典型NG例.kt>))
```kotlin
/**
 * ❌ AIが生成しがちな典型NGコード例
 * ・問題文の英単語をそのまま繋げた長い変数名（eastBoundVehiclesCount, totalPassingCarsPairs）
 * ・エッジケースのガード節がない
 * ・32bit Int のままで加算しており、大規模ケースでオーバーフローするリスクがある
 */
fun solution(A: IntArray): Int {
    var eastBoundVehiclesCount = 0
    var totalPassingCarsPairs = 0
    for (currentVehicleIndex in A.indices) {
        if (A[currentVehicleIndex] == 0) {
            eastBoundVehiclesCount++
        } else {
            totalPassingCarsPairs += eastBoundVehiclesCount
            if (totalPassingCarsPairs > 1000000000) return -1
        }
    }
    return totalPassingCarsPairs
}
```

#### ⭕ 高速打鍵＆高評価コード（[04_例題2_すれ違う車のペア集計_状態管理クラス独自実装.kt](<../kotlin/04_例題2_すれ違う車のペア集計_状態管理クラス独自実装.kt>))
```kotlin
/**
 * 例題2：すれ違う車のペア集計（Codility「PassingCars」相当）
 * 計算量: Time O(N), Space O(1)
 * 高速打鍵ポイント: 定番略語 (cnt, ans) + Long オーバーフロー防止 + 1行ガード節
 */
private const val LIM = 1_000_000_000L

fun solution(A: IntArray): Int {
    // 1. ガード節 (2台未満はペア0)
    if (A.size < 2) return 0

    // 2. 東行き(0)の台数 cnt を数え、西行き(1)が来たら ans に加算
    var cnt = 0L
    var ans = 0L

    for (x in A) {
        if (x == 0) {
            cnt++
        } else {
            ans += cnt
            if (ans > LIM) return -1
        }
    }
    return ans.toInt()
}
```

---

### 例題3：尺取り法（Two Pointers / Sliding Window）による最小区間長
**問題設定**: 正の整数配列 `A` と目標値 `targetSum` が与えられる。連続する部分配列の合計が `targetSum` 以上となるもののうち、最小の要素数（区間長）を求めよ。条件を満たす区間が存在しない場合は `0` を返せ。

#### ⭕ 高速打鍵＆高評価コード（[05_例題3_条件を満たす最小連続区間_尺取り法独自実装.kt](<../kotlin/05_例題3_条件を満たす最小連続区間_尺取り法独自実装.kt>))
```kotlin
/**
 * 例題3：条件を満たす最小連続区間（尺取り法 / Two Pointers）
 * 計算量: Time O(N), Space O(1)
 * 高速打鍵ポイント: import不要の minOf() と定番略語 (l, r, cur, ans) でタイプ量を半減
 */
fun solution(targetSum: Int, A: IntArray): Int {
    // 1. ガード節
    if (A.isEmpty() || targetSum <= 0) return 0

    // 2. 尺取り法: 右端 r を進め、和 cur が目標以上なら左端 l を詰める
    var l = 0
    var cur = 0L
    var ans = Int.MAX_VALUE

    for (r in A.indices) {
        cur += A[r]
        while (cur >= targetSum && l <= r) {
            ans = minOf(ans, r - l + 1)
            cur -= A[l++]
        }
    }

    // 3. 見つからなければ 0
    return if (ans == Int.MAX_VALUE) 0 else ans
}
```
