// 手順 9 / 45。 左メニューの上から 9 番目です。読み終えたら、すぐ下の「領域1_累積和_DNA区間最小影響度」を開いてください。
/**
 * ❌ AIが生成しがちな典型NGコード例
 * ・問題文の英単語をそのまま繋げた長い変数名（eastBoundVehiclesCount, totalPassingCarsPairs）
 * ・エッジケースのガード節がない
 * ・32bit Int のままで加算しており、大規模ケースでオーバーフローするリスクがある
 */
fun solution(A: IntArray): Int {
    var eastBoundVehiclesCount = 0
    var totalPassingCarsPairs = 0
    for (currentVehicleIndex in A.indices) {
        if (A[currentVehicleIndex] == 0) {
            eastBoundVehiclesCount++
        } else {
            totalPassingCarsPairs += eastBoundVehiclesCount
            if (totalPassingCarsPairs > 1000000000) return -1
        }
    }
    return totalPassingCarsPairs
}
