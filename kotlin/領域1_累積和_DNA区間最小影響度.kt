// 手順 10 / 45。 左メニューの上から 10 番目です。読み終えたら、すぐ下の「領域2_単調スタック_生き残る魚の数」を開いてください。
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
