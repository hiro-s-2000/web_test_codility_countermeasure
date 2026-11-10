<!-- NAV_BAR -->
> **辞書（手順 44 / 45）。** 本線は直前チートシートまでで一巡です。このページは通読しません。詰まった語だけ引いてください。

# 難関テック企業・中途採用 Codility完全攻略＆Kotlin実践アーキテクチャ大全

> **目次 ＆ 関連ドキュメント（Previewクリック遷移対応）**
> - 📅 **学習計画・WBS**: [00_【WBS・行動計画】1週間の学習ロードマップ.md](<./00_【WBS・行動計画】1週間の学習ロードマップ.md>)
> - 🛠️ **5問200分特化（バグ修正・Android実装・知識）**: [12_【5問200分特化】Codility「バグ修正・Android実務実装・単体テスト・知識問題」完全攻略バイブル.md](<./12_【5問200分特化】Codility「バグ修正・Android実務実装・単体テスト・知識問題」完全攻略バイブル.md>)
> - ⚡ **試験直前チートシート**: [07_試験直前用_Kotlin高速イディオム＆境界値チートシート.md](<./07_試験直前用_Kotlin高速イディオム＆境界値チートシート.md>)
> - ⌨️ **入力ログ対策①（エディタ内コメント設計＆外枠入力）**: [10_【試験本番・入力ログ対策①】紙ではなくエディタ内コメント設計＆外枠入力の極意.md](<./10_【試験本番・入力ログ対策①】紙ではなくエディタ内コメント設計＆外枠入力の極意.md>)
> - 🚀 **入力ログ対策②（3文字定番略語＆爆速打鍵ルール）**: [11_【試験本番・入力ログ対策②】AI誤認を防ぎタイピング量を削る3文字定番略語ルール.md](<./11_【試験本番・入力ログ対策②】AI誤認を防ぎタイピング量を削る3文字定番略語ルール.md>)
> - 🎤 **1次面接（前半：コード尋問）対策**: [08_【1次面接対策】コーディング試験の尋問・深掘り完全攻略ガイド.md](<./08_【1次面接対策】コーディング試験の尋問・深掘り完全攻略ガイド.md>)
> - 📱 **1次面接（後半：Android技術深掘り）対策**: [09_【1次面接・Android技術試問】Codilityから派生するKotlin・Android深掘り完全問答集.md](<./09_【1次面接・Android技術試問】Codilityから派生するKotlin・Android深掘り完全問答集.md>)
> ---
> - [第1章：難関テック企業選考におけるCodilityのリアルと採点構造](<#第1章難関テック企業選考におけるcodilityのリアルと採点構造>)
> - [第2章：AI検知・盗作判定（Plagiarism Detection）の内部仕様と完全回避策](<#第2章ai検知盗作判定plagiarism-detectionの内部仕様と完全回避策>)
> - [第3章：Kotlin特有のパフォーマンス罠とJVM最適化（Time Limit Exceeded対策）](<#第3章kotlin特有のパフォーマンス罠とjvm最適化time-limit-exceeded対策>)
> - [第4章：基礎実践コーディング比較（❌ AI典型例 vs ⭕ 独自性のある高評価コード）](<#第4章基礎実践コーディング比較-ai典型例-vs-独自性のある高評価コード>)
>   - [例題1：ペアの探索と頻度集計（ハッシュマップ vs 累積XOR）](<#例題1ペアの探索と頻度集計ハッシュマップ-vs-累積xor>)
>   - [例題2：すれ違う車のペア集計（プリミティブ変数乱立 vs 状態管理クラス）](<#例題2すれ違う車のペア集計プリミティブ変数乱立-vs-状態管理クラス>)
>   - [例題3：条件を満たす最小連続区間（尺取り法 / Two Pointers 構造体活用）](<#例題3条件を満たす最小連続区間尺取り法-two-pointers-構造体活用>)
> - [第5章：頻出12大アルゴリズム領域別・独自実装コード集](<#第5章頻出12大アルゴリズム領域別独自実装コード集>)
>   - [領域1：累積和と差分配列（Prefix Sums & Difference Array）](<#領域1累積和と差分配列prefix-sums-difference-array>)
>   - [領域2：単調スタック（Monotonic Stack）](<#領域2単調スタックmonotonic-stack>)
>   - [領域3：最大部分配列問題（Kadane's Algorithm の応用）](<#領域3最大部分配列問題kadanes-algorithm-の応用>)
>   - [領域4：二分探索：答えで二分探索（Binary Search on Answer / Min-Max Problem）](<#領域4二分探索答えで二分探索binary-search-on-answer-min-max-problem>)
>   - [領域5：ソート＋イベントスイープ法（Interval Scheduling & Sweep Line）](<#領域5ソートイベントスイープ法interval-scheduling-sweep-line>)
>   - [領域6：グラフ探索・Union-Find（連結成分とネットワーク解析）](<#領域6グラフ探索union-find連結成分とネットワーク解析>)
>   - [領域7：頻出の「実務型・文字列ログ解析＆集計」問題](<#領域7頻出の実務型文字列ログ解析集計問題>)
>   - [領域8：文字列スライディングウィンドウ＆ASCII配列カウンタ](<#領域8文字列スライディングウィンドウascii配列カウンタ>)
>   - [領域9：貪欲法（Greedy）による区間スケジューリング＆Bit-Packingソート](<#領域9貪欲法greedyによる区間スケジューリングbit-packingソート>)
>   - [領域10：2次元グリッド探索（非再帰BFS / 島の数・最短経路）](<#領域102次元グリッド探索非再帰bfs-島の数最短経路>)
>   - [領域11：実務型②「レートリミッター ＆ LRUキャッシュ制御」](<#領域11実務型②レートリミッター-lruキャッシュ制御>)
>   - [領域12：整数論・約数列挙・最大公約数（GCD）と周期性](<#領域12整数論約数列挙最大公約数gcdと周期性>)
> - [第6章：試験本番のタイムマネジメントと提出前チェックリスト](<#第6章試験本番のタイムマネジメントと提出前チェックリスト>)

---

## 第1章：難関テック企業選考におけるCodilityのリアルと採点構造

大手テック企業・メガベンチャーの中途採用におけるCodilityは、標準枠で **2〜3問・90〜120分（1問30〜40分）**、大型の総合枠（Androidエンジニア等）で **5問・200分（アルゴリズム1〜2問＋Android実務実装・単体テスト・バグ修正Bugfixing・知識問題で3〜4問）** の構成となっています（職種特化タスクとバグ修正問題の詳細は [12_【5問200分特化】完全攻略バイブル.md](<./12_【5問200分特化】Codility「バグ修正・Android実務実装・単体テスト・知識問題」完全攻略バイブル.md>) を参照）。難易度は **LeetCode Easy〜Medium（AtCoder B〜C、一部D相当）** であり、「奇抜な難問は出ないが、計算量（パフォーマンス）とエッジケースへの配慮がシビア」という特徴があります。

### 1.1 評価される3つの指標
1. **Correctness（正確性）**: 基本テストケースおよび**Submit後にしか走らない「見えないテストケース（要素数0・1、全要素同値・負数、32bit Intオーバーフロー）」**をパスしているか。
2. **Performance（計算量）**: 大規模データ（$N = 100,000$ など）に対して二重ループ $O(N^2)$ でTLEにならず、$O(N)$ や $O(N \log N)$ で処理が終わるか。
3. **Code Quality（可読性・保守性）**: 提出されたコードは面接官も閲覧します。複雑な処理を1つの関数にベタ書きせず小さなヘルパー関数に分けるなど、保守性を意識できているかが評価されます。

### 1.2 スコアリングの内部構造
Codilityの各設問は **Correctness（正確性：約50〜60%）** と **Performance（性能：約40〜50%）** の合算で100%満点として算出されます。
* **特徴的な罠（事後採点方式）**: 受験中に「Run」ボタンで確認できるのはサンプルテスト（2〜3個）とカスタムテストのみです。境界値（Corner Cases）や巨大データ（Large Tests）の合否は、**Submit（提出）した後に裏側で数十個一斉に実行**されます。
* **合格ラインの目安**: 満点である必要はなく、**全体で70%〜80%以上のスコア**が安全圏とされています。関数の1行目に `if (A.isEmpty()) return 0` のようなガード節をわずか十数文字入れておくだけで、エッジケース減点を防ぎ、「境界値に配慮できる堅実なエンジニア」と高く評価されます。

### 1.3 頻出トピックと職種別の出題傾向
#### 頻出トピック（二重ループ $O(N^2)$ を $O(N)$ に落とす4大武器）
* **① ハッシュマップ (`mp`)**（ペア探索・出現頻度の集計）
* **② ハッシュセット / 配列カウンタ (`st` / `pos`)**（重複排除・既出判定）
* **③ 累積和 (`acc`)**（区間和・区間クエリの $O(1)$ 応答）
* **④ ソート＋二分探索 / 尺取り法 (`l, r` / `lo, hi`)**（条件を満たす最小・最大区間、答えで二分探索）
* **⑤ スタック・キュー (`st`, `q`)**（単調スタック衝突判定、非再帰BFS）

#### 職種別の出題傾向の違い
* **サーバーサイド / データ（Kotlin / Java / SQL）**:
  * アルゴリズム2〜3問に加え、文字列ログパースやレートリミッター、または3問中1問がSQL（`GROUP BY`, `JOIN`, ウィンドウ関数）になるケースがあります。
* **クライアント（Android / Kotlin）**:
  * アルゴリズム1〜2問＋実務状態遷移（ViewModel/Coroutines/キャッシュ/Interceptor）・バグ修正（Bugfixing）・知識問題が出題されます。

---

## 第2章：AI検知・盗作判定（Plagiarism Detection）の内部仕様と完全回避策

Codilityは業界最高水準の不正検知システムを導入しています。どのように検知され、どう書けば**「AI利用を一切疑われず、かつ試験本番で最速タイピングと高評価を両立できるか」**を整理します。

### 2.1 検知エンジンの3つの監視レイヤー
1. **AST（抽象構文木）フィンガープリント比較**:
   ChatGPT等が出力する典型的な解答パターン（問題文の英単語を繋げた長い変数名＋ガード節なし＋冗長な標準コレクション操作）と構文木を照合しています。
2. **キーストローク・テレメトリ（Playback再生機能）**:
   エディタ上のすべての入力・削除・カーソル移動がタイムスタンプ付きで記録されています。「最初の数分間なにも入力せず、その後に完成されたコードを上から下まで一気通貫で迷いなく打ち込む」挙動は、別端末（スマホや別PC）のAI出力を書き写していると疑われます。
3. **Webカメラ監視（Proctoring）とフォーカス離脱検知**:
   手元の紙をずっと見続けていると「画面外（スマホなど）を見ている」とAI監視システムにフラグを立てられるリスクがあります。

### 2.2 AI生成・盗作判定（Similarity Check）を回避する基本4戦略＋AST独自化テクニック

#### ① 変数名は「3〜4文字の定番略語（`ans`, `cnt`, `cur`, `mp`）」に統一する
生成AIは特に指定しない限り、`maxProfitSoFar`, `uniqueElementCount`, `frequencyMap`, `currentWindowSum` のような**丁寧で長い教科書通りの変数名**を出力する強いクセがあります。補完が弱いWebエディタ上で20文字近い変数名を高速・無ミスで打ち込む方が「AIのコードを写しているのでは？」と不自然に映ります。
逆に `a, b, c` のような意味不明な1文字の乱用は人間のコードレビューで減点されます。
* **ベストプラクティス**: アルゴリズム試験の世界共通慣習である **3〜4文字の定番略語（`ans`, `res`, `cnt`, `tot`, `cur`, `idx`, `arr`, `mp`, `st`, `l`, `r`, `lo`, `hi`, `mid`, `mx`, `mn`）** を使います。これにより**タイピング量が半減し、AI疑惑も完全に消え、第三者が読んでも意味が一瞬で伝わる**最もバランスの良いコードになります（詳細は [11_3文字定番略語ルール.md](<./11_【試験本番・入力ログ対策②】AI誤認を防ぎタイピング量を削る3文字定番略語ルール.md>) 参照）。

#### ② `when` 式とガード節（Early Return）の明示的な記述
関数の1行目でエッジケースを `if (A.isEmpty()) return 0` のように明示的に弾くガード節を入れます。タイプ数はわずか十数文字で済み、Submit後の隠れテストケースによる減点を防ぎます。

#### ③ 小さなローカルヘルパー関数（`fun ok(...)`）への切り出しと短縮イディオム
複雑な条件判定やコスト計算は、1つの関数にベタ書きせず **小さなヘルパー関数（`fun ok(lim: Long): Boolean` や `fun cost(s: Int): Int`）** に切り出します。特にKotlinでは `solution` 関数の内部にローカル関数を定義できるため、外側の配列 `A` や `K` を引数で渡すタイピングを丸ごと省略でき、選考官が重視する「可読性・保守性」と「爆速タイピング」を同時に達成できます。

#### ④ 定数の抽出と `maxOf` / `minOf` の活用
上限値 `1_000_000_000L` などは `private const val LIM = 1_000_000_000L` として定義し、最大・最小計算は `import kotlin.math.*` が不要な標準組み込みの `maxOf(a, b)` / `minOf(a, b)` を使ってファイル先頭への移動時間をゼロにします。

#### ⑤ 思考プロセスを残す「意図コメント」と「段階的実装プロセス」の演出
手元の紙ではなく、**Codilityのエディタ上に直接コメント（`// 1. ガード節  2. 重複消す set  3. ソート`）として20〜30文字の思考メモ**を残します。
その上で、**①先に `var ans = 0` と `return ans` を書く → ②次にループのガワ（外枠）だけ書く → ③1つ目のブロックを書いたら一度 `Run` を押す → ④最後にループの中身を埋める** という順番（アウトサイド・イン入力法）で書くことで、入力再生ログ（Playback）が100%人間の思考プロセスになります（詳細は [10_エディタ内コメント設計＆外枠入力の極意.md](<./10_【試験本番・入力ログ対策①】紙ではなくエディタ内コメント設計＆外枠入力の極意.md>) 参照）。

---

## 第3章：Kotlin特有のパフォーマンス罠とJVM最適化（Time Limit Exceeded対策）

アルゴリズムの計算量が $O(N)$ でも、Kotlin特有の「オートボクシング（Auto-boxing）」やコレクション生成コストによって **TLE（制限時間超過）やメモリ上限超過** になるケースが多発します。

### 3.1 プリミティブ配列 vs コレクション（Boxingの罠）
Kotlinでは、`List<Int>` や `Array<Int>` はJVM上で `java.lang.Integer` のオブジェクト配列にコンパイルされます。要素数 $N = 100,000$ の場合、オブジェクトヘッダのオーバーヘッドによりメモリ消費量が約4〜5倍になり、GC（ガベージコレクション）が頻発して実行速度が劇的に落ちます。

| 操作・データ構造 | ❌ 遅い・メモリ大（Boxing発生） | ⭕ 高速・省メモリ（Primitive維持＆短打鍵） | 理由 |
| :--- | :--- | :--- | :--- |
| **配列の生成** | `Array(n) { 0 }` / `List(n) { 0 }` | `IntArray(n)` / `LongArray(n)` | JVMの `int[]`, `long[]` に直接展開されるため |
| **最大・最小** | `import kotlin.math.max` + `max(a, b)` | `maxOf(a, b)` / `minOf(a, b)` | 標準組み込みのため `import` 文を打つ手間がゼロ |
| **ソート処理** | `val sorted = A.sorted()` | `val arr = A.clone().apply { sort() }` | `.sorted()` は `List<Int>`（Box化）を返すが、`.sort()` はプリミティブのままDual-Pivot Quicksortを実行する |
| **スタック/キュー** | `java.util.Stack<Int>()` | `val st = IntArray(n); var top = 0` | わずか2行で書けてBoxingゼロ・最速 |
| **ハッシュマップ** | `map.getOrDefault(x, 0) + 1` | `mp[x] = (mp[x] ?: 0) + 1` | エルビス演算子 `?: 0` の方が短くタイプミスしない |

---

## 第4章：基礎実践コーディング比較（❌ AI典型例 vs ⭕ 独自性のある高評価コード）

まずは基本となる3つの例題で、AIが生成しがちなコード（長い変数名・ガード節なし・Boxing発生）と、3〜4文字定番略語を用いた高速・高評価コードを比較します。

---

### 例題1：ペアの探索と頻度集計（ハッシュマップ vs 累積XOR）
> 📄 対応コード: [例題1_奇数回出現要素の特定_XOR.kt](<./kotlin/例題1_奇数回出現要素の特定_XOR.kt>)

**問題設定（Codility「OddOccurrencesInArray」相当）**:
整数配列 `A` が与えられたとき、配列内で出現回数が偶数回の要素を除き、**奇数回出現する唯一の要素**を特定せよ。（計算量 $O(N)$、空間計算量 $O(1)$）

#### ❌ AIが生成しがちな典型コード（避けるべき例）
```kotlin
// AI特有の長い変数名（elementFrequencyMap, currentNumber）＋HashMapのボクシングとメモリ消費
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

#### ⭕ 独自性・パフォーマンスともに高評価なKotlin実装
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

### 例題2：すれ違う車のペア集計（プリミティブ変数乱立 vs 状態管理クラス）
> 📄 対応コード: [例題2_すれ違う車のペア集計_TrafficCounter.kt](<./kotlin/例題2_すれ違う車のペア集計_TrafficCounter.kt>)

**問題設定（Codility「PassingCars」相当）**:
道路上の車の進行方向を表す配列 `A`（`0` が東行き、`1` が西行き）が与えられる。東行きの車 `P` と西行きの車 `Q` が $0 \le P < Q < N$ の関係にあるとき「すれ違うペア」とみなす。ペアの総数を求めよ。ただし `1,000,000,000` を超える場合は `-1` を返せ。

#### ❌ AIが生成しがちな典型コード（避けるべき例）
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

#### ⭕ 独自性・保守性ともに高評価なKotlin実装
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

### 例題3：条件を満たす最小連続区間（尺取り法 / Two Pointers 構造体活用）
> 📄 対応コード: [例題3_最小連続区間長_尺取り法.kt](<./kotlin/例題3_最小連続区間長_尺取り法.kt>)

**問題設定**:
正の整数配列 `A` と目標値 `targetSum` が与えられる。連続する部分配列の合計が `targetSum` 以上となるもののうち、最小の要素数（区間長）を求めよ。存在しない場合は `0` を返せ。

#### ⭕ 独自性・可読性ともに高評価なKotlin実装
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

---

## 第5章：頻出12大アルゴリズム領域別・独自実装コード集

ここからは、Codilityで頻出する12の主要アルゴリズム領域について、**3〜4文字の定番略語・1行ガード節・小さなヘルパー関数・プリミティブ配列**で統一した、**試験本番で最速タイピングでき100%満点を叩き出すKotlin実装**を網羅します。

---

### 領域1：累積和と差分配列（Prefix Sums & Difference Array）
> 📄 対応コード: [領域1_累積和_DNA区間最小影響度.kt](<./kotlin/領域1_累積和_DNA区間最小影響度.kt>)

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
> 📄 対応コード: [領域2_単調スタック_生き残る魚の数.kt](<./kotlin/領域2_単調スタック_生き残る魚の数.kt>)

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
> 📄 対応コード: [領域3_最大部分配列和_Kadane法.kt](<./kotlin/領域3_最大部分配列和_Kadane法.kt>)

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
> 📄 対応コード: [領域4_答えで二分探索_最大ブロック和の最小化.kt](<./kotlin/領域4_答えで二分探索_最大ブロック和の最小化.kt>)

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
> 📄 対応コード: [領域5_平面走査法_円盤の交差ペア数.kt](<./kotlin/領域5_平面走査法_円盤の交差ペア数.kt>)

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
> 📄 対応コード: [領域6_非再帰UnionFind_ネットワーク連結成分.kt](<./kotlin/領域6_非再帰UnionFind_ネットワーク連結成分.kt>)

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
> 📄 対応コード: [領域7_実務型文字列ログ解析_通話料金集計.kt](<./kotlin/領域7_実務型文字列ログ解析_通話料金集計.kt>)

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

### 領域8：文字列スライディングウィンドウ＆ASCII配列カウンタ
> 📄 対応コード: [領域8_文字列ウィンドウ_重複なし最長部分文字列.kt](<./kotlin/領域8_文字列ウィンドウ_重複なし最長部分文字列.kt>)

```kotlin
/**
 * 領域8: 文字列スライディングウィンドウ＆ASCII配列カウンタ
 * 計算量: Time O(N), Space O(1) (サイズ256の固定長IntArray)
 * 高速打鍵ポイント: HashMap<Char, Int> の代わりに `IntArray(256) { -1 }` + `l, r, ans` で10行実装
 */
fun solutionLongestUniqueSubstring(S: String): Int {
    // 1. ガード節
    val n = S.length
    if (n <= 1) return n

    // 2. 各文字の最終出現位置 pos を記録しながら左端 l をジャンプ更新
    val pos = IntArray(256) { -1 }
    var l = 0
    var ans = 0

    for (r in 0 until n) {
        val c = S[r].code and 0xFF
        if (pos[c] >= l) {
            l = pos[c] + 1
        }
        pos[c] = r
        ans = maxOf(ans, r - l + 1)
    }
    return ans
}

fun main() {
    println("Algo08 LongestUniqueSubstring result: ${solutionLongestUniqueSubstring("abcabcbb")} (Expected: 3)")
}
```

---

### 領域9：貪欲法（Greedy）による区間スケジューリング＆Bit-Packingソート
> 📄 対応コード: [領域9_貪欲法_重複しない最大区間選択.kt](<./kotlin/領域9_貪欲法_重複しない最大区間選択.kt>)

```kotlin
/**
 * 領域9: 貪欲法（Greedy）による区間スケジューリング（Codility「MaxNonoverlappingSegments」/「TieRopes」相当）
 * 計算量: ソート済みなら Time O(N), Space O(1)
 * 高速打鍵ポイント: 3文字略語 (cnt, prv) でシンプルに走査
 */
fun solutionMaxNonoverlappingSegments(A: IntArray, B: IntArray): Int {
    // 1. ガード節
    val n = A.size
    if (n <= 1) return n

    // 2. 終端がソート済みのため、直前の終端 prv より後に始まる区間を貪欲に採用
    var cnt = 1
    var prv = B[0]

    for (i in 1 until n) {
        if (A[i] > prv) {
            cnt++
            prv = B[i]
        }
    }
    return cnt
}

/**
 * 応用: 長さ A[i] のロープを隣接同士で結んで長さ K 以上のロープを最大何本作れるか（TieRopes）
 */
fun solutionTieRopes(K: Int, A: IntArray): Int {
    if (A.isEmpty() || K <= 0) return 0
    var cnt = 0
    var cur = 0L
    for (x in A) {
        cur += x
        if (cur >= K) {
            cnt++
            cur = 0L
        }
    }
    return cnt
}

fun main() {
    val a = intArrayOf(1, 3, 7, 9, 9)
    val b = intArrayOf(5, 6, 8, 9, 10)
    println("Algo09 MaxNonoverlappingSegments result: ${solutionMaxNonoverlappingSegments(a, b)} (Expected: 3)")
    println("Algo09 TieRopes result: ${solutionTieRopes(4, intArrayOf(1, 2, 3, 4, 1, 1, 3))} (Expected: 3)")
}
```

---

### 領域10：2次元グリッド探索（非再帰BFS / 島の数・最短経路）
> 📄 対応コード: [領域10_2次元グリッド探索_非再帰BFS最短経路と島集計.kt](<./kotlin/領域10_2次元グリッド探索_非再帰BFS最短経路と島集計.kt>)

```kotlin
/**
 * 領域10: 2次元グリッド探索（非再帰BFS / 島の数・最短経路・塗りつぶし）
 * 計算量: Time O(H * W), Space O(H * W)
 * 高速打鍵ポイント:
 *  1. 座標 (r, c) を `r * w + c` の1つの Int にエンコード（Pair生成ゼロ）
 *  2. キューを `val q = IntArray(h * w)` + `var hd = 0; var tl = 0` の2行で表現
 */
private val DR = intArrayOf(-1, 1, 0, 0)
private val DC = intArrayOf(0, 0, -1, 1)

fun solutionCountCountries(A: Array<IntArray>): Int {
    // 1. ガード節
    val h = A.size
    if (h == 0) return 0
    val w = A[0].size
    if (w == 0) return 0

    // 2. 訪問配列 vis とプリミティブ配列キュー q を用意
    val vis = BooleanArray(h * w)
    val q = IntArray(h * w)
    var cnt = 0

    // 3. 未訪問マスから非再帰BFSで同色連結成分を塗りつぶす
    for (r0 in 0 until h) {
        for (c0 in 0 until w) {
            val s = r0 * w + c0
            if (vis[s]) continue

            cnt++
            val col = A[r0][c0]
            var hd = 0
            var tl = 0
            vis[s] = true
            q[tl++] = s

            while (hd < tl) {
                val cur = q[hd++]
                val r = cur / w
                val c = cur % w

                for (d in 0..3) {
                    val nr = r + DR[d]
                    val nc = c + DC[d]
                    if (nr in 0 until h && nc in 0 until w) {
                        val nxt = nr * w + nc
                        if (!vis[nxt] && A[nr][nc] == col) {
                            vis[nxt] = true
                            q[tl++] = nxt
                        }
                    }
                }
            }
        }
    }
    return cnt
}

fun main() {
    val grid = arrayOf(
        intArrayOf(5, 4, 4),
        intArrayOf(4, 3, 4),
        intArrayOf(3, 2, 4),
        intArrayOf(2, 2, 2),
        intArrayOf(3, 3, 4),
        intArrayOf(1, 4, 4),
        intArrayOf(4, 1, 1)
    )
    println("Algo10 CountCountries result: ${solutionCountCountries(grid)} (Expected: 11)")
}
```

---

### 領域11：実務型②「レートリミッター ＆ LRUキャッシュ制御」
> 📄 対応コード: [領域11_実務型状態遷移_レートリミッターとキャッシュ制御.kt](<./kotlin/領域11_実務型状態遷移_レートリミッターとキャッシュ制御.kt>)

```kotlin
/**
 * 領域11: 実務型②「スライディングウィンドウ・レートリミッター ＆ LRUキャッシュ制御」
 * 計算量: Time O(N), Space O(N)
 * 高速打鍵ポイント: ユーザー別のキュー管理を `mp.getOrPut(uid) { ArrayDeque() }` で1行化し、判定関数 `ok()` に分離
 */
fun solutionRateLimiter(
    timestamps: IntArray,
    userIds: IntArray,
    windowSeconds: Int,
    maxRequests: Int
): IntArray {
    // 1. ガード節
    val n = timestamps.size
    if (n == 0) return IntArray(0)
    if (maxRequests <= 0) return IntArray(n) { 0 }

    // 2. ユーザーごとの直近リクエスト時刻キュー mp
    val mp = HashMap<Int, ArrayDeque<Int>>()
    val ans = IntArray(n)

    fun ok(uid: Int, now: Int): Boolean {
        val q = mp.getOrPut(uid) { ArrayDeque() }
        val exp = now - windowSeconds
        while (q.isNotEmpty() && q.first() <= exp) {
            q.removeFirst()
        }
        if (q.size >= maxRequests) return false
        q.addLast(now)
        return true
    }

    // 3. 時系列順に判定結果を記録
    for (i in 0 until n) {
        ans[i] = if (ok(userIds[i], timestamps[i])) 1 else 0
    }
    return ans
}

/**
 * 補足: LinkedHashMap(cap, 0.75f, true) を用いた最短 O(1) LRU キャッシュ実装
 */
class FastLruCache<K, V>(private val cap: Int) {
    private val mp = object : LinkedHashMap<K, V>(cap, 0.75f, true) {
        override fun removeEldestEntry(eldest: MutableMap.MutableEntry<K, V>?): Boolean = size > cap
    }
    fun get(k: K): V? = mp[k]
    fun put(k: K, v: V) { mp[k] = v }
}

fun main() {
    val ts = intArrayOf(1, 2, 3, 8, 12)
    val uids = intArrayOf(10, 10, 10, 10, 10)
    val res = solutionRateLimiter(ts, uids, windowSeconds = 10, maxRequests = 2)
    println("Algo11 RateLimiter result: ${res.contentToString()} (Expected: [1, 1, 0, 0, 1])")
}
```

---

### 領域12：整数論・約数列挙・最大公約数（GCD）と周期性
> 📄 対応コード: [領域12_整数論と周期性_約数列挙とユークリッド互除法.kt](<./kotlin/領域12_整数論と周期性_約数列挙とユークリッド互除法.kt>)

```kotlin
/**
 * 領域12: 整数論・約数列挙・最大公約数（GCD）と周期性
 * （Codility「CountFactors」「MinPerimeterRectangle」「ChocolatesByNumbers」相当）
 *
 * 計算量: 約数列挙 Time O(sqrt(N)), GCD Time O(log(min(A, B))), Space O(1)
 * 高速打鍵ポイント: `d * d <= n` は Int.MAX_VALUE でオーバーフローするため必ず `var d = 1L` で回す
 */
fun solutionCountFactors(N: Int): Int {
    // 1. ガード節
    if (N <= 0) return 0
    if (N == 1) return 1

    // 2. Long の d で d * d < n までペア(+2)を数え、平方数なら +1
    val n = N.toLong()
    var cnt = 0
    var d = 1L
    while (d * d < n) {
        if (n % d == 0L) cnt += 2
        d++
    }
    if (d * d == n) cnt++
    return cnt
}

/**
 * 非再帰のユークリッド互除法（GCD）と周期問題（ChocolatesByNumbers）
 */
private fun gcd(a: Long, b: Long): Long {
    var x = a
    var y = b
    while (y != 0L) {
        val r = x % y
        x = y
        y = r
    }
    return x
}

fun solutionChocolatesByNumbers(N: Int, M: Int): Int {
    if (N <= 0 || M <= 0) return 0
    return (N.toLong() / gcd(N.toLong(), M.toLong())).toInt()
}

fun main() {
    println("Algo12 CountFactors(24): ${solutionCountFactors(24)} (Expected: 8)")
    println("Algo12 CountFactors(Int.MAX_VALUE): ${solutionCountFactors(Int.MAX_VALUE)} (Expected: 2)")
    println("Algo12 ChocolatesByNumbers(10, 4): ${solutionChocolatesByNumbers(10, 4)} (Expected: 5)")
}
```

---

## 第6章：試験本番のタイムマネジメントと提出前チェックリスト

### 6.1 試験時間（90〜120分・3問想定 / 200分・5問想定）の黄金配分
Codilityは**「解ける問題から解く」「ハマったら一旦60%（Correctness満点）で逃げる」**のが鉄則です。

1. **開始直後（0〜5分）**: 全問題に目を通し、難易度を把握する。
2. **序盤（知識・バグ修正・易しい実装問題）**: エディタ内コメント `// 1. ...` と1行ガード節を書き、3文字略語で素早く100%を取る。
3. **中盤（標準アルゴリズム問題）**: 4大武器（`mp`, `st`, `acc`, `l/r`）を使って $O(N)$ / $O(N \log N)$ で実装し、1つ目のブロックを書いた段階で一度 `Run` を挟む。
4. **終盤（高難度アルゴリズム・実務実装）**: 小さなローカルヘルパー関数 `fun ok()` に条件判定を切り出して実装。もし開始15分で最適解が思いつかない場合は、迷わず確実な $O(N^2)$ 解法でCorrectness 100%（総合50〜60%）を確保する。
5. **最終見直し＆カスタムテスト（残り15分）**: 全タスクの境界値テストを実行。

### 6.2 提出直前の「5大バグ撲滅チェックリスト」
Submitボタンを押す前に、自分のコードに対して以下の5点を必ず指差し確認してください。

* [ ] **① `Int` オーバーフローの罠**:
  要素の最大値が $10^9$ や `Int.MAX_VALUE` のとき、合計値や `d * d <= n` で `Int` のまま計算していないか？（必ず `0L` / `.toLong()` を使う）
* [ ] **② サイズ0・サイズ1の配列**:
  関数の1行目に `if (A.isEmpty()) return 0` などのガード節を入れたか？
* [ ] **③ 全要素が負数、または全要素が同じ値**:
  最大値を求める問題で `var ans = 0` と初期化していないか？（`Int.MIN_VALUE` または `A[0]` で初期化する）
* [ ] **④ 添字の上限・下限（Off-by-one error）**:
  ループの終端条件で先頭 `A[0]` や末尾 `A[n-1]` が処理漏れになっていないか？
* [ ] **⑤ 不要なデバッグ出力（`println`）の削除**:
  デバッグ用の `println()` をループ内に残したまま提出すると、標準出力のI/OボトルネックによりPerformanceテストですべて **TLE（時間切れ）** になります。提出前に必ず削除してください。
