// 手順 8 / 45。 左メニューの上から 8 番目です。読み終えたら、すぐ下の「03_例題2_すれ違う車のペア集計_AI典型NG例」を開いてください。
/**
 * 例題3：条件を満たす最小連続区間（尺取り法 / Two Pointers）
 * 問題設定: 正の整数配列 A において、連続部分配列の和が targetSum 以上となる最小の要素数を求める。
 *
 * 計算量: Time O(N), Space O(1)
 * 高速打鍵ポイント: import不要の minOf() + 定番略語 (l, r, cur, ans)
 */
fun solutionMinSubArrayLen(targetSum: Int, A: IntArray): Int {
    // 1. ガード節
    if (A.isEmpty() || targetSum <= 0) return 0

    // 2. 右端 r を伸ばし、条件達成中は左端 l を縮める
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
    return if (ans == Int.MAX_VALUE) 0 else ans
}

fun main() {
    val arr = intArrayOf(2, 3, 1, 2, 4, 3)
    println("Ex03 MinSubArrayLen result: ${solutionMinSubArrayLen(7, arr)} (Expected: 2)")
}
