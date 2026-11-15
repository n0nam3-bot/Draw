/* library/fantasy.js — imaginative creatures, kept friendly and readable. */
(function (S) {
  'use strict';
  const add = (id, aliases, aspect, shapes) => S.register({ id, aliases, category: 'fantasy', layer: 'near', anchor: 'ground', aspect, shapes });
  add('dragon', ['dragons', 'baby dragon'], 1.35, [
    ['ellipse', 50, 64, 27, 20, true], ['ellipse', 78, 53, 17, 15, false],
    ['poly', [72, 42, 65, 17, 90, 34, 96, 47], true, false],
    ['poly', [28, 54, 4, 23, 42, 37, 50, 47], true, false],
    ['curve', [38, 71, 22, 83, 13, 69]], ['line', 37, 79, 31, 99], ['line', 62, 79, 68, 99],
    ['dot', 83, 49, 2], ['poly', [94, 55, 99, 60, 91, 62], true, false], ['line', 91, 37, 99, 33]
  ]);
  add('unicorn', ['unicorns'], 1.15, [
    ['ellipse', 48, 60, 30, 25, false], ['ellipse', 75, 31, 19, 19, false],
    ['poly', [70, 13, 78, -7, 83, 15], true, false], ['poly', [61, 20, 58, 2, 74, 16], true, false],
    ['line', 31, 78, 28, 100], ['line', 61, 79, 65, 100], ['curve', [29, 49, 12, 36, 18, 23]],
    ['curve', [63, 48, 77, 53, 87, 43]], ['dot', 80, 29, 2]
  ]);
  add('ghost', ['ghosts'], 0.9, [
    ['arc', 50, 48, 35, Math.PI, Math.PI * 2], ['line', 15, 48, 15, 83],
    ['curve', [15, 83, 28, 68, 39, 86, 51, 78, 64, 88, 76, 72, 85, 83]],
    ['line', 85, 83, 85, 48], ['dot', 39, 48, 3], ['dot', 62, 48, 3],
    ['curve', [43, 61, 50, 67, 58, 61]]
  ]);
})(window.Sketchbook);
