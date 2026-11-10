// 手順 19 / 45。 左メニューの上から 19 番目です。読み終えたら、すぐ下の「領域11_実務型状態遷移_レートリミッターとキャッシュ制御」を開いてください。
/**
 * 領域10: 2次元グリッド探索（非再帰BFS / 島の数・最短経路・塗りつぶし）
 * 計算量: Time O(H * W), Space O(H * W)
 * 高速打鍵ポイント:
 *  1. 座標 (r, c) を `r * w + c` の1つの Int にエンコード（Pair生成ゼロ）
 *  2. キューを `val q = IntArray(h * w)` + `var hd = 0; var tl = 0` の2行で表現
 */
private val DR = intArrayOf(-1, 1, 0, 0)
private val DC = intArrayOf(0, 0, -1, 1)

fun solutionCountCountries(A: Array<IntArray>): Int {
    // 1. ガード節
    val h = A.size
    if (h == 0) return 0
    val w = A[0].size
    if (w == 0) return 0

    // 2. 訪問配列 vis とプリミティブ配列キュー q を用意
    val vis = BooleanArray(h * w)
    val q = IntArray(h * w)
    var cnt = 0

    // 3. 未訪問マスから非再帰BFSで同色連結成分を塗りつぶす
    for (r0 in 0 until h) {
        for (c0 in 0 until w) {
            val s = r0 * w + c0
            if (vis[s]) continue

            cnt++
            val col = A[r0][c0]
            var hd = 0
            var tl = 0
            vis[s] = true
            q[tl++] = s

            while (hd < tl) {
                val cur = q[hd++]
                val r = cur / w
                val c = cur % w

                for (d in 0..3) {
                    val nr = r + DR[d]
                    val nc = c + DC[d]
                    if (nr in 0 until h && nc in 0 until w) {
                        val nxt = nr * w + nc
                        if (!vis[nxt] && A[nr][nc] == col) {
                            vis[nxt] = true
                            q[tl++] = nxt
                        }
                    }
                }
            }
        }
    }
    return cnt
}

fun main() {
    val grid = arrayOf(
        intArrayOf(5, 4, 4),
        intArrayOf(4, 3, 4),
        intArrayOf(3, 2, 4),
        intArrayOf(2, 2, 2),
        intArrayOf(3, 3, 4),
        intArrayOf(1, 4, 4),
        intArrayOf(4, 1, 1)
    )
    println("Algo10 CountCountries result: ${solutionCountCountries(grid)} (Expected: 11)")
}
