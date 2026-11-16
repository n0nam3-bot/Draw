/* library/animal-illustrator.js — first anatomy model for the Sketchbook Visual Engine.
 * Original procedural drawing; no external images, datasets, AI, or network access.
 * The subject uses a normalized 0..100 construction grid and seeded coat texture.
 */
(function (root) {
  'use strict';

  const S = root.Sketchbook;
  if (!S) throw new Error('Load objects.js before animal-illustrator.js.');
  const V = S.visual;
  if (!V) throw new Error('Load visual-engine.js before animal-illustrator.js.');

  const FINE = { alpha: 0.48, width: 0.58, passes: 1, wobble: 0.012, overshoot: false };
  const EDGE = { alpha: 0.72, width: 0.82, passes: 2, wobble: 0.018, overshoot: false };
  const DARK = { alpha: 0.68, width: 0.68, passes: 1, wobble: 0.014, overshoot: false };

  function stroke(engine, path, style) {
    V.path(engine, path, Object.assign({}, FINE, style || {}));
  }

  function fill(engine, path, color, opacity) {
    V.fill(engine, path, { fill: color, opacity: opacity == null ? 1 : opacity, outline: false });
  }

  function tone(engine, path, stops, opacity) {
    V.fill(engine, path, { gradient: stops, opacity: opacity == null ? 1 : opacity, outline: false });
  }

  function shiftY(path, amount) {
    return path.map(function (command) {
      if (command[0] === 'Z') return command.slice();
      const shifted = command.slice();
      for (let i = 2; i < shifted.length; i += 2) shifted[i] += amount;
      return shifted;
    });
  }

  function scalePathY(path, center, factor) {
    return path.map(function (command) {
      if (command[0] === 'Z') return command.slice();
      const scaled = command.slice();
      for (let i = 2; i < scaled.length; i += 2) scaled[i] = center + (scaled[i] - center) * factor;
      return scaled;
    });
  }

  function dot(engine, x, y, radius, alpha, color) {
    const ctx = engine.ctx;
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = alpha == null ? 0.8 : alpha;
    ctx.fillStyle = color || '#37342f';
    ctx.beginPath();
    ctx.arc(x - 50, y - 100, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function germanShepherd(engine, x, y, scale, seed, opts) {
    const colored = !!(engine.options && engine.options.colored);
    const coat = colored ? {
      cream: '#e8d7bc', tan: '#c5a47d', light: '#f1e7d5', mid: '#a58a6c',
      dark: '#4d4640', mask: '#302e2c', shadow: '#6c6258', paper: '#f8f5ee'
    } : {
      cream: '#e5e1d9', tan: '#c5c0b8', light: '#f5f2eb', mid: '#aaa49c',
      dark: '#5c5852', mask: '#403d39', shadow: '#77716a', paper: '#f8f5ee'
    };

    engine.setSeed(seed >>> 0);

    // A small articulated skeleton supplies consistent anatomical landmarks.
    // The visible forms are drawn as continuous masses over this rig.
    const baseRig = V.makeRig({
      hip: [30, 67], stifle: [39, 82], hock: [29, 92], hindPaw: [17, 97],
      shoulder: [65, 62], elbow: [67, 80], wrist: [67, 93], forePaw: [69, 98],
      poll: [82, 27], nose: [99, 41]
    }, [
      { from: 'hip', to: 'stifle', radius: 7, tipRadius: 5, group: 'hind limb' },
      { from: 'stifle', to: 'hock', radius: 4.6, tipRadius: 3, group: 'hind limb' },
      { from: 'shoulder', to: 'elbow', radius: 5.4, tipRadius: 3.4, group: 'forelimb' },
      { from: 'elbow', to: 'wrist', radius: 3.4, tipRadius: 2.5, group: 'forelimb' }
    ]);
    const rig = V.poseRig(baseRig, {});
    const knee = V.solveTwoBone(rig.joints.hip, rig.joints.hock, 18, 15, 1);

    // Rear tail sits behind the rump and has a heavy, tapered shepherd plume.
    const tail = [
      ['M', 24, 61], ['C', 18, 62, 12, 68, 9, 76],
      ['C', 6, 82, 7, 88, 12, 90], ['C', 16, 92, 19, 86, 22, 81],
      ['C', 26, 74, 30, 68, 32, 65], ['C', 31, 61, 28, 60, 24, 61], ['Z']
    ];
    tone(engine, tail, [[0, coat.light], [0.48, coat.tan], [1, coat.dark]]);

    // The outer body is a single connected contour: back, shoulder, chest,
    // forelegs, folded haunch and paws share one silhouette rather than circles.
    const body = [
      ['M', 16, 96],
      ['C', 12, 95, 14, 91, 19, 88],
      ['C', 14, 84, 11, 78, 12, 71],
      ['C', 12, 62, 18, 55, 28, 52],
      ['C', 38, 48, 50, 48, 59, 52],
      ['C', 64, 54, 68, 57, 71, 62],
      ['C', 73, 58, 75, 51, 78, 44],
      ['C', 79, 36, 85, 30, 91, 31],
      ['C', 97, 32, 100, 38, 97, 44],
      ['C', 101, 45, 103, 48, 100, 51],
      ['C', 96, 54, 88, 51, 83, 48],
      ['C', 80, 55, 75, 63, 73, 72],
      ['C', 77, 69, 79, 79, 81, 88],
      ['L', 85, 94], ['C', 89, 96, 90, 98, 86, 99],
      ['L', 70, 99], ['C', 66, 98, 66, 94, 66, 89],
      ['L', 65, 75], ['C', 62, 82, 62, 89, 64, 95],
      ['C', 66, 98, 64, 100, 60, 100], ['L', 52, 100],
      ['C', 49, 98, 50, 94, 50, 89], ['L', 51, 78],
      ['C', 47, 84, 42, 88, 35, 87],
      ['C', 33, 91, 35, 94, 41, 96],
      ['C', 45, 98, 43, 100, 38, 100], ['L', 18, 100],
      ['C', 14, 100, 13, 98, 16, 96], ['Z']
    ];
    tone(engine, body, [[0, coat.light], [0.32, coat.cream], [0.66, coat.tan], [1, coat.shadow]]);

    // Broad planes model the haunch, rib cage, shoulder, throat and chest.
    const haunch = [
      ['M', 15, 67], ['C', 18, 57, 28, 53, 37, 58],
      ['C', 44, 62, 46, 72, 41, 82], ['C', 38, 90, 29, 94, 21, 88],
      ['C', 15, 83, 12, 75, 15, 67], ['Z']
    ];
    tone(engine, haunch, [[0, coat.light], [0.55, coat.tan], [1, coat.mid]], 0.7);
    const rib = [
      ['M', 32, 53], ['C', 42, 48, 56, 51, 64, 59],
      ['C', 69, 65, 69, 74, 65, 82], ['C', 60, 88, 51, 87, 43, 82],
      ['C', 38, 77, 35, 68, 32, 53], ['Z']
    ];
    tone(engine, rib, [[0, coat.light], [0.5, coat.cream], [1, coat.mid]], 0.62);

    const chestPlane = [
      ['M', 60, 56], ['C', 66, 55, 72, 61, 74, 68],
      ['C', 77, 76, 77, 85, 78, 94], ['L', 70, 97],
      ['C', 67, 89, 67, 79, 64, 72], ['C', 61, 66, 58, 61, 60, 56], ['Z']
    ];
    tone(engine, chestPlane, [[0, coat.light], [0.6, coat.cream], [1, coat.mid]], 0.78);

    const bellyShadow = [
      ['M', 20, 79], ['C', 31, 83, 44, 83, 54, 77],
      ['C', 59, 75, 63, 79, 65, 85], ['C', 57, 92, 44, 94, 31, 91],
      ['C', 24, 89, 19, 85, 20, 79], ['Z']
    ];
    fill(engine, bellyShadow, coat.shadow, colored ? 0.15 : 0.1);

    // Black saddle is irregular and feathered into the tan coat at the edges.
    const saddle = [
      ['M', 20, 57], ['C', 27, 50, 40, 47, 51, 50],
      ['C', 60, 52, 66, 57, 69, 64], ['C', 62, 61, 56, 60, 49, 63],
      ['C', 39, 68, 29, 66, 20, 63], ['Z']
    ];
    tone(engine, saddle, [[0, coat.dark], [0.7, coat.mask], [1, coat.shadow]], colored ? 0.88 : 0.78);

    // A dark lower shoulder/chest transition helps the neck flow into the torso.
    const bib = [
      ['M', 65, 48], ['C', 70, 44, 76, 44, 82, 48],
      ['C', 79, 57, 77, 65, 74, 73], ['C', 70, 69, 65, 60, 65, 48], ['Z']
    ];
    tone(engine, bib, [[0, coat.light], [0.5, coat.cream], [1, coat.mid]], 0.56);

    // Head planes and mask are drawn after the neck, with a short sloping bridge.
    const skull = shiftY([
      ['M', 72, 34], ['C', 74, 28, 80, 24, 87, 25],
      ['C', 93, 26, 96, 31, 95, 37], ['C', 94, 43, 89, 46, 83, 45],
      ['C', 77, 44, 73, 40, 72, 34], ['Z']
    ], 6);
    tone(engine, skull, [[0, coat.light], [0.42, coat.cream], [1, coat.mid]]);

    const cheek = shiftY([
      ['M', 75, 34], ['C', 80, 30, 87, 30, 92, 34],
      ['C', 91, 41, 86, 44, 80, 42], ['C', 77, 40, 74, 37, 75, 34], ['Z']
    ], 6);
    tone(engine, cheek, [[0, coat.light], [1, coat.tan]], 0.62);

    // Ears are tall but remain rooted in the skull; one is set behind the other.
    const farEar = scalePathY(shiftY([
      ['M', 74, 29], ['C', 71, 23, 70, 16, 73, 13],
      ['C', 77, 12, 81, 20, 82, 29], ['C', 80, 32, 77, 32, 74, 29], ['Z']
    ], 6), 34, 0.52);
    const nearEar = scalePathY(shiftY([
      ['M', 83, 28], ['C', 84, 20, 87, 13, 91, 12],
      ['C', 95, 13, 94, 23, 91, 32], ['C', 88, 33, 85, 31, 83, 28], ['Z']
    ], 6), 34, 0.88);
    tone(engine, farEar, [[0, coat.mid], [1, coat.dark]], 0.96);
    tone(engine, nearEar, [[0, coat.cream], [1, coat.mid]], 1);
    fill(engine, shiftY([['M', 77, 24], ['C', 76, 19, 74, 13, 74, 11], ['C', 78, 15, 79, 20, 80, 25], ['Z']], 6), coat.dark, 0.42);
    fill(engine, shiftY([['M', 89, 23], ['C', 90, 17, 92, 13, 93, 13], ['L', 91, 25], ['Z']], 6), coat.dark, 0.36);

    // Shepherd facial mask, brow, eye, muzzle and nose; avoid oversized cartoon features.
    const mask = shiftY([
      ['M', 75, 30], ['C', 80, 26, 87, 27, 92, 31],
      ['C', 91, 35, 88, 39, 84, 40], ['C', 80, 39, 77, 37, 75, 34], ['Z']
    ], 6);
    fill(engine, mask, coat.mask, colored ? 0.82 : 0.72);

    const muzzle = shiftY([
      ['M', 85, 36], ['C', 90, 33, 97, 34, 101, 39],
      ['C', 102, 42, 100, 46, 96, 48], ['C', 91, 48, 86, 45, 83, 41], ['Z']
    ], 6);
    tone(engine, muzzle, [[0, coat.light], [0.58, coat.cream], [1, coat.mid]]);
    const muzzleShadow = shiftY([['M', 86, 42], ['C', 91, 46, 98, 46, 101, 42], ['C', 99, 49, 91, 50, 87, 46], ['Z']], 6);
    fill(engine, muzzleShadow, coat.shadow, 0.22);

    // Eye sits inside the mask, with a soft brow and a tiny catchlight.
    stroke(engine, shiftY([['M', 79, 33], ['Q', 82, 30, 86, 32]], 6), { alpha: 0.75, width: 0.72 });
    dot(engine, 82.5, 39.2, 0.62, 0.94, '#242321');
    dot(engine, 82.72, 39, 0.16, 0.9, '#f8f5ee');
    const nose = shiftY([['M', 98, 36], ['C', 101, 35, 103, 38, 102, 41], ['C', 101, 44, 97, 45, 95, 42], ['C', 95, 40, 96, 37, 98, 36], ['Z']], 6);
    fill(engine, nose, '#292826', 0.98);
    dot(engine, 99.2, 42.1, 0.28, 0.5, '#f6f2e9');
    stroke(engine, shiftY([['M', 88, 43], ['Q', 93, 47, 99, 45]], 6), { alpha: 0.55, width: 0.54 });

    // Internal joint cues follow the rig's calculated stifle and elbow points.
    stroke(engine, [['M', 18, 69], ['C', 23, 62, 32, 61, 38, 68], ['C', 43, 74, 42, 82, 36, 88]], { alpha: 0.32, width: 0.58 });
    stroke(engine, [['M', 31, 68], ['Q', knee[0], knee[1], 30, 92]], { alpha: 0.32, width: 0.56 });
    stroke(engine, [['M', 57, 59], ['C', 62, 65, 63, 72, 61, 81]], { alpha: 0.28, width: 0.52 });
    stroke(engine, [['M', 70, 70], ['C', 72, 78, 74, 88, 78, 95]], { alpha: 0.25, width: 0.5 });
    stroke(engine, [['M', 53, 96], ['Q', 58, 98, 63, 97]], { alpha: 0.3, width: 0.5 });
    stroke(engine, [['M', 70, 96], ['Q', 77, 98, 84, 97]], { alpha: 0.28, width: 0.5 });

    // A cast shadow grounds the body without a hard oval outline.
    const ctx = engine.ctx;
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = '#77716a';
    ctx.beginPath();
    ctx.ellipse(0, -1.2, 38, 2.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // One light outer edge clarifies the silhouette. Fur is directional and
    // intentionally sparse on lit planes, denser across the saddle and neck.
    V.path(engine, tail, { alpha: 0.55, width: 0.68, passes: 1, wobble: 0.014 });
    V.path(engine, body, EDGE);
    V.path(engine, skull, { alpha: 0.64, width: 0.7, passes: 1, wobble: 0.014 });
    V.path(engine, farEar, { alpha: 0.58, width: 0.62, passes: 1 });
    V.path(engine, nearEar, { alpha: 0.68, width: 0.68, passes: 1 });

    V.material.fur(engine, body, { count: 640, angle: 0.28, angleJitter: 0.24, length: 3.2, spread: 1.35, alpha: 0.15, width: 0.4, ink: '#4e4943' });
    V.material.fur(engine, haunch, { count: 210, angle: 1.02, angleJitter: 0.24, length: 3.2, spread: 1.25, alpha: 0.15, width: 0.38, ink: '#514c46' });
    V.material.fur(engine, saddle, { count: 170, angle: 0.24, angleJitter: 0.2, length: 3.0, spread: 1.0, alpha: 0.13, width: 0.36, ink: '#302e2b' });
    V.material.fur(engine, skull, { count: 115, angle: 0.72, angleJitter: 0.3, length: 2.1, spread: 0.95, alpha: 0.12, width: 0.34, ink: '#514c46' });
    V.material.fur(engine, tail, { count: 80, angle: 1.12, angleJitter: 0.25, length: 3.2, spread: 1.2, alpha: 0.14, width: 0.38, ink: '#514c46' });
    V.material.fur(engine, chestPlane, { count: 175, angle: 1.08, angleJitter: 0.22, length: 3.0, spread: 1.15, alpha: 0.13, width: 0.36, ink: '#514c46' });
    V.material.fur(engine, cheek, { count: 55, angle: 0.88, angleJitter: 0.25, length: 1.25, spread: 0.7, alpha: 0.11, width: 0.3, ink: '#514c46' });

    // Deep occlusion hatching is limited to the underside of the jaw, chest,
    // haunch fold and paws; the coat itself remains open and paper-lit.
    const jaw = shiftY([['M', 84, 42], ['C', 90, 46, 97, 46, 100, 43], ['C', 96, 49, 88, 49, 83, 45], ['Z']], 6);
    V.hatch(engine, jaw, { angle: 0.72, spacing: 8.2, alpha: 0.045, width: 0.38 });
    const pawShade = [['M', 14, 95], ['C', 25, 94, 37, 97, 43, 99], ['L', 15, 100], ['Z']];
    V.hatch(engine, pawShade, { angle: 0.5, spacing: 8, alpha: 0.04, width: 0.36 });

    // Small paw divisions, whisker pads and a few whiskers add readable detail.
    [53, 56, 59].forEach(function (xx) {
      stroke(engine, [['M', xx, 96], ['L', xx + 0.35, 98.7]], { alpha: 0.25, width: 0.42, passes: 1 });
    });
    [72, 76, 80].forEach(function (xx) {
      stroke(engine, [['M', xx, 96], ['L', xx + 0.3, 98.6]], { alpha: 0.22, width: 0.4, passes: 1 });
    });
    stroke(engine, [['M', 89, 40], ['Q', 92, 39, 95, 40]], { alpha: 0.22, width: 0.42, passes: 1 });
    stroke(engine, [['M', 90, 42], ['Q', 94, 43, 97, 42]], { alpha: 0.16, width: 0.38, passes: 1 });
    void opts;
    void x;
    void y;
    void scale;
  }

  S.register({
    id: 'german-shepherd',
    aliases: ['german shepherd', 'german shepherd dog', 'alsatian', 'shepherd dog'],
    category: 'animals',
    layer: 'near',
    anchor: 'ground',
    aspect: 1.42,
    plural: 1,
    anchors: { top: [0.84, 0.06], head: [0.86, 0.31], hand: [0.9, 0.43] },
    draw: germanShepherd
  });
})(window);
