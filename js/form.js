/* =====================================================================
   js/form.js  -  DRAWING THE QUESTIONS AND COLLECTING THE ANSWERS
   ---------------------------------------------------------------------
   Builds the whole page from the content (questions + settings), keeps the
   friend's answers in `answers`, saves a draft on her phone as she types,
   checks the required questions, and sends everything to your Sheet.
   ===================================================================== */

/* What the friend has answered so far. Keys are the question's column title,
   e.g. answers['Favourite flowers'] = ['Peonies', 'Tulips'].
   A "something else?" box is saved under the title + "__o". */
let answers = {};
let pageContent = null;          // { questions, settings }
let sourceNote = '';             // where the content came from (shown with ?check)

const DRAFT_KEY = 'bp:draft';

/* ---------- Remember a draft on this phone so a refresh does not lose anything ---------- */
function loadDraft() {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY)) || {}; } catch (error) { return {}; }
}
function saveDraftNow() {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(answers)); } catch (error) { /* blocked: fine */ }
}
const saveDraft = debounce(saveDraftNow, 400);
// Also save the moment the page is closed or reloaded, so the last few taps are never lost.
window.addEventListener('pagehide', saveDraftNow);

/* Called every time an answer changes. */
function answerChanged() {
  saveDraft();
}

/* ---------- Turning an answer into text ---------- */

/* answerText(question) -> "Rose; Sage green" (or '' if she did not answer). */
function answerText(question) {
  const value = answers[question.column];
  const parts = [];
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) { parts.push(value[i]); }
  } else if (value) {
    parts.push(String(value).trim());
  }
  const other = String(answers[question.column + '__o'] || '').trim();    // the "something else?" box
  if (other) { parts.push(other); }

  const filled = [];
  for (let i = 0; i < parts.length; i++) { if (parts[i]) { filled.push(parts[i]); } }
  return filled.join('; ');
}

/* ---------- Building one question ---------- */

function buildQuestion(question, index) {
  const parts = [];
  const labelId = 'label-' + index;

  parts.push(h('span', { class: 'lbl', id: labelId }, question.label, question.required ? h('span', { class: 'req' }, 'needed') : null));
  if (question.hint) { parts.push(h('div', { class: 'hint', html: question.hint })); }
  if (question.help) {
    parts.push(h('details', { class: 'help' }, h('summary', null, 'How do I know?'), h('p', null, question.help)));
  }

  if (question.type === 'text') { parts.push(buildTextInput(question, labelId)); }
  else if (question.type === 'paragraph') { parts.push(buildTextArea(question, labelId)); }
  else if (question.type === 'choice') { parts.push(buildChoice(question, labelId), buildOtherBox(question)); }
  else if (question.type === 'multi') { parts.push(buildMulti(question, labelId), buildOtherBox(question)); }
  else if (question.type === 'colours') { parts.push(buildColours(question, labelId), buildOtherBox(question)); }

  return h('div', { class: 'q', 'data-column': question.column }, parts);
}

/* One-line box. */
function buildTextInput(question, labelId) {
  return h('input', {
    type: 'text', maxlength: '200', placeholder: question.placeholder || '', 'aria-labelledby': labelId,
    value: answers[question.column] || '',
    oninput: function (event) { answers[question.column] = event.target.value; answerChanged(); }
  });
}

/* Bigger box. */
function buildTextArea(question, labelId) {
  const box = h('textarea', {
    maxlength: '1500', placeholder: question.placeholder || '', 'aria-labelledby': labelId,
    oninput: function (event) { answers[question.column] = event.target.value; answerChanged(); }
  });
  box.value = answers[question.column] || '';
  return box;
}

/* "Something else?" box under chips (only if the question has an Other box). */
function buildOtherBox(question) {
  if (!question.other) { return null; }
  const key = question.column + '__o';
  return h('input', {
    type: 'text', class: 'other', maxlength: '150', placeholder: question.other, 'aria-label': question.label + ': ' + question.other,
    value: answers[key] || '',
    oninput: function (event) { answers[key] = event.target.value; answerChanged(); }
  });
}

/* Pick ONE button. Tapping the chosen one again un-picks it. */
function buildChoice(question, labelId) {
  const group = h('div', { class: 'chips', role: 'radiogroup', 'aria-labelledby': labelId });
  function refresh() {
    for (let i = 0; i < group.children.length; i++) {
      group.children[i].setAttribute('aria-checked', String(answers[question.column] === group.children[i].dataset.value));
    }
  }
  for (let i = 0; i < question.options.length; i++) {
    const option = question.options[i];
    group.appendChild(h('button', {
      type: 'button', class: 'chip', role: 'radio', 'data-value': option,
      'aria-checked': String(answers[question.column] === option),
      onclick: function () {
        answers[question.column] = (answers[question.column] === option) ? '' : option;
        refresh(); answerChanged();
      }
    }, option));
  }
  return group;
}

/* Pick MANY buttons. */
function buildMulti(question, labelId) {
  if (!Array.isArray(answers[question.column])) { answers[question.column] = []; }
  const chosen = answers[question.column];
  const group = h('div', { class: 'chips', role: 'group', 'aria-labelledby': labelId });
  for (let i = 0; i < question.options.length; i++) {
    const option = question.options[i];
    group.appendChild(h('button', {
      type: 'button', class: 'chip', 'aria-pressed': String(chosen.indexOf(option) > -1),
      onclick: function (event) {
        const position = chosen.indexOf(option);
        if (position > -1) { chosen.splice(position, 1); } else { chosen.push(option); }
        event.currentTarget.setAttribute('aria-pressed', String(position === -1));
        answerChanged();
      }
    }, option));
  }
  return group;
}

/* Pick colour circles (up to `max`). */
function buildColours(question, labelId) {
  if (!Array.isArray(answers[question.column])) { answers[question.column] = []; }
  const chosen = answers[question.column];
  const group = h('div', { class: 'swatches', role: 'group', 'aria-labelledby': labelId });
  function refresh() {
    for (let i = 0; i < group.children.length; i++) {
      group.children[i].setAttribute('aria-pressed', String(chosen.indexOf(group.children[i].dataset.value) > -1));
    }
  }
  for (let i = 0; i < COLOURS.length; i++) {
    const colour = COLOURS[i];
    group.appendChild(h('button', {
      type: 'button', class: 'sw', 'data-value': colour.n, 'aria-pressed': String(chosen.indexOf(colour.n) > -1),
      onclick: function () {
        const position = chosen.indexOf(colour.n);
        if (position > -1) { chosen.splice(position, 1); }
        else {
          chosen.push(colour.n);
          while (question.max && chosen.length > question.max) { chosen.shift(); }   // drop the oldest pick if too many
        }
        refresh(); answerChanged();
      }
    }, h('i', { style: 'background:' + colour.h }), h('span', null, colour.n)));
  }
  return group;
}

/* ---------- The whole page ---------- */

function renderPage() {
  const settings = pageContent.settings;
  const questions = pageContent.questions;

  // ----- Group the questions into sheets by their Section (in the order they first appear) -----
  const sectionOrder = [];
  const questionsBySection = {};
  for (let i = 0; i < questions.length; i++) {
    const name = questions[i].section || '';
    if (!questionsBySection[name]) { questionsBySection[name] = []; sectionOrder.push(name); }
    questionsBySection[name].push(i);
  }

  const sheets = [];
  for (let s = 0; s < sectionOrder.length; s++) {
    const name = sectionOrder[s];
    const items = [];
    for (let k = 0; k < questionsBySection[name].length; k++) {
      const index = questionsBySection[name][k];
      items.push(buildQuestion(questions[index], index));
    }
    sheets.push(h('section', { class: 'sheet' }, name ? h('h2', null, name) : null, items));
  }

  // ----- Send button, error line, hidden robot trap -----
  const errorLine = h('div', { class: 'error-summary', role: 'alert', hidden: true });
  const trap = h('input', { type: 'text', class: 'hp-field', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true', id: 'website' });
  const sendButton = h('button', { type: 'button', class: 'btn', id: 'sendButton' }, settings.submitButton || 'Send');
  sendButton.addEventListener('click', function () { handleSend(sendButton, errorLine, trap); });

  showScreen(
    h('div', { class: 'garland', html: drawGarland(560, 56, 7) }),
    h('div', { class: 'hero' },
      h('div', { class: 'candle', html: drawCandle() }),
      h('div', { class: 'placecard' },
        h('div', { class: 'painted', html: drawPaintedFlowers() }),
        h('div', { class: 'nm' }, settings.pageTitle || 'A little something'),
        settings.hostName ? h('div', { class: 'sub' }, 'from ' + settings.hostName) : null),
      h('div', { class: 'glass', html: drawGlass() })),
    settings.intro ? h('section', { class: 'sheet' }, h('p', { class: 'intro-text' }, settings.intro)) : null,
    sheets,
    errorLine, trap,
    h('div', { class: 'row' }, sendButton),
    sourceNote ? h('div', { class: 'source-note' }, 'Questions come from: ' + sourceNote) : null,
    h('div', { class: 'garland', html: drawGarland(560, 56, 21) }));
  window.scrollTo(0, 0);
}

/* ---------- Checking and sending ---------- */

/* Returns the list of required questions that have no answer. */
function findMissing() {
  const missing = [];
  for (let i = 0; i < pageContent.questions.length; i++) {
    if (pageContent.questions[i].required && answerText(pageContent.questions[i]) === '') { missing.push(pageContent.questions[i]); }
  }
  return missing;
}

/* Builds what we send: { answers: { "Column title": "text", ... }, hp: "" } */
function buildPayload(trap) {
  const payload = { answers: {}, hp: trap.value };
  for (let i = 0; i < pageContent.questions.length; i++) {
    const question = pageContent.questions[i];
    payload.answers[question.column] = answerText(question);
  }
  return payload;
}

/* A readable copy of the answers (used when the Sheet cannot be reached). */
function readableCopy() {
  const lines = [];
  for (let i = 0; i < pageContent.questions.length; i++) {
    lines.push(pageContent.questions[i].column + ': ' + (answerText(pageContent.questions[i]) || '(skipped)'));
  }
  return lines.join('\n');
}

async function handleSend(sendButton, errorLine, trap) {
  // 1. Required questions.
  const missing = findMissing();
  const boxes = document.querySelectorAll('.q');
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].classList.remove('invalid');
    const oldError = boxes[i].querySelector('.err');
    if (oldError) { oldError.remove(); }
  }
  if (missing.length > 0) {
    let firstBox = null;
    for (let i = 0; i < boxes.length; i++) {
      for (let j = 0; j < missing.length; j++) {
        if (boxes[i].dataset.column === missing[j].column) {
          boxes[i].classList.add('invalid');
          boxes[i].appendChild(h('div', { class: 'err' }, 'Please answer this one.'));
          if (!firstBox) { firstBox = boxes[i]; }
        }
      }
    }
    errorLine.hidden = false;
    errorLine.textContent = 'Almost there: ' + missing.length + (missing.length === 1 ? ' question needs' : ' questions need') + ' an answer.';
    if (firstBox) { firstBox.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' }); }
    return;
  }
  errorLine.hidden = true;

  // 2. Not linked to a Sheet yet (you are previewing): copy the answers instead.
  if (!SCRIPT_URL) {
    const worked = await copyText(readableCopy());
    toast(worked ? 'Preview only: not linked to your Sheet yet. Answers copied.' : 'Preview only: not linked to your Sheet yet.');
    return;
  }

  // 3. Send to the Google script. "no-cors" is how a web page may post to Google's script;
  //    it means we cannot read the reply, only learn that the request was sent.
  sendButton.disabled = true;
  const originalLabel = sendButton.textContent;
  sendButton.textContent = 'Sending...';
  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(buildPayload(trap))
    });
    showThanks();
  } catch (error) {
    sendButton.disabled = false;
    sendButton.textContent = originalLabel;
    errorLine.hidden = false;
    errorLine.textContent = 'That did not go through. Check your internet and try again, or copy your answers and text them to me.';
    errorLine.appendChild(h('div', { style: 'margin-top:8px' }, h('button', { type: 'button', class: 'btn ghost small', onclick: function () {
      copyText(readableCopy()).then(function (worked) { toast(worked ? 'Copied' : 'Could not copy'); });
    } }, 'Copy my answers')));
  }
}

/* The thank-you screen. She can go back and send changed answers (they arrive as a new row). */
function showThanks() {
  const settings = pageContent.settings;
  showScreen(
    h('div', { class: 'garland', html: drawGarland(560, 56, 7) }),
    h('section', { class: 'sheet', role: 'status' },
      h('h2', { class: 'center' }, settings.thanksTitle || 'Thank you!'),
      h('p', { class: 'intro-text' }, settings.thanksMessage || ''),
      h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn ghost', onclick: renderPage }, 'Change my answers')),
      h('p', { class: 'fine center' }, 'If you change something, sending again adds a new line for me, and I will use the latest one.')),
    h('div', { class: 'garland', html: drawGarland(560, 56, 21) }));
  launchPetals(34);
  window.scrollTo(0, 0);
}
