# Lesson 11 Sieve of Eratosthenes（公式のlessonの問題）

> Codility公式の [Lesson 11: Sieve of Eratosthenes](https://app.codility.com/programmers/lessons/11-sieve_of_eratosthenes/) の全問題を、Kotlinで解いた解答です。このLessonの問題は **CountNonDivisible**、**CountSemiprimes** の2問です。
> 問題文は公式ページで読み、下の要約は確認用に使ってください。先に自分で解いてから、答え合わせに解答を開くのがおすすめです。

## CountNonDivisible（Medium）

> 公式の問題文: [CountNonDivisible](https://app.codility.com/programmers/lessons/11-sieve_of_eratosthenes/count_non_divisible/)

### 問題の要約

- 整数の配列 `A`（長さ N は 1〜50,000）が渡される。要素の値は 1〜2N。
- 各 `A[i]` について、配列の中で `A[i]` の約数で**ない**要素がいくつあるかを数える。
- 自分自身（`A[i]` 自体）も配列の要素として数に入る。自分は自分の約数なので、数には入らない。
- 結果を `A` と同じ長さの `IntArray` で返す。

| 入力 | 答え | 一言 |
|---|---|---|
| `[3, 1, 2, 3, 6]` | `[2, 4, 3, 2, 0]` | 6 はほかの全要素で割り切れるので 0 |

### 解答コード（倍数に配る篩・O(M log M)）

```kotlin
fun solution(A: IntArray): IntArray {
    val n = A.size
    val m = 2 * n
    // cnt[v] = 値 v が配列に何個あるか
    val cnt = IntArray(m + 1)
    for (a in A) cnt[a]++
    // div[x] = 配列の中で x の約数になっている要素の個数
    val div = IntArray(m + 1)
    for (d in 1..m) {
        if (cnt[d] == 0) continue
        // d は d の倍数すべての約数なので、cnt[d] を配る
        var k = d
        while (k <= m) {
            div[k] += cnt[d]
            k += d
        }
    }
    return IntArray(n) { n - div[A[it]] }
}
```

### 解答コード（別解：√v までの約数を数える）

```kotlin
fun solution(A: IntArray): IntArray {
    val n = A.size
    val cnt = IntArray(2 * n + 1)
    for (a in A) cnt[a]++
    return IntArray(n) { i ->
        val v = A[i]
        var div = 0
        var d = 1
        while (d * d <= v) {
            if (v % d == 0) {
                div += cnt[d]
                if (d != v / d) div += cnt[v / d] // 対になる約数
            }
            d++
        }
        n - div
    }
}
```

### 考え方とポイント

- 「約数でない個数」は直接数えず、**N −（約数になっている要素の個数）** で求める。
- まず値ごとの出現回数 `cnt` を作る。値は 2N 以下なので配列で持てる。
- 本命は篩と同じ発想で、配列にある値 `d` ごとに、その倍数 `d, 2d, 3d, …` へ `cnt[d]` を足していく。全体で M/1 + M/2 + … ≒ M log M 回（M = 2N）。
- 別解は各要素について 1〜√v の約数 `d` と対の `v / d` を見る。O(N√N) でも N=50,000 なら十分速い。
- 時間 O(N log N)（本命）、追加メモリ O(N)。

### 試験で間違えやすい点

- 各 `A[i]` ごとに全要素と割り算する二重ループは O(N²) で、性能テストで時間切れになる。
- 別解で `d * d == v` のとき（平方数）、`d` と `v / d` が同じなので2回足さないようにする。
- 同じ値が何個もある配列でも、`cnt` で個数ごと足すので重複を気にしなくてよい。値ごとに1回だけ処理するのがポイント。

### 自分で確かめるテストケース

| 入力 | 期待値 | 確かめたいこと |
|---|---|---|
| `[1]` | `[0]` | 最小のN |
| `[2, 2]` | `[0, 0]` | 全部同じ値 |
| `[2, 3]` | `[1, 1]` | 互いに割り切れない |
| `[4, 2, 1, 8]` | `[1, 2, 3, 0]` | 倍数の連鎖 |
| `[6, 5, 4, 3, 2, 1]` | `[2, 4, 3, 4, 4, 5]` | 1 は何の約数にもなる |
| `[4, 4, 4, 2]` | `[0, 0, 0, 3]` | 平方数と重複 |

## CountSemiprimes（Medium）

> 公式の問題文: [CountSemiprimes](https://app.codility.com/programmers/lessons/11-sieve_of_eratosthenes/count_semiprimes/)

### 問題の要約

- 「半素数」とは、2つの素数の積で書ける数のこと。2つは同じ素数でもよい（4 = 2×2、6 = 2×3、9 = 3×3 など）。
- 整数 `N` と、長さ `M` の配列 `P`、`Q` が渡される。`K` 番目の質問は「`P[K]` 以上 `Q[K]` 以下に半素数はいくつあるか」。
- `M` 個の答えを `IntArray` で返す。
- 範囲: `N` は 1〜50,000、`M` は 1〜30,000、`P[K]`・`Q[K]` は 1〜`N`、`P[K] ≤ Q[K]`。

| 入力 | 答え | 一言 |
|---|---|---|
| N=26, P=[1, 4, 16], Q=[26, 10, 20] | [10, 4, 0] | [1,26] は 4,6,9,10,14,15,21,22,25,26。[16,20] には無い |

### 解答コード（最小素因数のふるい＋累積和）

```kotlin
fun solution(N: Int, P: IntArray, Q: IntArray): IntArray {
    // f[x] = x の最小の素因数。素数（と0,1）は0のまま
    val f = IntArray(N + 1)
    var i = 2
    while (i * i <= N) {
        if (f[i] == 0) {
            var k = i * i
            while (k <= N) {
                if (f[k] == 0) f[k] = i
                k += i
            }
        }
        i++
    }
    // pre[x] = 1..x にある半素数の個数
    val pre = IntArray(N + 1)
    for (x in 2..N) {
        val d = f[x]
        // 合成数で、最小素因数で割った残りが素数なら半素数
        val semi = d != 0 && f[x / d] == 0
        pre[x] = pre[x - 1] + if (semi) 1 else 0
    }
    return IntArray(P.size) { pre[Q[it]] - pre[P[it] - 1] }
}
```

### 解答コード（別解：素数の組で印を付ける）

```kotlin
fun solution(N: Int, P: IntArray, Q: IntArray): IntArray {
    // 普通のふるいで素数を集める
    val comp = BooleanArray(N + 1)
    val primes = ArrayList<Int>()
    for (i in 2..N) {
        if (comp[i]) continue
        primes.add(i)
        var k = i.toLong() * i
        while (k <= N) { comp[k.toInt()] = true; k += i }
    }
    // a ≤ b の素数の組で a*b に印を付ける
    val semi = BooleanArray(N + 1)
    for (a in primes.indices) {
        if (primes[a].toLong() * primes[a] > N) break
        for (b in a until primes.size) {
            val v = primes[a].toLong() * primes[b]
            if (v > N) break
            semi[v.toInt()] = true
        }
    }
    val pre = IntArray(N + 1)
    for (x in 1..N) pre[x] = pre[x - 1] + if (semi[x]) 1 else 0
    return IntArray(P.size) { pre[Q[it]] - pre[P[it] - 1] }
}
```

### 考え方とポイント

- 先に 1〜N の全部について「半素数か」を調べ、累積和にしておけば、各質問は引き算1回で答えられる。
- エラトステネスのふるいで「最小の素因数」`f[x]` を記録する。`x = d × (x / d)` と分けたとき、残りの `x / d` が素数なら素因数はちょうど2個なので半素数だ。
- 範囲 [P, Q] の個数は `pre[Q] - pre[P - 1]`。`P` は1以上なので `P - 1` は0以上で、配列外にならない。
- 別解は素数リストを作り、`a ≤ b` の組の積 `a*b` に直接印を付ける方法。積が N を超えたら内側のループを打ち切るので速い。
- 計算量は時間 O(N log log N + M)、追加メモリ O(N)。

### 試験で間違えやすい点

- 質問ごとに範囲を数えると O(N × M) で、最大 50,000 × 30,000 になり性能テストで落ちる。必ず累積和にする。
- 4 = 2×2 や 49 = 7×7 のように、同じ素数の2乗も半素数に入る。「異なる2つの素数」と読み違えない。8 = 2×2×2 や 30 = 2×3×5 は素因数が3個なので入らない。
- 累積和の境界は `pre[Q] - pre[P - 1]`。`pre[Q] - pre[P]` と書くと `P` 自身が抜ける（`P = Q = 4` で0を返してしまう）。
- `IntArray(N + 1)` のように N+1 個取る。添字 N を使うので `IntArray(N)` だと配列外になる。

### 自分で確かめるテストケース

| 入力 | 期待値 | 確かめたいこと |
|---|---|---|
| N=1, P=[1], Q=[1] | [0] | 最小の N |
| N=4, P=[1], Q=[4] | [1] | 最小の半素数 4 = 2×2 |
| N=10, P=[7], Q=[7] | [0] | 素数は半素数ではない |
| N=50, P=[49], Q=[49] | [1] | 素数の2乗（7×7）を数える |
| N=10, P=[8], Q=[8] | [0] | 2×2×2 は素因数が3個 |
| N=30, P=[30], Q=[30] | [0] | 2×3×5 は素因数が3個 |
| N=50000, P=[1], Q=[50000] | [12110] | 最大の範囲 |
