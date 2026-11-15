/* library/buildings.js — homes, public buildings and structures. */
(function (S) {
  'use strict';
  const add = (id, aliases, aspect, shapes, anchors) => S.register({ id, aliases, category: 'buildings', layer: 'mid', anchor: 'ground', aspect, shapes, anchors: anchors || { top: [0.5, 0.28], inside: [0.5, 0.55] } });
  add('house', ['home', 'cottage', 'homes'], 1.25, [
    ['rect', 13, 43, 74, 55, { hatch: true }], ['poly', [5, 45, 50, 5, 95, 45], true, false],
    ['rect', 42, 65, 18, 33, false], ['dot', 56, 82, 1.8],
    ['rect', 23, 55, 17, 17, true], ['line', 31, 55, 31, 72], ['line', 23, 63, 40, 63],
    ['rect', 65, 55, 17, 17, true], ['line', 73, 55, 73, 72], ['line', 65, 63, 82, 63],
    ['rect', 70, 17, 10, 20, false]
  ]);
  add('castle', ['castles', 'fortress'], 1.45, [
    ['rect', 8, 35, 84, 63, { hatch: true }], ['rect', 3, 10, 22, 88, false],
    ['rect', 75, 10, 22, 88, false], ['rect', 35, 49, 30, 49, false],
    ['poly', [3, 10, 14, 0, 25, 10], true, false], ['poly', [75, 10, 86, 0, 97, 10], true, false],
    ['poly', [35, 49, 50, 30, 65, 49], true, false], ['rect', 43, 75, 14, 23, false],
    ['rect', 10, 26, 7, 12, false], ['rect', 83, 26, 7, 12, false]
  ]);
  add('skyscraper', ['tower block', 'high rise'], 0.86, [
    ['poly', [18, 100, 24, 12, 39, 2, 63, 2, 78, 20, 84, 100], true, { hatch: true }],
    ['line', 25, 32, 78, 32], ['line', 24, 50, 81, 50], ['line', 22, 69, 82, 69],
    ['rect', 34, 19, 11, 9, false], ['rect', 56, 19, 11, 9, false],
    ['rect', 34, 39, 11, 8, false], ['rect', 56, 39, 11, 8, false],
    ['rect', 34, 58, 11, 8, false], ['rect', 56, 58, 11, 8, false]
  ]);
  add('barn', ['farm barn'], 1.25, [
    ['rect', 12, 43, 76, 55, false], ['poly', [5, 44, 50, 7, 95, 44], true, { hatch: true }],
    ['rect', 35, 56, 30, 42, false], ['line', 35, 56, 65, 98], ['line', 65, 56, 35, 98],
    ['rect', 18, 55, 12, 14, false], ['line', 50, 58, 50, 98]
  ]);
  add('tent', ['camping tent'], 1.2, [
    ['poly', [5, 96, 49, 12, 95, 96], true, { hatch: true }], ['poly', [49, 12, 49, 96, 5, 96], true, false],
    ['line', 49, 12, 49, 96], ['poly', [38, 96, 50, 63, 63, 96], false],
    ['line', 5, 96, 95, 96]
  ]);
  add('lighthouse', ['beacon'], 0.85, [
    ['poly', [28, 100, 38, 32, 64, 32, 76, 100], true, { hatch: true }],
    ['rect', 34, 20, 34, 13, false], ['poly', [30, 20, 50, 4, 72, 20], true, false],
    ['rect', 41, 40, 18, 17, false], ['line', 50, 6, 24, -5], ['line', 50, 6, 78, -5],
    ['line', 22, 77, 78, 77], ['line', 10, 100, 90, 100]
  ]);
  add('school', ['schools'], 1.25, [
    ['rect', 13, 42, 74, 55, true], ['poly', [8, 43, 50, 9, 92, 43], true, false],
    ['rect', 43, 67, 15, 30], ['rect', 22, 52, 12, 12], ['rect', 66, 52, 12, 12],
    ['line', 50, 10, 50, 2], ['poly', [50, 3, 68, 8, 50, 13], true, false],
    ['line', 17, 96, 83, 96]
  ]);
  add('hospital', ['hospitals', 'clinic'], 1.1, [
    ['rect', 15, 30, 70, 68, true], ['rect', 42, 69, 16, 29],
    ['rect', 25, 43, 13, 13], ['rect', 62, 43, 13, 13],
    ['rect', 25, 68, 12, 12], ['rect', 63, 68, 12, 12],
    ['rect', 43, 10, 14, 20], ['rect', 34, 16, 32, 8], ['line', 50, 11, 50, 29]
  ]);
  add('bridge', ['bridges'], 1.5, [
    ['line', 2, 63, 98, 63], ['line', 2, 71, 98, 71], ['curve', [14, 67, 24, 90, 40, 91, 50, 68]],
    ['curve', [50, 68, 61, 91, 78, 90, 88, 67]], ['line', 10, 54, 10, 66], ['line', 90, 54, 90, 66],
    ['line', 10, 54, 90, 54], ['line', 20, 54, 20, 62], ['line', 80, 54, 80, 62],
    ['curve', [3, 88, 23, 82, 36, 88]], ['curve', [64, 88, 78, 82, 97, 88]]
  ], 'mid');
  add('windmill', ['windmills'], 0.9, [
    ['poly', [36, 42, 64, 42, 70, 99, 30, 99], true, false], ['rect', 40, 57, 20, 18],
    ['dot', 50, 48, 4], ['line', 50, 48, 50, 4], ['line', 50, 48, 12, 27],
    ['line', 50, 48, 88, 27], ['line', 50, 48, 75, 87], ['line', 50, 48, 25, 87],
    ['line', 36, 99, 64, 99]
  ]);
  add('igloo', ['igloos'], 1.15, [
    ['arc', 50, 68, 37, 3.15, 6.28], ['line', 13, 68, 87, 68], ['curve', [13, 68, 18, 34, 50, 18, 82, 34, 87, 68]],
    ['rect', 40, 59, 20, 39], ['arc', 50, 60, 10, 3.14, 6.28],
    ['line', 25, 48, 75, 48], ['line', 20, 58, 80, 58], ['line', 34, 32, 66, 32], ['line', 50, 18, 50, 32]
  ]);
  add('pyramid', ['pyramids'], 1.25, [
    ['poly', [4, 96, 50, 8, 96, 96], true, true], ['line', 50, 8, 50, 96],
    ['line', 28, 51, 72, 51], ['line', 20, 67, 80, 67], ['line', 12, 83, 88, 83],
    ['rect', 43, 78, 14, 18], ['line', 3, 97, 97, 97]
  ], 'far');
})(window.Sketchbook);
