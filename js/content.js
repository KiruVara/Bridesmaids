/* =====================================================================
   js/content.js  -  WHERE THE QUESTIONS AND WORDING COME FROM
   ---------------------------------------------------------------------
   1. Ask the Google script for the Questions and Settings tabs of your Sheet.
   2. If that does not work (no script linked yet, no internet, a mistake in
      the Sheet), use the built-in copy in content/default-content.js so the
      page is never empty.
   ===================================================================== */

/* The colour circles used by "colours" questions. n = name, h = colour code. */
const COLOURS = [
  { n: 'Blush pink', h: '#f4c6d0' }, { n: 'Rose', h: '#d9728f' }, { n: 'Burgundy', h: '#7d2a44' },
  { n: 'Coral', h: '#f08a76' }, { n: 'Peach', h: '#f7c9a6' }, { n: 'Butter yellow', h: '#f5e3a0' },
  { n: 'Sage green', h: '#9db79a' }, { n: 'Forest green', h: '#3f5b3c' }, { n: 'Sky blue', h: '#a9cde6' },
  { n: 'Navy', h: '#27406b' }, { n: 'Lavender', h: '#c9b6e4' }, {n: 'Eggplant', h: '#472c4c'},{ n: 'Cream', h: '#f6ecd9' },
  { n: 'Chocolate', h: '#5a3a2a' }, { n: 'Black', h: '#222222' }
];

/* Fills in anything missing so the rest of the code can rely on every field being there. */
function tidyContent(rawQuestions, rawSettings) {
  const questions = [];
  for (let i = 0; i < rawQuestions.length; i++) {
    const q = rawQuestions[i];
    if (q.show === false || !q.label) { continue; }
    questions.push({
      section: q.section || '',
      column: q.column || q.label,
      label: q.label,
      type: ['text', 'paragraph', 'choice', 'multi', 'colours'].indexOf(q.type) > -1 ? q.type : 'text',
      options: q.options || [],
      required: Boolean(q.required),
      hint: q.hint || '',
      help: q.help || '',
      placeholder: q.placeholder || '',
      other: q.other || '',
      max: q.max || 0
    });
  }
  return { questions: questions, settings: Object.assign({}, DEFAULT_CONTENT.settings, rawSettings || {}) };
}

/* loadContent() -> { content, source } where source says where it came from. */
async function loadContent() {
  const builtIn = function (why) {
    return { content: tidyContent(DEFAULT_CONTENT.questions, DEFAULT_CONTENT.settings), source: 'Built-in questions (' + why + ')' };
  };
  if (!SCRIPT_URL) { return builtIn('no Google script linked yet'); }

  // Give up after 8 seconds (AbortController is the "stop" button).
  const stopper = new AbortController();
  const timer = setTimeout(function () { stopper.abort(); }, 8000);
  try {
    const response = await fetch(SCRIPT_URL, { signal: stopper.signal });
    const data = await response.json();
    clearTimeout(timer);
    if (!data || !data.ok || !Array.isArray(data.questions) || data.questions.length === 0) { return builtIn('the Sheet had no questions'); }
    return { content: tidyContent(data.questions, data.settings), source: 'Your Google Sheet' };
  } catch (error) {
    clearTimeout(timer);
    return builtIn('could not reach your Google Sheet');
  }
}
