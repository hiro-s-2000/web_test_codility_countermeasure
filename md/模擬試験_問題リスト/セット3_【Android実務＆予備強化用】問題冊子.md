<!-- NAV_BAR -->
> **手順 32 / 45。** 左メニューの上から 32 番目です。読み終えたら、すぐ下の「セット3_【Android実務＆予備強化用】解答・解説・1次面接尋問」を開いてください。

# 【模擬試験セット3：Android実務＆予備強化用】問題冊子（制限時間：90分 / 全3問）

> **⏱️ 使い方**
> - セット1・セット2に加えて、時間があるときや特定の苦手領域（バージョン文字列比較、単調スタック、容量制限付きLRUキャッシュ）を強化したいときに1問単位（各20〜35分）または3問通し（90分）で活用してください。
> - 終了後、[セット3_【Android実務＆予備強化用】解答・解説・1次面接尋問.md](./セット3_【Android実務＆予備強化用】解答・解説・1次面接尋問.md) で答え合わせと1次面接対策を行います。

---

## Task 1：アプリアップデート強制判定（セマンティックバージョン比較）（目標：20分）

### 問題文
Androidアプリの現在のクライアントバージョン文字列 `clientVersion` と、サーバーから取得した最低必須バージョン文字列 `minRequiredVersion` が与えられます。
バージョン文字列はドット `.` で区切られた1個以上の非負整数（例：`"14.2.10"`, `"14.02.10.0"`, `"2.0"`）で構成されます。

以下のルールに従って比較を行い、
- `clientVersion < minRequiredVersion`（強制アップデートが必要）なら `-1`
- `clientVersion == minRequiredVersion` なら `0`
- `clientVersion > minRequiredVersion` なら `1`
を返す関数 `solution(clientVersion: String, minRequiredVersion: String): Int` を実装してください。

### ルール
1. 各セグメントは先頭のゼロ（Leading zeros）を無視して整数値として比較します（例：`"02"` と `"2"` は等しい）。
2. セグメント数が異なる場合、足りない末尾のセグメントは `0` であるとみなします（例：`"14.2"` と `"14.2.0.0"` は等しい）。

### 入出力例
- `clientVersion = "14.2.9"`, `minRequiredVersion = "14.2.10"` -> `-1`（$9 < 10$）
- `clientVersion = "14.02.0"`, `minRequiredVersion = "14.2"` -> `0`
- `clientVersion = "15.0"`, `minRequiredVersion = "14.9.9"` -> `1`

### 制約
- 各文字列の長さは $1 \le \text{length} \le 500$
- 各セグメントの数値は `0` 以上 `1,000,000,000`（$10^9$）以下

### 関数シグネチャ
```kotlin
fun solution(clientVersion: String, minRequiredVersion: String): Int {
    // ここに実装
}
```

---

## Task 2：カスタムViewリストのスカイライン描画最小ストローク数（目標：30分）

### 問題文（Codility名作「StoneWall」のAndroid UI版）
横方向に並んだ $N$ 個のバーグラフを描画するカスタムViewがあります。左から $i$ 番目（$0 \le i < N$）のバーの高さは `heights[i]` ピクセルです。
このバーグラフ全体を、**重なりのない最小個数の「長方形（矩形Rect）」の組み合わせ**に分割してCanvasに描画したいです。

必要な長方形の最小個数を求める関数 `solution(heights: IntArray): Int` を実装してください。

### 入出力例
- `heights = [8, 8, 5, 7, 9, 8, 7, 4, 8]` -> `7` を返す。

### 制約
- $N$ は $1 \le N \le 100,000$ の整数
- `heights[i]` は $1 \le \text{heights}[i] \le 1,000,000,000$ の整数
- **要求計算量**: Time $O(N)$、Space $O(N)$

### 関数シグネチャ
```kotlin
fun solution(heights: IntArray): Int {
    // ここに実装
}
```

---

## Task 3：画像メモリキャッシュのバイト容量制限付きLRU退避シミュレーション（目標：35分）

### 問題文
Androidアプリのインメモリ画像キャッシュ（`LruCache` 相当）をシミュレートします。
キャッシュの最大合計容量 `maxMemoryBytes`（バイト）と、順番にリクエストされる $N$ 個の画像キー配列 `imageKeys`、および各画像のバイトサイズ配列 `imageBytes` が与えられます。

各リクエスト $i$（$0 \le i < N$）について以下のルールで処理するとき、**キャッシュヒットした総回数**を返す関数 `solution(maxMemoryBytes: Int, imageKeys: IntArray, imageBytes: IntArray): Int` を実装してください。

1. リクエストされた `imageKeys[i]` が**すでにキャッシュ内に存在する（Cache Hit）**場合：
   - キャッシュヒット回数を `+1` する。
   - その画像を「最も新しくアクセスされた（Most Recently Used）」状態に更新する。
2. リクエストされた `imageKeys[i]` が**キャッシュ内に存在しない（Cache Miss）**場合：
   - もしその画像単体のサイズ `imageBytes[i]` が `maxMemoryBytes` を超えている場合は、キャッシュに格納せずスキップする。
   - そうでない場合、新しい画像を追加した後の合計バイト数が `maxMemoryBytes` 以下になるまで、**「最も古くアクセスされた（Least Recently Used）」画像から順番に削除（Evict）** し、その後に新しい画像をキャッシュへ格納する。

### 入出力例
- `maxMemoryBytes = 100`
- `imageKeys  = [1,  2,  3,  1,  4,  2]`
- `imageBytes = [40, 50, 30, 40, 60, 50]`
  1. Key 1 (40B): Miss -> キャッシュ `[1(40B)]` (計40B)
  2. Key 2 (50B): Miss -> キャッシュ `[1(40B), 2(50B)]` (計90B)
  3. Key 3 (30B): Miss -> 120B > 100B なので最古の `Key 1` を退避 -> キャッシュ `[2(50B), 3(30B)]` (計80B)
  4. Key 1 (40B): Miss -> 120B > 100B なので最古の `Key 2` を退避 -> キャッシュ `[3(30B), 1(40B)]` (計70B)
  5. Key 4 (60B): Miss -> 130B > 100B なので `Key 3` を退避しても 100B <= 100B で収まる -> キャッシュ `[1(40B), 4(60B)]` (計100B)
  6. Key 2 (50B): Miss...（もし途中でキャッシュに残っているキーが呼ばれればHit）

### 制約
- $N$ は $0 \le N \le 100,000$ の整数
- `maxMemoryBytes` は $1 \le \text{maxMemoryBytes} \le 1,000,000,000$
- **要求計算量**: Time $O(N)$、Space $O(N)$

### 関数シグネチャ
```kotlin
fun solution(maxMemoryBytes: Int, imageKeys: IntArray, imageBytes: IntArray): Int {
    // ここに実装
}
```

