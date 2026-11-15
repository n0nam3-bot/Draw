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
  add('hammer', ['hammers'], 0.8, [
    ['rect', 14, 14, 69, 15, false], ['line', 50, 28, 50, 98],
    ['line', 44, 29, 44, 98], ['line', 56, 29, 56, 98],
    ['curve', [15, 14, 8, 18, 8, 26, 15, 29]], ['line', 82, 14, 91, 14],
    ['line', 82, 29, 91, 29], ['line', 44, 95, 56, 95]
  ]);
  add('umbrella', ['umbrellas'], 1.2, [
    ['curve', [5, 51, 16, 12, 83, 12, 95, 51]], ['curve', [5, 51, 28, 39, 39, 55, 50, 51]],
    ['curve', [50, 51, 62, 39, 76, 39, 95, 51]], ['line', 50, 18, 50, 83],
    ['curve', [50, 82, 53, 99, 70, 98, 68, 85]], ['line', 26, 26, 20, 47],
    ['line', 74, 26, 80, 47]
  ]);
  add('phone', ['phones', 'smartphone', 'mobile phone'], 0.7, [
    ['rect', 23, 5, 54, 91, true], ['rect', 29, 15, 42, 68, false],
    ['line', 40, 9, 60, 9], ['ellipse', 50, 85, 4, 4, false],
    ['line', 32, 76, 68, 76], ['dot', 50, 11, 1.5], ['line', 34, 20, 66, 20]
  ]);
  add('camera', ['cameras'], 1.1, [
    ['rect', 10, 28, 80, 58, true], ['rect', 24, 18, 24, 11],
    ['ellipse', 54, 55, 23, 22, false], ['ellipse', 54, 55, 14, 14, false],
    ['dot', 83, 39, 3], ['line', 14, 74, 86, 74], ['line', 31, 28, 69, 28]
  ]);
  add('guitar', ['guitars'], 0.85, [
    ['ellipse', 50, 72, 22, 21, false], ['ellipse', 50, 49, 17, 17, false],
    ['rect', 45, 6, 10, 39, false], ['rect', 42, 1, 16, 8, false],
    ['ellipse', 50, 68, 6, 6, false], ['line', 47, 8, 47, 89], ['line', 50, 8, 50, 90],
    ['line', 53, 8, 53, 89], ['line', 45, 9, 45, 89]
  ]);
  add('telescope', ['telescopes'], 1.25, [
    ['poly', [17, 23, 81, 8, 88, 27, 23, 43], true, false],
    ['line', 43, 37, 57, 93], ['line', 58, 34, 70, 89],
    ['line', 37, 97, 78, 87], ['line', 51, 68, 22, 90],
    ['line', 23, 43, 17, 23], ['line', 81, 8, 88, 27], ['dot', 20, 33, 2]
  ]);
})(window.Sketchbook);
