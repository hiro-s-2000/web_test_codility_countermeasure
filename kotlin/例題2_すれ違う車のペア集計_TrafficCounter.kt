// 手順 7 / 45。 左メニューの上から 7 番目です。読み終えたら、すぐ下の「例題3_最小連続区間長_尺取り法」を開いてください。
/**
 * 例題2：すれ違う車のペア集計（Codility「PassingCars」相当）
 * 問題設定: 東行きの車(0)と西行きの車(1)がすれ違うペア(0 <= P < Q < N)の総数を求める。
 * 1,000,000,000を超える場合は -1 を返す。
 *
 * 計算量: Time O(N), Space O(1)
 * リーダブル＆高速打鍵ポイント: 定数抽出 (EAST, LIM) + 3文字略語 (cnt, ans) + Long
 */
private const val EAST = 0
private const val LIM = 1_000_000_000L

fun solutionPassingCars(A: IntArray): Int {
    // 1. ガード節
    if (A.size < 2) return 0

    // 2. 東行き(EAST)を cnt に蓄積、西行きで ans に加算
    var cnt = 0L
    var ans = 0L

    for (x in A) {
        if (x == EAST) {
            cnt++
        } else {
            ans += cnt
            if (ans > LIM) return -1
        }
    }
    return ans.toInt()
}

fun main() {
    val arr = intArrayOf(0, 1, 0, 1, 1)
    println("Ex02 PassingCars result: ${solutionPassingCars(arr)} (Expected: 5)")
}
