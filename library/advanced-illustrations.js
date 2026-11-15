/* library/advanced-illustrations.js — benchmark subjects built with the shared illustration toolkit. */
(function (S) {
  'use strict';
  const I = S.illustration;
  if (!I) throw new Error('Load illustration-tools.js before advanced-illustrations.js.');
  const B = { alpha: 0.67, width: 1.0, passes: 1, wobble: 0.038 };
  const L = { alpha: 0.36, width: 0.68, passes: 1, wobble: 0.022, overshoot: false };
  const D = { alpha: 0.84, width: 1.15, passes: 1, wobble: 0.03 };

  function register(id, aliases, category, aspect, layer, draw, extra) {
    S.register(Object.assign({ id, aliases, category, aspect, layer, anchor: 'ground', draw }, extra || {}));
  }

  function germanShepherd(e) {
    // One connected silhouette defines the pose; internal strokes follow the
    // shoulder, rib cage, haunch and limb joints rather than drawing circles
    // for each body part.
    I.shadow(e, 50, 99, 34, 2.2, 28);

    // Bushy tail sits behind the haunch and tapers toward its dark tip.
    I.form(e, [29, 59, 22, 64, 13, 71, 7, 80, 8, 88, 14, 90, 20, 84, 26, 76], B);
    I.path(e, [27, 64, 18, 72, 12, 81, 13, 87], L);
    I.textureStroke(e, [25, 67, 18, 74, 10, 84], 34, { spread: 3.4, minLength: 2.2, maxLength: 6.2 });

    // Continuous seated shepherd silhouette: deep chest, sloping back,
    // folded rear leg, two weight-bearing forelegs and long wedge-shaped head.
    I.form(e, [
      20, 63, 22, 53, 28, 47, 38, 43, 49, 44, 58, 48,
      63, 46, 65, 37, 69, 28, 75, 21, 82, 18, 89, 22,
      92, 29, 99, 34, 100, 38, 96, 42, 89, 44, 84, 43,
      80, 49, 78, 61, 77, 72, 80, 86, 87, 92, 91, 97,
      87, 99, 71, 99, 68, 95, 66, 82, 64, 73, 61, 78,
      59, 90, 64, 95, 68, 99, 49, 99, 46, 95, 47, 85,
      43, 82, 39, 88, 38, 95, 34, 99, 16, 99, 13, 96,
      18, 90, 21, 81, 19, 73, 17, 68
    ], B);

    // Rear haunch is defined by a curved stifle and hock line, not a separate
    // outlined ball. Light hatch follows the direction of the coat.
    I.path(e, [23, 66, 29, 61, 38, 63, 43, 71, 42, 79, 37, 86], { alpha: 0.62, width: 1.05, passes: 2 });
    I.path(e, [26, 73, 32, 70, 38, 74, 37, 82], L);
    I.hatch(e, [25, 73, 32, 68, 40, 73, 41, 81, 34, 88, 26, 85], 0.92, 5, true, 1, 0.16);

    // Rib cage and shoulder planes, softly separated by contour strokes.
    I.path(e, [27, 55, 36, 49, 47, 49, 57, 54], { alpha: 0.64, width: 1.0, passes: 2 });
    I.path(e, [29, 67, 37, 72, 48, 73, 58, 68], L);
    I.path(e, [45, 52, 51, 57, 55, 65, 53, 73], L);
    I.path(e, [54, 49, 61, 55, 65, 65, 65, 76], { alpha: 0.72, width: 1.05, passes: 2 });
    I.hatch(e, [28, 65, 36, 69, 49, 70, 58, 67, 57, 77, 45, 83, 31, 80], 0.72, 6, true, 1, 0.13);

    // Front legs are integrated into the torso silhouette and show elbow,
    // wrist and paw transitions. Near leg receives the stronger graphite edge.
    I.path(e, [56, 61, 58, 70, 57, 81, 57, 92], { alpha: 0.75, width: 1.25, passes: 2 });
    I.path(e, [63, 64, 67, 74, 68, 87, 71, 95], { alpha: 0.65, width: 0.95, passes: 2 });
    I.path(e, [73, 56, 75, 68, 76, 82, 81, 93], L);
    I.path(e, [60, 82, 64, 84, 67, 83], L);
    I.hatch(e, [55, 76, 62, 80, 64, 91, 60, 96, 54, 93], 0.8, 6, false, 1, 0.13);
    I.hatch(e, [72, 79, 77, 84, 81, 94, 76, 97, 71, 92], 0.8, 6, false, 1, 0.11);

    // Neck ruff grows forward from the shoulder into the skull; loose coat
    // points break the silhouette at the throat and chest.
    I.path(e, [54, 50, 59, 41, 62, 32, 69, 25, 76, 22], { alpha: 0.8, width: 1.25, passes: 2 });
    I.path(e, [65, 42, 69, 49, 72, 56, 69, 64], L);
    for (let i = 0; i < 9; i += 1) {
      const x = 56 + i * 1.45;
      I.path(e, [x, 54 + i * 0.8, x - 2.1, 62 + i * 0.65, x + 0.7, 69 + i * 0.75], { alpha: 0.42, width: 0.72, passes: 1 });
    }

    // Skull and tapered muzzle. A shallow brow, cheek plane and nose bridge
    // create the long, alert German Shepherd profile.
    I.path(e, [67, 31, 70, 23, 77, 19, 85, 20, 91, 27, 91, 34], { alpha: 0.88, width: 1.45, passes: 2 });
    I.path(e, [70, 34, 75, 40, 82, 42, 89, 40], { alpha: 0.72, width: 1.0, passes: 2 });
    I.form(e, [81, 30, 89, 28, 97, 33, 100, 37, 96, 42, 89, 44, 83, 40, 78, 36], { alpha: 0.82, width: 1.15, passes: 2 });
    I.path(e, [83, 35, 89, 34, 96, 37], L);
    I.path(e, [86, 41, 91, 44, 96, 42], { alpha: 0.68, width: 0.85, passes: 1 });

    // Upright ears have a broad base, tapered tips and recessed inner planes.
    I.form(e, [68, 25, 65, 5, 70, 2, 79, 22], { alpha: 0.85, width: 1.2, passes: 2 });
    I.form(e, [80, 22, 87, 3, 92, 7, 90, 28], { alpha: 0.85, width: 1.2, passes: 2 });
    I.path(e, [69, 18, 69, 7, 75, 20], L);
    I.path(e, [84, 19, 89, 8, 88, 23], L);
    I.hatch(e, [71, 17, 69, 8, 75, 19], 0.78, 4.6, false, 1, 0.15);
    I.hatch(e, [83, 19, 89, 8, 88, 23], 0.78, 4.6, false, 1, 0.15);

    // The dark saddle and facial mask are characteristic coat markings.
    const saddle = [27, 52, 34, 46, 45, 46, 56, 51, 62, 58, 60, 65, 51, 62, 40, 61, 30, 60];
    I.hatch(e, saddle, 0.72, 3.9, true, 2, 0.3);
    I.hatch(e, [31, 53, 42, 49, 53, 53, 58, 60, 48, 59, 37, 58], 1.52, 4.2, false, 1, 0.28);
    const mask = [70, 24, 77, 19, 85, 21, 90, 28, 86, 32, 80, 29, 75, 34, 70, 31];
    I.hatch(e, mask, 0.8, 3.7, true, 2, 0.31);
    I.hatch(e, [73, 29, 78, 27, 84, 30, 81, 35, 76, 35], 1.55, 4.1, false, 1, 0.23);

    // Eyes sit below the brow ridge; nose, nostril, lips and whisker follicles.
    I.path(e, [74, 27, 77, 25, 80, 26], { alpha: 0.86, width: 1.35, passes: 2 });
    I.ellipse(e, 77.5, 28, 1.7, 1.4, D);
    I.circle(e, 78, 27.5, 0.5, { alpha: 0.7, width: 0.5, passes: 1 });
    I.path(e, [84, 28, 86, 27, 88, 28], { alpha: 0.55, width: 0.75, passes: 1 });
    I.circle(e, 86, 28.2, 0.7, { alpha: 0.66, width: 0.6, passes: 1 });
    I.form(e, [94, 32, 99, 33, 100, 37, 96, 39, 92, 37], D);
    I.circle(e, 97, 35, 0.7, { alpha: 0.8, width: 0.5, passes: 1 });
    I.path(e, [91, 40, 94, 42, 98, 40], { alpha: 0.72, width: 0.8, passes: 1 });
    for (let i = 0; i < 4; i += 1) I.line(e, 88 + i * 1.6, 44, 94 + i * 1.4, 46 + i * 1.2, { alpha: 0.26, width: 0.52, passes: 1 });

    // Fine coat direction changes across the back, flank, thigh and ruff.
    I.textureStroke(e, [28, 52, 36, 48, 46, 49, 57, 55], 52, { spread: 4.6, minLength: 2, maxLength: 6 });
    I.textureStroke(e, [25, 69, 32, 73, 41, 78, 39, 86], 56, { spread: 5.0, minLength: 2.3, maxLength: 6.5 });
    I.textureStroke(e, [53, 45, 59, 51, 64, 60, 64, 70], 48, { spread: 3.8, minLength: 2.1, maxLength: 5.8 });
    I.textureStroke(e, [70, 22, 77, 18, 84, 22, 89, 29], 24, { spread: 2.6, minLength: 1.6, maxLength: 4.2 });
    I.textureStroke(e, [54, 72, 57, 81, 58, 91, 62, 96], 28, { spread: 2.4, minLength: 2, maxLength: 4.8 });
    I.textureStroke(e, [73, 69, 76, 80, 80, 90, 82, 96], 26, { spread: 2.4, minLength: 2, maxLength: 4.8 });

    // Paw separations and ground-contact marks keep the seated weight visible.
    [53, 57, 61].forEach(function (x) { I.path(e, [x, 95, x + 0.2, 97, x + 0.1, 98], L); });
    [75, 79, 83].forEach(function (x) { I.path(e, [x, 94, x + 0.2, 96, x + 0.1, 98], L); });
    I.path(e, [17, 96, 26, 97, 34, 95], L);
  }

  register('german-shepherd', ['german shepherd', 'german shepherd dog', 'alsatian', 'shepherd dog'], 'animals', 1.12, 'near', germanShepherd, {
    plural: 1,
    anchors: { top: [0.76, 0.18], head: [0.78, 0.28], hand: [0.91, 0.42] }
  });

})(window.Sketchbook);
