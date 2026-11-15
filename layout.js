/* layout.js — deterministic placement, environment staging and final pencil render. */
(function (root) {
  'use strict';

  const S = root.Sketchbook;
  const COLORS = {
    red: '#b75d50', blue: '#617f9f', green: '#758b62', yellow: '#c5a34e', orange: '#c9824f',
    purple: '#88729b', pink: '#bd8597', brown: '#8c6b52', black: '#45413d', white: '#f8f5ee',
    grey: '#89847d', gray: '#89847d', teal: '#5d918d', gold: '#b99b54', silver: '#999b9d',
    beige: '#b9a990', turquoise: '#5d9e9b'
  };
  const LAYER_ORDER = { sky: 0, far: 1, mid: 2, near: 3 };
  const CATEGORY_COLORS = {
    nature: '#71875f', animals: '#9a826e', people: '#8a746d', buildings: '#967e66',
    vehicles: '#71869a', food: '#b77f55', household: '#8d8274', 'tools-tech': '#777f86',
    'space-sky': '#75899a', symbols: '#927b9a', fantasy: '#8e789e'
  };

  function clamp(value, low, high) {
    return Math.max(low, Math.min(high, value));
  }

  function chooseRegion(region, width, height, random) {
    const padX = width * 0.09;
    const padY = height * 0.09;
    let x = width * (0.18 + random() * 0.64);
    let y = height * (0.26 + random() * 0.55);
    if (region === 'left') x = width * (0.16 + random() * 0.12);
    if (region === 'right') x = width * (0.72 + random() * 0.12);
    if (region === 'center' || region === 'centre') x = width * (0.5 + (random() - 0.5) * 0.08);
    if (region === 'top') y = height * (0.16 + random() * 0.13);
    if (region === 'bottom') y = height * (0.73 + random() * 0.1);
    if (region === 'background') y = height * (0.33 + random() * 0.22);
    if (region === 'foreground') y = height * (0.72 + random() * 0.08);
    return [clamp(x, padX, width - padX), clamp(y, padY, height - padY)];
  }

  function objectScale(def, item, width, height, mode, count, grid) {
    const size = Number(item.size) || 1;
    const density = count > 1 ? Math.min(1, 1.3 / Math.sqrt(count)) : 1;
    if (mode === 'object') {
      const cell = grid || { width: width * 0.84, height: height * 0.82 };
      const heightScale = cell.height * (count === 1 ? 0.86 : 0.78) / 100;
      const widthScale = (cell.width * (count === 1 ? 0.84 : 0.78)) / Math.max(35, def.aspect * 100);
      return clamp(Math.min(heightScale, widthScale) * size, 0.12, 5);
    }
    const baselineScale = def.layer === 'sky' ? height * 0.16 / 100 : (def.layer === 'far' ? height * 0.29 / 100 : height * 0.34 / 100);
    return clamp(baselineScale * size * density, 0.12, 2.2);
  }

  function objectGrid(count, width, height) {
    const columns = count === 1 ? 1 : (count <= 4 ? 2 : Math.min(4, Math.ceil(Math.sqrt(count * width / height))));
    const rows = Math.ceil(count / columns);
    const usableWidth = width * 0.88;
    const usableHeight = height * 0.82;
    return {
      columns,
      rows,
      cellWidth: usableWidth / columns,
      cellHeight: usableHeight / rows,
      left: width * 0.06,
      top: height * 0.09,
      usableWidth,
      usableHeight
    };
  }

  function addPlacement(placed, item, def, x, y, scale, seed, itemIndex, instanceIndex) {
    placed.push({
      def,
      id: def.id,
      word: item.word,
      x,
      y,
      scale,
      seed: seed >>> 0,
      itemIndex,
      instanceIndex,
      opts: {
        color: item.color ? (COLORS[item.color] || item.color) : (item.colored ? (CATEGORY_COLORS[def.category] || def.color || null) : null),
        flip: !!(item.modifiers && item.modifiers.includes('facing left')),
        rotation: item.modifiers && item.modifiers.includes('tilted') ? 0.16 : (item.modifiers && item.modifiers.includes('upside down') ? Math.PI : 0),
        detail: item.style || 'normal',
        modifiers: (item.modifiers || []).slice()
      }
    });
  }

  function layout(scene, width, height, seed) {
    const w = Math.max(1, Number(width) || 800);
    const h = Math.max(1, Number(height) || 500);
    const random = S.rng(seed >>> 0);
    const placed = [];
    const byItem = new Map();
    const sourceItems = Array.isArray(scene.items) ? scene.items : [];
    const expanded = [];

    sourceItems.forEach(function (item, itemIndex) {
      const def = item.id === '__doodle__' ? null : S.objects.get(item.id);
      if (!def && item.id !== '__doodle__') return;
      const rawCount = Math.floor(Number(item.count));
      if (!Number.isFinite(rawCount) || rawCount <= 0) return;
      const count = clamp(rawCount, 1, 40);
      for (let instance = 0; instance < count && expanded.length < 120; instance += 1) {
        expanded.push({ item, def, itemIndex, instance, count });
      }
    });

    // Empty, vague or gibberish prompts still produce a calm, seeded landscape.
    if (!expanded.length && scene.mode === 'scene') {
      ['mountain', 'tree', 'sun', 'cloud'].forEach(function (id, index) {
        const def = S.lookup(id);
        if (!def) return;
        const spots = [[w * 0.5, h * 0.72], [w * 0.2, h * 0.83], [w * 0.78, h * 0.31], [w * 0.29, h * 0.22]];
        const scale = id === 'mountain' ? h * 0.34 / 100 : h * 0.2 / 100;
        addPlacement(placed, { word: id, size: 1, modifiers: [] }, def, spots[index][0], spots[index][1], scale, (seed + index * 7919) >>> 0, -1, index);
      });
      return placed;
    }

    const mode = scene.mode || 'object';
    const horizon = h * (mode === 'scene' ? 0.61 : 0.83);
    const ground = h * 0.91;
    const groups = new Map();
    const grid = mode === 'object' ? objectGrid(expanded.length, w, h) : null;

    expanded.forEach(function (entry, slot) {
      const item = entry.item;
      const def = entry.def;
      const index = entry.itemIndex;
      const key = index;
      const count = entry.count;
      const targetList = groups.get(key) || [];
      const scaleCount = mode === 'object' ? expanded.length : count;
      const cell = grid ? { width: grid.cellWidth, height: grid.cellHeight } : null;
      const scale = def ? objectScale(def, item, w, h, mode, scaleCount, cell) : objectScale({ aspect: 1, layer: 'near' }, item, w, h, mode, scaleCount, cell);
      const layer = def ? def.layer : 'near';
      let x;
      let y;

      if (mode === 'object') {
        const row = Math.floor(slot / grid.columns);
        const col = slot % grid.columns;
        x = grid.left + (col + 0.5) * grid.cellWidth;
        // Items use a baseline near the bottom of each grid cell, so the
        // full height of each drawing stays inside its own row.
        y = grid.top + (row + 1) * grid.cellHeight - grid.cellHeight * 0.08;
      } else if (item.region) {
        const position = chooseRegion(item.region, w, h, random);
        x = position[0];
        y = position[1];
      } else if (layer === 'sky') {
        x = w * (0.13 + random() * 0.74);
        y = h * (0.13 + random() * 0.3);
      } else if (layer === 'far') {
        x = w * (0.12 + random() * 0.76);
        y = horizon + h * (0.01 + random() * 0.09);
      } else if (layer === 'mid') {
        x = w * (0.12 + random() * 0.76);
        y = horizon + h * (0.12 + random() * 0.15);
      } else {
        x = w * (0.12 + random() * 0.76);
        y = ground - h * (0.02 + random() * 0.08);
      }

      if (count > 1 && mode === 'scene') {
        const spacing = Math.min(w * 0.13, 48 * scale);
        x += (entry.instance - (count - 1) / 2) * spacing;
        y += Math.sin(entry.instance * 1.7) * h * 0.025;
      }
      if (count > 1 && mode === 'object') {
        x += (entry.instance - (count - 1) / 2) * Math.min(w * 0.16, 36 * scale);
      }
      if (item.modifiers && (item.modifiers.includes('flying') || item.modifiers.includes('floating'))) y -= scale * 0.22;

      // Small deterministic rejection sampling reduces collisions between independent objects.
      const objectWidth = def ? def.aspect * scale * 100 : scale * 60;
      const objectHeight = scale * 100;
      let attempt = 0;
      while (attempt < 30 && placed.some(function (other) {
        const otherDef = other.def || { layer: 'near', aspect: 0.6 };
        if ((otherDef.layer || 'near') !== layer || other.itemIndex === index) return false;
        const dx = Math.abs(other.x - x);
        const dy = Math.abs(other.y - y);
        return dx < (objectWidth + (otherDef.aspect || 0.6) * other.scale * 100) * 0.31 && dy < (objectHeight + other.scale * 100) * 0.26;
      })) {
        x = clamp(x + (random() - 0.5) * w * 0.21, objectWidth * 0.55, w - objectWidth * 0.55);
        y = clamp(y + (random() - 0.5) * h * 0.13, objectHeight * 0.55, h - h * 0.06);
        attempt += 1;
      }

      x = clamp(x, objectWidth * 0.52, w - objectWidth * 0.52);
      y = clamp(y, objectHeight * 0.96, h - h * 0.045);
      const itemSeed = (seed ^ S.hash(item.word || (def && def.id) || 'mystery') ^ (slot + 1) * 2654435761) >>> 0;
      const object = def;
      if (object) addPlacement(placed, item, object, x, y, scale, itemSeed, index, entry.instance);
      else {
        placed.push({ def: null, id: '__doodle__', word: item.word, x, y, scale, seed: itemSeed, itemIndex: index, instanceIndex: entry.instance, opts: { color: null, modifiers: [] } });
      }
      targetList.push(placed[placed.length - 1]);
      groups.set(key, targetList);
    });

    // Resolve simple object-to-object relationships after all base positions exist.
    sourceItems.forEach(function (item, itemIndex) {
      if (!item.relation) return;
      const subjectGroup = groups.get(itemIndex);
      const targetGroup = groups.get(item.relation.targetIndex);
      if (!subjectGroup || !targetGroup || !subjectGroup.length || !targetGroup.length) return;
      const relation = item.relation.type;
      let parentGroup;
      let childGroup;
      if (relation === 'holding') {
        parentGroup = subjectGroup;
        childGroup = targetGroup;
      } else if (relation === 'next to') {
        parentGroup = targetGroup;
        childGroup = subjectGroup;
      } else {
        parentGroup = targetGroup;
        childGroup = subjectGroup;
      }
      const parent = parentGroup[0];
      const gap = Math.max(8, parent.scale * 12);
      childGroup.forEach(function (child, childIndex) {
        const spread = (childIndex - (childGroup.length - 1) / 2) * Math.max(12, parent.scale * 34);
        const anchorPosition = function (name) {
          const anchor = parent.def && parent.def.anchors && parent.def.anchors[name];
          if (!anchor || !Array.isArray(anchor)) return null;
          return {
            x: parent.x + (anchor[0] - 0.5) * (parent.def.aspect || 1) * 100 * parent.scale,
            y: parent.y + (anchor[1] - 1) * 100 * parent.scale
          };
        };
        if (relation === 'on') {
          const top = anchorPosition('top') || { x: parent.x, y: parent.y - parent.scale * 71 };
          child.x = top.x + spread;
          child.y = top.y;
          child.scale = Math.min(child.scale, parent.scale * (childGroup.length > 1 ? 0.48 : 0.62));
        } else if (relation === 'under') {
          child.x = parent.x + spread;
          if (parent.def && parent.def.layer === 'sky' && scene.mode === 'scene') {
            child.scale = Math.min(child.scale, parent.scale * 1.9);
            child.y = h * 0.88;
          } else {
            child.scale = Math.min(child.scale, parent.scale * 0.72);
            child.y = parent.y + parent.scale * 72;
          }
        } else if (relation === 'holding') {
          const hand = anchorPosition('hand') || anchorPosition('head') || { x: parent.x + parent.scale * 33, y: parent.y - parent.scale * 73 };
          child.x = hand.x + spread * 0.2;
          child.y = hand.y;
          child.scale = Math.min(child.scale, parent.scale * 0.58);
        } else if (relation === 'inside') {
          const inside = anchorPosition('inside') || { x: parent.x, y: parent.y - parent.scale * 38 };
          child.x = inside.x + spread * 0.25;
          child.y = inside.y;
          child.scale = Math.min(child.scale, parent.scale * 0.42);
        } else if (relation === 'behind') {
          child.x = parent.x - parent.scale * 22 + spread;
          child.y = parent.y - parent.scale * 18;
          child.scale = Math.min(child.scale, parent.scale * 0.72);
        } else if (relation === 'in front of') {
          child.x = parent.x + parent.scale * 22 + spread;
          child.y = parent.y + parent.scale * 8;
          child.scale = Math.min(child.scale, parent.scale * 0.78);
        } else if (relation === 'next to') {
          child.scale = Math.min(child.scale, parent.scale * 0.78);
          const parentHalfWidth = parent.scale * (parent.def ? parent.def.aspect : 0.9) * 50;
          const childHalfWidth = child.scale * (child.def ? child.def.aspect : 0.7) * 50;
          child.x = parent.x + parentHalfWidth + childHalfWidth + gap + childIndex * Math.max(12, child.scale * 18);
          child.y = parent.y + Math.sin(childIndex * 1.3) * parent.scale * 5;
        }
        child.x = clamp(child.x, child.scale * 28, w - child.scale * 28);
        child.y = clamp(child.y, child.scale * 12, h - child.scale * 4);
      });
    });

    // Add automatic scenery without changing the prompt's recognized-object list.
    if (mode === 'scene') {
      const setting = scene.stage && scene.stage.setting;
      const time = scene.stage && scene.stage.time;
      const weather = scene.stage && scene.stage.weather;
      const hasExplicit = function (id) { return sourceItems.some(function (item) { return item.id === id; }); };
      const addAuto = function (id, x, y, scale, index, layerOverride) {
        if (hasExplicit(id)) return;
        const def = S.lookup(id);
        if (!def) return;
        const clone = Object.assign({}, def, { layer: layerOverride || def.layer });
        addPlacement(placed, { word: id, size: 1, modifiers: [] }, clone, x, y, scale, (seed + 0x9E3779B9 * (index + 1)) >>> 0, -100 - index, index);
      };
      if (time === 'night') {
        addAuto('moon', w * 0.82, h * 0.28, h * 0.16 / 100, 1, 'sky');
        for (let i = 0; i < 8; i += 1) addAuto('star', w * (0.08 + random() * 0.82), h * (0.09 + random() * 0.31), h * 0.045 / 100, i + 2, 'sky');
      } else {
        const lowSun = time === 'sunset' || time === 'sunrise';
        addAuto('sun', w * 0.82, lowSun ? h * 0.52 : h * 0.27, h * 0.14 / 100, 1, 'sky');
        addAuto('cloud', w * 0.24, h * (lowSun ? 0.32 : 0.25), h * 0.11 / 100, 2, 'sky');
      }
      if (setting === 'forest') {
        addAuto('pine tree', w * 0.1, h * 0.89, h * 0.34 / 100, 3, 'far');
        addAuto('pine tree', w * 0.9, h * 0.89, h * 0.37 / 100, 4, 'far');
      } else if (setting === 'city') {
        addAuto('skyscraper', w * 0.14, h * 0.81, h * 0.28 / 100, 3, 'far');
        addAuto('skyscraper', w * 0.87, h * 0.81, h * 0.34 / 100, 4, 'far');
      } else if (setting === 'beach' || setting === 'ocean' || setting === 'underwater') {
        addAuto('fish', w * 0.18, h * 0.68, h * 0.12 / 100, 3, 'mid');
        addAuto('fish', w * 0.78, h * 0.75, h * 0.1 / 100, 4, 'mid');
      } else if (setting === 'desert') {
        addAuto('cactus', w * 0.1, h * 0.9, h * 0.22 / 100, 3, 'far');
      } else if (setting === 'farm') {
        addAuto('barn', w * 0.83, h * 0.88, h * 0.3 / 100, 3, 'far');
      } else if (setting === 'mountains' || setting === 'arctic') {
        addAuto('mountain', w * 0.5, h * 0.78, h * 0.31 / 100, 3, 'far');
      } else if (setting === 'space') {
        addAuto('planet', w * 0.78, h * 0.47, h * 0.21 / 100, 3, 'far');
      }
      if (weather === 'rain' || weather === 'storm') {
        for (let i = 0; i < 18; i += 1) addAuto('cloud', w * (0.05 + random() * 0.9), h * (0.15 + random() * 0.22), h * 0.07 / 100, 30 + i, 'sky');
      }
    }

    return placed;
  }

  function drawBackdrop(engine, scene) {
    const ctx = engine.ctx;
    const w = engine.width;
    const h = engine.height;
    const stage = scene.stage || {};
    const horizon = h * (scene.mode === 'scene' ? 0.62 : 0.84);

    engine.applyPaperTexture(false);
    if (scene.mode === 'scene') {
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = stage.time === 'night' ? '#e9e4e6' : '#f5f1e8';
      ctx.globalAlpha = stage.time === 'night' ? 0.72 : 0.28;
      ctx.fillRect(0, 0, w, horizon);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#e4ded2';
      ctx.globalAlpha = 0.24;
      ctx.fillRect(0, horizon, w, h - horizon);
      ctx.restore();

      engine.sketchCurve([[0, horizon], [w * 0.22, horizon - 5], [w * 0.48, horizon + 3], [w * 0.74, horizon - 4], [w, horizon]], { alpha: 0.34, width: 1.1, passes: 2 });
      engine.sketchCurve([[0, h * 0.91], [w * 0.26, h * 0.9], [w * 0.55, h * 0.92], [w * 0.82, h * 0.9], [w, h * 0.91]], { alpha: 0.22, width: 0.8, passes: 1 });
      if (stage.time === 'night') {
        engine.withClipRect(0, 0, w, horizon, function () { engine.hatch(0.92, 15, false); });
      }
      if (stage.setting === 'underwater' || stage.setting === 'ocean' || stage.setting === 'beach') {
        for (let i = 0; i < 8; i += 1) {
          const x = w * (0.08 + i * 0.12);
          engine.sketchCurve([[x, horizon + 18], [x - 9, h * 0.76], [x + 9, h * 0.83], [x, h * 0.94]], { alpha: 0.38, width: 1.05, passes: 1 });
          engine.sketchCurve([[x - 15, horizon + 13], [x - 5, horizon + 10], [x + 6, horizon + 13]], { alpha: 0.26, width: 0.8, passes: 1 });
        }
        if (stage.setting === 'underwater') {
          const bubbleRandom = S.rng(S.hash('underwater-bubbles'));
          for (let i = 0; i < 16; i += 1) engine.sketchCircle(bubbleRandom() * w, horizon + bubbleRandom() * (h - horizon), 2 + bubbleRandom() * 3, false, { alpha: 0.28, width: 0.7, passes: 1 });
        }
      }
      if (stage.weather === 'rain' || stage.weather === 'storm') {
        const random = S.rng(S.hash('rain-' + stage.weather));
        for (let i = 0; i < 44; i += 1) {
          const x = random() * w;
          const y = random() * h;
          engine.sketchLine(x, y, x - 5, y + 12, { alpha: 0.28, width: 0.7, passes: 1, overshoot: false });
        }
      }
      if (stage.weather === 'snow') {
        const random = S.rng(S.hash('snow-' + stage.weather));
        for (let i = 0; i < 46; i += 1) {
          const x = random() * w;
          const y = random() * h;
          engine.sketchCircle(x, y, 1.1 + random() * 1.6, false, { alpha: 0.3, width: 0.6, passes: 1 });
        }
      }
      if (stage.weather === 'fog') {
        for (let i = 0; i < 4; i += 1) {
          const y = h * (0.45 + i * 0.11);
          engine.sketchCurve([[0, y], [w * 0.25, y - 5], [w * 0.52, y + 3], [w * 0.78, y - 4], [w, y]], { color: '#aaa49b', alpha: 0.2, width: 7, passes: 1 });
        }
      }
      if (stage.time === 'sunset' || stage.time === 'sunrise') {
        engine.withClipRect(0, horizon, w, h - horizon, function () { engine.hatch(0.18, 17, false); });
      }
    } else {
      engine.sketchCurve([[w * 0.12, h * 0.86], [w * 0.34, h * 0.84], [w * 0.68, h * 0.85], [w * 0.9, h * 0.86]], { alpha: 0.24, width: 0.8, passes: 1 });
    }
  }

  function drawGroundShadow(engine, item) {
    if (!item.def || item.def.layer === 'sky' || item.def.anchor === 'water') return;
    const modifiers = item.opts && item.opts.modifiers ? item.opts.modifiers : [];
    if (modifiers.includes('flying') || modifiers.includes('floating')) return;
    const ctx = engine.ctx;
    const aspect = item.def.aspect || 1;
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = '#837b70';
    ctx.globalAlpha = item.def.layer === 'far' ? 0.055 : 0.09;
    ctx.beginPath();
    ctx.ellipse(item.x, item.y + item.scale * 2.5, Math.max(3, item.scale * Math.min(0.48, aspect * 0.38) * 100), Math.max(1.2, item.scale * 2.8), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawModifiers(engine, placed) {
    placed.forEach(function (item) {
      const mods = item.opts.modifiers || [];
      const x = item.x;
      const y = item.y;
      const scale = item.scale;
      if (mods.includes('glowing')) {
        for (let i = 0; i < 12; i += 1) {
          const a = (Math.PI * 2 * i) / 12;
          engine.sketchLine(x + Math.cos(a) * scale * 48, y - scale * 50 + Math.sin(a) * scale * 48, x + Math.cos(a) * scale * 58, y - scale * 50 + Math.sin(a) * scale * 58, { alpha: 0.58, width: 1.1, passes: 1 });
        }
      }
      if (mods.includes('sleeping')) {
        if (S.font) S.font.drawText(engine, 'Z Z Z', x + scale * 23, y - scale * 104, Math.max(9, scale * 11), { width: 1 });
      }
      if (mods.includes('on fire') || mods.includes('burning')) {
        engine.sketchCurve([[x - scale * 26, y - scale * 84], [x - scale * 18, y - scale * 102], [x - scale * 8, y - scale * 87], [x, y - scale * 108], [x + scale * 10, y - scale * 87], [x + scale * 21, y - scale * 102], [x + scale * 28, y - scale * 84]], { color: '#c77d50', alpha: 0.7, width: 2.1 });
      }
      if (mods.includes('snowy')) {
        engine.sketchCurve([[x - scale * 28, y - scale * 83], [x - scale * 14, y - scale * 91], [x, y - scale * 86], [x + scale * 15, y - scale * 93], [x + scale * 29, y - scale * 84]], { color: '#8b9da8', alpha: 0.56, width: 2.1 });
      }
      if (mods.includes('shiny')) {
        engine.sketchLine(x + scale * 28, y - scale * 95, x + scale * 38, y - scale * 108, { alpha: 0.65, width: 1.6 });
        engine.sketchLine(x + scale * 38, y - scale * 108, x + scale * 48, y - scale * 95, { alpha: 0.65, width: 1.6 });
      }
      if (mods.includes('floating') || mods.includes('flying')) {
        engine.sketchCurve([[x - scale * 31, y + scale * 24], [x, y + scale * 29], [x + scale * 31, y + scale * 24]], { alpha: 0.2, width: 0.8, passes: 1 });
        engine.sketchLine(x - scale * 56, y - scale * 55, x - scale * 42, y - scale * 55, { alpha: 0.25, width: 0.8, passes: 1 });
        engine.sketchLine(x - scale * 60, y - scale * 45, x - scale * 47, y - scale * 45, { alpha: 0.25, width: 0.8, passes: 1 });
      }
    });
  }

  function render(engine, placed, scene) {
    drawBackdrop(engine, scene);
    const ordered = placed.slice().sort(function (a, b) {
      const layerA = a.def ? (LAYER_ORDER[a.def.layer] == null ? 3 : LAYER_ORDER[a.def.layer]) : 3;
      const layerB = b.def ? (LAYER_ORDER[b.def.layer] == null ? 3 : LAYER_ORDER[b.def.layer]) : 3;
      if (layerA !== layerB) return layerA - layerB;
      return a.y - b.y;
    });

    ordered.forEach(function (item) {
      drawGroundShadow(engine, item);
      if (item.def) {
        const layer = item.def.layer || 'near';
        const opacity = layer === 'far' ? 0.58 : (layer === 'mid' ? 0.78 : 1);
        const options = Object.assign({}, item.opts, { opacity });
        S.drawObject(engine, item.def, item.x, item.y, item.scale, item.seed, options);
      } else {
        S.doodle(engine, item.word, item.x, item.y, item.scale, item.seed);
      }
    });
    drawModifiers(engine, ordered);

    (scene.texts || []).forEach(function (entry, index) {
      const text = String(entry.text || '').slice(0, 36);
      if (!text || !S.font) return;
      const size = Math.min(24, Math.max(14, engine.width / Math.max(18, text.length * 1.2)));
      const y = entry.style === 'sign' ? engine.height * 0.48 : engine.height * (0.11 + index * 0.06);
      S.font.drawText(engine, text, engine.width * 0.5 - S.font.measure(text, size) * 0.5, y, size, { width: 1.15, maxWidth: engine.width * 0.72 });
    });

    engine.applyPaperTexture(true);
    return ordered;
  }

  S.layout = layout;
  S.render = render;
})(window);
