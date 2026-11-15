/* illustration-tools.js — reusable structure, volume, texture and lighting tools.
 * Everything is procedural, deterministic, Canvas 2D only, and offline-safe.
 */
(function (root) {
  'use strict';

  const S = root.Sketchbook;
  if (!S || !S.SketchEngine) throw new Error('Load SketchEngine before illustration-tools.js.');

  const api = {};
  const BASE = { alpha: 0.76, width: 1.15, passes: 2, wobble: 0.035 };
  const LIGHT = { alpha: 0.36, width: 0.72, passes: 1, wobble: 0.025, overshoot: false };
  const DARK = { alpha: 0.82, width: 1.35, passes: 2, wobble: 0.04 };

  function mapPoint(x, y) { return [Number(x) - 50, Number(y) - 100]; }
  function mapPoints(coords) {
    const points = [];
    for (let i = 0; i + 1 < coords.length; i += 2) points.push(mapPoint(coords[i], coords[i + 1]));
    return points;
  }
  function style(options, fallback) { return Object.assign({}, fallback || BASE, options || {}); }

  api.point = mapPoint;
  api.path = function path(engine, coords, options) {
    if (!Array.isArray(coords) || coords.length < 4) return;
    engine.sketchCurve(mapPoints(coords), style(options));
  };
  api.line = function line(engine, x1, y1, x2, y2, options) {
    const a = mapPoint(x1, y1);
    const b = mapPoint(x2, y2);
    engine.sketchLine(a[0], a[1], b[0], b[1], style(options));
  };
  api.ellipse = function ellipse(engine, cx, cy, rx, ry, options) {
    const p = mapPoint(cx, cy);
    engine.sketchEllipse(p[0], p[1], Math.max(0.1, rx), Math.max(0.1, ry), false, style(options));
  };
  api.circle = function circle(engine, cx, cy, radius, options) {
    api.ellipse(engine, cx, cy, radius, radius, options);
  };
  api.shape = function shape(engine, coords, options) {
    const points = mapPoints(coords);
    if (points.length < 3) return;
    engine.sketchPolygon(points, true, false, style(options));
    if (options && options.hatch) api.hatch(engine, coords, options.hatchAngle || 0.8, options.hatchSpacing || 7, options.crossHatch !== false, options.hatchPasses || 1, options.hatchAlpha);
  };
  api.form = function form(engine, coords, options) {
    const raw = mapPoints(coords);
    if (raw.length < 3) return;
    const sampled = [];
    for (let i = 0; i < raw.length; i += 1) {
      const p0 = raw[(i - 1 + raw.length) % raw.length];
      const p1 = raw[i];
      const p2 = raw[(i + 1) % raw.length];
      const p3 = raw[(i + 2) % raw.length];
      const steps = 4;
      for (let step = 0; step < steps; step += 1) {
        const t = step / steps;
        const t2 = t * t;
        const t3 = t2 * t;
        const x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
        const y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
        sampled.push([x, y]);
      }
    }
    const ctx = engine.ctx;
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = engine.paperColor;
    ctx.beginPath();
    ctx.moveTo(sampled[0][0], sampled[0][1]);
    for (let i = 1; i < sampled.length; i += 1) ctx.lineTo(sampled[i][0], sampled[i][1]);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    engine.sketchCurve(sampled.concat([sampled[0]]), style(options));
    if (options && options.hatch) engine.withClipPolygon(sampled, function () { engine.hatch(options.hatchAngle || 0.8, options.hatchSpacing || 7, options.crossHatch !== false); });
  };
  api.hatch = function hatch(engine, coords, angle, spacing, cross, repetitions, alpha) {
    const points = mapPoints(coords);
    if (points.length < 3) return;
    const count = Math.max(1, Math.min(4, Math.floor(repetitions || 1)));
    const xs = points.map(function (p) { return p[0]; });
    const ys = points.map(function (p) { return p[1]; });
    const minX = Math.min.apply(null, xs);
    const maxX = Math.max.apply(null, xs);
    const minY = Math.min.apply(null, ys);
    const maxY = Math.max.apply(null, ys);
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const extent = Math.hypot(maxX - minX, maxY - minY) * 0.72 + 3;
    const step = Math.max(3.2, Number(spacing) || 6);
    const baseAngle = Number.isFinite(angle) ? angle : 0.8;
    const opacity = Math.max(0.08, Math.min(0.48, Number.isFinite(alpha) ? alpha : 0.22));
    engine.withClipPolygon(points, function () {
      for (let pass = 0; pass < count; pass += 1) {
        const directions = cross ? [baseAngle + pass * 0.08, baseAngle + Math.PI / 2 + pass * 0.08] : [baseAngle + pass * 0.08];
        directions.forEach(function (direction) {
          const dx = Math.cos(direction);
          const dy = Math.sin(direction);
          const nx = -dy;
          const ny = dx;
          for (let offset = -extent; offset <= extent; offset += step) {
            const sx = cx + nx * offset - dx * extent;
            const sy = cy + ny * offset - dy * extent;
            const ex = cx + nx * offset + dx * extent;
            const ey = cy + ny * offset + dy * extent;
            engine.sketchLine(sx, sy, ex, ey, { alpha: opacity, width: 0.48 + pass * 0.06, passes: 1, wobble: 0.012, overshoot: false });
          }
        });
      }
    });
  };
  api.volume = function volume(engine, cx, cy, rx, ry, options) {
    const opts = options || {};
    if (opts.outline !== false) api.ellipse(engine, cx, cy, rx, ry, opts.outline || BASE);
    const left = opts.shadowSide === 'left';
    const start = left ? Math.PI * 0.5 : -Math.PI * 0.5;
    const end = left ? Math.PI * 1.5 : Math.PI * 0.5;
    const coords = [cx, cy];
    const steps = 18;
    for (let i = 0; i <= steps; i += 1) {
      const a = start + (end - start) * i / steps;
      coords.push(cx + Math.cos(a) * rx * 0.96, cy + Math.sin(a) * ry * 0.96);
    }
    coords.push(cx, cy);
    api.hatch(engine, coords, opts.angle || 0.7, opts.spacing || 6, opts.cross !== false, opts.passes || 1, opts.alpha || 0.22);
    if (opts.contour) {
      for (let i = 0; i < 3; i += 1) {
        const yy = cy - ry * 0.3 + i * ry * 0.28;
        api.path(engine, [cx - rx * 0.72, yy, cx - rx * 0.25, yy + ry * 0.13, cx + rx * 0.25, yy + ry * 0.12, cx + rx * 0.72, yy - ry * 0.04], LIGHT);
      }
    }
  };

  function samplePolyline(points, distance) {
    const segments = [];
    let total = 0;
    for (let i = 0; i < points.length - 1; i += 1) {
      const a = points[i];
      const b = points[i + 1];
      const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
      segments.push({ a, b, length, start: total });
      total += length;
    }
    if (!total) return null;
    const target = Math.max(0, Math.min(total, distance));
    const segment = segments.find(function (part) { return target <= part.start + part.length; }) || segments[segments.length - 1];
    const t = segment.length ? (target - segment.start) / segment.length : 0;
    const dx = segment.b[0] - segment.a[0];
    const dy = segment.b[1] - segment.a[1];
    const length = Math.hypot(dx, dy) || 1;
    return {
      x: segment.a[0] + dx * t,
      y: segment.a[1] + dy * t,
      nx: -dy / length,
      ny: dx / length,
      tx: dx / length,
      ty: dy / length
    };
  }

  api.textureStroke = function textureStroke(engine, coords, count, options) {
    const opts = options || {};
    const points = [];
    for (let i = 0; i + 1 < coords.length; i += 2) points.push([coords[i], coords[i + 1]]);
    if (points.length < 2) return;
    const local = points.map(function (p) { return mapPoint(p[0], p[1]); });
    const length = local.slice(1).reduce(function (sum, p, index) { return sum + Math.hypot(p[0] - local[index][0], p[1] - local[index][1]); }, 0);
    const total = Math.max(1, Math.min(220, Math.floor(count || length / 2)));
    const random = engine.random;
    for (let i = 0; i < total; i += 1) {
      const at = samplePolyline(local, (i + random() * 0.8) / total * length);
      if (!at) continue;
      const spread = Number(opts.spread) || 2.8;
      const offset = (random() - 0.5) * spread;
      const hairLength = (Number(opts.minLength) || 2.2) + random() * ((Number(opts.maxLength) || 5.5) - (Number(opts.minLength) || 2.2));
      const direction = Number(opts.direction) || 1;
      const sx = at.x + at.nx * offset;
      const sy = at.y + at.ny * offset;
      const ex = sx + at.tx * hairLength * 0.42 * direction + at.nx * (random() - 0.5) * 1.5;
      const ey = sy + at.ty * hairLength * 0.42 * direction + at.ny * hairLength * 0.88;
      engine.sketchLine(sx, sy, ex, ey, style({ alpha: 0.2 + random() * 0.24, width: 0.42 + random() * 0.45, passes: 1, wobble: 0.018, overshoot: false }, LIGHT));
    }
  };

  api.furPatch = function furPatch(engine, coords, count, options) {
    api.shape(engine, coords, { alpha: 0.55, width: 0.85, passes: 1, wobble: 0.025 });
    api.hatch(engine, coords, 0.8, 5.5, true, 1, 0.18);
    api.textureStroke(engine, options && options.flow ? options.flow : coords, count || 30, options || {});
  };

  api.grassTuft = function grassTuft(engine, x, y, height, options) {
    const opts = options || {};
    const count = Math.max(3, Math.min(13, Math.floor(opts.blades || 7)));
    const random = engine.random;
    for (let i = 0; i < count; i += 1) {
      const side = (i - (count - 1) / 2) / Math.max(1, count - 1);
      const lean = side * height * 0.6 + (random() - 0.5) * height * 0.16;
      const tipX = x + lean;
      const tipY = y - height * (0.45 + random() * 0.55);
      api.path(engine, [x + side * 1.8, y, x + side * 2.2 + lean * 0.28, y - height * 0.38, tipX, tipY], {
        alpha: 0.36 + random() * 0.2, width: 0.62 + random() * 0.28, passes: 1, wobble: 0.022
      });
    }
  };

  api.foliage = function foliage(engine, cx, cy, rx, ry, clusters, options) {
    const opts = options || {};
    const random = engine.random;
    const total = Math.max(5, Math.min(90, Math.floor(clusters || 30)));
    for (let i = 0; i < total; i += 1) {
      const angle = random() * Math.PI * 2;
      const radius = Math.sqrt(random());
      const x = cx + Math.cos(angle) * rx * radius;
      const y = cy + Math.sin(angle) * ry * radius;
      const size = 1.0 + random() * 2.2;
      api.path(engine, [x - size, y + size * 0.25, x - size * 0.25, y - size, x + size, y - size * 0.1], {
        alpha: 0.28 + random() * 0.22, width: 0.6, passes: 1, wobble: 0.025
      });
    }
    if (opts.shade) {
      const coords = [cx - rx, cy, cx - rx * 0.7, cy - ry, cx + rx * 0.6, cy - ry * 0.88, cx + rx, cy, cx + rx * 0.7, cy + ry, cx - rx * 0.8, cy + ry];
      api.hatch(engine, coords, 0.75, 6, true, 1, 0.16);
    }
  };

  api.shadow = function shadow(engine, x, y, rx, ry, density) {
    const p = mapPoint(x, y);
    engine.scribble(p[0], p[1], Math.max(1, rx), Math.max(1, ry), Math.max(1, Math.min(180, density || 30)));
  };
  api.light = Object.freeze({ base: BASE, light: LIGHT, dark: DARK });
  S.illustration = Object.freeze(api);
})(window);
