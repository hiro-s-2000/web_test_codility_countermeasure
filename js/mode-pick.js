/* The practice-mode select on pages outside the practice page: choosing a mode opens it. */
(function () {
  var pick = document.getElementById("modePick");
  if (!pick) return;
  pick.addEventListener("change", function () {
    if (pick.value) window.location.href = "./timed-auto.html?mode=" + encodeURIComponent(pick.value);
  });
  // Coming back with the browser's back button shows the unselected label again.
  window.addEventListener("pageshow", function () { pick.value = ""; });
})();
