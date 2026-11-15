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
  add('orange', ['oranges'], 0.9, [
    ['ellipse', 50, 58, 30, 29, true], ['line', 50, 29, 50, 23], ['ellipse', 61, 26, 10, 5, false],
    ['dot', 42, 48, 1], ['dot', 59, 62, 1], ['dot', 38, 69, 1], ['dot', 66, 46, 1],
    ['curve', [50, 23, 54, 19, 60, 20]]
  ]);
  add('grapes', ['grape', 'bunch of grapes'], 0.9, [
    ['curve', [50, 13, 48, 6, 55, 3, 62, 8]], ['ellipse', 43, 29, 10, 10, false],
    ['ellipse', 58, 29, 10, 10, false], ['ellipse', 34, 46, 10, 10, false],
    ['ellipse', 50, 46, 10, 10, false], ['ellipse', 66, 46, 10, 10, false],
    ['ellipse', 42, 63, 10, 10, false], ['ellipse', 58, 63, 10, 10, false],
    ['ellipse', 50, 80, 10, 10, false], ['line', 50, 12, 50, 18]
  ]);
  add('sandwich', ['sandwiches'], 1.25, [
    ['poly', [12, 38, 50, 10, 89, 38], true, false], ['poly', [12, 38, 89, 38, 78, 77, 24, 77], true, false],
    ['curve', [17, 45, 37, 38, 60, 48, 84, 42]], ['line', 22, 55, 80, 55],
    ['curve', [25, 66, 45, 58, 62, 68, 77, 61]], ['line', 24, 78, 78, 78],
    ['line', 12, 38, 24, 77], ['line', 89, 38, 78, 77]
  ]);
  add('hot dog', ['hotdog', 'hot dogs'], 1.4, [
    ['ellipse', 50, 52, 45, 22, false], ['ellipse', 50, 52, 34, 12, false],
    ['curve', [18, 49, 27, 27, 73, 27, 82, 49]], ['curve', [18, 56, 27, 78, 73, 78, 82, 56]],
    ['curve', [23, 51, 36, 39, 45, 61, 58, 46, 74, 53]], ['line', 14, 43, 86, 43],
    ['line', 14, 62, 86, 62]
  ]);
  add('donut', ['doughnut', 'donuts', 'doughnuts'], 1.0, [
    ['ellipse', 50, 54, 38, 31, false], ['ellipse', 50, 54, 13, 12, false],
    ['curve', [16, 49, 23, 22, 77, 22, 84, 49]], ['curve', [18, 61, 34, 78, 67, 79, 82, 60]],
    ['line', 31, 35, 37, 30], ['line', 62, 32, 67, 38], ['line', 71, 60, 65, 65],
    ['line', 34, 64, 29, 59], ['dot', 49, 29, 2], ['dot', 58, 72, 2]
  ]);
  add('cupcake', ['cupcakes'], 0.9, [
    ['poly', [26, 53, 74, 53, 66, 92, 34, 92], true, false],
    ['ellipse', 50, 47, 26, 22, false], ['ellipse', 36, 40, 14, 15, false],
    ['ellipse', 64, 40, 14, 15, false], ['ellipse', 50, 26, 13, 15, false],
    ['dot', 50, 10, 3], ['line', 36, 62, 64, 62], ['line', 39, 76, 61, 76],
    ['line', 44, 54, 44, 91], ['line', 56, 54, 56, 91]
  ]);
})(window.Sketchbook);
