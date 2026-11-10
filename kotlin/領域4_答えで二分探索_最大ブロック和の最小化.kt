// 手順 13 / 45。 左メニューの上から 13 番目です。読み終えたら、すぐ下の「領域5_平面走査法_円盤の交差ペア数」を開いてください。
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
