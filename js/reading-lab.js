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
    var enExtra = root.EXAM_STATEMENTS_EN && root.EXAM_STATEMENTS_EN[task.id];
    if (!task.text.en && enExtra && enExtra.sentences && enExtra.sentences.length) {
      task.text.en = {
        title: enExtra.title || task.title,
        sentences: enExtra.sentences,
        example: enExtra.example || "",
        assumptions: enExtra.assumptions || []
      };
    } else if (task.text.en && enExtra && enExtra.title && !task.text.en.title) {
      task.text.en.title = enExtra.title;
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
    var ci = root.CODE_IMAGINE_DATA && root.CODE_IMAGINE_DATA.tasks && root.CODE_IMAGINE_DATA.tasks[task.id];
    task.codeImagine = ci || null;
    if ((!task.skeleton || !task.skeleton.length) && ci && ci.blueprint) {
      task.skeleton = ci.blueprint.slice();
    }
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

  if (typeof document === "undefined") return;

  /* The trainer below is the reading and code-imagination part of the practice page.
     timed-auto.js mounts it; this file no longer owns a page of its own. */
  var STORE = "reading-lab-v3";

  var SIGNAL_REGEX = /\b(contiguous slices?|contiguous subarray|contiguous|at least|at most|minimize the maximum|inclusive|half-open|odd number of times|even number of times|non-overlapping|simultaneously|4-directionally|prerequisite|cycle|least recently used|LRU|leading zeros?|divisors?|modulo|cooldown|1,000,000,000|10,000,000,000|1,048,575|returns -1)\b/gi;

  function emptyState() {
    return {
      solved: {},
      patternOk: {},
      trapOk: {},
      blockStep: {},
      peeked: {},
      code: {},
      answerOpen: {}
    };
  }

  function loadState() {
    var state = emptyState();
    try {
      var raw = localStorage.getItem(STORE) || localStorage.getItem("reading-lab-v2") || localStorage.getItem("reading-lab-v1");
      if (raw) {
        var data = JSON.parse(raw);
        if (data && typeof data === "object") {
          Object.keys(state).forEach(function (key) {
            if (data[key] && typeof data[key] === "object") state[key] = data[key];
          });
        }
      }
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

  function hashSeed(str) {
    var h = 2166136261;
    var i;
    for (i = 0; i < str.length; i += 1) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function seededShuffle(items, seedStr) {
    var arr = items.slice();
    var s = hashSeed(seedStr) || 1;
    var i;
    for (i = arr.length - 1; i > 0; i -= 1) {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      var j = s % (i + 1);
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    /* Avoid returning exact original order when shuffling code blocks */
    if (arr.length > 1 && arr.every(function (v, idx) { return v === items[idx]; })) {
      var first = arr[0];
      arr[0] = arr[1];
      arr[1] = first;
    }
    return arr;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function codePre(className, codeText, labelText) {
    var pre = el("pre", className);
    if (labelText) {
      pre.setAttribute("role", "region");
      pre.setAttribute("aria-label", labelText);
      pre.setAttribute("tabindex", "0");
    }
    pre.appendChild(el("code", null, codeText));
    return pre;
  }

  function appendHighlightedEnglish(container, text) {
    SIGNAL_REGEX.lastIndex = 0;
    var last = 0;
    var m;
    while ((m = SIGNAL_REGEX.exec(text)) !== null) {
      if (m.index > last) container.appendChild(document.createTextNode(text.slice(last, m.index)));
      container.appendChild(el("mark", "sig-word", m[0]));
      last = m.index + m[0].length;
    }
    if (last < text.length) container.appendChild(document.createTextNode(text.slice(last)));
  }

  function buildCommentStarter(task, shell) {
    var lines = (task.codeImagine && task.codeImagine.blueprint) || task.skeleton || [];
    var base = shell || task.starter || "";
    if (!lines.length) return base;
    var commentBlock = lines.map(function (l) { return "    " + l; }).join("\n");
    var brace = base.indexOf("{");
    if (brace === -1) return lines.join("\n") + "\n" + base;
    return base.slice(0, brace + 1) + "\n" + commentBlock + "\n    \n}\n";
  }

  /* Reading questions as an exam sheet: the choice is only kept, and graded on submit. */
  function renderExamQuestions(host, task, chosen, onPick) {
    host.textContent = "";
    chosen = chosen || {};
    if (!(task.reading || []).length) {
      host.appendChild(el("p", "muted", "この問題には選択問題がありません。"));
      return;
    }
    task.reading.forEach(function (question, index) {
      var field = el("fieldset", "reading-question");
      field.appendChild(el("legend", null, (index + 1) + ". " + question.prompt));
      question.choices.forEach(function (choice) {
        var label = el("label", "reading-choice");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "reading-" + index;
        input.value = choice.id;
        input.checked = chosen[question.id] === choice.id;
        input.addEventListener("change", function () {
          onPick(question.id, choice.id);
        });
        label.appendChild(input);
        label.appendChild(el("span", null, choice.text));
        field.appendChild(label);
      });
      host.appendChild(field);
    });
  }

  /* opts: host, statement(), shell(task), getCode(task), setCode(task, code) -> boolean,
     onProgress(), onFocus(). */
  function createTrainer(opts) {
    var host = opts.host;
    var state = loadState();
    var task = null;
    var feedback = null;
    var patternFeedback = null;
    var trapFeedback = null;
    var blockFeedback = null;
    var shuffleSalt = 0;
    var stepTimer = 0;

    function persist() {
      saveState(state);
    }

    function progressed() {
      persist();
      if (opts.onProgress) opts.onProgress();
    }

    function solvedSet(t) {
      var list = state.solved[t.id];
      var set = {};
      if (Array.isArray(list)) list.forEach(function (id) { set[id] = true; });
      return set;
    }

    function readingDone(t) {
      var set = solvedSet(t);
      return (t.reading || []).every(function (q) { return set[q.id]; });
    }

    function patternDone(t) {
      if (!t.codeImagine) return true;
      return !!state.patternOk[t.id] && !!state.trapOk[t.id];
    }

    function blocksDone(t) {
      if (!t.codeImagine || !t.codeImagine.blocks) return true;
      return (state.blockStep[t.id] || 0) >= t.codeImagine.blocks.length;
    }

    function isDone(t) {
      return readingDone(t) && patternDone(t) && blocksDone(t);
    }

    function nextQuestion(t) {
      var set = solvedSet(t);
      var i;
      for (i = 0; i < t.reading.length; i += 1) {
        if (!set[t.reading[i].id]) return t.reading[i];
      }
      return null;
    }

    function shellFor(t) {
      return opts.shell ? opts.shell(t) : (t.starter || "");
    }

    function markFocus(ids, kind) {
      var container = opts.statement && opts.statement();
      if (!container) return;
      if (opts.onFocus) opts.onFocus();
      var first = null;
      Array.prototype.forEach.call(container.querySelectorAll("[data-sid]"), function (node) {
        node.classList.remove("is-hit", "is-miss");
        if (ids.indexOf(node.getAttribute("data-sid")) !== -1) {
          node.classList.add(kind === "hit" ? "is-hit" : "is-miss");
          if (!first) first = node;
        }
      });
      if (first && first.scrollIntoView) first.scrollIntoView({ block: "nearest" });
    }

    function peekMapFor(t) {
      var m = state.peeked[t.id];
      return m && typeof m === "object" ? m : {};
    }

    function jaTextOf(t, id) {
      var ja = t.text && t.text.ja;
      var found = "";
      if (!ja) return found;
      (ja.sentences || []).concat(ja.assumptions || []).forEach(function (s) {
        if (s && s.id === id) found = s.text;
      });
      return found;
    }

    /* One statement line: signal words are dotted, and each line can show its translation. */
    function fillSentence(node, t, item, isEn, allowPeek) {
      node.textContent = "";
      var text = typeof item === "string" ? item : item.text || "";
      var span = el("span", null);
      if (isEn) span.setAttribute("lang", "en");
      if (isEn && allowPeek) appendHighlightedEnglish(span, text);
      else span.textContent = text;
      node.appendChild(span);
      var ja = isEn && allowPeek && item.id ? jaTextOf(t, item.id) : "";
      if (!ja) return;
      var isOpen = !!peekMapFor(t)[item.id];
      var btn = el("button", "peek-btn", isOpen ? "訳を隠す" : "訳");
      btn.type = "button";
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      btn.setAttribute("aria-label", item.id + " の日本語訳を表示");
      btn.addEventListener("click", function () {
        var cur = peekMapFor(t);
        var next = {};
        Object.keys(cur).forEach(function (k) { next[k] = cur[k]; });
        if (next[item.id]) delete next[item.id];
        else next[item.id] = true;
        state.peeked[t.id] = next;
        persist();
        fillSentence(node, t, item, isEn, allowPeek);
      });
      node.appendChild(btn);
      if (isOpen) {
        var jaSpan = el("span", "ja-peek", ja);
        jaSpan.setAttribute("lang", "ja");
        node.appendChild(jaSpan);
      }
    }

    function glossaryNode() {
      var glossary = root.CODE_IMAGINE_DATA && root.CODE_IMAGINE_DATA.glossary;
      if (!glossary || !glossary.length) return null;
      var details = document.createElement("details");
      details.className = "glossary-box";
      details.appendChild(el("summary", null, "Codility英語シグナル早見表（英語 → 意味 → Kotlinの型）"));
      var table = el("table", "glossary-table");
      table.appendChild(el("caption", null, "試験中に頻出する英語表現と、そこから連想するKotlin実装の対応表です。"));
      var thead = document.createElement("thead");
      var hr = document.createElement("tr");
      ["英語シグナル", "意味", "直結するKotlin構造"].forEach(function (label) {
        var th = el("th", null, label);
        th.scope = "col";
        hr.appendChild(th);
      });
      thead.appendChild(hr);
      table.appendChild(thead);
      var tbody = document.createElement("tbody");
      glossary.forEach(function (row) {
        var tr = document.createElement("tr");
        var tdEn = el("td", null, row.en);
        tdEn.setAttribute("lang", "en");
        tr.appendChild(tdEn);
        tr.appendChild(el("td", null, row.ja));
        tr.appendChild(el("td", null, row.kt));
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      details.appendChild(table);
      return details;
    }

    function renderStepStrip(t) {
      var strip = el("div", "step-strip");
      var s1 = readingDone(t);
      var s2 = patternDone(t);
      var s3 = blocksDone(t);
      [
        { label: "① 急所読解", done: s1, active: !s1 },
        { label: "② 型と罠特定", done: s2, active: s1 && !s2 },
        { label: "③ 骨格組立", done: s3, active: s1 && s2 && !s3 },
        { label: "④ 実装・検証", done: false, active: s1 && s2 && s3 }
      ].forEach(function (r) {
        strip.appendChild(el("div", "step-pill" + (r.done ? " is-done" : (r.active ? " is-active" : "")), (r.done ? "✓ " : "") + r.label));
      });
      return strip;
    }

    function feedbackNode(item) {
      return el("p", item.ok ? "feedback is-ok" : "feedback is-bad", item.why);
    }

    function renderReading(t) {
      var card = el("section", "card");
      var done = readingDone(t);
      var set = solvedSet(t);
      var solvedCount = t.reading.filter(function (q) { return set[q.id]; }).length;
      card.appendChild(el("h2", null, "1. 問題文から急所を拾う"));
      card.appendChild(el("p", "lead", "翻訳ツールに頼らず、「返すもの・例の数・境界・条件」を問題文から抜き出します。選ぶとすぐに採点し、根拠の文が問題文の中で色づきます。"));
      var slots = el("ol", "slots");
      t.reading.forEach(function (q) {
        slots.appendChild(el("li", set[q.id] ? "is-done" : "", q.slot));
      });
      card.appendChild(slots);
      card.appendChild(el("p", "progress", "読解 " + solvedCount + " / " + t.reading.length));

      if (done) {
        card.appendChild(el("p", "ok-note", "✓ 急所をすべて把握できました。次は「解法の型」を連想します。"));
        var again = el("button", "text-btn", "読解問題をやり直す");
        again.type = "button";
        again.addEventListener("click", function () {
          state.solved[t.id] = [];
          feedback = null;
          progressed();
          render();
        });
        card.appendChild(again);
        return card;
      }

      var q = nextQuestion(t);
      card.appendChild(el("p", "slot-label", "確認項目: " + q.slot));
      card.appendChild(el("p", "prompt", q.prompt));
      q.choices.forEach(function (choice) {
        var btn = el("button", "choice", choice.text);
        btn.type = "button";
        btn.addEventListener("click", function () {
          var result = gradeReading(t, q.id, choice.id);
          markFocus(result.focus, result.ok ? "hit" : "miss");
          feedback = { ok: result.ok, why: result.why };
          if (result.ok) {
            var list = Array.isArray(state.solved[t.id]) ? state.solved[t.id].slice() : [];
            if (list.indexOf(q.id) === -1) list.push(q.id);
            state.solved[t.id] = list;
            progressed();
            Array.prototype.forEach.call(card.querySelectorAll(".choice"), function (choiceBtn) {
              choiceBtn.disabled = true;
            });
            window.clearTimeout(stepTimer);
            stepTimer = window.setTimeout(function () {
              feedback = null;
              render();
            }, 850);
          }
          var old = card.querySelector(".feedback");
          if (old) old.remove();
          card.appendChild(feedbackNode(feedback));
        });
        card.appendChild(btn);
      });
      if (feedback) card.appendChild(feedbackNode(feedback));
      return card;
    }

    function quizChoices(all, answer, seed) {
      var others = Object.keys(all).filter(function (k) { return k !== answer; });
      var picked = seededShuffle(others, seed).slice(0, 3);
      picked.push(answer);
      return seededShuffle(picked, seed + "-order").map(function (k) {
        return { id: k, text: all[k] };
      });
    }

    function renderPatternBridge(t) {
      var ci = t.codeImagine;
      if (!ci) return null;
      var card = el("section", "card");
      card.appendChild(el("h2", null, "2. 問題文のシグナルから「解法の型」と「罠」を連想する"));
      card.appendChild(el("p", "lead", "書き始める前に、問題文のキーワードと制約から「どのアルゴリズムを使うか」「Long や境界の罠はどこか」を決めます。"));

      var patMap = (root.CODE_IMAGINE_DATA && root.CODE_IMAGINE_DATA.patterns) || {};
      var trpMap = (root.CODE_IMAGINE_DATA && root.CODE_IMAGINE_DATA.traps) || {};
      var patOk = !!state.patternOk[t.id];
      var trpOk = !!state.trapOk[t.id];

      card.appendChild(el("p", "prompt", "Q1. この問題文から真っ先に思い浮かべる Kotlin の型は？"));
      if (patOk) {
        var box1 = el("div", "signal-box");
        box1.appendChild(el("strong", null, "✓ 解法の型: " + (patMap[ci.pattern] || ci.pattern)));
        box1.appendChild(el("p", null, "着眼シグナル: " + ci.signal));
        card.appendChild(box1);
      } else {
        quizChoices(patMap, ci.pattern, t.id + "-pat").forEach(function (ch) {
          var b = el("button", "choice", ch.text);
          b.type = "button";
          b.addEventListener("click", function () {
            if (ch.id === ci.pattern) {
              state.patternOk[t.id] = true;
              patternFeedback = null;
              progressed();
            } else {
              patternFeedback = "「" + ch.text + "」だと制約や問題構造に合いません。問題文の連続性・値域・求める値（最小化/組数/状態遷移）を見直してみましょう。";
            }
            render();
          });
          card.appendChild(b);
        });
        if (patternFeedback) card.appendChild(el("p", "feedback is-bad", patternFeedback));
      }

      card.appendChild(el("p", "prompt", "Q2. 実装前に必ず警戒すべき「型（Int/Long）・境界・ライフサイクル」の急所は？"));
      if (trpOk) {
        var box2 = el("div", "signal-box");
        box2.appendChild(el("strong", null, "✓ 警戒ポイント: " + (trpMap[ci.trap] || ci.trap)));
        box2.appendChild(el("p", null, "理由: " + ci.trapWhy));
        card.appendChild(box2);
      } else {
        quizChoices(trpMap, ci.trap, t.id + "-trap").forEach(function (ch) {
          var b = el("button", "choice", ch.text);
          b.type = "button";
          b.addEventListener("click", function () {
            if (ch.id === ci.trap) {
              state.trapOk[t.id] = true;
              trapFeedback = null;
              progressed();
            } else {
              trapFeedback = "前提（Assumptions）の最大値や区間端・例外条件をもう一度チェックしてみましょう。";
            }
            render();
          });
          card.appendChild(b);
        });
        if (trapFeedback) card.appendChild(el("p", "feedback is-bad", trapFeedback));
      }

      if (patOk || trpOk) {
        var resetPat = el("button", "text-btn", "型・罠クイズをやり直す");
        resetPat.type = "button";
        resetPat.addEventListener("click", function () {
          delete state.patternOk[t.id];
          delete state.trapOk[t.id];
          patternFeedback = null;
          trapFeedback = null;
          progressed();
          render();
        });
        card.appendChild(resetPat);
      }
      return card;
    }

    /* Puts code into the page's editor. The page may refuse, for example while it is running. */
    function putInEditor(t, target, question) {
      var cur = opts.getCode(t);
      if (cur !== shellFor(t) && cur !== target && cur.trim() !== "" && !window.confirm(question)) return;
      opts.setCode(t, target);
    }

    function renderSkeletonBuilder(t) {
      var ci = t.codeImagine;
      if (!ci || !ci.blocks || !ci.blocks.length) return null;
      var card = el("section", "card");
      var blocks = ci.blocks;
      var step = Math.min(state.blockStep[t.id] || 0, blocks.length);
      var done = step >= blocks.length;

      card.appendChild(el("h2", null, "3. Kotlin の「外枠ブロック」を順番に組み立てる"));
      card.appendChild(el("p", "lead", "白紙のエディタで手が止まらないよう、実装を " + blocks.length + " 個の部品に分け、上から書く順にタップして並べます。"));

      if (step > 0) {
        var assembled = el("div", "assembled-box");
        var i;
        for (i = 0; i < step; i += 1) {
          var item = el("div", "assembled-item");
          item.appendChild(el("div", "assembled-label", "Step " + (i + 1) + ": " + blocks[i].label));
          item.appendChild(codePre("block-code", blocks[i].code));
          assembled.appendChild(item);
        }
        card.appendChild(assembled);
      }

      function restart() {
        state.blockStep[t.id] = 0;
        shuffleSalt += 1;
        blockFeedback = null;
        progressed();
        render();
      }

      if (!done) {
        var remaining = [];
        var k;
        for (k = step; k < blocks.length; k += 1) remaining.push(k);
        var pool = el("div", "block-pool");
        seededShuffle(remaining, t.id + "-blk-" + shuffleSalt).forEach(function (idx) {
          var btn = el("button", "block-choice");
          btn.type = "button";
          btn.appendChild(codePre("block-code", blocks[idx].code));
          btn.addEventListener("click", function () {
            if (idx === step) {
              state.blockStep[t.id] = step + 1;
              blockFeedback = null;
              progressed();
            } else {
              blockFeedback = "その処理の前に置くブロックがあります（ヒント: 次は「" + blocks[step].label + "」です）。";
            }
            render();
          });
          pool.appendChild(btn);
        });
        card.appendChild(pool);
        if (blockFeedback) card.appendChild(el("p", "feedback is-bad", blockFeedback));

        var bar = el("div", "run-bar");
        var hintBtn = el("button", "run-btn", "1つヒントを進める");
        hintBtn.type = "button";
        hintBtn.addEventListener("click", function () {
          state.blockStep[t.id] = step + 1;
          blockFeedback = null;
          progressed();
          render();
        });
        bar.appendChild(hintBtn);
        if (step > 0) {
          var resetBlk = el("button", "text-btn", "最初から並べ直す");
          resetBlk.type = "button";
          resetBlk.addEventListener("click", restart);
          bar.appendChild(resetBlk);
        }
        card.appendChild(bar);
      } else {
        card.appendChild(el("p", "ok-note", "✓ コード全体の骨格が組み上がりました。本番では下のコメント外枠を最初に打ってから中身を埋めます。"));
        var redo = el("button", "text-btn", "骨格ブロックをもう一度シャッフルして練習する");
        redo.type = "button";
        redo.addEventListener("click", restart);
        card.appendChild(redo);
      }

      var bpDetails = document.createElement("details");
      bpDetails.className = "blueprint-box";
      bpDetails.open = done;
      bpDetails.appendChild(el("summary", null, "試験開始60秒でエディタに打つ「コメント外枠（// 設計メモ）」を見る"));
      bpDetails.appendChild(codePre("skeleton", buildCommentStarter(t, shellFor(t)), "コメント外枠付きの関数テンプレート"));
      card.appendChild(bpDetails);
      return card;
    }

    function renderWrite(t) {
      var card = el("section", "card");
      card.appendChild(el("h2", null, "4. 下のエディタで外枠から手で書いて、動かす"));
      card.appendChild(el("p", "lead", "連想した骨格に沿って、下の Solution に自分の手で打ちます。「Run code」でサンプルを実行でき、行番号を押すとその行で止めて変数を見られます。"));
      var bar = el("div", "run-bar");
      var putBlueprint = el("button", "run-btn", "コメント外枠(//)をエディタに入れる");
      putBlueprint.type = "button";
      putBlueprint.addEventListener("click", function () {
        putInEditor(t, buildCommentStarter(t, shellFor(t)), "いまエディタにあるコードを、コメント外枠だけの状態に置き換えますか？");
      });
      var reset = el("button", "text-btn", "署名だけに戻す");
      reset.type = "button";
      reset.addEventListener("click", function () {
        if (!window.confirm("この問題のエディタを、署名だけの状態に戻します。")) return;
        opts.setCode(t, shellFor(t));
      });
      bar.appendChild(putBlueprint);
      bar.appendChild(reset);
      card.appendChild(bar);
      if (!t.runnable) {
        card.appendChild(el("p", "lead", "この問題は class（ViewModel / Interceptor など）を使うため、ブラウザ内の実行機では動きません。骨格の組み立てと手打ちの練習に使ってください。"));
      }
      if (t.portalPath) {
        var link = document.createElement("a");
        link.className = "portal-link";
        link.href = "./index.html#" + encodeURI(t.portalPath);
        link.textContent = "ポータルの解説ページを開く";
        card.appendChild(link);
      }
      return card;
    }

    function renderAnswer(t) {
      var card = el("section", "card answer-card");
      card.appendChild(el("h2", null, "模範解答コードと考え方"));
      if (!t.answer) {
        card.appendChild(el("p", "lead", "この問題の解答コードは、まだ用意していません。"));
        return card;
      }
      card.appendChild(el("p", "lead", "どうしても手が止まったときに開き、読んだら閉じて、自分の手で外枠から打ち直します。"));
      var box = document.createElement("details");
      box.className = "answer";
      box.open = !!state.answerOpen[t.id];
      box.addEventListener("toggle", function () {
        state.answerOpen[t.id] = box.open;
        persist();
      });
      box.appendChild(el("summary", null, "解答コードと考え方を開く"));
      box.appendChild(el("h3", null, "考え方"));
      var notes = el("ul", "answer-notes");
      (t.answer.notes || []).forEach(function (line) {
        notes.appendChild(el("li", null, line));
      });
      box.appendChild(notes);
      box.appendChild(el("h3", null, "コード"));
      box.appendChild(codePre("skeleton answer-code", t.answer.code, "模範解答のKotlinコード"));
      var bar = el("div", "run-bar");
      var put = el("button", "run-btn", "エディタに入れる");
      put.type = "button";
      put.addEventListener("click", function () {
        putInEditor(t, t.answer.code, "いまエディタにあるコードを、解答コードで置き換えます。");
      });
      var copy = el("button", "run-btn", "コピー");
      copy.type = "button";
      copy.addEventListener("click", function () {
        function said(msg) {
          copy.textContent = msg;
          window.setTimeout(function () { copy.textContent = "コピー"; }, 1500);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(t.answer.code).then(function () { said("コピーしました"); }, function () { said("コピーできません"); });
        } else {
          said("コピーできません");
        }
      });
      bar.appendChild(put);
      bar.appendChild(copy);
      box.appendChild(bar);
      card.appendChild(box);
      return card;
    }

    function render() {
      window.clearTimeout(stepTimer);
      host.textContent = "";
      if (!task) return;
      host.appendChild(renderStepStrip(task));
      host.appendChild(renderReading(task));
      var patternCard = renderPatternBridge(task);
      if (patternCard) host.appendChild(patternCard);
      var skelCard = renderSkeletonBuilder(task);
      if (skelCard) host.appendChild(skelCard);
      host.appendChild(renderWrite(task));
      host.appendChild(renderAnswer(task));
    }

    return {
      /* Shows the steps for one task. Changing the task drops the messages of the last one. */
      show: function (next) {
        if (!task || !next || task.id !== next.id) {
          feedback = null;
          patternFeedback = null;
          trapFeedback = null;
          blockFeedback = null;
        }
        task = next || null;
        render();
      },
      clear: function () {
        window.clearTimeout(stepTimer);
        task = null;
        host.textContent = "";
      },
      isDone: isDone,
      fillSentence: fillSentence,
      glossaryNode: glossaryNode,
      /* Code typed on the old separate page, so that it is not lost. */
      oldCodes: function () { return state.code || {}; }
    };
  }

  api.renderExamQuestions = renderExamQuestions;
  api.createTrainer = createTrainer;
})(typeof globalThis !== "undefined" ? globalThis : this);
