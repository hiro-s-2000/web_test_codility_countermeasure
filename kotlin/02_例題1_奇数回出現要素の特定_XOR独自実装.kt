// 余力（手順 41 / 45）。 同じ例題の別解です。時間がなければ、すぐ下の「04_例題2_すれ違う車のペア集計_状態管理クラス独自実装」へ進んでください。
/**
 * 例題1：ペアの探索と頻度集計（Codility「OddOccurrencesInArray」相当）
 * 計算量: Time O(N), Space O(1)
 * リーダブル＆高速打鍵ポイント:
 *  - 可変変数 (var) を使わず `fold` で不変 (Immutable) かつ1行で累積XORを算出
 */
fun solution(A: IntArray): Int {
    // 1. ガード節 (空/1要素)
    if (A.isEmpty()) return -1
    if (A.size == 1) return A[0]

    // 2. x xor x = 0 の性質より、fold で奇数回出現要素のみを残す (var不要)
    return A.fold(0) { acc, x -> acc xor x }
}
