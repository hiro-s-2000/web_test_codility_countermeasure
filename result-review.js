(function (root) {
  "use strict";

  var KEY = "timed-auto-report-v1";
  var tasks = (root.ReadingLab && root.ReadingLab.tasks) || [];
  var answers = root.LAB_ANSWERS || {};
  var taskRows = document.getElementById("taskRows");
  var emptyNote = document.getElementById("emptyNote");
  var ring = document.getElementById("ring");
  var insight = document.getElementById("insight");
  var timeline = document.getElementById("timeline");
  var summaryPane = document.getElementById("summaryPane");
  var timePane = document.getElementById("timePane");
  var tabSummary = document.getElementById("tabSummary");
  var tabTime = document.getElementById("tabTime");
  var screenWhen = document.getElementById("screenWhen");
  var selected = 0;
  var report = null;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function taskById(id) {
    var i;
    for (i = 0; i < tasks.length; i += 1) if (tasks[i].id === id) return tasks[i];
    return null;
  }

  function shown(value) {
    if (typeof value === "string") return JSON.stringify(value);
    if (Array.isArray(value)) return JSON.stringify(value);
    return String(value);
  }

  function spent(ms) {
    var seconds = Math.max(1, Math.round((ms || 0) / 1000));
    if (seconds < 60) return seconds + " 秒";
    return Math.round(seconds / 60) + " 分";
  }

  function when(iso) {
    if (!iso) return "";
    var date = new Date(iso);
    if (isNaN(date.getTime())) return "";
    function two(n) { return String(n).padStart(2, "0"); }
    return date.getFullYear() + "-" + two(date.getMonth() + 1) + "-" + two(date.getDate()) + " " + two(date.getHours()) + ":" + two(date.getMinutes());
  }

  function scoreOf(item) {
    var tests = item.tests || [];
    if (!tests.length) return null;
    var ok = tests.filter(function (row) { return row.ok; }).length;
    return Math.round(ok * 100 / tests.length);
  }

  function passedCount(item) {
    return (item.tests || []).filter(function (row) { return row.ok; }).length;
  }

  function totalScore(items) {
    var all = 0;
    var ok = 0;
    items.forEach(function (item) {
      var tests = item.tests || [];
      all += tests.length;
      ok += tests.filter(function (row) { return row.ok; }).length;
    });
    if (!all) return null;
    return Math.round(ok * 100 / all);
  }

  function warn(item) {
    return item.result !== "時間内に完了";
  }

  function drawRing(percent) {
    ring.textContent = "";
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 120 120");
    var radius = 52;
    var length = 2 * Math.PI * radius;
    var back = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    back.setAttribute("cx", "60");
    back.setAttribute("cy", "60");
    back.setAttribute("r", String(radius));
    back.setAttribute("fill", "none");
    back.setAttribute("stroke", "#e6e8ee");
    back.setAttribute("stroke-width", "8");
    var front = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    front.setAttribute("cx", "60");
    front.setAttribute("cy", "60");
    front.setAttribute("r", String(radius));
    front.setAttribute("fill", "none");
    front.setAttribute("stroke", "#243044");
    front.setAttribute("stroke-width", "8");
    front.setAttribute("stroke-linecap", "round");
    front.setAttribute("stroke-dasharray", String(length));
    var ratio = percent == null ? 0 : Math.max(0, Math.min(100, percent)) / 100;
    front.setAttribute("stroke-dashoffset", String(length * (1 - ratio)));
    front.setAttribute("transform", "rotate(-90 60 60)");
    svg.appendChild(back);
    svg.appendChild(front);
    ring.appendChild(svg);
    ring.appendChild(el("strong", null, percent == null ? "—" : percent + "%"));
  }

  function blurb(task) {
    var pack = task && task.text && task.text.ja;
    var sentence = pack && pack.sentences && pack.sentences[0];
    return sentence && sentence.text ? sentence.text : "";
  }

  function renderInsight(item) {
    insight.hidden = false;
    insight.textContent = "";
    var task = taskById(item.id);
    var title = task ? task.title : item.id;
    insight.appendChild(el("h2", null, title));
    var line = blurb(task);
    if (line) insight.appendChild(el("p", null, line));
    var meta = el("div", "meta");
    [["言語", "Kotlin"], ["目安時間", (task ? task.minutes : "—") + " 分"], ["結果", item.result || ""]].forEach(function (pair) {
      var block = el("div");
      block.appendChild(el("span", null, pair[0]));
      block.appendChild(el("b", "pill", pair[1]));
      meta.appendChild(block);
    });
    insight.appendChild(meta);
    var tests = item.tests || [];
    var stats = el("div", "stats");
    var correct = el("div");
    correct.appendChild(el("span", "note", "正しさ"));
    var count = el("div");
    count.appendChild(el("b", null, String(passedCount(item))));
    count.appendChild(document.createTextNode(" / " + tests.length + " サンプルが合格"));
    correct.appendChild(count);
    var point = el("div");
    point.appendChild(el("span", "note", "問題の得点"));
    var value = scoreOf(item);
    point.appendChild(el("b", null, value == null ? "—" : value + "%"));
    stats.appendChild(correct);
    stats.appendChild(point);
    insight.appendChild(stats);

    var group = el("div", "group");
    var open = true;
    var head = el("button", null, "");
    head.type = "button";
    function paintHead() {
      head.textContent = "";
      var allOk = tests.length > 0 && tests.every(function (row) { return row.ok; });
      head.appendChild(el("span", null, "サンプル"));
      head.appendChild(el("span", allOk ? "ok" : "bad", allOk ? "サンプルはすべて合格" : "サンプルを確認"));
    }
    var body = el("div");
    tests.forEach(function (row) {
      var block = el("div", "case");
      block.appendChild(el("p", row.ok ? "ok" : "bad", (row.ok ? "合格 " : "不一致 ") + row.name));
      var detail = "返り値は " + shown(row.actual) + " です。";
      if (row.because) detail += row.because;
      if (row.ok) detail += "問題文が求める " + shown(row.expected) + " と一致しています。";
      else detail += "問題文が求める値は " + shown(row.expected) + " です。";
      block.appendChild(el("p", null, detail));
      body.appendChild(block);
    });
    if (!tests.length) body.appendChild(el("p", "case", "サンプルは実行していません。"));
    head.addEventListener("click", function () {
      open = !open;
      body.hidden = !open;
    });
    paintHead();
    group.appendChild(head);
    group.appendChild(body);
    insight.appendChild(group);

    var switcher = el("div", "view-switch");
    var codeBtn = el("button", "is-on", "提出したコード");
    var textBtn = el("button", null, "問題文");
    codeBtn.type = "button";
    textBtn.type = "button";
    var view = el("div");
    function showCode() {
      codeBtn.className = "is-on";
      textBtn.className = "";
      view.textContent = "";
      var code = answers[item.id] && answers[item.id].code;
      view.appendChild(el("pre", null, code || "コードはありません。"));
    }
    function showText() {
      textBtn.className = "is-on";
      codeBtn.className = "";
      view.textContent = "";
      var pack = task && task.text && task.text.ja;
      (pack && pack.sentences || []).forEach(function (sentence) {
        view.appendChild(el("p", null, sentence.text));
      });
      if (task && task.signature) view.appendChild(el("pre", null, task.signature));
    }
    codeBtn.addEventListener("click", showCode);
    textBtn.addEventListener("click", showText);
    switcher.appendChild(codeBtn);
    switcher.appendChild(textBtn);
    insight.appendChild(switcher);
    insight.appendChild(view);
    showCode();
  }

  function renderTable(items) {
    taskRows.textContent = "";
    items.forEach(function (item, index) {
      var task = taskById(item.id);
      var tr = document.createElement("tr");
      tr.className = "task" + (warn(item) ? " is-warn" : "") + (index === selected ? " is-on" : "");
      var name = document.createElement("td");
      name.appendChild(el("strong", null, task ? task.title : item.id));
      name.appendChild(el("span", "lang", "Kotlin"));
      tr.appendChild(name);
      tr.appendChild(el("td", null, spent(item.elapsedMs)));
      var score = scoreOf(item);
      tr.appendChild(el("td", null, score == null ? "—" : score + "%"));
      tr.addEventListener("click", function () {
        selected = index;
        location.hash = "task-" + index;
        render();
      });
      taskRows.appendChild(tr);
    });
  }

  function renderTimeline(items) {
    timeline.textContent = "";
    (report.events || []).forEach(function (event) {
      timeline.appendChild(el("li", null, when(event.at) + "  " + event.text));
    });
    if (!(report.events || []).length) timeline.appendChild(el("li", null, "記録はありません。"));
    items.forEach(function () {});
  }

  function render() {
    var items = (report && report.tasks) || [];
    emptyNote.hidden = items.length > 0;
    screenWhen.textContent = report && report.startedAt ? when(report.startedAt) : "";
    var hash = /^#task-(\d+)$/.exec(location.hash || "");
    if (hash) selected = Math.max(0, Math.min(items.length - 1, Number(hash[1])));
    if (!items.length) selected = 0;
    drawRing(totalScore(items));
    renderTable(items);
    renderTimeline(items);
    if (items.length) renderInsight(items[selected]);
    else insight.hidden = true;
  }

  function showTab(which) {
    var summary = which === "summary";
    summaryPane.hidden = !summary;
    timePane.hidden = summary;
    tabSummary.classList.toggle("is-on", summary);
    tabTime.classList.toggle("is-on", !summary);
  }

  tabSummary.addEventListener("click", function () { showTab("summary"); });
  tabTime.addEventListener("click", function () { showTab("time"); });
  window.addEventListener("hashchange", render);

  try { report = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (error) { report = null; }
  render();
})(typeof globalThis !== "undefined" ? globalThis : window);
