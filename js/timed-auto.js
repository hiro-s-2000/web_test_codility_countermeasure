(function (root) {
  "use strict";

  var allTasks = (root.ReadingLab && root.ReadingLab.tasks) || [];
  var tasks = allTasks;
  /* One page, three modes: "imagine" (reading and code imagination), "rehearsal"
     (a five-task paper) and "timed" (any task against the clock). */
  var MODE_TITLES = { imagine: "コード連想トレ", rehearsal: "本番前試験練習", timed: "制限時間で解く" };
  var MODE_STORE = "practice-mode-v1";
  var mode = "timed";
  try {
    /* Without a mode in the address, the page opens in the mode used last. */
    var askedMode = new URLSearchParams(root.location.search).get("mode") || localStorage.getItem(MODE_STORE);
    if (MODE_TITLES[askedMode]) mode = askedMode;
  } catch (error) {
    mode = "timed";
  }
  var rehearsal = false;
  var imagine = false;
  var examPatterns = [];
  var patternIndex = 0;
  var patternLocked = false;
  var PATTERN_STORE = "timed-rehearsal-pattern-v1";
  var LANG_STORE = "";
  var statementLang = "en";
  /* Only in the imagine mode: each English line can show its translation. */
  var peekOn = false;

  function taskListFor(index) {
    var pattern = examPatterns[index];
    if (!pattern || !pattern.ids) return [];
    var byId = {};
    var i;
    for (i = 0; i < allTasks.length; i += 1) byId[allTasks[i].id] = allTasks[i];
    var selected = [];
    for (i = 0; i < pattern.ids.length; i += 1) {
      if (byId[pattern.ids[i]]) selected.push(byId[pattern.ids[i]]);
    }
    return selected;
  }

  /* Sets everything that depends on the mode, except the saved answers (loadDraft). */
  function loadModeBasics() {
    rehearsal = mode === "rehearsal";
    imagine = mode === "imagine";
    examPatterns = rehearsal && root.EXAM_PATTERNS ? root.EXAM_PATTERNS : [];
    LANG_STORE = "timed-" + (mode === "timed" ? "practice" : mode) + "-lang-v1";
    statementLang = "en";
    peekOn = imagine;
    try {
      var savedLang = sessionStorage.getItem(LANG_STORE);
      if (savedLang === "ja" || savedLang === "en" || (imagine && savedLang === "en-peek")) {
        statementLang = savedLang === "ja" ? "ja" : "en";
        peekOn = savedLang === "en-peek";
      }
    } catch (error) { /* English stays the default. */ }
    tasks = allTasks;
    patternIndex = 0;
    patternLocked = false;
    if (rehearsal && examPatterns.length) {
      try {
        var savedPattern = sessionStorage.getItem(PATTERN_STORE);
        var p;
        for (p = 0; p < examPatterns.length; p += 1) {
          if (examPatterns[p].id === savedPattern) patternIndex = p;
        }
      } catch (error) { /* The first paper stays selected. */ }
      tasks = taskListFor(patternIndex);
    }
    document.title = MODE_TITLES[mode];
    try { localStorage.setItem(MODE_STORE, mode); } catch (error) { /* The mode still works for this visit. */ }
  }
  loadModeBasics();
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
      if (rehearsal) lockPattern(true);
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
    if (rehearsal) lockPattern(false);
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
  var DRAFT_KEY = "";
  var REPORT_KEY = "timed-auto-report-v1";
  var AUTO_REPORT_KEY = "";
  var readingDraft;
  var trainer = null;

  /* Each mode keeps its own answers and code. */
  function loadDraft() {
    DRAFT_KEY = "timed-" + (mode === "timed" ? "practice" : mode) + "-reading-draft-v1";
    AUTO_REPORT_KEY = mode === "timed" ? "timed-auto-draft-v1" : "timed-" + mode + "-draft-v1";
    try { readingDraft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"); } catch (error) { readingDraft = null; }
    if (!readingDraft || !readingDraft.selections || typeof readingDraft.selections !== "object") {
      readingDraft = { startedAt: new Date().toISOString(), selections: {} };
    }
    if (!readingDraft.codes || typeof readingDraft.codes !== "object") readingDraft.codes = {};
    if (!readingDraft.runs || typeof readingDraft.runs !== "object") readingDraft.runs = {};
    if (!readingDraft.testFiles || typeof readingDraft.testFiles !== "object") readingDraft.testFiles = {};
    if (imagine && trainer) {
      var old = trainer.oldCodes();
      Object.keys(old).forEach(function (id) {
        if (typeof old[id] === "string" && old[id].trim() !== "" &&
            !Object.prototype.hasOwnProperty.call(readingDraft.codes, id)) {
          readingDraft.codes[id] = old[id];
        }
      });
    }
  }
  if (root.ReadingLab && root.ReadingLab.createTrainer) {
    trainer = root.ReadingLab.createTrainer({
      host: document.getElementById("trainer"),
      statement: function () { return statement; },
      shell: function (task) { return starterOf(task); },
      getCode: function (task) { return codeOf(task); },
      setCode: function (task, code) {
        if (pick.disabled) return false;
        readingDraft.codes[task.id] = code;
        delete readingDraft.runs[task.id];
        saveDraft();
        activateWorkspaceTab("sol");
        showShell(task);
        results.textContent = "";
        codeBox.focus();
        if (codeBox.scrollIntoView) codeBox.scrollIntoView({ block: "center" });
        return true;
      },
      onProgress: function () {
        var currentId = pick.value;
        fillPicker();
        if (currentId) pick.value = currentId;
      },
      onFocus: function () {
        if (statementCollapsed) {
          statementCollapsed = false;
          statementUserSet = true;
          applyStatementCollapse();
        }
      }
    });
  }
  loadDraft();
  var fileListEl = document.getElementById("fileList");
  var addTestFileBtn = document.getElementById("addTestFileBtn");
  var editorTabsEl = document.getElementById("editorTabs");
  var tabAddTestBtn = document.getElementById("tabAddTest");
  var tabCloseActiveBtn = document.getElementById("tabCloseActive");
  var tabMetaEl = document.getElementById("tabMeta");
  var solPanelEl = document.getElementById("solPanel");
  var testPanelEl = document.getElementById("testPanel");
  var testSigHintEl = document.getElementById("testSigHint");
  var testInputBox = document.getElementById("testInputBox");
  var addCaseLineBtn = document.getElementById("addCaseLineBtn");
  var resetTestFileBtn = document.getElementById("resetTestFileBtn");
  var runCustomBtn = document.getElementById("runCustomBtn");
  var testBannerEl = document.getElementById("testFile");
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
  var writingAmberAt = -1;

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

  function japanesePack(task) {
    return (task && task.text && task.text.ja) || { sentences: (task && task.sentences) || [], example: (task && task.example) || "", assumptions: (task && task.assumptions) || [] };
  }

  function englishPack(task) {
    if (!task) return null;
    var builtIn = task.text && task.text.en;
    if (builtIn && builtIn.sentences && builtIn.sentences.length) return builtIn;
    var extra = root.EXAM_STATEMENTS_EN && root.EXAM_STATEMENTS_EN[task.id];
    if (extra && extra.sentences && extra.sentences.length) return extra;
    return null;
  }

  function packOf(task) {
    var ja = japanesePack(task);
    if (statementLang !== "en") return ja;
    return englishPack(task) || ja;
  }

  function statementTitle(task) {
    if (!task) return "";
    if (statementLang === "en") {
      var builtInTitle = task.text && task.text.en && task.text.en.title;
      if (builtInTitle) return builtInTitle;
      var extra = root.EXAM_STATEMENTS_EN && root.EXAM_STATEMENTS_EN[task.id];
      if (extra && extra.title) return extra.title;
    }
    return task.title;
  }

  function statementChrome() {
    if (statementLang === "en") {
      return {
        limit: function (minutes) { return "Time limit: " + minutes + " min"; },
        fn: "Function",
        example: "Example",
        assume: "Assumptions",
        skipped: " (not runnable)"
      };
    }
    return {
      limit: function (minutes) { return "制限時間 " + minutes + " 分"; },
      fn: "関数",
      example: "例",
      assume: "前提",
      skipped: "（実行対象外）"
    };
  }

  function assumptionText(item) {
    if (!item) return "";
    return typeof item === "string" ? item : item.text || "";
  }

  function runnable(task) {
    return !!(task && task.runnable && task.tests && task.tests.length && answers[task.id] && answers[task.id].code);
  }

  function fillPicker() {
    pick.innerHTML = "";
    if (rehearsal) {
      tasks.forEach(function (task, index) {
        var option = document.createElement("option");
        option.value = task.id;
        option.textContent = "Task " + (index + 1) + "  " + statementTitle(task) + (runnable(task) ? "" : statementChrome().skipped);
        pick.appendChild(option);
      });
      return;
    }
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
        option.textContent = (imagine && trainer && trainer.isDone(task) ? "✓ " : "") +
          statementTitle(task) + (runnable(task) ? "" : statementChrome().skipped);
        group.appendChild(option);
      });
      pick.appendChild(group);
    });
  }

  function updateLangButtons() {
    var slot = document.getElementById("langSlot");
    var sel = document.getElementById("statementLangPick");
    if (!sel) return;
    if (slot) slot.hidden = false;
    var peekOption = sel.querySelector('option[value="en-peek"]');
    if (imagine && !peekOption) {
      peekOption = document.createElement("option");
      peekOption.value = "en-peek";
      peekOption.textContent = "English＋訳";
      peekOption.title = "英語の問題文。1文ごとに日本語訳を開けます";
      sel.insertBefore(peekOption, sel.firstChild);
    } else if (!imagine && peekOption) {
      sel.removeChild(peekOption);
    }
    var sizer = slot && slot.querySelector(".lang-sizer");
    if (sizer) sizer.textContent = imagine ? "English＋訳＋▾▾" : "結果を分析";
    sel.value = statementLang === "ja" ? "ja" : (imagine && peekOn ? "en-peek" : "en");
    sel.disabled = !!(pick && pick.disabled);
  }

  function setStatementLang(value) {
    if (value !== "en" && value !== "ja" && !(imagine && value === "en-peek")) return;
    if (pick && pick.disabled) return;
    var lang = value === "ja" ? "ja" : "en";
    var peek = value === "en-peek";
    if (statementLang === lang && peekOn === peek) {
      updateLangButtons();
      return;
    }
    statementLang = lang;
    peekOn = peek;
    try { sessionStorage.setItem(LANG_STORE, value); } catch (error) { /* The statement still switches. */ }
    var currentId = pick ? pick.value : "";
    fillPicker();
    if (pick && currentId) pick.value = currentId;
    updateLangButtons();
    var task = taskById(currentId);
    if (task) renderStatement(task);
  }

  function paintPatterns() {
    var bar = document.getElementById("patternBar");
    var sel = document.getElementById("patternPick");
    if (!bar || !sel) return;
    if (!rehearsal || !examPatterns.length) {
      bar.hidden = true;
      updateLangButtons();
      return;
    }
    bar.hidden = false;
    if (sel.options.length !== examPatterns.length) {
      sel.innerHTML = "";
      examPatterns.forEach(function (pattern, index) {
        var option = document.createElement("option");
        option.value = String(index);
        option.textContent = pattern.label + "　" + (pattern.name || "");
        option.title = pattern.name || pattern.label;
        sel.appendChild(option);
      });
    }
    sel.value = String(patternIndex);
    sel.disabled = !!(patternLocked || (pick && pick.disabled));
    updateLangButtons();
  }

  function lockPattern(locked) {
    patternLocked = !!locked;
    paintPatterns();
  }

  function choosePattern(index) {
    if (!rehearsal || patternLocked || pick.disabled || index === patternIndex || !examPatterns[index]) {
      paintPatterns();
      return;
    }
    patternIndex = index;
    try { sessionStorage.setItem(PATTERN_STORE, examPatterns[index].id); } catch (error) { /* The paper still changes for this view. */ }
    tasks = taskListFor(index);
    fillPicker();
    paintPatterns();
    pick.dispatchEvent(new Event("change"));
  }

  function applyStatementCollapse() {
    if (!statement) return;
    var isPhone = phoneQuery.matches;
    var collapsed = isPhone && !!statementCollapsed;
    statement.classList.toggle("is-collapsed", collapsed);
    var toggle = statement.querySelector(".stmt-toggle");
    if (!toggle) return;
    toggle.hidden = !isPhone;
    toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
    toggle.textContent = collapsed ? "問題文を開く" : "問題文を閉じる";
  }

  function writingLineIndex(pos, from, to, count) {
    if (count <= 0) return -1;
    if (count === 1) return 0;
    var span = to - from;
    var t = span <= 0 ? 0 : (pos - from) / span;
    if (t < 0) t = 0;
    if (t > 0.999) t = 0.999;
    return Math.floor(t * count);
  }

  function showWritingLine(pos, from, to) {
    if (!statement || !solveHighlightActive) return;
    var lines = statement.querySelectorAll(".stmt-line");
    var at = writingLineIndex(pos, from, to, lines.length);
    var i;
    if (at < 0) {
      var title = statement.querySelector("h1");
      if (title && !title.classList.contains("is-amber")) {
        title.classList.add("is-amber");
        scrollAmberSoon();
      }
      return;
    }
    if (at === writingAmberAt && lines[at] && lines[at].classList.contains("is-amber")) return;
    writingAmberAt = at;
    for (i = 0; i < lines.length; i += 1) lines[i].classList.toggle("is-amber", i === at);
    var titles = statement.querySelectorAll("h1.is-amber");
    for (i = 0; i < titles.length; i += 1) titles[i].classList.remove("is-amber");
    scrollAmberSoon();
  }

  function clearWritingAmber() {
    writingAmberAt = -1;
    if (!statement) return;
    statement.classList.remove("is-solving");
    var nodes = statement.querySelectorAll(".is-amber");
    var i;
    for (i = 0; i < nodes.length; i += 1) nodes[i].classList.remove("is-amber");
  }

  function scrollAmberIntoView() {
    if (!phoneQuery.matches) return;
    var body = statement.querySelector(".stmt-body");
    if (!body) return;
    var line = body.querySelector(".stmt-line.is-amber") || statement.querySelector("h1.is-amber");
    if (line && body.contains(line) && body.scrollHeight > body.clientHeight + 1) {
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
    if (!phoneQuery.matches) return;
    statementCollapsed = !statementCollapsed;
    statementUserSet = true;
    if (solveHighlightActive) userToggledDuringRun = true;
    applyStatementCollapse();
    if (solveHighlightActive) scrollAmberSoon();
  }

  function onPhoneStatementChange() {
    if (!phoneQuery.matches) {
      statementCollapsed = false;
      applyStatementCollapse();
      return;
    }
    if (!statementUserSet || solveHighlightActive) {
      statementCollapsed = true;
    }
    applyStatementCollapse();
    if (solveHighlightActive) scrollAmberSoon();
  }

  function forceStatementClosed() {
    highlightGen += 1;
    window.clearTimeout(solveHighlightTimer);
    solveHighlightTimer = 0;
    if (!solveHighlightActive) collapsedBeforeRun = statementCollapsed;
    solveHighlightActive = true;
    userToggledDuringRun = false;
    if (phoneQuery.matches) statementCollapsed = true;
    else statementCollapsed = false;
    applyStatementCollapse();
  }

  function beginWritingHighlight() {
    forceStatementClosed();
    writingAmberAt = -1;
    statement.classList.add("is-solving");
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
        if (phoneQuery.matches) {
          if (!userToggledDuringRun) statementCollapsed = collapsedBeforeRun !== null ? !!collapsedBeforeRun : true;
        } else {
          statementCollapsed = false;
        }
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
    var chrome = statementChrome();
    statement.appendChild(el("h1", null, statementTitle(task)));
    statement.appendChild(el("p", "muted", chrome.limit(task.minutes)));
    var body = el("div", "stmt-body");
    body.id = "stmtBody";
    var isEn = statementLang === "en" && !!englishPack(task);
    function stmtLine(tag, item) {
      var node = el(tag, "stmt-line");
      if (item && item.id) node.setAttribute("data-sid", item.id);
      if (imagine && trainer) trainer.fillSentence(node, task, item, isEn, peekOn);
      else node.textContent = assumptionText(item);
      return node;
    }
    if (imagine && isEn) {
      body.appendChild(el("p", "muted peek-stat", peekOn
        ? "詰まった文だけ「訳」で確認します。点線の語は解法のシグナルです。"
        : "本番想定：訳なしで、英語の原文から要件とコードを連想します。"));
    }
    (pack.sentences || []).forEach(function (sentence) {
      body.appendChild(stmtLine("p", sentence));
    });
    body.appendChild(el("h2", null, chrome.fn));
    body.appendChild(el("pre", null, task.signature || ""));
    body.appendChild(el("h2", null, chrome.example));
    body.appendChild(el("pre", null, pack.example || ""));
    if ((pack.assumptions || []).length) {
      body.appendChild(el("h2", null, chrome.assume));
      var list = document.createElement("ul");
      pack.assumptions.forEach(function (item) {
        list.appendChild(stmtLine("li", item));
      });
      body.appendChild(list);
    }
    if (imagine && trainer) {
      var glossary = trainer.glossaryNode();
      if (glossary) body.appendChild(glossary);
    }
    statement.appendChild(body);
    applyStatementCollapse();
    if (solveHighlightActive && writingAmberAt >= 0) {
      statement.classList.add("is-solving");
      var kept = statement.querySelectorAll(".stmt-line");
      if (kept[writingAmberAt]) kept[writingAmberAt].classList.add("is-amber");
      scrollAmberSoon();
    }
    renderReadingQuestions(task);
  }

  /* The same reading questions serve two modes: an exam sheet graded on submit in the
     timed mode, and step-by-step training with instant grading in the imagine mode. */
  function renderReadingQuestions(task) {
    if (imagine) {
      readingQuestions.textContent = "";
      if (trainer) trainer.show(task);
      return;
    }
    if (trainer) trainer.clear();
    root.ReadingLab.renderExamQuestions(readingQuestions, task, readingDraft.selections[task.id], function (questionId, choiceId) {
      if (!readingDraft.selections[task.id]) readingDraft.selections[task.id] = {};
      readingDraft.selections[task.id][questionId] = choiceId;
      saveDraft();
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
    if (testInputBox) testInputBox.readOnly = busy;
    if (addTestFileBtn) addTestFileBtn.disabled = busy;
    if (tabAddTestBtn) tabAddTestBtn.disabled = busy;
    if (tabCloseActiveBtn) tabCloseActiveBtn.disabled = busy;
    if (addCaseLineBtn) addCaseLineBtn.disabled = busy;
    if (resetTestFileBtn) resetTestFileBtn.disabled = busy;
    if (runCustomBtn) runCustomBtn.disabled = busy;
    document.getElementById("runLook").disabled = busy;
    var modeSel = document.getElementById("modePick");
    if (modeSel) modeSel.disabled = busy;
    paintPatterns();
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

  function parseSignatureInfo(task) {
    var sig = ((task && task.signature) || "").trim();
    if (!sig || sig.indexOf("fun ") !== 0) {
      return { isClass: true, raw: sig, params: [], returnType: "" };
    }
    var open = sig.indexOf("(");
    if (open < 0) return { isClass: true, raw: sig, params: [], returnType: "" };
    var depth = 0;
    var close = -1;
    var i;
    for (i = open; i < sig.length; i += 1) {
      if (sig.charAt(i) === "(") depth += 1;
      else if (sig.charAt(i) === ")") {
        depth -= 1;
        if (depth === 0) { close = i; break; }
      }
    }
    if (close < 0) return { isClass: true, raw: sig, params: [], returnType: "" };
    var inside = sig.slice(open + 1, close).trim();
    var after = sig.slice(close + 1).trim();
    var returnType = after.charAt(0) === ":" ? after.slice(1).trim() : "Unit";
    var params = [];
    if (inside) {
      var parts = [];
      var start = 0;
      var angle = 0;
      var paren = 0;
      for (i = 0; i < inside.length; i += 1) {
        var ch = inside.charAt(i);
        if (ch === "<") angle += 1;
        else if (ch === ">") angle = Math.max(0, angle - 1);
        else if (ch === "(") paren += 1;
        else if (ch === ")") paren = Math.max(0, paren - 1);
        else if (ch === "," && angle === 0 && paren === 0) {
          parts.push(inside.slice(start, i));
          start = i + 1;
        }
      }
      parts.push(inside.slice(start));
      parts.forEach(function (part) {
        var piece = part.trim();
        if (!piece) return;
        var colon = piece.indexOf(":");
        if (colon < 0) params.push({ name: piece, type: "Int" });
        else {
          params.push({
            name: piece.slice(0, colon).trim(),
            type: piece.slice(colon + 1).trim()
          });
        }
      });
    }
    return { isClass: false, raw: sig, params: params, returnType: returnType };
  }

  function rawValueFromSpec(spec) {
    if (spec == null || typeof spec !== "object" || Array.isArray(spec)) return spec;
    var keys = ["ia", "la", "sa", "grid", "n", "L", "s", "b"];
    var i;
    for (i = 0; i < keys.length; i += 1) {
      if (Object.prototype.hasOwnProperty.call(spec, keys[i])) return spec[keys[i]];
    }
    var first = Object.keys(spec)[0];
    return first ? spec[first] : null;
  }

  function formatLiteralValue(val) {
    if (typeof val === "string") return JSON.stringify(val);
    if (typeof val === "boolean" || typeof val === "number") return String(val);
    if (Array.isArray(val)) return "[" + val.map(formatLiteralValue).join(", ") + "]";
    return JSON.stringify(val);
  }

  function formatArgsAsLine(args) {
    return (args || []).map(function (spec) {
      return formatLiteralValue(rawValueFromSpec(spec));
    }).join(", ");
  }

  function wrapRawForType(rawVal, typeName) {
    var t = (typeName || "").replace(/\s+/g, "");
    if (t === "IntArray") return { ia: Array.isArray(rawVal) ? rawVal.map(function (x) { return Math.trunc(Number(x)); }) : [] };
    if (t === "LongArray") return { la: Array.isArray(rawVal) ? rawVal.map(function (x) { return Math.trunc(Number(x)); }) : [] };
    if (t === "Array<IntArray>") {
      return {
        grid: Array.isArray(rawVal) ? rawVal.map(function (row) {
          return Array.isArray(row) ? row.map(function (x) { return Math.trunc(Number(x)); }) : [];
        }) : []
      };
    }
    if (t === "Array<String>" || t === "List<String>") {
      return { sa: Array.isArray(rawVal) ? rawVal.map(String) : [] };
    }
    if (t === "Long") return { L: Math.trunc(Number(rawVal)) };
    if (t === "Int") return { n: Math.trunc(Number(rawVal)) };
    if (t === "String") return { s: String(rawVal) };
    if (t === "Boolean") return { b: !!rawVal };
    if (Array.isArray(rawVal)) return { ia: rawVal.map(function (x) { return Math.trunc(Number(x)); }) };
    if (typeof rawVal === "string") return { s: rawVal };
    if (typeof rawVal === "boolean") return { b: rawVal };
    return { n: Math.trunc(Number(rawVal) || 0) };
  }

  function generateVariantArgs(task, seed) {
    var info = parseSignatureInfo(task);
    var params = info.params;
    if (!params.length) return [];
    var step = Math.max(1, seed || 1);
    var sampleTests = (task && task.tests) || [];
    if (task && task.id === "unpaired") {
      var oddVal = 3 + step * 2;
      var pairA = 2 + step;
      var pairB = 10 + step;
      return [{ ia: [pairA, oddVal, pairA, pairB, pairB] }];
    }
    if (sampleTests.length) {
      var baseTest = sampleTests[(step - 1) % sampleTests.length];
      var baseRaws = (baseTest.args || []).map(rawValueFromSpec);
      if (baseRaws.length === params.length) {
        var hasGraphN = params.length === 3 && params[0].name === "N" && params[0].type === "Int" && params[1].type === "IntArray" && params[2].type === "IntArray";
        if (hasGraphN) {
          var nNodes = Math.max(3, 3 + (step % 4));
          var uArr = [];
          var vArr = [];
          var g;
          var oneBased = Array.isArray(baseRaws[1]) && baseRaws[1].concat(baseRaws[2] || []).every(function (v) { return v >= 1; }) &&
            baseRaws[1].concat(baseRaws[2] || []).some(function (v) { return v === baseRaws[0]; });
          for (g = 0; g < nNodes - 1; g += 1) {
            uArr.push(oneBased ? g + 1 : g);
            vArr.push(oneBased ? g + 2 : g + 1);
          }
          return [{ n: nNodes }, { ia: uArr }, { ia: vArr }];
        }
        if (params.length === 3 && params[0].type === "String" && params[1].name === "P" && params[2].name === "Q") {
          var dna = step % 2 === 1 ? "ACGTACGT" : "GTTACGA";
          return [{ s: dna }, { ia: [0, 1, 2] }, { ia: [dna.length - 1, 3, 5] }];
        }
        return params.map(function (param, idx) {
          var orig = baseRaws[idx];
          var pName = param.name;
          var pType = param.type;
          if (pType === "String") {
            var sOrig = String(orig != null ? orig : "");
            if (/^\d+\.\d+\.\d+$/.test(sOrig)) {
              return { s: "14." + (2 + (step % 4)) + "." + ((idx + step) * 2) };
            }
            if (sOrig.indexOf("://") !== -1) {
              return { s: "app://items/view?id=" + (10 + step) + "&utm_source=test&sort=asc&tag=v" + step + "#section" };
            }
            if (/\d\d:\d\d:\d\d,/.test(sOrig)) {
              return { s: "00:01:" + String(10 + (step % 40)).padStart(2, "0") + ",400-234-090\n00:05:1" + (step % 9) + ",701-080-080" };
            }
            if (/\b(DUP|POP)\b|[0-9]+ [0-9]+ [+-]/.test(sOrig)) {
              return { s: (3 + step) + " " + (5 + step) + " + DUP 2 -" };
            }
            if (sOrig.indexOf(" ") !== -1) {
              return { s: "Kotlin test case number " + step + " for check" };
            }
            return { s: sOrig ? sOrig + String.fromCharCode(97 + (step % 5)) : "sample" + step };
          }
          if (pType === "IntArray" || pType === "LongArray") {
            var arr = Array.isArray(orig) ? orig.slice() : [1, 2, 3];
            if (!arr.length) arr = [1, 2, 3];
            var allZeroOne = arr.length > 1 && arr.every(function (v) { return v === 0 || v === 1; });
            var mutated = arr.map(function (v, k) {
              if (allZeroOne) return (v + ((k + step) % 2)) % 2;
              if (/end|Bottom/i.test(pName) && idx > 0 && Array.isArray(baseRaws[idx - 1])) {
                var startVal = Number(baseRaws[idx - 1][k] || 0) + step;
                return Math.max(startVal + 2 + k, Number(v) + step * 2);
              }
              return Number(v) + ((k % 2 === 0) ? step : 0);
            });
            return wrapRawForType(mutated, pType);
          }
          if (pType === "Array<IntArray>") {
            var grid = Array.isArray(orig) && orig.length ? orig : [[1, 2], [3, 4]];
            return {
              grid: grid.map(function (row, r) {
                return row.map(function (cell, c) { return Number(cell) + ((r + c + step) % 2); });
              })
            };
          }
          if (pType === "Boolean") return { b: step % 2 === 0 };
          if (pType === "Long") {
            var baseL = Number(orig || 10);
            if (/bottom/i.test(pName) && idx > 0) return { L: Number(baseRaws[idx - 1] || 0) + step * 20 + 100 };
            return { L: baseL + step * 10 };
          }
          var baseN = Number(orig != null ? orig : 3);
          return { n: Math.max(1, baseN + (step % 4)) };
        });
      }
    }
    return params.map(function (param, idx) {
      var t = param.type;
      if (t === "IntArray") return { ia: [1 + step, 2 + idx, 3 + step] };
      if (t === "LongArray") return { la: [10 * step, 20 * step, 30 * step] };
      if (t === "Array<IntArray>") return { grid: [[1, 2 + step], [3, 4 + step]] };
      if (t === "Array<String>" || t === "List<String>") return { sa: ["a" + step, "b" + step] };
      if (t === "String") return { s: "sample_" + step };
      if (t === "Boolean") return { b: step % 2 === 1 };
      if (t === "Long") return { L: 100 * step };
      return { n: 2 + step + idx };
    });
  }

  function buildInitialTestFileContent(task, fileIndex) {
    var info = parseSignatureInfo(task);
    if (info.isClass || !task || !task.runnable) {
      return [
        "// " + ((task && task.signature) || "class 形式の問題"),
        "// この問題は class 形式のため、ブラウザ内実行機ではなく外部IDEで単体テストを確認してください。",
        "// 確認したい境界ケースメモをここに自由に書き残せます。"
      ].join("\n") + "\n";
    }
    var paramDesc = info.params.map(function (p) { return p.name + ": " + p.type; }).join(", ");
    var header = [
      "// 関数: " + info.raw,
      "// 引数: " + (paramDesc || "なし") + " （1行 = 1テストケース / 入力 => 期待値 も指定可）"
    ];
    var lines = [];
    if (fileIndex === 0 && task.tests && task.tests.length) {
      task.tests.forEach(function (tc) {
        lines.push(formatArgsAsLine(tc.args));
      });
      if (lines.length < 2) {
        lines.push(formatArgsAsLine(generateVariantArgs(task, 1)));
      }
    } else {
      var baseSeed = Math.max(1, fileIndex * 2);
      lines.push(formatArgsAsLine(generateVariantArgs(task, baseSeed)));
      lines.push(formatArgsAsLine(generateVariantArgs(task, baseSeed + 1)));
    }
    return header.concat(lines).join("\n") + "\n";
  }

  function ensureTaskTestState(task) {
    if (!task) return null;
    var state = readingDraft.testFiles[task.id];
    if (!state || !Array.isArray(state.files) || !state.files.length) {
      state = {
        files: [
          {
            id: "test-1",
            name: "test-input.txt",
            content: buildInitialTestFileContent(task, 0)
          }
        ],
        openTabs: ["sol"],
        activeTab: "sol",
        nextSeq: 2,
        lineSeed: 1
      };
      readingDraft.testFiles[task.id] = state;
    } else {
      if (!Array.isArray(state.openTabs) || !state.openTabs.length) state.openTabs = ["sol"];
      if (state.openTabs.indexOf("sol") === -1) state.openTabs.unshift("sol");
      if (!state.activeTab) state.activeTab = "sol";
      if (!state.nextSeq || state.nextSeq < 2) state.nextSeq = state.files.length + 1;
      if (!state.lineSeed) state.lineSeed = 1;
    }
    return state;
  }

  function findTestFile(state, fileId) {
    if (!state || !state.files) return null;
    var i;
    for (i = 0; i < state.files.length; i += 1) {
      if (state.files[i].id === fileId) return state.files[i];
    }
    return null;
  }

  function splitTopLevel(text, delimiter) {
    var out = [];
    var start = 0;
    var sq = 0;
    var par = 0;
    var cur = 0;
    var inStr = "";
    var i;
    for (i = 0; i < text.length; i += 1) {
      var ch = text.charAt(i);
      if (inStr) {
        if (ch === "\\") { i += 1; continue; }
        if (ch === inStr) inStr = "";
        continue;
      }
      if (ch === '"' || ch === "'") { inStr = ch; continue; }
      if (ch === "[") sq += 1;
      else if (ch === "]") sq = Math.max(0, sq - 1);
      else if (ch === "(") par += 1;
      else if (ch === ")") par = Math.max(0, par - 1);
      else if (ch === "{") cur += 1;
      else if (ch === "}") cur = Math.max(0, cur - 1);
      else if (sq === 0 && par === 0 && cur === 0 && text.slice(i, i + delimiter.length) === delimiter) {
        out.push(text.slice(start, i));
        start = i + delimiter.length;
        i += delimiter.length - 1;
      }
    }
    out.push(text.slice(start));
    return out;
  }

  function stripOuterParens(text) {
    var s = text.trim();
    if (s.charAt(0) !== "(" || s.charAt(s.length - 1) !== ")") return s;
    var depth = 0;
    var inStr = "";
    var i;
    for (i = 0; i < s.length; i += 1) {
      var ch = s.charAt(i);
      if (inStr) {
        if (ch === "\\") { i += 1; continue; }
        if (ch === inStr) inStr = "";
        continue;
      }
      if (ch === '"' || ch === "'") { inStr = ch; continue; }
      if (ch === "(") depth += 1;
      else if (ch === ")") {
        depth -= 1;
        if (depth === 0 && i < s.length - 1) return s;
      }
    }
    return depth === 0 ? s.slice(1, -1).trim() : s;
  }

  function normalizeKotlinLiteral(tokenText, expectedType) {
    var s = tokenText.trim();
    s = s.replace(/^(intArrayOf|longArrayOf|arrayOf|listOf)\s*\(([\s\S]*)\)$/, "[$2]");
    var t = (expectedType || "").replace(/\s+/g, "");
    if (t === "String") {
      if ((s.charAt(0) === '"' && s.charAt(s.length - 1) === '"')) {
        return JSON.parse(s);
      }
      if (s.charAt(0) === "'" && s.charAt(s.length - 1) === "'") {
        return s.slice(1, -1).replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\'/g, "'");
      }
      return s;
    }
    if (t === "Boolean") {
      if (s === "true") return true;
      if (s === "false") return false;
      throw new Error("真偽値（true または false）を指定してください: " + s);
    }
    if (t === "Int" || t === "Long") {
      var cleanedNum = s.replace(/_/g, "").replace(/[Ll]$/, "");
      if (!/^[+-]?\d+$/.test(cleanedNum)) {
        throw new Error("整数を指定してください: " + s);
      }
      return Number(cleanedNum);
    }
    if (t === "IntArray" || t === "LongArray") {
      var arrText = s;
      if (arrText.charAt(0) !== "[") arrText = "[" + arrText + "]";
      var cleanedArr = arrText.replace(/(\d)_(\d)/g, "$1$2").replace(/(-?\d+)[Ll]\b/g, "$1");
      var parsed = JSON.parse(cleanedArr);
      if (!Array.isArray(parsed)) throw new Error("配列 [ ... ] を指定してください: " + s);
      return parsed.map(function (v) {
        if (typeof v !== "number" || !isFinite(v)) throw new Error("配列の要素は数値にしてください: " + s);
        return Math.trunc(v);
      });
    }
    if (t === "Array<IntArray>") {
      var gridParsed = JSON.parse(s.replace(/(\d)_(\d)/g, "$1$2").replace(/(-?\d+)[Ll]\b/g, "$1"));
      if (!Array.isArray(gridParsed) || !gridParsed.every(Array.isArray)) {
        throw new Error("2次元配列 [[...], [...]] を指定してください: " + s);
      }
      return gridParsed;
    }
    if (t === "Array<String>" || t === "List<String>") {
      var strArr = JSON.parse(s);
      if (!Array.isArray(strArr)) throw new Error("文字列配列 [\"...\"] を指定してください: " + s);
      return strArr.map(String);
    }
    var fallbackClean = s.replace(/(\d)_(\d)/g, "$1$2").replace(/(-?\d+)[Ll]\b/g, "$1");
    return JSON.parse(fallbackClean);
  }

  function parseTestCasesFromFile(task, fileObj) {
    var info = parseSignatureInfo(task);
    var params = info.params;
    var lines = String((fileObj && fileObj.content) || "").split(/\r?\n/);
    var cases = [];
    var errors = [];
    var lineIdx;
    for (lineIdx = 0; lineIdx < lines.length; lineIdx += 1) {
      var rawLine = lines[lineIdx].trim();
      if (!rawLine || rawLine.indexOf("//") === 0 || rawLine.indexOf("#") === 0) continue;
      var arrowParts = splitTopLevel(rawLine, "=>");
      var inputPart = arrowParts[0].trim();
      var expectPart = arrowParts.length > 1 ? arrowParts.slice(1).join("=>").trim() : "";
      var unwrapped = stripOuterParens(inputPart);
      try {
        var argSpecs = [];
        if (params.length === 0) {
          if (unwrapped && unwrapped !== "()") {
            throw new Error("この関数は引数を取りません");
          }
        } else if (params.length === 1) {
          var singleText = unwrapped;
          var eqMatch1 = singleText.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([\s\S]+)$/);
          if (eqMatch1 && eqMatch1[1] === params[0].name) singleText = eqMatch1[2].trim();
          var val1 = normalizeKotlinLiteral(singleText, params[0].type);
          argSpecs.push(wrapRawForType(val1, params[0].type));
        } else {
          var tokens = splitTopLevel(unwrapped, ",");
          if (tokens.length !== params.length) {
            var expectedNames = params.map(function (p) { return p.name + ": " + p.type; }).join(", ");
            throw new Error("引数は " + params.length + " 個（" + expectedNames + "）必要ですが、" + tokens.length + " 個でした");
          }
          var pIdx;
          for (pIdx = 0; pIdx < params.length; pIdx += 1) {
            var tok = tokens[pIdx].trim();
            var eqMatch = tok.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*([\s\S]+)$/);
            if (eqMatch && eqMatch[1] === params[pIdx].name) tok = eqMatch[2].trim();
            var parsedVal = normalizeKotlinLiteral(tok, params[pIdx].type);
            argSpecs.push(wrapRawForType(parsedVal, params[pIdx].type));
          }
        }
        var hasExplicitExpect = expectPart !== "";
        var explicitExpect = hasExplicitExpect ? normalizeKotlinLiteral(expectPart, info.returnType) : null;
        cases.push({
          name: fileObj.name + " #" + (cases.length + 1) + "（" + (lineIdx + 1) + "行目）",
          fileName: fileObj.name,
          lineNo: lineIdx + 1,
          args: argSpecs,
          hasExplicitExpect: hasExplicitExpect,
          expect: explicitExpect
        });
      } catch (err) {
        errors.push(fileObj.name + " " + (lineIdx + 1) + "行目: " + (err && err.message ? err.message : "入力形式を確認してください"));
      }
    }
    return { cases: cases, errors: errors };
  }

  function updateTestBannerForEditor(task) {
    if (!testBannerEl || !task) return;
    var state = ensureTaskTestState(task);
    if (!state || state.activeTab === "sol") return;
    var activeFile = findTestFile(state, state.activeTab);
    if (!activeFile) return;
    var info = parseSignatureInfo(task);
    if (info.isClass || !task.runnable) {
      testBannerEl.textContent = activeFile.name + "（class 問題は外部IDEでテストを実行します）";
      return;
    }
    var parsed = parseTestCasesFromFile(task, activeFile);
    if (parsed.errors.length) {
      testBannerEl.textContent = "⚠ " + parsed.errors[0];
    } else {
      testBannerEl.textContent = activeFile.name + " — 有効なテストケース " + parsed.cases.length + " 件（下の「この入力で動作確認」または「Run code」で実行できます）";
    }
  }

  function renderWorkspaceTabs(task) {
    if (!task) return;
    var state = ensureTaskTestState(task);
    var activeId = state.activeTab;
    if (activeId !== "sol" && !findTestFile(state, activeId)) {
      activeId = "sol";
      state.activeTab = "sol";
    }
    if (fileListEl) {
      fileListEl.textContent = "";
      var solRow = el("div", "file-row" + (activeId === "sol" ? " is-on" : ""));
      var solBtn = el("button", "file" + (activeId === "sol" ? " is-on" : ""), "solution.kt");
      solBtn.type = "button";
      solBtn.id = "fileSol";
      solBtn.addEventListener("click", function () {
        if (pick.disabled) return;
        activateWorkspaceTab("sol");
      });
      solRow.appendChild(solBtn);
      fileListEl.appendChild(solRow);

      state.files.forEach(function (f, idx) {
        var isOn = activeId === f.id;
        var row = el("div", "file-row" + (isOn ? " is-on" : ""));
        var btn = el("button", "file" + (isOn ? " is-on" : ""), f.name);
        btn.type = "button";
        if (idx === 0) btn.id = "fileTest";
        btn.addEventListener("click", function () {
          if (pick.disabled) return;
          openAndActivateTestFile(f.id);
        });
        row.appendChild(btn);
        if (idx > 0) {
          var delBtn = el("button", "file-del", "×");
          delBtn.type = "button";
          delBtn.title = f.name + " を削除";
          delBtn.setAttribute("aria-label", f.name + " を削除");
          delBtn.disabled = pick.disabled;
          delBtn.addEventListener("click", function (ev) {
            ev.stopPropagation();
            if (pick.disabled) return;
            deleteTestFile(f.id);
          });
          row.appendChild(delBtn);
        }
        fileListEl.appendChild(row);
      });
    }

    if (editorTabsEl) {
      editorTabsEl.textContent = "";
      state.openTabs.forEach(function (tabId) {
        var label = "solution.kt";
        if (tabId !== "sol") {
          var fObj = findTestFile(state, tabId);
          if (!fObj) return;
          label = fObj.name;
        }
        var isSelected = tabId === activeId;
        var tabBtn = el("button", "tab", label);
        tabBtn.type = "button";
        tabBtn.setAttribute("role", "tab");
        tabBtn.id = "tab-" + tabId;
        tabBtn.setAttribute("aria-selected", isSelected ? "true" : "false");
        tabBtn.tabIndex = isSelected ? 0 : -1;
        tabBtn.addEventListener("click", function () {
          if (pick.disabled) return;
          activateWorkspaceTab(tabId);
        });
        editorTabsEl.appendChild(tabBtn);
        if (isSelected) {
          /* Scroll only the tab strip sideways. scrollIntoView would also move the page. */
          window.requestAnimationFrame(function () {
            var strip = editorTabsEl.getBoundingClientRect();
            var box = tabBtn.getBoundingClientRect();
            if (box.left < strip.left) editorTabsEl.scrollLeft -= strip.left - box.left;
            else if (box.right > strip.right) editorTabsEl.scrollLeft += box.right - strip.right;
          });
        }
      });
    }

    var onSol = activeId === "sol";
    if (solPanelEl) solPanelEl.hidden = !onSol;
    if (testPanelEl) {
      testPanelEl.hidden = onSol;
      if (!onSol) testPanelEl.setAttribute("aria-labelledby", "tab-" + activeId);
    }
    if (tabCloseActiveBtn) {
      tabCloseActiveBtn.hidden = onSol;
      tabCloseActiveBtn.disabled = pick.disabled;
    }
    if (tabMetaEl) {
      tabMetaEl.textContent = onSol ? "Language: Kotlin" : "Test Input（1行1ケース）";
    }
    if (!onSol) {
      var activeFileObj = findTestFile(state, activeId);
      var sigInfo = parseSignatureInfo(task);
      if (testSigHintEl) {
        testSigHintEl.textContent = sigInfo.isClass
          ? (sigInfo.raw || "class 形式")
          : "引数: " + (sigInfo.params.map(function (p) { return p.name + ": " + p.type; }).join(", ") || "なし") + " → 返り値: " + sigInfo.returnType;
      }
      if (testInputBox && activeFileObj && testInputBox.value !== activeFileObj.content) {
        testInputBox.value = activeFileObj.content;
      }
      updateTestBannerForEditor(task);
    }
  }

  function activateWorkspaceTab(tabId) {
    var task = taskById(pick.value);
    if (!task) return;
    var state = ensureTaskTestState(task);
    if (tabId !== "sol" && state.openTabs.indexOf(tabId) === -1) {
      state.openTabs.push(tabId);
    }
    state.activeTab = tabId;
    saveDraft();
    renderWorkspaceTabs(task);
    if (tabId === "sol") renderGutter({}, currentLineNo);
  }

  function openAndActivateTestFile(fileId) {
    var task = taskById(pick.value);
    if (!task) return;
    var state = ensureTaskTestState(task);
    var target = findTestFile(state, fileId);
    if (!target) return;
    if (!target.content || !target.content.trim()) {
      target.content = buildInitialTestFileContent(task, state.files.indexOf(target));
    }
    if (state.openTabs.indexOf(fileId) === -1) {
      state.openTabs.push(fileId);
    }
    state.activeTab = fileId;
    saveDraft();
    renderWorkspaceTabs(task);
  }

  function createNewTestFile() {
    var task = taskById(pick.value);
    if (!task) return;
    var state = ensureTaskTestState(task);
    var seq = state.nextSeq || (state.files.length + 1);
    while (state.files.some(function (f) { return f.name === "test-input-" + seq + ".txt"; })) {
      seq += 1;
    }
    state.nextSeq = seq + 1;
    var newFile = {
      id: "test-" + seq,
      name: "test-input-" + seq + ".txt",
      content: buildInitialTestFileContent(task, state.files.length)
    };
    state.files.push(newFile);
    state.openTabs.push(newFile.id);
    state.activeTab = newFile.id;
    saveDraft();
    renderWorkspaceTabs(task);
    if (testInputBox) testInputBox.focus();
  }

  function closeActiveTestTab() {
    var task = taskById(pick.value);
    if (!task) return;
    var state = ensureTaskTestState(task);
    var curId = state.activeTab;
    if (curId === "sol") return;
    var at = state.openTabs.indexOf(curId);
    if (at !== -1) state.openTabs.splice(at, 1);
    state.activeTab = state.openTabs[Math.max(0, at - 1)] || "sol";
    saveDraft();
    renderWorkspaceTabs(task);
  }

  function deleteTestFile(fileId) {
    var task = taskById(pick.value);
    if (!task) return;
    var state = ensureTaskTestState(task);
    var idx = -1;
    var i;
    for (i = 0; i < state.files.length; i += 1) {
      if (state.files[i].id === fileId) { idx = i; break; }
    }
    if (idx <= 0) return;
    state.files.splice(idx, 1);
    var tabIdx = state.openTabs.indexOf(fileId);
    if (tabIdx !== -1) state.openTabs.splice(tabIdx, 1);
    if (state.activeTab === fileId) state.activeTab = state.openTabs[state.openTabs.length - 1] || "sol";
    saveDraft();
    renderWorkspaceTabs(task);
  }

  function showFile(which) {
    var task = taskById(pick.value);
    var state = task ? ensureTaskTestState(task) : null;
    if (which === "sol" && state && state.activeTab !== "sol" && pick.disabled) {
      state.activeTab = "sol";
      renderWorkspaceTabs(task);
    }
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
    gutter.scrollTop = codeBox.scrollTop;
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

  /* What the editor shows before the user types. Bug-fix tasks come with the code to
     repair; every other task starts from the empty shell. */
  function starterOf(task) {
    var starter = task.starter || "";
    var openAt = starter.indexOf("{");
    if (openAt >= 0 && starter.slice(openAt).replace(/[\s{}]/g, "")) return starter;
    return shellOf(task);
  }

  /* The saved code of a task. An empty shell saved before the given code existed does
     not hide the code to repair. */
  function codeOf(task) {
    var given = starterOf(task);
    if (!Object.prototype.hasOwnProperty.call(readingDraft.codes, task.id)) return given;
    var saved = readingDraft.codes[task.id];
    if (given !== shellOf(task) && (saved.trim() === "" || saved === shellOf(task))) return given;
    return saved;
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
    var shell = codeOf(task);
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
      beginWritingHighlight();
      var i = start;
      showWritingLine(i, start, end);
      while (i < end) {
        if (session !== token) return false;
        if (frame && frame.sigStart > 0 && i >= frame.sigStart && i < frame.bodyStart) {
          i = frame.bodyStart;
          codeBox.value = renderFramed(source, i, frame);
          renderGutter({}, 0);
          placeCaret(i);
          showWritingLine(i, start, end);
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
          showWritingLine(i, start, end);
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
        showWritingLine(i, start, end);
      }
      codeBox.value = source;
      renderGutter({}, 0);
      return session === token;
    } finally {
      clearWritingAmber();
      idleEditor();
    }
  }

  function inspectExecutedRow(row, index) {
    var items = results.querySelectorAll(".case-item");
    var i;
    for (i = 0; i < items.length; i += 1) items[i].classList.toggle("is-current", i === index);
    caseNow.textContent = "";
    caseNow.appendChild(el("p", null, "テスト " + row.name));
    if (row.inputSummary != null) {
      caseNow.appendChild(el("p", null, "入力 " + row.inputSummary));
    }
    caseNow.appendChild(el("p", null, "返り値 " + shown(row.actual)));
    if (row.hasExpect !== false) {
      caseNow.appendChild(el("p", null, "期待する返り値 " + shown(row.expected)));
    }
    var outLines = row.output || [];
    consoleOut.textContent = outLines.length ? outLines.join("\n") : "（標準出力はありません）";
    if (testBannerEl) {
      var banner = "[" + row.name + "] 入力: " + (row.inputSummary != null ? row.inputSummary : "なし") +
        "\n返り値: " + shown(row.actual) +
        (row.hasExpect !== false ? " / 期待値: " + shown(row.expected) + (row.ok ? "（一致）" : "（不一致）") : "（動作確認完了）");
      testBannerEl.textContent = banner;
    }
  }

  function showTests(rows) {
    results.textContent = "";
    if (!rows.length) {
      results.appendChild(el("p", null, "テストケースがありません。test-input タブでケース行を追加してください。"));
      return;
    }
    rows.forEach(function (row, index) {
      var wrap = el("div", "case-item" + (index === 0 ? " is-current" : ""));
      var hasExpect = row.hasExpect !== false;
      var statusClass = hasExpect ? (row.ok ? "pass" : "fail") : "pass";
      var line = row.name + " — " + (hasExpect ? (row.ok ? "合っています" : "期待と違います") : "実行完了");
      var head = el("p", statusClass, line);
      head.setAttribute("data-sample", String(index));
      wrap.appendChild(head);
      var detail = (row.inputSummary != null ? "入力: " + row.inputSummary + " → " : "") +
        "結果: " + shown(row.actual) +
        (hasExpect ? " / 期待: " + shown(row.expected) : "");
      wrap.appendChild(el("p", "muted", detail));
      wrap.addEventListener("click", function () {
        inspectExecutedRow(row, index);
      });
      results.appendChild(wrap);
    });
    if (rows[0] && rows[0].inputSummary != null) {
      inspectExecutedRow(rows[0], 0);
    }
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
    var st = ensureTaskTestState(task);
    if (st) st.activeTab = "sol";
    renderWorkspaceTabs(task);
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
    noteAddress();
    renderStatement(task);
    ensureTaskTestState(task);
    renderWorkspaceTabs(task);
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
    if (testBannerEl && ensureTaskTestState(task).activeTab === "sol") {
      testBannerEl.textContent = "テスト入力は、デバッグ中にここに出ます。（左の Files から test-input.txt を開くとテスト入力を追加・編集できます）";
    }
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
  function executeManualTests(onlyActiveFile) {
    var task = taskById(pick.value);
    if (!task) return;
    var source = codeBox.value;
    readingDraft.codes[task.id] = source;
    var run = { source: source, tests: [], error: "" };
    results.textContent = "";
    if (!task.runnable) {
      run.error = "この問題は練習用実行機で実行できません。外部IDEで確認してください。";
      readingDraft.runs[task.id] = run;
      saveDraft();
      results.appendChild(el("p", "fail", "実行できません: " + run.error));
      return;
    }
    var state = ensureTaskTestState(task);
    var targetFiles = state.files;
    if (onlyActiveFile && state.activeTab !== "sol") {
      var activeF = findTestFile(state, state.activeTab);
      if (activeF) targetFiles = [activeF];
    }
    var collected = [];
    var parseErrors = [];
    targetFiles.forEach(function (fObj) {
      var parsed = parseTestCasesFromFile(task, fObj);
      if (parsed.errors.length) parseErrors = parseErrors.concat(parsed.errors);
      collected = collected.concat(parsed.cases);
    });
    if (parseErrors.length) {
      run.error = parseErrors.join(" / ");
      readingDraft.runs[task.id] = run;
      saveDraft();
      parseErrors.forEach(function (msg) {
        results.appendChild(el("p", "fail", "テスト入力エラー: " + msg));
      });
      if (testBannerEl) testBannerEl.textContent = "⚠ " + parseErrors[0];
      return;
    }
    if (!collected.length) {
      run.error = "有効なテスト入力行がありません。test-input タブで「＋ ケース行を追加」を押すか入力を記述してください。";
      readingDraft.runs[task.id] = run;
      saveDraft();
      results.appendChild(el("p", "fail", run.error));
      return;
    }

    var refCode = answers[task.id] && answers[task.id].code ? answers[task.id].code : "";
    var runnableCases = collected.map(function (c) {
      var expectVal = c.expect;
      var hasExpect = !!c.hasExplicitExpect;
      if (!hasExpect && refCode) {
        try {
          var refOut = root.Kotlite.runTests(refCode, [{ name: c.name, args: c.args, expect: null }]);
          if (refOut && refOut.results && refOut.results.length === 1) {
            expectVal = refOut.results[0].actual;
            hasExpect = true;
          }
        } catch (refErr) {
          hasExpect = false;
        }
      }
      return {
        name: c.name,
        args: c.args,
        expect: expectVal,
        hasExpect: hasExpect,
        inputSummary: formatArgsAsLine(c.args),
        because: ""
      };
    });

    forceStatementClosed();
    setRunning(true);
    try {
      var outcome = root.Kotlite.runTests(source, runnableCases);
      if (outcome.paused || !outcome.results || outcome.results.length !== runnableCases.length) {
        run.error = "テスト実行を完了できませんでした。";
      } else {
        run.tests = outcome.results.map(function (row, index) {
          var specCase = runnableCases[index];
          return {
            name: row.name,
            ok: specCase.hasExpect ? !!row.ok : true,
            hasExpect: specCase.hasExpect,
            actual: row.actual,
            expected: row.expected,
            output: row.output || [],
            inputSummary: specCase.inputSummary,
            because: specCase.because || ""
          };
        });
      }
    } catch (error) {
      run.error = (error && error.message) ? error.message + (error.line ? "（" + error.line + "行目）" : "") : "実行できませんでした。";
    }
    endSolveHighlight(2400);
    readingDraft.runs[task.id] = run;
    saveDraft();
    if (run.error) {
      results.appendChild(el("p", "fail", "実行できません: " + run.error));
      if (testBannerEl) testBannerEl.textContent = "実行エラー: " + run.error;
    } else {
      showTests(run.tests);
    }
  }

  document.getElementById("runLook").addEventListener("click", function () {
    executeManualTests(false);
  });
  if (runCustomBtn) {
    runCustomBtn.addEventListener("click", function () {
      executeManualTests(true);
    });
  }
  if (addTestFileBtn) {
    addTestFileBtn.addEventListener("click", function () {
      if (pick.disabled) return;
      createNewTestFile();
    });
  }
  if (tabAddTestBtn) {
    tabAddTestBtn.addEventListener("click", function () {
      if (pick.disabled) return;
      var task = taskById(pick.value);
      if (!task) return;
      var state = ensureTaskTestState(task);
      if (state.files[0] && state.openTabs.indexOf(state.files[0].id) === -1) {
        openAndActivateTestFile(state.files[0].id);
      } else {
        createNewTestFile();
      }
    });
  }
  if (tabCloseActiveBtn) {
    tabCloseActiveBtn.addEventListener("click", function () {
      if (pick.disabled) return;
      closeActiveTestTab();
    });
  }
  if (testInputBox) {
    testInputBox.addEventListener("input", function () {
      var task = taskById(pick.value);
      if (!task) return;
      var state = ensureTaskTestState(task);
      var activeFile = findTestFile(state, state.activeTab);
      if (!activeFile) return;
      activeFile.content = testInputBox.value;
      saveDraft();
      updateTestBannerForEditor(task);
    });
  }
  if (addCaseLineBtn) {
    addCaseLineBtn.addEventListener("click", function () {
      if (pick.disabled) return;
      var task = taskById(pick.value);
      if (!task) return;
      var state = ensureTaskTestState(task);
      var activeFile = findTestFile(state, state.activeTab);
      if (!activeFile) return;
      var info = parseSignatureInfo(task);
      if (info.isClass || !task.runnable) return;
      var seed = state.lineSeed || 1;
      state.lineSeed = seed + 1;
      var newLine = formatArgsAsLine(generateVariantArgs(task, seed));
      var cur = activeFile.content || "";
      if (cur && cur.charAt(cur.length - 1) !== "\n") cur += "\n";
      activeFile.content = cur + newLine + "\n";
      if (testInputBox) {
        testInputBox.value = activeFile.content;
        testInputBox.scrollTop = testInputBox.scrollHeight;
        testInputBox.focus();
      }
      saveDraft();
      updateTestBannerForEditor(task);
    });
  }
  if (resetTestFileBtn) {
    resetTestFileBtn.addEventListener("click", function () {
      if (pick.disabled) return;
      var task = taskById(pick.value);
      if (!task) return;
      var state = ensureTaskTestState(task);
      var activeFile = findTestFile(state, state.activeTab);
      if (!activeFile) return;
      var idx = state.files.indexOf(activeFile);
      activeFile.content = buildInitialTestFileContent(task, Math.max(0, idx));
      if (testInputBox) testInputBox.value = activeFile.content;
      saveDraft();
      updateTestBannerForEditor(task);
    });
  }
  if (editorTabsEl) {
    editorTabsEl.addEventListener("keydown", function (ev) {
      if (pick.disabled) return;
      var tabs = Array.prototype.slice.call(editorTabsEl.querySelectorAll('[role="tab"]'));
      if (tabs.length < 2) return;
      var currentIdx = tabs.indexOf(document.activeElement);
      if (currentIdx < 0) return;
      var nextIdx = -1;
      if (ev.key === "ArrowRight") nextIdx = (currentIdx + 1) % tabs.length;
      else if (ev.key === "ArrowLeft") nextIdx = (currentIdx - 1 + tabs.length) % tabs.length;
      else if (ev.key === "Home") nextIdx = 0;
      else if (ev.key === "End") nextIdx = tabs.length - 1;
      if (nextIdx >= 0) {
        ev.preventDefault();
        tabs[nextIdx].click();
        var updated = editorTabsEl.querySelectorAll('[role="tab"]')[nextIdx];
        if (updated) updated.focus();
      }
    });
  }
  codeBox.addEventListener("scroll", function () {
    gutter.scrollTop = codeBox.scrollTop;
    placeCurrentLine(currentLineNo);
  });

  if (phoneQuery.addEventListener) phoneQuery.addEventListener("change", onPhoneStatementChange);
  else if (phoneQuery.addListener) phoneQuery.addListener(onPhoneStatementChange);

  var patternPick = document.getElementById("patternPick");
  if (patternPick) {
    patternPick.addEventListener("change", function () {
      choosePattern(Number(patternPick.value));
    });
  }
  var langPick = document.getElementById("statementLangPick");
  if (langPick) {
    langPick.addEventListener("change", function () {
      setStatementLang(langPick.value);
    });
  }

  /* Keeps the address in step with the mode and the task, so a reload shows the same thing. */
  function noteAddress() {
    try {
      var query = "?mode=" + mode + (!rehearsal && pick.value ? "&task=" + encodeURIComponent(pick.value) : "");
      root.history.replaceState(null, "", root.location.pathname + query);
    } catch (error) { /* The address bar keeps the old state; the page itself has switched. */ }
  }

  /* Shows the parts of the page that belong to the current mode. */
  function paintMode() {
    document.body.setAttribute("data-mode", mode);
    var app = document.getElementById("app");
    if (app) app.classList.toggle("is-imagine", imagine);
    var trainerHost = document.getElementById("trainer");
    if (trainerHost) trainerHost.hidden = !imagine;
    var readingSection = document.getElementById("readingSection");
    if (readingSection) readingSection.hidden = mode !== "timed";
    var modePick = document.getElementById("modePick");
    if (modePick) {
      modePick.value = mode;
      modePick.disabled = !!pick.disabled;
    }
  }

  function showTask(task) {
    if (!task) {
      renderGutter({}, 0);
      return;
    }
    pick.value = task.id;
    renderStatement(task);
    ensureTaskTestState(task);
    renderWorkspaceTabs(task);
    showShell(task);
  }

  /* Switches the mode in place, like the language select. The task on screen is kept
     when the new mode also has it. */
  function setMode(next) {
    if (!MODE_TITLES[next] || next === mode || pick.disabled) {
      paintMode();
      return;
    }
    if (examDeadline !== null &&
        !window.confirm("全体タイマーが動いています。モードを切り替えると、タイマーは 200:00 に戻ります。切り替えますか？")) {
      paintMode();
      return;
    }
    var keepId = pick.value;
    examReset.click();
    showSubmitStatus("");
    sessionReport = null;
    records = [];
    renderSummary();
    mode = next;
    loadModeBasics();
    loadDraft();
    paintMode();
    paintPatterns();
    fillPicker();
    var task = tasks[0];
    var same = keepId ? taskById(keepId) : null;
    if (!rehearsal && same && same.id === keepId) task = same;
    if (task) {
      pick.value = task.id;
      pick.dispatchEvent(new Event("change"));
    }
    noteAddress();
  }

  var modePickEl = document.getElementById("modePick");
  if (modePickEl) {
    modePickEl.addEventListener("change", function () {
      setMode(modePickEl.value);
    });
  }

  paintMode();
  paintPatterns();
  fillPicker();
  showVars([]);
  var initialTask = tasks[0];
  if (!rehearsal) {
    try {
      var requestedId = new URLSearchParams(root.location.search).get("task");
      if (requestedId) {
        var matched = taskById(requestedId);
        if (matched && matched.id === requestedId) initialTask = matched;
      }
    } catch (error) { /* Keep default first task. */ }
  }
  showTask(initialTask);
})(typeof globalThis !== "undefined" ? globalThis : window);
