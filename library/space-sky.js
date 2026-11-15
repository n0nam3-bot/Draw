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
})(window.Sketchbook);
