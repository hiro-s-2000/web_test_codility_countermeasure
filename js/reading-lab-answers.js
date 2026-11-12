/* Answer code for the reading lab. Each answer passes the task's sample tests in Kotlite
   (class-based tasks are shown only). Written for study; read it, then retype it yourself. */
window.LAB_ANSWERS = {
 "unpaired": {
  "code": "fun solution(A: IntArray): Int {\n    var acc = 0\n    // 同じ値どうしは XOR で 0 になる\n    for (x in A) {\n        acc = acc xor x\n    }\n    return acc\n}\n",
  "notes": [
   "XOR は同じ値どうしで 0 になるので、全部を XOR すると奇数回の値だけが残る",
   "偶数回の値は打ち消し合い、順序も関係ない（XOR は交換・結合できる）",
   "計算量は O(N) 時間、O(1) 追加メモリ",
   "要素は 1e9 以下で Int に収まり、XOR は桁が増えないので Long は不要"
  ]
 },
 "passing": {
  "code": "fun solution(A: IntArray): Int {\n    var cnt = 0     // ここまでに見た東行き(0)の数\n    var ans = 0L    // すれ違う組の数\n    for (x in A) {\n        if (x == 0) {\n            cnt++\n        } else {\n            ans += cnt  // 西行きごとに、西側の東行きの数を足す\n            if (ans > 1000000000L) return -1\n        }\n    }\n    return ans.toInt()\n}\n",
  "notes": [
   "左から順に見て、0 の数を数えておき、1 に出会うたびにその時点の 0 の数を答えに足す。",
   "全体を 1 回走査するだけなので計算量は O(N)。",
   "組の数は最大で約 25 億になり Int を超えるので、合計は Long で持つ。",
   "10 億を超えた時点で -1 を返せば、以降の計算は不要。"
  ]
 },
 "window": {
  "code": "fun solution(K: Int, A: IntArray): Int {\n    var best = A.size + 1 // 届かない印\n    var sum = 0L // 窓の和（Long で桁あふれを防ぐ）\n    var l = 0\n    for (r in 0 until A.size) {\n        sum += A[r] // 右端を伸ばす\n        while (sum >= K) {\n            best = minOf(best, r - l + 1) // 長さの最小を残す\n            sum -= A[l] // 左端を縮める\n            l++\n        }\n    }\n    return if (best > A.size) 0 else best // 一度も届かなければ 0\n}\n",
  "notes": [
   "要素がすべて正なので、右端を伸ばして和が K 以上になったら左端を縮めて最短を探す尺取り法で解ける。",
   "左端も右端も右へ進むだけなので計算量は O(N)。",
   "和は最大で 1e5 個 × 1e9 になり Int を超えるので、和は Long で持つ。",
   "届く区間が一つもないときは best が初期値 N+1 のままなので、0 を返す。"
  ]
 },
 "set1-task1": {
  "code": "fun solution(message: String, K: Int): String {\n    if (message.length <= K) return message\n    if (K < 3) return \"\"\n    var best = -1 // 選べる最長の語の終端位置\n    for (i in 0 until message.length) {\n        // スペースの手前までが「単語いくつか」\n        if (message[i] == ' ' && i + 4 <= K) best = i\n    }\n    if (best < 0) return \"...\"\n    return message.substring(0, best) + \" ...\"\n}\n",
  "notes": [
   "単語の区切り（スペース）の位置ごとに、そこまで切って「 ...」(4文字)を足しても K 以下に収まる最も後ろの位置を選ぶ",
   "全文が K 以下ならそのまま返す判定を最初に行う（K が 3 未満でも全文が収まれば message を返す）",
   "収まる区切りがなければ「...」、K が 3 未満なら空文字列を返す",
   "長さ N の走査1回なので計算量は O(N)",
   "「...」ではなく「 ...」（スペース込みで4文字）なので i + 4 <= K で判定する"
  ]
 },
 "set1-task2": {
  "code": "fun solution(timestamps: IntArray, senderIds: IntArray, windowMs: Int): Int {\n    val n = timestamps.size\n    val cnt = IntArray(100001) // 送信者ごとの窓内件数\n    var uniq = 0\n    var best = 0\n    var l = 0\n    for (r in 0 until n) {\n        if (cnt[senderIds[r]] == 0) uniq++\n        cnt[senderIds[r]]++\n        // 窓幅が windowMs を超えたら左を縮める（差は Long で計算）\n        while (timestamps[r].toLong() - timestamps[l].toLong() > windowMs.toLong()) {\n            cnt[senderIds[l]]--\n            if (cnt[senderIds[l]] == 0) uniq--\n            l++\n        }\n        if (uniq > best) best = uniq\n    }\n    return best\n}\n",
  "notes": [
   "右端を1つずつ進め、窓幅が windowMs を超えたら左端を縮める尺取り法で、窓内のユニーク送信者数の最大を取る。",
   "送信者ごとの件数を配列で持ち、0→1 でユニーク+1、1→0 で -1 する。",
   "計算量は O(N)（各メッセージは窓に1回入り1回出る）。",
   "区間は両端を含むので、差が windowMs ちょうどは窓内（超えたときだけ縮める）。",
   "時刻の差は最大10億で Int に収まるが、念のため Long で引いている。0件なら 0 を返す。"
  ]
 },
 "set1-task3": {
  "code": "fun solution(maxBatches: Int, headerOverhead: Int, payloadSizes: IntArray): Long {\n    val h = headerOverhead.toLong()\n    var lo = 0L // 最大負荷の下限（1個の最大値）\n    var hi = 0L // 上限（全部1バッチ）\n    for (p in payloadSizes) {\n        val c = p.toLong() + h // 実効サイズ\n        if (c > lo) lo = c\n        hi += c\n    }\n    while (lo < hi) {\n        val mid = (lo + hi) / 2\n        var cnt = 1\n        var cur = 0L\n        for (p in payloadSizes) {\n            val c = p.toLong() + h\n            if (cur + c > mid) { // 入らないので新バッチ\n                cnt++\n                cur = c\n            } else {\n                cur += c\n            }\n        }\n        if (cnt <= maxBatches) hi = mid else lo = mid + 1\n    }\n    return lo\n}\n",
  "notes": [
   "各イベントの実効サイズ(サイズ+headerOverhead)を使い、最大負荷の上限値を二分探索して、その上限で maxBatches 個以内に収まる最小値を探す。",
   "判定は先頭から貪欲に詰め、入らなくなったら新しいバッチにする。バッチ数が maxBatches 以下なら上限を下げる。",
   "計算量は O(N log(合計))。探索範囲は「実効サイズの最大値」から「全部の合計」まで。",
   "合計は最大 約1e14 で Int を超えるので、実効サイズも探索値も Long で持つ。"
  ]
 },
 "set2-task1": {
  "code": "fun solution(S: String): Int {\n    val st = IntArray(S.length + 1)\n    var n = 0 // スタックの要素数\n    for (t in S.split(\" \")) {\n        if (t.isEmpty()) continue\n        if (t == \"POP\") {\n            if (n < 1) return -1\n            n--\n        } else if (t == \"DUP\") {\n            if (n < 1) return -1\n            st[n] = st[n - 1]\n            n++\n        } else if (t == \"+\" || t == \"-\") {\n            if (n < 2) return -1\n            val a = st[n - 1]\n            val b = st[n - 2]\n            val r = if (t == \"+\") a + b else a - b\n            if (r < 0 || r > 1048575) return -1\n            n -= 2\n            st[n] = r\n            n++\n        } else {\n            // 数字だけで 0..1048575 以外（-5, +5, 2000000 など）は不正\n            if (t.length > 7) return -1\n            var v = 0\n            for (c in t) {\n                val d = c.code - 48\n                if (d < 0 || d > 9) return -1\n                v = v * 10 + d\n            }\n            if (v > 1048575) return -1\n            st[n] = v\n            n++\n        }\n    }\n    return if (n == 0) -1 else st[n - 1]\n}\n",
  "notes": [
   "配列をスタックに見立て、コマンドを先頭から順に実行する。エラー条件（要素不足・和が1048575超・差が負・数値が0..1048575の範囲外や数字以外）に当たったら即 -1 を返す。",
   "各コマンドは O(1) なので全体で時間 O(N)、スタック用配列は S.length+1 で足りるので空間 O(N)。",
   "引き算は「一番上 - その次」の順。逆にすると例1や例4が合わない。",
   "空文字列や最後にスタックが空の場合も -1。最大値は 1048575+1048575 でも Int に収まるので Long は不要。"
  ]
 },
 "set2-task2": {
  "code": "fun solution(startTimes: IntArray, endTimes: IntArray, bandwidths: IntArray): Long {\n    val n = startTimes.size\n    // イベントを Long 1本に詰める: (時刻*2+種別)*131072+添字。種別 開始=0, 終了=1\n    val ev = LongArray(2 * n)\n    for (i in 0 until n) {\n        ev[2 * i] = (startTimes[i].toLong() * 2) * 131072L + i\n        ev[2 * i + 1] = (endTimes[i].toLong() * 2 + 1) * 131072L + i\n    }\n    ev.sort()\n    var cur = 0L\n    var best = 0L\n    for (e in ev) {\n        val i = (e % 131072L).toInt()\n        val isEnd = (e / 131072L) % 2L == 1L\n        if (isEnd) {\n            cur -= bandwidths[i]\n        } else {\n            cur += bandwidths[i]\n            if (cur > best) best = cur\n        }\n    }\n    return best\n}\n",
  "notes": [
   "開始で帯域を足し、終了で引くイベントを時刻順に処理し、足した直後の合計の最大を答えにする（スイープライン）。",
   "閉区間なので同時刻では終了より開始を先に処理する。時刻*2+種別（開始0・終了1）で並べるとそれが自然に守られる。",
   "時刻・種別・添字を1つの Long に詰めて LongArray を sort するので O(N log N)、空間 O(N)。",
   "合計は最大 1e5*1e9=1e14 で Int を超えるので Long が必要。N=0 のときは 0 を返す。"
  ]
 },
 "set2-task3": {
  "code": "fun solution(canvas: Array<IntArray>): Long {\n    val h = canvas.size\n    val w = canvas[0].size\n    val seen = BooleanArray(h * w)\n    val stack = IntArray(h * w) // 自前スタックで再帰を避ける\n    var best = 0L\n    for (s in 0 until h * w) {\n        if (seen[s] || canvas[s / w][s % w] == 0) continue\n        var sum = 0L\n        var top = 0\n        stack[top++] = s\n        seen[s] = true\n        while (top > 0) {\n            val cur = stack[--top]\n            val r = cur / w\n            val c = cur % w\n            sum += canvas[r][c]\n            if (r > 0 && !seen[cur - w] && canvas[r - 1][c] > 0) { seen[cur - w] = true; stack[top++] = cur - w }\n            if (r < h - 1 && !seen[cur + w] && canvas[r + 1][c] > 0) { seen[cur + w] = true; stack[top++] = cur + w }\n            if (c > 0 && !seen[cur - 1] && canvas[r][c - 1] > 0) { seen[cur - 1] = true; stack[top++] = cur - 1 }\n            if (c < w - 1 && !seen[cur + 1] && canvas[r][c + 1] > 0) { seen[cur + 1] = true; stack[top++] = cur + 1 }\n        }\n        if (sum > best) best = sum\n    }\n    return best\n}\n",
  "notes": [
   "上下左右でつながった不透明マスを自前スタックで塗りつぶしながら合計し、パーツごとの合計の最大を取る。",
   "各マスは入るとき seen にして1回だけスタックに積むので、時間・空間とも O(H×W)。",
   "再帰を使わないので H×W=200000 でも StackOverflowError にならない。",
   "合計は最大でも約5100万で Int に収まるが、戻り値が Long なので Long で持つ。不透明マスがなければ best の初期値 0 を返す。"
  ]
 },
 "set3-task1": {
  "code": "fun solution(clientVersion: String, minRequiredVersion: String): Int {\n    val a = clientVersion.split(\".\")\n    val b = minRequiredVersion.split(\".\")\n    val n = maxOf(a.size, b.size)\n    for (i in 0 until n) {\n        // 足りない末尾は 0 とみなす。整数化で先頭のゼロも消える\n        val x = if (i < a.size) a[i].toIntOrNull() ?: 0 else 0\n        val y = if (i < b.size) b[i].toIntOrNull() ?: 0 else 0\n        if (x < y) return -1\n        if (x > y) return 1\n    }\n    return 0\n}\n",
  "notes": [
   "ドットで分けて、左のセグメントから整数として順に比べ、差が出た時点で -1 か 1 を返す。最後まで同じなら 0。",
   "足りない末尾は 0 とみなすので、長い方の個数まで回す。",
   "文字列のまま比べると \"9\" > \"10\" になるので、必ず整数にして比べる。\"02\" も 2 になる。",
   "各値は 10億以下で Int に収まる。計算量は O(長さ)。"
  ]
 },
 "set3-task2": {
  "code": "fun solution(heights: IntArray): Int {\n    val st = IntArray(heights.size) // 単調増加スタック\n    var top = 0\n    var cnt = 0\n    for (h in heights) {\n        // 今より高い長方形はここで終わる\n        while (top > 0 && st[top - 1] > h) top--\n        // 同じ高さなら延長、低ければ新しく1個\n        if (top == 0 || st[top - 1] < h) {\n            st[top] = h\n            top++\n            cnt++\n        }\n    }\n    return cnt\n}\n",
  "notes": [
   "左から見て、スタックに「いま続いている長方形の高さ」を積み、現在の高さより高いものは捨て、同じ高さなら延長、足りなければ新しい長方形を1個足す",
   "各要素は高々1回 push / pop されるので時間 O(N)、スタック用の配列で追加領域 O(N)",
   "つまずきやすいのは「同じ高さは数えない」点。pop したあとに top の高さと比べ直す"
  ]
 },
 "set3-task3": {
  "code": "fun solution(maxMemoryBytes: Int, imageKeys: IntArray, imageBytes: IntArray): Int {\n    val n = imageKeys.size\n    val stamp = HashMap<Int, Int>() // キー -> 最後にアクセスした位置(-1 は未格納)\n    val size = HashMap<Int, Int>()  // キー -> バイト数\n    val q = IntArray(n)             // アクセス位置の履歴(古い順)\n    var head = 0\n    var tail = 0\n    var total = 0L\n    var hits = 0\n    for (i in 0 until n) {\n        val k = imageKeys[i]\n        if ((stamp[k] ?: -1) >= 0) {\n            hits++\n            stamp[k] = i\n            q[tail++] = i\n            continue\n        }\n        val b = imageBytes[i]\n        if (b > maxMemoryBytes) continue // 大きすぎるので格納しない\n        while (total + b > maxMemoryBytes) {\n            val j = q[head++]\n            val kj = imageKeys[j]\n            // 最新のアクセス位置と一致するものだけが本物の最古\n            if (stamp[kj] == j) {\n                total -= size[kj]!!\n                stamp[kj] = -1 // -1 は「キャッシュに無い」印\n            }\n        }\n        stamp[k] = i\n        size[k] = b\n        total += b\n        q[tail++] = i\n    }\n    return hits\n}\n",
  "notes": [
   "キャッシュ内のキーを最後にアクセスした位置で管理し、履歴キューの先頭から古い順に退避すれば LRU になる。",
   "ヒット時はキューに新しい位置を足し、古い位置は残す。退避時に最新位置と一致しない項目は読み飛ばす（遅延削除）。",
   "各位置は高々1回ずつ push / pop されるので時間 O(N)、領域も O(N)。",
   "容量超えの画像は格納せずスキップし、ヒットにも数えない。合計は Int だと溢れうるので Long で持つ。"
  ]
 },
 "set4-task1": {
  "code": "fun solution(\n    itemHeights: IntArray,\n    viewportTop: LongArray,\n    viewportBottom: LongArray\n): IntArray {\n    val n = itemHeights.size\n    // p[i] = アイテム i の上端 Y（p[n] は全体の高さ）\n    val p = LongArray(n + 1)\n    for (i in 0 until n) p[i + 1] = p[i] + itemHeights[i]\n    val res = IntArray(viewportTop.size)\n    for (q in viewportTop.indices) {\n        // p[k] < x を満たす k の個数を二分探索で求める\n        val cnt = IntArray(2)\n        for (t in 0..1) {\n            val x = if (t == 0) viewportBottom[q] else viewportTop[q] + 1\n            var lo = 0\n            var hi = n + 1\n            while (lo < hi) {\n                val mid = (lo + hi) / 2\n                if (p[mid] < x) lo = mid + 1 else hi = mid\n            }\n            cnt[t] = lo\n        }\n        val started = minOf(n, cnt[0]) // 上端が bottom より上のアイテム数\n        val ended = cnt[1] - 1         // 下端が top 以下のアイテム数\n        res[q] = started - ended\n    }\n    return res\n}\n",
  "notes": [
   "アイテムの上端の累積和 p を作り、「bottom より前に始まる個数」から「top 以前に終わる個数」を引くと重なる個数になる。",
   "半開区間なので、始まりは p[i] < bottom、終わりは p[i+1] <= top（p[k] < top+1）で判定する。",
   "累積和は最大 10^5 × 10^5 = 10^10 で Int を超えるため LongArray にする。",
   "前処理 O(N)、各クエリ二分探索 O(log N)、全体 O(N + M log N)、領域 O(N)。"
  ]
 },
 "set4-task2": {
  "code": "fun less(a: String, b: String): Boolean {\n    var i = 0\n    while (i < a.length && i < b.length) {\n        if (a[i].code != b[i].code) return a[i].code < b[i].code\n        i++\n    }\n    return a.length < b.length\n}\n\nfun solution(uri: String): String {\n    // フラグメント除去\n    val h = uri.indexOf('#')\n    val noFrag = if (h >= 0) uri.substring(0, h) else uri\n    val q = noFrag.indexOf('?')\n    if (q < 0) return \"\"\n    val map = HashMap<String, String>()\n    val keys = mutableListOf<String>()\n    for (part in noFrag.substring(q + 1).split(\"&\")) {\n        val e = part.indexOf('=')\n        if (e <= 0) continue // 空要素・=無し・keyが空は無視\n        val k = part.substring(0, e)\n        if (k.length >= 4 && k.substring(0, 4) == \"utm_\") continue\n        if (!map.containsKey(k)) keys.add(k)\n        map[k] = part.substring(e + 1) // 後勝ち\n    }\n    // key を ASCII 昇順に挿入ソート\n    for (i in 1 until keys.size) {\n        val t = keys[i]\n        var j = i - 1\n        while (j >= 0 && less(t, keys[j])) {\n            keys[j + 1] = keys[j]\n            j--\n        }\n        keys[j + 1] = t\n    }\n    val sb = StringBuilder()\n    for (k in keys) {\n        if (sb.length > 0) sb.append(\"&\")\n        sb.append(k).append(\"=\").append(map[k])\n    }\n    return sb.toString()\n}\n",
  "notes": [
   "# で切ってフラグメントを捨て、最初の ? 以降を & で分け、key=value を HashMap に入れて後勝ちにし、utm_ 始まりを除いて key を昇順に連結する。",
   "最初の = だけで key と value を分けるので、value に = が含まれても壊れない。= の位置が 0 なら key が空なので無視する。",
   "key= （value が空）は有効なので残す。? が無ければ空文字を返す。",
   "練習実行器は sorted が使えないので挿入ソートにしている。本物の Kotlin なら keys.sorted() で O(K log K) になり、全体 O(L log K)。"
  ]
 },
 "set4-task3": {
  "code": "fun solution(N: Int, prerequisite: IntArray, dependent: IntArray): IntArray {\n    val M = prerequisite.size\n    val start = IntArray(N + 1)\n    val indeg = IntArray(N)\n    for (k in 0 until M) {\n        start[prerequisite[k] + 1]++\n        indeg[dependent[k]]++\n    }\n    for (i in 0 until N) start[i + 1] += start[i]\n    val pos = IntArray(N)\n    val to = IntArray(M)\n    for (k in 0 until M) {\n        val u = prerequisite[k]\n        to[start[u] + pos[u]] = dependent[k]\n        pos[u]++\n    }\n    // 配列で作る最小ヒープ\n    val heap = IntArray(N)\n    var size = 0\n    val res = IntArray(N)\n    var cnt = 0\n    for (i in 0 until N) {\n        if (indeg[i] == 0) {\n            var c = size\n            size++\n            while (c > 0 && heap[(c - 1) / 2] > i) {\n                heap[c] = heap[(c - 1) / 2]\n                c = (c - 1) / 2\n            }\n            heap[c] = i\n        }\n    }\n    while (size > 0) {\n        val u = heap[0]\n        size--\n        val last = heap[size]\n        var p = 0\n        while (p * 2 + 1 < size) {\n            var c = p * 2 + 1\n            if (c + 1 < size && heap[c + 1] < heap[c]) c++\n            if (heap[c] >= last) break\n            heap[p] = heap[c]\n            p = c\n        }\n        heap[p] = last\n        res[cnt] = u\n        cnt++\n        for (e in start[u] until start[u + 1]) {\n            val v = to[e]\n            indeg[v]--\n            if (indeg[v] == 0) {\n                var c = size\n                size++\n                while (c > 0 && heap[(c - 1) / 2] > v) {\n                    heap[c] = heap[(c - 1) / 2]\n                    c = (c - 1) / 2\n                }\n                heap[c] = v\n            }\n        }\n    }\n    return if (cnt == N) res else IntArray(0)\n}\n",
  "notes": [
   "入次数0のタスクを最小ヒープに入れ、番号が最小のものから取り出して実行し、後続の入次数を減らす（トポロジカルソート）。",
   "全N個を取り出せなければ残りがサイクルなので空配列を返す。",
   "時間は O((N+M) log N)、空間は O(N+M)。再帰を使わないので StackOverflow は起きない。",
   "辺は配列（CSR形式）で持ち、ヒープも IntArray で自作している。M=0 でも全タスクが番号順に並ぶ。"
  ]
 },
 "set5-task1": {
  "code": "import kotlin.math.max\n\nfun solution(A: IntArray): Int {\n    var maxSpan = 0\n    var currentSpan = 0\n    for (i in 0 until A.size) { // 修正: 先頭(0番目)から数える\n        if (A[i] == 1) {\n            currentSpan += 1\n        } else {\n            maxSpan = max(maxSpan, currentSpan)\n            currentSpan = 0\n        }\n    }\n    return max(maxSpan, currentSpan) // 修正: 末尾が1で終わる場合も最大を取る\n}\n",
  "notes": [
   "1 の連続長を数え、0 が来るたびに最大値を更新してリセットする。バグは2か所で、直すのはその2行だけ。",
   "1つ目: ループが 1 から始まり A[0] を見ていない。0 から始めるように直す（[1] が 0 になる原因）。",
   "2つ目: 0 で更新する作りなので、末尾が 1 で終わると最後の連続が反映されない。return で max を取り直す（[1, 0, 1, 1] が 1 になる原因）。",
   "計算量は時間 O(N)、空間 O(1)。"
  ]
 },
 "set5-task2": {
  "code": "fun solution(T: IntArray, C: IntArray, D: Int): Int {\n    val last = HashMap<Int, Int>() // チャンネルごとの前回の配信成功時刻\n    var cnt = 0\n    for (i in 0 until T.size) {\n        val p = last[C[i]]\n        if (p == null || T[i] - p >= D) {\n            cnt++\n            last[C[i]] = T[i] // 成功したときだけ更新\n        }\n    }\n    return cnt\n}\n",
  "notes": [
   "チャンネルごとに前回の配信成功時刻を HashMap に持ち、初回か差が D 以上なら成功として数える。",
   "抑制した通知では時刻を更新しない。更新すると次の判定がずれる。",
   "計算量は O(N)。N が 0 のときはループが回らず 0 を返す。",
   "T と D は最大 10億で、差も Int に収まるのでオーバーフローしない。"
  ]
 },
 "set5-task3": {
  "code": "fun solution(K: Int, S: IntArray): Long {\n    var lo = 0L // 最大の1個\n    var hi = 0L // 全体の合計\n    for (x in S) {\n        if (x > lo) lo = x.toLong()\n        hi += x\n    }\n    // 上限 m を二分探索\n    while (lo < hi) {\n        val m = (lo + hi) / 2\n        var cnt = 1\n        var cur = 0L\n        for (x in S) {\n            if (cur + x > m) { // 超えるので新しいバッチ\n                cnt++\n                cur = 0L\n            }\n            cur += x\n        }\n        if (cnt <= K) hi = m else lo = m + 1\n    }\n    return lo\n}\n",
  "notes": [
   "最大合計の上限 m を決めると、前から詰めて何バッチ要るか貪欲に数えられるので、m を二分探索する。",
   "バッチ数が K 以下なら m は可能なので hi = m、足りなければ lo = m + 1。探索範囲は「最大の1個」から「全体の合計」まで。",
   "計算量は時間 O(N log(合計))、空間 O(1)。",
   "合計は最大 10^13 で Int を超えるので、合計と cur と m は Long で持つ。"
  ]
 },
 "set5-task4": {
  "code": "import androidx.lifecycle.ViewModel\nimport androidx.lifecycle.viewModelScope\nimport kotlinx.coroutines.CancellationException\nimport kotlinx.coroutines.CoroutineDispatcher\nimport kotlinx.coroutines.Dispatchers\nimport kotlinx.coroutines.Job\nimport kotlinx.coroutines.flow.MutableStateFlow\nimport kotlinx.coroutines.flow.StateFlow\nimport kotlinx.coroutines.launch\n\nclass ArticleSearchViewModel(\n    private val repository: ArticleRepository,\n    private val dispatcher: CoroutineDispatcher = Dispatchers.Main\n) : ViewModel() {\n    private val _uiState = MutableStateFlow<SearchUiState>(SearchUiState.Idle)\n    val uiState: StateFlow<SearchUiState> = _uiState\n\n    private val cache = mutableMapOf<String, List<Article>>()\n    private var job: Job? = null\n\n    fun onQuerySubmitted(rawQuery: String, forceRefresh: Boolean = false) {\n        val q = rawQuery.trim()\n        // 短すぎる: 進行中の検索を止めてエラー\n        if (q.length < 2) {\n            job?.cancel()\n            _uiState.value = SearchUiState.Error(q, \"Query too short\")\n            return\n        }\n        // キャッシュヒット: Loading なし・通信なし\n        val cached = cache[q]\n        if (cached != null && !forceRefresh) {\n            job?.cancel()\n            _uiState.value = if (cached.isEmpty()) SearchUiState.Empty(q)\n            else SearchUiState.Content(q, cached, fromCache = true)\n            return\n        }\n        job?.cancel() // 古い検索をキャンセル\n        _uiState.value = SearchUiState.Loading\n        job = viewModelScope.launch(dispatcher) {\n            try {\n                val list = repository.searchArticles(q)\n                cache[q] = list\n                _uiState.value = if (list.isEmpty()) SearchUiState.Empty(q)\n                else SearchUiState.Content(q, list, fromCache = false)\n            } catch (e: CancellationException) {\n                throw e // キャンセルは再スロー\n            } catch (e: Exception) {\n                _uiState.value = SearchUiState.Error(q, e.message ?: \"Network error\")\n            }\n        }\n    }\n\n    fun clearCache() {\n        cache.clear()\n        _uiState.value = SearchUiState.Idle\n    }\n}\n",
  "notes": [
   "考え方: 正規化したクエリをキーに結果を Map へ保存し、ヒット時は通信せず即表示、ミス時は古い Job をキャンセルして Loading から取得する。",
   "2文字未満は通信せず進行中の Job もキャンセルして Error にする（\" a \" は trim 後 \"a\" で Error）。",
   "キャッシュは成功時のみ保存する。0件の結果も保存するので、ヒット時は Empty を出す。",
   "CancellationException を先に捕まえて再スローしないと協調キャンセルが壊れる。その後に Exception を処理する。",
   "キャッシュ検索は O(1)。clearCache は Map を空にして Idle に戻す。"
  ]
 },
 "set5-task5": {
  "code": "class ResilientAuthInterceptor(\n    private val auth: AuthSessionManager\n) : Interceptor {\n    override fun intercept(chain: Interceptor.Chain): Response {\n        val req = chain.request()\n        val token = auth.getCurrentToken()\n        // 現在のトークンがあれば Authorization を上書きで付ける\n        val sent = if (!token.isNullOrEmpty()) withToken(req, token) else req\n        val first = chain.proceed(sent)\n        return when (first.code) {\n            401 -> {\n                val newToken = auth.refreshToken()\n                if (newToken.isNullOrEmpty()) {\n                    auth.onSessionExpired()\n                    first\n                } else {\n                    first.close()\n                    val retry = chain.proceed(withToken(req, newToken))\n                    if (retry.code == 401) auth.onSessionExpired()\n                    retry\n                }\n            }\n            503 -> {\n                first.close()\n                chain.proceed(sent) // 最初に送ったのと同じリクエストを1回だけ再試行\n            }\n            else -> first\n        }\n    }\n\n    private fun withToken(req: Request, token: String): Request =\n        req.newBuilder()\n            .header(\"Authorization\", \"Bearer $token\") // header() は上書き\n            .build()\n}\n",
  "notes": [
   "最初のレスポンスの code で分岐し、401 ならトークン更新して 1 回だけ再リクエスト、503 なら同じリクエストを 1 回だけ再試行する。",
   "ヘッダは addHeader でなく header() を使う。header() は同名ヘッダを上書きする。",
   "503 の再試行は最初に送った（Authorization 付きの）リクエストをそのまま使う。リトライ前に最初のレスポンスを close() する。更新失敗時は first を返すので close しない。",
   "onSessionExpired() は更新トークンが空のときと、リトライ後も 401 のときのどちらでも 1 回だけ呼ぶ。",
   "proceed は各経路で高々 2 回で、ループはないので無限リトライにならない。"
  ]
 },
 "area1": {
  "code": "fun solution(S: String, P: IntArray, Q: IntArray): IntArray {\n    val n = S.length\n    if (n == 0 || P.isEmpty()) return IntArray(0)\n    // a, c, g[i] = S の先頭 i 文字に含まれる A, C, G の数\n    val a = IntArray(n + 1)\n    val c = IntArray(n + 1)\n    val g = IntArray(n + 1)\n    for (i in 0 until n) {\n        a[i + 1] = a[i] + (if (S[i] == 'A') 1 else 0)\n        c[i + 1] = c[i] + (if (S[i] == 'C') 1 else 0)\n        g[i + 1] = g[i] + (if (S[i] == 'G') 1 else 0)\n    }\n    val res = IntArray(P.size)\n    for (k in 0 until P.size) {\n        val l = P[k]\n        val r = Q[k] + 1\n        res[k] = if (a[r] - a[l] > 0) 1\n        else if (c[r] - c[l] > 0) 2\n        else if (g[r] - g[l] > 0) 3\n        else 4\n    }\n    return res\n}\n",
  "notes": [
   "A・C・G それぞれの累積個数を作っておけば、区間内にその文字があるかが引き算1回で分かる。",
   "小さい影響度から A, C, G の順に調べ、最初に見つかったものが最小。どれもなければ 4（T）。",
   "累積配列は長さ n+1 にして、区間 [P, Q] は prefix[Q+1] - prefix[P] で数える（Q+1 に注意）。",
   "S が空、または区間 0 件のときは先に空配列を返す。計算量は前処理 O(n)、質問 1 件あたり O(1)。"
  ]
 },
 "area2": {
  "code": "fun solution(A: IntArray, B: IntArray): Int {\n    val st = IntArray(A.size) // 右へ泳ぐ魚の大きさのスタック\n    var top = 0\n    var left = 0 // 左へ抜けた魚の数\n    for (i in 0 until A.size) {\n        if (B[i] == 1) {\n            st[top] = A[i]\n            top++\n        } else {\n            // 同じ大きさ以下なら左へ泳ぐ魚が勝つ\n            while (top > 0 && st[top - 1] <= A[i]) {\n                top--\n            }\n            if (top == 0) left++ // 全部倒したら左へ抜ける\n        }\n    }\n    return left + top\n}\n",
  "notes": [
   "右へ泳ぐ魚をスタックに積み、左へ泳ぐ魚が来たら、スタック上の自分以下の魚を順に食べる。",
   "スタックを空にできたら、その魚は左へ抜けて残る。大きい魚が残っていれば自分が食べられる。",
   "同じ大きさのときは左へ泳ぐ魚が残るので、比較は < でなく <= にする。",
   "最後は、左へ抜けた数とスタックに残った数の合計。各魚は1回しか出入りしないので O(N)。"
  ]
 },
 "area3": {
  "code": "fun solution(A: IntArray): Int {\n    if (A.isEmpty()) return 0\n    var cur = A[0]  // 今の位置で終わる最大和\n    var best = A[0]\n    for (i in 1 until A.size) {\n        cur = maxOf(A[i], cur + A[i])  // 続けるか、ここから始め直すか\n        best = maxOf(best, cur)\n    }\n    return best\n}\n",
  "notes": [
   "各位置で終わる最大和を持ち、前の和を足すより自分1個の方が大きければそこから始め直す（Kadane法）",
   "配列を1回なめるだけなので計算量は O(N)、追加メモリは O(1)",
   "初期値を 0 にすると全部が負のとき 0 になってしまうので、A[0] から始める",
   "空配列は先に 0 を返す"
  ]
 },
 "area4": {
  "code": "fun solution(K: Int, M: Int, A: IntArray): Int {\n    if (A.isEmpty()) return 0\n    var lo = 0L\n    var hi = 0L\n    for (x in A) {\n        if (x > lo) lo = x.toLong() // 下限は最大要素\n        hi += x // 上限は全部の和（Long で桁あふれ防止）\n    }\n    while (lo < hi) {\n        val mid = (lo + hi) / 2\n        // mid を上限にしたとき、何区間いるか数える\n        var cnt = 1\n        var sum = 0L\n        for (x in A) {\n            if (sum + x > mid) {\n                cnt++\n                sum = x.toLong()\n            } else {\n                sum += x\n            }\n        }\n        if (cnt <= K) hi = mid else lo = mid + 1\n    }\n    return lo.toInt()\n}\n",
  "notes": [
   "区間和の最大 mid を二分探索で決め、mid 以下で K 区間以内に収まる最小の mid が答え。",
   "判定は先頭から貪欲に足し、mid を超えそうなら新しい区間を始めて数える。",
   "探索範囲は最大要素から全部の和まで。K が要素数以上なら最大要素、K=1 なら全部の和になる。",
   "和と mid は Long で持つ（総和が Int を超えるため）。計算量は O(N log(和))。A が空なら 0、M は使わない。"
  ]
 },
 "area5": {
  "code": "fun solution(A: IntArray): Int {\n    val n = A.size\n    val open = IntArray(n)   // 位置 p で始まる円盤の数\n    val close = IntArray(n)  // 位置 p で終わる円盤の数\n    for (i in 0 until n) {\n        val s = if (A[i] > i) 0 else i - A[i]  // 左端（0 で切る）\n        val e = if (A[i] >= n - 1 - i) n - 1 else i + A[i]  // 右端（n-1 で切る）\n        open[s]++\n        close[e]++\n    }\n    var cnt = 0L\n    var active = 0L\n    for (p in 0 until n) {\n        val o = open[p].toLong()\n        cnt += o * active + o * (o - 1) / 2  // 開いている円盤との組と、同時に始まる円盤どうしの組\n        if (cnt > 10000000L) return -1\n        active += o\n        active -= close[p]  // 接する組も数えるため、終了は数えた後に引く\n    }\n    return cnt.toInt()\n}\n",
  "notes": [
   "左から位置を見て、円盤が始まるたびに「いま開いている円盤の数」だけ組が増える。終了は数えた後に引くので、端が接する組も入る",
   "端は 0 と n-1 で切っても重なりは変わらない。i - A[i] や i + A[i] のあふれも防げる",
   "open/close を数えるだけなので O(n)。並べ替えは不要",
   "組の数は最大 n(n-1)/2 で Int を超えうるので Long で数え、1000万を超えたら -1"
  ]
 },
 "area6": {
  "code": "fun solution(N: Int, U: IntArray, V: IntArray): Int {\n    if (N <= 0) return 0\n    val p = IntArray(N)\n    for (i in 0 until N) p[i] = i\n    var cnt = N\n    for (i in 0 until U.size) {\n        // 根を探す（ループで。経路を半分に縮める）\n        var a = U[i]\n        while (p[a] != a) {\n            p[a] = p[p[a]]\n            a = p[a]\n        }\n        var b = V[i]\n        while (p[b] != b) {\n            p[b] = p[p[b]]\n            b = p[b]\n        }\n        if (a != b) {\n            p[a] = b\n            cnt--\n        }\n    }\n    return cnt\n}\n",
  "notes": [
   "最初は点の数だけかたまりがあると考え、線で別々のかたまりが結ばれるたびに 1 つ減らす（Union-Find）。",
   "各点の親を配列 p に持ち、根（p[x] == x の点）が同じかどうかで同じかたまりか判定する。",
   "再帰を使わず while で根をたどるので、線が長くつながっても深い再帰にならない。",
   "計算量はほぼ O(N + 線の数)。N が 0 以下は 0、線なしは N のまま返る。"
  ]
 },
 "area7": {
  "code": "fun solution(S: String): Int {\n    val dur = HashMap<Long, Int>()\n    val fee = HashMap<Long, Int>()\n    for (raw in S.split(\"\\n\")) {\n        val line = raw.trim()\n        val c = line.indexOf(\",\")\n        if (c <= 0) continue\n        val t = line.substring(0, c).split(\":\")\n        if (t.size != 3) continue\n        val h = t[0].toIntOrNull() ?: -1\n        val m = t[1].toIntOrNull() ?: -1\n        val s = t[2].toIntOrNull() ?: -1\n        // ハイフンで分けてつなぎ直す\n        var digits = \"\"\n        for (p in line.substring(c + 1).split(\"-\")) digits += p\n        val num = digits.toLongOrNull() ?: -1L\n        if (h < 0 || m < 0 || s < 0 || num < 0) continue\n        val sec = h * 3600 + m * 60 + s\n        // 1本ごとの料金\n        val cost = if (sec < 300) sec * 3 else (sec + 59) / 60 * 150\n        dur[num] = (dur[num] ?: 0) + sec\n        fee[num] = (fee[num] ?: 0) + cost\n    }\n    // 最長の番号（同じなら小さい番号）を探す\n    var free = -1L\n    var best = -1\n    for ((k, d) in dur) {\n        if (d > best || (d == best && k < free)) {\n            best = d\n            free = k\n        }\n    }\n    var ans = 0\n    for ((k, f) in fee) {\n        if (k != free) ans += f\n    }\n    return ans\n}\n",
  "notes": [
   "番号ごとに秒数と料金を通話1本ずつ計算して足し、合計秒数が最長の番号（同点なら数値が小さい方）だけ除いて料金を合計する",
   "料金は通話1本ごとに決める（300秒未満は秒×3、以上は (秒+59)/60 の切り上げ分×150）。合計秒数で決めないのがつまずきどころ",
   "番号はハイフンを除いて Long にする。先頭の 0 が消えるので 000-000-009 と 9 は同じ番号になる",
   "読めない行（コンマ無し、時刻や番号が数字でない）は continue で飛ばす。読める行がなければ 0",
   "計算量は行数 L に対し O(L + K)（K は番号の種類数）"
  ]
 },
 "area8": {
  "code": "fun solution(S: String): Int {\n    val last = HashMap<Char, Int>() // 文字 -> 最後に出た位置\n    var left = 0\n    var best = 0\n    for (i in 0 until S.length) {\n        val c = S[i]\n        val p = last[c]\n        if (p != null && p >= left) left = p + 1 // 窓内で重複したら左端を進める\n        last[c] = i\n        best = maxOf(best, i - left + 1)\n    }\n    return best\n}\n",
  "notes": [
   "右端を1つずつ進め、同じ文字が窓の中に出たら左端をその次の位置へ進める（スライディングウィンドウ）。窓の長さの最大が答え。",
   "各文字の最後の位置を HashMap に覚えるので、計算量は O(N)。",
   "つまずき: 重複した位置が left より左（窓の外）なら無視する。p >= left の判定を忘れると left が戻ってしまう。",
   "空文字は best=0、1文字は 1 のまま返る。"
  ]
 },
 "area9a": {
  "code": "fun solution(A: IntArray, B: IntArray): Int {\n    var count = 0\n    var lastEnd = 0\n    var first = true\n    for (i in 0 until A.size) {\n        // 直前に選んだ終点より後ろから始まる区間だけ選ぶ（接するのも不可なので >）\n        if (first || A[i] > lastEnd) {\n            count++\n            lastEnd = B[i]\n            first = false\n        }\n    }\n    return count\n}\n",
  "notes": [
   "終点が小さい順に見て、直前に選んだ区間の終点より後ろから始まる区間を取っていくと最大本数になる（貪欲法）。",
   "端が接する区間も選べないので、比較は A[i] >= lastEnd ではなく A[i] > lastEnd。",
   "最初の1本は無条件で選ぶ。first フラグを使うのは、座標が 0 以下でも壊れないようにするため。",
   "B が整列済みなので1回走査するだけで、計算量は O(N)。空や1本ならそのまま 0 や 1 を返す。"
  ]
 },
 "area9b": {
  "code": "fun solution(K: Int, A: IntArray): Int {\n    if (A.isEmpty() || K <= 0) return 0\n    var sum = 0L // 足し込みでの桁あふれを避ける\n    var count = 0\n    for (a in A) {\n        sum += a\n        if (sum >= K) { // K 以上で 1 本完成\n            count++\n            sum = 0L\n        }\n    }\n    return count\n}\n",
  "notes": [
   "左から順に長さを足し、合計が K 以上になった時点で 1 本と数えて合計を 0 に戻す（早く区切るほど後ろに多く残せる貪欲法）",
   "配列を 1 回なめるだけなので計算量は O(N)、追加メモリは O(1)",
   "A が空、または K が 0 以下なら先に 0 を返す。K が 0 以下だと毎回完成扱いになってしまうため",
   "合計は K 未満の値に A[i] を足すだけだが、Int の上限に近い値だと一周しうるので Long で持つ",
   "最後に K 未満のあまりが残っても本数には数えない"
  ]
 },
 "area10": {
  "code": "fun solution(A: Array<IntArray>): Int {\n    val h = A.size\n    if (h == 0) return 0\n    val w = A[0].size\n    if (w == 0) return 0\n    val seen = BooleanArray(h * w)\n    val dr = intArrayOf(1, -1, 0, 0)\n    val dc = intArrayOf(0, 0, 1, -1)\n    var count = 0\n    for (r in 0 until h) {\n        for (c in 0 until w) {\n            if (seen[r * w + c]) continue\n            count++\n            // 未訪問のマスから同じ数を stack でたどる\n            val st = ArrayDeque<Int>()\n            seen[r * w + c] = true\n            st.addLast(r * w + c)\n            while (st.isNotEmpty()) {\n                val cur = st.removeLast()\n                val cr = cur / w\n                val cc = cur % w\n                for (d in 0 until 4) {\n                    val nr = cr + dr[d]\n                    val nc = cc + dc[d]\n                    if (nr < 0 || nr >= h || nc < 0 || nc >= w) continue\n                    if (seen[nr * w + nc] || A[nr][nc] != A[r][c]) continue\n                    seen[nr * w + nc] = true\n                    st.addLast(nr * w + nc)\n                }\n            }\n        }\n    }\n    return count\n}\n",
  "notes": [
   "未訪問のマスを見つけるたびに地域を1つ数え、同じ数のマスを上下左右にたどって訪問済みにする（再帰を使わず stack で探索）。",
   "各マスは1回ずつしか訪問されないので、計算量は O(行数×列数)。",
   "斜めは隣と数えないので、移動方向は上下左右の4つだけ。",
   "行が0、または幅が0のときは先に 0 を返す。"
  ]
 },
 "area11": {
  "code": "fun solution(timestamps: IntArray, userIds: IntArray, windowSeconds: Int, maxRequests: Int): IntArray {\n    val n = timestamps.size\n    val res = IntArray(n)\n    if (maxRequests <= 0) return res\n    // 利用者ごとに、許可した依頼の時刻を古い順に持つ\n    val map = HashMap<Int, ArrayDeque<Int>>()\n    for (i in 0 until n) {\n        val now = timestamps[i]\n        val q = map.getOrPut(userIds[i]) { ArrayDeque<Int>() }\n        // now - windowSeconds 以下の古い依頼を外す\n        while (q.size > 0 && q.first() <= now - windowSeconds) {\n            q.removeFirst()\n        }\n        if (q.size < maxRequests) {\n            res[i] = 1\n            q.addLast(now)\n        }\n    }\n    return res\n}\n",
  "notes": [
   "利用者ごとに許可した依頼の時刻をキューで持ち、now - windowSeconds 以下の古いものを先頭から外してから、件数が maxRequests 未満なら 1 にして追加する。",
   "拒否した依頼(0)はキューに入れないので、数えるのは許可した依頼だけ。",
   "時刻は昇順なので、外すのは先頭からだけでよく、各依頼は高々1回入って1回出る。全体で O(n)。",
   "境界は「now - windowSeconds 以下を外す」(ちょうど境界の時刻は含めない)。maxRequests が 0 以下なら全部 0、依頼 0 件なら空配列。"
  ]
 },
 "area12a": {
  "code": "fun solution(N: Int): Int {\n    if (N <= 0) return 0\n    var count = 0\n    var i = 1\n    // i*i <= N の範囲だけ調べる（i と N/i が対）\n    while (i.toLong() * i <= N) {\n        if (N % i == 0) {\n            count++\n            // i と N/i が同じ（平方数）なら二重に数えない\n            if (i != N / i) count++\n        }\n        i++\n    }\n    return count\n}\n",
  "notes": [
   "約数は i と N/i の対で現れるので、i を √N まで調べて、見つけるたびに2個（平方数の √N だけ1個）数える",
   "計算量は O(√N)。1 から N まで全部調べると O(N) で遅い",
   "N が 0 以下は 0。N=1 は i=1 で1個だけ数える（1 == 1/1 なので二重にならない）",
   "i*i は Int だと大きな N でオーバーフローするので、Long に変えて比べる"
  ]
 },
 "area12b": {
  "code": "fun solution(N: Int, M: Int): Int {\n    if (N <= 0 || M <= 0) return 0\n    // ユークリッドの互除法で最大公約数を求める\n    var a = N\n    var b = M\n    while (b != 0) {\n        val t = a % b\n        a = b\n        b = t\n    }\n    // 食べる個数は N / gcd(N, M)\n    return N / a\n}\n",
  "notes": [
   "M 個ずつ進むと 0 から数えて N / gcd(N, M) 個目で 0 に戻るので、その値が食べる個数になる。",
   "gcd はユークリッドの互除法（a % b を繰り返す）で求める。計算量は O(log N)。",
   "N か M が 0 以下のときは先に 0 を返す。M が N より大きくても、互除法はそのまま正しく動く。",
   "N=1, M=1 のときは gcd が 1 で 1 / 1 = 1 個。シミュレーションでも書けるが、O(N) かかるので式の方が速い。"
  ]
 },
 "bug1": {
  "code": "fun solution(M: Int, A: IntArray): Int {\n    val N = A.size\n    val count = IntArray(M + 1)\n    var maxOccurence = 1\n    var index = 0 // 修正: -1 だと全部1回のとき A[-1] で落ちる\n    for (i in 0 until N) {\n        if (count[A[i]] > 0) {\n            val tmp = count[A[i]]\n            if (tmp > maxOccurence) {\n                maxOccurence = tmp\n                index = i\n            }\n            count[A[i]] = tmp + 1\n        } else {\n            count[A[i]] = 1\n        }\n    }\n    return A[index]\n}\n",
  "notes": [
   "バグは index の初期値が -1 のこと。どの値も2回以上出ないと更新されず、A[-1] を読んで失敗するので 0（先頭）にする。",
   "直すのは初期値の1行だけ。他のロジックは触らない。",
   "各値の出現回数を IntArray で数えるので、計算量は O(N + M)。",
   "空配列だと A[0] も読めないが、問題文は A が1個以上の前提。"
  ]
 },
 "bug2": {
  "code": "fun solution(A: IntArray, X: Int): Int {\n    val N = A.size\n    if (N == 0) return -1\n    var l = 0\n    var r = N - 1\n    while (l < r) {\n        val m = (l + r + 1) / 2 // 修正: 中央を上側に寄せる\n        if (A[m] > X) {\n            r = m - 1\n        } else {\n            l = m\n        }\n    }\n    if (A[l] == X) return l\n    return -1\n}\n",
  "notes": [
   "l = m と進める二分探索では、中央を上側に寄せて (l + r + 1) / 2 にしないと、範囲が2個のとき m == l になって l が進まず無限ループする。",
   "A[m] > X なら答えは m より左なので r = m - 1、そうでなければ X 以下の最後の位置を探して l = m。",
   "ループ後に A[l] == X を確認し、違えば -1。空配列は先に -1 を返す。",
   "計算量は O(log N)。"
  ]
 },
 "bug3": {
  "code": "fun solution(A: IntArray, K: Int): Boolean {\n    val n = A.size\n    for (i in 0 until n - 1) {\n        if (A[i] + 1 < A[i + 1]) return false\n    }\n    if (A[0] != 1 || A[n - 1] != K) return false // 修正: && を || に\n    return true\n}\n",
  "notes": [
   "隣との飛びがなく、先頭が 1 で末尾が K なら true。先頭か末尾のどちらかが違えば false になる。",
   "バグは && で、「先頭が 1 でない」かつ「末尾が K でない」の両方が揃わないと false にならなかった。|| にして片方だけでも false にする。",
   "1 回走査するだけなので計算量は O(N)。",
   "A が空だと A[0] で落ちるので、N は 1 以上という前提で書いている。"
  ]
 },
 "bug4": {
  "code": "fun solution(A: IntArray): Int {\n    val n = A.size\n    if (n <= 1) return 0 // 修正: 1枚以下は 0\n    var result = 0\n    for (i in 0 until n - 1) {\n        if (A[i] == A[i + 1]) result += 1\n    }\n    var r = -2 // 修正: 0 だと減る場合を選べない。変化は最小でも -2\n    for (i in 0 until n) {\n        var count = 0\n        if (i > 0) {\n            if (A[i - 1] != A[i]) count += 1 else count = count - 1\n        }\n        if (i < n - 1) {\n            if (A[i + 1] != A[i]) count += 1 else count = count - 1\n        }\n        r = maxOf(r, count)\n    }\n    return result + r\n}\n",
  "notes": [
   "今の一致数に、1枚を裏返したときの増減の最大を足す。増減は左右の隣で、違う面なら +1、同じ面なら -1。",
   "必ず1枚は裏返すので、増減の初期値を 0 にしてはいけない。全部同じ面だと端でも -1 になる。",
   "増減は最小でも -2 なので、初期値は -2 にする。",
   "1枚以下は隣がなく、裏返しの意味もないので先に 0 を返す。計算量は O(n)。"
  ]
 },
 "area14": {
  "code": "import java.util.concurrent.CancellationException\nimport java.util.concurrent.ConcurrentHashMap\n\nprivate const val MIN_LEN = 2\n\ndata class ArticleItem(val id: Long, val title: String)\n\nsealed interface SearchUiState {\n    object Idle : SearchUiState\n    object Loading : SearchUiState\n    data class Content(\n        val query: String,\n        val articles: List<ArticleItem>,\n        val fromCache: Boolean\n    ) : SearchUiState\n    data class Empty(val query: String) : SearchUiState\n    data class Error(val query: String, val message: String) : SearchUiState\n}\n\ninterface ArticleSearchRepository {\n    fun search(query: String): List<ArticleItem>\n}\n\nclass SearchPresenterTemplate(private val repo: ArticleSearchRepository) {\n    private val mp = ConcurrentHashMap<String, List<ArticleItem>>()\n\n    var st: SearchUiState = SearchUiState.Idle\n        private set // 外から代入させない\n\n    fun onQueryChanged(raw: String) {\n        val q = raw.trim()\n        if (q.length < MIN_LEN) {\n            st = SearchUiState.Idle\n            return\n        }\n        // 保存済みなら Loading を挟まず返す\n        val hit = mp[q]\n        if (hit != null) {\n            st = if (hit.isEmpty()) SearchUiState.Empty(q)\n            else SearchUiState.Content(q, hit, fromCache = true)\n            return\n        }\n        st = SearchUiState.Loading\n        try {\n            val res = repo.search(q).toList() // コピーして保存\n            mp[q] = res\n            st = if (res.isEmpty()) SearchUiState.Empty(q)\n            else SearchUiState.Content(q, res, fromCache = false)\n        } catch (e: CancellationException) {\n            throw e // 取り消しは Error にしない\n        } catch (e: Exception) {\n            st = SearchUiState.Error(q, e.message ?: \"Unknown error\")\n        }\n    }\n\n    fun clearCache() {\n        mp.clear()\n        st = SearchUiState.Idle\n    }\n}\n",
  "notes": [
   "入力を trim して短ければ Idle、保存済みなら Loading なしで即返し、未保存なら Loading のあと検索して保存する",
   "外には st だけ公開し、private set で外からの代入を防ぐ。状態は sealed interface で種類を分ける",
   "保存するリストは toList() でコピーし、元のリストが後で変わっても保存内容が変わらないようにする",
   "CancellationException は先に catch して再スローする。順番を逆にすると Exception に拾われて Error になる",
   "保存済み判定は hit != null で見る。空リストも保存済みなので isEmpty では判定しない"
  ]
 },
 "area15": {
  "code": "const val UNAUTH = 401\nconst val MIN_PASS = 8\n\ninterface AuthSessionStore {\n    fun getAccessToken(): String?\n    fun refreshAccessToken(): String?\n    fun onSessionExpired()\n}\n\ndata class MockHttpRequest(val url: String, val headers: Map<String, String> = emptyMap()) {\n    fun withHeader(k: String, v: String) = copy(headers = headers + (k to v))\n}\n\ndata class MockHttpResponse(val code: Int, var isClosed: Boolean = false) {\n    fun close() { isClosed = true }\n}\n\nfun interface MockChain {\n    fun proceed(request: MockHttpRequest): MockHttpResponse\n}\n\nclass AuthRetryInterceptorTemplate(private val store: AuthSessionStore) {\n    private val lock = Any()\n\n    fun intercept(chain: MockChain, req0: MockHttpRequest): MockHttpResponse {\n        val tok = store.getAccessToken()\n        val req = if (!tok.isNullOrBlank()) req0.withHeader(\"Authorization\", \"Bearer $tok\") else req0\n        val res = chain.proceed(req)\n        if (res.code != UNAUTH) return res // 401 以外はそのまま返す\n\n        synchronized(lock) {\n            val cur = store.getAccessToken()\n            // 他スレッドが更新済みならそれを使い、なければ取り直す\n            val nxt = if (cur != null && cur != tok) cur else store.refreshAccessToken()\n            if (nxt.isNullOrBlank()) {\n                store.onSessionExpired()\n                return res // 最初の応答を返す\n            }\n            res.close() // 再送の前に閉じる\n            return chain.proceed(req0.withHeader(\"Authorization\", \"Bearer $nxt\"))\n        }\n    }\n}\n\nclass LoginFormValidatorTemplate {\n    var email = \"\"\n        private set\n    var pass = \"\"\n        private set\n    var isSubmitEnabled = false\n        private set\n\n    fun onEmailChanged(v: String) { email = v; sync() }\n    fun onPasswordChanged(v: String) { pass = v; sync() }\n\n    private fun sync() { isSubmitEnabled = okEmail(email) && okPass(pass) }\n\n    private fun okEmail(s: String): Boolean {\n        val at = s.indexOf('@')\n        if (at <= 0 || at != s.lastIndexOf('@')) return false // @ は1つで先頭でない\n        val dom = s.substring(at + 1)\n        val dot = dom.lastIndexOf('.')\n        return dot > 0 && dot < dom.length - 1 // ドットはドメインの端でない\n    }\n\n    private fun okPass(s: String) =\n        s.length >= MIN_PASS && s.any { it.isUpperCase() } && s.any { it.isDigit() }\n}\n",
  "notes": [
   "401 のときだけトークンを取り直して 1 回だけ再送し、再送の前に 401 の応答を close() する。取り直しが空なら期限切れを通知して最初の応答を返す。",
   "同時に複数の 401 が来ても、synchronized の中で現在のトークンが変わっていれば再取得せずそれを使い、二重リフレッシュを防ぐ。",
   "再送は 1 回だけで、再送先の応答は 401 でもそのまま返すので無限ループにならない。",
   "メールは @ が 1 つ・先頭でない・@ の後ろのドットが端でない、の 3 条件。パスワードは 8 文字以上で大文字と数字を含む。",
   "送信可否は入力のたびに sync() で両方を再判定する。最初は空なので false になる。"
  ]
 },
 "area16a": {
  "code": "fun solution(N: Int, prereq: IntArray, target: IntArray): Boolean {\n    if (N <= 1 || prereq.size == 0) return true\n    val m = prereq.size\n    // 入次数と、辺リスト（連結リスト形式）を作る\n    val indeg = IntArray(N)\n    val head = IntArray(N) { -1 }\n    val next = IntArray(m)\n    for (k in 0 until m) {\n        next[k] = head[prereq[k]]\n        head[prereq[k]] = k\n        indeg[target[k]]++\n    }\n    // 入次数 0 の作業をキューに入れる\n    val q = IntArray(N)\n    var qs = 0\n    var qe = 0\n    for (i in 0 until N) {\n        if (indeg[i] == 0) { q[qe] = i; qe++ }\n    }\n    while (qs < qe) {\n        val u = q[qs]\n        qs++\n        var e = head[u]\n        while (e != -1) {\n            val v = target[e]\n            indeg[v]--\n            if (indeg[v] == 0) { q[qe] = v; qe++ }\n            e = next[e]\n        }\n    }\n    return qe == N // 全部取り出せれば輪はない\n}\n",
  "notes": [
   "入次数 0 の作業から順に終えていき（トポロジカルソート）、N 個全部取り出せれば true、輪があって取り出せなければ false。",
   "再帰を使わず、配列のキューで回すのでスタックの深さを気にしなくてよい。",
   "計算量は作業数 N と指定数 M に対して O(N + M)。",
   "N が 1 以下、または指定が空なら何も縛られないので先に true を返す。"
  ]
 },
 "area16b": {
  "code": "fun solution(H: IntArray, topY: Long, bottomY: Long): Int {\n    if (H.isEmpty() || bottomY <= topY) return 0\n    var start = 0L // 項目の開始位置（Long で桁あふれ防止）\n    var cnt = 0\n    for (h in H) {\n        val end = start + h\n        // [start, end) と [topY, bottomY) が重なる条件\n        if (h > 0 && start < bottomY && end > topY) cnt++\n        if (start >= bottomY) break // 以降は範囲の下\n        start = end\n    }\n    return cnt\n}\n",
  "notes": [
   "各項目の範囲 [start, end) が [topY, bottomY) と重なるのは、start < bottomY かつ end > topY のとき。",
   "先頭から高さを足して start を更新し、start が bottomY 以上になったら以降は重ならないので打ち切る。",
   "高さの合計は Int を超えうるので start は Long で持つ。端が接するだけ（50 で終わる、230 から始まる）は数えない。",
   "計算量は O(N)、追加メモリは O(1)。"
  ]
 }
};
