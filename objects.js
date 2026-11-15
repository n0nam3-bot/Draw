/* objects.js — shared object registry, recipe interpreter, modifiers and fallback doodles. */
(function (root) {
  'use strict';
  const Sketchbook = root.Sketchbook = root.Sketchbook || {};
  const registry = new Map();
  const aliases = new Map();
  const paper = '#f8f5ee';

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function register(definition) {
    if (!definition || !definition.id || (!definition.draw && !Array.isArray(definition.shapes))) {
      throw new TypeError('An object needs an id and either draw() or shapes[].');
    }
    const def = Object.assign({
      category: 'misc', layer: 'near', anchor: 'ground', aspect: 1,
      color: '#8c8173', plural: 3, aliases: [], anchors: {}
    }, definition);
    def.id = normalize(def.id).replace(/ /g, '-');
    def.aliases = Array.from(new Set([def.id.replace(/-/g, ' '), ...(def.aliases || [])].map(normalize).filter(Boolean)));
    def.aspect = Math.max(0.35, Math.min(2.8, Number(def.aspect) || 1));
    registry.set(def.id, def);
    def.aliases.forEach(function (alias) { aliases.set(alias, def); });
    return def;
  }

  function lookup(word) {
    return aliases.get(normalize(word)) || registry.get(normalize(word).replace(/ /g, '-')) || null;
  }

  function localPoint(x, y, def, originX, originY, scale) {
    return [originX + (x - 50 * def.aspect) * scale, originY + (y - 100) * scale];
  }

  function drawRecipe(engine, def, x, y, scale, options) {
    const originX = x;
    const originY = y;
    const shapes = def.shapes || [];
    const opts = options || {};
    const detailStyles = {
      messy: { alpha: 0.78, width: 1.7, passes: 3, wobble: 0.12 },
      neat: { alpha: 0.58, width: 1.0, passes: 1, wobble: 0.012 },
      detailed: { alpha: 0.76, width: 1.25, passes: 3, wobble: 0.05 },
      minimal: { alpha: 0.52, width: 0.9, passes: 1, wobble: 0.015 }
    };
    const style = detailStyles[opts.detail] || {};
    const strokeOptions = function (custom) { return Object.assign({}, style, custom || {}); };
    engine.setColor(opts.color || null);
    shapes.forEach(function (shape) {
      if (!Array.isArray(shape) || !shape.length) return;
      const kind = shape[0];
      const p = function (lx, ly) { return localPoint(Number(lx), Number(ly), def, originX, originY, scale); };
      if (kind === 'line') {
        const a = p(shape[1], shape[2]);
        const b = p(shape[3], shape[4]);
        engine.sketchLine(a[0], a[1], b[0], b[1], strokeOptions(shape[5]));
      } else if (kind === 'rect') {
        const top = p(shape[1], shape[2]);
        engine.sketchRect(top[0], top[1], Number(shape[3]) * scale, Number(shape[4]) * scale, !!(shape[5] && shape[5].hatch), strokeOptions(shape[5]));
      } else if (kind === 'ellipse') {
        const center = p(shape[1], shape[2]);
        engine.sketchEllipse(center[0], center[1], Math.abs(Number(shape[3]) * scale), Math.abs(Number(shape[4]) * scale), !!(shape[5] && shape[5].hatch), strokeOptions(shape[5]));
      } else if (kind === 'poly') {
        const coordinates = shape[1] || [];
        const points = [];
        for (let i = 0; i < coordinates.length - 1; i += 2) points.push(p(coordinates[i], coordinates[i + 1]));
        engine.sketchPolygon(points, !!shape[2], !!(shape[3] && shape[3].hatch), strokeOptions(shape[3]));
      } else if (kind === 'curve') {
        const coordinates = shape[1] || [];
        const points = [];
        for (let i = 0; i < coordinates.length - 1; i += 2) points.push(p(coordinates[i], coordinates[i + 1]));
        engine.sketchCurve(points, strokeOptions(shape[2]));
      } else if (kind === 'arc') {
        const center = p(shape[1], shape[2]);
        engine.sketchArc(center[0], center[1], Number(shape[3]) * scale, Number(shape[4]), Number(shape[5]), strokeOptions(shape[6]));
      } else if (kind === 'dot') {
        const point = p(shape[1], shape[2]);
        engine.sketchCircle(point[0], point[1], Math.max(1, Number(shape[3]) * scale), false, strokeOptions({ width: 0.8, passes: 1 }));
      } else if (kind === 'scribble') {
        const center = p(shape[1], shape[2]);
        engine.scribble(center[0], center[1], Number(shape[3]) * scale, Number(shape[4]) * scale, Number(shape[5]) * (opts.detail === 'minimal' ? 0.55 : (opts.detail === 'messy' || opts.detail === 'detailed' ? 1.25 : 1)));
      }
    });
    engine.setColor(null);
  }

  function doodle(engine, word, x, y, scale, seed) {
    const label = String(word || 'mystery').slice(0, 22).toUpperCase();
    const random = Sketchbook.rng(seed == null ? Sketchbook.hash(label) : seed);
    const archetypes = ['creature', 'gadget', 'plant', 'vessel', 'blob', 'crystal'];
    const archetype = archetypes[Math.floor(random() * archetypes.length)];
    const width = 58 * scale;
    const height = 65 * scale;
    const left = x - width / 2;
    const top = y - height;
    const line = function (x1, y1, x2, y2) { engine.sketchLine(x1, y1, x2, y2, { alpha: 0.72, width: 1.35 }); };
    const oval = function (cx, cy, rx, ry, hatch) { engine.sketchEllipse(cx, cy, rx, ry, hatch, { alpha: 0.75 }); };
    const cx = x;
    const cy = top + height * 0.53;

    engine.setSeed(seed == null ? Sketchbook.hash(label) : seed);
    if (archetype === 'creature' || archetype === 'blob') {
      oval(cx, cy, width * 0.43, height * 0.37, false);
      oval(cx - width * 0.15, cy - height * 0.12, width * 0.055, width * 0.07, false);
      oval(cx + width * 0.15, cy - height * 0.12, width * 0.055, width * 0.07, false);
      line(cx - width * 0.12, cy + height * 0.11, cx, cy + height * 0.16);
      line(cx, cy + height * 0.16, cx + width * 0.12, cy + height * 0.11);
      for (let i = 0; i < 3; i += 1) line(cx - width * 0.33 + i * width * 0.09, cy - height * 0.31, cx - width * 0.43 + i * width * 0.1, cy - height * 0.45);
      line(cx - width * 0.2, cy + height * 0.31, cx - width * 0.25, cy + height * 0.43);
      line(cx + width * 0.2, cy + height * 0.31, cx + width * 0.25, cy + height * 0.43);
    } else if (archetype === 'gadget') {
      engine.sketchRect(cx - width * 0.32, cy - height * 0.33, width * 0.64, height * 0.62, true);
      engine.sketchCircle(cx, cy - height * 0.06, width * 0.12, false);
      line(cx - width * 0.18, cy + height * 0.18, cx + width * 0.18, cy + height * 0.18);
      line(cx, cy - height * 0.33, cx, cy - height * 0.48);
      engine.sketchCircle(cx, cy - height * 0.5, width * 0.045, false);
    } else if (archetype === 'plant') {
      line(cx, cy + height * 0.35, cx, cy - height * 0.13);
      for (let i = 0; i < 4; i += 1) {
        const side = i % 2 ? 1 : -1;
        const yy = cy + height * 0.2 - Math.floor(i / 2) * height * 0.28;
        engine.sketchEllipse(cx + side * width * 0.16, yy, width * 0.2, height * 0.11, false);
      }
      engine.sketchCircle(cx, cy - height * 0.28, width * 0.14, false);
    } else if (archetype === 'vessel') {
      engine.sketchPolygon([[cx - width * 0.43, cy], [cx + width * 0.43, cy], [cx + width * 0.27, cy + height * 0.28], [cx - width * 0.25, cy + height * 0.28]], true, false);
      line(cx, cy, cx, cy - height * 0.48);
      engine.sketchPolygon([[cx, cy - height * 0.43], [cx + width * 0.32, cy - height * 0.07], [cx, cy - height * 0.07]], true, false);
      line(cx - width * 0.42, cy + height * 0.34, cx + width * 0.42, cy + height * 0.34);
    } else {
      engine.sketchPolygon([[cx, cy - height * 0.48], [cx + width * 0.4, cy - height * 0.06], [cx + width * 0.18, cy + height * 0.35], [cx - width * 0.2, cy + height * 0.35], [cx - width * 0.4, cy - height * 0.06]], true, true);
      line(cx, cy - height * 0.43, cx, cy + height * 0.3);
      line(cx - width * 0.3, cy - height * 0.06, cx + width * 0.3, cy - height * 0.06);
    }
    if (Sketchbook.font) Sketchbook.font.drawText(engine, label, x - Math.min(label.length * 4.2, 56 * scale), y + 9 * scale, Math.max(8, 10 * scale), { maxWidth: 112 * scale, width: 0.9 });
  }

  function drawObject(engine, def, x, y, scale, seed, options) {
    const safeScale = Math.max(0.12, Math.min(5, Number.isFinite(scale) ? scale : 1));
    const opts = options || {};
    try {
      engine.setSeed(seed >>> 0);
      engine.withTransform(x, y, safeScale, Number(opts.rotation) || 0, !!opts.flip, function () {
        if (typeof def.draw === 'function') def.draw(engine, 0, 0, 1, seed >>> 0, opts);
        else drawRecipe(engine, def, 0, 0, 1, opts);
      });
    } catch (error) {
      console.warn('Object drawing failed; using a fallback doodle:', def && def.id, error);
      doodle(engine, (def && def.id) || 'unknown', x, y, safeScale, seed);
    }
  }

  Sketchbook.register = register;
  Sketchbook.objects = registry;
  Sketchbook.lookup = lookup;
  Sketchbook.drawObject = drawObject;
  Sketchbook.doodle = doodle;
  Sketchbook._drawRecipe = drawRecipe;
  Sketchbook._paperColor = paper;
})(window);
