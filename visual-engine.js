/* visual-engine.js — constructive illustration primitives for the Sketchbook artist.
 * No model, dataset, network request or external runtime. All randomness is seeded.
 * Coordinates are authored on a 0..100 subject grid (top-left origin) and are
 * mapped into the current SketchEngine object transform.
 */
(function (root) {
  'use strict';

  const S = root.Sketchbook;
  if (!S || !S.SketchEngine) throw new Error('Load SketchEngine before visual-engine.js.');

  const V = {};
  const DEFAULT_INK = '#393632';
  const DEFAULT_PAPER = '#f8f5ee';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const finite = (v, fallback) => Number.isFinite(v) ? v : fallback;
  const map = (x, y) => [finite(x, 50) - 50, finite(y, 100) - 100];

  function validatePath(commands) {
    if (!Array.isArray(commands)) throw new TypeError('A visual path must be an array of commands.');
    const valid = [];
    commands.forEach(function (command) {
      if (!Array.isArray(command) || !command.length) return;
      const op = String(command[0]).toUpperCase();
      const expected = { M: 3, L: 3, Q: 5, C: 7, Z: 1 }[op];
      if (!expected || command.length !== expected) return;
      const numeric = command.slice(1).every(Number.isFinite);
      if (numeric) valid.push([op].concat(command.slice(1)));
    });
    if (!valid.length || valid[0][0] !== 'M') throw new TypeError('A visual path must begin with M and contain valid coordinates.');
    return valid;
  }

  function trace(ctx, commands) {
    const ops = validatePath(commands);
    ctx.beginPath();
    ops.forEach(function (op) {
      if (op[0] === 'M') { const p = map(op[1], op[2]); ctx.moveTo(p[0], p[1]); }
      else if (op[0] === 'L') { const p = map(op[1], op[2]); ctx.lineTo(p[0], p[1]); }
      else if (op[0] === 'Q') {
        const c = map(op[1], op[2]); const p = map(op[3], op[4]);
        ctx.quadraticCurveTo(c[0], c[1], p[0], p[1]);
      } else if (op[0] === 'C') {
        const a = map(op[1], op[2]); const b = map(op[3], op[4]); const p = map(op[5], op[6]);
        ctx.bezierCurveTo(a[0], a[1], b[0], b[1], p[0], p[1]);
      } else if (op[0] === 'Z') ctx.closePath();
    });
    return ops;
  }

  function flatten(commands, curveSteps) {
    const ops = validatePath(commands);
    const steps = Math.max(4, Math.min(24, Math.floor(curveSteps || 10)));
    const points = [];
    let cursor = [0, 0];
    let start = [0, 0];
    ops.forEach(function (op) {
      if (op[0] === 'M') {
        cursor = [op[1], op[2]]; start = cursor.slice(); points.push(map(cursor[0], cursor[1]));
      } else if (op[0] === 'L') {
        cursor = [op[1], op[2]]; points.push(map(cursor[0], cursor[1]));
      } else if (op[0] === 'Q') {
        const p0 = cursor.slice(); const p1 = [op[1], op[2]]; const p2 = [op[3], op[4]];
        for (let i = 1; i <= steps; i += 1) {
          const t = i / steps; const u = 1 - t;
          points.push(map(u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]));
        }
        cursor = p2;
      } else if (op[0] === 'C') {
        const p0 = cursor.slice(); const p1 = [op[1], op[2]]; const p2 = [op[3], op[4]]; const p3 = [op[5], op[6]];
        for (let i = 1; i <= steps; i += 1) {
          const t = i / steps; const u = 1 - t;
          const x = u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0];
          const y = u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1];
          points.push(map(x, y));
        }
        cursor = p3;
      } else if (op[0] === 'Z') {
        points.push(map(start[0], start[1])); cursor = start.slice();
      }
    });
    return points;
  }

  function bounds(commands) {
    const points = flatten(commands, 6);
    const xs = points.map(p => p[0]); const ys = points.map(p => p[1]);
    return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
  }

  V.path = function drawPath(engine, commands, options) {
    const opts = options || {};
    const points = flatten(commands, opts.curveSteps || 12);
    if (points.length < 2) return;
    const closed = validatePath(commands).some(op => op[0] === 'Z');
    if (closed && opts.fill) V.fill(engine, commands, opts);
    const line = points.slice();
    if (closed && (line[0][0] !== line[line.length - 1][0] || line[0][1] !== line[line.length - 1][1])) line.push(line[0]);
    engine.sketchCurve(line, {
      color: opts.ink || DEFAULT_INK,
      alpha: finite(opts.alpha, 0.76),
      width: finite(opts.width, 1.0),
      passes: clamp(Math.floor(finite(opts.passes, 2)), 1, 3),
      wobble: finite(opts.wobble, 0.025),
      overshoot: opts.overshoot !== false
    });
  };

  // A pressure-tapered strand is the basic mark used for fur, feather barbs,
  // fibers and fine pencil accents. Each segment narrows toward the tip.
  V.strandLocal = function taperedStrandLocal(engine, points, options) {
    const opts = options || {};
    if (!Array.isArray(points) || points.length < 2) return;
    const width = clamp(finite(opts.width, 0.55), 0.18, 3.2);
    const alpha = clamp(finite(opts.alpha, 0.2), 0.04, 0.9);
    const taper = clamp(finite(opts.taper, 0.56), 0.12, 0.95);
    const segments = points.length - 1;
    for (let i = 0; i < segments; i += 1) {
      const t = (i + 0.5) / segments;
      engine.sketchLine(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], {
        color: opts.ink || DEFAULT_INK,
        alpha: alpha * (1 - t * 0.22),
        width: width * (1 - t * (1 - taper)),
        passes: 1,
        wobble: 0.006,
        overshoot: false
      });
    }
  };

  V.strand = function taperedStrand(engine, points, options) {
    if (!Array.isArray(points)) return;
    V.strandLocal(engine, points.map(point => map(point[0], point[1])), options);
  };

  // Lighting planes are authored shapes clipped to a parent form. This makes
  // the same tonal treatment reusable across anatomy, products and scenery.
  V.lightPlanes = function lightPlanes(engine, parentPath, planes) {
    const list = Array.isArray(planes) ? planes : [];
    V.clip(engine, parentPath, function () {
      list.forEach(function (plane) {
        if (!plane || !Array.isArray(plane.path)) return;
        if (plane.fill) V.fill(engine, plane.path, { fill: plane.fill, opacity: finite(plane.opacity, 0.18), outline: false });
        if (plane.gradient) V.fill(engine, plane.path, { gradient: plane.gradient, opacity: finite(plane.opacity, 0.2), outline: false });
        if (plane.hatch) V.hatch(engine, plane.path, plane.hatch);
      });
    });
  };

  V.fill = function fillRegion(engine, commands, options) {
    const opts = options || {};
    const ctx = engine.ctx;
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = clamp(finite(opts.opacity, 1), 0, 1);
    trace(ctx, commands);
    if (opts.gradient && typeof ctx.createLinearGradient === 'function') {
      const gradient = ctx.createLinearGradient(-50, -100, 50, 0);
      const stops = opts.gradient;
      stops.forEach(stop => gradient.addColorStop(clamp(stop[0], 0, 1), stop[1]));
      ctx.fillStyle = gradient;
    } else ctx.fillStyle = opts.fill || DEFAULT_PAPER;
    ctx.fill();
    ctx.restore();
    if (opts.outline !== false) {
      const points = flatten(commands, opts.curveSteps || 12);
      if (points.length > 2) {
        if (points[0][0] !== points[points.length - 1][0] || points[0][1] !== points[points.length - 1][1]) points.push(points[0]);
        engine.sketchCurve(points, { color: opts.ink || DEFAULT_INK, alpha: finite(opts.alpha, 0.8), width: finite(opts.width, 1.05), passes: clamp(Math.floor(finite(opts.passes, 2)), 1, 3), wobble: finite(opts.wobble, 0.024) });
      }
    }
  };

  V.clip = function withRegionClip(engine, commands, callback) {
    const ctx = engine.ctx;
    ctx.save();
    trace(ctx, commands);
    ctx.clip();
    try { callback(); } finally { ctx.restore(); }
  };

  V.hatch = function hatchRegion(engine, commands, options) {
    const opts = options || {};
    const b = bounds(commands);
    const angle = finite(opts.angle, 0.82);
    const spacing = clamp(finite(opts.spacing, 3.8), 1.5, 18);
    const cross = !!opts.cross;
    const directions = cross ? [angle, angle + Math.PI / 2] : [angle];
    V.clip(engine, commands, function () {
      directions.forEach(function (direction) {
        const dx = Math.cos(direction); const dy = Math.sin(direction);
        const nx = -dy; const ny = dx;
        const extent = Math.hypot(b.maxX - b.minX, b.maxY - b.minY) * 0.8 + 4;
        const cx = (b.minX + b.maxX) / 2; const cy = (b.minY + b.maxY) / 2;
        for (let d = -extent; d <= extent; d += spacing) {
          const ox = cx + nx * d; const oy = cy + ny * d;
          engine.sketchLine(ox - dx * extent, oy - dy * extent, ox + dx * extent, oy + dy * extent, {
            color: opts.ink || DEFAULT_INK, alpha: finite(opts.alpha, 0.16), width: finite(opts.width, 0.48), passes: 1, wobble: 0.009, overshoot: false
          });
        }
      });
    });
  };

  V.texture = function textureRegion(engine, commands, options) {
    const opts = options || {};
    const b = bounds(commands);
    const count = clamp(Math.floor(finite(opts.count, 90)), 1, 650);
    const angle = finite(opts.angle, 0.75);
    const baseLength = clamp(finite(opts.length, 3.8), 0.5, 16);
    const spread = clamp(finite(opts.spread, 4), 0.2, 24);
    const random = engine.random;
    V.clip(engine, commands, function () {
      for (let i = 0; i < count; i += 1) {
        const x = b.minX + random() * (b.maxX - b.minX);
        const y = b.minY + random() * (b.maxY - b.minY);
        const drift = (random() - 0.5) * spread;
        const length = baseLength * (0.45 + random() * 1.1);
        const a = angle + (random() - 0.5) * finite(opts.angleJitter, 0.65);
        const dx = Math.cos(a) * length;
        const dy = Math.sin(a) * length;
        const mid = [x + dx * 0.52 - Math.sin(a) * drift, y + dy * 0.52 + Math.cos(a) * drift];
        V.strandLocal(engine, [[x, y], mid, [x + dx, y + dy]], {
          ink: opts.ink || DEFAULT_INK,
          alpha: finite(opts.alpha, 0.22) * (0.55 + random() * 0.8),
          width: finite(opts.width, 0.48) * (0.65 + random() * 0.8),
          taper: finite(opts.taper, 0.52)
        });
      }
    });
  };

  V.volume = function volume(engine, commands, options) {
    const opts = options || {};
    V.fill(engine, commands, {
      gradient: opts.gradient || [[0, '#f7f4ec'], [0.48, '#d9d3c8'], [1, '#918a82']],
      opacity: finite(opts.opacity, 1), outline: opts.outline !== false,
      ink: opts.ink, alpha: opts.alpha, width: opts.width, passes: opts.passes
    });
    if (opts.shadow) V.hatch(engine, commands, { angle: opts.angle || 0.78, spacing: opts.spacing || 4.5, cross: !!opts.cross, alpha: opts.shadowAlpha || 0.18 });
    if (opts.texture) V.texture(engine, commands, opts.texture);
  };

  V.anatomicalForm = function anatomicalForm(engine, commands, options) {
    const opts = options || {};
    V.volume(engine, commands, {
      gradient: opts.gradient || [[0, '#f5f1e8'], [0.42, '#d8d2c8'], [1, '#89837c']],
      opacity: finite(opts.opacity, 1),
      outline: opts.outline !== false,
      ink: opts.ink || DEFAULT_INK,
      alpha: finite(opts.alpha, 0.72),
      width: finite(opts.width, 0.82),
      passes: clamp(Math.floor(finite(opts.passes, 1)), 1, 2)
    });
    if (opts.planes) V.lightPlanes(engine, commands, opts.planes);
    if (opts.texture) V.material[opts.material || 'fur'](engine, commands, opts.texture);
    return commands;
  };

  V.limb = function taperedLimb(engine, start, end, startRadius, endRadius, options) {
    const dx = end[0] - start[0]; const dy = end[1] - start[1];
    const length = Math.hypot(dx, dy) || 1;
    const nx = -dy / length; const ny = dx / length;
    const r0 = clamp(finite(startRadius, 7), 0.5, 24);
    const r1 = clamp(finite(endRadius, 3), 0.4, 20);
    const shape = [
      ['M', start[0] + nx * r0, start[1] + ny * r0],
      ['Q', start[0] + dx * 0.2 + nx * (r0 + r1) * 0.7, start[1] + dy * 0.2 + ny * (r0 + r1) * 0.7, end[0] + nx * r1, end[1] + ny * r1],
      ['Q', end[0] + dx * 0.05, end[1] + dy * 0.05, end[0] - nx * r1, end[1] - ny * r1],
      ['Q', start[0] + dx * 0.7 - nx * (r0 + r1) * 0.7, start[1] + dy * 0.7 - ny * (r0 + r1) * 0.7, start[0] - nx * r0, start[1] - ny * r0],
      ['Q', start[0] - dx * 0.12, start[1] - dy * 0.12, start[0] + nx * r0, start[1] + ny * r0], ['Z']
    ];
    V.volume(engine, shape, Object.assign({ shadow: true, spacing: 5.2 }, options || {}));
    return shape;
  };

  V.ellipse = function ellipse(engine, cx, cy, rx, ry, options) {
    const pts = [];
    const n = 20;
    for (let i = 0; i <= n; i += 1) {
      const a = Math.PI * 2 * i / n;
      pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
    }
    const commands = [['M', pts[0][0], pts[0][1]]].concat(pts.slice(1).map(p => ['L', p[0], p[1]]), [['Z']]);
    V.volume(engine, commands, options || {});
    return commands;
  };

  V.makeRig = function makeRig(joints, bones) {
    const cleanJoints = {};
    Object.keys(joints || {}).forEach(function (name) {
      const p = joints[name];
      if (Array.isArray(p) && Number.isFinite(p[0]) && Number.isFinite(p[1])) cleanJoints[name] = [p[0], p[1]];
    });
    const cleanBones = (bones || []).filter(function (bone) {
      return bone && cleanJoints[bone.from] && cleanJoints[bone.to];
    }).map(function (bone) {
      return { from: bone.from, to: bone.to, radius: clamp(finite(bone.radius, 3), 0.5, 20), tipRadius: clamp(finite(bone.tipRadius, 1.8), 0.4, 16), group: bone.group || 'limb' };
    });
    return { joints: cleanJoints, bones: cleanBones };
  };

  V.solveTwoBone = function solveTwoBone(start, end, lengthA, lengthB, bend) {
    const dx = end[0] - start[0]; const dy = end[1] - start[1];
    const distance = Math.max(0.001, Math.hypot(dx, dy));
    const a = Math.max(0.001, finite(lengthA, 1));
    const b = Math.max(0.001, finite(lengthB, 1));
    const d = clamp(distance, Math.abs(a - b) + 0.001, a + b - 0.001);
    const along = (a * a - b * b + d * d) / (2 * d);
    const height = Math.sqrt(Math.max(0, a * a - along * along));
    const ux = dx / distance; const uy = dy / distance;
    const sign = bend === -1 ? -1 : 1;
    return [start[0] + ux * along - uy * height * sign, start[1] + uy * along + ux * height * sign];
  };

  V.poseRig = function poseRig(rig, pose) {
    const joints = {};
    Object.keys(rig.joints).forEach(name => { joints[name] = rig.joints[name].slice(); });
    Object.keys(pose || {}).forEach(function (name) {
      if (joints[name] && Array.isArray(pose[name])) joints[name] = [finite(pose[name][0], joints[name][0]), finite(pose[name][1], joints[name][1])];
    });
    return { joints, bones: rig.bones.slice() };
  };

  V.drawRig = function drawRig(engine, rig, options) {
    const opts = options || {};
    rig.bones.forEach(function (bone) {
      V.limb(engine, rig.joints[bone.from], rig.joints[bone.to], bone.radius, bone.tipRadius, {
        gradient: opts.gradient || [[0, '#f2eee6'], [0.52, '#d1cbc0'], [1, '#8e877f']],
        shadow: opts.shade !== false, spacing: 5.8, alpha: 0.72
      });
    });
  };

  V.material = {
    fur: function (engine, region, options) {
      const opts = Object.assign({ count: 130, angle: 0.72, angleJitter: 0.72, length: 3.1, spread: 2.8, alpha: 0.24 }, options || {});
      V.texture(engine, region, opts);
    },
    feather: function (engine, region, options) {
      const opts = options || {};
      V.hatch(engine, region, { angle: finite(opts.angle, 1.05), spacing: finite(opts.spacing, 4.2), alpha: finite(opts.alpha, 0.22) });
      V.texture(engine, region, { count: opts.count || 90, angle: opts.angle || 1.05, angleJitter: 0.28, length: 4.2, spread: 2.5, alpha: 0.2 });
    },
    scales: function (engine, region, options) {
      const opts = options || {}; const b = bounds(region); const spacing = clamp(finite(opts.spacing, 4), 2, 12);
      V.clip(engine, region, function () {
        for (let y = b.minY + 3; y < b.maxY; y += spacing) {
          const offset = (Math.round(y / spacing) % 2) * spacing * 0.5;
          for (let x = b.minX + offset; x < b.maxX; x += spacing) {
            engine.sketchCurve([[x - spacing * 0.45, y], [x, y - spacing * 0.3], [x + spacing * 0.45, y]], { alpha: finite(opts.alpha, 0.22), width: 0.48, passes: 1, wobble: 0.01, overshoot: false });
          }
        }
      });
    },
    stone: function (engine, region, options) {
      const opts = options || {};
      V.hatch(engine, region, { angle: 0.62, spacing: opts.spacing || 7, cross: true, alpha: 0.12 });
      V.texture(engine, region, { count: opts.count || 34, angle: 0.1, angleJitter: 2.3, length: 1.5, spread: 8, alpha: 0.18 });
    },
    wood: function (engine, region, options) {
      const opts = options || {};
      V.texture(engine, region, { count: opts.count || 45, angle: Math.PI / 2, angleJitter: 0.12, length: 8, spread: 1.2, alpha: 0.2 });
    },
    metal: function (engine, region, options) {
      const opts = options || {};
      V.hatch(engine, region, { angle: 1.1, spacing: 5.4, alpha: 0.12 });
      V.texture(engine, region, { count: opts.count || 26, angle: 0.1, angleJitter: 0.3, length: 7, spread: 1.3, alpha: 0.2 });
    },
    water: function (engine, region, options) {
      const opts = options || {};
      V.clip(engine, region, function () {
        const b = bounds(region);
        for (let i = 0; i < (opts.count || 26); i += 1) {
          const y = b.minY + engine.random() * (b.maxY - b.minY);
          const x = b.minX + engine.random() * (b.maxX - b.minX);
          const span = 2 + engine.random() * 10;
          engine.sketchCurve([[x - span, y], [x - span * 0.3, y - 0.5], [x + span * 0.3, y + 0.5], [x + span, y]], { alpha: 0.18, width: 0.55, passes: 1, wobble: 0.015 });
        }
      });
    }
  };

  V.drawModel = function drawModel(engine, model, options) {
    if (!model || !Array.isArray(model.layers)) throw new TypeError('A visual model needs a layers array.');
    const opts = options || {};
    model.layers.forEach(function (layer) {
      if (!layer || !Array.isArray(layer.path)) return;
      if (layer.type === 'region') V.volume(engine, layer.path, layer.style || {});
      else if (layer.type === 'line') V.path(engine, layer.path, layer.style || {});
      else if (layer.type === 'hatch') V.hatch(engine, layer.path, layer.style || {});
      else if (layer.type === 'texture') V.material[layer.material || 'fur'](engine, layer.path, layer.style || {});
    });
    return { id: model.id || 'anonymous-model', seed: engine.seed >>> 0, pose: opts.pose || 'default' };
  };

  V.version = '1.0.0';
  V.coordinateSystem = 'normalized-100';
  S.visual = Object.freeze(V);
})(window);
