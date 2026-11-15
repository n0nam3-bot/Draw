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
  add('window', ['windows'], 0.9, [
    ['rect', 14, 12, 72, 77, true], ['line', 50, 13, 50, 88], ['line', 15, 50, 85, 50],
    ['line', 21, 19, 43, 42], ['line', 57, 58, 79, 81], ['rect', 8, 7, 84, 7]
  ]);
  add('door', ['doors'], 0.85, [
    ['rect', 18, 7, 64, 91, false], ['rect', 28, 18, 44, 31, false],
    ['rect', 28, 56, 44, 42, false], ['dot', 70, 54, 2.5],
    ['line', 12, 99, 88, 99], ['line', 18, 7, 82, 7]
  ]);
  add('bookshelf', ['bookcase', 'bookshelves'], 1.0, [
    ['rect', 17, 8, 66, 90, true], ['line', 17, 38, 83, 38], ['line', 17, 67, 83, 67],
    ['rect', 24, 15, 10, 22], ['rect', 37, 12, 11, 25], ['rect', 51, 18, 12, 19],
    ['rect', 67, 13, 9, 24], ['rect', 24, 43, 14, 22], ['rect', 43, 45, 10, 20],
    ['rect', 58, 42, 17, 23], ['rect', 25, 74, 13, 20], ['rect', 44, 76, 12, 18], ['rect', 61, 73, 14, 21]
  ]);
  add('teapot', ['teapots'], 1.1, [
    ['ellipse', 50, 59, 29, 24, false], ['ellipse', 50, 32, 13, 8, false],
    ['curve', [22, 54, 4, 42, 7, 73, 24, 67]], ['curve', [77, 50, 99, 35, 91, 26, 76, 43]],
    ['line', 36, 83, 32, 93], ['line', 64, 83, 68, 93], ['line', 32, 93, 68, 93],
    ['line', 43, 31, 57, 31], ['dot', 50, 26, 2]
  ]);
  add('candle', ['candles'], 0.65, [
    ['rect', 31, 34, 38, 61, true], ['curve', [50, 34, 39, 24, 48, 12, 50, 5]],
    ['curve', [50, 5, 63, 18, 58, 27, 50, 34]], ['line', 50, 34, 50, 43],
    ['line', 31, 45, 69, 45], ['line', 31, 86, 69, 86], ['line', 25, 98, 75, 98]
  ]);
  add('mirror', ['mirrors'], 0.8, [
    ['ellipse', 50, 43, 29, 37, false], ['ellipse', 50, 43, 23, 31, false],
    ['line', 50, 80, 50, 94], ['line', 37, 96, 63, 96],
    ['curve', [36, 26, 43, 15, 56, 14, 64, 26]], ['line', 35, 55, 46, 32],
    ['dot', 58, 52, 2]
  ]);
})(window.Sketchbook);
