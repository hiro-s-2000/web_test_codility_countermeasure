/* Reading lab for the Codility study portal.
   Statements are original and follow Codility's layout.
   They are not copies of Codility's problem text.
   After the reading checks, Kotlite runs fun solution in the browser.
   That runner is a Kotlin subset. It is not the Kotlin compiler. */
(function (root) {
  "use strict";

  var tasks = [
    {
      id: "unpaired",
      group: "例題",
      runnable: true,
      title: "対にならない値",
      minutes: 15,
      signature: "fun solution(A: IntArray): Int",
      starter: "fun solution(A: IntArray): Int {\n    \n}\n",
      portalPath: "kotlin/例題1_奇数回出現要素の特定_XOR.kt",
      text: {
        ja: {
          sentences: [
            { id: "s1", text: "空ではない配列 A が与えられます。A の長さ N は奇数です。" },
            { id: "s2", text: "A に現れる値のうち、ちょうど 1 種類だけが奇数回現れます。それ以外の値は、すべて偶数回現れます。" },
            { id: "s3", text: "関数 solution は、この配列 A を受け取り、奇数回現れるその値を返します。位置や個数ではありません。" },
            { id: "s4", text: "たとえば A が [9, 3, 9, 3, 9, 7, 9] のとき、9 は 4 回、3 は 2 回、7 は 1 回なので、関数は 7 を返します。" }
          ],
          example: "A[0] = 9\nA[1] = 3\nA[2] = 9\nA[3] = 3\nA[4] = 9\nA[5] = 7\nA[6] = 9\n\nreturns 7",
          assumptions: [
            { id: "a1", text: "N は 1 以上 1,000,000 以下の奇数です。" },
            { id: "a2", text: "A の各要素は 1 以上 1,000,000,000 以下の整数です。" },
            { id: "a3", text: "奇数回現れる値は、ちょうど 1 種類です。" }
          ]
        },
        en: {
          sentences: [
            { id: "s1", text: "A non-empty array A of N integers is given. N is odd." },
            { id: "s2", text: "Exactly one value in A occurs an odd number of times. Every other value occurs an even number of times." },
            { id: "s3", text: "The function solution, given A, returns that value. It does not return an index or a count." },
            { id: "s4", text: "For example, given A = [9, 3, 9, 3, 9, 7, 9], the value 9 occurs four times, 3 occurs twice and 7 occurs once, so the function returns 7." }
          ],
          example: "A[0] = 9\nA[1] = 3\nA[2] = 9\nA[3] = 3\nA[4] = 9\nA[5] = 7\nA[6] = 9\n\nthe function returns 7",
          assumptions: [
            { id: "a1", text: "N is an odd integer within the range [1..1,000,000]." },
            { id: "a2", text: "Each element of array A is an integer within the range [1..1,000,000,000]." },
            { id: "a3", text: "Exactly one value occurs an odd number of times." }
          ]
        }
      },
      reading: [
        {
          id: "ret",
          slot: "返すもの",
          prompt: "関数が返すものはどれですか。",
          choices: [
            { id: "value", text: "奇数回現れる値そのもの" },
            { id: "index", text: "その値が最初に出る位置" },
            { id: "count", text: "奇数回現れる値の個数" },
            { id: "length", text: "配列の長さ" }
          ],
          answer: "value",
          focus: ["s3"],
          hit: "「その値を返します」と書いてあります。位置でも個数でもありません。",
          why: "文は「その値を返します」です。位置、個数、長さは返していません。"
        },
        {
          id: "ex",
          slot: "例の数",
          prompt: "例の配列 [9, 3, 9, 3, 9, 7, 9] で、関数が返す数はどれですか。",
          choices: [
            { id: "n7", text: "7" },
            { id: "n9", text: "9" },
            { id: "n4", text: "4" },
            { id: "n1", text: "1" }
          ],
          answer: "n7",
          focus: ["s4"],
          hit: "例の最後に「7 を返します」と書いてあります。",
          why: "9 は 4 回、3 は 2 回です。奇数回なのは 7 だけです。"
        },
        {
          id: "one",
          slot: "境界",
          prompt: "配列の長さが 1 のとき、その 1 個は答えになりますか。",
          choices: [
            { id: "yes", text: "なる。長さ 1 は奇数で、その値は 1 回だけ現れる" },
            { id: "no", text: "ならない。長さ 1 は前提の外" }
          ],
          answer: "yes",
          focus: ["s1", "a1"],
          hit: "長さ N は奇数で、1 もその範囲に入ります。1 回は奇数回です。",
          why: "前提は「1 以上の奇数」です。長さ 1 は外れていません。"
        },
        {
          id: "even",
          slot: "条件",
          prompt: "偶数回現れる値は、答えに残しますか。",
          choices: [
            { id: "no", text: "残さない。奇数回の 1 種類だけが答え" },
            { id: "yes", text: "残す。偶数回の値もすべて返す" }
          ],
          answer: "no",
          focus: ["s2", "s3"],
          hit: "返すのは奇数回の 1 種類だけです。偶数回の値は対になる側です。",
          why: "偶数回の値は、答えそのものではありません。"
        }
      ],
      imagine: [
        { id: "c1", prompt: "A = [4, 4, 2]", answer: "2", because: "4 は 2 回、2 は 1 回です。" },
        { id: "c2", prompt: "A = [7]", answer: "7", because: "長さ 1 の配列は、その値を返します。" },
        { id: "c3", prompt: "A = [1, 2, 1]", answer: "2", because: "1 は 2 回、2 は 1 回です。" },
        { id: "c4", prompt: "A = [8, 8, 8]", answer: "8", because: "8 は 3 回で、奇数回の値です。" }
      ],
      tests: [
        { name: "4,4,2", args: [{ ia: [4, 4, 2] }], expect: 2, because: "4 は 2 回、2 は 1 回です。" },
        { name: "7", args: [{ ia: [7] }], expect: 7, because: "長さ 1 の配列は、その値を返します。" },
        { name: "1,2,1", args: [{ ia: [1, 2, 1] }], expect: 2, because: "1 は 2 回、2 は 1 回です。" },
        { name: "8,8,8", args: [{ ia: [8, 8, 8] }], expect: 8, because: "8 は 3 回で、奇数回の値です。" }
      ],
      skeleton: [
        "// 空なら -1。1 個なら A[0]",
        "// 偶数回の値は打ち消し、残った値が答え",
        "// acc xor x を先頭から"
      ]
    },
    {
      id: "passing",
      group: "例題",
      runnable: true,
      title: "すれ違う車",
      minutes: 15,
      signature: "fun solution(A: IntArray): Int",
      starter: "fun solution(A: IntArray): Int {\n    \n}\n",
      portalPath: "kotlin/例題2_すれ違う車のペア集計_TrafficCounter.kt",
      text: {
        ja: {
          sentences: [
            { id: "s1", text: "配列 A には、一本の道を走る車が N 台、西から東への順で入っています。" },
            { id: "s2", text: "A の要素が 0 の車は東へ向かいます。1 の車は西へ向かいます。" },
            { id: "s3", text: "東へ向かう車が、西へ向かう車より西側（配列のより小さい添字）にいるとき、その 2 台はすれ違います。" },
            { id: "s4", text: "関数 solution は、すれ違う組の数を返します。組の数が 1,000,000,000 を超えるときは -1 を返します。" },
            { id: "s5", text: "たとえば A が [0, 1, 0, 1, 1] のとき、組は (0,1)、(0,3)、(0,4)、(2,3)、(2,4) の 5 組なので、関数は 5 を返します。" }
          ],
          example: "A[0] = 0\nA[1] = 1\nA[2] = 0\nA[3] = 1\nA[4] = 1\n\nreturns 5",
          assumptions: [
            { id: "a1", text: "N は 1 以上 100,000 以下です。" },
            { id: "a2", text: "A の各要素は 0 または 1 です。" },
            { id: "a3", text: "組の数が 1,000,000,000 を超えるときは -1 を返します。" }
          ]
        },
        en: {
          sentences: [
            { id: "s1", text: "Array A describes N cars on one road, ordered from west to east." },
            { id: "s2", text: "A value of 0 means the car travels east. A value of 1 means the car travels west." },
            { id: "s3", text: "Two cars pass when the eastbound car is west of the westbound car, that is, when it has the smaller index." },
            { id: "s4", text: "The function returns the number of passing pairs. If that number is greater than 1,000,000,000, the function returns -1." },
            { id: "s5", text: "For example, given A = [0, 1, 0, 1, 1], the pairs are (0,1), (0,3), (0,4), (2,3) and (2,4), so the function returns 5." }
          ],
          example: "A[0] = 0\nA[1] = 1\nA[2] = 0\nA[3] = 1\nA[4] = 1\n\nthe function returns 5",
          assumptions: [
            { id: "a1", text: "N is an integer within the range [1..100,000]." },
            { id: "a2", text: "Each element of array A is 0 or 1." },
            { id: "a3", text: "If the number of pairs is greater than 1,000,000,000, return -1." }
          ]
        }
      },
      reading: [
        {
          id: "ret",
          slot: "返すもの",
          prompt: "関数が返すものはどれですか。",
          choices: [
            { id: "pairs", text: "すれ違う組の数。1,000,000,000 を超えたら -1" },
            { id: "east", text: "東へ向かう車の台数" },
            { id: "last", text: "最後の車の進行方向" },
            { id: "always", text: "いつも -1" }
          ],
          answer: "pairs",
          focus: ["s4"],
          hit: "「組の数を返します。超えるときは -1」と書いてあります。",
          why: "台数でも進行方向でもありません。組の数で、上限を超えたときだけ -1 です。"
        },
        {
          id: "ex",
          slot: "例の数",
          prompt: "例の配列 [0, 1, 0, 1, 1] で、関数が返す数はどれですか。",
          choices: [
            { id: "n5", text: "5" },
            { id: "n4", text: "4" },
            { id: "n3", text: "3" },
            { id: "n1", text: "-1" }
          ],
          answer: "n5",
          focus: ["s5"],
          hit: "例の最後に「5 を返します」と書いてあります。",
          why: "本文は 5 組と数えています。"
        },
        {
          id: "order",
          slot: "境界",
          prompt: "A = [1, 0] の 2 台は、すれ違いますか。",
          choices: [
            { id: "no", text: "すれ違わない。東行きが、西行きより西側にいない" },
            { id: "yes", text: "すれ違う。向きが違えば、並びは関係ない" }
          ],
          answer: "no",
          focus: ["s3"],
          hit: "東行きが西行きより西側にいるときだけ、すれ違います。",
          why: "1 が先で 0 が後です。東行きが西側にいないので、この組は数えません。"
        },
        {
          id: "zero",
          slot: "条件",
          prompt: "A の値が 0 の車は、どちらへ向かいますか。",
          choices: [
            { id: "east", text: "東" },
            { id: "west", text: "西" }
          ],
          answer: "east",
          focus: ["s2"],
          hit: "0 は東、1 は西です。",
          why: "0 と 1 の向きを逆に読むと、組の数が変わります。"
        }
      ],
      imagine: [
        { id: "c1", prompt: "A = [0, 1]", answer: "1", because: "東行きのあとに西行きが 1 台います。" },
        { id: "c2", prompt: "A = [0, 0, 1]", answer: "2", because: "西行き 1 台が、西側の東行き 2 台とすれ違います。" },
        { id: "c3", prompt: "A = [1, 1, 0]", answer: "0", because: "東行きは一番東にいるので、西側の西行きとはすれ違いません。" },
        { id: "c4", prompt: "A = [0, 1, 1]", answer: "2", because: "東行き 1 台が、東側の西行き 2 台とすれ違います。" }
      ],
      tests: [
        { name: "0,1", args: [{ ia: [0, 1] }], expect: 1, because: "東行きのあとに西行きが 1 台います。" },
        { name: "0,0,1", args: [{ ia: [0, 0, 1] }], expect: 2, because: "西行き 1 台が、西側の東行き 2 台とすれ違います。" },
        { name: "1,1,0", args: [{ ia: [1, 1, 0] }], expect: 0, because: "東行きは一番東にいるので、すれ違いません。" },
        { name: "0,1,1", args: [{ ia: [0, 1, 1] }], expect: 2, because: "東行き 1 台が、東側の西行き 2 台とすれ違います。" }
      ],
      skeleton: [
        "// 0 を見るたびに cnt を 1 増やす",
        "// 1 を見たら ans に cnt を足す",
        "// ans が 10 億を超えたら -1。足し算は Long"
      ]
    },
    {
      id: "window",
      group: "例題",
      runnable: true,
      title: "和が届く最短の長さ",
      minutes: 20,
      signature: "fun solution(K: Int, A: IntArray): Int",
      starter: "fun solution(K: Int, A: IntArray): Int {\n    \n}\n",
      portalPath: "kotlin/例題3_最小連続区間長_尺取り法.kt",
      text: {
        ja: {
          sentences: [
            { id: "s1", text: "正の整数だけが入った配列 A と、正の整数 K が与えられます。" },
            { id: "s2", text: "A の連続した一部分だけを見ます。その和が K 以上になるもののうち、長さが最も短いものを探します。" },
            { id: "s3", text: "関数 solution は、その最短の長さを返します。和が K 以上になる連続部分が一つもなければ、0 を返します。" },
            { id: "s4", text: "たとえば A が [2, 3, 1, 2, 4, 3] で K が 7 のとき、隣り合う 4 と 3 の長さ 2 で和が 7 になります。これより短い連続部分では和が 7 以上にならないので、関数は 2 を返します。" }
          ],
          example: "K = 7\nA[0] = 2\nA[1] = 3\nA[2] = 1\nA[3] = 2\nA[4] = 4\nA[5] = 3\n\nreturns 2",
          assumptions: [
            { id: "a1", text: "A の長さ N は 1 以上 100,000 以下です。" },
            { id: "a2", text: "A の各要素と K は、1 以上 1,000,000,000 以下の整数です。" },
            { id: "a3", text: "見るのは連続した一部分だけです。離れた要素を飛び越えて足しません。" }
          ]
        },
        en: {
          sentences: [
            { id: "s1", text: "An array A of positive integers and a positive integer K are given." },
            { id: "s2", text: "Look only at contiguous slices of A. Among the slices whose sum is at least K, find one with the smallest length." },
            { id: "s3", text: "The function returns that length. If no contiguous slice sums to at least K, it returns 0." },
            { id: "s4", text: "For example, given A = [2, 3, 1, 2, 4, 3] and K = 7, the neighbouring values 4 and 3 have length 2 and sum 7. No shorter contiguous slice sums to at least 7, so the function returns 2." }
          ],
          example: "K = 7\nA[0] = 2\nA[1] = 3\nA[2] = 1\nA[3] = 2\nA[4] = 4\nA[5] = 3\n\nthe function returns 2",
          assumptions: [
            { id: "a1", text: "N, the length of A, is an integer within the range [1..100,000]." },
            { id: "a2", text: "Each element of A, and K, is an integer within the range [1..1,000,000,000]." },
            { id: "a3", text: "Only contiguous slices count. Do not add elements that are not neighbours in the slice." }
          ]
        }
      },
      reading: [
        {
          id: "ret",
          slot: "返すもの",
          prompt: "関数が返すものはどれですか。",
          choices: [
            { id: "len", text: "和が K 以上になる連続部分のうち、最も短い長さ。無ければ 0" },
            { id: "sum", text: "その部分の和" },
            { id: "slice", text: "その部分の要素を並べたもの" },
            { id: "count", text: "条件を満たす部分の個数" }
          ],
          answer: "len",
          focus: ["s3"],
          hit: "「最短の長さを返します。無ければ 0」と書いてあります。",
          why: "和そのものでも、要素の並びでも、個数でもありません。"
        },
        {
          id: "ex",
          slot: "例の数",
          prompt: "例（A = [2, 3, 1, 2, 4, 3]、K = 7）で、関数が返す数はどれですか。",
          choices: [
            { id: "n2", text: "2" },
            { id: "n7", text: "7" },
            { id: "n4", text: "4" },
            { id: "n6", text: "6" }
          ],
          answer: "n2",
          focus: ["s4"],
          hit: "例の最後に「2 を返します」と書いてあります。7 は和です。",
          why: "7 は和、4 と 3 は要素です。返すのは長さの 2 です。"
        },
        {
          id: "ge",
          slot: "条件",
          prompt: "和が K より大きい連続部分は、候補に入りますか。",
          choices: [
            { id: "yes", text: "入る。K 以上なら候補" },
            { id: "no", text: "入らない。和が K ちょうどだけ" }
          ],
          answer: "yes",
          focus: ["s2"],
          hit: "本文は「K 以上」です。ちょうど K だけ、ではありません。",
          why: "K より大きくても、K 以上なので候補です。"
        },
        {
          id: "contig",
          slot: "境界",
          prompt: "隣り合っていない要素だけを選んで足した和は、見てよいですか。",
          choices: [
            { id: "no", text: "見ない。連続した一部分だけ" },
            { id: "yes", text: "見る。どの位置を選んでもよい" }
          ],
          answer: "no",
          focus: ["s2", "a3"],
          hit: "「連続した一部分だけ」です。飛び越えて足しません。",
          why: "離れた要素の和は、この関数の対象ではありません。"
        }
      ],
      imagine: [
        { id: "c1", prompt: "A = [1, 1]、K = 3", answer: "0", because: "連続部分の和は最大でも 2 で、3 に届きません。" },
        { id: "c2", prompt: "A = [5]、K = 5", answer: "1", because: "長さ 1 の [5] で和が 5 です。" },
        { id: "c3", prompt: "A = [1, 2, 3]、K = 6", answer: "3", because: "全体の和が 6 で、それより短い連続部分では届きません。" },
        { id: "c4", prompt: "A = [1, 4, 4]、K = 8", answer: "2", because: "隣り合う 4 と 4 の長さ 2 で和が 8 です。" }
      ],
      tests: [
        { name: "届かない", args: [{ n: 3 }, { ia: [1, 1] }], expect: 0, because: "連続部分の和は最大でも 2 で、3 に届きません。" },
        { name: "1個", args: [{ n: 5 }, { ia: [5] }], expect: 1, because: "長さ 1 の [5] で和が 5 です。" },
        { name: "全体", args: [{ n: 6 }, { ia: [1, 2, 3] }], expect: 3, because: "全体の和が 6 で、それより短い連続部分では届きません。" },
        { name: "隣", args: [{ n: 8 }, { ia: [1, 4, 4] }], expect: 2, because: "隣り合う 4 と 4 の長さ 2 で和が 8 です。" }
      ],
      skeleton: [
        "// 右端を伸ばし、和が K 以上のあいだ左端を縮める",
        "// そのときの長さの最小を残す",
        "// 一度も届かなければ 0"
      ]
    }
  ];

  function normalizeTask(task) {
    if (!task.text) {
      task.text = {
        ja: {
          sentences: task.sentences || [],
          example: task.example || "",
          assumptions: task.assumptions || []
        }
      };
    }
    if (!task.group) task.group = "練習";
    if (task.runnable == null) task.runnable = true;
    if (!task.tests) task.tests = [];
    (task.reading || []).forEach(function (q) {
      if (!q.hit) q.hit = "強調した文が、その答えの根拠です。";
      if (!q.why) q.why = "強調した文と、選んだ答えが食い違っています。";
      if (!q.focus) q.focus = [];
    });
    return task;
  }

  tasks.forEach(normalizeTask);
  (root.LAB_EXTRA || []).forEach(function (raw) {
    tasks.push(normalizeTask(raw));
  });
  tasks.forEach(function (task) {
    var found = (root.LAB_ANSWERS || {})[task.id];
    task.answer = found && found.code ? found : null;
  });

  function normalizeAnswer(value) {
    return String(value == null ? "" : value)
      .trim()
      .replace(/[０-９]/g, function (ch) {
        return String.fromCharCode(ch.charCodeAt(0) - 0xfee0);
      })
      .replace(/ー/g, "-")
      .replace(/\s+/g, "");
  }

  function gradeReading(task, questionId, choiceId) {
    var q = null;
    var i;
    for (i = 0; i < task.reading.length; i += 1) {
      if (task.reading[i].id === questionId) q = task.reading[i];
    }
    if (!q) return { ok: false, why: "設問が見つかりません。", focus: [] };
    var ok = choiceId === q.answer;
    return { ok: ok, why: ok ? q.hit : q.why, focus: q.focus.slice() };
  }

  function gradeImagine(task, answers) {
    var rows = task.imagine.map(function (item) {
      var actual = normalizeAnswer(answers ? answers[item.id] : "");
      var expected = normalizeAnswer(item.answer);
      var empty = actual === "";
      return {
        id: item.id,
        prompt: item.prompt,
        expected: item.answer,
        actual: actual,
        empty: empty,
        ok: !empty && actual === expected,
        because: item.because
      };
    });
    var ok = rows.every(function (row) { return row.ok; });
    return { ok: ok, rows: rows };
  }

  function selfTest() {
    var errors = [];
    tasks.forEach(function (task) {
      task.reading.forEach(function (q) {
        var found = q.choices.some(function (c) { return c.id === q.answer; });
        if (!found) errors.push(task.id + " choice missing " + q.answer);
        var bad = null;
        q.choices.forEach(function (c) {
          if (c.id !== q.answer && !bad) bad = c;
        });
        var wrong = gradeReading(task, q.id, bad.id);
        if (wrong.ok) errors.push(task.id + " wrong accepted " + q.id);
        if (!wrong.focus.length) errors.push(task.id + " no focus " + q.id);
        if (!wrong.why) errors.push(task.id + " no why " + q.id);
        var right = gradeReading(task, q.id, q.answer);
        if (!right.ok) errors.push(task.id + " right rejected " + q.id);
        ["ja", "en"].forEach(function (lang) {
          var pack = task.text[lang];
          if (!pack) return;
          var ids = {};
          pack.sentences.forEach(function (s) { ids[s.id] = true; });
          pack.assumptions.forEach(function (s) { ids[s.id] = true; });
          q.focus.forEach(function (id) {
            if (!ids[id]) errors.push(lang + " missing " + id + " in " + task.id);
          });
        });
      });
      if (task.imagine && task.imagine.length) {
        var answers = {};
        task.imagine.forEach(function (c) { answers[c.id] = c.answer; });
        if (!gradeImagine(task, answers).ok) errors.push(task.id + " imagine failed");
        var badMap = {};
        task.imagine.forEach(function (c) { badMap[c.id] = c.answer; });
        badMap[task.imagine[0].id] = task.imagine[0].answer === "0" ? "1" : "0";
        if (gradeImagine(task, badMap).ok) errors.push(task.id + " bad imagine passed");
        var wide = {};
        task.imagine.forEach(function (c) { wide[c.id] = c.answer; });
        wide[task.imagine[0].id] = String(task.imagine[0].answer).replace(/\d/g, function (d) {
          return String.fromCharCode(d.charCodeAt(0) + 0xfee0);
        });
        if (!gradeImagine(task, wide).ok) errors.push(task.id + " fullwidth rejected");
      }
    });
    return errors;
  }

  var api = {
    tasks: tasks,
    normalizeAnswer: normalizeAnswer,
    gradeReading: gradeReading,
    gradeImagine: gradeImagine,
    selfTest: selfTest
  };
  root.ReadingLab = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;

  if (typeof document === "undefined" || root.SKIP_READING_LAB_BOOT) return;

  var STORE = "reading-lab-v2";
  var stepTimer = 0;

  function emptyState() {
    return { taskId: tasks[0].id, lang: "ja", theme: "dark", solved: {}, code: {}, imagine: {}, breaks: {}, answerOpen: {} };
  }

  function loadState() {
    var state = emptyState();
    try {
      var raw = localStorage.getItem(STORE) || localStorage.getItem("reading-lab-v1");
      if (!raw) return state;
      var data = JSON.parse(raw);
      if (!data || typeof data !== "object") return state;
      if (tasks.some(function (t) { return t.id === data.taskId; })) state.taskId = data.taskId;
      if (data.lang === "en" || data.lang === "ja") state.lang = data.lang;
      if (data.theme === "light" || data.theme === "dark") state.theme = data.theme;
      if (data.solved && typeof data.solved === "object") state.solved = data.solved;
      if (data.code && typeof data.code === "object") state.code = data.code;
      if (data.imagine && typeof data.imagine === "object") state.imagine = data.imagine;
      if (data.breaks && typeof data.breaks === "object") state.breaks = data.breaks;
      if (data.answerOpen && typeof data.answerOpen === "object") state.answerOpen = data.answerOpen;
    } catch (e) {
      return emptyState();
    }
    return state;
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORE, JSON.stringify(state));
    } catch (e) {
      /* The page still works for this visit if storage is blocked. */
    }
  }

  function taskById(id) {
    var i;
    for (i = 0; i < tasks.length; i += 1) {
      if (tasks[i].id === id) return tasks[i];
    }
    return tasks[0];
  }

  function solvedSet(state, task) {
    var list = state.solved[task.id];
    if (!Array.isArray(list)) list = [];
    var set = {};
    list.forEach(function (id) { set[id] = true; });
    return set;
  }

  function readingDone(state, task) {
    var set = solvedSet(state, task);
    return task.reading.every(function (q) { return set[q.id]; });
  }

  function nextQuestion(state, task) {
    var set = solvedSet(state, task);
    var i;
    for (i = 0; i < task.reading.length; i += 1) {
      if (!set[task.reading[i].id]) return task.reading[i];
    }
    return null;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function scrollInside(container, node) {
    var c = container.getBoundingClientRect();
    var r = node.getBoundingClientRect();
    if (r.top < c.top) container.scrollTop -= c.top - r.top + 12;
    else if (r.bottom > c.bottom) container.scrollTop += r.bottom - c.bottom + 12;
  }

  function markFocus(container, ids, kind) {
    var nodes = container.querySelectorAll("[data-sid]");
    Array.prototype.forEach.call(nodes, function (node) {
      node.classList.remove("is-hit", "is-miss");
      if (ids.indexOf(node.getAttribute("data-sid")) !== -1) {
        node.classList.add(kind === "hit" ? "is-hit" : "is-miss");
        scrollInside(container, node);
      }
    });
  }

  function boot() {
    var state = loadState();
    var feedback = null;
    var runView = null;
    var debugSession = null;
    document.documentElement.setAttribute("data-theme", state.theme);

    var app = document.getElementById("app");
    var taskPick = document.getElementById("taskPick");
    var langJa = document.getElementById("langJa");
    var langEn = document.getElementById("langEn");
    var themeBtn = document.getElementById("themeBtn");

    function persist() {
      saveState(state);
    }

    function renderChrome() {
      var groups = [];
      var byName = {};
      tasks.forEach(function (task) {
        var name = task.group || "練習";
        if (!byName[name]) {
          byName[name] = [];
          groups.push(name);
        }
        byName[name].push(task);
      });
      taskPick.textContent = "";
      groups.forEach(function (name) {
        var group = document.createElement("optgroup");
        group.label = name;
        byName[name].forEach(function (task) {
          var option = document.createElement("option");
          option.value = task.id;
          option.textContent = task.title;
          if (task.id === state.taskId) option.selected = true;
          group.appendChild(option);
        });
        taskPick.appendChild(group);
      });
      var current = taskById(state.taskId);
      langEn.disabled = !current.text.en;
      langJa.classList.toggle("is-on", state.lang === "ja" || !current.text.en);
      langEn.classList.toggle("is-on", state.lang === "en" && !!current.text.en);
      themeBtn.textContent = state.theme === "dark" ? "明るい画面" : "暗い画面";
    }

    function renderStatement(task, pack) {
      var pane = el("section", "statement");
      pane.appendChild(el("p", "eyebrow", "Task description"));
      pane.appendChild(el("h1", null, task.title));
      pane.appendChild(el("p", "minutes", "目安 " + task.minutes + " 分。Codility と同じ並びの自作文で、公式の文面そのものではありません。"));
      pack.sentences.forEach(function (sentence) {
        var p = el("p", "sentence", sentence.text);
        p.setAttribute("data-sid", sentence.id);
        pane.appendChild(p);
      });
      pane.appendChild(el("h2", null, "関数"));
      pane.appendChild(el("pre", "signature", task.signature));
      pane.appendChild(el("h2", null, "例"));
      var example = el("pre", "example", pack.example);
      pane.appendChild(example);
      pane.appendChild(el("h2", null, "前提"));
      var list = el("ul", "assumptions");
      pack.assumptions.forEach(function (item) {
        var li = el("li", "sentence", item.text);
        li.setAttribute("data-sid", item.id);
        list.appendChild(li);
      });
      pane.appendChild(list);
      return pane;
    }

    function renderReading(task) {
      var card = el("section", "card");
      var done = readingDone(state, task);
      var set = solvedSet(state, task);
      var solvedCount = task.reading.filter(function (q) { return set[q.id]; }).length;
      card.appendChild(el("h2", null, "1. 問題文を読む"));
      card.appendChild(el("p", "lead", "コードの前に、返すもの、例の数、境界、条件を拾います。選んだ答えが違うときは、左の文を色で示します。"));
      var slots = el("ol", "slots");
      task.reading.forEach(function (q) {
        var li = el("li", set[q.id] ? "is-done" : "", q.slot);
        slots.appendChild(li);
      });
      card.appendChild(slots);
      card.appendChild(el("p", "progress", "読解 " + solvedCount + " / " + task.reading.length));

      if (done) {
        card.appendChild(el("p", "ok-note", "4問とも拾えました。エディタに書けます。"));
        var again = el("button", "text-btn", "この問題の読解をはじめから");
        again.type = "button";
        again.addEventListener("click", function () {
          if (!window.confirm("この問題の読解の答えを消して、最初の問いに戻します。")) return;
          state.solved[task.id] = [];
          feedback = null;
          persist();
          render();
        });
        card.appendChild(again);
        return card;
      }

      var q = nextQuestion(state, task);
      card.appendChild(el("p", "slot-label", q.slot));
      card.appendChild(el("p", "prompt", q.prompt));
      q.choices.forEach(function (choice) {
        var btn = el("button", "choice", choice.text);
        btn.type = "button";
        btn.addEventListener("click", function () {
          var result = gradeReading(task, q.id, choice.id);
          var statement = document.querySelector(".statement");
          if (statement) markFocus(statement, result.focus, result.ok ? "hit" : "miss");
          feedback = { ok: result.ok, why: result.why };
          if (result.ok) {
            var list = Array.isArray(state.solved[task.id]) ? state.solved[task.id].slice() : [];
            if (list.indexOf(q.id) === -1) list.push(q.id);
            state.solved[task.id] = list;
            persist();
            var choices = card.querySelectorAll(".choice");
            Array.prototype.forEach.call(choices, function (choiceBtn) {
              choiceBtn.disabled = true;
            });
            window.clearTimeout(stepTimer);
            stepTimer = window.setTimeout(function () {
              feedback = null;
              render();
            }, 900);
          }
          renderFeedback(card, statement);
        });
        card.appendChild(btn);
      });
      if (feedback) card.appendChild(feedbackNode(feedback));
      return card;
    }

    function feedbackNode(item) {
      return el("p", item.ok ? "feedback is-ok" : "feedback is-bad", item.why);
    }

    function renderFeedback(card, statement) {
      var old = card.querySelector(".feedback");
      if (old) old.remove();
      if (feedback) card.appendChild(feedbackNode(feedback));
      if (statement && feedback) {
        /* Focus was marked before this redraw. Restore it on the new statement. */
      }
    }

    function currentCode(task) {
      return Object.prototype.hasOwnProperty.call(state.code, task.id) ? state.code[task.id] : task.starter;
    }

    function breakList(task) {
      var list = state.breaks[task.id];
      return Array.isArray(list) ? list : [];
    }

    function breakMap(task) {
      var map = {};
      breakList(task).forEach(function (n) { map[n] = true; });
      return map;
    }

    function renderEditor(task) {
      var card = el("section", "card");
      var done = readingDone(state, task);
      var now = runView && runView.paused ? runView.paused.line : 0;
      card.appendChild(el("h2", null, "2. コードを書いて、止めて、見る"));
      card.appendChild(el("p", "lead", done
        ? "署名だけ入っています。中身は自分で打ちます。行番号を押すとその行で止まります。実行はブラウザの中だけで、Int は 32 ビットで一周します。class と data class は動きません。"
        : "読解の 4 問が終わるまで、ここには打ちません。"));
      var wrap = el("div", "editor");
      var gutter = el("div", "gutter");
      var area = document.createElement("textarea");
      area.className = "code";
      area.spellcheck = false;
      area.autocomplete = "off";
      area.setAttribute("aria-label", "Kotlin のエディタ");
      area.value = currentCode(task);
      area.disabled = !done;
      function syncGutter() {
        var n = Math.max(1, area.value.split("\n").length);
        var marks = breakMap(task);
        gutter.textContent = "";
        var i;
        for (i = 1; i <= n; i += 1) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "line-no" + (marks[i] ? " is-break" : "") + (i === now ? " is-now" : "");
          btn.textContent = String(i);
          btn.disabled = !done;
          btn.setAttribute("aria-label", i + "行で止める");
          (function (line) {
            btn.addEventListener("click", function () {
              var list = breakList(task).slice();
              var at = list.indexOf(line);
              if (at === -1) list.push(line);
              else list.splice(at, 1);
              state.breaks[task.id] = list;
              persist();
              syncGutter();
            });
          })(i);
          gutter.appendChild(btn);
        }
        gutter.scrollTop = area.scrollTop;
      }
      area.addEventListener("input", function () {
        state.code[task.id] = area.value;
        persist();
        syncGutter();
      });
      area.addEventListener("scroll", function () {
        gutter.scrollTop = area.scrollTop;
      });
      area.addEventListener("keydown", function (event) {
        if (event.key !== "Tab" || area.disabled) return;
        event.preventDefault();
        var start = area.selectionStart;
        var end = area.selectionEnd;
        area.value = area.value.slice(0, start) + "    " + area.value.slice(end);
        area.selectionStart = start + 4;
        area.selectionEnd = start + 4;
        state.code[task.id] = area.value;
        persist();
        syncGutter();
      });
      wrap.appendChild(gutter);
      wrap.appendChild(area);
      card.appendChild(wrap);
      syncGutter();
      var reset = el("button", "text-btn", "この問題のコードを署名だけに戻す");
      reset.type = "button";
      reset.disabled = !done;
      reset.addEventListener("click", function () {
        if (!window.confirm("この問題のエディタを、署名だけの状態に戻します。")) return;
        state.code[task.id] = task.starter;
        debugSession = null;
        runView = null;
        persist();
        render();
      });
      card.appendChild(reset);
      return card;
    }

    function renderAnswer(task) {
      var card = el("section", "card answer-card");
      card.appendChild(el("h2", null, "解答コード"));
      if (!task.answer) {
        card.appendChild(el("p", "lead", "この問題の解答コードは、まだ用意していません。"));
        return card;
      }
      var done = readingDone(state, task);
      card.appendChild(el("p", "lead", "書けないときに開きます。考え方を読んでから、自分の手で打ち直すと身につきます。"));
      var box = document.createElement("details");
      box.className = "answer";
      box.open = !!state.answerOpen[task.id];
      box.addEventListener("toggle", function () {
        state.answerOpen[task.id] = box.open;
        persist();
      });
      box.appendChild(el("summary", null, "解答コードと考え方を開く"));
      box.appendChild(el("h3", null, "考え方"));
      var notes = el("ul", "answer-notes");
      (task.answer.notes || []).forEach(function (line) {
        notes.appendChild(el("li", null, line));
      });
      box.appendChild(notes);
      box.appendChild(el("h3", null, "コード"));
      box.appendChild(el("pre", "skeleton answer-code", task.answer.code));
      var bar = el("div", "run-bar");
      var put = el("button", "run-btn", "エディタに入れる");
      put.type = "button";
      put.disabled = !done;
      put.addEventListener("click", function () {
        var now = currentCode(task);
        if (now !== task.starter && now !== task.answer.code &&
            !window.confirm("いまエディタにあるコードを、解答コードで置き換えます。")) return;
        state.code[task.id] = task.answer.code;
        debugSession = null;
        runView = null;
        persist();
        render();
      });
      var copy = el("button", "run-btn", "コピー");
      copy.type = "button";
      copy.addEventListener("click", function () {
        var text = task.answer.code;
        function said(msg) { copy.textContent = msg; window.setTimeout(function () { copy.textContent = "コピー"; }, 1500); }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { said("コピーしました"); }, function () { said("コピーできません"); });
        } else {
          said("コピーできません");
        }
      });
      bar.appendChild(put);
      bar.appendChild(copy);
      box.appendChild(bar);
      if (!done) box.appendChild(el("p", "wait-note", "エディタに入れるのは、読解の 4 問のあとです。コードを読むことは、いつでもできます。"));
      if (!task.runnable) box.appendChild(el("p", "wait-note", "この問題は class を使うので、このページでは実行できません。読んで、手で打つ練習に使ってください。"));
      card.appendChild(box);
      return card;
    }

    function shown(value) {
      if (typeof value === "string") return JSON.stringify(value);
      if (Array.isArray(value)) return JSON.stringify(value);
      return String(value);
    }

    function takeResult(result, queue) {
      var rows = runView && runView.rows ? runView.rows.slice() : [];
      rows = rows.concat(result.results || []);
      if (result.paused) {
        debugSession = result;
        debugSession.queue = queue;
        runView = { error: "", rows: rows, paused: result.paused, output: result.paused.output || [] };
        return;
      }
      debugSession = null;
      runView = { error: "", rows: rows, paused: null, output: (result.ctx && result.ctx.output) || [] };
    }

    function failRun(error) {
      debugSession = null;
      runView = {
        error: (error && error.line ? error.line + "行: " : "") + (error && error.message ? error.message : "実行できませんでした"),
        rows: runView && runView.rows ? runView.rows : [],
        paused: null,
        output: []
      };
    }

    function runQueue(queue, mode) {
      var task = taskById(state.taskId);
      if (!queue.length) return;
      try {
        var result = root.Kotlite.runTests(currentCode(task), queue, {
          breakpoints: breakMap(task),
          mode: mode === "step" ? "step" : "run"
        });
        var rest = result.paused ? queue.slice((result.results || []).length + 1) : [];
        takeResult(result, rest);
      } catch (error) {
        failRun(error);
      }
    }

    function resumeRun(mode) {
      var task = taskById(state.taskId);
      if (!debugSession) return;
      var queue = debugSession.queue || [];
      try {
        var result = root.Kotlite.resume(debugSession, mode === "step" ? "step" : "continue", breakMap(task));
        if (result.paused) {
          debugSession = result;
          debugSession.queue = queue;
          runView.paused = result.paused;
          runView.output = result.paused.output || [];
          return;
        }
        var row = result.results[result.results.length - 1];
        runView.rows = (runView.rows || []).concat([row]);
        runView.paused = null;
        runView.output = [];
        debugSession = null;
        if (queue.length) runQueue(queue, mode === "step" ? "step" : "run");
      } catch (error) {
        failRun(error);
      }
    }

    function renderRun(task) {
      var card = el("section", "card");
      var done = readingDone(state, task);
      card.appendChild(el("h2", null, "3. サンプルを実行する"));
      if (!task.runnable) {
        card.appendChild(el("p", "lead", "この問題は class を使うので、このページの実行機では動きません。問題文の読解だけ行い、実装はポータルのコードを開いて読んでください。"));
        var blocked = document.createElement("a");
        blocked.className = "portal-link";
        blocked.href = "./index.html#" + encodeURI(task.portalPath);
        blocked.textContent = "ポータルの該当ページを開く";
        card.appendChild(blocked);
        return card;
      }
      card.appendChild(el("p", "lead", "サンプル入力で fun solution を動かします。止めた行の変数が下に出ます。合わない行には、問題文が求める値が出ます。"));
      if (!done) {
        card.appendChild(el("p", "wait-note", "読解のあとで開きます。"));
        return card;
      }
      if (!root.Kotlite) {
        card.appendChild(el("p", "feedback is-bad", "実行プログラムが読み込めていません。"));
        return card;
      }
      var bar = el("div", "run-bar");
      var run = el("button", "run-btn", "サンプルを実行");
      run.type = "button";
      var step = el("button", "run-btn", "1行進む");
      step.type = "button";
      var cont = el("button", "run-btn", "次の停止まで");
      cont.type = "button";
      cont.disabled = !debugSession;
      run.addEventListener("click", function () {
        runView = { error: "", rows: [], paused: null, output: [] };
        debugSession = null;
        runQueue(task.tests || [], "run");
        render();
      });
      step.addEventListener("click", function () {
        if (!debugSession) {
          runView = { error: "", rows: [], paused: null, output: [] };
          runQueue(task.tests || [], "step");
        } else {
          resumeRun("step");
        }
        render();
      });
      cont.addEventListener("click", function () {
        resumeRun("continue");
        render();
      });
      bar.appendChild(run);
      bar.appendChild(step);
      bar.appendChild(cont);
      card.appendChild(bar);
      if (runView && runView.error) card.appendChild(el("p", "feedback is-bad", runView.error));
      if (runView && runView.paused) {
        var pause = el("p", "feedback is-ok", runView.paused.line + "行で止まっています。テスト「" + (runView.paused.test || "") + "」。");
        card.appendChild(pause);
        var vars = el("ul", "vars");
        (runView.paused.vars || []).forEach(function (row) {
          vars.appendChild(el("li", null, row.name + " = " + row.value));
        });
        if (!(runView.paused.vars || []).length) vars.appendChild(el("li", null, "（この行の手前では、ローカル変数はまだありません）"));
        card.appendChild(vars);
      }
      if (runView && runView.output && runView.output.length) {
        card.appendChild(el("pre", "example", runView.output.join("\n")));
      }
      if (runView && runView.rows && runView.rows.length) {
        var box = el("div", "report");
        runView.rows.forEach(function (row) {
          var line = el("p", row.ok ? "report-line is-ok" : "report-line is-bad");
          if (row.ok) line.textContent = row.name + " … 返り値 " + shown(row.actual) + " で合っています。";
          else line.textContent = row.name + " … 動いた結果は " + shown(row.actual) + "、問題文どおりなら " + shown(row.expected) + "。" + (row.message || "");
          box.appendChild(line);
        });
        card.appendChild(box);
        var allOk = task.tests && task.tests.length && runView.rows.length === task.tests.length && runView.rows.every(function (row) { return row.ok; });
        if (allOk && !runView.paused) {
          card.appendChild(el("p", "ok-note", "サンプルは全部、問題文どおりの返り値です。"));
          if (task.skeleton && task.skeleton.length) {
            card.appendChild(el("h3", null, "見比べる骨格"));
            card.appendChild(el("p", "lead", "エディタへは入れません。必要なら、自分のコードへ打ち直してください。"));
            card.appendChild(el("pre", "skeleton", task.skeleton.join("\n")));
          }
          var link = document.createElement("a");
          link.className = "portal-link";
          link.href = "./index.html#" + encodeURI(task.portalPath);
          link.textContent = "同じ型の例題コードをポータルで開く（答えです）";
          card.appendChild(link);
        }
      }
      return card;
    }

    function render() {
      window.clearTimeout(stepTimer);
      var task = taskById(state.taskId);
      var pack = task.text[state.lang] || task.text.ja;
      renderChrome();
      app.textContent = "";
      var statement = renderStatement(task, pack);
      var work = el("div", "work");
      work.appendChild(el("p", "how", "左が問題文です。先に右の 4 問へ答え、そのあとエディタに書いてサンプルを実行します。"));
      var readingCard = renderReading(task);
      work.appendChild(readingCard);
      work.appendChild(renderEditor(task));
      work.appendChild(renderAnswer(task));
      work.appendChild(renderRun(task));
      app.appendChild(statement);
      app.appendChild(work);
      if (feedback) markFocus(statement, focusIdsForCurrent(task), feedback.ok ? "hit" : "miss");
    }

    function focusIdsForCurrent(task) {
      var q = nextQuestion(state, task);
      if (!q) return [];
      var result = gradeReading(task, q.id, q.answer);
      /* After a correct answer the question is already stored, so highlight the sentence of the feedback we just showed. */
      if (feedback && feedback.ok) {
        var set = solvedSet(state, task);
        var last = null;
        task.reading.forEach(function (item) {
          if (set[item.id]) last = item;
        });
        return last ? last.focus : result.focus;
      }
      return q.focus;
    }

    taskPick.addEventListener("change", function () {
      feedback = null;
      runView = null;
      debugSession = null;
      state.taskId = taskPick.value;
      if (!taskById(state.taskId).text.en) state.lang = "ja";
      persist();
      render();
    });
    langJa.addEventListener("click", function () {
      state.lang = "ja";
      persist();
      render();
    });
    langEn.addEventListener("click", function () {
      state.lang = "en";
      persist();
      render();
    });
    themeBtn.addEventListener("click", function () {
      state.theme = state.theme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", state.theme);
      persist();
      render();
    });

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
