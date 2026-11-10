// 手順 23 / 45。 左メニューの上から 23 番目です。読み終えたら、すぐ下の「領域14_Android実装_ViewModelとCoroutines状態遷移テンプレート」を開いてください。
import kotlin.math.max

/**
 * 【領域13：Codility Bugfixing（バグ修正問題）頻出8パターン実戦ドリル】
 *
 * ■ 鉄則：
 *   - 問題文の「Modify at most 1〜3 lines」を絶対に守ること（全書き換えは0点）。
 *   - 元の変数名を一切変えず、バグがある行だけをピンポイントで直す。
 */
object BugfixingDrills {

    /**
     * Drill 1: 最頻値（最も多く出現する要素）を返す関数【at most 1 line】
     * - バグ原因: 全要素が1回ずつしか出ない場合（例: [10, 20, 30]）、if (count[A[i]] > 0) に入らず
     *   index が -1 のままになり return A[-1] で ArrayIndexOutOfBoundsException になる。
     * - 修正箇所: `var index = -1` → `var index = 0`
     */
    fun fixMostFrequent(M: Int, A: IntArray): Int {
        val N = A.size
        val count = IntArray(M + 1)
        var maxOccurence = 1
        var index = 0 // ✅ 修正: var index = -1 -> var index = 0
        for (i in 0 until N) {
            if (count[A[i]] > 0) {
                val tmp = count[A[i]]
                if (tmp > maxOccurence) {
                    maxOccurence = tmp
                    index = i
                }
                count[A[i]] = tmp + 1
            } else {
                count[A[i]] = 1
            }
        }
        return A[index]
    }

    /**
     * Drill 2: ソート済み配列の二分探索【at most 2 lines】
     * - バグ原因: `val m = (l + r) / 2` で切り捨てられるのに `l = m` としているため、
     *   2要素（l=0, r=1）のとき m=0 となり無限ループ（TLE）になる。
     * - 修正箇所: `val m = (l + r + 1) / 2`（上側丸めに変更）
     */
    fun fixBinarySearch(A: IntArray, X: Int): Int {
        val N = A.size
        if (N == 0) return -1
        var l = 0
        var r = N - 1
        while (l < r) {
            val m = (l + r + 1) / 2 // ✅ 修正: (l + r) / 2 -> (l + r + 1) / 2
            if (A[m] > X) {
                r = m - 1
            } else {
                l = m
            }
        }
        if (A[l] == X) return l
        return -1
    }

    /**
     * Drill 3: 1〜K のすべての数値が配列 A に含まれているか判定【at most 2 lines】
     * - バグ原因: A = [1, 1, 3], K = 2 のように A[0] が 1 でない場合や A[n-1] > K の場合を見落とす。
     * - 修正箇所: 最後の return 条件を `A[0] == 1 && A[n - 1] == K` に修正。
     */
    fun fixContainsAllOneToK(A: IntArray, K: Int): Boolean {
        val n = A.size
        for (i in 0 until n - 1) {
            if (A[i] + 1 < A[i + 1]) return false
        }
        return A[0] == 1 && A[n - 1] == K // ✅ 修正: if (A[0] != 1 && A[n-1] != K) の論理バグを修正
    }

    /**
     * Drill 4: コインを1枚裏返したときの隣接ペア最大一致数【at most 2 lines】
     */
    fun fixCoinFlipAdjacency(A: IntArray): Int {
        val n = A.size
        var result = 0
        for (i in 0 until n - 1) {
            if (A[i] == A[i + 1]) result += 1
        }
        var r = if (n > 1) -1 else 0 // ✅ 修正: 全て同じ面のときに1枚裏返すと1減るケースを考慮
        for (i in 0 until n) {
            var count = 0
            if (i > 0) {
                if (A[i - 1] != A[i]) count += 1 else count -= 1
            }
            if (i < n - 1) {
                if (A[i + 1] != A[i]) count += 1 else count -= 1
            }
            r = max(r, count)
        }
        return result + r
    }
}

fun main() {
    println("Drill 1 (MostFrequent): ${BugfixingDrills.fixMostFrequent(3, intArrayOf(1, 2, 3))}")
    println("Drill 2 (BinarySearch): ${BugfixingDrills.fixBinarySearch(intArrayOf(1, 2, 5, 9, 9), 5)}")
    println("Drill 3 (Contains 1..K): ${BugfixingDrills.fixContainsAllOneToK(intArrayOf(1, 1, 2, 3, 3), 3)}")
    println("Drill 4 (CoinFlip): ${BugfixingDrills.fixCoinFlipAdjacency(intArrayOf(1, 1, 1))}")
}
