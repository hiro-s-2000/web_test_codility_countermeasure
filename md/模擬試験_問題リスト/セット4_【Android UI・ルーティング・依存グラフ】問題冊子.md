<!-- NAV_BAR -->
> **手順 34 / 45。** 左メニューの上から 34 番目です。読み終えたら、すぐ下の「セット4_【Android UI・ルーティング・依存グラフ】解答・解説・1次面接尋問」を開いてください。

# 【模擬試験セット4：Android UI・ルーティング・依存グラフ応用】問題冊子（制限時間：90分 / 全3問）

> **⏱️ 使い方**
> - Android選考で特に出題されやすい **「スクロールUIの可視領域計算（二分探索）」「URI/DeepLink文字列のパースとルーティング」「タスク/モジュール依存関係グラフの循環検知（非再帰トポロジカルソート）」** の3問セットです。
> - 終了後、[セット4_【Android UI・ルーティング・依存グラフ】解答・解説・1次面接尋問.md](./セット4_【Android%20UI・ルーティング・依存グラフ】解答・解説・1次面接尋問.md) で答え合わせと1次面接対策を行います。

---

## Task 1：縦スクロールリスト（LazyColumn / RecyclerView）の可視アイテム高速特定（目標：25分）

### 問題文
縦方向に $N$ 個のアイテムが隙間なく並んだチャット履歴リストがあります。上から $i$ 番目（$0 \le i < N$）のアイテムの高さ（ピクセル）は `itemHeights[i]`（正の整数）です。
先頭アイテムの上端Y座標を `0` としたとき、アイテム $i$ が占めるY座標の半開区間は $[Y_i, Y_i + \text{itemHeights}[i])$ となります（ただし $Y_0 = 0, Y_i = \sum_{k=0}^{i-1} \text{itemHeights}[k]$）。

これに対して、ユーザーのスクロール位置を表す $M$ 個のクエリが与えられます。
クエリ $q$（$0 \le q < M$）では、画面の表示領域（Viewport）の上端座標 `viewportTop[q]` と下端座標 `viewportBottom[q]`（半開区間 $[\text{viewportTop}[q], \text{viewportBottom}[q])$）が与えられます。

各クエリについて、**表示領域と1ピクセル以上重なっている（可視状態にある）アイテムの個数**を求め、長さ $M$ の配列として返す関数 `solution(itemHeights: IntArray, viewportTop: LongArray, viewportBottom: LongArray): IntArray` を実装してください。

### 入出力例
- `itemHeights = [100, 200, 150, 300]`
  - アイテム0: `[0, 100)`
  - アイテム1: `[100, 300)`
  - アイテム2: `[300, 450)`
  - アイテム3: `[450, 750)`
- クエリ0: `top = 50, bottom = 350` -> アイテム0, 1, 2の3つが重なるため `3`
- クエリ1: `top = 100, bottom = 300` -> アイテム1のみ重なるため `1`（半開区間なのでアイテム0 `[0, 100)` とアイテム2 `[300, 450)` は重ならない）

### 制約
- $N, M$ は $1 \le N, M \le 100,000$ の整数
- `1 <= itemHeights[i] <= 100,000`
- `0 <= viewportTop[q] < viewportBottom[q] <= 10,000,000,000`
- **要求計算量**: 前処理 $O(N)$、クエリ応答 $O(M \log N)$、Space $O(N)$

### 関数シグネチャ
```kotlin
fun solution(
    itemHeights: IntArray,
    viewportTop: LongArray,
    viewportBottom: LongArray
): IntArray {
    // ここに実装
}
```

---

## Task 2：DeepLink URIのクエリパラメータ正規化と署名文字列生成（目標：25分）

### 問題文
Androidアプリで受け取ったDeepLink文字列 `uri` から、APIリクエスト検証用の正規化されたクエリ文字列（Canonical Query String）を生成する関数 `solution(uri: String): String` を実装してください。

入力 `uri` は `"scheme://host/path?key1=val1&key2=val2#fragment"` のような形式です（`?` 以降のクエリ部分や `#` 以降のフラグメント部分が存在しない場合もあります）。
以下のルールに従って正規化を行ってください：

1. `#` 以降のフラグメント部分は無視（除去）し、`?` と `#` の間にあるクエリ文字列のみを抽出する（クエリが存在しない、または空の場合は `""` を返す）。
2. `&` で区切られた各ペア `key=value` を解析する。
   - 空の要素（`&&` などで生じる空文字）や、`=` を含まない不正な要素、または `key` が空文字（`"=val"`）の要素は無視する（ただし `value` が空文字の `"key="` は有効とみなす）。
   - `key` が `"utm_"` で始まるトラッキング用パラメータ（例：`utm_source`, `utm_medium`）はすべて除外する。
3. 同じ `key` が複数回出現した場合は、**最後に出現した `value`** で上書き（採用）する。
4. 残った有効なパラメータを **`key` の辞書順（ASCII昇順）** にソートし、`"key1=val1&key2=val2"` の形式で連結して返す。

### 入出力例
- `uri = "line://shop/detail?id=42&utm_source= push&sort=desc&id=99&empty=#top"`
  - `#top` を除去。
  - `utm_source` を除去。
  - `id` は最後の `99` を採用。
  - キー辞書順（`empty`, `id`, `sort`）に並べ、`empty=&id=99&sort=desc` を返す。

### 制約
- `uri` の長さは $1 \le \text{length} \le 10,000$
- **要求計算量**: Time $O(L \log K)$（$L$ は文字列長、$K$ はパラメータ数）

### 関数シグネチャ
```kotlin
fun solution(uri: String): String {
    // ここに実装
}
```

---

## Task 3：非同期初期化タスクの依存関係解決と循環依存（デッドロック）検知（目標：40分）

### 問題文
Androidアプリの起動時に実行すべき $N$ 個の初期化タスク（タスク番号 $0, 1, \dots, N-1$）があります。
長さ $M$ の2つの配列 ` prerequisite` と `dependent` が与えられ、`prerequisite[k]` のタスクが完了した後でなければ `dependent[k]` のタスクを開始できないという依存関係（有向辺 $\text{prerequisite}[k] \to \text{dependent}[k]$）を表します。

1. もし依存関係に**サイクル（循環依存）が存在し、すべてのタスクを完了することが不可能な場合**は、空配列 `IntArray(0)` を返してください。
2. すべてのタスクを完了可能な場合は、依存関係を満たす実行順序（トポロジカルソート順）のうち、**「実行可能なタスクが複数あるときは、常にタスク番号が最も小さいものを優先して実行する（辞書順最小の実行順序）」** を長さ $N$ の配列として返す関数 `solution(N: Int, prerequisite: IntArray, dependent: IntArray): IntArray` を実装してください。

### 入出力例
- **例1**: `N = 4`, `prerequisite = [1, 2, 0]`, `dependent = [3, 0, 1]`
  - 依存関係は $2 \to 0 \to 1 \to 3$ なので `[2, 0, 1, 3]` を返す。
- **例2**: `N = 3`, `prerequisite = [0, 1, 2]`, `dependent = [1, 2, 0]`
  - $0 \to 1 \to 2 \to 0$ のサイクルがあるため `[]`（空配列）を返す。

### 制約
- $N$ は $1 \le N \le 100,000$ の整数
- $M$ は $0 \le M \le 200,000$ の整数
- **要求計算量**: Time $O((N + M) \log N)$、Space $O(N + M)$（※ 再帰DFSによる `StackOverflowError` を起こさないこと）

### 関数シグネチャ
```kotlin
fun solution(N: Int, prerequisite: IntArray, dependent: IntArray): IntArray {
    // ここに実装
}
```

