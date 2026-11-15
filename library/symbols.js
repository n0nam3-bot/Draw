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
  add('clover', ['clovers', 'four leaf clover', 'four-leaf clover'], 0.9, [
    ['ellipse', 35, 29, 16, 16, false], ['ellipse', 65, 29, 16, 16, false],
    ['ellipse', 35, 57, 16, 16, false], ['ellipse', 65, 57, 16, 16, false],
    ['line', 50, 50, 55, 96], ['curve', [55, 96, 47, 95, 42, 90]], ['dot', 50, 44, 2]
  ]);
  add('spiral', ['spirals'], 1.0, [
    ['curve', [50, 50, 66, 38, 75, 53, 64, 68, 43, 65, 34, 46, 47, 31, 68, 32, 83, 48, 80, 72, 60, 86, 32, 82, 17, 60]]
  ]);
  add('peace sign', ['peace symbol', 'peace signs'], 1.0, [
    ['ellipse', 50, 50, 42, 42, false], ['line', 50, 8, 50, 92],
    ['line', 50, 50, 20, 79], ['line', 50, 50, 80, 79], ['line', 20, 79, 16, 84], ['line', 80, 79, 84, 84]
  ]);
  add('gear', ['gears', 'cog', 'cogs'], 1.0, [
    ['ellipse', 50, 50, 30, 30, false], ['ellipse', 50, 50, 12, 12, false],
    ['rect', 44, 4, 12, 19], ['rect', 44, 77, 12, 19], ['rect', 4, 44, 19, 12],
    ['rect', 77, 44, 19, 12], ['line', 25, 25, 34, 34], ['line', 66, 66, 75, 75],
    ['line', 66, 34, 75, 25], ['line', 25, 75, 34, 66]
  ]);
  add('question mark', ['question mark symbol', 'question marks'], 0.7, [
    ['curve', [20, 30, 22, 5, 67, 1, 77, 26, 78, 42, 51, 53, 50, 66]],
    ['dot', 50, 91, 3], ['curve', [29, 22, 35, 9, 60, 8, 65, 23]]
  ]);
  add('infinity', ['infinity symbol', 'infinity sign'], 1.25, [
    ['curve', [50, 51, 31, 19, 7, 30, 11, 51, 15, 74, 34, 82, 50, 51]],
    ['curve', [50, 51, 69, 19, 93, 30, 89, 51, 85, 74, 66, 82, 50, 51]],
    ['line', 48, 49, 52, 53]
  ]);
})(window.Sketchbook);
