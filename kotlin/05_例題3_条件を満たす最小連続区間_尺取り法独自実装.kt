// 余力（手順 43 / 45）。 同じ例題の別解です。時間がなければ、すぐ下の「00_【統合完全版】Codility対策＆Kotlin実践大全」へ進んでください。
/**
 * 例題3：条件を満たす最小連続区間（尺取り法 / Two Pointers）
 * 計算量: Time O(N), Space O(1)
 * 高速打鍵ポイント: import不要の minOf() と定番略語 (l, r, cur, ans) でタイプ量を半減
 */
fun solution(targetSum: Int, A: IntArray): Int {
    // 1. ガード節
    if (A.isEmpty() || targetSum <= 0) return 0

    // 2. 尺取り法: 右端 r を進め、和 cur が目標以上なら左端 l を詰める
    var l = 0
    var cur = 0L
    var ans = Int.MAX_VALUE

    for (r in A.indices) {
        cur += A[r]
        while (cur >= targetSum && l <= r) {
            ans = minOf(ans, r - l + 1)
            cur -= A[l++]
        }
    }

    // 3. 見つからなければ 0
    return if (ans == Int.MAX_VALUE) 0 else ans
}
