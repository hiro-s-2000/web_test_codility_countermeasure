// 手順 18 / 45。 左メニューの上から 18 番目です。読み終えたら、すぐ下の「領域10_2次元グリッド探索_非再帰BFS最短経路と島集計」を開いてください。
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
