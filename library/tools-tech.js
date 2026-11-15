/* library/tools-tech.js — tools, devices and useful objects. */
(function (S) {
  'use strict';
  const add = (id, aliases, aspect, shapes) => S.register({ id, aliases, category: 'tools-tech', layer: 'near', anchor: 'ground', aspect, shapes });
  add('book', ['books', 'notebook'], 1.1, [
    ['poly', [10, 15, 48, 24, 48, 93, 10, 83], true, { hatch: true }],
    ['poly', [52, 24, 90, 15, 90, 83, 52, 93], true, false], ['line', 50, 23, 50, 94],
    ['line', 18, 34, 41, 40], ['line', 18, 47, 41, 53], ['line', 60, 40, 82, 34], ['line', 60, 53, 82, 47]
  ]);
  add('key', ['keys'], 1.25, [
    ['ellipse', 25, 37, 19, 19, false], ['ellipse', 25, 37, 8, 8, false],
    ['line', 44, 37, 94, 37], ['line', 72, 37, 72, 55], ['line', 86, 37, 86, 49]
  ]);
  add('pencil', ['pencils'], 0.75, [
    ['poly', [38, 5, 62, 5, 62, 86, 50, 100, 38, 86], true, { hatch: true }],
    ['line', 38, 16, 62, 16], ['line', 38, 77, 62, 77], ['line', 43, 8, 50, 0]
  ]);
  add('scissors', ['scissor'], 1.05, [
    ['ellipse', 25, 75, 16, 16, false], ['ellipse', 75, 75, 16, 16, false],
    ['line', 35, 65, 69, 18], ['line', 65, 65, 31, 18], ['dot', 50, 51, 3]
  ]);
  add('laptop', ['computer', 'notebook computer'], 1.35, [
    ['rect', 16, 12, 68, 60, false], ['rect', 21, 18, 58, 48, { hatch: true }],
    ['poly', [8, 75, 92, 75, 99, 87, 1, 87], true, false], ['line', 42, 81, 58, 81]
  ]);
  add('balloon', ['balloons', 'red balloon'], 0.9, [
    ['ellipse', 50, 37, 31, 37, false], ['poly', [44, 72, 56, 72, 50, 82], true, false],
    ['curve', [50, 82, 38, 87, 59, 92, 48, 100]], ['line', 34, 20, 43, 10]
  ]);
  add('lightbulb', ['bulb', 'idea'], 0.9, [
    ['ellipse', 50, 37, 30, 33, false], ['line', 35, 61, 40, 76], ['line', 65, 61, 60, 76],
    ['line', 39, 77, 61, 77], ['line', 40, 84, 60, 84], ['line', 43, 91, 57, 91],
    ['line', 50, 0, 50, -8], ['line', 8, 37, 0, 37], ['line', 92, 37, 100, 37],
    ['line', 20, 8, 13, 1], ['line', 80, 8, 87, 1]
  ]);
})(window.Sketchbook);
