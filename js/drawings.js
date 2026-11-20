/* =====================================================================
   frontend/js/drawings.js  -  ALL THE LITTLE DRAWINGS
   ---------------------------------------------------------------------
   Everything pretty on the site (flowers, bows, candles, cutlery, icons)
   is drawn with SVG: shapes described by text, so they are always sharp.
   Each function below returns a piece of SVG text.

   Reading SVG: <path d="..."> draws a shape, <circle> a circle,
   <ellipse> an oval, <rect> a rectangle. "fill" is the colour inside and
   "stroke" is the outline. url(#gBow) means "use the gradient called gBow"
   (the gradients are defined once at the top of index.html).
   ===================================================================== */


/* ---------- A tiny random number maker ----------
   We use it so the garland of leaves looks natural but is the SAME every time
   (the "seed" number picks which pattern you get). */
function makeRandom(seed) {
  let state = seed >>> 0;
  return function () {
    state |= 0;
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;     // always a number between 0 and 1
  };
}


/* ---------- Leaves and flowers ---------- */

/* One leaf. x,y = where it starts, length = how long, angle = which way it points. */
function drawLeaf(x, y, length, angle, fillColour) {
  const outline =
    'M0 0C' + (length * 0.3) + ' ' + (-length * 0.3) + ' ' + (length * 0.75) + ' ' + (-length * 0.3) + ' ' + length + ' 0' +
    'C' + (length * 0.75) + ' ' + (length * 0.3) + ' ' + (length * 0.3) + ' ' + (length * 0.3) + ' 0 0Z';

  return '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + angle.toFixed(0) + ')">' +
    '<path d="' + outline + '" fill="' + fillColour + '" stroke="#5f7f5b" stroke-width=".5" stroke-opacity=".5"/>' +
    '<path d="M1 0H' + (length * 0.85) + '" stroke="#5f7f5b" stroke-width=".5" stroke-opacity=".45"/>' +   // the centre vein
    '</g>';
}

/* One flower: a ring of petals around a small centre.
   centreX/centreY = position, radius = size, rotation = turn, petalCount = how many petals. */
function drawBloom(centreX, centreY, radius, rotation, petalCount, petalColour, centreColour) {
  petalCount = petalCount || 6;
  petalColour = petalColour || '#fffefb';        // white by default
  centreColour = centreColour || '#e9dca2';      // pale yellow by default

  let svg = '<g transform="translate(' + centreX.toFixed(1) + ' ' + centreY.toFixed(1) + ') rotate(' + rotation.toFixed(0) + ')">';
  for (let i = 0; i < petalCount; i++) {
    const turnForThisPetal = i * 360 / petalCount;     // spread the petals evenly around the circle
    svg += '<ellipse cx="0" cy="' + (-radius * 0.62).toFixed(1) + '" rx="' + (radius * 0.36).toFixed(1) + '" ry="' + (radius * 0.62).toFixed(1) +
           '" transform="rotate(' + turnForThisPetal + ')" fill="' + petalColour + '" stroke="#cfd7cb" stroke-width=".8"/>';
  }
  svg += '<circle r="' + (radius * 0.2).toFixed(1) + '" fill="' + centreColour + '" stroke="#c9bb7d" stroke-width=".6"/></g>';
  return svg;
}

/* The wavy eucalyptus garland with white flowers (shown at the top and bottom of screens). */
function drawGarland(width, height, seed) {
  const random = makeRandom(seed);
  const greens = ['#86a483', '#a7bfa2', '#5f7f5b', '#bfd3ba', '#759571'];
  const middleY = height / 2;

  // The wavy line the leaves grow along.
  function waveY(x) {
    return middleY + Math.sin(x / 38) * height * 0.16;
  }

  // Build the stem as a path made of many tiny straight pieces.
  let stemPath = 'M0 ' + waveY(0).toFixed(1);
  for (let x = 6; x <= width; x += 6) {
    stemPath += ' L' + x + ' ' + waveY(x).toFixed(1);
  }

  let svg = '<svg viewBox="0 0 ' + width + ' ' + height + '" aria-hidden="true" focusable="false">' +
            '<path d="' + stemPath + '" fill="none" stroke="#6d8b69" stroke-width="2" stroke-linecap="round"/>';

  // Leaves: one every 11 pixels, alternating above and below the stem.
  let leafNumber = 0;
  for (let x = 8; x < width; x += 11) {
    const above = (leafNumber % 2 === 0) ? -1 : 1;
    leafNumber++;
    const angle = above * (38 + random() * 26) + Math.cos(x / 38) * 10;
    const length = 13 + random() * 12;
    const colour = greens[Math.floor(random() * greens.length)];
    svg += drawLeaf(x, waveY(x), length, angle, colour);
  }

  // White flowers: every 44-74 pixels.
  for (let x = 28; x < width - 10; x += 44 + random() * 30) {
    svg += drawBloom(x, waveY(x) + (random() * 8 - 4), 8 + random() * 3, random() * 60);
  }
  return svg + '</svg>';
}


/* ---------- The pink bow ---------- */

/* The bow's shapes only (no <svg> wrapper) so we can reuse it, for example on the glass. */
function drawBowShapes() {
  return '<g stroke="#d4708c" stroke-width="1.3" stroke-linejoin="round">' +
    '<path d="M47 36L28 60L40 56L46 61L53 38Z" fill="url(#gBow)"/>' +                 // left ribbon tail
    '<path d="M53 36L72 60L60 56L54 61L47 38Z" fill="url(#gBow)"/>' +                 // right ribbon tail
    '<path d="M50 31C36 6 6 6 8 31C6 56 36 56 50 31Z" fill="url(#gBow)"/>' +           // left loop
    '<path d="M50 31C64 6 94 6 92 31C94 56 64 56 50 31Z" fill="url(#gBow)"/>' +        // right loop
    '<path d="M14 31C24 22 36 25 45 31M86 31C76 22 64 25 55 31" fill="none" stroke="#f9d6df" stroke-width="1.6"/>' +   // shine
    '<ellipse cx="50" cy="31" rx="7" ry="9" fill="#e07c99"/></g>';                    // the knot in the middle
}

/* The bow as a standalone picture of a chosen width. */
function drawBow(width) {
  return '<svg viewBox="0 0 100 62" width="' + width + '" aria-hidden="true" focusable="false">' + drawBowShapes() + '</svg>';
}


/* ---------- Table things ---------- */

/* A candle with a flickering flame and a silver holder. (CSS animates .flame and .glow.) */
function drawCandle() {
  return '<svg viewBox="0 0 44 150" aria-hidden="true" focusable="false">' +
    '<circle class="glow" cx="22" cy="20" r="26" fill="url(#gGlow)"/>' +                          // soft glow around the flame
    '<g class="flame"><path d="M22 5C28 14 29 20 22 28C15 20 16 14 22 5Z" fill="#ffc95e"/>' +      // flame
    '<path d="M22 14C25 18 25 21 22 25C19 21 19 18 22 14Z" fill="#fff3c4"/></g>' +                  // brighter middle of the flame
    '<path d="M22 28V34" stroke="#6b5a4c" stroke-width="1.4"/>' +                                   // wick
    '<rect x="16" y="33" width="12" height="82" rx="2" fill="url(#gCandle)" stroke="#e2d2a8" stroke-width=".8"/>' +   // wax
    '<path d="M24 34v10c0 2.5 3.5 2.5 3.5 0V34" fill="#fffaf0" stroke="#e8dab4" stroke-width=".5"/>' +                // a wax drip
    '<path d="M11 115h22l-3 7H14z" fill="url(#gSilver)" stroke="#9aa0a8" stroke-width=".6"/>' +                       // silver holder top
    '<rect x="20" y="122" width="4" height="14" fill="url(#gSilver)"/>' +                                             // holder stem
    '<ellipse cx="22" cy="140" rx="16" ry="4.5" fill="url(#gSilver)" stroke="#9aa0a8" stroke-width=".7"/></svg>';     // holder base
}

/* A champagne flute with bubbles and a pink bow tied on the stem. */
function drawGlass() {
  return '<svg viewBox="0 0 60 140" aria-hidden="true" focusable="false">' +
    '<path d="M17 6H43C43 40 39 58 30 68C21 58 17 40 17 6Z" fill="url(#gGlass)" stroke="#aeb6c1" stroke-width="1.4"/>' +      // the glass
    '<path d="M18.4 24H41.6C41 44 38 58 30 67C22 58 19 44 18.4 24Z" fill="#f6e2a2" opacity=".85"/>' +                        // the drink
    '<g fill="#fff" opacity=".9"><circle cx="26" cy="36" r="1.4"/><circle cx="33" cy="30" r="1.1"/><circle cx="30" cy="46" r="1.2"/><circle cx="35" cy="40" r="1"/></g>' +   // bubbles
    '<rect x="28.9" y="68" width="2.2" height="52" fill="url(#gSilver)"/>' +                                                 // stem
    '<ellipse cx="30" cy="123" rx="15" ry="4" fill="url(#gSilver)" stroke="#9aa0a8" stroke-width=".7"/>' +                   // base
    '<g transform="translate(19 82) scale(.22)">' + drawBowShapes() + '</g></svg>';                                          // small bow on the stem
}

/* A silver fork. */
function drawFork() {
  let tines = '';
  const tineXPositions = [4, 9, 14, 19];
  for (let i = 0; i < tineXPositions.length; i++) {
    tines += '<rect x="' + tineXPositions[i] + '" y="4" width="2.4" height="38" rx="1.2" fill="url(#gSilver)"/>';
  }
  return '<svg viewBox="0 0 26 140" aria-hidden="true" focusable="false">' + tines +
    '<path d="M4 38C4 52 9 54 12.5 54C16 54 21.4 52 21.4 38Z" fill="url(#gSilver)"/>' +
    '<path d="M11 52H14L15 134C15 138 10 138 10 134Z" fill="url(#gSilver)" stroke="#9aa0a8" stroke-width=".5"/></svg>';
}

/* A silver knife and spoon side by side. */
function drawKnifeAndSpoon() {
  return '<svg viewBox="0 0 60 140" aria-hidden="true" focusable="false">' +
    '<path d="M10 4C19 8 19 40 17 76H10Z" fill="url(#gSilver)" stroke="#9aa0a8" stroke-width=".5"/>' +                                    // knife blade
    '<rect x="10" y="74" width="7" height="62" rx="3.5" fill="url(#gSilver)" stroke="#9aa0a8" stroke-width=".5"/>' +                       // knife handle
    '<ellipse cx="42" cy="16" rx="9" ry="13" fill="url(#gSilver)" stroke="#9aa0a8" stroke-width=".6"/>' +                                  // spoon bowl
    '<path d="M40.5 27H44L45.5 134C45.5 138 38.5 138 38.5 134Z" fill="url(#gSilver)" stroke="#9aa0a8" stroke-width=".5"/></svg>';          // spoon handle
}


/* ---------- Decorations ---------- */

/* The painted flowers in the corner of the place card (replaced by your real photo if you add one). */
function drawPaintedFlowers() {
  return '<svg viewBox="0 0 110 80" aria-hidden="true" focusable="false">' +
    drawLeaf(12, 72, 36, -58, '#8fae8a') + drawLeaf(22, 76, 32, -18, '#a9c3a4') + drawLeaf(16, 62, 28, -88, '#78986f') +
    drawBloom(36, 42, 16, 10, 7) + drawBloom(62, 58, 11, 40, 6) +
    drawBloom(22, 26, 9, 25, 6, '#f6b9c8', '#fff3c8') + drawBloom(76, 34, 7, 10, 5, '#f6b9c8', '#fff3c8') +   // the pink flowers
    '</svg>';
}

/* The hand-drawn pink squiggle under the main heading. */
function drawUnderline() {
  return '<svg class="under" viewBox="0 0 180 10" aria-hidden="true" focusable="false">' +
    '<path d="M3 6C30 2 58 9 90 5S150 3 177 7" fill="none" stroke="#e58aa5" stroke-width="2.4" stroke-linecap="round"/></svg>';
}

/* The small flower divider between courses on the menu card. */
function drawDivider() {
  return '<svg class="sep" viewBox="0 0 90 14" aria-hidden="true" focusable="false">' +
    '<path d="M4 7H36M54 7H86" stroke="#c9ccd2" stroke-width="1.4" stroke-linecap="round"/>' + drawBloom(45, 7, 6, 0, 6) + '</svg>';
}

/* The little icons on the tabs. iconName must be one of the names below. */
function drawIcon(iconName) {
  const icons = {
    letter:   '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3.5 8l8.5 6 8.5-6"/>',
    dinner:   '<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="3.8"/>',
    flower:   '<circle cx="12" cy="12" r="2.2"/><ellipse cx="12" cy="6.2" rx="2.6" ry="3.4"/><ellipse cx="12" cy="17.8" rx="2.6" ry="3.4"/><ellipse cx="6.2" cy="12" rx="3.4" ry="2.6"/><ellipse cx="17.8" cy="12" rx="3.4" ry="2.6"/>',
    calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    heart:    '<path d="M12 20.5s-7.5-4.6-7.5-10.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7.5 2.1c0 5.8-7.5 10.4-7.5 10.4z"/>',
    gem:      '<path d="M7 4h10l4 5-9 11L3 9z"/><path d="M3 9h18M9 4l3 5 3-5"/>',
    send:     '<path d="M21 4L3 11l7 3 3 7z"/><path d="M10 14L21 4"/>'
  };
  return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    (icons[iconName] || '') + '</svg>';
}
