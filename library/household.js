/* library/household.js — furniture and everyday household objects. */
(function (S) {
  'use strict';
  const add = (id, aliases, aspect, shapes, anchors) => S.register({ id, aliases, category: 'household', layer: 'near', anchor: 'ground', aspect, shapes, anchors: anchors || {} });
  add('table', ['tables', 'dining table'], 1.35, [
    ['rect', 7, 29, 86, 13, false], ['line', 17, 42, 12, 100], ['line', 83, 42, 88, 100],
    ['line', 27, 42, 25, 93], ['line', 73, 42, 75, 93]
  ], { top: [0.5, 0.3], inside: [0.5, 0.53] });
  add('chair', ['chairs'], 0.9, [
    ['rect', 18, 8, 64, 54, false], ['rect', 18, 60, 64, 12, { hatch: true }],
    ['line', 24, 72, 19, 100], ['line', 76, 72, 81, 100], ['line', 24, 16, 24, 55], ['line', 76, 16, 76, 55]
  ], { top: [0.5, 0.08] });
  add('sofa', ['couch', 'sofas'], 1.5, [
    ['rect', 12, 30, 76, 46, true], ['rect', 5, 43, 14, 45, false], ['rect', 81, 43, 14, 45, false],
    ['rect', 18, 27, 29, 39, false], ['rect', 53, 27, 29, 39, false],
    ['line', 20, 77, 17, 94], ['line', 80, 77, 83, 94]
  ]);
  add('lamp', ['lamps', 'desk lamp'], 0.9, [
    ['poly', [22, 40, 40, 5, 60, 5, 78, 40], true, false], ['line', 50, 40, 50, 88],
    ['poly', [30, 88, 70, 88, 80, 99, 20, 99], true, { hatch: true }],
    ['line', 50, 51, 36, 69], ['line', 50, 51, 65, 69]
  ]);
  add('clock', ['wall clock', 'clocks'], 0.9, [
    ['ellipse', 50, 50, 39, 39, false], ['ellipse', 50, 50, 33, 33, false],
    ['line', 50, 50, 50, 24], ['line', 50, 50, 69, 60], ['dot', 50, 50, 3],
    ['dot', 50, 18, 1.4], ['dot', 82, 50, 1.4], ['dot', 50, 82, 1.4], ['dot', 18, 50, 1.4]
  ]);
  add('sign', ['signs', 'wooden sign', 'signboard'], 1.25, [
    ['rect', 8, 13, 84, 51, { hatch: true }], ['line', 50, 64, 50, 100],
    ['line', 41, 100, 59, 100], ['line', 15, 24, 85, 24], ['line', 15, 55, 85, 55]
  ], { inside: [0.5, 0.38] });
  add('bed', ['beds'], 1.5, [
    ['rect', 8, 45, 84, 39, false], ['rect', 8, 27, 12, 57, { hatch: true }],
    ['rect', 22, 32, 28, 15, false], ['rect', 53, 32, 34, 13, false],
    ['line', 13, 84, 10, 100], ['line', 88, 84, 91, 100], ['curve', [50, 48, 61, 61, 80, 52]]
  ]);
})(window.Sketchbook);
