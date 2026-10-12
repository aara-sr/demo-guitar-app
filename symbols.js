/* Symbol names: camera.fill, mic.fill, lock.fill, guitars.fill, square.grid.2x2.fill,
   metronome.fill, tuningfork, person.crop.circle, chevron.left, chevron.right, xmark,
   xmark.circle.fill, checkmark.circle.fill, circle, play.fill, pause.fill, plus.circle,
   minus.circle, gearshape.fill, questionmark */
const SYMBOLS = {
  'camera.fill': '⌁', 'mic.fill': '◉', 'lock.fill': '▣', 'guitars.fill': '♬',
  'square.grid.2x2.fill': '▦', 'metronome.fill': '◫', 'tuningfork': '♮',
  'person.crop.circle': '◯', 'chevron.left': '‹', 'chevron.right': '›', 'xmark': '×',
  'xmark.circle.fill': '⊗', 'checkmark.circle.fill': '✓', 'circle': '○', 'play.fill': '▶',
  'pause.fill': 'Ⅱ', 'plus.circle': '+', 'minus.circle': '−', 'gearshape.fill': '⚙',
  'questionmark': '?'
};
function sym(name) { return SYMBOLS[name] || `［${name}］`; }