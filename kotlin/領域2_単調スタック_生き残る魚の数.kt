// 手順 11 / 45。 左メニューの上から 11 番目です。読み終えたら、すぐ下の「領域3_最大部分配列和_Kadane法」を開いてください。
/**
 * 領域2: 単調スタックによる衝突シミュレーション（Codility「Fish」相当）
 * 計算量: Time O(N), Space O(N)
 * 高速打鍵ポイント: 冗長なStackクラスを作らず `val st = IntArray(n)` + `var top = 0` の2行でボクシングゼロ実装
 */
fun solutionSurvivingFish(A: IntArray, B: IntArray): Int {
    // 1. ガード節
    val n = A.size
    if (n <= 1) return n

    // 2. 下流(1)の魚をプリミティブ配列スタック st に積み、上流(0)と衝突判定
    val st = IntArray(n)
    var top = 0
    var cnt = 0 // 生き残った上流(0)の魚の数

    for (i in 0 until n) {
        val cur = A[i]
        if (B[i] == 1) {
            st[top++] = cur
            continue
        }
        // 上流(0)の魚が下流(1)の魚と順番に対決
        var win = true
        while (top > 0) {
            if (st[top - 1] > cur) {
                win = false
                break
            }
            top-- // 下流の魚を食べて次へ
        }
        if (win) cnt++
    }

    // 3. 上流生存数 cnt + 下流生存数 top
    return cnt + top
}

fun main() {
    val res = solutionSurvivingFish(intArrayOf(4, 3, 2, 1, 5), intArrayOf(0, 1, 0, 0, 0))
    println("Algo02 SurvivingFish result: $res (Expected: 2)")
}
