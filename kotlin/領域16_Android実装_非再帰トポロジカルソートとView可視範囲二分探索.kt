// 手順 26 / 45。 左メニューの上から 26 番目です。読み終えたら、すぐ下の「00_【Android特化】模擬試験問題バンク一覧＆使い方ガイド」を開いてください。
/**
 * 【領域16：Android UI・App Startup特化アルゴリズム — 非再帰トポロジカルソート（Kahn法）＆ 可視範囲二分探索】
 * 高速打鍵ポイント:
 *  - トポロジカルソートは `deg` (入次数) + `q` (IntArrayキュー) で非再帰実装
 *  - 可視範囲検索は累積和 `st`, `ed` + ローカル二分探索関数で高速実装
 */
object AndroidUiAndGraphAlgorithms {

    /**
     * N個のモジュール（0..N-1）と依存関係（prereq[k] -> target[k]）から循環参照を検出（Kahn法）
     */
    fun canInitializeAllModules(n: Int, prereq: IntArray, target: IntArray): Boolean {
        // 1. ガード節
        if (n <= 1 || prereq.isEmpty()) return true
        val m = prereq.size

        // 2. Forward Star 隣接リストと入次数 deg を構築
        val hd = IntArray(n) { -1 }
        val to = IntArray(m)
        val nxt = IntArray(m)
        val deg = IntArray(n)

        for (e in 0 until m) {
            val u = prereq[e]
            val v = target[e]
            to[e] = v
            nxt[e] = hd[u]
            hd[u] = e
            deg[v]++
        }

        // 3. 入次数 0 の頂点をキュー q に入れて非再帰BFS
        val q = IntArray(n)
        var qh = 0
        var qt = 0
        for (i in 0 until n) {
            if (deg[i] == 0) q[qt++] = i
        }

        var cnt = 0
        while (qh < qt) {
            val u = q[qh++]
            cnt++
            var e = hd[u]
            while (e != -1) {
                val v = to[e]
                if (--deg[v] == 0) q[qt++] = v
                e = nxt[e]
            }
        }
        return cnt == n
    }

    /**
     * LazyColumn / RecyclerView の各アイテム高さ H[i] に対し、
     * スクロール範囲 [topY, bottomY) に少しでも重なるアイテム数を二分探索で求める
     */
    class ViewportItemFinder(H: IntArray) {
        private val n = H.size
        private val st = LongArray(n)
        private val ed = LongArray(n)

        init {
            var cur = 0L
            for (i in 0 until n) {
                st[i] = cur
                cur += H[i].toLong()
                ed[i] = cur
            }
        }

        fun countVisible(topY: Long, bottomY: Long): Int {
            // 1. ガード節
            if (n == 0 || bottomY <= topY) return 0

            // 2. ed[i] > topY となる最小インデックス l を二分探索
            var lo = 0
            var hi = n - 1
            var l = n
            while (lo <= hi) {
                val mid = (lo + hi) ushr 1
                if (ed[mid] > topY) {
                    l = mid
                    hi = mid - 1
                } else {
                    lo = mid + 1
                }
            }
            if (l == n) return 0

            // 3. st[i] < bottomY となる最大インデックス r を二分探索
            lo = l
            hi = n - 1
            var r = -1
            while (lo <= hi) {
                val mid = (lo + hi) ushr 1
                if (st[mid] < bottomY) {
                    r = mid
                    lo = mid + 1
                } else {
                    hi = mid - 1
                }
            }
            return if (r < l) 0 else (r - l + 1)
        }
    }
}

fun main() {
    val ok = AndroidUiAndGraphAlgorithms.canInitializeAllModules(
        4, intArrayOf(0, 1, 2), intArrayOf(1, 2, 3)
    )
    println("CanInitializeAll (DAG): $ok (Expected: true)")

    val finder = AndroidUiAndGraphAlgorithms.ViewportItemFinder(intArrayOf(50, 100, 80, 120, 60))
    println("Visible items in [50, 230): ${finder.countVisible(50, 230)} (Expected: 2)")
}
