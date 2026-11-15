/* library/people.js — people, faces and character archetypes. */
(function (S) {
  'use strict';
  const add = (id, aliases, aspect, shapes, anchors) => S.register({ id, aliases, category: 'people', layer: 'near', anchor: 'ground', aspect, shapes, anchors: anchors || {} });
  const human = [
    ['ellipse', 50, 18, 17, 17, false], ['line', 50, 35, 50, 72], ['line', 50, 45, 24, 59],
    ['line', 50, 45, 76, 59], ['line', 50, 72, 30, 100], ['line', 50, 72, 70, 100],
    ['dot', 44, 15, 1.5], ['dot', 56, 15, 1.5], ['curve', [44, 25, 50, 29, 57, 24]]
  ];
  add('person', ['people', 'human', 'man', 'woman', 'person figure', 'stick figure'], 0.72, human, { head: [0.5, 0.18], hand: [0.76, 0.58] });
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
  add('child', ['children', 'kid', 'kids'], 0.8, [
    ['ellipse', 50, 20, 17, 17, false], ['dot', 44, 18, 1.8], ['dot', 56, 18, 1.8],
    ['curve', [44, 27, 50, 31, 56, 27]], ['rect', 39, 39, 22, 29],
    ['line', 39, 45, 21, 60], ['line', 61, 45, 79, 60], ['line', 44, 68, 39, 94],
    ['line', 56, 68, 64, 94], ['line', 30, 95, 42, 95], ['line', 60, 95, 72, 95]
  ]);
  add('firefighter', ['fire fighters', 'fireman', 'firewoman'], 0.85, [
    ['ellipse', 50, 19, 16, 15, false], ['arc', 50, 13, 19, 3.2, 6.1], ['rect', 37, 39, 26, 31],
    ['line', 39, 44, 21, 65], ['line', 61, 44, 78, 65], ['line', 43, 70, 38, 98],
    ['line', 57, 70, 63, 98], ['line', 39, 56, 61, 56], ['line', 40, 63, 60, 63],
    ['curve', [78, 65, 93, 70, 91, 85]], ['line', 85, 85, 96, 85]
  ]);
  add('chef', ['chefs', 'cook'], 0.8, [
    ['ellipse', 50, 23, 17, 15, false], ['ellipse', 38, 12, 10, 12, false],
    ['ellipse', 50, 7, 12, 10, false], ['ellipse', 63, 13, 10, 12, false],
    ['rect', 38, 39, 24, 34], ['line', 39, 45, 22, 64], ['line', 61, 45, 78, 64],
    ['line', 44, 73, 40, 98], ['line', 56, 73, 62, 98], ['line', 42, 46, 58, 46]
  ]);
  add('doctor', ['doctors', 'physician'], 0.8, [
    ['ellipse', 50, 18, 16, 15, false], ['rect', 37, 38, 26, 37],
    ['poly', [41, 39, 50, 56, 59, 39], false, false], ['line', 39, 45, 20, 66],
    ['line', 61, 45, 80, 66], ['line', 44, 75, 39, 99], ['line', 56, 75, 62, 99],
    ['line', 50, 51, 50, 64], ['line', 44, 57, 56, 57], ['curve', [61, 44, 75, 52, 70, 69]]
  ]);
  add('king', ['kings'], 0.9, [
    ['ellipse', 50, 25, 17, 16, false], ['poly', [32, 13, 34, 2, 43, 11, 50, 0, 57, 11, 67, 2, 69, 14], true, false],
    ['line', 33, 15, 67, 15], ['rect', 36, 43, 28, 37], ['line', 37, 49, 20, 68],
    ['line', 63, 49, 80, 68], ['line', 43, 81, 40, 100], ['line', 57, 81, 60, 100],
    ['line', 42, 53, 58, 53], ['dot', 50, 20, 2]
  ]);
  add('queen', ['queens'], 0.9, [
    ['ellipse', 50, 24, 17, 16, false], ['poly', [32, 15, 35, 1, 45, 13, 50, 0, 56, 13, 66, 1, 69, 15], true, false],
    ['line', 33, 16, 67, 16], ['poly', [38, 43, 62, 43, 75, 88, 25, 88], true, false],
    ['line', 38, 49, 20, 65], ['line', 62, 49, 80, 65], ['line', 25, 88, 75, 88],
    ['dot', 50, 20, 2], ['line', 45, 91, 43, 99], ['line', 55, 91, 57, 99]
  ]);
})(window.Sketchbook);
