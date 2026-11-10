// 手順 15 / 45。 左メニューの上から 15 番目です。読み終えたら、すぐ下の「領域7_実務型文字列ログ解析_通話料金集計」を開いてください。
/**
 * 領域6: グラフ連結成分・非再帰Union-Find（Disjoint Set Union）
 * 計算量: Time O((N + M) * α(N)), Space O(N)
 * 高速打鍵ポイント: クラスを作らず配列 `par` + ローカル関数 `find(x)` でわずか15行で非再帰Union-Findを実装
 */
fun solutionConnectedComponents(N: Int, U: IntArray, V: IntArray): Int {
    // 1. ガード節
    if (N <= 0) return 0
    if (U.isEmpty()) return N

    // 2. 親配列 par と連結成分数 cnt を初期化
    val par = IntArray(N) { it }
    var cnt = N

    // 非再帰の経路圧縮 find (StackOverflow完全防止 & 短縮経路圧縮)
    fun find(x: Int): Int {
        var cur = x
        while (cur != par[cur]) {
            par[cur] = par[par[cur]] // 1行経路圧縮 (Path Halving)
            cur = par[cur]
        }
        return cur
    }

    // 3. 各辺を順番に併合し、異なる成分なら cnt を減らす
    for (i in U.indices) {
        val r1 = find(U[i])
        val r2 = find(V[i])
        if (r1 != r2) {
            par[r1] = r2
            cnt--
        }
    }
    return cnt
}

fun main() {
    val res = solutionConnectedComponents(5, intArrayOf(0, 1, 3), intArrayOf(1, 2, 4))
    println("Algo06 ConnectedComponents result: $res (Expected: 2)")
}
