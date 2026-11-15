/* library/nature.js — plants and outdoor landforms. */
(function (S) {
  'use strict';
  const add = (id, aliases, aspect, shapes, anchors) => S.register({ id, aliases, category: 'nature', layer: 'mid', anchor: 'ground', aspect, shapes, anchors: anchors || {} });
  add('tree', ['deciduous tree', 'oak', 'oak tree'], 0.88, [
    ['rect', 43, 55, 14, 45, { hatch: true }], ['ellipse', 50, 34, 35, 27, true],
    ['ellipse', 28, 43, 19, 18, false], ['ellipse', 71, 43, 19, 18, false],
    ['line', 50, 67, 28, 49], ['line', 50, 68, 74, 48], ['dot', 39, 30, 1.7], ['dot', 66, 20, 1.7]
  ]);
  add('pine tree', ['pine', 'pine trees', 'evergreen'], 0.82, [
    ['rect', 45, 76, 10, 24, { hatch: true }], ['poly', [50, 3, 19, 48, 34, 47, 10, 77, 90, 77, 66, 47, 82, 48], true, { hatch: true }],
    ['poly', [50, 23, 28, 60, 72, 60], true, false], ['line', 50, 22, 50, 92]
  ]);
  add('flower', ['blossom', 'daisy'], 0.9, [
    ['line', 50, 45, 50, 100], ['ellipse', 37, 70, 13, 8, false], ['ellipse', 63, 82, 13, 8, false],
    ['ellipse', 50, 23, 9, 15, false], ['ellipse', 50, 23, 9, 15, false], ['ellipse', 31, 32, 9, 14, false],
    ['ellipse', 69, 32, 9, 14, false], ['ellipse', 36, 12, 9, 14, false], ['ellipse', 64, 12, 9, 14, false],
    ['ellipse', 50, 24, 8, 8, true]
  ]);
  add('mushroom', ['toadstool'], 1.1, [
    ['poly', [34, 51, 39, 38, 62, 38, 68, 51, 64, 91, 38, 91], true, false],
    ['arc', 50, 51, 39, Math.PI, Math.PI * 2], ['ellipse', 50, 39, 40, 19, true],
    ['dot', 34, 35, 2.5], ['dot', 58, 27, 3], ['dot', 72, 39, 2]
  ]);
  add('cactus', ['cacti'], 0.8, [
    ['rect', 39, 34, 22, 66, { hatch: true }], ['arc', 39, 45, 16, Math.PI * 0.5, Math.PI * 1.5],
    ['arc', 39, 45, 16, Math.PI * 1.5, Math.PI * 2.5], ['line', 39, 68, 23, 68],
    ['line', 23, 68, 23, 45], ['arc', 17, 45, 7, Math.PI, Math.PI * 2],
    ['line', 61, 52, 76, 52], ['line', 76, 52, 76, 32], ['arc', 82, 32, 7, Math.PI, Math.PI * 2]
  ]);
  add('mountain', ['mountains', 'peak'], 1.35, [
    ['poly', [2, 100, 31, 28, 48, 57, 67, 8, 98, 100], true, { hatch: true }],
    ['poly', [31, 28, 43, 47, 49, 39, 48, 57], false], ['poly', [67, 8, 76, 36, 82, 27], false],
    ['line', 4, 100, 96, 100]
  ]);
  add('river', ['rivers', 'stream', 'winding river'], 1.5, [
    ['curve', [50, 0, 34, 24, 68, 44, 39, 67, 54, 100]],
    ['curve', [61, 0, 46, 24, 79, 44, 51, 67, 67, 100]],
    ['line', 44, 13, 48, 23], ['line', 59, 72, 64, 82]
  ]);
  add('hill', ['hills', 'rolling hill'], 1.45, [
    ['curve', [2, 97, 23, 58, 47, 67, 68, 42, 98, 97]],
    ['curve', [3, 97, 29, 84, 57, 88, 98, 97]]
  ]);
  add('rock', ['rocks', 'stone', 'stones'], 1.1, [
    ['poly', [5, 92, 15, 55, 37, 38, 55, 51, 68, 31, 90, 55, 98, 92], true, { hatch: true }],
    ['line', 25, 60, 46, 77], ['line', 67, 55, 83, 80]
  ]);
})(window.Sketchbook);
