/* library/space-sky.js — sky, weather and simple cosmic objects. */
(function (S) {
  'use strict';
  const add = (id, aliases, aspect, shapes, layer) => S.register({ id, aliases, category: 'space-sky', layer: layer || 'sky', anchor: 'sky', aspect, shapes });
  add('sun', ['sunshine'], 1, [
    ['ellipse', 50, 50, 25, 25, true], ['line', 50, 4, 50, 18], ['line', 50, 82, 50, 96],
    ['line', 4, 50, 18, 50], ['line', 82, 50, 96, 50], ['line', 17, 17, 27, 27],
    ['line', 73, 73, 83, 83], ['line', 17, 83, 27, 73], ['line', 73, 27, 83, 17]
  ]);
  add('moon', ['crescent moon', 'moons'], 1, [
    ['arc', 49, 49, 40, -1.2, 1.2], ['curve', [67, 12, 27, 17, 21, 53, 38, 81, 69, 88]],
    ['line', 69, 12, 78, 20]
  ]);
  add('star', ['stars'], 0.9, [
    ['poly', [50, 2, 61, 37, 96, 38, 68, 59, 79, 94, 50, 73, 21, 94, 32, 59, 4, 38, 39, 37], true, false]
  ]);
  add('cloud', ['clouds'], 1.35, [
    ['curve', [8, 73, 4, 53, 25, 47, 27, 28, 49, 22, 64, 35, 82, 34, 97, 51, 91, 73, 8, 73]],
    ['curve', [18, 72, 39, 77, 60, 72, 81, 75]], ['line', 25, 83, 78, 83]
  ]);
  add('rainbow', ['rainbows'], 1.5, [
    ['arc', 50, 95, 44, Math.PI, Math.PI * 2], ['arc', 50, 95, 36, Math.PI, Math.PI * 2],
    ['arc', 50, 95, 28, Math.PI, Math.PI * 2], ['arc', 50, 95, 20, Math.PI, Math.PI * 2]
  ]);
  add('planet', ['ringed planet', 'planets', 'saturn'], 1.1, [
    ['ellipse', 50, 49, 27, 27, true], ['ellipse', 50, 49, 47, 11, false],
    ['line', 8, 46, 91, 53], ['arc', 50, 49, 26, 0.1, 2.8]
  ]);
  add('satellite', ['satellites', 'artificial satellite'], 1.25, [
    ['rect', 41, 38, 18, 24, true], ['rect', 5, 30, 28, 40, false],
    ['line', 12, 30, 12, 70], ['line', 20, 30, 20, 70], ['line', 28, 30, 28, 70],
    ['rect', 67, 30, 28, 40, false], ['line', 74, 30, 74, 70],
    ['line', 82, 30, 82, 70], ['line', 90, 30, 90, 70],
    ['line', 50, 38, 50, 19], ['ellipse', 50, 15, 6, 6, false],
    ['line', 50, 62, 50, 82], ['dot', 50, 87, 3]
  ], 'sky');
  add('UFO', ['ufo', 'flying saucer', 'flying saucers'], 1.25, [
    ['ellipse', 50, 57, 44, 16, false], ['ellipse', 50, 43, 22, 15, false],
    ['curve', [29, 51, 38, 28, 62, 28, 71, 51]], ['line', 9, 61, 91, 61],
    ['dot', 29, 60, 2], ['dot', 50, 64, 2], ['dot', 71, 60, 2],
    ['line', 29, 75, 23, 91], ['line', 50, 76, 50, 94], ['line', 71, 75, 77, 91]
  ], 'sky');
  add('lightning', ['lightning bolt', 'lightning bolts'], 0.65, [
    ['poly', [59, 3, 20, 55, 46, 55, 34, 98, 82, 37, 54, 39], true, false],
    ['line', 59, 3, 20, 55], ['line', 46, 55, 34, 98], ['line', 82, 37, 54, 39],
    ['line', 12, 19, 18, 12], ['line', 86, 11, 93, 18]
  ], 'sky');
  add('comet', ['comets'], 1.35, [
    ['ellipse', 75, 30, 13, 13, false], ['line', 65, 39, 10, 89], ['line', 70, 42, 25, 95],
    ['line', 62, 34, 4, 63], ['line', 65, 30, 14, 45], ['dot', 78, 26, 2],
    ['line', 86, 18, 93, 11], ['dot', 25, 25, 2], ['dot', 90, 76, 2]
  ], 'sky');
  add('starship', ['spaceships', 'star ship'], 1.35, [
    ['poly', [50, 4, 65, 54, 92, 79, 50, 67, 8, 79, 35, 54], true, false],
    ['ellipse', 50, 43, 10, 14, false], ['line', 35, 54, 65, 54],
    ['line', 50, 67, 50, 92], ['line', 22, 75, 9, 96], ['line', 78, 75, 91, 96],
    ['curve', [40, 70, 33, 84, 40, 97]], ['curve', [60, 70, 67, 84, 60, 97]]
  ], 'sky');
  add('aurora', ['northern lights', 'aurora borealis'], 1.5, [
    ['curve', [4, 69, 20, 35, 39, 43, 52, 13, 72, 24, 96, 5]],
    ['curve', [3, 85, 20, 55, 38, 62, 54, 31, 76, 45, 98, 24]],
    ['curve', [6, 99, 24, 76, 40, 83, 61, 55, 79, 68, 97, 49]],
    ['dot', 17, 19, 2], ['dot', 85, 14, 2], ['dot', 55, 5, 1.5], ['line', 12, 10, 17, 5]
  ], 'sky');
})(window.Sketchbook);
