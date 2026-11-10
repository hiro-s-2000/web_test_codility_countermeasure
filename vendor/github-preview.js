/* Renders Markdown the way GitHub's preview does: GFM, KaTeX math, Mermaid diagrams. */
(function (global) {
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function basicMarkdown(mdText) {
    const lines = String(mdText).replace(/\r\n/g, "\n").split("\n");
    const html = [];
    let inFence = false;
    let fenceLang = "";
    let fence = [];
    let para = [];

    function flushPara() {
      if (!para.length) return;
      html.push("<p>" + para.join("<br>") + "</p>");
      para = [];
    }

    lines.forEach((line) => {
      const fenceMatch = line.match(/^\s{0,3}```(.*)$/);
      if (fenceMatch) {
        if (!inFence) {
          flushPara();
          inFence = true;
          fenceLang = (fenceMatch[1] || "").trim().split(/\s/)[0];
          fence = [];
        } else if (!fenceMatch[1].trim()) {
          const cls = fenceLang ? " class=\"language-" + escapeHtml(fenceLang) + "\"" : "";
          html.push("<pre><code" + cls + ">" + escapeHtml(fence.join("\n")) + "</code></pre>");
          inFence = false;
          fenceLang = "";
          fence = [];
        } else {
          fence.push(line);
        }
        return;
      }
      if (inFence) {
        fence.push(line);
        return;
      }
      const heading = line.match(/^(#{1,6})\s+(.*)$/);
      if (heading) {
        flushPara();
        const level = heading[1].length;
        html.push("<h" + level + ">" + escapeHtml(heading[2]) + "</h" + level + ">");
        return;
      }
      if (!line.trim()) {
        flushPara();
        return;
      }
      para.push(escapeHtml(line));
    });
    flushPara();
    if (inFence) {
      html.push("<pre><code>" + escapeHtml(fence.join("\n")) + "</code></pre>");
    }
    return html.join("\n");
  }

  function renderMarkdown(mdText) {
    if (global.marked && typeof global.marked.parse === "function") {
      if (typeof global.marked.setOptions === "function") {
        global.marked.setOptions({ gfm: true, breaks: false });
      }
      return global.marked.parse(String(mdText));
    }
    return basicMarkdown(mdText);
  }

  function liftMermaid(root) {
    root.querySelectorAll("pre code").forEach((codeEl) => {
      const lang = (codeEl.className || "").toLowerCase();
      if (!lang.includes("mermaid")) return;
      const div = document.createElement("div");
      div.className = "mermaid";
      div.textContent = codeEl.textContent;
      const pre = codeEl.parentElement;
      if (pre && pre.tagName === "PRE") pre.replaceWith(div);
    });
  }

  function decorate(root) {
    if (global.renderMathInElement) {
      try {
        global.renderMathInElement(root, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false }
          ],
          ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
          throwOnError: false
        });
      } catch (_) {}
    }
    if (global.mermaid && typeof global.mermaid.run === "function") {
      const theme = document.documentElement.getAttribute("data-theme") === "light" ? "default" : "dark";
      global.mermaid.initialize({ startOnLoad: false, theme: theme, securityLevel: "strict" });
      const nodes = root.querySelectorAll(".mermaid");
      if (nodes.length) {
        global.mermaid.run({ nodes: nodes }).catch(function () {});
      }
    }
  }

  global.GithubPreview = {
    renderMarkdown: renderMarkdown,
    liftMermaid: liftMermaid,
    decorate: decorate
  };
})(window);
