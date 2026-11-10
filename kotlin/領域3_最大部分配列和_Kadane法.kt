// 手順 12 / 45。 左メニューの上から 12 番目です。読み終えたら、すぐ下の「領域4_答えで二分探索_最大ブロック和の最小化」を開いてください。
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
