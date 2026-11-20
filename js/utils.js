/* =====================================================================
   js/utils.js  -  SMALL HELPERS
   ===================================================================== */

/* copyText("hello") -> true if copied. Tries the modern clipboard, then an older trick. */
function copyText(text) {
  return new Promise(function (resolve) {
    function oldWay() {
      const box = document.createElement('textarea');
      box.setAttribute('aria-hidden', 'true');
      box.style.position = 'fixed';
      box.style.left = '-999px';
      box.value = text;
      document.body.appendChild(box);
      box.select();
      let worked = false;
      try { worked = document.execCommand('copy'); } catch (error) { worked = false; }
      document.body.removeChild(box);
      resolve(worked);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { resolve(true); }, oldWay);
    } else {
      oldWay();
    }
  });
}

/* debounce(fn, ms) -> a version of fn that waits until calls stop for `ms` before running.
   Used so we save a draft after typing pauses, not on every keystroke. */
function debounce(fn, waitMs) {
  let timer = null;
  return function () {
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () { fn.apply(null, args); }, waitMs);
  };
}
