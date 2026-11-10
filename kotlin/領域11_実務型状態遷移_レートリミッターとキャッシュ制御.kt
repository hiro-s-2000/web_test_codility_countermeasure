// 手順 20 / 45。 左メニューの上から 20 番目です。読み終えたら、すぐ下の「領域12_整数論と周期性_約数列挙とユークリッド互除法」を開いてください。
/**
 * 領域11: 実務型②「スライディングウィンドウ・レートリミッター ＆ LRUキャッシュ制御」
 * 計算量: Time O(N), Space O(N)
 * 高速打鍵ポイント: ユーザー別のキュー管理を `mp.getOrPut(uid) { ArrayDeque() }` で1行化し、判定関数 `ok()` に分離
 */
fun solutionRateLimiter(
    timestamps: IntArray,
    userIds: IntArray,
    windowSeconds: Int,
    maxRequests: Int
): IntArray {
    // 1. ガード節
    val n = timestamps.size
    if (n == 0) return IntArray(0)
    if (maxRequests <= 0) return IntArray(n) { 0 }

    // 2. ユーザーごとの直近リクエスト時刻キュー mp
    val mp = HashMap<Int, ArrayDeque<Int>>()
    val ans = IntArray(n)

    fun ok(uid: Int, now: Int): Boolean {
        val q = mp.getOrPut(uid) { ArrayDeque() }
        val exp = now - windowSeconds
        while (q.isNotEmpty() && q.first() <= exp) {
            q.removeFirst()
        }
        if (q.size >= maxRequests) return false
        q.addLast(now)
        return true
    }

    // 3. 時系列順に判定結果を記録
    for (i in 0 until n) {
        ans[i] = if (ok(userIds[i], timestamps[i])) 1 else 0
    }
    return ans
}

/**
 * 補足: LinkedHashMap(cap, 0.75f, true) を用いた最短 O(1) LRU キャッシュ実装
 */
class FastLruCache<K, V>(private val cap: Int) {
    private val mp = object : LinkedHashMap<K, V>(cap, 0.75f, true) {
        override fun removeEldestEntry(eldest: MutableMap.MutableEntry<K, V>?): Boolean = size > cap
    }
    fun get(k: K): V? = mp[k]
    fun put(k: K, v: V) { mp[k] = v }
}

fun main() {
    val ts = intArrayOf(1, 2, 3, 8, 12)
    val uids = intArrayOf(10, 10, 10, 10, 10)
    val res = solutionRateLimiter(ts, uids, windowSeconds = 10, maxRequests = 2)
    println("Algo11 RateLimiter result: ${res.contentToString()} (Expected: [1, 1, 0, 0, 1])")
}
