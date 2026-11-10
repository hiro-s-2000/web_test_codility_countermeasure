// 手順 16 / 45。 左メニューの上から 16 番目です。読み終えたら、すぐ下の「領域8_文字列ウィンドウ_重複なし最長部分文字列」を開いてください。
/**
 * 領域7: 実務型ログパース＆ビジネスルール集計
 * 計算量: Time O(L log K) (L: 行数, K: ユニーク番号数), Space O(K)
 * リーダブル＆高速打鍵ポイント:
 *  - マジックナンバーを定数化 (FREE_BORDER_SEC, SEC_RATE, MIN_RATE)
 *  - 入出力レコードを小さな `data class CallLog(val num: Long, val sec: Int)` に分離
 *  - `!!` を一切使わず `toIntOrNull() ?: return null` と `lineSequence().mapNotNull` で宣言的にパース
 */
private const val FREE_BORDER_SEC = 300
private const val SEC_RATE = 3
private const val MIN_RATE = 150

private data class CallLog(val num: Long, val sec: Int)

private fun parse(raw: String): CallLog? {
    val line = raw.trim()
    val idx = line.indexOf(',')
    if (idx <= 0) return null

    val t = line.substring(0, idx).split(':')
    if (t.size != 3) return null
    val h = t[0].toIntOrNull() ?: return null
    val m = t[1].toIntOrNull() ?: return null
    val s = t[2].toIntOrNull() ?: return null

    val num = line.substring(idx + 1).replace("-", "").toLongOrNull() ?: return null
    return CallLog(num, h * 3600 + m * 60 + s)
}

private fun cost(sec: Int): Int =
    if (sec < FREE_BORDER_SEC) sec * SEC_RATE else ((sec + 59) / 60) * MIN_RATE

fun solutionPhoneBill(S: String): Int {
    // 1. ガード節
    if (S.isBlank()) return 0

    // 2. Sequence + mapNotNull で安全にパースし、番号ごとの総秒数 dur と総料金 fee を集計
    val dur = HashMap<Long, Int>()
    val fee = HashMap<Long, Int>()

    for (log in S.lineSequence().mapNotNull { parse(it) }) {
        dur[log.num] = (dur[log.num] ?: 0) + log.sec
        fee[log.num] = (fee[log.num] ?: 0) + cost(log.sec)
    }
    if (dur.isEmpty()) return 0

    // 3. 最長通話の番号 (同秒数なら数値が最小の番号) を特定し、それ以外の料金を合算
    var freeNum = -1L
    var mxDur = -1
    for ((num, d) in dur) {
        if (d > mxDur || (d == mxDur && num < freeNum)) {
            mxDur = d
            freeNum = num
        }
    }

    return fee.entries.sumOf { (num, f) -> if (num == freeNum) 0 else f }
}

fun main() {
    val sampleLog = """
        00:01:07,400-234-090
        00:05:01,701-080-080
        00:05:00,400-234-090
    """.trimIndent()
    println("Algo07 PhoneBill result: ${solutionPhoneBill(sampleLog)} (Expected: 900)")
}
