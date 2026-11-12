<!-- NAV_BAR -->
> **手順 5 / 45。** 左メニューの上から 5 番目です。読み終えたら、すぐ下の「例題1_奇数回出現要素の特定_XOR」を開いてください。

# 【アプリエンジニア特化】面接官に好かれるリーダブルコード＆Kotlin実装基準とセルフレビュー術

難関テック企業・メガベンチャーのAndroid（Kotlin）選考におけるコーディングテストおよび面接でのコードレビューでは、単にテストケースを通すこと以上に、**「数千万人が使う大規模・長寿命なプロダクトを、複数人で安全に保守・拡張できるコードか」** という視点がシビアに見られます。

テストが満点でもコードの質で落ちるケースがある一方、**一部テストが通らなくても設計意図や可読性が高く評価されて通過するケース**もあります。現場のアプリエンジニアに嫌われる書き方と、好かれる（リーダブルとされる）コードの基準、そして**「3〜4文字の高速打鍵ルール」との使い分け方**を整理します。

---

## 1. 面接官（現場アプリエンジニア）に嫌われる6大NGパターン

大規模開発においてバグやクラッシュの温床になりやすい書き方や、Kotlinの言語特性を活かせていない「古いJavaっぽいコード」は強いマイナス評価になります。

1. **`!!`（非Nullアサーション）の乱用と雑なNull処理**
   - **最も嫌われるポイント**です。テストを通すために安易に `!!` を使うと、「本番環境で `NullPointerException` によるアプリクラッシュを引き起こす人」と見なされます。
   - **対策**: `?: return`（早期リターン）、`toIntOrNull() ?: return`、`mapNotNull { ... }` を徹底します。
2. **不要な可変状態（`var` や `MutableList` など）の乱用・外部公開**
   - スレッドセーフティの破壊や状態管理の複雑化を招くため、理由なく `var` を使ったり、ViewModel等から外部に `MutableList` / `MutableStateFlow` をそのまま公開する設計は嫌われます。
   - **対策**: 原則 `val` で宣言し、`fold` や `sumOf`、`data class` の `.copy()`、`asStateFlow()` を使います。
3. **全てを1つの巨大関数に詰め込む手続き型コード（深いネスト）**
   - 時間制限がある中でも、100行を超えるような巨大関数や、ネストが3段・4段と深くなる `if-else` / `for` のゴリ押しは「構造化・抽象化ができない」と判断されます。
   - **対策**: 関数先頭のガード節（Early Return）でネストを浅く保ち、条件判定やパース処理を**単一責任の小さなヘルパー関数（`fun ok()`, `fun parse()`, `fun cost()`）**に切り出します。
4. **スコープ関数（`let`, `run`, `apply` 等）の誤用・ネスト**
   - `?.let { ... ?: run { ... } }` のようにスコープ関数をチェインして「どっちのケースかわかりにくい三項演算子もどき」を作ったり、`it` が何を指すか分からなくなるネストは可読性を著しく下げるため嫌われます。
   - **対策**: シンプルな `val v = x ?: return ...`（ガード節）や明示的な `if-else` 式を使います。
5. **計算量（Time / Space Complexity）への無頓着**
   - リストの検索で安易にループの中に `list.contains()`（$O(N^2)$）を書くなど、データ量が増えた際にUIフリーズ（ANR）やメモリリークを引き起こす書き方は厳しくチェックされます。
   - **対策**: 検索対象は必ず `HashSet` (`st`) や `HashMap` (`mp`) に変換して $O(1)$ で引き、コレクションの多段変換には `.asSequence()` を使います。
6. **意図のわからない命名とマジックナンバーの直書き**
   - `temp`, `data`, `list2`, `flag` といった意味の曖昧な命名や、`300`, `401`, `1_000_000_000` といった数値リテラルの直書きはレビューで必ず突っ込まれます。
   - **対策**: 閾値やステータスコードは `private const val LIM = 1_000_000_000L`、`private const val HTTP_UNAUTHORIZED = 401` のように定数化します。

---

## 2. アプリエンジニアに好かれる「リーダブルコード」4つの柱

クライアント（Android / Kotlin）開発では、**「Kotlinらしい表現力（Idiomatic Kotlin）」「イミュータブルな設計」「単一責任の原則」** の3つを押さえたコードが好まれます。

### ① 不変性（Immutability）の徹底
* 原則すべて `val` で宣言し、コレクションも標準のイミュータブルな `List`, `Set`, `Map` を使います。
* 状態を変更する場合は、既存のオブジェクトを書き換えるのではなく、`data class` の `copy()` や `fold` / `sumOf` を使って新しい値を返す（関数型アプローチ）書き方が好まれます。

```kotlin
// 例1: 可変変数 var を使わず fold で1行で累積XORを計算（例題1）
fun solution(A: IntArray): Int {
    if (A.isEmpty()) return -1
    return A.fold(0) { acc, x -> acc xor x }
}

// 例2: Mapの更新も MutableMap を作り直さず copy と + 演算子で不変更新（領域15）
data class MockHttpRequest(val url: String, val headers: Map<String, String> = emptyMap()) {
    fun withHeader(name: String, value: String): MockHttpRequest =
        copy(headers = headers + (name to value))
}
```

### ② 宣言的なコレクション操作（`asSequence()` / `mapNotNull`）と早期リターン
手続き型のループ（インデックスを使った `for` 文と `mutableListOf` と `!!` の組み合わせ）ではなく、何を実現したいかが一目でわかる標準ライブラリ関数を使い分けます。

```kotlin
// ❌ 嫌われる書き方（手続き型・可変状態・ネストが深い・!! の使用）
fun getActiveUserNames(users: List<User>?): List<String> {
    val result = mutableListOf<String>()
    if (users != null) {
        for (i in 0 until users.size) {
            if (users[i].isActive && users[i].name != null) {
                result.add(users[i].name!!)
            }
        }
    }
    return result
}

// ⭕ 好かれる書き方（早期リターン・宣言的・イミュータブル・Null安全・Sequenceで省メモリ）
fun getActiveUserNames(users: List<User>?): List<String> {
    if (users.isNullOrEmpty()) return emptyList()

    return users
        .asSequence() // 要素数が多い場合の中間リスト生成を回避
        .filter { it.isActive }
        .mapNotNull { it.name }
        .toList()
}
```

### ③ 型システムによる状態の表現（ドメインモデリング）
Webテストの実装問題（API仕様、ログ解析、ViewModel状態管理など）では、プリミティブ型（`String` や `Int`）のまま引き回すのではなく、**コンパクトな `data class` や `enum class` / `sealed interface` に切り出す**と非常に高く評価されます。

* **UI状態・通信結果**: `Int` や `Boolean` フラグの組み合わせではなく、`sealed interface SearchUiState`（`Idle`, `Loading`, `Content`, `Empty`, `Error`）を使い、`when` 式で網羅性（Exhaustiveness）をコンパイラに保証させる（[領域14_Android実装_ViewModelとCoroutines状態遷移テンプレート.kt](<../kotlin/領域14_Android実装_ViewModelとCoroutines状態遷移テンプレート.kt>)）。
* **ログ解析・集計タスク**: 入出力の1行を `private data class CallLog(val num: Long, val sec: Int)` に分離し、パース処理 `parse(raw): CallLog?`、料金計算 `cost(sec): Int`、集計処理を単一責任の関数に分ける（[領域7_実務型文字列ログ解析_通話料金集計.kt](<../kotlin/領域7_実務型文字列ログ解析_通話料金集計.kt>)）。

### ④ 「3〜4文字の高速打鍵ルール」と「リーダブルコード」の黄金の使い分け

「タイピング速度を上げるための3〜4文字略語（[11_3文字定番略語ルール.md](<./11_【試験本番・入力ログ対策②】AI誤認を防ぎタイピング量を削る3文字定番略語ルール.md>)）」と「リーダブルコード」は矛盾しません。問題の性質に応じて以下のように組み合わせるのが最強の戦略です。

| 項目 | 純粋アルゴリズム問題（配列・二分探索・BFS等） | 実務シミュレーション・Android実装問題（ログ解析・ViewModel等） |
| :--- | :--- | :--- |
| **データ構造** | ボクシングゼロの `IntArray`, `LongArray` | `sealed interface`, コンパクトな `data class`, `asSequence()` |
| **変数名** | 定番3〜4文字略語 (`ans`, `cnt`, `cur`, `mp`, `st`, `l`, `r`, `lo`, `hi`, `mid`) | 短く明確なドメイン略語 (`req`, `res`, `tok`, `log`, `dur`, `fee`, `q`, `st`) |
| **関数分割** | `solution` 内のローカル関数 `fun ok(lim: Long): Boolean` | 単一責任のヘルパー関数 `parse()`, `cost()`, `okEmail()`, `okPass()` |
| **絶対共通ルール** | **① `!!` 絶対禁止　② 関数1行目のガード節　③ マジックナンバーの `const val` 定数化　④ ネスト2段以内** |

---

## 3. 面接の「コーディングレビュー」で評価を劇的に上げる3つの立ち回り

1次・2次面接のレビューでは、提出したコードを画面共有しながら「なぜこう書いたのか」「今見返して改善したい点はあるか」をディスカッションします。

### ① 提出直後に「セルフレビューメモ」を作っておく
Webテスト終了直後、自分のコードを振り返り、以下の2点をメモしておきます（[08_【1次面接対策】尋問・深掘り完全攻略ガイド.md](<./08_【1次面接対策】コーディング試験の尋問・深掘り完全攻略ガイド.md>) 第4章のシートを活用）：
* 「制限時間内に確実に完走するため、変数名はアルゴリズム定番の短縮形（`ans`, `cnt`, `cur`）で統一し、ここはシンプルに書いたが、プロダクトコードならこうリファクタリングしたい」
* 「ここの計算量は $O(N \log N)$ だが、こういうデータ構造にすれば $O(N)$ にできる」
面接官から指摘される前に自分から言えると、シニアレベルの客観視ができている証明になります。

### ② 「なぜそのコレクション / Sequence / プリミティブ配列を選んだか」を即答する
* **「なぜ `List` ではなく `Sequence`（`asSequence()` / `lineSequence()`）にしたのか？」**
  → 「`filter` や `mapNotNull` を繋げる際、通常の `Iterable` だとステップごとに中間 `ArrayList` が生成されますが、`Sequence` なら遅延評価で1要素ずつパイプライン処理されるため、一時オブジェクトの生成とGC負荷を抑えられるからです。」
* **「なぜアルゴリズム問題では `List<Int>` ではなく `IntArray` にしたのか？」**
  → 「$N = 100,000$ 規模の数値処理では、`List<Int>` による `java.lang.Integer` のオートボクシングがメモリ4〜5倍増とTLEの原因になるため、JVMのプリミティブ配列 `int[]` に直接展開される `IntArray` を選びました。」

### ③ テスタビリティ（Unit Testのしやすさ）への言及を添える
レビュー時に**「実際のAndroidプロダクトコードであれば、このドメインロジックはViewModelからUseCase / Domainクラスへ切り出し、CoroutineDispatcherやClockをコンストラクタ注入（DI）して、エミュレータなしの高速なJVM Unit Testが書けるように設計します」**と一言添えると、実務での設計再現性が高く評価されます。
