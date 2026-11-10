// 手順 17 / 45。 左メニューの上から 17 番目です。読み終えたら、すぐ下の「領域9_貪欲法_重複しない最大区間選択」を開いてください。
/**
 * 領域8: 文字列スライディングウィンドウ＆ASCII配列カウンタ
 * 計算量: Time O(N), Space O(1) (サイズ256の固定長IntArray)
 * 高速打鍵ポイント: HashMap<Char, Int> の代わりに `IntArray(256) { -1 }` + `l, r, ans` で10行実装
 */
fun solutionLongestUniqueSubstring(S: String): Int {
    // 1. ガード節
    val n = S.length
    if (n <= 1) return n

    // 2. 各文字の最終出現位置 pos を記録しながら左端 l をジャンプ更新
    val pos = IntArray(256) { -1 }
    var l = 0
    var ans = 0

    for (r in 0 until n) {
        val c = S[r].code and 0xFF
        if (pos[c] >= l) {
            l = pos[c] + 1
        }
        pos[c] = r
        ans = maxOf(ans, r - l + 1)
    }
    return ans
}

fun main() {
    println("Algo08 LongestUniqueSubstring result: ${solutionLongestUniqueSubstring("abcabcbb")} (Expected: 3)")
}
