/* library/animals.js — recognizable animal silhouettes and simple details. */
(function (S) {
  'use strict';
  const add = (id, aliases, aspect, shapes, layer) => S.register({ id, aliases, category: 'animals', layer: layer || 'near', anchor: 'ground', aspect, shapes });
  add('cat', ['kitty', 'kitten', 'feline'], 1.05, [
    ['ellipse', 50, 61, 29, 24, true], ['ellipse', 52, 27, 22, 20, false],
    ['poly', [32, 18, 35, 1, 48, 14], true, false], ['poly', [57, 14, 72, 1, 73, 21], true, false],
    ['dot', 44, 27, 1.8], ['dot', 60, 27, 1.8], ['poly', [47, 36, 52, 39, 57, 36], false],
    ['curve', [52, 39, 49, 46, 42, 43]], ['curve', [52, 39, 58, 46, 65, 43]],
    ['curve', [24, 69, 8, 57, 13, 43, 23, 50]], ['line', 35, 78, 31, 98], ['line', 63, 78, 67, 98]
  ]);
  add('dog', ['puppy', 'canine'], 1.1, [
    ['ellipse', 50, 64, 32, 23, true], ['ellipse', 53, 30, 23, 21, false],
    ['ellipse', 30, 35, 10, 20, false], ['ellipse', 75, 35, 10, 20, false],
    ['ellipse', 55, 41, 14, 10, false], ['dot', 46, 27, 1.8], ['dot', 64, 27, 1.8],
    ['dot', 55, 38, 2.5], ['curve', [44, 46, 52, 54, 62, 46]],
    ['line', 34, 82, 30, 100], ['line', 66, 82, 70, 100], ['curve', [80, 59, 96, 45, 91, 35]]
  ]);
  add('bird', ['birds', 'small bird'], 1.15, [
    ['ellipse', 48, 58, 28, 18, true], ['ellipse', 68, 39, 17, 15, false],
    ['poly', [80, 39, 99, 45, 81, 51], true, false], ['poly', [35, 54, 17, 34, 44, 47], true, false],
    ['dot', 73, 36, 1.8], ['line', 46, 75, 42, 95], ['line', 60, 74, 63, 95],
    ['line', 39, 95, 32, 97], ['line', 63, 95, 71, 97]
  ]);
  add('fish', ['fishes'], 1.25, [
    ['ellipse', 48, 53, 34, 23, true], ['poly', [79, 53, 99, 32, 99, 74], true, false],
    ['poly', [43, 31, 54, 16, 63, 35], true, false], ['poly', [42, 75, 55, 88, 64, 73], true, false],
    ['dot', 26, 46, 2], ['curve', [36, 59, 44, 66, 53, 59]]
  ], 'mid');
  add('elephant', ['elephants'], 1.25, [
    ['ellipse', 48, 61, 35, 27, true], ['ellipse', 73, 39, 20, 20, false],
    ['ellipse', 60, 39, 15, 21, false], ['ellipse', 83, 43, 13, 20, false],
    ['curve', [85, 50, 94, 63, 85, 78, 79, 73]], ['dot', 78, 35, 2],
    ['rect', 27, 77, 10, 23], ['rect', 58, 77, 10, 23], ['line', 16, 58, 8, 49]
  ]);
  add('rabbit', ['bunny', 'rabbits'], 0.9, [
    ['ellipse', 49, 65, 29, 24, true], ['ellipse', 52, 35, 20, 19, false],
    ['ellipse', 40, 12, 7, 22, false], ['ellipse', 62, 11, 7, 22, false],
    ['dot', 45, 32, 1.8], ['dot', 61, 32, 1.8], ['dot', 53, 42, 2],
    ['line', 29, 86, 28, 100], ['line', 68, 84, 74, 100], ['ellipse', 78, 78, 8, 8, false]
  ]);
  add('horse', ['horses', 'pony'], 1.2, [
    ['ellipse', 47, 56, 36, 20, true], ['poly', [62, 51, 71, 18, 88, 16, 82, 48], true, false],
    ['ellipse', 85, 25, 13, 13, false], ['line', 80, 14, 78, 4], ['line', 89, 14, 94, 4],
    ['rect', 23, 68, 9, 31], ['rect', 61, 68, 9, 31], ['curve', [14, 49, 4, 61, 13, 75]],
    ['line', 68, 20, 56, 9], ['dot', 89, 23, 1.8]
  ]);
  add('butterfly', ['butterflies'], 1.15, [
    ['ellipse', 50, 53, 5, 30, true], ['ellipse', 28, 36, 23, 25, false],
    ['ellipse', 73, 36, 23, 25, false], ['ellipse', 29, 75, 17, 14, false], ['ellipse', 72, 75, 17, 14, false],
    ['curve', [47, 27, 36, 4, 28, 10]], ['curve', [53, 27, 65, 4, 74, 10]],
    ['dot', 28, 36, 3], ['dot', 72, 36, 3]
  ], 'mid');
})(window.Sketchbook);
