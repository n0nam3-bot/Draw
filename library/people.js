/* library/people.js — people, faces and character archetypes. */
(function (S) {
  'use strict';
  const add = (id, aliases, aspect, shapes, anchors) => S.register({ id, aliases, category: 'people', layer: 'near', anchor: 'ground', aspect, shapes, anchors: anchors || {} });
  const human = [
    ['ellipse', 50, 18, 17, 17, false], ['line', 50, 35, 50, 72], ['line', 50, 45, 24, 59],
    ['line', 50, 45, 76, 59], ['line', 50, 72, 30, 100], ['line', 50, 72, 70, 100],
    ['dot', 44, 15, 1.5], ['dot', 56, 15, 1.5], ['curve', [44, 25, 50, 29, 57, 24]]
  ];
  add('person', ['people', 'human', 'man', 'woman', 'child', 'person figure', 'stick figure'], 0.72, human, { head: [0.5, 0.18], hand: [0.76, 0.58] });
  add('knight', ['warrior', 'armored knight'], 0.9, [
    ['rect', 31, 42, 38, 37, { hatch: true }], ['ellipse', 50, 25, 23, 24, false],
    ['poly', [28, 24, 34, 4, 68, 4, 73, 24, 64, 37, 36, 37], true, { hatch: true }],
    ['line', 50, 6, 50, 35], ['line', 26, 48, 10, 79], ['line', 74, 48, 91, 79],
    ['line', 39, 78, 30, 100], ['line', 61, 78, 70, 100], ['line', 50, 0, 50, -8]
  ]);
  add('wizard', ['mage', 'sorcerer'], 0.9, [
    ['poly', [20, 35, 50, 0, 82, 35], true, false], ['ellipse', 51, 35, 23, 18, false],
    ['poly', [29, 49, 72, 49, 84, 96, 17, 96], true, { hatch: true }],
    ['dot', 45, 33, 2], ['dot', 58, 33, 2], ['curve', [43, 42, 52, 48, 62, 41]],
    ['line', 12, 30, 12, 100], ['dot', 12, 23, 7], ['line', 37, 64, 12, 54]
  ]);
  add('pirate', ['pirates', 'buccaneer'], 0.95, [
    ['ellipse', 50, 37, 24, 22, false], ['rect', 25, 12, 50, 8, { hatch: true }],
    ['poly', [29, 13, 38, 0, 70, 0, 77, 13], true, false], ['line', 36, 38, 64, 38],
    ['dot', 44, 31, 2], ['dot', 59, 31, 2], ['curve', [43, 51, 52, 56, 62, 50]],
    ['poly', [29, 60, 71, 60, 86, 100, 14, 100], true, { hatch: true }],
    ['line', 75, 65, 91, 48], ['line', 91, 48, 96, 43]
  ]);
  add('robot', ['robots', 'android'], 0.95, [
    ['rect', 27, 26, 46, 39, true], ['rect', 20, 68, 60, 23, false],
    ['rect', 31, 4, 38, 23, false], ['dot', 42, 15, 3], ['dot', 59, 15, 3],
    ['line', 44, 30, 57, 30], ['line', 50, 4, 50, -8], ['dot', 50, -11, 3],
    ['line', 19, 71, 5, 88], ['line', 81, 71, 95, 88], ['rect', 31, 89, 12, 11], ['rect', 57, 89, 12, 11]
  ], { head: [0.5, 0.15], hand: [0.97, 0.83] });
  add('face', ['human face', 'portrait'], 0.9, [
    ['ellipse', 50, 50, 37, 44, false], ['arc', 50, 31, 31, Math.PI * 1.05, Math.PI * 1.95],
    ['line', 32, 43, 43, 42], ['line', 58, 42, 69, 43], ['dot', 38, 52, 2.4], ['dot', 63, 52, 2.4],
    ['line', 50, 54, 46, 67], ['curve', [39, 76, 50, 84, 62, 76]]
  ]);
})(window.Sketchbook);
