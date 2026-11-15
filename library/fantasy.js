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
  add('mermaid', ['mermaids'], 0.9, [
    ['ellipse', 50, 17, 15, 15, false], ['curve', [41, 33, 29, 42, 36, 62, 50, 68]],
    ['curve', [59, 33, 71, 42, 64, 62, 50, 68]], ['curve', [50, 65, 31, 72, 28, 88, 50, 97]],
    ['curve', [50, 65, 69, 72, 72, 88, 50, 97]], ['poly', [50, 96, 25, 88, 37, 78], true, false],
    ['poly', [50, 96, 75, 88, 63, 78], true, false], ['curve', [38, 14, 27, 30, 37, 43, 47, 35]]
  ]);
  add('fairy', ['fairies'], 0.9, [
    ['ellipse', 50, 20, 13, 13, false], ['line', 50, 33, 50, 70],
    ['line', 50, 43, 30, 59], ['line', 50, 43, 70, 59], ['line', 50, 70, 38, 95],
    ['line', 50, 70, 62, 95], ['ellipse', 28, 35, 16, 9, false], ['ellipse', 72, 35, 16, 9, false],
    ['ellipse', 33, 53, 13, 8, false], ['ellipse', 67, 53, 13, 8, false],
    ['line', 50, 6, 56, 0], ['dot', 57, 0, 2]
  ]);
  add('monster', ['monsters'], 1.15, [
    ['ellipse', 50, 57, 35, 35, true], ['line', 32, 29, 22, 8], ['line', 68, 29, 78, 8],
    ['dot', 39, 48, 4], ['dot', 62, 48, 4], ['curve', [35, 68, 41, 83, 60, 83, 67, 68]],
    ['poly', [43, 70, 47, 78, 51, 70], true, false], ['poly', [55, 70, 59, 78, 63, 70], true, false],
    ['line', 30, 83, 18, 98], ['line', 70, 83, 82, 98]
  ]);
  add('phoenix', ['phoenixes', 'phoenix bird'], 1.2, [
    ['ellipse', 51, 51, 16, 25, false], ['ellipse', 65, 27, 13, 13, false],
    ['poly', [77, 26, 94, 30, 78, 35], true, false], ['curve', [39, 51, 17, 27, 5, 42, 25, 69, 43, 67]],
    ['curve', [61, 50, 83, 27, 96, 42, 77, 69, 58, 67]], ['line', 45, 73, 33, 96],
    ['line', 57, 73, 69, 96], ['curve', [39, 83, 27, 95, 20, 92]], ['curve', [61, 83, 73, 95, 80, 92]],
    ['dot', 68, 24, 2]
  ]);
  add('griffin', ['griffins'], 1.2, [
    ['ellipse', 45, 62, 30, 23, false], ['ellipse', 72, 35, 17, 17, false],
    ['poly', [82, 36, 99, 43, 82, 48], true, false], ['poly', [65, 22, 79, 4, 80, 30], true, false],
    ['curve', [62, 30, 44, 9, 26, 18, 39, 42]], ['line', 27, 54, 8, 37],
    ['line', 29, 78, 25, 99], ['line', 58, 79, 63, 99], ['line', 82, 50, 91, 68],
    ['dot', 74, 32, 2]
  ]);
  add('centaur', ['centaurs'], 1.3, [
    ['ellipse', 51, 66, 34, 21, false], ['ellipse', 73, 49, 15, 13, false],
    ['ellipse', 47, 20, 13, 13, false], ['rect', 39, 34, 17, 27],
    ['line', 40, 40, 26, 57], ['line', 55, 40, 66, 56],
    ['line', 30, 78, 23, 98], ['line', 51, 82, 49, 99],
    ['line', 68, 82, 76, 99], ['line', 83, 75, 91, 96],
    ['curve', [31, 62, 18, 53, 10, 67]]
  ]);
})(window.Sketchbook);
