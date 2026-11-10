/* Phone pull-down reloads the page. The portal locks the document, so the
   browser's own refresh gesture never starts. */
(function () {
  if (window.__pullRefreshInstalled) return;
  window.__pullRefreshInstalled = true;
  var touch = navigator.maxTouchPoints > 0 || "ontouchstart" in window;
  if (!touch) return;

  var THRESHOLD = 72;
  var style = document.createElement("style");
  style.textContent = [
    "#pullRefresh {",
    "  position: fixed;",
    "  z-index: 500;",
    "  left: 0;",
    "  right: 0;",
    "  top: 0;",
    "  display: none;",
    "  justify-content: center;",
    "  pointer-events: none;",
    "  padding-top: calc(8px + env(safe-area-inset-top));",
    "}",
    "#pullRefresh.is-on { display: flex; }",
    "#pullRefresh span {",
    "  background: #1f2328;",
    "  color: #fff;",
    "  border-radius: 999px;",
    "  padding: 10px 14px;",
    "  font: 600 14px/1.2 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;",
    "  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.28);",
    "}"
  ].join("\n");
  document.head.appendChild(style);

  var bar = document.createElement("div");
  bar.id = "pullRefresh";
  bar.setAttribute("aria-live", "polite");
  var label = document.createElement("span");
  bar.appendChild(label);
  document.body.appendChild(bar);

  var armed = false;
  var startX = 0;
  var startY = 0;
  var pull = 0;
  var reloading = false;

  function typingTarget(node) {
    return !!(node && node.closest && node.closest("textarea, input, select, [contenteditable='true']"));
  }

  function canScrollY(el) {
    if (!el || el === document.body || el === document.documentElement) return false;
    var oy = window.getComputedStyle(el).overflowY;
    if (oy !== "auto" && oy !== "scroll" && oy !== "overlay") return false;
    return el.scrollHeight > el.clientHeight + 1;
  }

  function atTop(target) {
    var el = target && target.nodeType === 1 ? target : target && target.parentElement;
    while (el && el !== document.body && el !== document.documentElement) {
      if (canScrollY(el) && el.scrollTop > 0) return false;
      el = el.parentElement;
    }
    var root = document.scrollingElement || document.documentElement;
    return !root || root.scrollTop <= 2;
  }

  function show(distance) {
    var ready = distance >= THRESHOLD;
    label.textContent = ready ? "離すと更新" : "下に引いて更新";
    bar.classList.add("is-on");
    bar.style.transform = "translateY(" + Math.min(distance, 96) + "px)";
  }

  function hide() {
    if (reloading) return;
    bar.classList.remove("is-on");
    bar.style.transform = "";
  }

  document.addEventListener("touchstart", function (event) {
    if (reloading || !event.touches || event.touches.length !== 1) return;
    if (typingTarget(event.target)) return;
    if (!atTop(event.target)) return;
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
    pull = 0;
    armed = true;
  }, { passive: true });

  document.addEventListener("touchmove", function (event) {
    if (!armed || !event.touches || event.touches.length !== 1) return;
    var dx = event.touches[0].clientX - startX;
    var dy = event.touches[0].clientY - startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
      armed = false;
      pull = 0;
      hide();
      return;
    }
    if (dy <= 0) {
      pull = 0;
      hide();
      return;
    }
    pull = dy;
    show(pull);
    if (pull > 12 && event.cancelable) event.preventDefault();
  }, { passive: false });

  function finish() {
    if (!armed) return;
    armed = false;
    if (pull >= THRESHOLD) {
      reloading = true;
      label.textContent = "更新しています";
      bar.classList.add("is-on");
      location.reload();
      return;
    }
    pull = 0;
    hide();
  }

  document.addEventListener("touchend", finish, { passive: true });
  document.addEventListener("touchcancel", function () {
    armed = false;
    pull = 0;
    hide();
  }, { passive: true });
})();
