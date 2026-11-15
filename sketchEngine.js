/* sketchEngine.js — deterministic pencil drawing primitives for Text-to-Sketch. */
(function (root) {
  'use strict';

  const Sketchbook = root.Sketchbook = root.Sketchbook || {};

  Sketchbook.hash = function hash(value) {
    const text = String(value == null ? '' : value);
    let h = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };

  Sketchbook.rng = function mulberry32(seed) {
    let state = seed >>> 0;
    return function nextRandom() {
      state = (state + 0x6D2B79F5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  function finite(value, fallback) {
    return Number.isFinite(value) ? value : (fallback || 0);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function SketchEngine(context, width, height, seed, options) {
    if (!context) throw new Error('SketchEngine requires a Canvas 2D context.');
    this.ctx = context;
    this.width = Math.max(1, finite(width, 800));
    this.height = Math.max(1, finite(height, 500));
    this.seed = (seed == null ? 1 : seed) >>> 0;
    this.random = Sketchbook.rng(this.seed);
    this.options = options || {};
    this.currentColor = null;
    this.paperColor = '#f8f5ee';
    this.strokeColor = '#383632';
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.globalCompositeOperation = 'multiply';
  }

  SketchEngine.prototype.setSeed = function setSeed(seed) {
    this.seed = seed >>> 0;
    this.random = Sketchbook.rng(this.seed);
  };

  SketchEngine.prototype.setColor = function setColor(color) {
    this.currentColor = color || null;
  };

  SketchEngine.prototype.clear = function clear() {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = this.paperColor;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();
  };

  SketchEngine.prototype._random = function randomBetween(min, max) {
    return min + (max - min) * this.random();
  };

  SketchEngine.prototype._stroke = function stroke(points, options) {
    if (!Array.isArray(points) || points.length < 2) return;
    const opts = options || {};
    const ctx = this.ctx;
    const color = opts.color || this.strokeColor;
    const baseWidth = clamp(finite(opts.width, 1.35), 0.35, 5);
    const alpha = clamp(finite(opts.alpha, 0.66), 0.08, 1);
    const wobbleAmount = clamp(finite(opts.wobble, 0.07) * 5, 0.03, 0.85);
    const passes = clamp(Math.floor(finite(opts.passes, 2)), 1, 3);

    for (let pass = 0; pass < passes; pass += 1) {
      const offsetX = pass === 0 ? 0 : this._random(-0.42, 0.42);
      const offsetY = pass === 0 ? 0 : this._random(-0.42, 0.42);
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.strokeStyle = color;
      ctx.globalAlpha = clamp(alpha * (pass === 0 ? 1 : this._random(0.42, 0.7)), 0.05, 1);
      ctx.lineWidth = baseWidth * (pass === 0 ? 1 : this._random(0.48, 0.76));
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(points[0][0] + offsetX, points[0][1] + offsetY);

      for (let i = 1; i < points.length; i += 1) {
        const a = points[i - 1];
        const b = points[i];
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const distance = Math.sqrt(dx * dx + dy * dy);
        const steps = clamp(Math.ceil(distance / 17), 1, 14);
        for (let step = 1; step <= steps; step += 1) {
          const t = step / steps;
          const wobble = step === steps ? 0 : Math.sin((t * 3.1 + i) * 2.3) * wobbleAmount;
          const jitter = step === steps ? 0 : this._random(-0.22, 0.22);
          const px = a[0] + dx * t + offsetX + wobble + jitter;
          const py = a[1] + dy * t + offsetY - wobble * 0.55 + jitter;
          ctx.lineTo(px, py);
        }
        // A tiny overrun at corners gives the line a hand-drawn pencil finish.
        if (i < points.length - 1 && opts.overshoot !== false) {
          const next = points[i + 1];
          const ndx = next[0] - b[0];
          const ndy = next[1] - b[1];
          const length = Math.sqrt(ndx * ndx + ndy * ndy) || 1;
          ctx.lineTo(b[0] + offsetX + (ndx / length) * 0.55, b[1] + offsetY + (ndy / length) * 0.55);
        }
      }
      ctx.stroke();
      ctx.restore();
    }
  };

  SketchEngine.prototype.sketchLine = function sketchLine(x1, y1, x2, y2, options) {
    const values = [x1, y1, x2, y2].map(function (value) { return finite(value, 0); });
    this._stroke([[values[0], values[1]], [values[2], values[3]]], options);
  };

  SketchEngine.prototype.sketchCurve = function sketchCurve(points, options) {
    if (!Array.isArray(points) || points.length < 2) return;
    const sampled = [];
    for (let i = 0; i < points.length - 1; i += 1) {
      const current = points[i];
      const next = points[i + 1];
      const midpoint = [(current[0] + next[0]) / 2, (current[1] + next[1]) / 2];
      if (i === 0) sampled.push([finite(current[0]), finite(current[1])]);
      sampled.push(midpoint);
    }
    sampled.push(points[points.length - 1].map(function (v) { return finite(v); }));
    this._stroke(sampled, options);
  };

  SketchEngine.prototype.sketchPolygon = function sketchPolygon(points, closed, fillHatch, options) {
    if (!Array.isArray(points) || points.length < 2) return;
    const clean = points.map(function (point) { return [finite(point[0]), finite(point[1])]; });
    const ctx = this.ctx;
    if (closed) {
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = this.paperColor;
      ctx.beginPath();
      ctx.moveTo(clean[0][0], clean[0][1]);
      for (let i = 1; i < clean.length; i += 1) ctx.lineTo(clean[i][0], clean[i][1]);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    const outline = clean.slice();
    if (closed) outline.push(clean[0]);
    this._stroke(outline, options || {});
    if (closed && fillHatch) this.withClipPolygon(clean, () => this.hatch(0.75, 7, true));
  };

  SketchEngine.prototype.sketchRect = function sketchRect(x, y, width, height, fillHatch, options) {
    const w = finite(width);
    const h = finite(height);
    this.sketchPolygon([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], true, false, options);
    if (fillHatch) this.withClipRect(x, y, w, h, () => this.hatch(0.8, 7, true));
  };

  SketchEngine.prototype.sketchEllipse = function sketchEllipse(cx, cy, rx, ry, fillHatch, options) {
    const points = [];
    const segments = 28;
    const wobble = finite((options || {}).wobble, 0.035);
    for (let i = 0; i <= segments; i += 1) {
      const angle = (Math.PI * 2 * i) / segments;
      const organic = 1 + Math.sin(angle * 3 + this.seed % 17) * wobble + this._random(-wobble * 0.45, wobble * 0.45);
      points.push([cx + Math.cos(angle) * rx * organic, cy + Math.sin(angle) * ry * organic]);
    }
    this.sketchPolygon(points, true, false, options);
    if (fillHatch) this.withClipPolygon(points, () => this.hatch(0.78, 7, true));
  };

  SketchEngine.prototype.sketchCircle = function sketchCircle(cx, cy, radius, fillHatch, options) {
    this.sketchEllipse(cx, cy, radius, radius, fillHatch, options);
  };

  SketchEngine.prototype.sketchArc = function sketchArc(cx, cy, radius, start, end, options) {
    const points = [];
    const span = end - start;
    const steps = clamp(Math.ceil(Math.abs(span) * Math.max(radius, 1) / 12), 5, 40);
    for (let i = 0; i <= steps; i += 1) {
      const angle = start + span * i / steps;
      points.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
    }
    this._stroke(points, options || {});
  };

  SketchEngine.prototype.withClipRect = function withClipRect(x, y, width, height, callback) {
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();
    callback();
    ctx.restore();
  };

  SketchEngine.prototype.withClipPolygon = function withClipPolygon(points, callback) {
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath();
    ctx.clip();
    callback();
    ctx.restore();
  };

  SketchEngine.prototype.hatch = function hatch(angle, spacing, cross) {
    const ctx = this.ctx;
    const extent = Math.max(this.width, this.height) * 0.72;
    const requestedStep = clamp(finite(spacing, 7), 3, 24);
    const step = Math.max(requestedStep, (extent * 2) / 72);
    const direction = finite(angle, 0.8);
    const color = this.currentColor || '#77716a';
    const drawSet = (rotation) => {
      const rux = Math.cos(rotation);
      const ruy = Math.sin(rotation);
      const rnx = -ruy;
      const rny = rux;
      for (let offset = -extent; offset <= extent; offset += step) {
        const startX = this.width / 2 + rnx * offset - rux * extent;
        const startY = this.height / 2 + rny * offset - ruy * extent;
        const endX = this.width / 2 + rnx * offset + rux * extent;
        const endY = this.height / 2 + rny * offset + ruy * extent;
        this.sketchLine(startX, startY, endX, endY, { color, alpha: 0.22, width: 0.62, passes: 1, overshoot: false });
      }
    };
    drawSet(direction);
    if (cross) drawSet(direction + Math.PI / 2);
  };

  SketchEngine.prototype.scribble = function scribble(cx, cy, rx, ry, density) {
    const count = clamp(Math.floor(finite(density, 18)), 1, 180);
    for (let i = 0; i < count; i += 1) {
      const angle = this._random(0, Math.PI * 2);
      const radius = Math.sqrt(this.random());
      const x = cx + Math.cos(angle) * rx * radius;
      const y = cy + Math.sin(angle) * ry * radius;
      const length = this._random(2, 8);
      this.sketchLine(x, y, x + Math.cos(angle + 1.1) * length, y + Math.sin(angle + 1.1) * length, {
        color: this.currentColor || this.strokeColor, alpha: this._random(0.18, 0.38), width: this._random(0.45, 0.9), passes: 1, overshoot: false
      });
    }
  };

  SketchEngine.prototype.stipple = function stipple(cx, cy, rx, ry, count) {
    const ctx = this.ctx;
    const total = clamp(Math.floor(finite(count, 30)), 1, 240);
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = this.currentColor || '#514d47';
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < total; i += 1) {
      const angle = this._random(0, Math.PI * 2);
      const r = Math.sqrt(this.random());
      ctx.beginPath();
      ctx.arc(cx + Math.cos(angle) * rx * r, cy + Math.sin(angle) * ry * r, this._random(0.35, 1.1), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  SketchEngine.prototype.withTransform = function withTransform(x, y, scale, rotation, flip, callback) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(finite(x), finite(y));
    ctx.rotate(finite(rotation));
    ctx.scale(finite(scale, 1) * (flip ? -1 : 1), finite(scale, 1));
    callback();
    ctx.restore();
  };

  SketchEngine.prototype.applyPaperTexture = function applyPaperTexture(overlay) {
    const ctx = this.ctx;
    ctx.save();
    if (!overlay) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = this.paperColor;
      ctx.fillRect(0, 0, this.width, this.height);
    }
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = overlay ? 0.12 : 0.24;
    const pattern = SketchEngine.getPaperPattern();
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, this.width, this.height);
    }
    ctx.restore();
    ctx.globalCompositeOperation = 'multiply';
  };

  SketchEngine.getPaperPattern = function getPaperPattern() {
    if (SketchEngine.paperPattern !== undefined) return SketchEngine.paperPattern;
    SketchEngine.paperPattern = null;
    if (!root.document || !root.document.createElement) return null;
    const tile = root.document.createElement('canvas');
    tile.width = 256;
    tile.height = 256;
    const ctx = tile.getContext('2d');
    if (!ctx) return null;
    const random = Sketchbook.rng(0x51A7C4);
    ctx.fillStyle = '#b9b1a4';
    for (let i = 0; i < 1550; i += 1) {
      const x = random() * 256;
      const y = random() * 256;
      const radius = 0.2 + random() * 0.65;
      ctx.globalAlpha = 0.08 + random() * 0.15;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = '#a9a092';
    for (let i = 0; i < 24; i += 1) {
      const x = random() * 256;
      const y = random() * 256;
      ctx.globalAlpha = 0.09;
      ctx.lineWidth = 0.45;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + random() * 12 + 2, y + random() * 1.2 - 0.6);
      ctx.stroke();
    }
    SketchEngine.paperPattern = ctx.createPattern(tile, 'repeat');
    return SketchEngine.paperPattern;
  };

  Sketchbook.SketchEngine = SketchEngine;
})(window);
