// 余力（手順 42 / 45）。 同じ例題の別解です。時間がなければ、すぐ下の「05_例題3_条件を満たす最小連続区間_尺取り法独自実装」へ進んでください。
/**
 * 例題2：すれ違う車のペア集計（Codility「PassingCars」相当）
 * 計算量: Time O(N), Space O(1)
 * リーダブル＆高速打鍵ポイント:
 *  - マジックナンバー (0, 10億) を定数化 (EAST, LIM)
 *  - 定番3文字略語 (cnt, ans) + Long でオーバーフローを完全防止
 */
private const val EAST = 0
private const val LIM = 1_000_000_000L

fun solution(A: IntArray): Int {
    // 1. ガード節 (2台未満はペア0)
    if (A.size < 2) return 0

    // 2. 東行き(EAST)の台数 cnt を数え、西行きが来たら ans に加算
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
