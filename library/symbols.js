/* library/symbols.js — common symbols and diagram-friendly shapes. */
(function (S) {
  'use strict';
  const add = (id, aliases, aspect, shapes) => S.register({ id, aliases, category: 'symbols', layer: 'near', anchor: 'ground', aspect, shapes });
  add('heart', ['love', 'hearts'], 1.1, [
    ['curve', [50, 91, 15, 63, 4, 42, 12, 18, 31, 9, 50, 31, 69, 9, 88, 18, 96, 42, 85, 64, 50, 91]],
    ['curve', [22, 25, 31, 17, 39, 25]]
  ]);
  add('arrow', ['arrows'], 1.35, [
    ['line', 5, 50, 88, 50], ['line', 63, 22, 91, 50], ['line', 91, 50, 63, 78]
  ]);
  add('speech bubble', ['speech-bubble', 'speech bubbles', 'dialogue bubble'], 1.3, [
    ['rect', 7, 10, 86, 63, false], ['poly', [28, 72, 25, 94, 51, 72], true, false],
    ['line', 22, 32, 78, 32], ['line', 22, 46, 68, 46], ['line', 22, 59, 58, 59]
  ]);
  add('music note', ['music', 'musical note', 'notes'], 0.9, [
    ['line', 65, 10, 65, 74], ['line', 65, 10, 91, 4], ['line', 91, 4, 91, 66],
    ['ellipse', 50, 79, 15, 10, false], ['ellipse', 77, 71, 15, 10, false]
  ]);
})(window.Sketchbook);
