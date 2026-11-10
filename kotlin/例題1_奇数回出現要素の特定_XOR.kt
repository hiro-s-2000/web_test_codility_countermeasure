// 手順 6 / 45。 左メニューの上から 6 番目です。読み終えたら、すぐ下の「例題2_すれ違う車のペア集計_TrafficCounter」を開いてください。
/**
 * 例題1：ペアの探索と頻度集計（Codility「OddOccurrencesInArray」相当）
 * 問題設定: 整数配列 A 内で出現回数が偶数回の要素を除き、奇数回出現する唯一の要素を特定する。
 *
 * 計算量: Time O(N), Space O(1)
 * リーダブル＆高速打鍵ポイント: 1行ガード節 + 不変の `fold` + 3文字略語 `acc`
 */
fun solutionOddOccurrences(A: IntArray): Int {
    // 1. ガード節 (空/1要素)
    if (A.isEmpty()) return -1
    if (A.size == 1) return A[0]

    // 2. 可変状態 (var) を持たず fold で累積XORを計算
    return A.fold(0) { acc, x -> acc xor x }
}

fun main() {
    val arr = intArrayOf(9, 3, 9, 3, 9, 7, 9)
    println("Ex01 OddOccurrences result: ${solutionOddOccurrences(arr)} (Expected: 7)")
}
