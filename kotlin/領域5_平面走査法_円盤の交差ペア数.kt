// 手順 14 / 45。 左メニューの上から 14 番目です。読み終えたら、すぐ下の「領域6_非再帰UnionFind_ネットワーク連結成分」を開いてください。
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
