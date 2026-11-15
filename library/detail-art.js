/* library/detail-art.js — higher-detail graphite studies for core objects.
 * Loaded after the base library so these drawings replace selected definitions
 * without changing the registry size, prompt vocabulary, or offline architecture.
 */
(function (S) {
  'use strict';

  const BASE = { alpha: 0.78, width: 1.15, passes: 2, wobble: 0.045 };
  const LIGHT = { alpha: 0.38, width: 0.72, passes: 1, wobble: 0.025, overshoot: false };
  const SHADE = { alpha: 0.24, width: 0.62, passes: 1, wobble: 0.035, overshoot: false };
  let activeColor = null;
  let activeOpacity = 1;

  function ink(style) {
    const result = Object.assign({}, style || {});
    result.alpha = (Number.isFinite(result.alpha) ? result.alpha : 0.66) * activeOpacity;
    if (activeColor) result.color = activeColor;
    return result;
  }

  // The artists' coordinate grid is top-left based (0..100), with the baseline
  // at y=100. The registry's transform then scales and positions the artwork.
  function point(x, y, centerX) { return [x - (centerX == null ? 50 : centerX), y - 100]; }
  function line(e, x1, y1, x2, y2, style) {
    const a = point(x1, y1, style && style.centerX);
    const b = point(x2, y2, style && style.centerX);
    e.sketchLine(a[0], a[1], b[0], b[1], ink(style && style.centerX != null ? Object.assign({}, BASE, style, { centerX: undefined }) : Object.assign({}, BASE, style || {})));
  }
  function curve(e, coords, style, centerX) {
    const pts = [];
    for (let i = 0; i < coords.length - 1; i += 2) pts.push(point(coords[i], coords[i + 1], centerX));
    e.sketchCurve(pts, ink(Object.assign({}, BASE, style || {})));
  }
  function ellipse(e, cx, cy, rx, ry, hatch, style, centerX) {
    const c = point(cx, cy, centerX);
    e.sketchEllipse(c[0], c[1], rx, ry, !!hatch, ink(Object.assign({}, BASE, style || {})));
  }
  function circle(e, cx, cy, r, hatch, style, centerX) { ellipse(e, cx, cy, r, r, hatch, style, centerX); }
  function polygon(e, coords, closed, hatch, style, centerX) {
    const pts = [];
    for (let i = 0; i < coords.length - 1; i += 2) pts.push(point(coords[i], coords[i + 1], centerX));
    e.sketchPolygon(pts, closed !== false, !!hatch, ink(Object.assign({}, BASE, style || {})));
  }
  function arc(e, cx, cy, r, a0, a1, style, centerX) {
    const c = point(cx, cy, centerX);
    e.sketchArc(c[0], c[1], r, a0, a1, ink(Object.assign({}, BASE, style || {})));
  }
  function shade(e, cx, cy, rx, ry, count) {
    const c = point(cx, cy);
    e.scribble(c[0], c[1], rx, ry, Math.max(1, Math.round(count * activeOpacity)));
  }
  function flecks(e, cx, cy, rx, ry, count) {
    const c = point(cx, cy);
    e.stipple(c[0], c[1], rx, ry, Math.max(1, Math.round(count * activeOpacity)));
  }
  function fur(e, x1, y1, x2, y2, count, spread) {
    const random = e.random;
    for (let i = 0; i < count; i += 1) {
      const t = (i + random() * 0.65) / count;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;
      const dx = (random() - 0.5) * (spread || 3);
      const dy = 1.2 + random() * 3.8;
      line(e, x, y, x + dx, y + dy, LIGHT);
    }
  }
  function add(id, aliases, category, aspect, draw, extra) {
    const wrappedDraw = function (engine, x, y, scale, seed, options) {
      const previousColor = activeColor;
      const previousOpacity = activeOpacity;
      const previousEngineColor = engine.currentColor;
      activeColor = options && options.color ? options.color : null;
      activeOpacity = options && Number.isFinite(options.opacity) ? Math.max(0, Math.min(1, options.opacity)) : 1;
      engine.setColor(activeColor);
      try {
        draw(engine, x, y, scale, seed, options || {});
      } finally {
        activeColor = previousColor;
        activeOpacity = previousOpacity;
        engine.setColor(previousEngineColor);
      }
    };
    S.register(Object.assign({ id, aliases, category, aspect, layer: 'near', anchor: 'ground', draw: wrappedDraw }, extra || {}));
  }

  // ANIMALS -----------------------------------------------------------------
  function cat(e) {
    // Haunch, shoulder, chest and head sit on a shared natural skeleton.
    ellipse(e, 50, 67, 27, 24, false);
    curve(e, [28, 64, 26, 48, 38, 42, 52, 43, 69, 49, 76, 66, 69, 83], BASE);
    ellipse(e, 48, 28, 20, 19, false);
    polygon(e, [32, 18, 34, 1, 47, 14, 51, 13, 66, 1, 65, 22], true, false);
    curve(e, [37, 18, 39, 8, 45, 15], LIGHT);
    curve(e, [56, 15, 62, 8, 63, 19], LIGHT);
    // Front chest and four joined limbs.
    curve(e, [57, 43, 62, 52, 59, 67, 60, 82, 66, 94], BASE);
    curve(e, [44, 44, 40, 55, 38, 69, 36, 84, 39, 95], BASE);
    curve(e, [35, 86, 30, 92, 32, 96, 44, 96], BASE);
    curve(e, [59, 84, 57, 91, 62, 96, 72, 96], BASE);
    // A curling tail is built as a tapered S-curve, not a straight tube.
    curve(e, [69, 72, 84, 82, 92, 76, 92, 63, 86, 58, 81, 63], { alpha: 0.76, width: 2.0, passes: 2, wobble: 0.06 });
    curve(e, [71, 75, 83, 83, 89, 76], LIGHT);
    // Face planes, eyes, nose, muzzle and whisker pads.
    ellipse(e, 41, 29, 4.8, 3.6, false, LIGHT);
    ellipse(e, 56, 29, 4.8, 3.6, false, LIGHT);
    circle(e, 42, 29, 1.9, false, { alpha: 0.9, width: 1.0, passes: 1 });
    circle(e, 57, 29, 1.9, false, { alpha: 0.9, width: 1.0, passes: 1 });
    polygon(e, [47, 37, 51, 35, 55, 37, 51, 40], true, false, LIGHT);
    curve(e, [51, 40, 49, 44, 45, 44], LIGHT);
    curve(e, [51, 40, 53, 44, 58, 43], LIGHT);
    ellipse(e, 43, 39, 5, 3, false, LIGHT);
    ellipse(e, 59, 39, 5, 3, false, LIGHT);
    for (let i = 0; i < 3; i += 1) {
      line(e, 35, 39 + i * 3, 19 - i, 36 + i * 5, LIGHT);
      line(e, 64, 39 + i * 3, 80 + i, 36 + i * 5, LIGHT);
    }
    // Fur direction follows the cheeks, shoulders and flank.
    fur(e, 27, 52, 42, 62, 14, 4);
    fur(e, 57, 53, 72, 63, 14, 4);
    fur(e, 35, 72, 64, 78, 19, 5);
    for (let i = 0; i < 4; i += 1) {
      curve(e, [34 + i * 3, 47, 31 + i * 3, 52, 33 + i * 3, 56], LIGHT);
    }
    shade(e, 54, 78, 17, 5, 26);
  }
  add('cat', ['kitty', 'kitten', 'feline'], 'animals', 0.75, cat);

  function dog(e) {
    ellipse(e, 43, 61, 29, 18, false);
    curve(e, [20, 59, 19, 49, 31, 44, 50, 43, 63, 49, 68, 64, 60, 78], BASE);
    // Haunches and legs with knees, hocks and paws.
    ellipse(e, 26, 66, 12, 15, false, LIGHT);
    curve(e, [29, 73, 27, 82, 28, 92, 37, 95], BASE);
    curve(e, [44, 73, 42, 81, 43, 89, 48, 95], BASE);
    curve(e, [58, 68, 60, 78, 62, 87, 70, 95], BASE);
    curve(e, [69, 64, 75, 76, 75, 87, 82, 94], BASE);
    line(e, 27, 95, 39, 95, LIGHT); line(e, 42, 95, 51, 95, LIGHT);
    line(e, 66, 95, 77, 95, LIGHT); line(e, 79, 94, 88, 94, LIGHT);
    // Neck and expressive head turned to the right.
    curve(e, [58, 52, 66, 40, 73, 27, 88, 25, 96, 34, 94, 48, 84, 58], BASE);
    ellipse(e, 83, 35, 15, 13, false);
    ellipse(e, 94, 45, 9, 7, false);
    polygon(e, [73, 29, 68, 9, 81, 18, 88, 29], true, false);
    polygon(e, [86, 27, 93, 12, 97, 29], true, false);
    ellipse(e, 77, 34, 3.6, 3.2, false, LIGHT);
    circle(e, 78, 34, 1.5, false, { alpha: 0.9, width: 0.9, passes: 1 });
    circle(e, 99, 43, 2.6, false, BASE);
    curve(e, [88, 50, 91, 55, 98, 53], LIGHT);
    // Collar, tag, tail and coat texture.
    curve(e, [62, 49, 66, 56, 73, 60], { alpha: 0.8, width: 1.5, passes: 2 });
    curve(e, [65, 53, 72, 57, 78, 56], LIGHT);
    polygon(e, [69, 58, 73, 58, 75, 65, 71, 68], true, false, LIGHT);
    curve(e, [19, 55, 8, 47, 5, 39, 9, 33], { alpha: 0.78, width: 1.8, passes: 2 });
    fur(e, 22, 50, 58, 57, 20, 4);
    fur(e, 31, 69, 57, 73, 15, 4);
    shade(e, 47, 68, 22, 6, 24);
    for (let i = 0; i < 4; i += 1) line(e, 82 + i * 2, 49, 84 + i * 2, 52, LIGHT);
  }
  add('dog', ['puppy', 'canine'], 'animals', 0.95, dog);

  function elephant(e) {
    ellipse(e, 43, 59, 32, 27, false);
    ellipse(e, 67, 39, 20, 22, false);
    // Large ear with inner folds and soft graphite shadow.
    ellipse(e, 57, 43, 18, 25, false);
    curve(e, [48, 30, 42, 42, 45, 56, 56, 63], LIGHT);
    curve(e, [61, 25, 70, 34, 68, 51, 60, 59], LIGHT);
    shade(e, 57, 47, 9, 16, 38);
    // Trunk tapers and curls with segmented wrinkles.
    curve(e, [82, 46, 94, 52, 96, 66, 90, 79, 82, 84, 78, 78], { alpha: 0.84, width: 2.25, passes: 2, wobble: 0.055 });
    curve(e, [84, 48, 91, 57, 91, 68, 85, 77], LIGHT);
    for (let i = 0; i < 5; i += 1) curve(e, [88 - i * 1.1, 57 + i * 4, 93 - i * 0.8, 59 + i * 4, 94 - i, 62 + i * 4], LIGHT);
    // Tusks and expressive eye.
    curve(e, [77, 54, 84, 62, 86, 70], { alpha: 0.7, width: 1.3, passes: 2 });
    curve(e, [74, 53, 79, 63, 80, 70], LIGHT);
    ellipse(e, 76, 34, 3.3, 3.8, false, LIGHT);
    circle(e, 77, 34, 1.4, false, BASE);
    // Four weight-bearing legs with toenails.
    curve(e, [22, 75, 20, 83, 21, 96, 32, 98], BASE);
    curve(e, [39, 80, 38, 87, 39, 97, 48, 98], BASE);
    curve(e, [59, 78, 59, 87, 60, 97, 69, 98], BASE);
    curve(e, [71, 72, 74, 83, 75, 94, 83, 96], BASE);
    for (let x = 24; x <= 30; x += 3) arc(e, x, 96, 2.3, Math.PI, Math.PI * 2, LIGHT);
    for (let x = 61; x <= 67; x += 3) arc(e, x, 96, 2.3, Math.PI, Math.PI * 2, LIGHT);
    // Skin folds, sparse wrinkles and broad body shading.
    curve(e, [17, 52, 24, 45, 32, 47], LIGHT);
    curve(e, [25, 69, 32, 73, 38, 72], LIGHT);
    curve(e, [46, 77, 53, 80, 60, 76], LIGHT);
    for (let i = 0; i < 7; i += 1) line(e, 30 + i * 3, 82 + (i % 2) * 2, 34 + i * 3, 87 + (i % 2) * 2, LIGHT);
    shade(e, 45, 77, 25, 8, 44);
    flecks(e, 42, 55, 25, 18, 26);
  }
  add('elephant', ['elephants'], 'animals', 0.9, elephant);

  function horse(e) {
    // Barrel and croup, then the sloping shoulder and long neck.
    ellipse(e, 45, 56, 29, 17, false);
    curve(e, [21, 56, 22, 45, 34, 39, 51, 39, 68, 47, 72, 61, 62, 71], BASE);
    polygon(e, [61, 51, 69, 22, 82, 13, 92, 20, 85, 46, 72, 62], true, false);
    ellipse(e, 86, 23, 10, 9, false);
    curve(e, [89, 27, 99, 31, 98, 38, 88, 41], BASE);
    // Ears and facial planes.
    polygon(e, [79, 17, 77, 5, 85, 13], true, false, LIGHT);
    polygon(e, [86, 15, 92, 5, 94, 19], true, false, LIGHT);
    ellipse(e, 88, 23, 2.7, 2.3, false, LIGHT);
    circle(e, 88, 23, 1.25, false, BASE);
    curve(e, [96, 35, 93, 39, 89, 39], LIGHT);
    // Mane follows the crest and is drawn in separate tapered locks.
    curve(e, [70, 23, 67, 13, 70, 5, 74, 13, 77, 4, 80, 13, 85, 7, 85, 17], BASE);
    for (let i = 0; i < 7; i += 1) curve(e, [70 + i * 2, 15, 68 + i * 2, 22, 70 + i * 2, 28], LIGHT);
    // Forelegs and hind legs with joints and hooves.
    curve(e, [28, 66, 24, 75, 22, 87, 24, 96], BASE);
    curve(e, [39, 68, 40, 78, 40, 88, 38, 96], BASE);
    curve(e, [58, 67, 62, 77, 65, 87, 64, 96], BASE);
    curve(e, [67, 61, 73, 71, 77, 84, 75, 96], BASE);
    polygon(e, [20, 95, 29, 95, 30, 100, 19, 100], true, true, LIGHT);
    polygon(e, [34, 95, 42, 95, 43, 100, 33, 100], true, true, LIGHT);
    polygon(e, [60, 95, 68, 95, 69, 100, 59, 100], true, true, LIGHT);
    polygon(e, [71, 95, 80, 95, 81, 100, 70, 100], true, true, LIGHT);
    // Tail and flowing coat hair.
    curve(e, [20, 52, 10, 63, 8, 79, 1, 87], { alpha: 0.78, width: 1.8, passes: 2 });
    curve(e, [18, 57, 13, 70, 8, 82], LIGHT);
    for (let i = 0; i < 15; i += 1) line(e, 29 + i * 2.2, 51 + Math.sin(i) * 4, 33 + i * 2.1, 55 + Math.sin(i) * 4, LIGHT);
    curve(e, [31, 48, 44, 44, 55, 48], LIGHT);
    shade(e, 47, 67, 22, 6, 30);
  }
  add('horse', ['horses', 'pony'], 'animals', 1.0, horse);

  function bird(e) {
    ellipse(e, 48, 57, 25, 20, false);
    ellipse(e, 68, 36, 14, 14, false);
    // Layered wing contour and feather vanes.
    polygon(e, [44, 48, 54, 39, 67, 42, 72, 52, 64, 64, 49, 66, 38, 59], true, false);
    for (let i = 0; i < 6; i += 1) {
      curve(e, [43 + i * 3, 50 + i * 1.3, 49 + i * 2.6, 57 + i * 0.8, 58 + i * 1.8, 62], LIGHT);
    }
    // Flight feathers in the tail.
    polygon(e, [27, 58, 10, 48, 17, 65, 9, 72, 31, 69], true, false);
    for (let i = 0; i < 4; i += 1) line(e, 29, 59 + i * 2, 15 + i * 2, 51 + i * 5, LIGHT);
    polygon(e, [79, 35, 96, 40, 80, 45], true, false);
    circle(e, 72, 33, 2.6, false, BASE);
    circle(e, 72, 33, 0.95, false, { alpha: 1, width: 0.8, passes: 1 });
    curve(e, [68, 41, 65, 44, 61, 44], LIGHT);
    // Feet curl naturally around a narrow branch.
    line(e, 48, 74, 46, 88, BASE); line(e, 63, 72, 64, 87, BASE);
    curve(e, [46, 87, 39, 91, 42, 94, 49, 91], LIGHT);
    curve(e, [64, 87, 57, 91, 61, 94, 68, 91], LIGHT);
    line(e, 23, 93, 84, 93, { alpha: 0.7, width: 1.2, passes: 2 });
    curve(e, [33, 91, 28, 86, 22, 89], LIGHT);
    curve(e, [74, 92, 79, 87, 84, 89], LIGHT);
    // Feather bars and breast texture.
    for (let i = 0; i < 9; i += 1) line(e, 39 + i * 2.6, 67 + (i % 3), 42 + i * 2.5, 70 + (i % 3), LIGHT);
    shade(e, 51, 66, 17, 6, 22);
  }
  add('bird', ['birds', 'small bird'], 'animals', 0.9, bird, { layer: 'mid' });

  function rabbit(e) {
    ellipse(e, 49, 70, 25, 20, false);
    ellipse(e, 53, 40, 18, 17, false);
    ellipse(e, 41, 21, 6.7, 19, false);
    ellipse(e, 63, 20, 6.7, 18, false);
    curve(e, [38, 29, 35, 13, 41, 5, 46, 25], LIGHT);
    curve(e, [59, 25, 64, 7, 68, 14, 66, 30], LIGHT);
    // Folded forepaws and haunch.
    curve(e, [44, 54, 38, 63, 41, 75, 49, 78], BASE);
    curve(e, [55, 55, 60, 64, 59, 76, 54, 80], BASE);
    ellipse(e, 67, 78, 13, 10, false, LIGHT);
    curve(e, [34, 79, 33, 91, 42, 96, 58, 96], BASE);
    curve(e, [58, 78, 65, 85, 76, 89, 80, 96], BASE);
    ellipse(e, 79, 89, 6, 6, false);
    circle(e, 46, 39, 1.8, false, BASE); circle(e, 60, 39, 1.8, false, BASE);
    circle(e, 53, 47, 2, false, BASE);
    curve(e, [53, 49, 50, 53, 46, 52], LIGHT); curve(e, [53, 49, 57, 53, 61, 52], LIGHT);
    for (let i = 0; i < 3; i += 1) line(e, 43, 48 + i * 3, 29, 46 + i * 5, LIGHT);
    for (let i = 0; i < 3; i += 1) line(e, 63, 48 + i * 3, 77, 46 + i * 5, LIGHT);
    fur(e, 36, 65, 63, 73, 16, 4);
    shade(e, 51, 82, 18, 6, 22);
  }
  add('rabbit', ['bunny', 'rabbits'], 'animals', 0.65, rabbit);

  // PEOPLE ------------------------------------------------------------------
  function person(e) {
    // Neutral standing figure with readable joints, folds and hands.
    ellipse(e, 50, 16, 12, 14, false);
    curve(e, [40, 13, 39, 4, 46, 1, 57, 3, 62, 11], BASE);
    // Ears, facial construction and short hair.
    ellipse(e, 37, 18, 2.7, 4, false, LIGHT); ellipse(e, 63, 18, 2.7, 4, false, LIGHT);
    circle(e, 45, 16, 1.25, false, LIGHT); circle(e, 55, 16, 1.25, false, LIGHT);
    curve(e, [49, 18, 47, 23, 50, 24], LIGHT);
    curve(e, [45, 28, 50, 31, 55, 28], LIGHT);
    line(e, 45, 34, 55, 34, LIGHT);
    // Neck and shoulders join naturally into the torso.
    line(e, 45, 29, 45, 38, BASE); line(e, 55, 29, 55, 38, BASE);
    polygon(e, [43, 36, 57, 36, 69, 45, 64, 73, 36, 73, 31, 45], true, false);
    curve(e, [31, 43, 24, 48, 22, 63, 19, 70], BASE);
    curve(e, [69, 43, 77, 49, 78, 64, 81, 70], BASE);
    // Elbows, wrists, palms and articulated fingers.
    circle(e, 21, 70, 3, false, LIGHT); circle(e, 79, 70, 3, false, LIGHT);
    curve(e, [19, 70, 13, 78, 14, 87], BASE); curve(e, [81, 70, 87, 78, 86, 87], BASE);
    ellipse(e, 14, 90, 4, 6, false, LIGHT); ellipse(e, 86, 90, 4, 6, false, LIGHT);
    for (let i = 0; i < 4; i += 1) {
      line(e, 11 + i * 2, 92, 10 + i * 2, 98, LIGHT);
      line(e, 83 + i * 2, 92, 82 + i * 2, 98, LIGHT);
    }
    // Trouser seams, knees, calves and shoes.
    curve(e, [38, 72, 37, 82, 35, 91, 32, 97], BASE);
    curve(e, [62, 72, 63, 82, 65, 91, 68, 97], BASE);
    line(e, 50, 74, 50, 91, LIGHT);
    curve(e, [32, 97, 27, 98, 26, 100, 42, 100], BASE);
    curve(e, [68, 97, 63, 98, 62, 100, 78, 100], BASE);
    // Clothing folds, belt and cast shadow hatching.
    line(e, 37, 72, 63, 72, LIGHT); line(e, 40, 74, 60, 74, LIGHT);
    curve(e, [39, 42, 45, 47, 50, 48], LIGHT);
    curve(e, [61, 43, 56, 49, 52, 50], LIGHT);
    for (let i = 0; i < 5; i += 1) line(e, 39 + i * 4, 54, 40 + i * 3.5, 65, LIGHT);
    shade(e, 50, 88, 17, 5, 20);
  }
  add('person', ['people', 'human', 'man', 'woman', 'person figure', 'stick figure'], 'people', 0.8, person, { anchors: { head: [0.5, 0.16], hand: [0.86, 0.9] } });

  function face(e) {
    // Portrait bust with cheek planes, eyelids, nose bridge, lips and hair mass.
    ellipse(e, 50, 44, 29, 36, false);
    curve(e, [23, 47, 18, 27, 29, 8, 51, 4, 72, 12, 81, 34], BASE);
    polygon(e, [22, 39, 24, 16, 41, 4, 66, 7, 80, 24, 79, 46, 71, 28, 61, 22, 48, 25, 35, 20], true, false);
    // Hair strands and temples.
    for (let i = 0; i < 9; i += 1) curve(e, [27 + i * 5, 12 + (i % 3) * 2, 30 + i * 4.5, 20 + (i % 2) * 2, 33 + i * 4, 26], LIGHT);
    curve(e, [24, 42, 17, 48, 20, 59], LIGHT); curve(e, [76, 42, 84, 49, 80, 60], LIGHT);
    // Eyes are almond forms with iris, pupil and upper lid weight.
    curve(e, [31, 42, 37, 36, 45, 40, 48, 44], BASE);
    curve(e, [53, 44, 57, 39, 65, 36, 71, 42], BASE);
    curve(e, [32, 43, 39, 47, 46, 44], LIGHT); curve(e, [54, 44, 62, 47, 70, 42], LIGHT);
    circle(e, 40, 42, 3.2, false, LIGHT); circle(e, 62, 42, 3.2, false, LIGHT);
    circle(e, 40, 42, 1.45, false, BASE); circle(e, 62, 42, 1.45, false, BASE);
    curve(e, [32, 33, 39, 30, 47, 33], LIGHT); curve(e, [55, 33, 63, 29, 71, 33], LIGHT);
    // Nose bridge and nostrils.
    curve(e, [51, 42, 49, 52, 47, 58, 52, 60], LIGHT);
    curve(e, [46, 61, 50, 64, 55, 61], BASE);
    // Lips and philtrum.
    line(e, 51, 64, 51, 68, LIGHT);
    curve(e, [40, 72, 46, 69, 51, 71, 56, 69, 63, 72], BASE);
    curve(e, [42, 73, 51, 78, 61, 73], LIGHT);
    // Chin, neck and shoulder silhouette.
    curve(e, [31, 62, 34, 78, 50, 84, 66, 77, 70, 62], LIGHT);
    line(e, 41, 78, 40, 91, BASE); line(e, 60, 78, 61, 91, BASE);
    curve(e, [40, 91, 24, 91, 17, 100], BASE); curve(e, [61, 91, 77, 91, 84, 100], BASE);
    // Cheek and neck cross-hatching.
    for (let i = 0; i < 5; i += 1) line(e, 27 + i * 2, 54 + i, 32 + i * 2, 57 + i, LIGHT);
    for (let i = 0; i < 5; i += 1) line(e, 64 + i * 2, 57 + i, 69 + i * 2, 54 + i, LIGHT);
    shade(e, 50, 84, 13, 5, 26);
  }
  add('face', ['human face', 'portrait'], 'people', 0.72, face);

  function knight(e) {
    // Plumed helmet, visor, gorget and articulated plate armor.
    polygon(e, [30, 30, 32, 12, 40, 3, 61, 3, 70, 13, 70, 31, 62, 39, 38, 39], true, false);
    curve(e, [35, 18, 50, 14, 66, 18], LIGHT);
    line(e, 34, 25, 66, 25, BASE); line(e, 38, 30, 62, 30, LIGHT);
    for (let x = 40; x <= 60; x += 5) line(e, x, 26, x, 30, LIGHT);
    polygon(e, [48, 3, 50, 0, 58, 4, 56, 10], true, false, LIGHT);
    // Torso cuirass and shoulder pauldrons.
    polygon(e, [36, 39, 64, 39, 75, 52, 67, 76, 50, 84, 33, 76, 25, 52], true, false);
    ellipse(e, 29, 47, 11, 10, false); ellipse(e, 71, 47, 11, 10, false);
    curve(e, [50, 39, 44, 52, 50, 66, 56, 52, 50, 39], LIGHT);
    line(e, 50, 42, 50, 77, LIGHT);
    // Armored arms, gauntlets and hands.
    polygon(e, [23, 50, 16, 59, 11, 78, 18, 82, 29, 62], true, false);
    polygon(e, [77, 50, 84, 59, 89, 78, 82, 82, 71, 62], true, false);
    line(e, 18, 62, 27, 68, LIGHT); line(e, 73, 68, 82, 62, LIGHT);
    ellipse(e, 15, 84, 6, 5, false); ellipse(e, 85, 84, 6, 5, false);
    // Tassets, greaves, knees and sabatons.
    polygon(e, [34, 75, 49, 82, 50, 91, 33, 91], true, true);
    polygon(e, [51, 82, 66, 75, 67, 91, 50, 91], true, true);
    ellipse(e, 35, 92, 7, 6, false); ellipse(e, 65, 92, 7, 6, false);
    line(e, 31, 96, 43, 96, LIGHT); line(e, 57, 96, 69, 96, LIGHT);
    // Sword and shield establish a clear knight silhouette.
    line(e, 90, 39, 98, 3, BASE); line(e, 86, 39, 94, 3, LIGHT);
    line(e, 84, 44, 96, 47, BASE); line(e, 87, 38, 99, 41, BASE);
    polygon(e, [4, 53, 22, 47, 25, 76, 14, 91, 3, 76], true, false);
    line(e, 14, 51, 14, 86, LIGHT); line(e, 6, 68, 22, 68, LIGHT);
    circle(e, 14, 69, 4, false, LIGHT);
    // Engraved seams and metal hatch shadows.
    for (let i = 0; i < 5; i += 1) line(e, 37 + i * 4, 48, 39 + i * 4, 55, LIGHT);
    shade(e, 52, 71, 12, 6, 25);
  }
  add('knight', ['warrior', 'armored knight'], 'people', 0.95, knight, { anchors: { head: [0.5, 0.2], hand: [0.88, 0.8] } });

  // VEHICLES ---------------------------------------------------------------
  function car(e) {
    const c = 75;
    // Body sill, hood, trunk and roofline in a long side profile.
    polygon(e, [5, 69, 12, 52, 30, 47, 48, 27, 89, 27, 108, 48, 132, 54, 143, 66, 142, 80, 6, 80], true, false, BASE, c);
    curve(e, [8, 67, 18, 61, 39, 61, 58, 63, 88, 62, 117, 65, 140, 70], LIGHT, c);
    polygon(e, [40, 47, 54, 31, 85, 31, 101, 48], true, false, LIGHT, c);
    line(e, 56, 32, 57, 48, LIGHT.centerX == null ? { centerX: c } : LIGHT);
    line(e, 86, 32, 91, 48, { centerX: c, alpha: 0.45, width: 0.7, passes: 1 });
    // Side glass, door frames, mirror, handles and belt line.
    polygon(e, [45, 45, 56, 34, 69, 34, 69, 46], true, false, LIGHT, c);
    polygon(e, [73, 34, 84, 34, 96, 46, 73, 46], true, false, LIGHT, c);
    line(e, 70, 32, 70, 76, { centerX: c, alpha: 0.55, width: 0.8, passes: 1 });
    line(e, 104, 48, 104, 75, { centerX: c, alpha: 0.55, width: 0.8, passes: 1 });
    line(e, 78, 55, 90, 55, { centerX: c, alpha: 0.75, width: 0.9, passes: 1 });
    ellipse(e, 41, 52, 2.4, 1.8, false, LIGHT, c);
    // Wheels, rubber, rim, hub and spokes.
    [34, 111].forEach(function (x) {
      circle(e, x, 79, 14, false, BASE, c);
      circle(e, x, 79, 10.5, false, LIGHT, c);
      circle(e, x, 79, 4, false, BASE, c);
      for (let i = 0; i < 8; i += 1) {
        const a = Math.PI * 2 * i / 8;
        line(e, x + Math.cos(a) * 4, 79 + Math.sin(a) * 4, x + Math.cos(a) * 9, 79 + Math.sin(a) * 9, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
      }
      for (let i = 0; i < 12; i += 1) {
        const a = Math.PI * 2 * i / 12;
        line(e, x + Math.cos(a) * 11.8, 79 + Math.sin(a) * 11.8, x + Math.cos(a) * 13.3, 79 + Math.sin(a) * 13.3, { centerX: c, alpha: 0.35, width: 0.55, passes: 1 });
      }
    });
    // Lamps, grille, bumper and subtle reflections.
    ellipse(e, 138, 65, 3.5, 4.5, false, LIGHT, c);
    ellipse(e, 10, 66, 4.2, 3.2, false, LIGHT, c);
    line(e, 128, 71, 140, 71, { centerX: c, alpha: 0.55, width: 0.8, passes: 1 });
    for (let i = 0; i < 5; i += 1) line(e, 133 + i, 62, 133 + i, 68, { centerX: c, alpha: 0.4, width: 0.5, passes: 1 });
    curve(e, [18, 54, 29, 50, 36, 50], LIGHT, c);
    shade(e, 75, 84, 55, 3, 22);
  }
  add('car', ['automobile', 'cars', 'vehicle'], 'vehicles', 1.4, car);

  function bicycle(e) {
    const c = 75;
    // Two true circular wheels with hubs and tangent frame geometry.
    [22, 128].forEach(function (x) {
      circle(e, x, 76, 19, false, BASE, c);
      circle(e, x, 76, 16.5, false, LIGHT, c);
      circle(e, x, 76, 2.4, false, BASE, c);
      for (let i = 0; i < 12; i += 1) {
        const a = i * Math.PI / 6;
        line(e, x, 76, x + Math.cos(a) * 16, 76 + Math.sin(a) * 16, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
      }
    });
    // Diamond frame with bottom bracket and fork.
    line(e, 22, 76, 68, 76, { centerX: c, alpha: 0.82, width: 1.55, passes: 2 });
    line(e, 68, 76, 54, 43, { centerX: c, alpha: 0.82, width: 1.55, passes: 2 });
    line(e, 54, 43, 22, 76, { centerX: c, alpha: 0.82, width: 1.55, passes: 2 });
    line(e, 54, 43, 92, 43, { centerX: c, alpha: 0.82, width: 1.55, passes: 2 });
    line(e, 92, 43, 68, 76, { centerX: c, alpha: 0.82, width: 1.55, passes: 2 });
    line(e, 92, 43, 128, 76, { centerX: c, alpha: 0.82, width: 1.55, passes: 2 });
    // Seat post, saddle, handlebar and brake cables.
    line(e, 54, 43, 49, 30, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
    curve(e, [39, 29, 48, 27, 58, 30], BASE, c);
    line(e, 92, 43, 96, 24, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
    curve(e, [90, 23, 98, 19, 108, 21], BASE, c);
    curve(e, [93, 25, 84, 33, 86, 41], LIGHT, c);
    // Chain ring, crank, pedal and rear derailleur.
    circle(e, 68, 76, 7, false, LIGHT, c);
    line(e, 68, 76, 77, 85, BASE.centerX == null ? Object.assign({}, BASE, { centerX: c }) : BASE);
    line(e, 77, 85, 84, 85, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
    circle(e, 22, 76, 4, false, LIGHT, c);
    curve(e, [22, 76, 43, 82, 68, 76], LIGHT, c);
    shade(e, 75, 98, 55, 1.5, 16);
  }
  add('bicycle', ['bike', 'bicycles'], 'vehicles', 1.45, bicycle);

  function airplane(e) {
    const c = 85;
    // Long fuselage with rounded nose and tapered tail.
    polygon(e, [8, 53, 24, 46, 60, 43, 137, 45, 158, 51, 161, 56, 152, 61, 61, 64, 25, 61], true, false, BASE, c);
    curve(e, [14, 53, 40, 50, 92, 50, 143, 52, 158, 56], LIGHT, c);
    // Main wings in perspective, with root, tips and rear edges.
    polygon(e, [72, 48, 91, 7, 108, 8, 100, 49, 108, 60, 91, 62], true, false, BASE, c);
    curve(e, [91, 9, 94, 27, 94, 48], LIGHT, c);
    polygon(e, [28, 53, 10, 35, 22, 34, 49, 50], true, false, LIGHT, c);
    // Tailplane, vertical fin and rudder seam.
    polygon(e, [25, 52, 12, 32, 20, 31, 42, 49], true, false, LIGHT, c);
    polygon(e, [25, 53, 31, 34, 39, 32, 41, 53], true, false, BASE, c);
    line(e, 35, 37, 37, 52, { centerX: c, alpha: 0.45, width: 0.7, passes: 1 });
    // Cockpit windows, cabin windows and engine nacelle.
    polygon(e, [138, 49, 151, 52, 150, 56, 139, 55], true, false, LIGHT, c);
    for (let i = 0; i < 8; i += 1) circle(e, 66 + i * 8, 54, 1.3, false, LIGHT, c);
    ellipse(e, 109, 62, 7, 4, false, LIGHT, c);
    curve(e, [103, 62, 110, 65, 117, 62], LIGHT, c);
    // Panel and control-surface lines.
    line(e, 52, 47, 52, 61, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
    line(e, 128, 48, 128, 61, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
    shade(e, 85, 66, 63, 2, 20);
  }
  add('airplane', ['plane', 'aircraft'], 'vehicles', 1.55, airplane, { layer: 'sky', anchor: 'sky' });

  function truck(e) {
    const c = 75;
    // Cargo bed and cab have separate planes and perspective edges.
    polygon(e, [5, 36, 89, 36, 89, 77, 5, 77], true, false, BASE, c);
    line(e, 9, 42, 85, 42, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
    for (let i = 0; i < 6; i += 1) line(e, 14 + i * 11, 45, 14 + i * 11, 72, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
    polygon(e, [89, 49, 112, 49, 133, 62, 139, 77, 89, 77], true, false, BASE, c);
    polygon(e, [94, 51, 110, 51, 128, 63, 95, 63], true, false, LIGHT, c);
    line(e, 95, 65, 136, 65, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
    // Chassis, tires, wheel wells and rims.
    line(e, 6, 78, 140, 78, BASE.centerX == null ? Object.assign({}, BASE, { centerX: c }) : BASE);
    [34, 113].forEach(function (x) {
      arc(e, x, 78, 16, Math.PI, Math.PI * 2, BASE, c);
      circle(e, x, 79, 11, false, BASE, c); circle(e, x, 79, 7, false, LIGHT, c); circle(e, x, 79, 2.5, false, BASE, c);
      for (let i = 0; i < 6; i += 1) {
        const a = i * Math.PI / 3;
        line(e, x + Math.cos(a) * 3, 79 + Math.sin(a) * 3, x + Math.cos(a) * 6, 79 + Math.sin(a) * 6, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
      }
    });
    // Mirror, headlamp, bumper, door seam and cargo texture.
    line(e, 89, 53, 84, 47, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
    ellipse(e, 135, 70, 3, 4, false, LIGHT, c);
    line(e, 131, 75, 141, 75, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
    line(e, 91, 49, 91, 77, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
    shade(e, 76, 84, 59, 2, 20);
  }
  add('truck', ['trucks', 'pickup truck', 'lorry'], 'vehicles', 1.35, truck);

  function lion(e) {
    // Layered mane mass frames the muzzle without obscuring the face.
    ellipse(e, 49, 51, 38, 39, false);
    for (let i = 0; i < 18; i += 1) {
      const a = Math.PI * 2 * i / 18;
      const x = 49 + Math.cos(a) * 34;
      const y = 51 + Math.sin(a) * 34;
      const x2 = 49 + Math.cos(a + 0.12) * (42 + (i % 3) * 2);
      const y2 = 51 + Math.sin(a + 0.12) * (42 + (i % 3) * 2);
      curve(e, [x, y, (x + x2) / 2 - 2, (y + y2) / 2, x2, y2], LIGHT);
    }
    ellipse(e, 50, 51, 24, 25, false);
    ellipse(e, 50, 62, 16, 12, false, LIGHT);
    ellipse(e, 38, 45, 5, 4, false, LIGHT); ellipse(e, 62, 45, 5, 4, false, LIGHT);
    circle(e, 39, 45, 2, false, BASE); circle(e, 61, 45, 2, false, BASE);
    polygon(e, [46, 57, 50, 54, 54, 57, 50, 60], true, false, LIGHT);
    curve(e, [50, 60, 46, 67, 40, 66], BASE); curve(e, [50, 60, 54, 67, 60, 66], BASE);
    curve(e, [27, 81, 23, 88, 25, 96], BASE); curve(e, [40, 84, 38, 91, 39, 98], BASE);
    curve(e, [60, 84, 62, 91, 61, 98], BASE); curve(e, [73, 81, 77, 88, 75, 96], BASE);
    curve(e, [76, 72, 91, 78, 96, 70, 94, 61], BASE);
    ellipse(e, 94, 60, 4, 6, false, LIGHT);
    for (let i = 0; i < 12; i += 1) line(e, 30 + i * 3, 29 + (i % 3) * 2, 34 + i * 2.5, 35 + (i % 3) * 2, LIGHT);
    shade(e, 50, 75, 26, 10, 42);
  }
  add('lion', ['lions', 'lioness'], 'animals', 0.95, lion);

  function bear(e) {
    // Heavy shoulders, rounded belly, broad muzzle and short powerful limbs.
    ellipse(e, 50, 59, 31, 31, false);
    ellipse(e, 50, 27, 23, 22, false);
    circle(e, 34, 11, 8, false); circle(e, 66, 11, 8, false);
    circle(e, 34, 11, 3.7, false, LIGHT); circle(e, 66, 11, 3.7, false, LIGHT);
    ellipse(e, 50, 39, 13, 10, false, LIGHT);
    circle(e, 42, 27, 2, false, BASE); circle(e, 58, 27, 2, false, BASE);
    ellipse(e, 50, 37, 4.5, 3.5, false, BASE);
    curve(e, [50, 41, 47, 47, 43, 46], LIGHT); curve(e, [50, 41, 53, 47, 57, 46], LIGHT);
    curve(e, [27, 48, 20, 58, 20, 75, 27, 83], BASE);
    curve(e, [73, 48, 80, 58, 80, 75, 73, 83], BASE);
    ellipse(e, 28, 82, 10, 9, false); ellipse(e, 72, 82, 10, 9, false);
    curve(e, [37, 82, 34, 90, 33, 97, 43, 99], BASE);
    curve(e, [63, 82, 66, 90, 67, 97, 57, 99], BASE);
    line(e, 32, 98, 44, 98, LIGHT); line(e, 56, 98, 68, 98, LIGHT);
    // Clumped fur follows the shoulder and flanks.
    fur(e, 24, 48, 41, 59, 16, 5); fur(e, 59, 50, 76, 61, 16, 5);
    fur(e, 30, 70, 68, 76, 22, 5);
    shade(e, 50, 78, 25, 8, 40); flecks(e, 50, 60, 22, 24, 28);
  }
  add('bear', ['bears', 'grizzly'], 'animals', 0.85, bear);

  function train(e) {
    const c = 75;
    // Steam locomotive boiler, smokebox and cab.
    polygon(e, [27, 36, 91, 36, 99, 49, 99, 77, 20, 77, 20, 53], true, false, BASE, c);
    ellipse(e, 29, 55, 10, 19, false, LIGHT, c);
    polygon(e, [91, 25, 128, 25, 136, 38, 136, 76, 96, 76], true, false, BASE, c);
    polygon(e, [101, 34, 126, 34, 129, 52, 101, 52], true, false, LIGHT, c);
    // Boiler bands, handrails, piping and smokestack.
    for (let x = 43; x <= 86; x += 12) line(e, x, 38, x, 75, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
    line(e, 34, 46, 92, 46, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
    line(e, 36, 62, 91, 62, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
    polygon(e, [46, 36, 50, 17, 61, 17, 65, 36], true, false, BASE, c);
    polygon(e, [43, 17, 64, 17, 62, 12, 45, 12], true, false, LIGHT, c);
    line(e, 49, 12, 49, 5, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
    // Cowcatcher, front lamp and circular driving wheels.
    polygon(e, [20, 65, 4, 80, 19, 78], true, false, BASE, c);
    circle(e, 18, 49, 5, false, LIGHT, c); circle(e, 18, 49, 1.6, false, BASE, c);
    [36, 76, 111].forEach(function (x) {
      circle(e, x, 82, x === 76 ? 12 : 9, false, BASE, c);
      circle(e, x, 82, x === 76 ? 7 : 5.5, false, LIGHT, c);
      circle(e, x, 82, 1.8, false, BASE, c);
    });
    line(e, 36, 82, 76, 82, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
    line(e, 76, 82, 111, 82, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
    line(e, 15, 92, 140, 92, BASE.centerX == null ? Object.assign({}, BASE, { centerX: c }) : BASE);
    line(e, 8, 96, 146, 96, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
    shade(e, 78, 96, 58, 2, 22);
  }
  add('train', ['trains', 'locomotive'], 'vehicles', 1.42, train);

  function helicopter(e) {
    // Rounded fuselage, cockpit glazing and tail boom.
    ellipse(e, 61, 55, 30, 18, false);
    polygon(e, [76, 43, 94, 43, 98, 57, 91, 68, 72, 70], true, false, LIGHT);
    curve(e, [36, 53, 26, 49, 15, 52, 10, 58], BASE);
    curve(e, [36, 68, 24, 73, 14, 69], LIGHT);
    // Cockpit split and cabin windows.
    curve(e, [77, 43, 83, 49, 84, 59, 78, 66], LIGHT);
    curve(e, [48, 43, 58, 48, 61, 64, 52, 70], LIGHT);
    line(e, 62, 40, 62, 70, LIGHT);
    // Rotor mast, hub and long blades.
    line(e, 58, 36, 58, 27, BASE); circle(e, 58, 25, 3, false, BASE);
    line(e, 9, 22, 104, 22, { alpha: 0.84, width: 1.8, passes: 2 });
    line(e, 56, 22, 96, 10, LIGHT); line(e, 56, 22, 19, 34, LIGHT);
    // Tail rotor and landing skids.
    line(e, 14, 54, 6, 42, BASE); line(e, 6, 42, 4, 29, LIGHT);
    line(e, 1, 36, 15, 36, LIGHT); line(e, 8, 29, 8, 43, LIGHT);
    curve(e, [39, 73, 36, 83, 45, 87, 77, 87, 85, 82], BASE);
    line(e, 44, 73, 39, 87, LIGHT); line(e, 77, 71, 82, 87, LIGHT);
    curve(e, [30, 89, 53, 92, 79, 89], LIGHT);
    // Body panels, door seam and subtle underside graphite.
    line(e, 63, 69, 63, 79, LIGHT); line(e, 67, 71, 78, 71, LIGHT);
    circle(e, 72, 54, 1.5, false, BASE); circle(e, 77, 54, 1.5, false, BASE);
    shade(e, 57, 71, 23, 5, 24);
  }
  add('helicopter', ['helicopters', 'chopper'], 'vehicles', 1.05, helicopter, { anchor: 'sky', layer: 'sky' });

  // BUILDINGS --------------------------------------------------------------
  function house(e) {
    // Wall planes, roof thickness, fascia and chimney.
    polygon(e, [12, 43, 50, 17, 88, 43, 88, 96, 12, 96], true, false);
    polygon(e, [5, 43, 50, 6, 95, 43, 89, 47, 50, 16, 11, 47], true, false);
    polygon(e, [70, 19, 70, 5, 80, 5, 82, 29], true, false);
    line(e, 72, 5, 82, 5, BASE); line(e, 73, 9, 81, 9, LIGHT);
    // Roof shingle courses, spaced with subtle perspective.
    for (let row = 0; row < 5; row += 1) {
      const y = 17 + row * 5;
      const left = 17 + row * 7;
      const right = 83 - row * 7;
      line(e, left, y, 50, y - 27 + row * 5, LIGHT);
      line(e, 50, y - 27 + row * 5, right, y, LIGHT);
    }
    for (let x = 20; x < 85; x += 9) line(e, x, 43 + (x < 50 ? (50 - x) * 0.55 : (x - 50) * 0.55), x + 4, 46 + Math.abs(x - 50) * 0.55, LIGHT);
    // Windows with deep reveals, panes and shutters.
    [27, 64].forEach(function (x) {
      polygon(e, [x, 53, x + 14, 53, x + 14, 72, x, 72], true, false);
      line(e, x + 7, 54, x + 7, 71, LIGHT); line(e, x + 1, 63, x + 13, 63, LIGHT);
      line(e, x - 3, 52, x - 3, 73, LIGHT); line(e, x + 17, 52, x + 17, 73, LIGHT);
      line(e, x - 5, 54, x - 3, 70, LIGHT); line(e, x + 17, 54, x + 19, 70, LIGHT);
    });
    // Door, steps, lintel, handle and stone foundation.
    polygon(e, [43, 66, 57, 66, 57, 96, 43, 96], true, false);
    arc(e, 50, 67, 7, Math.PI, Math.PI * 2, LIGHT);
    circle(e, 54, 82, 1.2, false, BASE);
    line(e, 39, 96, 61, 96, BASE); line(e, 35, 99, 65, 99, LIGHT);
    line(e, 13, 88, 87, 88, LIGHT);
    for (let i = 0; i < 8; i += 1) line(e, 15 + i * 9, 91, 20 + i * 9, 95, LIGHT);
    // Siding and brick courses, concentrated near the shaded corners.
    for (let y = 48; y < 88; y += 7) {
      line(e, 15, y, 23, y, LIGHT); line(e, 78, y, 85, y, LIGHT);
    }
    shade(e, 20, 77, 7, 15, 26); shade(e, 81, 81, 6, 12, 22);
  }
  add('house', ['home', 'cottage', 'homes'], 'buildings', 0.95, house, { anchors: { top: [0.5, 0.06], inside: [0.5, 0.62] } });

  function castle(e) {
    const c = 70;
    // Central keep and curtain wall.
    polygon(e, [30, 31, 110, 31, 110, 96, 30, 96], true, false, BASE, c);
    polygon(e, [23, 29, 117, 29, 117, 40, 23, 40], true, false, LIGHT, c);
    // Tower masses and crenellated parapets.
    [9, 91].forEach(function (x) {
      polygon(e, [x, 17, x + 24, 17, x + 27, 98, x - 3, 98], true, false, BASE, c);
      polygon(e, [x - 3, 17, x - 3, 8, x + 4, 8, x + 4, 2, x + 11, 2, x + 11, 8, x + 18, 8, x + 18, 2, x + 25, 2, x + 25, 17], true, false, LIGHT, c);
      for (let y = 28; y < 89; y += 18) {
        line(e, x + 6, y, x + 18, y, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
      }
      polygon(e, [x + 8, 43, x + 18, 43, x + 18, 60, x + 8, 60], true, false, LIGHT, c);
      line(e, x + 13, 44, x + 13, 59, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
    });
    // Central gatehouse, portcullis and narrow arched windows.
    polygon(e, [57, 52, 83, 52, 83, 96, 57, 96], true, false, BASE, c);
    arc(e, 70, 55, 13, Math.PI, Math.PI * 2, BASE, c);
    curve(e, [58, 64, 58, 51, 70, 44, 82, 51, 82, 64], LIGHT, c);
    for (let x = 61; x <= 79; x += 4) line(e, x, 59, x, 89, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
    line(e, 58, 72, 82, 72, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
    // Stone joints vary so the masonry does not look like a regular grid.
    for (let row = 0; row < 6; row += 1) {
      const y = 43 + row * 8;
      line(e, 30, y, 56, y, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
      line(e, 84, y, 110, y, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
      for (let col = 0; col < 3; col += 1) {
        const x1 = 33 + col * 9 + (row % 2) * 4;
        line(e, x1, y - 7, x1, y, LIGHT.centerX == null ? Object.assign({}, LIGHT, { centerX: c }) : LIGHT);
      }
    }
    // Flags and stone shadow under the battlements.
    line(e, 70, 2, 70, 0, BASE.centerX == null ? Object.assign({}, BASE, { centerX: c }) : BASE);
    polygon(e, [70, 0, 87, 5, 70, 10], true, false, LIGHT, c);
    shade(e, 70, 93, 49, 3, 32);
  }
  add('castle', ['castles', 'fortress'], 'buildings', 1.12, castle, { anchors: { top: [0.5, 0.12], inside: [0.5, 0.65] } });

  function skyscraper(e) {
    // Tall tapering tower in two-point facade perspective.
    polygon(e, [25, 99, 31, 12, 49, 2, 73, 10, 80, 99], true, false);
    polygon(e, [31, 12, 49, 2, 49, 92, 30, 99], true, false, LIGHT);
    line(e, 49, 2, 49, 92, BASE); line(e, 73, 10, 80, 99, LIGHT);
    // Crown, mechanical penthouse and rooftop antenna.
    polygon(e, [31, 12, 36, 5, 64, 5, 73, 10, 49, 18], true, false);
    line(e, 49, 2, 49, 0, BASE); circle(e, 49, 1.5, 1.2, false, LIGHT);
    // Receding rows of windows narrow toward the roof.
    for (let row = 0; row < 10; row += 1) {
      const y = 22 + row * 7;
      const inset = row * 0.65;
      line(e, 32 + inset, y, 72 - inset, y + 1, LIGHT);
      for (let col = 0; col < 4; col += 1) {
        const x = 37 + col * 9 - inset * 0.3;
        line(e, x, y + 2, x - 1, y + 5, LIGHT);
      }
    }
    // Vertical mullions, recessed entrance, and hard shadow on one face.
    line(e, 39, 19, 34, 94, LIGHT); line(e, 61, 17, 69, 95, LIGHT);
    polygon(e, [43, 77, 56, 78, 57, 99, 42, 99], true, true, LIGHT);
    shade(e, 34, 63, 4, 28, 28);
    line(e, 18, 100, 87, 100, LIGHT);
  }
  add('skyscraper', ['tower block', 'high rise'], 'buildings', 0.7, skyscraper, { layer: 'mid' });

  function barn(e) {
    polygon(e, [12, 40, 88, 40, 88, 97, 12, 97], true, false);
    polygon(e, [5, 43, 50, 5, 95, 43, 88, 48, 50, 16, 12, 48], true, false);
    // Roof boards and ridge cap.
    line(e, 50, 7, 50, 17, LIGHT);
    for (let i = 0; i < 5; i += 1) {
      line(e, 13 + i * 7, 40 - i * 5, 50, 9 + i * 5, LIGHT);
      line(e, 50, 9 + i * 5, 87 - i * 7, 40 - i * 5, LIGHT);
    }
    // Great sliding doors with diagonal braces and iron hardware.
    polygon(e, [34, 54, 66, 54, 66, 97, 34, 97], true, false);
    line(e, 50, 54, 50, 97, BASE); line(e, 36, 58, 64, 93, LIGHT); line(e, 64, 58, 36, 93, LIGHT);
    line(e, 34, 54, 66, 54, BASE); circle(e, 47, 77, 1.3, false, LIGHT); circle(e, 53, 77, 1.3, false, LIGHT);
    // Hayloft vent, side window and plank seams.
    polygon(e, [42, 26, 58, 26, 58, 39, 42, 39], true, false, LIGHT);
    line(e, 50, 27, 50, 38, LIGHT); line(e, 43, 32, 57, 32, LIGHT);
    polygon(e, [19, 59, 29, 59, 29, 71, 19, 71], true, false, LIGHT);
    line(e, 24, 60, 24, 70, LIGHT);
    for (let y = 45; y < 96; y += 9) line(e, 14, y, 30, y, LIGHT);
    shade(e, 20, 83, 6, 10, 18); shade(e, 79, 84, 5, 10, 20);
    line(e, 8, 98, 92, 98, LIGHT);
  }
  add('barn', ['farm barn'], 'buildings', 0.95, barn);

  function lighthouse(e) {
    polygon(e, [31, 34, 69, 34, 79, 99, 21, 99], true, false);
    // Alternating stone courses, perspective taper and balcony.
    for (let y = 45; y < 94; y += 10) {
      const inset = (y - 45) * 0.1;
      line(e, 29 - inset, y, 71 + inset, y, LIGHT);
    }
    line(e, 31, 34, 21, 99, BASE); line(e, 69, 34, 79, 99, BASE);
    polygon(e, [25, 33, 75, 33, 78, 39, 22, 39], true, false);
    // Lantern room with glazing bars and domed roof.
    polygon(e, [30, 15, 70, 15, 70, 32, 30, 32], true, false);
    for (let x = 36; x <= 64; x += 9) line(e, x, 16, x, 31, LIGHT);
    line(e, 31, 24, 69, 24, LIGHT);
    polygon(e, [25, 16, 50, 3, 75, 16], true, false);
    circle(e, 50, 5, 2, false, LIGHT);
    line(e, 20, 13, 80, 13, BASE); line(e, 18, 33, 82, 33, BASE);
    // Door and narrow seaward windows.
    polygon(e, [43, 76, 57, 76, 57, 99, 43, 99], true, false);
    arc(e, 50, 77, 7, Math.PI, Math.PI * 2, LIGHT);
    circle(e, 54, 88, 1.2, false, LIGHT);
    polygon(e, [40, 47, 46, 47, 46, 61, 40, 61], true, false, LIGHT);
    polygon(e, [54, 47, 60, 47, 60, 61, 54, 61], true, false, LIGHT);
    line(e, 43, 47, 43, 61, LIGHT); line(e, 57, 47, 57, 61, LIGHT);
    line(e, 8, 100, 92, 100, LIGHT);
    shade(e, 70, 72, 5, 22, 24);
  }
  add('lighthouse', ['beacon'], 'buildings', 0.85, lighthouse, { anchors: { top: [0.5, 0.03], inside: [0.5, 0.45] } });



  // SCENE ILLUSTRATIONS ------------------------------------------------------
  // These replace the original geometric house/tree/river/sun/bird recipes.
  // They remain procedural, deterministic pencil drawings and keep the same
  // registered IDs and aliases used by existing prompts.

  function detailedHouse(e) {
    shade(e, 52, 97, 46, 3, 42);

    // Chimney and cap are drawn first so the roof naturally overlaps them.
    polygon(e, [70, 20, 70, 3, 82, 3, 82, 37, 75, 32, 75, 20], true, false);
    line(e, 67, 3, 85, 3, BASE);
    line(e, 70, 10, 81, 10, LIGHT);
    line(e, 70, 17, 77, 17, LIGHT);
    line(e, 77, 23, 82, 23, LIGHT);
    line(e, 75, 29, 82, 29, LIGHT);

    // Front and right side wall planes create a modest three-quarter view.
    polygon(e, [15, 47, 68, 47, 68, 94, 15, 94], true, false);
    polygon(e, [68, 47, 88, 35, 88, 83, 68, 94], true, true, SHADE);
    line(e, 15, 47, 15, 94, BASE);
    line(e, 68, 47, 68, 94, BASE);
    line(e, 88, 35, 88, 83, BASE);
    for (let y = 53; y <= 89; y += 6) {
      line(e, 17, y, 66, y + 0.2, LIGHT);
      line(e, 70, y - 2, 86, y - 10, SHADE);
    }
    // A few short grain marks suggest weathered boards without cluttering the wall.
    for (let i = 0; i < 12; i += 1) {
      const x = 18 + ((i * 13) % 47);
      const y = 50 + ((i * 17) % 39);
      line(e, x, y, x + 2 + (i % 3), y + 0.3, SHADE);
    }

    // Front gable roof and the deeper roof plane on the right.
    polygon(e, [7, 48, 43, 8, 79, 48, 72, 54, 43, 21, 14, 54], true, false);
    polygon(e, [43, 8, 96, 36, 89, 49, 79, 48, 43, 21], true, true, SHADE);
    line(e, 7, 48, 43, 8, BASE);
    line(e, 43, 8, 79, 48, BASE);
    line(e, 43, 8, 96, 36, BASE);
    line(e, 96, 36, 89, 49, BASE);
    line(e, 14, 54, 43, 21, BASE);
    line(e, 43, 21, 72, 54, BASE);
    line(e, 72, 54, 89, 49, BASE);

    // Individual slate marks follow each roof slope instead of crossing it.
    for (let row = 0; row < 7; row += 1) {
      const y = 14 + row * 4.6;
      const leftX = 43 - (y - 8) * 0.83;
      const rightX = 43 + (y - 8) * 0.83;
      for (let col = 0; col < 3; col += 1) {
        const lx = leftX + 3 + col * 5;
        const rx = rightX + 3 + col * 5;
        if (lx < 42) line(e, lx, y + 2, lx + 3.5, y - 1.5, LIGHT);
        if (rx < 77) line(e, rx, y - 1.5, rx + 3.5, y + 2, LIGHT);
      }
      line(e, 48 + row * 5, 12 + row * 3.2, 51 + row * 5, 14 + row * 3.2, LIGHT);
    }
    line(e, 7, 48, 79, 48, BASE);
    line(e, 14, 54, 72, 54, LIGHT);

    // Two front windows have inset frames, muntins, glazing reflections and sills.
    function windowAt(x, y) {
      polygon(e, [x, y, x + 15, y, x + 15, y + 18, x, y + 18], true, false, BASE);
      polygon(e, [x + 1.5, y + 1.5, x + 13.5, y + 1.5, x + 13.5, y + 16.5, x + 1.5, y + 16.5], true, false, LIGHT);
      line(e, x + 7.5, y + 1, x + 7.5, y + 17, BASE);
      line(e, x + 1, y + 9, x + 14, y + 9, BASE);
      line(e, x - 2, y - 1.5, x + 17, y - 1.5, BASE);
      line(e, x - 2, y + 19, x + 17, y + 19, BASE);
      line(e, x + 3, y + 3, x + 6, y + 6, LIGHT);
      line(e, x + 10, y + 11, x + 13, y + 14, LIGHT);
      shade(e, x + 12, y + 13, 1.8, 3.8, 7);
    }
    windowAt(21, 61);
    windowAt(47, 61);

    // Narrow side window recedes with the right wall's perspective.
    polygon(e, [74, 55, 83, 50, 83, 65, 74, 70], true, false, LIGHT);
    line(e, 78.5, 52.5, 78.5, 67.5, LIGHT);
    line(e, 73, 63, 84, 58, LIGHT);

    // Recessed front door, inset panels, handle and stone threshold.
    polygon(e, [34, 65, 45, 65, 45, 94, 34, 94], true, false, BASE);
    curve(e, [34, 70, 34, 61, 39.5, 59, 45, 70], LIGHT);
    line(e, 36, 70, 36, 92, LIGHT);
    line(e, 43, 70, 43, 92, LIGHT);
    line(e, 36.5, 79, 42.5, 79, SHADE);
    line(e, 36.5, 86, 42.5, 86, SHADE);
    circle(e, 42, 79, 1.15, false, BASE);
    polygon(e, [31, 94, 48, 94, 50, 97, 29, 97], true, false, LIGHT);
    line(e, 26, 98, 52, 98, BASE);

    // Foundation stones, stepping path, shrubs and a few grass blades.
    for (let i = 0; i < 7; i += 1) {
      const x = 17 + i * 7;
      line(e, x, 95, x + 4, 95, LIGHT);
      if (i % 2 === 0) line(e, x + 2, 92, x + 2, 95, SHADE);
    }
    curve(e, [43, 98, 39, 99, 34, 100], LIGHT);
    curve(e, [49, 98, 54, 99, 60, 100], LIGHT);
    for (let i = 0; i < 5; i += 1) {
      const x = 5 + i * 3;
      curve(e, [x + 4, 96, x, 91, x + 2, 87 - (i % 2) * 2], LIGHT);
      curve(e, [91 + i, 95, 95 + i, 91, 93 + i, 86], LIGHT);
    }
  }
  add('house', ['home', 'cottage', 'homes'], 'buildings', 1.25, detailedHouse, {
    layer: 'mid', anchor: 'ground', anchors: { top: [0.5, 0.12], inside: [0.5, 0.62] }
  });

  function detailedPine(e) {
    // Slightly leaning trunk with root flare and a shaded side.
    curve(e, [49, 99, 48, 77, 51, 54, 50, 29, 52, 8], BASE);
    curve(e, [53, 99, 52, 77, 54, 55, 53, 31, 55, 8], LIGHT);
    line(e, 49, 88, 41, 99, LIGHT);
    line(e, 53, 88, 61, 99, LIGHT);

    // Layered boughs are curved and slightly irregular, not solid triangles.
    const tiers = [
      { y: 22, reach: 14, drop: 12 },
      { y: 31, reach: 22, drop: 14 },
      { y: 42, reach: 30, drop: 15 },
      { y: 54, reach: 37, drop: 15 },
      { y: 67, reach: 43, drop: 14 },
      { y: 80, reach: 48, drop: 12 }
    ];
    tiers.forEach(function (tier, index) {
      const y = tier.y;
      const reach = tier.reach;
      const drop = tier.drop;
      curve(e, [50, y, 46, y + 3, 50 - reach * 0.62, y + drop * 0.72, 50 - reach, y + drop], BASE);
      curve(e, [50, y + 1, 55, y + 4, 50 + reach * 0.6, y + drop * 0.72, 50 + reach, y + drop], BASE);
      curve(e, [50 - reach * 0.7, y + drop * 0.7, 50 - reach * 0.9, y + drop * 0.55, 50 - reach, y + drop], LIGHT);
      curve(e, [50 + reach * 0.7, y + drop * 0.7, 50 + reach * 0.9, y + drop * 0.55, 50 + reach, y + drop], LIGHT);

      // Small sprays of needles along each branch, with seeded variation.
      for (let side = -1; side <= 1; side += 2) {
        for (let i = 0; i < 11; i += 1) {
          const t = (i + 0.5) / 11;
          const bx = 50 + side * reach * t;
          const by = y + drop * t;
          const jitter = (e.random() - 0.5) * 2.2;
          line(e, bx, by + jitter, bx + side * (2.5 + e.random() * 3), by - 3 - e.random() * 3, LIGHT);
          if (i % 3 === 0) line(e, bx + side * 2, by + 1, bx + side * 5, by - 1, SHADE);
        }
      }
      if (index % 2 === 0) {
        curve(e, [50 - reach * 0.25, y + 5, 50 - reach * 0.4, y + 9, 50 - reach * 0.55, y + 10], LIGHT);
        curve(e, [50 + reach * 0.25, y + 5, 50 + reach * 0.4, y + 9, 50 + reach * 0.55, y + 10], LIGHT);
      }
    });
    shade(e, 56, 74, 20, 7, 28);
  }
  add('pine-tree', ['pine', 'pine trees', 'evergreen'], 'nature', 0.82, detailedPine, {
    layer: 'mid', anchor: 'ground', plural: 3, anchors: { top: [0.5, 0.05] }
  });

  function detailedRiver(e) {
    // Fill a soft S-shaped channel first; smooth bank curves define its edges.
    const ctx = e.ctx;
    ctx.save();
    ctx.translate(-50, -100);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#d9d8d2';
    ctx.globalAlpha = 0.92;
    ctx.beginPath();
    ctx.moveTo(38, -2);
    ctx.bezierCurveTo(51, 14, 36, 21, 42, 35);
    ctx.bezierCurveTo(49, 49, 42, 57, 54, 70);
    ctx.bezierCurveTo(66, 83, 54, 93, 64, 102);
    ctx.lineTo(84, 102);
    ctx.bezierCurveTo(72, 88, 79, 79, 69, 67);
    ctx.bezierCurveTo(57, 53, 75, 45, 61, 32);
    ctx.bezierCurveTo(49, 20, 65, 10, 56, -2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    curve(e, [38, -2, 51, 14, 36, 21, 42, 35, 49, 49, 42, 57, 54, 70, 66, 83, 54, 93, 64, 101], BASE);
    curve(e, [56, -2, 65, 10, 49, 20, 61, 32, 75, 45, 57, 53, 69, 67, 79, 79, 72, 88, 84, 101], BASE);
    // Fine reflections follow the water's bends rather than crossing the banks.
    const ripples = [
      [48, 9, 54, 10], [43, 25, 50, 26], [55, 39, 62, 40],
      [48, 55, 55, 56], [62, 70, 68, 71], [56, 86, 63, 87]
    ];
    ripples.forEach(function (r, i) {
      curve(e, [r[0], r[1], r[0] + 2, r[1] - 1.2, r[2], r[3]], { alpha: 0.27, width: 0.7, passes: 1, wobble: 0.015 });
      if (i % 2 === 0) line(e, r[0] + 1, r[1] + 3, r[2] - 1, r[3] + 3, SHADE);
    });
    // Rounded stones and reeds break up the banks and establish scale.
    for (let i = 0; i < 7; i += 1) {
      const y = 8 + i * 13;
      const side = i % 2 ? -1 : 1;
      const bend = Math.sin(i * 0.8) * 7;
      const x = 48 + bend + side * 22;
      ellipse(e, x, y, 2.4 + (i % 3), 1.2, false, LIGHT);
      line(e, x + side * 4, y + 5, x + side * 7, y - 4, LIGHT);
      line(e, x + side * 4, y + 5, x + side * 11, y - 1, LIGHT);
      if (i % 2 === 0) line(e, x + side * 7, y + 4, x + side * 13, y - 5, SHADE);
    }
  }
  add('river', ['rivers', 'stream', 'winding river'], 'nature', 1.05, detailedRiver, {
    layer: 'far', anchor: 'water', anchors: { top: [0.5, 0.12] }
  });

  function detailedSun(e) {
    for (let i = 0; i < 16; i += 1) {
      const a = (Math.PI * 2 * i) / 16;
      const inner = i % 2 ? 32 : 29;
      const outer = i % 2 ? 43 : 47;
      line(e, 50 + Math.cos(a) * inner, 50 + Math.sin(a) * inner,
        50 + Math.cos(a) * outer, 50 + Math.sin(a) * outer,
        i % 2 ? LIGHT : BASE);
    }
    circle(e, 50, 50, 25, false, BASE);
    circle(e, 50, 50, 21.5, false, LIGHT);
    arc(e, 47, 48, 16, -2.45, -0.45, LIGHT);
    arc(e, 52, 53, 18, 0.45, 2.45, SHADE);
    for (let i = 0; i < 13; i += 1) {
      const a = 0.3 + i * 0.43;
      const r = 9 + (i % 4) * 2;
      line(e, 50 + Math.cos(a) * r, 50 + Math.sin(a) * r,
        50 + Math.cos(a) * (r + 2.5), 50 + Math.sin(a) * (r + 2.5), LIGHT);
    }
  }
  add('sun', ['sunshine'], 'space-sky', 1, detailedSun, { layer: 'sky', anchor: 'sky' });

  function flyingBird(e) {
    // A shallow gull-like wing profile reads clearly at scene-scale sizes.
    curve(e, [28, 57, 37, 51, 49, 50, 60, 52, 69, 56, 64, 63, 51, 66, 39, 64, 28, 57], BASE);
    ellipse(e, 72, 50, 6, 5.5, false, BASE);
    polygon(e, [77, 49, 91, 51.5, 78, 54], true, false, BASE);
    circle(e, 73, 48, 1.0, false, BASE);
    // Wings stretch sideways with a slight rise toward the tips.
    curve(e, [48, 54, 38, 44, 27, 39, 14, 42, 25, 47, 39, 55, 49, 60], BASE);
    curve(e, [54, 54, 64, 44, 76, 39, 89, 42, 79, 47, 65, 55, 55, 60], BASE);
    // Flight feathers fan from the shoulders and taper at their ends.
    for (let i = 0; i < 5; i += 1) {
      line(e, 39 - i * 3, 49 - i * 1.4, 20 + i * 2, 43 + i * 1.2, LIGHT);
      line(e, 61 + i * 3, 49 - i * 1.4, 82 - i * 2, 43 + i * 1.2, LIGHT);
    }
    // Tail feathers and breast contour.
    polygon(e, [31, 59, 16, 55, 24, 62, 16, 67, 34, 64], true, false, LIGHT);
    curve(e, [46, 60, 53, 62, 61, 59], LIGHT);
    line(e, 43, 63, 49, 65, SHADE);
  }
  add('bird', ['birds', 'small bird'], 'animals', 1.35, flyingBird, {
    layer: 'sky', anchor: 'sky', plural: 3
  });

})(window.Sketchbook);