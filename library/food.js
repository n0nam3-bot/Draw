/* library/food.js — familiar foods and treats. */
(function (S) {
  'use strict';
  const add = (id, aliases, aspect, shapes) => S.register({ id, aliases, category: 'food', layer: 'near', anchor: 'ground', aspect, shapes });
  add('apple', ['apples'], 0.95, [
    ['ellipse', 50, 58, 31, 35, false], ['curve', [50, 24, 48, 12, 57, 5]],
    ['ellipse', 67, 16, 15, 8, false], ['line', 50, 21, 50, 10], ['curve', [50, 39, 41, 45, 39, 57]]
  ]);
  add('banana', ['bananas'], 1.35, [
    ['curve', [10, 30, 28, 66, 58, 84, 92, 57]], ['curve', [13, 23, 35, 53, 62, 65, 92, 51]],
    ['line', 10, 30, 6, 20], ['line', 92, 57, 97, 47], ['curve', [29, 51, 48, 67, 72, 69]]
  ]);
  add('pizza', ['pizza slice', 'pizza slices'], 1.2, [
    ['poly', [7, 18, 94, 28, 53, 97], true, { hatch: true }], ['curve', [7, 18, 43, 30, 94, 28]],
    ['dot', 39, 35, 4], ['dot', 66, 39, 4], ['dot', 56, 62, 4], ['curve', [26, 29, 47, 40, 75, 37]]
  ]);
  add('burger', ['hamburger', 'burgers'], 1.25, [
    ['arc', 50, 49, 39, Math.PI, Math.PI * 2], ['rect', 11, 49, 78, 14, false],
    ['curve', [12, 57, 29, 50, 40, 61, 59, 53, 88, 61]], ['rect', 14, 64, 72, 10, { hatch: true }],
    ['arc', 50, 76, 37, 0, Math.PI], ['dot', 35, 25, 2], ['dot', 60, 18, 2], ['dot', 72, 30, 2]
  ]);
  add('cake', ['birthday cake', 'cakes'], 1.2, [
    ['rect', 12, 48, 76, 45, { hatch: true }], ['rect', 7, 40, 86, 13, false],
    ['curve', [10, 42, 25, 48, 38, 42, 53, 47, 69, 41, 90, 46]],
    ['line', 28, 39, 28, 18], ['line', 50, 39, 50, 11], ['line', 72, 39, 72, 18],
    ['poly', [24, 17, 28, 8, 32, 17], true, false], ['poly', [46, 10, 50, 0, 54, 10], true, false],
    ['poly', [68, 17, 72, 8, 76, 17], true, false]
  ]);
})(window.Sketchbook);
