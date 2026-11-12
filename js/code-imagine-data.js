/* Code-envisioning training data for all 42 ReadingLab tasks.
   Trains reading English/Japanese statements without copy-pasting and
   immediately mapping problem signals -> algorithm pattern -> traps -> Kotlin skeleton. */
(function (root) {
  "use strict";

  var PATTERNS = {
    xor_math: "XOR相殺・整数論（約数√N / GCD互除法）",
    prefix_count: "1パス累積カウント・累積和配列（Prefix Sum）",
    sliding_window: "尺取り法・スライディングウィンドウ（右端for＋左端while）",
    binary_answer: "答えで二分探索＋先頭から貪欲判定（while lo < hi）",
    binary_index: "累積座標＋境界インデックス二分探索",
    stack_mono: "配列スタック・単調スタック（IntArray＋top）",
    sweep_greedy: "イベントソート（平面走査）・区間貪欲法",
    grid_graph: "非再帰グリッド探索・Union-Find・トポロジカルソート",
    string_parse: "文字列の区切り解析＋HashMap集計・整列",
    cache_queue: "HashMap＋キューによる時刻窓・遅延削除LRU制御",
    bugfix: "Bugfixing（全書き換え禁止・1〜2箇所の初期値/境界修正）",
    android_arch: "Android実務設計（StateFlow状態遷移 / OkHttp認証リトライ）"
  };

  var TRAPS = {
    long_sum: "合計・積・組数が Int 上限(約21億)を超えるため Long (0L / toLong()) が必須",
    int_safe_edge: "Int で収まるが、空・0件・K未満・符号などの早期リターン境界が急所",
    interval_bound: "閉区間(<=)か半開区間(<)・接する端を含むかの比較演算子1文字が急所",
    state_lifecycle: "キャンセル再スロー(CancellationException)やリトライ前の close()・ロック制御が急所",
    bug_minimal: "ロジック全体を書き直さず、初期値・ループ開始位置・&&/||・中点切り上げだけ直す"
  };

  /* 24 high-frequency English phrases in Codility statements -> instant mental translation & Kotlin cue */
  var GLOSSARY = [
    { en: "contiguous slice / subarray", ja: "連続する部分配列（飛び飛び不可）", kt: "尺取り法 (for r + while l) / Kadane法 / 累積和" },
    { en: "at least K / at most K", ja: "K 以上 (>= K) / K 以下 (<= K)", kt: "比較演算子の = 抜けに注意" },
    { en: "minimize the maximum ...", ja: "最大値の最小化（バッチ分割など）", kt: "答えで二分探索: while (lo < hi) { val mid = (lo + hi) / 2 }" },
    { en: "inclusive [A, B]", ja: "両端を含む閉区間", kt: "差 <= W / 同時刻は開始を終了より先に処理" },
    { en: "half-open [A, B)", ja: "始端を含み終端を含まない半開区間", kt: "重なり判定: start < bottom && end > top" },
    { en: "occurs an odd number of times", ja: "奇数回出現する", kt: "全要素の XOR: acc = acc xor x" },
    { en: "pairs (P, Q) such that P < Q", ja: "左と右の順序付きペア", kt: "左の個数 cnt を数え、右を見るたび ans(Long) += cnt" },
    { en: "within the range [1..1,000,000,000]", ja: "要素最大10億（足すとIntあふれ）", kt: "合計・積は必ず var sum = 0L / x.toLong()" },
    { en: "returns -1 if ... exceeds ...", ja: "上限超過時は -1 を返す", kt: "ループ内で if (ans > LIMIT) return -1" },
    { en: "non-overlapping intervals", ja: "重ならない区間選択", kt: "終端昇順で A[i] > lastEnd (または >=) の貪欲法" },
    { en: "simultaneously active / peak", ja: "同時アクティブのピーク値", kt: "開始+・終了- のイベント配列を sort して走査" },
    { en: "4-directionally connected", ja: "上下左右4連結（斜めは別）", kt: "再帰禁止！IntArray/ArrayDeque スタック + seen 配列" },
    { en: "prerequisite / cycle", ja: "先行タスク依存・サイクル検知", kt: "入次数 indeg 配列 + キューでトポロジカルソート" },
    { en: "least recently used (LRU)", ja: "最も古くアクセスされたものを退避", kt: "HashMap(最新位置) + 履歴キューで遅延削除" },
    { en: "lexicographical / ASCII order", ja: "辞書順（文字コード昇順）", kt: "数値比較は toInt()、キー順は辞書順ソート" },
    { en: "leading zeros", ja: "先頭のゼロ（\"02\" や \"009\"）", kt: "整数変換 (toInt / toLong) で自然に吸収" },
    { en: "divisors / factors of N", ja: "N の約数", kt: "while (i.toLong() * i <= N) で対 (i, N/i) を数える" },
    { en: "circular / modulo N", ja: "円環・周期 N", kt: "ユークリッドの互除法 gcd(N, M) → N / gcd" },
    { en: "cooldown / rate limit window", ja: "クールダウン・直近時間枠制限", kt: "キー別 HashMap(前回時刻 or ArrayDeque) で O(N)" },
    { en: "modify at most ... lines", ja: "最大数行だけ修正（Bugfixing）", kt: "全面書き直し厳禁！初期値・0始まり・末尾処理を確認" }
  ];

  var DATA = {
    "unpaired": {
      pattern: "xor_math",
      signal: "「odd number of times（奇数回が1種類だけ）」「N up to 1,000,000」→ HashMap不要、同じ値どうしが 0 に消える XOR 1パス O(N)・O(1)",
      trap: "int_safe_edge",
      trapWhy: "XOR はビット演算なので桁あふれせず Int で安全。N=1 のときも 0 xor A[0] = A[0] でそのまま成立。",
      blueprint: [
        "// 1. acc = 0 を用意",
        "// 2. 全要素を acc = acc xor x（偶数回は0に消える）",
        "// 3. 残った acc を return"
      ],
      blocks: [
        { label: "累積変数の初期化", code: "var acc = 0" },
        { label: "配列を先頭から走査", code: "for (x in A) {" },
        { label: "XORで同じ値ペアを相殺", code: "    acc = acc xor x\n}" },
        { label: "奇数回だけ残った値を返す", code: "return acc" }
      ]
    },
    "passing": {
      pattern: "prefix_count",
      signal: "「0が東、1が西」「smaller index（0が左・1が右の組数）」→ 二重ループ O(N²) はNG。左から 0 の台数 cnt を数え、1 で ans に足す O(N)",
      trap: "long_sum",
      trapWhy: "N=100,000 で前半0・後半1だと最大 25億組になり Int をあふれる。ans は 0L (Long) で持ち、10億超で即 return -1。",
      blueprint: [
        "// 1. 東行き cnt = 0, 組数 ans = 0L (Long)",
        "// 2. x == 0 なら cnt++、x == 1 なら ans += cnt",
        "// 3. ans > 1_000_000_000L なら即 -1、最後に ans.toInt()"
      ],
      blocks: [
        { label: "東行きカウンタとLong合計の初期化", code: "var cnt = 0\nvar ans = 0L" },
        { label: "左(西)から1台ずつ走査し東行きを数える", code: "for (x in A) {\n    if (x == 0) cnt++" },
        { label: "西行きが来たら東行きの台数分を加算＆上限判定", code: "    else {\n        ans += cnt\n        if (ans > 1000000000L) return -1\n    }\n}" },
        { label: "Intに戻して返す", code: "return ans.toInt()" }
      ]
    },
    "window": {
      pattern: "sliding_window",
      signal: "「positive integers（全要素が正）」「contiguous slice（連続部分）」「sum at least K の最短長」→ 単調性があるので尺取り法 O(N)",
      trap: "long_sum",
      trapWhy: "要素最大10億×10万個で窓の和 sum が Int を超えるため sum = 0L が必須。一度も届かないときは best > A.size で 0 を返す。",
      blueprint: [
        "// 1. best = N + 1, sum = 0L, 左端 l = 0",
        "// 2. 右端 r で sum += A[r]",
        "// 3. while (sum >= K) で best 更新 → sum -= A[l++] で縮める",
        "// 4. 未達なら 0、届けば best"
      ],
      blocks: [
        { label: "未達印 N+1 と Long窓和・左端 l の初期化", code: "var best = A.size + 1\nvar sum = 0L\nvar l = 0" },
        { label: "右端 r を1つ進めて和に足す", code: "for (r in 0 until A.size) {\n    sum += A[r]" },
        { label: "和が K 以上のあいだ最短長を更新して左端を縮める", code: "    while (sum >= K) {\n        best = minOf(best, r - l + 1)\n        sum -= A[l]\n        l++\n    }\n}" },
        { label: "一度も届かなければ 0 を返す", code: "return if (best > A.size) 0 else best" }
      ]
    },
    "set1-task1": {
      pattern: "string_parse",
      signal: "「単語境界（スペース位置）で切る」「末尾に ' ...'（4文字）を足して K 以下で最長」→ 全文 <= K と K < 3 を先に弾き、スペース位置 i で i + 4 <= K の最大位置を拾う",
      trap: "int_safe_edge",
      trapWhy: "先に message.length <= K を判定しないと、K=2 で長さ2の文字列まで空文字にしてしまう。「 ...」はスペース込み4文字（i + 4 <= K）。",
      blueprint: [
        "// 1. 全文 <= K ならそのまま return、K < 3 なら \"\"",
        "// 2. スペース位置 i で i + 4 <= K を満たす最後の best を記録",
        "// 3. best < 0 なら \"...\"、あれば substring(0, best) + \" ...\""
      ],
      blocks: [
        { label: "全文収まる場合と K < 3 のガード節", code: "if (message.length <= K) return message\nif (K < 3) return \"\"" },
        { label: "収まる最後のスペース位置 best を走査", code: "var best = -1\nfor (i in 0 until message.length) {\n    if (message[i] == ' ' && i + 4 <= K) best = i\n}" },
        { label: "1単語も入らない場合は \"...\"", code: "if (best < 0) return \"...\"" },
        { label: "最長の単語区切り＋\" ...\" を返す", code: "return message.substring(0, best) + \" ...\"" }
      ]
    },
    "set1-task2": {
      pattern: "sliding_window",
      signal: "「timestamps は昇順」「区間 [T, T+windowMs] 内のユニーク送信者数の最大」→ 時間窓の尺取り法＋出現回数配列 cnt で 0↔1 遷移を数える O(N)",
      trap: "interval_bound",
      trapWhy: "閉区間 [T, T+windowMs] なので差がちょうど windowMs は窓内（> windowMs のときだけ左端を縮める）。時刻差は念のため Long で引く。",
      blueprint: [
        "// 1. cnt配列で送信者別件数、uniq=0, best=0, l=0",
        "// 2. 右端 r を入れ 0→1 で uniq++",
        "// 3. 差 > windowMs の間 左端 l を出し 1→0 で uniq--",
        "// 4. 毎回 best = maxOf(best, uniq)"
      ],
      blocks: [
        { label: "送信者カウント配列と窓ポインタの初期化", code: "val cnt = IntArray(100001)\nvar uniq = 0; var best = 0; var l = 0" },
        { label: "右端 r を窓に追加（初登場なら uniq++）", code: "for (r in 0 until timestamps.size) {\n    if (cnt[senderIds[r]] == 0) uniq++\n    cnt[senderIds[r]]++" },
        { label: "窓幅を超えた分だけ左端 l を外す", code: "    while (timestamps[r].toLong() - timestamps[l].toLong() > windowMs.toLong()) {\n        if (--cnt[senderIds[l]] == 0) uniq--\n        l++\n    }" },
        { label: "最大ユニーク数を更新して返す", code: "    if (uniq > best) best = uniq\n}\nreturn best" }
      ]
    },
    "set1-task3": {
      pattern: "binary_answer",
      signal: "「順序を保った連続バッチ」「maxBatches 個以内」「最大バッチ負荷を最小化」→ 典型『最大値の最小化』＝答えの上限 mid で二分探索 O(N log Σ)",
      trap: "long_sum",
      trapWhy: "実効サイズ c = payload + headerOverhead を合計すると最大約 10^14 になるため lo, hi, mid, cur はすべて Long が必須。",
      blueprint: [
        "// 1. 実効サイズ c = p + h で lo=最大1個, hi=全合計 (Long)",
        "// 2. while (lo < hi) で上限 mid を二分探索",
        "// 3. 前から貪欲に詰め cnt <= maxBatches なら hi = mid else lo = mid + 1"
      ],
      blocks: [
        { label: "探索下限 lo(最大要素) と上限 hi(総和) を Long で算出", code: "val h = headerOverhead.toLong()\nvar lo = 0L; var hi = 0L\nfor (p in payloadSizes) { val c = p.toLong() + h; if (c > lo) lo = c; hi += c }" },
        { label: "上限 mid の二分探索ループ", code: "while (lo < hi) {\n    val mid = (lo + hi) / 2\n    var cnt = 1; var cur = 0L" },
        { label: "mid 以下で何バッチ必要か前から貪欲カウント", code: "    for (p in payloadSizes) {\n        val c = p.toLong() + h\n        if (cur + c > mid) { cnt++; cur = c } else cur += c\n    }" },
        { label: "maxBatches 以内なら上限を下げ、収束した lo を返す", code: "    if (cnt <= maxBatches) hi = mid else lo = mid + 1\n}\nreturn lo" }
      ]
    },
    "set2-task1": {
      pattern: "stack_mono",
      signal: "「空白区切りコマンド」「POP / DUP / + / -」「20ビット上限 1048575・負や要素不足は即 -1」→ IntArray スタック＋要素数 n で O(N) シミュレーション",
      trap: "int_safe_edge",
      trapWhy: "引き算の向きは「一番上 st[n-1] - その次 st[n-2]」。結果 < 0 や和 > 1048575、最後に n == 0 のときも忘れず -1 を返す。",
      blueprint: [
        "// 1. st = IntArray(S.length + 1), n = 0",
        "// 2. split(\" \") で POP / DUP / + / - / 数値 を分岐",
        "// 3. 要素不足・負・1048575超は即 return -1",
        "// 4. 最後に n == 0 なら -1、あれば st[n - 1]"
      ],
      blocks: [
        { label: "配列スタックと深さ n の初期化", code: "val st = IntArray(S.length + 1)\nvar n = 0" },
        { label: "トークン走査と POP / DUP の処理", code: "for (t in S.split(\" \")) {\n    if (t.isEmpty()) continue\n    if (t == \"POP\") { if (n < 1) return -1; n-- }\n    else if (t == \"DUP\") { if (n < 1) return -1; st[n] = st[n - 1]; n++ }" },
        { label: "+ / - の2要素取り出しと範囲チェック", code: "    else if (t == \"+\" || t == \"-\") {\n        if (n < 2) return -1\n        val r = if (t == \"+\") st[n - 1] + st[n - 2] else st[n - 1] - st[n - 2]\n        if (r < 0 || r > 1048575) return -1\n        n -= 2; st[n++] = r\n    }" },
        { label: "数値プッシュと最終トップ返却", code: "    else { val v = t.toIntOrNull() ?: return -1; if (v < 0 || v > 1048575) return -1; st[n++] = v }\n}\nreturn if (n == 0) -1 else st[n - 1]" }
      ]
    },
    "set2-task2": {
      pattern: "sweep_greedy",
      signal: "「閉区間 [start, end]」「同時にアクティブな帯域幅の最大値」→ 開始(+bw)と終了(-bw)の 2N イベントを作って時刻順にソートする平面走査法 O(N log N)",
      trap: "interval_bound",
      trapWhy: "閉区間なので同時刻 T では「開始(0)を終了(1)より先」に処理する！さらに帯域合計は最大 10^14 になるため cur, best は Long 必須。",
      blueprint: [
        "// 1. 開始(種別0)と終了(種別1)の 2N イベントを LongArray に詰め sort()",
        "// 2. 開始なら cur += bw して best 更新、終了なら cur -= bw",
        "// 3. Long の best を return"
      ],
      blocks: [
        { label: "開始(0)・終了(1)イベントを LongArray にパックして整列", code: "val n = startTimes.size\nval ev = LongArray(2 * n)\nfor (i in 0 until n) {\n    ev[2 * i] = (startTimes[i].toLong() * 2) * 131072L + i\n    ev[2 * i + 1] = (endTimes[i].toLong() * 2 + 1) * 131072L + i\n}\nev.sort()" },
        { label: "現在帯域 cur と最大値 best を Long で用意", code: "var cur = 0L\nvar best = 0L" },
        { label: "イベント順に帯域を加減し開始直後に最大値を更新", code: "for (e in ev) {\n    val i = (e % 131072L).toInt()\n    if ((e / 131072L) % 2L == 1L) cur -= bandwidths[i]\n    else { cur += bandwidths[i]; if (cur > best) best = cur }\n}" },
        { label: "ピーク帯域を返す", code: "return best" }
      ]
    },
    "set2-task3": {
      pattern: "grid_graph",
      signal: "「H×W キャンバス」「上下左右4方向で隣接する不透明マスの合計の最大」「再帰StackOverflow禁止」→ BooleanArray(seen)＋IntArray自前スタックで非再帰DFS O(HW)",
      trap: "int_safe_edge",
      trapWhy: "H×W=200,000 のため再帰 DFS は StackOverflowError で即死する。必ず配列スタックで塗りつぶし、斜めは入れず、戻り値型 Long に合わせて sum = 0L にする。",
      blueprint: [
        "// 1. seen = BooleanArray(h * w), stack = IntArray(h * w)",
        "// 2. 未訪問かつ値 > 0 のマスから while (top > 0) で4方向探索",
        "// 3. 連結成分ごとの sum(Long) の最大 best を返す"
      ],
      blocks: [
        { label: "訪問配列と自前スタック・最大値 best(Long) の準備", code: "val h = canvas.size; val w = canvas[0].size\nval seen = BooleanArray(h * w)\nval stack = IntArray(h * w)\nvar best = 0L" },
        { label: "未訪問の不透明マスを見つけたらスタック開始", code: "for (s in 0 until h * w) {\n    if (seen[s] || canvas[s / w][s % w] == 0) continue\n    var sum = 0L; var top = 0\n    stack[top++] = s; seen[s] = true" },
        { label: "whileループで上下左右4方向の隣接マスを積み合計", code: "    while (top > 0) {\n        val cur = stack[--top]; val r = cur / w; val c = cur % w\n        sum += canvas[r][c]\n        // 上下左右で未訪問かつ > 0 なら seen=true にして stack へ push\n    }" },
        { label: "パーツ合計の最大を更新して返す", code: "    if (sum > best) best = sum\n}\nreturn best" }
      ]
    },
    "set3-task1": {
      pattern: "string_parse",
      signal: "「ドット区切りのバージョン比較」「先頭ゼロ無視 (\"02\"==\"2\")」「末尾の不足セグメントは 0 扱い」→ split(\".\") して長い方のサイズまで整数比較 O(L)",
      trap: "int_safe_edge",
      trapWhy: "文字列比較だと \"9\" > \"10\" になってしまうので必ず toInt() で整数比較する。短い配列側は範囲外を 0 として補う。",
      blueprint: [
        "// 1. split(\".\") で配列 a, b に分け n = maxOf(a.size, b.size)",
        "// 2. i = 0 until n で範囲外は 0、toInt で x, y を取得",
        "// 3. x < y なら -1、x > y なら 1、最後まで同じなら 0"
      ],
      blocks: [
        { label: "ドットで分割し最大セグメント数 n を求める", code: "val a = clientVersion.split(\".\")\nval b = minRequiredVersion.split(\".\")\nval n = maxOf(a.size, b.size)" },
        { label: "左から順に整数化（不足分は 0）", code: "for (i in 0 until n) {\n    val x = if (i < a.size) a[i].toIntOrNull() ?: 0 else 0\n    val y = if (i < b.size) b[i].toIntOrNull() ?: 0 else 0" },
        { label: "大小が決まった時点で即リターン", code: "    if (x < y) return -1\n    if (x > y) return 1\n}" },
        { label: "全セグメント等しければ 0", code: "return 0" }
      ]
    },
    "set3-task2": {
      pattern: "stack_mono",
      signal: "「横並びバーを重ならない長方形の最小個数で覆う（StoneWall型）」→ 単調増加スタック：低くなったら高い長方形を pop し、同じ高さは延長、高くなったら cnt++",
      trap: "int_safe_edge",
      trapWhy: "pop し終えたあと、スタック頂上と「同じ高さ (st[top-1] == h)」なら新しい長方形を数えずそのまま延長するのが最大のポイント。",
      blueprint: [
        "// 1. 単調増加スタック st = IntArray(N), top = 0, cnt = 0",
        "// 2. 各高さ h で st[top-1] > h の間 pop (top--)",
        "// 3. 空または st[top-1] < h のときだけ push して cnt++"
      ],
      blocks: [
        { label: "単調増加スタックと長方形カウンタの初期化", code: "val st = IntArray(heights.size)\nvar top = 0\nvar cnt = 0" },
        { label: "現在のバーより高い継続長方形をすべて終了(pop)", code: "for (h in heights) {\n    while (top > 0 && st[top - 1] > h) top--" },
        { label: "同じ高さでなければ新規長方形を開始(push & cnt++)", code: "    if (top == 0 || st[top - 1] < h) {\n        st[top++] = h\n        cnt++\n    }\n}" },
        { label: "最小長方形数を返す", code: "return cnt" }
      ]
    },
    "set3-task3": {
      pattern: "cache_queue",
      signal: "「バイト容量上限」「キャッシュヒット時は最新化」「ミス時は最古(LRU)から退避」「単体で容量超えはスキップ」→ HashMap(最終アクセス位置)＋アクセス履歴キューの遅延削除 O(N)",
      trap: "long_sum",
      trapWhy: "画像1枚が maxMemoryBytes 超なら既存キャッシュを消さずスキップ！また total + b の計算はオーバーフロー防止で Long で持つ。",
      blueprint: [
        "// 1. stamp(最新位置Map), size(サイズMap), 履歴キュー q, total = 0L",
        "// 2. ヒットなら hits++ し stamp[k]=i と q に追記して continue",
        "// 3. b > max ならスキップ。total + b > max の間 q から本物の最古だけ退避",
        "// 4. 新規格納して最後に hits を return"
      ],
      blocks: [
        { label: "最新位置Map・サイズMap・履歴キューの初期化", code: "val stamp = HashMap<Int, Int>(); val size = HashMap<Int, Int>()\nval q = IntArray(imageKeys.size); var head = 0; var tail = 0\nvar total = 0L; var hits = 0" },
        { label: "キャッシュヒット時はヒット加算＆アクセス位置更新", code: "for (i in imageKeys.indices) {\n    val k = imageKeys[i]\n    if ((stamp[k] ?: -1) >= 0) { hits++; stamp[k] = i; q[tail++] = i; continue }" },
        { label: "単体容量超えスキップ＆遅延削除による最古退避", code: "    val b = imageBytes[i]\n    if (b > maxMemoryBytes) continue\n    while (total + b > maxMemoryBytes) {\n        val j = q[head++]; val kj = imageKeys[j]\n        if (stamp[kj] == j) { total -= size[kj]!!; stamp[kj] = -1 }\n    }" },
        { label: "新規格納と総ヒット数の返却", code: "    stamp[k] = i; size[k] = b; total += b; q[tail++] = i\n}\nreturn hits" }
      ]
    },
    "set4-task1": {
      pattern: "binary_index",
      signal: "「隙間なく並ぶ高さ itemHeights」「M個の表示領域クエリ [top, bottom) と重なる個数」「O(N + M log N)」→ 上端座標の累積和 LongArray＋二分探索で（bottom未満に始まる数 − top以下に終わる数）",
      trap: "interval_bound",
      trapWhy: "半開区間 [Y_i, Y_{i+1}) と [top, bottom) なので端が接するだけは重ならない！さらに高さ累積和は最大 10^10 なので LongArray が必須。",
      blueprint: [
        "// 1. 上端累積和 p = LongArray(n + 1) を前計算 O(N)",
        "// 2. 各クエリで p[k] < bottom の個数からアイテム開始数を算出",
        "// 3. p[k] <= top（つまり < top + 1）から終了済み数を引き started - ended"
      ],
      blocks: [
        { label: "アイテム上端Y座標の累積和 LongArray を構築", code: "val n = itemHeights.size\nval p = LongArray(n + 1)\nfor (i in 0 until n) p[i + 1] = p[i] + itemHeights[i]" },
        { label: "クエリ結果配列を用意し各表示範囲を処理", code: "val res = IntArray(viewportTop.size)\nfor (q in viewportTop.indices) {" },
        { label: "二分探索で bottom 未満と top+1 未満の境界位置を求める", code: "    // upperBound風二分探索で p[mid] < bottom と p[mid] < top + 1 を求める" },
        { label: "開始済みアイテム数 − 終了済みアイテム数を格納して返す", code: "    res[q] = started - ended\n}\nreturn res" }
      ]
    },
    "set4-task2": {
      pattern: "string_parse",
      signal: "「#以降フラグメント除去」「?以降のクエリを & 分割」「utm_除外・重複キーは後勝ち・ASCII昇順連結」→ # と ? で切り出し、HashMap で後勝ち上書きし、キーを昇順ソートして連結",
      trap: "int_safe_edge",
      trapWhy: "value が空の 'empty=' は有効（e > 0 ならOK）だが '=val'（e == 0）や '=' 無しは無効。最初の '=' 位置 indexOf('=') だけで切る。",
      blueprint: [
        "// 1. '#' 以降を切り捨て、'?' が無ければ \"\" を返す",
        "// 2. '&' 分割 → indexOf('=') <= 0 や \"utm_\" 始まりは continue",
        "// 3. HashMap に後勝ち保存 → キーを ASCII 昇順に並べて '&' 連結"
      ],
      blocks: [
        { label: "フラグメント '#' 除去と '?' の有無チェック", code: "val h = uri.indexOf('#')\nval noFrag = if (h >= 0) uri.substring(0, h) else uri\nval q = noFrag.indexOf('?')\nif (q < 0) return \"\"" },
        { label: "'&' 分割と無効要素・utm_ パラメータ除外、後勝ち格納", code: "val map = HashMap<String, String>()\nfor (part in noFrag.substring(q + 1).split(\"&\")) {\n    val e = part.indexOf('=')\n    if (e <= 0) continue\n    val k = part.substring(0, e)\n    if (k.startsWith(\"utm_\")) continue\n    map[k] = part.substring(e + 1)\n}" },
        { label: "残ったキーを ASCII 辞書順に整列", code: "val keys = map.keys.sorted()" },
        { label: "key=value を '&' で連結して返す", code: "return keys.joinToString(\"&\") { \"$it=${map[it]}\" }" }
      ]
    },
    "set4-task3": {
      pattern: "grid_graph",
      signal: "「prerequisite → dependent の有向依存」「サイクルがあれば空配列、完了可能なら実行順序（小さい番号優先）」→ 入次数 indeg＋最小ヒープ(PriorityQueue)の Kahn 法トポロジカルソート",
      trap: "int_safe_edge",
      trapWhy: "再帰DFSは深いグラフで StackOverflow の危険があるため非再帰の入次数法を使う。取り出した個数 cnt == N でなければサイクルありで IntArray(0)。",
      blueprint: [
        "// 1. 有向辺リストと入次数 indeg[v] を集計",
        "// 2. indeg == 0 の頂点を最小ヒープ（PriorityQueue）へ投入",
        "// 3. 最小頂点を取り出し res に追加、隣接の indeg-- が 0 ならヒープへ",
        "// 4. cnt == N なら res、未満ならサイクルありで IntArray(0)"
      ],
      blocks: [
        { label: "隣接リストと入次数 indeg の構築", code: "val indeg = IntArray(N)\n// prerequisite[k] -> dependent[k] の辺と indeg[dependent[k]]++ を記録" },
        { label: "入次数 0 のタスクを最小ヒープに初期投入", code: "// indeg[i] == 0 のタスク i をすべて最小ヒープへ push" },
        { label: "ヒープから取り出し後続タスクの入次数を減らす", code: "while (size > 0) {\n    val u = popMin()\n    res[cnt++] = u\n    // u の各後続 v について --indeg[v] == 0 なら push(v)\n}" },
        { label: "全 N 個完了できたかでサイクル判定", code: "return if (cnt == N) res else IntArray(0)" }
      ]
    },
    "set5-task1": {
      pattern: "bugfix",
      signal: "「Bugfixing：1 の最長連続日数を返す既存コードのバグ修正」→ 全書き換えせず『ループ開始添字』と『末尾が 1 で終わるケースの return』の2行だけ疑う！",
      trap: "bug_minimal",
      trapWhy: "① for が 1 から始まり A[0] を無視している（[1] で 0 になる） ② 0 のときだけ max 更新しているので末尾が 1 で終わると反映されない。",
      blueprint: [
        "// バグ箇所1: ループ開始 1 until A.size → 0 until A.size に修正",
        "// バグ箇所2: return maxSpan → return max(maxSpan, currentSpan) に修正"
      ],
      blocks: [
        { label: "状態変数は既存のまま維持", code: "var maxSpan = 0\nvar currentSpan = 0" },
        { label: "修正1：先頭要素 A[0] から走査する", code: "for (i in 0 until A.size) {" },
        { label: "1なら加算、0なら最大更新してリセット", code: "    if (A[i] == 1) currentSpan += 1\n    else { maxSpan = max(maxSpan, currentSpan); currentSpan = 0 }\n}" },
        { label: "修正2：末尾が1で終わった連続分も反映して返す", code: "return max(maxSpan, currentSpan)" }
      ]
    },
    "set5-task2": {
      pattern: "cache_queue",
      signal: "「チャンネル C[i] ごとに直前の『配信成功』から D 秒未満なら抑制」→ チャンネルID → 前回成功時刻の HashMap で 1パス O(N)",
      trap: "int_safe_edge",
      trapWhy: "抑制（スキップ）した通知の時刻で last[C[i]] を上書きしてはいけない！成功したときだけ last[C[i]] = T[i] を更新する。",
      blueprint: [
        "// 1. last = HashMap<Int, Int>(), cnt = 0",
        "// 2. p = last[C[i]] が null または T[i] - p >= D なら配信成功",
        "// 3. 成功時のみ cnt++ ＆ last[C[i]] = T[i]"
      ],
      blocks: [
        { label: "チャンネル別・前回成功時刻Mapと成功数 cnt の初期化", code: "val last = HashMap<Int, Int>()\nvar cnt = 0" },
        { label: "通知を時系列に走査し前回成功時刻を取得", code: "for (i in 0 until T.size) {\n    val p = last[C[i]]" },
        { label: "初回または D 秒以上経過なら成功カウント＆時刻更新", code: "    if (p == null || T[i] - p >= D) {\n        cnt++\n        last[C[i]] = T[i]\n    }\n}" },
        { label: "配信成功総数を返す", code: "return cnt" }
      ]
    },
    "set5-task3": {
      pattern: "binary_answer",
      signal: "「順序を変えず K パック以内に分割」「1パックの最大サイズを最小化」→ 答えの上限 m（max(S)..sum(S)）で二分探索＋先頭から貪欲詰め O(N log Σ)",
      trap: "long_sum",
      trapWhy: "記事サイズの合計は最大 10^13 で Int を超えるため lo, hi, m, cur はすべて Long で持つ。",
      blueprint: [
        "// 1. lo = 最大要素, hi = 全合計 (Long)",
        "// 2. while (lo < hi) で m = (lo + hi) / 2",
        "// 3. cur + x > m で新パック cnt++、cnt <= K なら hi = m else lo = m + 1"
      ],
      blocks: [
        { label: "下限 lo(最大1個) と上限 hi(総和) を Long で計算", code: "var lo = 0L; var hi = 0L\nfor (x in S) { if (x > lo) lo = x.toLong(); hi += x }" },
        { label: "上限帯域 m の二分探索ループ", code: "while (lo < hi) {\n    val m = (lo + hi) / 2\n    var cnt = 1; var cur = 0L" },
        { label: "上限 m で何パック必要か貪欲に数える", code: "    for (x in S) {\n        if (cur + x > m) { cnt++; cur = 0L }\n        cur += x\n    }" },
        { label: "K パック以内なら上限を縮め、最小の lo を返す", code: "    if (cnt <= K) hi = m else lo = m + 1\n}\nreturn lo" }
      ]
    },
    "set5-task4": {
      pattern: "android_arch",
      signal: "「ViewModel + StateFlow + インメモリキャッシュ + 古いJobキャンセル」→ trim → 2文字未満ガード → キャッシュ即時返却(Loading出さない) → job?.cancel() して launch",
      trap: "state_lifecycle",
      trapWhy: "try-catch で Exception より先に CancellationException を catch して throw e しないとコルーチンの協調キャンセルが壊れて Error 状態になってしまう！",
      blueprint: [
        "// 1. trim() し 2文字未満は job?.cancel() + Error で return",
        "// 2. !forceRefresh かつ cache[q] != null なら Loading 出さず即 Empty/Content",
        "// 3. job?.cancel() → Loading → launch 内で検索・cache保存（CancellationException再スロー！）"
      ],
      blocks: [
        { label: "クエリ正規化と2文字未満のエラーガード", code: "val q = rawQuery.trim()\nif (q.length < 2) {\n    job?.cancel()\n    _uiState.value = SearchUiState.Error(q, \"Query too short\")\n    return\n}" },
        { label: "キャッシュヒット時は通信もLoadingも挟まず即時反映", code: "val cached = cache[q]\nif (cached != null && !forceRefresh) {\n    job?.cancel()\n    _uiState.value = if (cached.isEmpty()) SearchUiState.Empty(q)\n        else SearchUiState.Content(q, cached, fromCache = true)\n    return\n}" },
        { label: "進行中Jobをキャンセルし Loading にして非同期取得", code: "job?.cancel()\n_uiState.value = SearchUiState.Loading\njob = viewModelScope.launch(dispatcher) {\n    try {\n        val list = repository.searchArticles(q); cache[q] = list\n        _uiState.value = if (list.isEmpty()) SearchUiState.Empty(q) else SearchUiState.Content(q, list, false)" },
        { label: "CancellationException を再スローし通常例外のみ Error 化", code: "    } catch (e: CancellationException) { throw e }\n      catch (e: Exception) { _uiState.value = SearchUiState.Error(q, e.message ?: \"Network error\") }\n}" }
      ]
    },
    "set5-task5": {
      pattern: "android_arch",
      signal: "「OkHttp Interceptor」「Bearer 付与」「401 なら refresh して1回再送・失敗や再401は onSessionExpired」「503 は同じリクエストを1回再試行」→ first.code の when 分岐",
      trap: "state_lifecycle",
      trapWhy: "① addHeader ではなく上書きの header() を使う ② 再送前に必ず first.close() する（ただし refresh 失敗で first をそのまま返すときは close しない！）。",
      blueprint: [
        "// 1. 現在トークンがあれば header(\"Authorization\", \"Bearer ...\") で proceed",
        "// 2. 401: refreshToken() 空なら onSessionExpired + first返却、あれば first.close() → 再送（再401も期限切れ通知）",
        "// 3. 503: first.close() → 最初の sent を1回だけ再送"
      ],
      blocks: [
        { label: "現在トークンを上書き付与して初回 proceed", code: "val req = chain.request()\nval token = auth.getCurrentToken()\nval sent = if (!token.isNullOrEmpty()) withToken(req, token) else req\nval first = chain.proceed(sent)" },
        { label: "401時：トークン更新と失敗時のセッション期限切れ処理", code: "return when (first.code) {\n    401 -> {\n        val newToken = auth.refreshToken()\n        if (newToken.isNullOrEmpty()) { auth.onSessionExpired(); first }" },
        { label: "401更新成功時：first.close() して新トークンで1回再送", code: "        else {\n            first.close()\n            val retry = chain.proceed(withToken(req, newToken))\n            if (retry.code == 401) auth.onSessionExpired()\n            retry\n        }\n    }" },
        { label: "503時：first.close() して1回再試行、それ以外はそのまま返す", code: "    503 -> { first.close(); chain.proceed(sent) }\n    else -> first\n}" }
      ]
    },
    "area1": {
      pattern: "prefix_count",
      signal: "「文字列 S の区間 [P[k], Q[k]] に含まれる最小影響度 (A=1,C=2,G=3,T=4) を M 回質問」→ 文字種が4つだけなので A, C, G の累積個数配列を作り引き算 O(1)/クエリ",
      trap: "interval_bound",
      trapWhy: "閉区間 [P, Q] の個数は prefix[Q + 1] - prefix[P]（Q + 1 の +1 を忘れると1文字足りない）。A, C, G どれも 0 個なら 4 (T)。",
      blueprint: [
        "// 1. 長さ n+1 の累積配列 a, c, g を前計算 O(N)",
        "// 2. 各クエリ [l, r=Q[k]+1] で a[r]-a[l]>0 なら 1、c なら 2、g なら 3、他は 4",
        "// 3. 結果配列 res を return"
      ],
      blocks: [
        { label: "A・C・G の長さ n+1 累積個数配列を初期化", code: "val n = S.length\nif (n == 0 || P.isEmpty()) return IntArray(0)\nval a = IntArray(n + 1); val c = IntArray(n + 1); val g = IntArray(n + 1)" },
        { label: "1文字ずつ累積個数を前計算", code: "for (i in 0 until n) {\n    a[i + 1] = a[i] + if (S[i] == 'A') 1 else 0\n    c[i + 1] = c[i] + if (S[i] == 'C') 1 else 0\n    g[i + 1] = g[i] + if (S[i] == 'G') 1 else 0\n}" },
        { label: "各区間 [P[k], Q[k]] を引き算1回で最小判定", code: "val res = IntArray(P.size)\nfor (k in P.indices) {\n    val l = P[k]; val r = Q[k] + 1\n    res[k] = if (a[r] - a[l] > 0) 1 else if (c[r] - c[l] > 0) 2 else if (g[r] - g[l] > 0) 3 else 4\n}" },
        { label: "応答配列を返す", code: "return res" }
      ]
    },
    "area2": {
      pattern: "stack_mono",
      signal: "「右へ泳ぐ魚(1)と左へ泳ぐ魚(0)が衝突し大きい方が残る」→ 右行き(1)をスタックに積み、左行き(0)が来たら自分以下の右行きを while で pop する O(N)",
      trap: "interval_bound",
      trapWhy: "同じ大きさのときは左行きが勝つ仕様なら <= で pop（異なる大きさ前提でも <= で安全）。最後に残る数は「左へ抜けた数 left + スタック残数 top」。",
      blueprint: [
        "// 1. 右行きスタック st, top = 0, 左へ生還した数 left = 0",
        "// 2. B[i] == 1 なら st に push",
        "// 3. B[i] == 0 なら st[top-1] <= A[i] を pop し、top == 0 なら left++",
        "// 4. return left + top"
      ],
      blocks: [
        { label: "右行きスタックと左生還カウンタの初期化", code: "val st = IntArray(A.size)\nvar top = 0\nvar left = 0" },
        { label: "右行き(1)はスタックに積む", code: "for (i in A.indices) {\n    if (B[i] == 1) st[top++] = A[i]" },
        { label: "左行き(0)は小さい右行きを食べ、全滅させたら生還", code: "    else {\n        while (top > 0 && st[top - 1] <= A[i]) top--\n        if (top == 0) left++\n    }\n}" },
        { label: "左へ抜けた魚＋右へ残った魚の合計を返す", code: "return left + top" }
      ]
    },
    "area3": {
      pattern: "prefix_count",
      signal: "「負の数も含む配列の連続部分和の最大（MaxSliceSum）」→ 尺取り法は不可！各位置で『前の和に足すか、ここから始め直すか』を選ぶ Kadane 法 O(N)",
      trap: "int_safe_edge",
      trapWhy: "best や cur を 0 で初期化すると「全要素が負（例: [-5, -2]）」のとき 0 を返して誤答になる！必ず A[0] で初期化し i = 1 から回す。",
      blueprint: [
        "// 1. 空なら 0。cur = A[0], best = A[0]（全負対策！）",
        "// 2. i = 1 until N で cur = maxOf(A[i], cur + A[i])",
        "// 3. best = maxOf(best, cur) を更新し return"
      ],
      blocks: [
        { label: "空配列ガードと A[0] での初期化（全負対策）", code: "if (A.isEmpty()) return 0\nvar cur = A[0]\nvar best = A[0]" },
        { label: "2番目以降で「新規開始 vs 継続加算」を選択", code: "for (i in 1 until A.size) {\n    cur = maxOf(A[i], cur + A[i])" },
        { label: "全体の最大部分和を更新", code: "    best = maxOf(best, cur)\n}" },
        { label: "最大和を返す", code: "return best" }
      ]
    },
    "area4": {
      pattern: "binary_answer",
      signal: "「K 個以下の連続ブロックに分け、ブロック和の最大を最小にする（MinMaxDivision）」→ 答えの上限 mid を [max(A)..sum(A)] で二分探索 O(N log Σ)",
      trap: "long_sum",
      trapWhy: "要素の総和が Int を超えうるため lo, hi, mid, sum は Long で計算し、最後に lo.toInt() で返す。引数 M に惑わされず実際の最大要素を下限にすると確実。",
      blueprint: [
        "// 1. 空なら 0。lo = 最大要素, hi = 総和 (Long)",
        "// 2. while (lo < hi) で mid を決め前から貪欲にブロック数 cnt を数える",
        "// 3. cnt <= K なら hi = mid else lo = mid + 1 → lo.toInt()"
      ],
      blocks: [
        { label: "空ガードと探索範囲 [最大要素..総和] の算出", code: "if (A.isEmpty()) return 0\nvar lo = 0L; var hi = 0L\nfor (x in A) { if (x > lo) lo = x.toLong(); hi += x }" },
        { label: "上限和 mid の二分探索ループ", code: "while (lo < hi) {\n    val mid = (lo + hi) / 2\n    var cnt = 1; var sum = 0L" },
        { label: "mid を超えたら新ブロックにして必要個数を数える", code: "    for (x in A) {\n        if (sum + x > mid) { cnt++; sum = x.toLong() } else sum += x\n    }" },
        { label: "K 個以内なら上限を下げ、収束値を返す", code: "    if (cnt <= K) hi = mid else lo = mid + 1\n}\nreturn lo.toInt()" }
      ]
    },
    "area5": {
      pattern: "sweep_greedy",
      signal: "「中心 i・半径 A[i] の円盤の重なる組数」→ 円盤は 1次元区間 [i-A[i], i+A[i]]！座標を [0..N-1] に丸めて open/close 個数配列で走査すればソートすら不要の O(N)",
      trap: "long_sum",
      trapWhy: "① i - A[i] や i + A[i] は半径 21億で Int あふれするので引き算/足し算前にクランプする ② 組数は Long で数え、端で接する組も含めるため close は加算後に引く！",
      blueprint: [
        "// 1. 左端 max(0, i-A[i]) を open[s]++、右端 min(n-1, i+A[i]) を close[e]++",
        "// 2. 位置 p ごとに cnt += o * active + o*(o-1)/2（1000万超で -1）",
        "// 3. active += o した後に active -= close[p]"
      ],
      blocks: [
        { label: "桁あふれを防ぎながら [0..n-1] に丸めて開始・終了数を集計", code: "val n = A.size; val open = IntArray(n); val close = IntArray(n)\nfor (i in 0 until n) {\n    val s = if (A[i] > i) 0 else i - A[i]\n    val e = if (A[i] >= n - 1 - i) n - 1 else i + A[i]\n    open[s]++; close[e]++\n}" },
        { label: "交差組数 cnt と現在開いている数 active を Long で初期化", code: "var cnt = 0L\nvar active = 0L" },
        { label: "左から走査し新規開始円盤との組を加算＆1000万上限判定", code: "for (p in 0 until n) {\n    val o = open[p].toLong()\n    cnt += o * active + o * (o - 1) / 2\n    if (cnt > 10000000L) return -1" },
        { label: "接する端を含めるため加算後に close を引いて返す", code: "    active += o - close[p]\n}\nreturn cnt.toInt()" }
      ]
    },
    "area6": {
      pattern: "grid_graph",
      signal: "「N 個の頂点と無向辺 U[i]-V[i]」「つながった連結成分（かたまり）の数」→ 非再帰 Union-Find（親配列 p＋経路圧縮 while）で cnt = N から統合ごとに cnt--",
      trap: "int_safe_edge",
      trapWhy: "find を再帰で書くと長い鎖で StackOverflow の恐れがあるため `while (p[a] != a) { p[a] = p[p[a]]; a = p[a] }` のループ経路圧縮で書く。",
      blueprint: [
        "// 1. p[i] = i で初期化、かたまり数 cnt = N",
        "// 2. 各辺 (U[i], V[i]) の根 a, b を while 経路圧縮で探す",
        "// 3. a != b なら p[a] = b にして cnt-- → return cnt"
      ],
      blocks: [
        { label: "親配列 p[i] = i と連結成分数 cnt = N の初期化", code: "if (N <= 0) return 0\nval p = IntArray(N) { it }\nvar cnt = N" },
        { label: "各辺の両端の根を非再帰（経路圧縮つき）で探す", code: "for (i in U.indices) {\n    var a = U[i]; while (p[a] != a) { p[a] = p[p[a]]; a = p[a] }\n    var b = V[i]; while (p[b] != b) { p[b] = p[p[b]]; b = p[b] }" },
        { label: "別成分なら統合して成分数を1減らす", code: "    if (a != b) { p[a] = b; cnt-- }\n}" },
        { label: "残った連結成分数を返す", code: "return cnt" }
      ]
    },
    "area7": {
      pattern: "string_parse",
      signal: "「改行区切りの通話ログ hh:mm:ss,電話番号」「通話1本ごとに料金計算」「合計秒数が最長の番号（同点は番号小）だけ無料」→ 番号別 durMap と feeMap の2つに集計",
      trap: "int_safe_edge",
      trapWhy: "① 料金は『合計秒数』ではなく『通話1本ごと』に計算して足す！ ② 300秒以上の切り上げ分は `(sec + 59) / 60 * 150` ③ 電話番号はハイフン除去し Long 化すると先頭0も統一でき比較も簡単。",
      blueprint: [
        "// 1. 行ごとに秒数 sec と1本料金 cost を計算し dur[num], fee[num] に加算",
        "// 2. dur を走査し最長秒数（同点なら num が小さい方）の無料番号 free を特定",
        "// 3. free 以外の fee を合計して return"
      ],
      blocks: [
        { label: "番号別の合計秒数 dur と合計料金 fee の Map を用意", code: "val dur = HashMap<Long, Int>()\nval fee = HashMap<Long, Int>()" },
        { label: "各行をパースし1通話ごとの秒数と料金を加算", code: "for (raw in S.split(\"\\n\")) {\n    // hh:mm:ss から sec、ハイフン除去番号から num(Long) を算出\n    val cost = if (sec < 300) sec * 3 else (sec + 59) / 60 * 150\n    dur[num] = (dur[num] ?: 0) + sec; fee[num] = (fee[num] ?: 0) + cost\n}" },
        { label: "合計秒数が最大（同点は番号最小）の無料対象番号を決定", code: "var free = -1L; var best = -1\nfor ((k, d) in dur) {\n    if (d > best || (d == best && k < free)) { best = d; free = k }\n}" },
        { label: "無料番号を除いた料金総額を返す", code: "var ans = 0\nfor ((k, f) in fee) if (k != free) ans += f\nreturn ans" }
      ]
    },
    "area8": {
      pattern: "sliding_window",
      signal: "「同じ文字を含まない最長の連続部分文字列の長さ」→ 文字の最終出現位置 HashMap<Char, Int>＋左端 left をジャンプさせるスライディングウィンドウ O(N)",
      trap: "interval_bound",
      trapWhy: "文字 c の前回位置 p が見つかっても、`p < left`（すでに現在の窓より左に追い出した文字）なら無視する！必ず `if (p != null && p >= left) left = p + 1` と書く。",
      blueprint: [
        "// 1. last = HashMap<Char, Int>(), left = 0, best = 0",
        "// 2. p = last[S[i]] が窓内 (p >= left) なら left = p + 1",
        "// 3. last[S[i]] = i を記録し best = maxOf(best, i - left + 1)"
      ],
      blocks: [
        { label: "文字の最終出現位置Mapと窓左端・最大長の初期化", code: "val last = HashMap<Char, Int>()\nvar left = 0\nvar best = 0" },
        { label: "窓内で重複文字が出たら左端を前回位置の次へ進める", code: "for (i in 0 until S.length) {\n    val c = S[i]; val p = last[c]\n    if (p != null && p >= left) left = p + 1" },
        { label: "現在位置を記録し最長窓長を更新", code: "    last[c] = i\n    best = maxOf(best, i - left + 1)\n}" },
        { label: "最長長さを返す", code: "return best" }
      ]
    },
    "area9a": {
      pattern: "sweep_greedy",
      signal: "「終端 B が昇順の区間列」「端が接する区間も同時に選べない最大本数（MaxNonoverlappingSegments）」→ 終端が早いものから貪欲に選ぶ O(N)",
      trap: "interval_bound",
      trapWhy: "① 端が接するのも不可なので `A[i] > lastEnd`（>= ではない） ② 座標が 0 以下の可能性に備え、最初の1本は first フラグ（または初期値調整）で確実に選ぶ。",
      blueprint: [
        "// 1. B は昇順済みなのでソート不要。count = 0, first = true",
        "// 2. first または A[i] > lastEnd なら選んで count++, lastEnd = B[i]",
        "// 3. return count"
      ],
      blocks: [
        { label: "選択本数と直前終端・初回フラグの初期化", code: "var count = 0\nvar lastEnd = 0\nvar first = true" },
        { label: "終端順の配列を走査し重ならない区間だけ貪欲選択", code: "for (i in A.indices) {\n    if (first || A[i] > lastEnd) {" },
        { label: "本数を増やし終端を更新", code: "        count++\n        lastEnd = B[i]\n        first = false\n    }\n}" },
        { label: "最大本数を返す", code: "return count" }
      ]
    },
    "area9b": {
      pattern: "sweep_greedy",
      signal: "「隣り合うロープを順に結んで長さ K 以上を最大何本作れるか（TieRopes）」→ 左から足して K 以上になった瞬間に1本確定して sum = 0L にリセットする貪欲法 O(N)",
      trap: "long_sum",
      trapWhy: "K 未満の値に次の A[i](最大10億) を足す瞬間、Int 上限付近だとオーバーフローしうるため sum は 0L (Long) で持つ。",
      blueprint: [
        "// 1. 空または K <= 0 なら 0。sum = 0L, count = 0",
        "// 2. sum += a し、sum >= K になったら count++ ＆ sum = 0L",
        "// 3. return count"
      ],
      blocks: [
        { label: "ガード節と Long 累積和・本数の初期化", code: "if (A.isEmpty() || K <= 0) return 0\nvar sum = 0L\nvar count = 0" },
        { label: "左から長さを足し K 以上に達したら即1本確定してリセット", code: "for (a in A) {\n    sum += a\n    if (sum >= K) {\n        count++\n        sum = 0L\n    }\n}" },
        { label: "完成した本数を返す", code: "return count" }
      ]
    },
    "area10": {
      pattern: "grid_graph",
      signal: "「2次元グリッドで上下左右に同じ値がつながった地域の数（CountriesCount）」→ 未訪問マスごとに count++ し、非再帰スタック/キューで同値マスを塗りつぶす O(HW)",
      trap: "int_safe_edge",
      trapWhy: "再帰DFSは巨大グリッドで StackOverflow になるため ArrayDeque または IntArray スタックを使う。st に積む瞬間に seen = true にして重複積みを防ぐ。",
      blueprint: [
        "// 1. seen = BooleanArray(h * w), 4方向ベクトル dr, dc",
        "// 2. 未訪問マスで count++ し ArrayDeque に積んで seen = true",
        "// 3. 4方向で範囲内・未訪問・同値 A[nr][nc] == A[r][c] をたどる"
      ],
      blocks: [
        { label: "空グリッドガード・訪問配列・4方向ベクトルの準備", code: "val h = A.size; if (h == 0) return 0\nval w = A[0].size; if (w == 0) return 0\nval seen = BooleanArray(h * w)\nval dr = intArrayOf(1, -1, 0, 0); val dc = intArrayOf(0, 0, 1, -1)\nvar count = 0" },
        { label: "未訪問マスを見つけたら新地域としてスタック開始", code: "for (r in 0 until h) for (c in 0 until w) {\n    if (seen[r * w + c]) continue\n    count++\n    val st = ArrayDeque<Int>(); seen[r * w + c] = true; st.addLast(r * w + c)" },
        { label: "非再帰ループで上下左右の同じ値のマスを訪問済みにする", code: "    while (st.isNotEmpty()) {\n        val cur = st.removeLast(); val cr = cur / w; val cc = cur % w\n        for (d in 0..3) {\n            val nr = cr + dr[d]; val nc = cc + dc[d]\n            if (nr in 0 until h && nc in 0 until w && !seen[nr * w + nc] && A[nr][nc] == A[r][c]) {\n                seen[nr * w + nc] = true; st.addLast(nr * w + nc)\n            }\n        }\n    }\n}" },
        { label: "地域総数を返す", code: "return count" }
      ]
    },
    "area11": {
      pattern: "cache_queue",
      signal: "「利用者ごとに直近 windowSeconds 内の『許可済み依頼』が maxRequests 未満なら許可(1)、以上なら拒否(0)」→ userId → ArrayDeque(許可時刻キュー) の HashMap O(N)",
      trap: "interval_bound",
      trapWhy: "① 拒否(0)した依頼はキューに入れない！ ② 時刻境界（now - windowSeconds 以下を追い出すのか未満か）を問題文通りに合わせ、maxRequests <= 0 は全 0 で即返す。",
      blueprint: [
        "// 1. map = HashMap<Int, ArrayDeque<Int>>(), res = IntArray(n)",
        "// 2. q.first() <= now - windowSeconds の古い許可履歴を先頭から外す",
        "// 3. q.size < maxRequests なら res[i] = 1 ＆ q.addLast(now)"
      ],
      blocks: [
        { label: "結果配列と maxRequests <= 0 ガード・利用者別キューMap", code: "val n = timestamps.size; val res = IntArray(n)\nif (maxRequests <= 0) return res\nval map = HashMap<Int, ArrayDeque<Int>>()" },
        { label: "時間窓から外れた古い許可時刻をキュー先頭から除去", code: "for (i in 0 until n) {\n    val now = timestamps[i]\n    val q = map.getOrPut(userIds[i]) { ArrayDeque() }\n    while (q.isNotEmpty() && q.first() <= now - windowSeconds) q.removeFirst()" },
        { label: "上限未満なら許可(1)して現在時刻をキューに記録", code: "    if (q.size < maxRequests) {\n        res[i] = 1\n        q.addLast(now)\n    }\n}" },
        { label: "判定結果配列を返す", code: "return res" }
      ]
    },
    "area12a": {
      pattern: "xor_math",
      signal: "「正の整数 N（最大 21億）の約数の個数（CountFactors）」→ 1..N 全探索 O(N) は TLE！√N まで走査して約数ペア (i, N/i) を2個ずつ数える O(√N)",
      trap: "long_sum",
      trapWhy: "① N = Int.MAX_VALUE 付近だと `i * i` が Int オーバーフローして無限ループになるため必ず `i.toLong() * i <= N` にする ② 平方数 (`i == N / i`) は1個だけ数える。",
      blueprint: [
        "// 1. N <= 0 なら 0。count = 0, i = 1",
        "// 2. while (i.toLong() * i <= N) で N % i == 0 を調べる",
        "// 3. 約数なら count++、さらに i != N / i なら対の分も count++"
      ],
      blocks: [
        { label: "非正ガードとカウンタ初期化", code: "if (N <= 0) return 0\nvar count = 0\nvar i = 1" },
        { label: "Long乗算でオーバーフローを防ぎ √N までループ", code: "while (i.toLong() * i <= N) {" },
        { label: "割り切れれば対で加算（平方数の重複を除外）", code: "    if (N % i == 0) {\n        count++\n        if (i != N / i) count++\n    }\n    i++\n}" },
        { label: "約数総数を返す", code: "return count" }
      ]
    },
    "area12b": {
      pattern: "xor_math",
      signal: "「円周 N 個のチョコを M 個飛ばしで包み紙に当たるまで食べる個数（ChocolatesByNumbers）」→ 周期性より答えは N / gcd(N, M)！ユークリッド互除法で O(log N)",
      trap: "int_safe_edge",
      trapWhy: "N が最大10億なので配列シミュレーションは TLE / MLE になる。N / gcd(N, M) なら割り算が先なので Int のままオーバーフローも起きない。",
      blueprint: [
        "// 1. N <= 0 || M <= 0 なら 0",
        "// 2. while (b != 0) { val t = a % b; a = b; b = t } で gcd を算出",
        "// 3. return N / gcd"
      ],
      blocks: [
        { label: "ガード節と互除法用の変数 a, b 初期化", code: "if (N <= 0 || M <= 0) return 0\nvar a = N\nvar b = M" },
        { label: "ユークリッドの互除法で最大公約数 a を求める", code: "while (b != 0) {\n    val t = a % b\n    a = b\n    b = t\n}" },
        { label: "周期 N / gcd(N, M) を返す", code: "return N / a" }
      ]
    },
    "bug1": {
      pattern: "bugfix",
      signal: "「Bugfixing：最頻値の添字を探すが、全要素が1回ずつのとき落ちる」→ index の初期値 `-1` が未更新のまま最後 `A[index]` を引いて ArrayIndexOutOfBounds になっている！",
      trap: "bug_minimal",
      trapWhy: "他のロジックやループ条件は一切触らず、`var index = -1` を `var index = 0` に1箇所直すだけで全要素1回時に先頭 A[0] を安全に返せる。",
      blueprint: [
        "// バグ箇所: var index = -1 だと2回以上出る値がないとき A[-1] でクラッシュ",
        "// 修正: var index = 0 に変更（1行のみ修正）"
      ],
      blocks: [
        { label: "出現回数配列と最大出現数の準備", code: "val N = A.size\nval count = IntArray(M + 1)\nvar maxOccurence = 1" },
        { label: "修正箇所：未更新でも先頭を指すよう index = 0 にする", code: "var index = 0" },
        { label: "既存の出現カウント＆最大更新ループを維持", code: "for (i in 0 until N) {\n    if (count[A[i]] > 0) {\n        val tmp = count[A[i]]\n        if (tmp > maxOccurence) { maxOccurence = tmp; index = i }\n        count[A[i]] = tmp + 1\n    } else count[A[i]] = 1\n}" },
        { label: "最頻要素 A[index] を返す", code: "return A[index]" }
      ]
    },
    "bug2": {
      pattern: "bugfix",
      signal: "「Bugfixing：昇順配列の二分探索で無限ループまたは誤判定」→ `l = m` と左端を m に寄せる二分探索なのに `m = (l + r) / 2`（切り捨て）になっている！",
      trap: "bug_minimal",
      trapWhy: "要素2個（l=0, r=1）のとき `(l + r) / 2` は 0 になり、`l = m` で l が 0 のまま動かず無限ループする！上側中点 `(l + r + 1) / 2` に直す。",
      blueprint: [
        "// バグ箇所: l = m がある二分探索で (l + r) / 2 だと 2要素時に無限ループ",
        "// 修正: val m = (l + r + 1) / 2 に変更"
      ],
      blocks: [
        { label: "空配列ガードと探索範囲 [0..N-1] の設定", code: "val N = A.size\nif (N == 0) return -1\nvar l = 0; var r = N - 1" },
        { label: "修正箇所：中点を上側 (l + r + 1) / 2 に切り上げる", code: "while (l < r) {\n    val m = (l + r + 1) / 2" },
        { label: "既存の分岐（r = m - 1 / l = m）を維持", code: "    if (A[m] > X) r = m - 1 else l = m\n}" },
        { label: "収束位置が X と一致するか確認して返す", code: "return if (A[l] == X) l else -1" }
      ]
    },
    "bug3": {
      pattern: "bugfix",
      signal: "「Bugfixing：昇順配列 A が 1 から K まで飛びなく全て含むか判定」→ 最後の端チェック `if (A[0] != 1 && A[n - 1] != K) return false` の論理演算子がおかしい！",
      trap: "bug_minimal",
      trapWhy: "`&&` だと「先頭が1でない」かつ「末尾がKでない」の両方を満たしたときしか false にならない（例: [1,1,2], K=3 が true に化ける）。`||` に1箇所直す。",
      blueprint: [
        "// バグ箇所: A[0] != 1 && A[n - 1] != K だと片方だけ違うケースが素通りする",
        "// 修正: && を || に変更"
      ],
      blocks: [
        { label: "隣接要素に2以上の飛びがないか走査", code: "val n = A.size\nfor (i in 0 until n - 1) {\n    if (A[i] + 1 < A[i + 1]) return false\n}" },
        { label: "修正箇所：先頭が1でない『または』末尾がKでないなら false", code: "if (A[0] != 1 || A[n - 1] != K) return false" },
        { label: "すべて満たせば true", code: "return true" }
      ]
    },
    "bug4": {
      pattern: "bugfix",
      signal: "「Bugfixing：コインを『必ず1枚』裏返した後の隣接一致ペア数の最大」→ 全コイン同じ面（例: [1,1,1]）のとき裏返すとペアが減るのに増減最大値 r の初期値が 0 になっている！",
      trap: "bug_minimal",
      trapWhy: "① n <= 1 なら隣接ペアは常に 0 ② 必ず1枚裏返すため増減は負（最小 -2）になりうる。r の初期値を `0` ではなく `-2` に直す。",
      blueprint: [
        "// バグ箇所1: n <= 1 のガード（ペアは0）",
        "// バグ箇所2: 必ず1枚裏返すので最大増減 r の初期値を 0 → -2 に変更"
      ],
      blocks: [
        { label: "修正1：1枚以下なら隣接ペア 0 で即リターン", code: "val n = A.size\nif (n <= 1) return 0" },
        { label: "裏返す前の現在の隣接一致数 result を集計", code: "var result = 0\nfor (i in 0 until n - 1) if (A[i] == A[i + 1]) result += 1" },
        { label: "修正2：変化量の最大値 r を最小可能値 -2 で初期化し各位置を試す", code: "var r = -2\nfor (i in 0 until n) {\n    var count = 0\n    if (i > 0) count += if (A[i - 1] != A[i]) 1 else -1\n    if (i < n - 1) count += if (A[i + 1] != A[i]) 1 else -1\n    r = maxOf(r, count)\n}" },
        { label: "元のペア数＋最良の変化量を返す", code: "return result + r" }
      ]
    },
    "area14": {
      pattern: "android_arch",
      signal: "「検索語 trim・2文字未満は Idle・保存済みは Loading 出さず即返却・未保存は Loading → 取得保存」→ sealed interface 状態遷移＋ConcurrentHashMap＋CancellationException 再スロー",
      trap: "state_lifecycle",
      trapWhy: "① 空リスト検索結果もキャッシュヒット（`hit != null` で判定し `isEmpty` で未キャッシュ扱いしない） ② `toList()` で防御的コピー保存 ③ `CancellationException` を先に再スロー。",
      blueprint: [
        "// 1. trim して < 2文字なら st = Idle で return",
        "// 2. mp[q] != null なら Loading 挟まず Empty / Content(fromCache=true)",
        "// 3. st = Loading → repo.search(q).toList() を保存 → CancellationException再スロー"
      ],
      blocks: [
        { label: "trim と最小文字数ガード", code: "val q = raw.trim()\nif (q.length < MIN_LEN) { st = SearchUiState.Idle; return }" },
        { label: "キャッシュヒット時は Loading を挟まず即座に状態更新", code: "val hit = mp[q]\nif (hit != null) {\n    st = if (hit.isEmpty()) SearchUiState.Empty(q) else SearchUiState.Content(q, hit, true)\n    return\n}" },
        { label: "Loading 遷移・防御的コピー保存・結果反映", code: "st = SearchUiState.Loading\ntry {\n    val res = repo.search(q).toList()\n    mp[q] = res\n    st = if (res.isEmpty()) SearchUiState.Empty(q) else SearchUiState.Content(q, res, false)" },
        { label: "キャンセル再スローと通常エラー遷移", code: "} catch (e: CancellationException) { throw e }\n  catch (e: Exception) { st = SearchUiState.Error(q, e.message ?: \"Unknown error\") }" }
      ]
    },
    "area15": {
      pattern: "android_arch",
      signal: "「マルチスレッド対応 401 認証リトライ Interceptor＋ログイン入力バリデータ」→ synchronized ロック内で二重リフレッシュ防止（cur != tok 判定）＋再送前 res.close()",
      trap: "state_lifecycle",
      trapWhy: "synchronized に入った時点で別スレッドが既にトークンを更新済み（`cur != null && cur != tok`）なら `refreshAccessToken()` を呼ばず新しい `cur` を使う！",
      blueprint: [
        "// 1. トークン付与で proceed、401 以外はそのまま return",
        "// 2. synchronized(lock) で他スレッド更新済みか確認、未更新なら refresh",
        "// 3. 空なら onSessionExpired + 最初の res 返却、あれば res.close() して1回再送"
      ],
      blocks: [
        { label: "現在トークンを付与して初回リクエスト送信", code: "val tok = store.getAccessToken()\nval req = if (!tok.isNullOrBlank()) req0.withHeader(\"Authorization\", \"Bearer $tok\") else req0\nval res = chain.proceed(req)\nif (res.code != UNAUTH) return res" },
        { label: "synchronized 内で二重リフレッシュを防ぎ新トークン取得", code: "synchronized(lock) {\n    val cur = store.getAccessToken()\n    val nxt = if (cur != null && cur != tok) cur else store.refreshAccessToken()" },
        { label: "リフレッシュ失敗時の期限切れ通知", code: "    if (nxt.isNullOrBlank()) { store.onSessionExpired(); return res }" },
        { label: "旧レスポンスを close() して新トークンで1回だけ再送", code: "    res.close()\n    return chain.proceed(req0.withHeader(\"Authorization\", \"Bearer $nxt\"))\n}" }
      ]
    },
    "area16a": {
      pattern: "grid_graph",
      signal: "「N 個の作業と先行指定 prereq → target」「輪（サイクル）がなく全部終えられるか Boolean」→ 入次数 indeg 配列＋配列キュー q の非再帰トポロジカルソート O(N+M)",
      trap: "int_safe_edge",
      trapWhy: "N <= 1 または辺 0 本なら無条件に true。キューに入った（＝入次数が 0 になった）総数 `qe == N` かどうかだけでサイクル有無が確実に判定できる。",
      blueprint: [
        "// 1. 隣接リストと入次数 indeg[target[k]]++ を構築",
        "// 2. indeg[i] == 0 をすべて配列キュー q に投入",
        "// 3. キューから取り出し後続の indeg-- が 0 なら追加 → 最後に qe == N"
      ],
      blocks: [
        { label: "自明ケースの早期 true と隣接リスト・入次数構築", code: "if (N <= 1 || prereq.isEmpty()) return true\nval indeg = IntArray(N)\n// prereq[k] -> target[k] の辺登録と indeg[target[k]]++" },
        { label: "入次数 0 の作業を配列キューに初期追加", code: "val q = IntArray(N); var qs = 0; var qe = 0\nfor (i in 0 until N) if (indeg[i] == 0) q[qe++] = i" },
        { label: "キューを回し後続の入次数が 0 になった作業を追加", code: "while (qs < qe) {\n    val u = q[qs++]\n    // u の各後続 v について if (--indeg[v] == 0) q[qe++] = v\n}" },
        { label: "全 N 作業がキューに入ったかでサイクルなし判定", code: "return qe == N" }
      ]
    },
    "area16b": {
      pattern: "prefix_count",
      signal: "「積み上げた高さ H」「単一の表示範囲 [topY, bottomY) に 1px 以上重なる個数」→ 1クエリなので配列不要！start(Long) を足しながら `start < bottomY && end > topY` を数え `start >= bottomY` で break O(N)",
      trap: "interval_bound",
      trapWhy: "① 半開区間どうしの重なり条件は `start < bottomY && end > topY`（端が接する `end == topY` や `start == bottomY` は含まない） ② 高さの累積 start は Long 必須。",
      blueprint: [
        "// 1. 空または bottomY <= topY なら 0。start = 0L, cnt = 0",
        "// 2. end = start + h。start < bottomY && end > topY なら cnt++",
        "// 3. start >= bottomY で早期 break、start = end に進めて return cnt"
      ],
      blocks: [
        { label: "空・無効範囲ガードと Long 座標 start の初期化", code: "if (H.isEmpty() || bottomY <= topY) return 0\nvar start = 0L\nvar cnt = 0" },
        { label: "半開区間 [start, end) と [topY, bottomY) の重なり判定", code: "for (h in H) {\n    val end = start + h\n    if (h > 0 && start < bottomY && end > topY) cnt++" },
        { label: "表示範囲より下に出たら早期打ち切り＆座標更新", code: "    if (start >= bottomY) break\n    start = end\n}" },
        { label: "重なった項目数を返す", code: "return cnt" }
      ]
    }
  };

  root.CODE_IMAGINE_DATA = {
    patterns: PATTERNS,
    traps: TRAPS,
    glossary: GLOSSARY,
    tasks: DATA
  };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = root.CODE_IMAGINE_DATA;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
