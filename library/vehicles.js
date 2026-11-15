/* library/vehicles.js — land, air and water transport. */
(function (S) {
  'use strict';
  const add = (id, aliases, aspect, shapes, anchor) => S.register({ id, aliases, category: 'vehicles', layer: 'near', anchor: anchor || 'ground', aspect, shapes });
  add('car', ['automobile', 'cars', 'vehicle'], 1.55, [
    ['poly', [5, 67, 14, 49, 35, 43, 49, 22, 75, 22, 91, 48, 98, 58, 97, 78, 5, 78], true, { hatch: true }],
    ['line', 37, 46, 78, 46], ['line', 52, 25, 52, 46], ['ellipse', 25, 78, 11, 11, false],
    ['ellipse', 77, 78, 11, 11, false], ['dot', 15, 61, 3], ['rect', 87, 59, 8, 7, false]
  ]);
  add('bicycle', ['bike', 'bicycles'], 1.5, [
    ['ellipse', 20, 76, 18, 18, false], ['ellipse', 82, 76, 18, 18, false],
    ['line', 20, 76, 48, 48], ['line', 48, 48, 82, 76], ['line', 20, 76, 55, 76],
    ['line', 55, 76, 48, 48], ['line', 48, 48, 75, 43], ['line', 75, 43, 82, 76],
    ['line', 44, 42, 53, 42], ['line', 75, 43, 82, 34], ['line', 76, 34, 88, 34]
  ]);
  add('airplane', ['plane', 'aircraft'], 1.55, [
    ['poly', [4, 49, 43, 43, 51, 4, 60, 4, 66, 41, 96, 48, 98, 55, 66, 55, 61, 92, 52, 92, 43, 57, 5, 57], true, { hatch: true }],
    ['line', 47, 50, 58, 50], ['line', 14, 54, 6, 64], ['line', 86, 51, 95, 64]
  ], 'sky');
  add('sailboat', ['sailing boat', 'sail boat', 'pirate ship'], 1.35, [
    ['poly', [5, 76, 95, 76, 78, 96, 23, 96], true, { hatch: true }],
    ['line', 50, 8, 50, 76], ['poly', [47, 15, 16, 69, 47, 69], true, false],
    ['poly', [54, 24, 83, 69, 54, 69], true, false], ['line', 10, 100, 90, 100]
  ], 'water');
  add('rocket', ['space rocket', 'rockets'], 0.9, [
    ['poly', [50, 2, 72, 35, 72, 75, 50, 91, 28, 75, 28, 35], true, { hatch: true }],
    ['ellipse', 50, 45, 9, 11, false], ['poly', [28, 66, 8, 91, 34, 82], true, false],
    ['poly', [72, 66, 92, 91, 66, 82], true, false], ['poly', [38, 90, 50, 100, 62, 90], false]
  ], 'sky');
})(window.Sketchbook);
