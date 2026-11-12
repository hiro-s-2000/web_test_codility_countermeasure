(function (root) {
  "use strict";

  function buildReport(tasks, selections, automatic, startedAt, codes, runs) {
    codes = codes || {};
    runs = runs || {};
    var autoById = Object.create(null);
    ((automatic && automatic.tasks) || []).forEach(function (item) { autoById[item.id] = item; });
    var items = [];
    tasks.forEach(function (task) {
      var chosen = selections[task.id] || {};
      var questions = task.reading || [];
      var hasReading = questions.some(function (q) { return Object.prototype.hasOwnProperty.call(chosen, q.id); });
      var auto = autoById[task.id];
      var hasCode = Object.prototype.hasOwnProperty.call(codes, task.id) && String(codes[task.id]).trim() !== "";
      var run = hasCode && runs[task.id] && runs[task.id].source === codes[task.id] ? runs[task.id] : null;
      if (!hasReading && !auto && !hasCode) return;
      var reading = hasReading ? questions.map(function (q) {
        var id = chosen[q.id];
        var selected = q.choices.find(function (choice) { return choice.id === id; });
        var answer = q.choices.find(function (choice) { return choice.id === q.answer; });
        var ok = !!selected && id === q.answer;
        return {
          id: q.id, prompt: q.prompt, selected: selected ? selected.text : null,
          answer: answer ? answer.text : "", ok: ok,
          explanation: selected ? (ok ? q.hit : q.why) : "未回答です。"
        };
      }) : [];
      var correct = reading.filter(function (row) { return row.ok; }).length;
      items.push({
        id: task.id,
        result: hasReading ? "読解 " + correct + " / " + reading.length + " 正解" : (hasCode ? (run ? (run.error ? "実行エラー" : "サンプル実行済み") : "サンプル未実行") : auto.result),
        reading: reading,
        tests: hasCode ? (run ? run.tests || [] : []) : (auto ? auto.tests || [] : []),
        submittedCode: hasCode ? codes[task.id] : null,
        manualRunError: run ? run.error : "",
        manualRun: !!run,
        elapsedMs: hasCode ? null : (auto ? auto.elapsedMs : null),
        automaticCode: auto ? auto.automaticCode : null,
        automaticResult: auto ? auto.result : null
      });
    });
    var now = new Date().toISOString();
    return {
      startedAt: startedAt || now,
      submittedAt: now,
      tasks: items,
      events: ((automatic && automatic.events) || []).concat([{ at: now, text: "回答を提出" }])
    };
  }

  var api = { buildReport: buildReport };
  root.PracticeReport = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
