/* =====================================================================
   frontend/js/dom.js  -  TOOLS FOR BUILDING THE PAGE
   ---------------------------------------------------------------------
   "DOM" means the page's elements (headings, buttons, boxes...).
   This file has the small helpers every screen uses to create and
   show things on the page.
   ===================================================================== */

/* The empty pink runner in index.html where every screen is drawn. */
const rootElement = document.getElementById('app');

/* Did the person ask their phone to reduce animations? If so we skip the fancy ones. */
const prefersReducedMotion = Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);


/* h(tagName, attributes, ...children) -> a new page element.
   "h" is short for "HTML". It saves us from writing long document.createElement code.

   EXAMPLE
     h('button', { class: 'btn', onclick: sayHi }, 'Click me')
   makes:  <button class="btn">Click me</button>  that calls sayHi() when clicked.

   attributes can be:
     class: 'name'        -> the CSS class
     html: '<b>hi</b>'    -> raw HTML inside (we only use this for our own drawings)
     onclick: function    -> any "on..." name adds a click/typing/etc. listener
     anything else        -> becomes a normal HTML attribute (type, id, placeholder...)
   children can be text, other elements, or lists of them. null and false are skipped,
   which lets us write things like  (showIt ? h(...) : null)  */
function h(tagName, attributes, ...children) {
  const element = document.createElement(tagName);

  // 1. Apply the attributes.
  if (attributes) {
    for (const name in attributes) {
      const value = attributes[name];
      if (value === null || value === undefined || value === false) {
        continue;                                   // skip empty ones
      }
      if (name === 'class') {
        element.className = value;
      } else if (name === 'html') {
        element.innerHTML = value;
      } else if (name.slice(0, 2) === 'on') {
        element.addEventListener(name.slice(2), value);   // "onclick" -> listen for "click"
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    }
  }

  // 2. Add the children. flat(Infinity) opens up lists inside lists.
  const flatChildren = children.flat(Infinity);
  for (let i = 0; i < flatChildren.length; i++) {
    const child = flatChildren[i];
    if (child === null || child === undefined || child === false) {
      continue;
    }
    if (child.nodeType) {
      element.appendChild(child);                    // it is already an element
    } else {
      element.appendChild(document.createTextNode(String(child)));   // plain text (safe: cannot run code)
    }
  }
  return element;
}

/* showScreen(...elements) -> clears the runner and shows these elements instead. */
function showScreen(...elements) {
  // Open up lists inside lists and skip empty items (null/false), so a missing piece never shows up as the word "null".
  const pieces = elements.flat(Infinity).filter(function (item) { return item !== null && item !== undefined && item !== false; });
  rootElement.replaceChildren(...pieces);
}

/* toast("Copied!") -> shows a small dark message at the bottom for 2.6 seconds. */
function toast(message) {
  const popup = h('div', { class: 'toast', role: 'status' }, message);
  document.body.appendChild(popup);
  setTimeout(function () { popup.remove(); }, 2600);
}

/* launchPetals(26) -> a shower of falling petals (used when the envelope opens). */
function launchPetals(howMany) {
  if (prefersReducedMotion) {
    return;
  }
  const colours = ['#f2a9bc', '#fbd3dc', '#ffffff', '#a7bfa2', '#86a483'];
  const container = h('div', { class: 'petals', 'aria-hidden': 'true' });

  for (let i = 0; i < howMany; i++) {
    const petal = h('span', { class: 'petal' });
    petal.style.left = (Math.random() * 100) + '%';                       // random spot across the screen
    petal.style.background = colours[i % colours.length];
    petal.style.animationDuration = (3.2 + Math.random() * 3) + 's';      // random fall speed
    petal.style.animationDelay = (Math.random() * 1.2) + 's';             // random start time
    petal.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px');   // random sideways drift
    container.appendChild(petal);
  }
  document.body.appendChild(container);
  setTimeout(function () { container.remove(); }, 8000);                  // clean up afterwards
}
