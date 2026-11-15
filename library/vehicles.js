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
  add('bus', ['buses', 'school bus'], 1.5, [
    ['rect', 7, 32, 86, 49, true], ['rect', 16, 41, 15, 15], ['rect', 36, 41, 15, 15],
    ['rect', 56, 41, 15, 15], ['rect', 76, 41, 10, 15], ['rect', 18, 62, 62, 8],
    ['ellipse', 26, 83, 9, 9, false], ['ellipse', 76, 83, 9, 9, false], ['line', 9, 73, 91, 73]
  ]);
  add('truck', ['trucks', 'pickup truck', 'lorry'], 1.45, [
    ['rect', 5, 35, 58, 42, true], ['rect', 63, 48, 29, 29, false],
    ['rect', 68, 53, 18, 13, false], ['line', 63, 48, 63, 77],
    ['ellipse', 24, 82, 10, 10, false], ['ellipse', 77, 82, 10, 10, false],
    ['line', 5, 77, 92, 77], ['line', 10, 42, 58, 42]
  ]);
  add('train', ['trains', 'locomotive'], 1.45, [
    ['rect', 8, 33, 63, 47, true], ['rect', 18, 43, 17, 16], ['rect', 42, 43, 17, 16],
    ['rect', 71, 48, 21, 30], ['rect', 17, 18, 14, 15], ['line', 14, 80, 95, 80],
    ['ellipse', 25, 86, 9, 9, false], ['ellipse', 70, 86, 9, 9, false], ['ellipse', 88, 86, 7, 7, false],
    ['line', 16, 24, 29, 24]
  ]);
  add('helicopter', ['helicopters', 'chopper'], 1.35, [
    ['ellipse', 51, 54, 30, 20, true], ['rect', 72, 48, 19, 11], ['line', 48, 33, 48, 43],
    ['line', 13, 32, 85, 32], ['line', 49, 12, 49, 32], ['line', 20, 26, 20, 38],
    ['curve', [24, 72, 33, 83, 70, 83, 80, 72]], ['line', 35, 74, 30, 89], ['line', 67, 74, 72, 89],
    ['ellipse', 93, 53, 5, 8, false]
  ]);
  add('submarine', ['submarines', 'sub'], 1.5, [
    ['ellipse', 50, 62, 43, 20, true], ['rect', 41, 29, 18, 14], ['line', 50, 29, 50, 18],
    ['ellipse', 44, 60, 5, 5, false], ['ellipse', 58, 60, 5, 5, false],
    ['poly', [7, 62, 1, 48, 14, 54], true, false], ['line', 85, 63, 99, 53],
    ['curve', [14, 89, 25, 82, 37, 89]], ['curve', [59, 90, 73, 82, 86, 89]]
  ], 'mid');
  add('hot air balloon', ['hot-air balloon', 'hot air balloons'], 0.9, [
    ['ellipse', 50, 34, 30, 32, false], ['curve', [22, 35, 30, 8, 70, 8, 78, 35]],
    ['line', 35, 59, 43, 78], ['line', 65, 59, 57, 78], ['rect', 42, 78, 16, 12],
    ['curve', [50, 7, 50, 20, 50, 49, 50, 65]], ['line', 50, 66, 50, 78],
    ['line', 25, 46, 75, 46]
  ], 'sky');
})(window.Sketchbook);
