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
  add('palm tree', ['palm', 'palm tree', 'palm trees'], 1.0, [
    ['curve', [48, 100, 44, 78, 54, 54, 52, 25]], ['curve', [52, 29, 30, 6, 8, 13, 4, 29]],
    ['curve', [52, 29, 40, 3, 22, 1, 16, 10]], ['curve', [52, 29, 54, 3, 72, 0, 84, 12]],
    ['curve', [52, 29, 76, 8, 94, 14, 98, 29]], ['curve', [52, 29, 82, 25, 91, 39, 94, 48]],
    ['curve', [52, 29, 26, 24, 12, 36, 8, 47]], ['line', 45, 61, 62, 61]
  ]);
  add('bush', ['bushes', 'shrub'], 1.25, [
    ['ellipse', 30, 67, 23, 22, true], ['ellipse', 51, 49, 26, 27, true], ['ellipse', 75, 66, 22, 22, true],
    ['ellipse', 45, 78, 28, 16, false], ['line', 15, 91, 87, 91], ['line', 24, 95, 75, 95]
  ]);
  add('grass', ['grass tuft', 'grass blades'], 1.2, [
    ['line', 50, 100, 12, 58], ['line', 50, 100, 25, 45], ['line', 50, 100, 43, 38],
    ['line', 50, 100, 58, 43], ['line', 50, 100, 78, 53], ['line', 50, 100, 94, 69],
    ['line', 14, 91, 4, 78], ['line', 86, 92, 98, 80]
  ]);
  add('rose', ['roses'], 0.9, [
    ['curve', [50, 99, 48, 80, 53, 61, 50, 42]], ['ellipse', 50, 29, 17, 15, false],
    ['curve', [35, 30, 29, 13, 44, 9, 50, 24]], ['curve', [50, 24, 61, 7, 76, 18, 64, 34]],
    ['curve', [35, 33, 44, 42, 54, 19, 66, 31]], ['poly', [49, 64, 26, 55, 35, 75], true, false],
    ['poly', [52, 76, 76, 58, 68, 82], true, false]
  ]);
  add('tulip', ['tulips'], 0.85, [
    ['curve', [50, 100, 51, 76, 49, 58, 50, 39]], ['curve', [33, 13, 32, 37, 42, 44, 50, 36]],
    ['curve', [50, 36, 57, 43, 68, 37, 67, 12]], ['curve', [33, 13, 45, 21, 49, 27, 50, 36]],
    ['curve', [67, 12, 57, 20, 53, 28, 50, 36]], ['poly', [49, 67, 25, 58, 34, 81], true, false],
    ['poly', [52, 78, 76, 61, 67, 88], true, false]
  ]);
  add('sunflower', ['sunflowers'], 1.0, [
    ['ellipse', 50, 35, 11, 11, true], ['ellipse', 50, 14, 7, 12, false], ['ellipse', 50, 56, 7, 12, false],
    ['ellipse', 29, 35, 12, 7, false], ['ellipse', 71, 35, 12, 7, false], ['ellipse', 35, 20, 8, 8, false],
    ['ellipse', 65, 20, 8, 8, false], ['ellipse', 35, 50, 8, 8, false], ['ellipse', 65, 50, 8, 8, false],
    ['line', 50, 46, 50, 100], ['poly', [49, 72, 27, 63, 34, 83], true, false]
  ]);
})(window.Sketchbook);
