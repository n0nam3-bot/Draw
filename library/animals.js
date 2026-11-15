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
  add('cow', ['cows', 'calf'], 1.2, [
    ['ellipse', 48, 61, 35, 24, true], ['ellipse', 78, 39, 18, 18, false], ['ellipse', 91, 43, 9, 8, false],
    ['poly', [68, 26, 67, 10, 80, 19], true, false], ['poly', [84, 24, 98, 14, 96, 32], true, false],
    ['rect', 25, 78, 8, 21], ['rect', 63, 78, 8, 21], ['ellipse', 37, 55, 10, 8, false],
    ['dot', 82, 35, 1.8], ['dot', 94, 43, 1.2], ['curve', [14, 56, 5, 48, 9, 39]]
  ]);
  add('pig', ['pigs', 'piglet'], 1.0, [
    ['ellipse', 48, 62, 33, 25, true], ['ellipse', 75, 42, 21, 19, false], ['ellipse', 91, 48, 10, 8, false],
    ['poly', [61, 30, 59, 12, 76, 25], true, false], ['poly', [79, 25, 96, 13, 93, 34], true, false],
    ['dot', 87, 47, 1.5], ['dot', 95, 47, 1.5], ['line', 29, 81, 28, 99], ['line', 58, 82, 61, 99],
    ['curve', [15, 58, 3, 52, 9, 42, 16, 49]]
  ]);
  add('lion', ['lions', 'lioness'], 1.15, [
    ['ellipse', 48, 55, 39, 37, true], ['ellipse', 51, 54, 24, 25, false], ['ellipse', 38, 47, 4, 4, false],
    ['ellipse', 64, 47, 4, 4, false], ['poly', [47, 58, 52, 62, 57, 58], false, false],
    ['curve', [49, 65, 52, 71, 57, 65]], ['line', 28, 81, 24, 100], ['line', 68, 81, 74, 100],
    ['curve', [82, 63, 99, 54, 94, 40]], ['ellipse', 95, 38, 5, 6, false]
  ]);
  add('bear', ['bears', 'grizzly'], 1.1, [
    ['ellipse', 49, 62, 32, 27, true], ['ellipse', 53, 31, 23, 22, false], ['ellipse', 37, 15, 8, 9, false],
    ['ellipse', 69, 15, 8, 9, false], ['ellipse', 53, 42, 12, 9, false], ['dot', 46, 29, 2],
    ['dot', 61, 29, 2], ['dot', 53, 40, 2], ['line', 30, 82, 27, 100], ['line', 68, 82, 72, 100]
  ]);
  add('snake', ['snakes', 'serpent'], 1.3, [
    ['curve', [5, 92, 25, 78, 75, 87, 87, 64, 95, 48, 78, 34, 56, 47, 32, 41, 26, 22]],
    ['ellipse', 26, 18, 15, 12, false], ['dot', 21, 16, 1.8], ['dot', 31, 16, 1.8],
    ['curve', [25, 27, 29, 34, 36, 31]], ['line', 18, 27, 11, 32], ['line', 34, 27, 41, 31],
    ['curve', [50, 54, 56, 61, 65, 59]], ['curve', [68, 76, 74, 69, 80, 70]]
  ]);
  add('turtle', ['turtles', 'tortoise'], 1.2, [
    ['ellipse', 48, 57, 32, 25, true], ['curve', [19, 57, 24, 26, 53, 23, 78, 55]],
    ['ellipse', 86, 54, 12, 12, false], ['dot', 90, 51, 1.8], ['ellipse', 23, 82, 9, 8, false],
    ['ellipse', 70, 82, 9, 8, false], ['ellipse', 29, 34, 8, 8, false], ['ellipse', 65, 34, 8, 8, false],
    ['line', 42, 45, 49, 58], ['line', 60, 44, 53, 58], ['line', 49, 58, 48, 73]
  ]);
})(window.Sketchbook);
