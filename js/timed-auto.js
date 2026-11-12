(function (root) {
  "use strict";

  var tasks = (root.ReadingLab && root.ReadingLab.tasks) || [];
  var answers = root.LAB_ANSWERS || {};
  var pick = document.getElementById("taskPick");
  var statement = document.getElementById("statement");
  var codeBox = document.getElementById("code");
  var logBox = document.getElementById("log");
  var results = document.getElementById("results");
  var summary = document.getElementById("summary");
  var clock = document.getElementById("clock");
  var examDisplay = document.getElementById("examTimerDisplay");
  var examStart = document.getElementById("examTimerStart");
  var examReset = document.getElementById("examTimerReset");
  var examStatus = document.getElementById("examTimerStatus");
  var examRemaining = 200 * 60 * 1000;
  var examDeadline = null;
  var examTicker = null;

  function updateExamTimer() {
    if (examDeadline !== null) examRemaining = Math.max(0, examDeadline - Date.now());
    examDisplay.textContent = formatClock(examRemaining);
    if (examRemaining === 0 && examDeadline !== null) {
      window.clearInterval(examTicker);
      examTicker = null;
      examDeadline = null;
      examStart.textContent = "終了";
      examStart.disabled = true;
      examStatus.textContent = "200分が経過しました";
    }
  }
  examStart.addEventListener("click", function () {
    if (examDeadline !== null) {
      updateExamTimer();
      if (examDeadline === null) return;
      window.clearInterval(examTicker);
      examTicker = null;
      examDeadline = null;
      examStart.textContent = "再開";
    } else if (examRemaining > 0) {
      examDeadline = Date.now() + examRemaining;
      examStart.textContent = "一時停止";
      examTicker = window.setInterval(updateExamTimer, 250);
    }
  });
  examReset.addEventListener("click", function () {
    window.clearInterval(examTicker);
    examTicker = null;
    examDeadline = null;
    examRemaining = 200 * 60 * 1000;
    examStart.disabled = false;
    examStart.textContent = "開始";
    examStatus.textContent = "";
    updateExamTimer();
  });
  document.addEventListener("visibilitychange", updateExamTimer);
  var think = document.getElementById("think");
  var editor = document.getElementById("editor");
  var caret = document.getElementById("caret");
  var gutter = document.getElementById("gutter");
  var currentLine = document.getElementById("currentLine");
  var varsBody = document.getElementById("varsBody");
  var consoleOut = document.getElementById("consoleOut");
  var caseNow = document.getElementById("caseNow");
  var debugNote = document.getElementById("debugNote");
  var debugResume = document.getElementById("debugResume");
  var debugStep = document.getElementById("debugStep");
  var debugStop = document.getElementById("debugStop");
  var currentLineNo = 0;
  var solveOne = document.getElementById("solveOne");
  var solveAll = document.getElementById("solveAll");
  var stopBtn = document.getElementById("stopBtn");
  var submitAnswers = document.getElementById("submitAnswers");
  var submitAnswersBottom = document.getElementById("submitAnswersBottom");
  var submitStatus = document.getElementById("submitStatus");
  var submitStatusBottom = document.getElementById("submitStatusBottom");
  var readingQuestions = document.getElementById("readingQuestions");
  var DRAFT_KEY = "timed-practice-reading-draft-v1";
  var REPORT_KEY = "timed-auto-report-v1";
  var AUTO_REPORT_KEY = "timed-auto-draft-v1";
  var readingDraft;
  try { readingDraft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"); } catch (error) { readingDraft = null; }
  if (!readingDraft || !readingDraft.selections || typeof readingDraft.selections !== "object") {
    readingDraft = { startedAt: new Date().toISOString(), selections: {} };
  }
  if (!readingDraft.codes || typeof readingDraft.codes !== "object") readingDraft.codes = {};
  if (!readingDraft.runs || typeof readingDraft.runs !== "object") readingDraft.runs = {};
  var keyHint = document.getElementById("keyHint");
  var keyName = document.getElementById("keyName");
  var keyNote = document.getElementById("keyNote");
  var session = 0;
  var records = [];
  var phoneQuery = window.matchMedia("(max-width: 820px)");
  var statementTaskId = "";
  var statementCollapsed = phoneQuery.matches;
  var statementUserSet = false;
  var userToggledDuringRun = false;
  var collapsedBeforeRun = null;
  var solveHighlightActive = false;
  var solveHighlightTimer = 0;
  var highlightGen = 0;

  function showSubmitStatus(message) {
    submitStatus.textContent = message;
    submitStatusBottom.textContent = message;
  }

  function saveDraft() {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(readingDraft));
      showSubmitStatus("");
    } catch (error) {
      showSubmitStatus("回答を保存できません。ページを閉じずに提出してください。");
    }
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function taskById(id) {
    var i;
    for (i = 0; i < tasks.length; i += 1) if (tasks[i].id === id) return tasks[i];
    return tasks[0];
  }

  function packOf(task) {
    return (task.text && task.text.ja) || { sentences: task.sentences || [], example: task.example || "", assumptions: task.assumptions || [] };
  }

  function assumptionText(item) {
    if (!item) return "";
    return typeof item === "string" ? item : item.text || "";
  }

  function runnable(task) {
    return !!(task && task.runnable && task.tests && task.tests.length && answers[task.id] && answers[task.id].code);
  }

  function fillPicker() {
    var groups = [];
    var seen = {};
    tasks.forEach(function (task) {
      if (!seen[task.group]) {
        seen[task.group] = [];
        groups.push(task.group);
      }
      seen[task.group].push(task);
    });
    groups.forEach(function (name) {
      var group = document.createElement("optgroup");
      group.label = name;
      seen[name].forEach(function (task) {
        var option = document.createElement("option");
        option.value = task.id;
        option.textContent = task.title + (runnable(task) ? "" : "（実行対象外）");
        group.appendChild(option);
      });
      pick.appendChild(group);
    });
  }

  function applyStatementCollapse() {
    if (!statement) return;
    statement.classList.toggle("is-collapsed", !!statementCollapsed);
    var toggle = statement.querySelector(".stmt-toggle");
    if (!toggle) return;
    toggle.setAttribute("aria-expanded", statementCollapsed ? "false" : "true");
    toggle.textContent = statementCollapsed ? "問題文を開く" : "問題文を閉じる";
  }

  function markAmberLines() {
    var lines = statement.querySelectorAll(".stmt-line");
    var i;
    if (!lines.length) {
      var title = statement.querySelector("h1");
      if (title) title.classList.add("is-amber");
      return;
    }
    for (i = 0; i < lines.length; i += 1) lines[i].classList.add("is-amber");
  }

  function scrollAmberIntoView() {
    var body = statement.querySelector(".stmt-body");
    if (!body || !statement.classList.contains("is-collapsed")) return;
    var line = body.querySelector(".stmt-line.is-amber") || statement.querySelector("h1.is-amber");
    if (line && body.contains(line)) {
      var delta = line.getBoundingClientRect().top - body.getBoundingClientRect().top;
      body.scrollTop = Math.max(0, body.scrollTop + delta);
    }
    var focus = line && body.contains(line) ? line : body;
    var rect = focus.getBoundingClientRect();
    if (rect.height > 0 && rect.top >= 0 && rect.top < window.innerHeight - 16) return;
    var parent = body.parentElement;
    while (parent && parent !== document.body && parent !== document.documentElement) {
      var oy = window.getComputedStyle(parent).overflowY;
      if ((oy === "auto" || oy === "scroll" || oy === "overlay") && parent.scrollHeight > parent.clientHeight + 1) {
        parent.scrollTop += rect.top - parent.getBoundingClientRect().top - 8;
        return;
      }
      parent = parent.parentElement;
    }
    window.scrollTo(0, Math.max(0, (window.scrollY || 0) + rect.top - 8));
  }

  function scrollAmberSoon() {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(scrollAmberIntoView);
    });
  }

  function onStatementToggle() {
    statementCollapsed = !statementCollapsed;
    statementUserSet = true;
    if (solveHighlightActive) userToggledDuringRun = true;
    applyStatementCollapse();
    if (statementCollapsed && solveHighlightActive) scrollAmberSoon();
  }

  function onPhoneStatementChange() {
    if (statementUserSet || solveHighlightActive) return;
    statementCollapsed = phoneQuery.matches;
    applyStatementCollapse();
  }

  function beginSolveHighlight() {
    highlightGen += 1;
    window.clearTimeout(solveHighlightTimer);
    solveHighlightTimer = 0;
    if (!solveHighlightActive) collapsedBeforeRun = statementCollapsed;
    solveHighlightActive = true;
    userToggledDuringRun = false;
    statementCollapsed = true;
    statement.classList.add("is-solving");
    applyStatementCollapse();
    markAmberLines();
    scrollAmberSoon();
  }

  function endSolveHighlight(delay) {
    var gen = highlightGen;
    window.clearTimeout(solveHighlightTimer);
    solveHighlightTimer = 0;
    function finish() {
      if (gen !== highlightGen) return;
      solveHighlightTimer = 0;
      var was = solveHighlightActive;
      solveHighlightActive = false;
      if (statement) {
        statement.classList.remove("is-solving");
        var ambers = statement.querySelectorAll(".is-amber");
        var i;
        for (i = 0; i < ambers.length; i += 1) ambers[i].classList.remove("is-amber");
      }
      if (was) {
        if (phoneQuery.matches) statementCollapsed = true;
        else if (!userToggledDuringRun) statementCollapsed = !!collapsedBeforeRun;
        userToggledDuringRun = false;
        collapsedBeforeRun = null;
        applyStatementCollapse();
      }
      setRunning(false);
    }
    if (delay > 0) solveHighlightTimer = window.setTimeout(finish, delay);
    else finish();
  }

  function renderStatement(task) {
    var pack = packOf(task);
    var nextId = task && task.id ? task.id : "";
    if (nextId !== statementTaskId) {
      if (statementTaskId) {
        highlightGen += 1;
        endSolveHighlight(0);
      }
      statementTaskId = nextId;
      statementUserSet = false;
      userToggledDuringRun = false;
      statementCollapsed = phoneQuery.matches;
    }
    statement.textContent = "";
    var toggle = el("button", "stmt-toggle", "");
    toggle.type = "button";
    toggle.setAttribute("aria-controls", "stmtBody");
    toggle.addEventListener("click", onStatementToggle);
    statement.appendChild(toggle);
    statement.appendChild(el("p", "muted", "Task"));
    statement.appendChild(el("h1", null, task.title));
    statement.appendChild(el("p", "muted", "制限時間 " + task.minutes + " 分"));
    var body = el("div", "stmt-body");
    body.id = "stmtBody";
    (pack.sentences || []).forEach(function (sentence) {
      body.appendChild(el("p", "stmt-line", sentence.text));
    });
    body.appendChild(el("h2", null, "関数"));
    body.appendChild(el("pre", null, task.signature || ""));
    body.appendChild(el("h2", null, "例"));
    body.appendChild(el("pre", null, pack.example || ""));
    if ((pack.assumptions || []).length) {
      body.appendChild(el("h2", null, "前提"));
      var list = document.createElement("ul");
      pack.assumptions.forEach(function (item) {
        list.appendChild(el("li", "stmt-line", assumptionText(item)));
      });
      body.appendChild(list);
    }
    statement.appendChild(body);
    applyStatementCollapse();
    if (solveHighlightActive) {
      statement.classList.add("is-solving");
      markAmberLines();
      scrollAmberSoon();
    }
    renderReadingQuestions(task);
  }

  function renderReadingQuestions(task) {
    readingQuestions.textContent = "";
    var chosen = readingDraft.selections[task.id] || {};
    if (!(task.reading || []).length) {
      readingQuestions.appendChild(el("p", "muted", "この問題には選択問題がありません。"));
      return;
    }
    (task.reading || []).forEach(function (question, index) {
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
          if (!readingDraft.selections[task.id]) readingDraft.selections[task.id] = {};
          readingDraft.selections[task.id][question.id] = choice.id;
          saveDraft();
        });
        label.appendChild(input);
        label.appendChild(el("span", null, choice.text));
        field.appendChild(label);
      });
      readingQuestions.appendChild(field);
    });
  }

  function log(text) {
    logBox.appendChild(el("li", null, text));
  }

  function setBusy(busy) {
    pick.disabled = busy;
    solveOne.disabled = busy;
    solveAll.disabled = busy;
    stopBtn.disabled = !busy;
    submitAnswers.disabled = busy;
    submitAnswersBottom.disabled = busy;
    codeBox.readOnly = busy;
    document.getElementById("runLook").disabled = busy;
  }

  function formatClock(ms) {
    var sign = ms < 0 ? "-" : "";
    var abs = Math.abs(ms);
    var total = Math.ceil(abs / 1000);
    var minutes = Math.floor(total / 60);
    var seconds = total % 60;
    return sign + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  }

  function wait(ms, token) {
    return new Promise(function (resolve) {
      var timer = window.setTimeout(function () { resolve(session === token); }, ms);
      var watch = window.setInterval(function () {
        if (session !== token) {
          window.clearTimeout(timer);
          window.clearInterval(watch);
          resolve(false);
        }
      }, 50);
      window.setTimeout(function () { window.clearInterval(watch); }, ms + 20);
    });
  }

  var charWidth = 0;
  var thinkText = {
    loop: "繰り返しの終わりを合わせている",
    if: "条件の境界を確認している",
    mod: "余りの位置を確認している",
    bit: "ビットの向きを確認している",
    index: "添字がずれないか見ている"
  };

  function clearThink() {
    think.classList.remove("is-on");
    think.textContent = "";
    editor.classList.remove("is-thinking");
  }

  function showThink(kind) {
    clearKey();
    think.textContent = thinkText[kind] || "途中の値を頭の中で追っている";
    think.classList.add("is-on");
    editor.classList.add("is-thinking");
  }

  function clearKey() {
    keyHint.classList.remove("is-on");
  }

  function idleEditor() {
    clearThink();
    clearKey();
    editor.classList.remove("is-typing");
    setHot("");
    placeCurrentLine(0);
  }

  function shown(value) {
    if (typeof value === "string") return JSON.stringify(value);
    if (Array.isArray(value)) return JSON.stringify(value);
    return String(value);
  }

  function argText(test) {
    return (test.args || []).map(function (spec) {
      var key = Object.keys(spec)[0];
      return shown(spec[key]);
    }).join(", ");
  }

  function renderGutter(breaks, nowLine) {
    var n = Math.max(1, codeBox.value.split("\n").length);
    var marks = breaks || {};
    gutter.textContent = "";
    var i;
    for (i = 1; i <= n; i += 1) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.tabIndex = -1;
      btn.className = "line-no" + (marks[i] ? " is-break" : "") + (i === nowLine ? " is-now" : "");
      btn.textContent = String(i);
      gutter.appendChild(btn);
    }
    gutter.scrollTop = codeBox.scrollTop;
  }

  function placeCurrentLine(line) {
    currentLineNo = line || 0;
    if (!currentLineNo) {
      currentLine.style.display = "none";
      return;
    }
    var y = 12 + (currentLineNo - 1) * 24 - codeBox.scrollTop;
    currentLine.style.display = "block";
    currentLine.style.transform = "translateY(" + y + "px)";
  }

  function scrollToLine(line) {
    var top = Math.max(0, (line - 1) * 24);
    var view = codeBox.clientHeight;
    if (top < codeBox.scrollTop || top > codeBox.scrollTop + view - 48) {
      codeBox.scrollTop = Math.max(0, top - 48);
    }
    gutter.scrollTop = codeBox.scrollTop;
    placeCurrentLine(line);
  }

  function breakpointMap(source) {
    var map = {};
    var lines = source.split("\n");
    var i;
    for (i = 0; i < lines.length; i += 1) {
      var text = lines[i].trim();
      if (!text || text.indexOf("//") === 0) continue;
      if (/\b(while|for|return)\b/.test(text)) map[i + 1] = true;
    }
    if (!Object.keys(map).length) map[Math.max(1, lines.length)] = true;
    return map;
  }

  function setHot(which) {
    debugResume.classList.toggle("is-hot", which === "continue");
    debugStep.classList.toggle("is-hot", which === "step");
    debugStop.classList.toggle("is-hot", which === "stop");
  }

  function setRunning(on) {
    var run = document.getElementById("runLook");
    if (run) run.classList.toggle("is-hot", !!on);
  }

  function showFile(which) {
    var sol = document.getElementById("fileSol");
    var test = document.getElementById("fileTest");
    if (sol) sol.classList.toggle("is-on", which === "sol");
    if (test) test.classList.toggle("is-on", which === "test");
  }

  function showVars(rows) {
    varsBody.textContent = "";
    if (!rows || !rows.length) {
      var empty = document.createElement("tr");
      empty.appendChild(el("td", null, "（この行の手前では、ローカル変数はまだありません）"));
      empty.appendChild(el("td", null, ""));
      varsBody.appendChild(empty);
      return;
    }
    rows.forEach(function (row) {
      var tr = document.createElement("tr");
      tr.appendChild(el("td", null, row.name));
      tr.appendChild(el("td", null, row.value));
      varsBody.appendChild(tr);
    });
  }

  function showCase(test) {
    caseNow.textContent = "";
    caseNow.appendChild(el("p", null, "テスト " + test.name));
    caseNow.appendChild(el("p", null, "入力 " + argText(test)));
    caseNow.appendChild(el("p", null, "期待する返り値 " + shown(test.expect)));
    var box = document.getElementById("testFile");
    if (box) box.textContent = "入力 " + argText(test) + "\n期待する返り値 " + shown(test.expect);
    showFile("test");
  }

  function explainResult(row, test) {
    var sentence = "サンプル「" + row.name + "」の返り値は " + shown(row.actual) + " です。";
    if (test && test.because) sentence += test.because;
    if (row.ok) sentence += "問題文が求める " + shown(row.expected) + " と一致しています。この出力はこれ以上確認しなくて大丈夫です。";
    else sentence += "問題文が求める値は " + shown(row.expected) + " です。ここが食い違うので、次の問題には進みません。";
    return sentence;
  }

  function showExplanation(text) {
    debugNote.textContent = "";
    think.textContent = text;
    think.classList.add("is-on");
  }

  function showCurrentSample(index) {
    var nodes = results.querySelectorAll("[data-sample]");
    var i;
    for (i = 0; i < nodes.length; i += 1) nodes[i].classList.toggle("is-current", i === index);
  }

  async function debugTests(source, tests, token, clock) {
    results.textContent = "";
    setRunning(true);
    beginSolveHighlight();
    setHot("");
    placeCurrentLine(0);
    renderGutter({}, 0);
    showVars([]);
    consoleOut.textContent = "（標準出力はありません）";
    debugNote.textContent = "";
    var doneRows = [];
    function endDebug(extra) {
      extra.tests = doneRows.slice();
      return extra;
    }
    var state;
    try {
      state = root.Kotlite.runTests(source, tests);
    } catch (error) {
      results.appendChild(el("p", "fail", error.message || "実行できませんでした"));
      return endDebug({ stopped: false, passed: false, error: true });
    }
    var rows = state.results || [];
    if (state.paused || rows.length !== tests.length) {
      results.appendChild(el("p", "fail", "実行結果がありません"));
      return endDebug({ stopped: false, passed: false, error: true });
    }
    var t;
    for (t = 0; t < rows.length; t += 1) {
      var row = rows[t];
      doneRows.push({
        name: row.name,
        ok: !!row.ok,
        actual: row.actual,
        expected: row.expected,
        because: (tests[t] && tests[t].because) || ""
      });
    }
    showTests(doneRows);
    var statusNodes = results.querySelectorAll(".pass, .fail");
    for (t = 0; t < statusNodes.length; t += 1) statusNodes[t].setAttribute("data-sample", String(t));
    log("サンプルの結果を表示しました。注目点を見ている間、制限時間は止まります。");
    if (clock) clock.pause();
    try {
      for (t = 0; t < doneRows.length; t += 1) {
        if (session !== token) return endDebug({ stopped: true });
        showCurrentSample(t);
        showCase(tests[t]);
        var sentence = explainResult(doneRows[t], tests[t]);
        showExplanation(sentence);
        var seen = await wait(1500, token);
        if (!seen) return endDebug({ stopped: true });
        if (!doneRows[t].ok) return endDebug({ stopped: false, passed: false });
      }
      showExplanation("サンプルは全部、問題文どおりです。注目した点はここまでです。");
      var done = await wait(1200, token);
      if (!done) return endDebug({ stopped: true });
      return endDebug({ stopped: false, passed: true });
    } finally {
      if (clock) clock.resume();
      setHot("");
      placeCurrentLine(0);
    }
  }

  function measureChar() {
    if (charWidth) return;
    var probe = document.createElement("span");
    var style = window.getComputedStyle(codeBox);
    probe.textContent = "0000000000";
    probe.style.cssText = "position:absolute;visibility:hidden;white-space:pre;font:" + style.font + ";";
    document.body.appendChild(probe);
    charWidth = probe.getBoundingClientRect().width / 10;
    probe.remove();
    if (!charWidth) charWidth = 9.6;
  }

  function placeKey(index) {
    measureChar();
    var text = codeBox.value.slice(0, index);
    var lineStart = text.lastIndexOf("\n") + 1;
    var col = index - lineStart;
    var row = 0;
    var k;
    for (k = 0; k < text.length; k += 1) if (text.charAt(k) === "\n") row += 1;
    var pad = 12;
    var lineHeight = 24;
    var x = pad + col * charWidth - codeBox.scrollLeft + 8;
    var y = pad + row * lineHeight - codeBox.scrollTop - 36;
    var viewW = codeBox.clientWidth || 0;
    if (y < 4) y = pad + row * lineHeight - codeBox.scrollTop + 22;
    if (viewW && x > viewW - 120) x = Math.max(4, viewW - 120);
    if (x < 4) x = 4;
    keyHint.style.left = x + "px";
    keyHint.style.top = y + "px";
  }

  function showKey(key, note, index) {
    keyName.textContent = key;
    keyNote.textContent = note;
    placeKey(index);
    keyHint.classList.remove("is-on");
    void keyHint.offsetWidth;
    keyHint.classList.add("is-on");
  }

  function placeCaret(index) {
    measureChar();
    var text = codeBox.value.slice(0, index);
    var lineStart = text.lastIndexOf("\n") + 1;
    var col = index - lineStart;
    var row = 0;
    var k;
    for (k = 0; k < text.length; k += 1) if (text.charAt(k) === "\n") row += 1;
    var pad = 12;
    var lineHeight = 24;
    var targetX = pad + col * charWidth;
    var targetY = pad + row * lineHeight;
    var viewW = codeBox.clientWidth;
    var viewH = codeBox.clientHeight;
    if (targetX > codeBox.scrollLeft + viewW - 20) codeBox.scrollLeft = targetX - viewW + 24;
    if (targetX < codeBox.scrollLeft + pad) codeBox.scrollLeft = Math.max(0, targetX - pad);
    var maxScroll = Math.max(0, codeBox.scrollHeight - viewH);
    if (targetY < codeBox.scrollTop + pad || targetY > codeBox.scrollTop + viewH - lineHeight) {
      codeBox.scrollTop = Math.min(maxScroll, Math.max(0, targetY - viewH + lineHeight + pad));
    }
    var x = targetX - codeBox.scrollLeft;
    var y = targetY - codeBox.scrollTop;
    if (x < 2) x = 2;
    if (y < 2) y = 2;
    if (x > viewW - 4) x = viewW - 4;
    if (y > viewH - 4) y = viewH - 4;
    caret.style.transform = "translate(" + x + "px," + y + "px)";
  }

  function lineKind(source, index) {
    var start = source.lastIndexOf("\n", index - 1) + 1;
    var at = start;
    while (at < source.length && source.charAt(at) === " ") at += 1;
    if (index !== at) return "";
    var end = source.indexOf("\n", at);
    if (end < 0) end = source.length;
    var text = source.slice(at, end).trim();
    if (!text || text === "{" || text === "}" || text === "else {") return "";
    if (text.indexOf("//") === 0 || text.indexOf("*") === 0) return "";
    if (/\b(while|for)\b/.test(text)) return "loop";
    if (/\b(if|when)\b/.test(text) && (/&&|\|\|/.test(text) || text.length > 28)) return "if";
    if ((text.match(/\[/g) || []).length >= 2) return "index";
    if (/%/.test(text)) return "mod";
    if (/shl|shr|\bxor\b|\binv\b/.test(text)) return "bit";
    return "";
  }

  function shellOf(task) {
    var sig = (task.signature || "").trim();
    var starter = task.starter || "";
    if (starter) {
      var openAt = starter.indexOf("{");
      if (openAt >= 0) {
        var rest = starter.slice(openAt).replace(/[\s{}]/g, "");
        if (!rest) return starter.slice(0, openAt + 1) + "\n    \n}\n";
      }
    }
    if (!sig) return "";
    if (sig.indexOf("fun ") === 0 || sig.indexOf("class ") === 0) return sig + " {\n    \n}\n";
    return "class " + sig + " {\n    \n}\n";
  }

  function frameOf(task, source) {
    var shell = shellOf(task);
    if (!source || !shell) {
      return { start: 0, end: source ? source.length : 0, sigStart: -1, bodyStart: 0, closing: "", shell: shell };
    }
    var sig = (task.signature || "").trim();
    var sigStart = sig ? source.indexOf(sig) : -1;
    var bodyStart = 0;
    if (sigStart >= 0) {
      var nl = source.indexOf("\n", sigStart);
      bodyStart = nl < 0 ? source.length : nl + 1;
    } else if (task.starter && task.starter.indexOf("{") >= 0) {
      var openHead = task.starter.slice(0, task.starter.indexOf("{") + 1);
      sigStart = source.indexOf(openHead);
      if (sigStart >= 0) {
        var nl2 = source.indexOf("\n", sigStart + openHead.length - 1);
        bodyStart = nl2 < 0 ? source.length : nl2 + 1;
      }
    }
    if (sigStart < 0 || bodyStart <= 0) {
      return { start: 0, end: source.length, sigStart: -1, bodyStart: 0, closing: "", shell: shell };
    }
    var closing = "";
    var end = source.length;
    if (source.slice(-3) === "\n}\n") {
      closing = "\n}\n";
      end = source.length - 3;
    } else if (source.slice(-2) === "\n}") {
      closing = "\n}";
      end = source.length - 2;
    }
    var firstEntry = bodyStart;
    if (source.slice(bodyStart, bodyStart + 4) === "    " && bodyStart + 4 <= end) {
      firstEntry = bodyStart + 4;
    }
    var start = sigStart === 0 ? firstEntry : 0;
    return {
      start: start,
      end: end,
      sigStart: sigStart,
      bodyStart: firstEntry,
      closing: closing,
      shell: shell
    };
  }

  function renderFramed(source, pos, frame) {
    if (!frame || frame.sigStart < 0) return source.slice(0, pos);
    if (pos < frame.sigStart) {
      var prefix = source.slice(0, pos);
      var sep = (!prefix || prefix.charAt(prefix.length - 1) === "\n") ? "\n" : "\n\n";
      return prefix + sep + frame.shell;
    }
    if (pos >= frame.end) return source;
    return source.slice(0, pos) + frame.closing;
  }

  function showShell(task) {
    var shell = Object.prototype.hasOwnProperty.call(readingDraft.codes, task.id)
      ? readingDraft.codes[task.id] : shellOf(task);
    codeBox.value = shell;
    codeBox.scrollTop = 0;
    codeBox.scrollLeft = 0;
    renderGutter({}, 0);
    var mark = "{\n    ";
    var at = shell.indexOf(mark);
    placeCaret(at >= 0 ? at + mark.length : shell.length);
  }

  function leadSpaces(source, from, to) {
    var n = 0;
    while (from + n < to && source.charAt(from + n) === " ") n += 1;
    return n;
  }

  function indentSteps(source, index) {
    var onNewline = source.charAt(index) === "\n";
    var nextStart;
    var current;
    if (onNewline) {
      var lineStart = source.lastIndexOf("\n", index - 1) + 1;
      current = leadSpaces(source, lineStart, index);
      nextStart = index + 1;
    } else if ((index === 0 || source.charAt(index - 1) === "\n") && source.charAt(index) === " ") {
      var prevBreak = source.lastIndexOf("\n", index - 2);
      current = index === 0 ? 0 : leadSpaces(source, prevBreak + 1, index - 1);
      nextStart = index;
    } else {
      return null;
    }
    if (nextStart < source.length && source.charAt(nextStart) === "\t") return null;
    var next = leadSpaces(source, nextStart, source.length);
    var steps = [];
    var limit = nextStart + next;
    if (next >= current) {
      var at = nextStart + current;
      if (onNewline) {
        steps.push({
          end: at,
          key: "Enter",
          note: current > 0 ? "インデントを保持" : "改行"
        });
      } else if (current > 0) {
        steps.push({ end: at, key: "Enter", note: "インデントを保持" });
      }
      while (at + 4 <= limit && source.slice(at, at + 4) === "    ") {
        at += 4;
        steps.push({ end: at, key: "Tab", note: "次のインデント" });
      }
    } else if (!onNewline) {
      return null;
    } else if (next === 0 && (nextStart >= source.length || source.charAt(nextStart) === "\n")) {
      steps.push({ end: nextStart, key: "Enter", note: "改行" });
    } else if ((current - next) % 4 === 0) {
      steps.push({
        end: nextStart + next,
        key: "Enter",
        note: current > next ? "インデントを戻す" : "改行"
      });
    } else {
      return null;
    }
    if (!steps.length || steps[0].end <= index) return null;
    var last = steps[steps.length - 1].end;
    if (last <= index || last > source.length) return null;
    return steps;
  }

  async function typeCode(source, token, frame) {
    var start = frame && frame.start > 0 ? frame.start : 0;
    var end = frame && frame.end > 0 ? frame.end : source.length;
    if (start > end) start = end;
    codeBox.value = renderFramed(source, start, frame);
    codeBox.scrollTop = 0;
    codeBox.scrollLeft = 0;
    clearThink();
    editor.classList.add("is-typing");
    setRunning(true);
    showFile("sol");
    renderGutter({}, 0);
    placeCaret(start);
    var pauses = 0;
    var lastPause = -500;
    try {
      var i = start;
      while (i < end) {
        if (session !== token) return false;
        if (frame && frame.sigStart > 0 && i >= frame.sigStart && i < frame.bodyStart) {
          i = frame.bodyStart;
          codeBox.value = renderFramed(source, i, frame);
          renderGutter({}, 0);
          placeCaret(i);
          continue;
        }
        var bound = (frame && frame.sigStart > 0 && i < frame.sigStart) ? frame.sigStart : end;
        var steps = indentSteps(source.slice(0, bound), i);
        if (steps) {
          var s;
          for (s = 0; s < steps.length; s += 1) {
            if (session !== token) return false;
            var step = steps[s];
            codeBox.value = renderFramed(source, step.end, frame);
            if (step.key === "Enter") renderGutter({}, 0);
            placeCaret(step.end);
            showKey(step.key, step.note, step.end);
            var beat = step.key === "Tab" ? 200 + Math.floor(Math.random() * 80) : 260 + Math.floor(Math.random() * 90);
            var heldKey = await wait(beat, token);
            clearKey();
            if (!heldKey) return false;
          }
          i = steps[steps.length - 1].end;
          continue;
        }
        var kind = pauses < 4 && i - lastPause > 180 ? lineKind(source, i) : "";
        if (kind) {
          if (pauses === 0) log("難しい行の前で手を止めています。");
          showThink(kind);
          placeCaret(i);
          var held = await wait(1300 + Math.floor(Math.random() * 800), token);
          clearThink();
          editor.classList.add("is-typing");
          if (!held) return false;
          pauses += 1;
          lastPause = i;
        }
        if (session !== token) return false;
        var ch = source.charAt(i);
        codeBox.value = renderFramed(source, i + 1, frame);
        if (ch === "\n" || i + 1 === end) renderGutter({}, 0);
        placeCaret(i + 1);
        var delay = 52 + Math.floor(Math.random() * 48);
        if (ch === " ") delay = 26 + Math.floor(Math.random() * 24);
        else if (ch === "\n") delay += 70 + Math.floor(Math.random() * 80);
        var stepped = await wait(delay, token);
        if (!stepped) return false;
        i += 1;
      }
      codeBox.value = source;
      renderGutter({}, 0);
      return session === token;
    } finally {
      idleEditor();
    }
  }

  function showTests(rows) {
    results.textContent = "";
    if (!rows.length) {
      results.appendChild(el("p", null, "サンプルはありません。"));
      return;
    }
    rows.forEach(function (row) {
      var line = row.name + (row.ok ? " 合っています" : " 期待と違います");
      results.appendChild(el("p", row.ok ? "pass" : "fail", line));
      results.appendChild(el("p", "muted", "結果: " + shown(row.actual) + " / 期待: " + shown(row.expected)));
    });
  }

  function renderSummary() {
    summary.textContent = "";
    if (!records.length) return;
    var table = document.createElement("table");
    var head = document.createElement("tr");
    ["問題", "結果", "経過"].forEach(function (label) {
      head.appendChild(el("th", null, label));
    });
    table.appendChild(head);
    records.forEach(function (row) {
      var tr = document.createElement("tr");
      tr.appendChild(el("td", null, row.title));
      tr.appendChild(el("td", null, row.result));
      tr.appendChild(el("td", null, row.elapsed));
      table.appendChild(tr);
    });
    summary.appendChild(table);
  }

  function persistReport(data) {
    try { localStorage.setItem(AUTO_REPORT_KEY, JSON.stringify(data)); } catch (error) { return; }
  }

  function beginReport() {
    var data = {
      startedAt: new Date().toISOString(),
      events: [{ at: new Date().toISOString(), text: "練習を開始" }],
      tasks: []
    };
    persistReport(data);
    return data;
  }

  function noteEvent(data, text) {
    if (!data) return;
    data.events.push({ at: new Date().toISOString(), text: text });
    data.updatedAt = new Date().toISOString();
    persistReport(data);
  }

  function noteTask(data, task, result, elapsedMs, tests) {
    if (!data) return;
    data.tasks.push({
      id: task.id,
      result: result,
      elapsedMs: elapsedMs,
      automaticCode: codeBox.value,
      tests: (tests || []).map(function (row) {
        return {
          name: String(row.name),
          ok: !!row.ok,
          actual: row.actual,
          expected: row.expected,
          because: row.because || ""
        };
      })
    });
    noteEvent(data, task.title + " — " + result);
  }

  async function solve(task, token) {
    highlightGen += 1;
    endSolveHighlight(0);
    renderStatement(task);
    showShell(task);
    results.textContent = "";
    logBox.textContent = "";
    var limitMs = Math.max(1, task.minutes) * 60 * 1000;
    var started = Date.now();
    var carried = 0;
    var heldAt = 0;
    function usedMs() {
      var now = Date.now();
      return now - started - carried - (heldAt ? now - heldAt : 0);
    }
    var clockCtl = {
      pause: function () {
        if (!heldAt) heldAt = Date.now();
      },
      resume: function () {
        if (!heldAt) return;
        carried += Date.now() - heldAt;
        heldAt = 0;
      }
    };
    var savedTests = [];
    clock.className = "clock";
    var ticker = window.setInterval(function () {
      var left = limitMs - usedMs();
      clock.textContent = formatClock(left);
      clock.classList.toggle("is-held", !!heldAt);
      clock.classList.toggle("is-over", left < 0 && !heldAt);
    }, 200);
    function finish(result) {
      window.clearInterval(ticker);
      clock.classList.remove("is-held");
      var elapsed = usedMs();
      var within = elapsed <= limitMs;
      clock.textContent = formatClock(limitMs - elapsed);
      clock.classList.toggle("is-ok", within && result === "時間内に完了");
      clock.classList.toggle("is-over", !within);
      records.push({
        title: task.title,
        result: result,
        elapsed: formatClock(elapsed).replace("-", "")
      });
      renderSummary();
      noteTask(sessionReport, task, result, elapsed, savedTests);
      log(result + "。経過 " + formatClock(elapsed).replace("-", "") + "。制限 " + task.minutes + " 分。");
    }
    try {
      log("問題文を表示しました。");
      log("制限時間 " + task.minutes + " 分を開始しました。");
      if (!task.runnable || !(task.tests || []).length) {
        log("class を使うため、このページではコーディング実行をしません。");
        finish("実行対象外");
        return session === token;
      }
      var answer = answers[task.id];
      if (!answer || !answer.code) {
        log("この問題の解答コードがありません。");
        finish("解答なし");
        return session === token;
      }
      log("エディタへコードを入力しています。");
      var typed = await typeCode(answer.code, token, frameOf(task, answer.code));
      if (!typed) return false;
      var report = await debugTests(answer.code, task.tests, token, clockCtl);
      if (!report || report.stopped) return false;
      savedTests = report.tests || [];
      if (report.error) {
        finish("実行で止まった");
        return false;
      }
      var elapsed = usedMs();
      if (!report.passed) {
        finish("サンプルが合わなかった");
        return false;
      }
      if (elapsed > limitMs) {
        finish("サンプルは合ったが制限時間を超えた");
        return false;
      }
      log("注目した点はここまでです。これ以上確認する箇所はありません。");
      finish("時間内に完了");
      return session === token;
    } finally {
      window.clearInterval(ticker);
      endSolveHighlight(0);
      setRunning(false);
      showFile("sol");
    }
  }

  var sessionReport = null;

  function submitPractice() {
    var automatic = sessionReport;
    if (!automatic) {
      try { automatic = JSON.parse(localStorage.getItem(AUTO_REPORT_KEY) || "null"); } catch (error) { automatic = null; }
    }
    var report = root.PracticeReport.buildReport(tasks, readingDraft.selections, automatic, readingDraft.startedAt, readingDraft.codes, readingDraft.runs);
    if (!report.tasks.length) {
      showSubmitStatus("コードを入力するか、選択問題に回答してから提出してください。");
      return;
    }
    try {
      localStorage.setItem(REPORT_KEY, JSON.stringify(report));
    } catch (error) {
      showSubmitStatus("結果を保存できません。ブラウザの保存設定を確認してください。");
      return;
    }
    try { localStorage.removeItem(DRAFT_KEY); localStorage.removeItem(AUTO_REPORT_KEY); } catch (error) { /* The submitted result is already saved. */ }
    root.location.href = "./result-review.html";
  }
  submitAnswers.addEventListener("click", submitPractice);
  submitAnswersBottom.addEventListener("click", submitPractice);

  async function runQueue(list) {
    var token = ++session;
    sessionReport = beginReport();
    records = [];
    renderSummary();
    setBusy(true);
    var i;
    for (i = 0; i < list.length; i += 1) {
      if (session !== token) break;
      pick.value = list[i].id;
      var keep = await solve(list[i], token);
      if (!keep) break;
      if (i < list.length - 1) {
        log("次の問題に進みます。");
        var pause = await wait(900, token);
        if (!pause) break;
      }
    }
    if (session === token) {
      setBusy(false);
      var selectedTask = taskById(pick.value);
      if (selectedTask && Object.prototype.hasOwnProperty.call(readingDraft.codes, selectedTask.id)) showShell(selectedTask);
    }
  }

  pick.addEventListener("change", function () {
    if (pick.disabled) return;
    var task = taskById(pick.value);
    renderStatement(task);
    showShell(task);
    results.textContent = "";
    logBox.textContent = "";
    clock.className = "clock";
    clock.textContent = "--:--";
    idleEditor();
    debugNote.textContent = "";
    caseNow.textContent = "";
    showVars([]);
    consoleOut.textContent = "（標準出力はありません）";
    renderGutter({}, 0);
  });
  solveOne.addEventListener("click", function () {
    var start = taskById(pick.value);
    var list = tasks.filter(runnable);
    if (!runnable(start)) runQueue([start]);
    else {
      var at = 0;
      list.forEach(function (item, index) { if (item.id === start.id) at = index; });
      runQueue(list.slice(at));
    }
  });
  solveAll.addEventListener("click", function () {
    runQueue(tasks.filter(runnable));
  });
  function halt() {
    session += 1;
    highlightGen += 1;
    endSolveHighlight(0);
    setRunning(false);
    setBusy(false);
    idleEditor();
    var selectedTask = taskById(pick.value);
    if (selectedTask && Object.prototype.hasOwnProperty.call(readingDraft.codes, selectedTask.id)) showShell(selectedTask);
    noteEvent(sessionReport, "停止");
    log("停止しました。");
  }
  stopBtn.addEventListener("click", halt);
  debugStop.addEventListener("click", halt);
  codeBox.addEventListener("input", function () {
    var task = taskById(pick.value);
    if (!task) return;
    readingDraft.codes[task.id] = codeBox.value;
    delete readingDraft.runs[task.id];
    results.textContent = "";
    renderGutter({}, 0);
    saveDraft();
  });
  document.getElementById("copyCode").addEventListener("click", function () {
    var status = document.getElementById("copyStatus");
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      codeBox.focus();
      codeBox.select();
      status.textContent = "コードを選択しました。コピーしてIDEに貼り付けてください。";
      return;
    }
    navigator.clipboard.writeText(codeBox.value).then(function () {
      status.textContent = "コピーしました。";
    }, function () {
      codeBox.focus();
      codeBox.select();
      status.textContent = "コードを選択しました。手動でコピーしてください。";
    });
  });
  document.getElementById("runLook").addEventListener("click", function () {
    var task = taskById(pick.value);
    if (!task) return;
    var source = codeBox.value;
    readingDraft.codes[task.id] = source;
    var run = { source: source, tests: [], error: "" };
    results.textContent = "";
    if (!task.runnable || !(task.tests || []).length) {
      run.error = "この問題は練習用実行機で実行できません。外部IDEで確認してください。";
    } else {
      beginSolveHighlight();
      setRunning(true);
      try {
        var outcome = root.Kotlite.runTests(source, task.tests);
        if (outcome.paused || !outcome.results || outcome.results.length !== task.tests.length) {
          run.error = "サンプル実行を完了できませんでした。";
        } else {
          run.tests = outcome.results.map(function (row, index) {
            return { name: row.name, ok: !!row.ok, actual: row.actual, expected: row.expected, because: (task.tests[index] && task.tests[index].because) || "" };
          });
        }
      } catch (error) {
        run.error = (error && error.message) ? error.message : "実行できませんでした。";
      }
      endSolveHighlight(2400);
    }
    readingDraft.runs[task.id] = run;
    saveDraft();
    if (run.error) results.appendChild(el("p", "fail", "実行できません: " + run.error));
    else showTests(run.tests);
  });
  codeBox.addEventListener("scroll", function () {
    gutter.scrollTop = codeBox.scrollTop;
    placeCurrentLine(currentLineNo);
  });

  if (phoneQuery.addEventListener) phoneQuery.addEventListener("change", onPhoneStatementChange);
  else if (phoneQuery.addListener) phoneQuery.addListener(onPhoneStatementChange);

  fillPicker();
  showVars([]);
  if (tasks[0]) {
    renderStatement(tasks[0]);
    showShell(tasks[0]);
  } else {
    renderGutter({}, 0);
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
