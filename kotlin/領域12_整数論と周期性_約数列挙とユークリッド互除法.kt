// 手順 21 / 45。 左メニューの上から 21 番目です。読み終えたら、すぐ下の「12_【5問200分特化】Codility「バグ修正・Android実務実装・単体テスト・知識問題」完全攻略バイブル」を開いてください。
/**
 * 領域12: 整数論・約数列挙・最大公約数（GCD）と周期性
 * （Codility「CountFactors」「MinPerimeterRectangle」「ChocolatesByNumbers」相当）
 *
 * 計算量: 約数列挙 Time O(sqrt(N)), GCD Time O(log(min(A, B))), Space O(1)
 * 高速打鍵ポイント: `d * d <= n` は Int.MAX_VALUE でオーバーフローするため必ず `var d = 1L` で回す
 */
fun solutionCountFactors(N: Int): Int {
    // 1. ガード節
    if (N <= 0) return 0
    if (N == 1) return 1

    // 2. Long の d で d * d < n までペア(+2)を数え、平方数なら +1
    val n = N.toLong()
    var cnt = 0
    var d = 1L
    while (d * d < n) {
        if (n % d == 0L) cnt += 2
        d++
    }
    if (d * d == n) cnt++
    return cnt
}

/**
 * 非再帰のユークリッド互除法（GCD）と周期問題（ChocolatesByNumbers）
 */
private fun gcd(a: Long, b: Long): Long {
    var x = a
    var y = b
    while (y != 0L) {
        val r = x % y
        x = y
        y = r
    }
    return x
}

fun solutionChocolatesByNumbers(N: Int, M: Int): Int {
    if (N <= 0 || M <= 0) return 0
    return (N.toLong() / gcd(N.toLong(), M.toLong())).toInt()
}

fun main() {
    println("Algo12 CountFactors(24): ${solutionCountFactors(24)} (Expected: 8)")
    println("Algo12 CountFactors(Int.MAX_VALUE): ${solutionCountFactors(Int.MAX_VALUE)} (Expected: 2)")
    println("Algo12 ChocolatesByNumbers(10, 4): ${solutionChocolatesByNumbers(10, 4)} (Expected: 5)")
}
