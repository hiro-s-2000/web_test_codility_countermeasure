<!-- NAV_BAR -->
> **手順 33 / 45。** 左メニューの上から 33 番目です。読み終えたら、すぐ下の「セット4_【Android UI・ルーティング・依存グラフ】問題冊子」を開いてください。

# 【模擬試験セット3：Android実務＆予備強化用】解答・解説 ＆ 1次面接尋問対策

---

## Task 1：アプリアップデート強制判定（セマンティックバージョン比較）

### 🚨 採点・エッジケースの罠
1. **末尾の `.0.0` の扱い**: `"14.2"` と `"14.2.0.0"` は等価（`0`）になる必要があるため、`maxOf(a.size, b.size)` までループを回し、インデックス範囲外は `0L` として扱う。
2. **先頭ゼロ（`"007"`）や大きな数値**: `toLong()` でパースすれば先頭ゼロは自動的に無視され、$10^9$ クラスでも安全に比較できる。

### ⭕ 100%満点＆高速打鍵（3文字略語）Kotlin模範解答
```kotlin
fun solution(clientVersion: String, minRequiredVersion: String): Int {
    // 1. '.' で分割し、長い方の要素数 len まで比較
    val a = clientVersion.split('.')
    val b = minRequiredVersion.split('.')
    val len = maxOf(a.size, b.size)

    // 2. 各セグメントを Long に変換して比較 (不足分は 0L)
    for (i in 0 until len) {
        val v1 = if (i < a.size) a[i].toLong() else 0L
        val v2 = if (i < b.size) b[i].toLong() else 0L
        if (v1 < v2) return -1
        if (v1 > v2) return 1
    }
    return 0
}
```

---

## Task 2：カスタムViewリストのスカイライン描画最小ストローク数（StoneWall）

### 🚨 解法の急所（単調増加スタック）
- 左から右へ高さを走査し、「現在維持されている長方形の高さ」を**単調増加スタック (`st`, `top`)** で管理します。
- 新しい高さ `h` が来たら：
  1. スタックの先頭が `h` より高い間は、その高さの長方形はここで途切れるため `top--` する。
  2. もしスタックが空、またはスタックの先頭が `h` より小さいなら、新しい長方形が必要なので `cnt++` して `st[top++] = h` する。

### ⭕ 100%満点＆高速打鍵（2行プリミティブスタック）Kotlin模範解答
```kotlin
fun solution(heights: IntArray): Int {
    // 1. ガード節
    val n = heights.size
    if (n == 0) return 0

    // 2. 単調増加スタック st で継続中の高さを管理
    val st = IntArray(n)
    var top = 0
    var cnt = 0

    for (h in heights) {
        while (top > 0 && st[top - 1] > h) {
            top--
        }
        if (top == 0 || st[top - 1] < h) {
            cnt++
            st[top++] = h
        }
    }
    return cnt
}
```

---

## Task 3：画像メモリキャッシュのバイト容量制限付きLRU退避シミュレーション

### 🚨 解法の急所（`LinkedHashMap` のアクセス順モード活用）
- Java/Kotlin標準の `LinkedHashMap(16, 0.75f, true)` を使うと、`mp[k]` にアクセスするだけで内部の双方向連結リストの末尾（最新位置）に自動で移動してくれます。
- 先頭要素（最も古い要素）は `mp.entries.iterator().next()` で $O(1)$ で取得・削除できるため、ローカル関数 `hit()` でバグゼロの容量制LRUキャッシュが書けます。

### ⭕ 100%満点＆高速打鍵（ローカル関数＋LinkedHashMap）Kotlin模範解答
```kotlin
fun solution(maxMemoryBytes: Int, imageKeys: IntArray, imageBytes: IntArray): Int {
    // 1. ガード節
    if (imageKeys.isEmpty() || maxMemoryBytes <= 0) return 0

    // 2. accessOrder=true の LinkedHashMap で LRU 順序を自動維持
    val lim = maxMemoryBytes.toLong()
    val mp = LinkedHashMap<Int, Long>(16, 0.75f, true)
    var cur = 0L
    var cnt = 0

    for (i in imageKeys.indices) {
        val k = imageKeys[i]
        val sz = imageBytes[i].toLong()

        // キャッシュヒット時 (mp[k] 参照で自動的に最新位置へ移動)
        if (mp[k] != null) {
            cnt++
            continue
        }
        if (sz > lim) continue

        // 容量内に収まるまで最古エントリ (先頭) を削除
        val it = mp.entries.iterator()
        while (cur + sz > lim && it.hasNext()) {
            cur -= it.next().value
            it.remove()
        }
        mp[k] = sz
        cur += sz
    }
    return cnt
}
```

### 🎤 1次面接（Android面接官）からの尋問と100点回答
- **Q. この実装はAndroid SDKの `androidx.collection.LruCache` と同じ構造ですね。実務でBitmapをキャッシュする場合、インメモリLRUキャッシュ以外に何を組み合わせますか？**
  - **A.** GlideやCoilと同様に、①メモリキャッシュ（`LruCache` + 強参照と `WeakReference` の2層構成）、②ディスクキャッシュ（`DiskLruCache`）、③ネットワーク取得の3層構造にします。また、表示先の `ImageView` / Compose `AsyncImage` のサイズに合わせて `BitmapFactory.Options.inSampleSize` でダウンサンプリングしてからデコードし、メモリキャッシュの浪費（`OutOfMemoryError`）を防ぐことが重要です。
