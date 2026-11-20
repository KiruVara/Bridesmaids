/* =====================================================================
   js/main.js  -  WHERE THE PAGE STARTS (the last file loaded)
   ===================================================================== */

async function startPage() {
  showScreen(h('p', { class: 'lede center', style: 'padding:60px 0' }, 'One moment...'));

  const result = await loadContent();            // questions + wording (from your Sheet, or built-in)
  pageContent = result.content;
  if (new URLSearchParams(window.location.search).has('check')) { sourceNote = result.source; }

  answers = loadDraft();                          // bring back anything she typed before
  renderPage();
}

startPage();
