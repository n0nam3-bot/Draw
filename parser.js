/* parser.js — rule-based prompt understanding; returns a scene graph for layout.js.
 * Scene graph: { mode, stage, items: [{id, word, count, color, size, modifiers,
 * relation, region, start, end}], texts: [{text, style}], notes: {recognized, corrected, unknown} }.
 */
(function (root) {
  'use strict';
  const S = root.Sketchbook;
  const COLORS = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white', 'grey', 'gray', 'teal', 'gold', 'silver', 'beige', 'turquoise'];
  const SIZES = { tiny: 0.48, small: 0.68, little: 0.68, medium: 0.9, large: 1.24, big: 1.28, giant: 1.62, huge: 1.58, enormous: 1.75, tall: 1.28, short: 0.78 };
  const MODIFIERS = ['flying', 'floating', 'glowing', 'shiny', 'sleeping', 'on fire', 'burning', 'snowy', 'tilted', 'upside down', 'upside-down', 'detailed', 'messy', 'neat', 'minimal', 'cozy', 'happy', 'sad', 'angry', 'facing left', 'facing right'];
  const STOP_WORDS = new Set(('a an the of to with and or while please draw sketch make create show me picture image illustration beautiful pretty bright winding full sailing guarding reading walking swimming chasing dancing talking playing fire very is are was were be night day daytime midnight sunset dusk sunrise dawn rainy rain snowy snow foggy fog stormy storm forest woods city beach ocean underwater sea desert farm arctic space indoors open field on in at beside next under above below behind front before after from for by near around over as it this that one some two three four five six seven eight nine ten eleven twelve couple few dozen left right center centre top bottom background foreground many lots flock field group bunch pack school herd sitting standing next beside holding carrying wearing riding say saying word sign labelled labeled called looking').split(' '));
  const NUMBERS = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, dozen: 12 };
  const ENVIRONMENTS = {
    day: 'day', daytime: 'day', sunny: 'day', night: 'night', midnight: 'night', sunset: 'sunset', dusk: 'sunset', sunrise: 'sunrise', dawn: 'sunrise',
    rain: 'rain', rainy: 'rain', snow: 'snow', snowy: 'snow', fog: 'fog', foggy: 'fog', storm: 'storm', stormy: 'storm',
    forest: 'forest', woods: 'forest', city: 'city', beach: 'beach', ocean: 'ocean', underwater: 'underwater', sea: 'ocean', desert: 'desert', farm: 'farm', arctic: 'arctic', mountains: 'mountains', mountain: 'mountains', space: 'space', indoors: 'indoors', inside: 'indoors'
  };
  const CONCEPTS = { love: 'heart', music: 'music note', idea: 'lightbulb', time: 'clock', peace: 'bird', luck: 'flower', hope: 'star', danger: 'arrow', direction: 'arrow', knowledge: 'book', creativity: 'lightbulb', travel: 'airplane', ocean: 'fish' };
  const IRREGULAR = { mice: 'mouse', geese: 'goose', leaves: 'leaf', people: 'person', children: 'child', men: 'man', women: 'woman', teeth: 'tooth', feet: 'foot' };
  const RELATIONS = [
    { type: 'next to', words: ['next to', 'beside', 'near', 'alongside', 'with'] },
    { type: 'in front of', words: ['in front of', 'before'] },
    { type: 'behind', words: ['behind'] },
    { type: 'inside', words: ['inside', 'in'] },
    { type: 'under', words: ['under', 'below', 'beneath'] },
    { type: 'on', words: ['on top of', 'on'] },
    { type: 'holding', words: ['holding', 'carrying', 'wearing', 'riding'] }
  ];

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' -]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function lemmatize(word) {
    if (IRREGULAR[word]) return IRREGULAR[word];
    if (word.length > 4 && /ies$/.test(word)) return word.slice(0, -3) + 'y';
    if (word.length > 4 && /ves$/.test(word)) return word.slice(0, -3) + 'f';
    if (word.length > 4 && /ches$|shes$|xes$|zes$/.test(word)) return word.slice(0, -2);
    if (word.length > 3 && /s$/.test(word) && !/ss$/.test(word)) return word.slice(0, -1);
    return word;
  }

  function distance(a, b) {
    const row = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i += 1) {
      let previous = row[0];
      row[0] = i;
      for (let j = 1; j <= b.length; j += 1) {
        const current = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
        previous = current;
      }
    }
    return row[b.length];
  }

  function getAliases() {
    return Array.from(S.objects.values()).flatMap(function (def) {
      return def.aliases.map(function (alias) { return { alias, def }; });
    }).sort(function (a, b) { return b.alias.length - a.alias.length; });
  }

  function findMatches(prompt, aliasList, corrected) {
    const matches = [];
    const occupied = [];
    aliasList.forEach(function (entry) {
      const escaped = entry.alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp('(^|\\s)' + escaped + '(?=$|\\s)', 'g');
      let found;
      while ((found = regex.exec(prompt))) {
        const start = found.index + found[1].length;
        const end = start + entry.alias.length;
        if (occupied.some(function (range) { return start < range.end && end > range.start; })) continue;
        occupied.push({ start, end });
        matches.push({ def: entry.def, word: entry.alias, start, end, corrected: false });
      }
    });

    const tokens = prompt.match(/[a-z][a-z'-]*/g) || [];
    let cursor = 0;
    tokens.forEach(function (token) {
      const start = prompt.indexOf(token, cursor);
      cursor = start + token.length;
      if (occupied.some(function (range) { return start < range.end && start + token.length > range.start; })) return;
      const lemma = lemmatize(token);
      if (STOP_WORDS.has(token) || STOP_WORDS.has(lemma) || token.length < 4) return;
      if (lemma !== token) {
        const pluralDef = S.lookup(lemma);
        if (pluralDef) {
          matches.push({ def: pluralDef, word: token, start, end: start + token.length, corrected: false });
          occupied.push({ start, end: start + token.length });
          return;
        }
      }
      const limit = token.length >= 8 ? 2 : 1;
      let best = null;
      let bestDistance = limit + 1;
      aliasList.forEach(function (entry) {
        const candidate = entry.alias.split(' ').length === 1 ? entry.alias : '';
        if (!candidate || Math.abs(candidate.length - token.length) > limit) return;
        const d = distance(token, candidate);
        if (d < bestDistance) { bestDistance = d; best = entry; }
      });
      if (best && bestDistance <= limit) {
        matches.push({ def: best.def, word: token, start, end: start + token.length, corrected: true });
        occupied.push({ start, end: start + token.length });
        corrected.push({ from: token, to: best.def.id.replace(/-/g, ' ') });
      }
    });
    return matches.sort(function (a, b) { return a.start - b.start; });
  }

  function quantityFor(prefix, matchedWord, def) {
    const text = String(prefix || '').toLowerCase().trim();
    const boundary = /\b(?:and|while|on|under|above|below|behind|beside|near|next to|with|holding|carrying|wearing|riding|inside|in front of)\b/g;
    let boundaryMatch;
    let start = 0;
    while ((boundaryMatch = boundary.exec(text))) start = boundary.lastIndex;
    const phrase = text.slice(start).trim();
    const countWords = phrase.split(/\s+/).filter(Boolean);
    let count = 1;
    if (/^a couple(?: of)?(?:\s+[a-z]+){0,3}$/.test(phrase) || /^couple of(?:\s+[a-z]+){0,3}$/.test(phrase)) count = 2;
    else if (/^a few(?:\s+[a-z]+){0,3}$/.test(phrase) || /^few(?:\s+[a-z]+){0,3}$/.test(phrase)) count = 3;
    else if (/^a dozen(?:\s+[a-z]+){0,3}$/.test(phrase) || /^dozen(?:\s+[a-z]+){0,3}$/.test(phrase)) count = 12;
    else if (/^(?:many|lots of)(?:\s+[a-z]+){0,3}$/.test(phrase)) count = 10;
    else if (/^(\d{1,2})(?:\s+[a-z]+){0,3}$/.test(phrase)) count = Number(phrase.match(/^(\d{1,2})/)[1]);
    else if (countWords.length && NUMBERS[countWords[0]] != null) count = NUMBERS[countWords[0]];
    else if (/^a(?:n)?(?:\s+[a-z]+){0,3}$/.test(phrase) || /^the(?:\s+[a-z]+){0,3}$/.test(phrase)) count = 1;
    else if (/^(?:flock|herd|pack|school)\s+of(?:\s+[a-z]+){0,2}$/.test(phrase)) count = 6;
    else if (/^(?:field|garden)\s+of(?:\s+[a-z]+){0,2}$/.test(phrase)) count = 8;
    else if (/s$/.test(matchedWord)) count = Number(def.plural) || 3;
    return Math.max(1, Math.min(40, count));
  }

  function attributesFor(segment) {
    const words = normalize(segment).split(' ');
    const attrs = { color: null, size: 1, modifiers: [], region: null, style: null };
    words.forEach(function (word) {
      if (COLORS.includes(word)) attrs.color = word;
      if (SIZES[word]) attrs.size = SIZES[word];
      if (['left', 'right', 'center', 'centre', 'top', 'bottom', 'background', 'foreground'].includes(word)) attrs.region = word === 'centre' ? 'center' : word;
      if (['messy', 'neat', 'detailed', 'minimal'].includes(word)) attrs.style = word;
    });
    const normalizedSegment = normalize(segment);
    MODIFIERS.forEach(function (modifier) {
      const phrase = normalize(modifier);
      if (phrase && new RegExp('(^| )' + phrase.replace(/ /g, '\\s+') + '( |$)').test(normalizedSegment) && !attrs.modifiers.includes(modifier)) attrs.modifiers.push(modifier);
    });
    return attrs;
  }

  function relationBetween(segment) {
    const text = normalize(segment).replace(/\bon fire\b/g, 'burning');
    // Region phrases such as "in the background" describe placement, not containment.
    if (/\bin (?:the )?(?:background|foreground|sky)\b/.test(text)) return null;
    for (const relation of RELATIONS) {
      if (relation.words.some(function (word) { return new RegExp('(^| )' + word.replace(/ /g, '\\s+') + '( |$)').test(text); })) return relation.type;
    }
    return null;
  }

  function relationIndex(text) {
    const value = String(text || '');
    let selected = null;
    RELATIONS.forEach(function (relation) {
      relation.words.forEach(function (word) {
        const escaped = word.replace(/ /g, '\\s+');
        const regex = new RegExp('(^|\\s)' + escaped + '(?=\\s|$)', 'g');
        let match;
        while ((match = regex.exec(value))) {
          const index = match.index + match[1].length;
          if (word === 'on' && /^\s+fire\b/.test(value.slice(index + word.length))) continue;
          if (!selected || index < selected.index || (index === selected.index && word.length > selected.word.length)) {
            selected = { index, word };
          }
        }
      });
    });
    return selected;
  }

  function beforeRelation(text) {
    const selected = relationIndex(text);
    return String(text || '').slice(0, selected ? selected.index : String(text || '').length);
  }

  function afterRelation(text) {
    const value = String(text || '');
    const selected = relationIndex(value);
    return selected ? value.slice(selected.index + selected.word.length) : value;
  }

  function unknownWords(prompt, matches, texts, recognizedIds) {
    let remainder = prompt;
    // Remove quoted text so lettering does not become an unknown noun.
    remainder = remainder.replace(/"[^"]*"|'[^']*'/g, ' ');
    matches.slice().sort(function (a, b) { return b.start - a.start; }).forEach(function (match) {
      remainder = remainder.slice(0, match.start) + ' '.repeat(match.end - match.start) + remainder.slice(match.end);
    });
    const tokens = normalize(remainder).split(' ').filter(Boolean);
    const unknown = [];
    tokens.forEach(function (token) {
      const lemma = lemmatize(token);
      const isQuotedText = texts.some(function (entry) { return normalize(entry.text).split(' ').includes(token); });
      if (isQuotedText || token.length < 3 || STOP_WORDS.has(token) || STOP_WORDS.has(lemma) || COLORS.includes(token) || SIZES[token] || MODIFIERS.includes(token)) return;
      if (Object.values(ENVIRONMENTS).includes(token) || Object.prototype.hasOwnProperty.call(ENVIRONMENTS, token)) return;
      if (/^\d+$/.test(token) || Object.prototype.hasOwnProperty.call(NUMBERS, token)) return;
      if (unknown.indexOf(token) === -1) unknown.push(token);
    });
    return unknown.slice(0, 12);
  }

  function parse(prompt, options) {
    const opts = options || {};
    const original = String(prompt == null ? '' : prompt).trim();
    const normalized = normalize(original.replace(/\bplease\b/gi, ' ').replace(/\b(draw|sketch|make|create|show me|a picture of|an image of)\b/gi, ' '));
    const corrected = [];
    const recognized = [];
    const aliasList = getAliases();
    const matches = findMatches(normalized, aliasList, corrected);
    const texts = [];
    const quoteRegex = /["“]([^"”]+)["”]|\b(?:the word|saying|lettering that says)\s+([a-z0-9 ]{1,36})/gi;
    let quoteMatch;
    while ((quoteMatch = quoteRegex.exec(original))) {
      const text = (quoteMatch[1] || quoteMatch[2] || '').trim();
      if (text) texts.push({ text: text.slice(0, 36), style: /sign/i.test(original) ? 'sign' : 'caption' });
    }

    const items = [];
    const env = { time: 'day', weather: null, setting: null };
    Object.keys(ENVIRONMENTS).forEach(function (word) {
      if (new RegExp('(^| )' + word + '( |$)').test(normalized)) {
        const value = ENVIRONMENTS[word];
        if (['day', 'night', 'sunset', 'sunrise'].includes(value)) env.time = value;
        else if (['rain', 'snow', 'fog', 'storm'].includes(value)) env.weather = value;
        else env.setting = value;
      }
    });
    if (/\bfull moon\b/.test(normalized)) env.time = 'night';

    matches.forEach(function (match, index) {
      const previous = matches[index - 1];
      const nextMatch = matches[index + 1];
      const segmentStart = previous ? previous.end : 0;
      const segmentEnd = nextMatch ? nextMatch.start : normalized.length;
      const beforeSegment = normalized.slice(segmentStart, match.start);
      const afterSegment = normalized.slice(match.end, segmentEnd);
      const relationFromPrevious = previous ? relationBetween(beforeSegment) : null;
      const relationToNext = nextMatch ? relationBetween(afterSegment) : null;
      const beforeAttributes = relationFromPrevious ? afterRelation(beforeSegment) : beforeSegment;
      const afterAttributes = relationToNext ? beforeRelation(afterSegment) : afterSegment;
      const attrs = attributesFor(beforeAttributes + ' ' + afterAttributes);
      let count = quantityFor(normalized.slice(0, match.start), match.word, match.def);
      const groupPrefix = normalized.slice(Math.max(0, match.start - 24), match.start);
      if (/\b(?:flock|herd|pack|school)\s+of\s*$/.test(groupPrefix)) count = 6;
      if (/\b(field|garden)\s+of\s*$/.test(groupPrefix)) count = 8;
      const item = {
        id: match.def.id, word: match.word, count, color: attrs.color,
        size: attrs.size, modifiers: attrs.modifiers, region: attrs.region, style: attrs.style,
        relation: null, start: match.start, end: match.end, category: match.def.category
      };
      if (match.corrected) item.corrected = true;
      if (previous && items.length) {
        const previousItem = items[items.length - 1];
        const rel = relationBetween(beforeSegment);
        if (rel === 'on' || rel === 'under' || rel === 'behind' || rel === 'inside' || rel === 'in front of') {
          previousItem.relation = { type: rel, targetIndex: items.length };
        } else if (rel === 'holding') {
          previousItem.relation = { type: 'holding', targetIndex: items.length };
        } else if (rel === 'next to') {
          let targetIndex = items.length - 1;
          const holderIndex = items.findIndex(function (candidate) { return candidate.relation && candidate.relation.type === 'holding' && candidate.relation.targetIndex === items.length - 1; });
          if (holderIndex >= 0) targetIndex = holderIndex;
          item.relation = { type: 'next to', targetIndex };
        }
      }
      items.push(item);
      recognized.push(match.def.id.replace(/-/g, ' '));
    });

    // Concepts such as love/music/hope become symbols even when no concrete noun is present.
    Object.keys(CONCEPTS).forEach(function (concept) {
      if (new RegExp('(^| )' + concept + '( |$)').test(normalized) && !items.some(function (item) { return item.id === (S.lookup(CONCEPTS[concept]) && S.lookup(CONCEPTS[concept]).id); })) {
        const def = S.lookup(CONCEPTS[concept]);
        if (def) {
          items.push({ id: def.id, word: concept, count: 1, color: null, size: 1, modifiers: [], relation: null, region: null, category: def.category });
          recognized.push(def.id.replace(/-/g, ' '));
        }
      }
    });

    const unknown = unknownWords(normalized, matches, texts, recognized);
    const unknownDoodles = unknown.filter(function (word) {
      const tokenIndex = normalized.indexOf(word);
      if (tokenIndex < 0) return false;
      const prefix = normalized.slice(Math.max(0, tokenIndex - 24), tokenIndex);
      const hasNounCue = /(?:^|\s)(?:a|an|the|and|or|with|next to|beside|near|on|under|above|below|behind|inside|in front of)\s+$/.test(prefix);
      if (!hasNounCue) return false;
      const nextMatch = matches.find(function (match) { return match.start > tokenIndex; });
      if (nextMatch && nextMatch.start - (tokenIndex + word.length) < 18 && !relationBetween(normalized.slice(tokenIndex + word.length, nextMatch.start))) return false;
      return true;
    });
    if (unknownDoodles.length) {
      unknownDoodles.slice(0, 4).forEach(function (word, index) {
        items.push({ id: '__doodle__', word, count: 1, color: null, size: 1, modifiers: [], relation: null, region: null, unknown: true, category: 'unknown', index });
      });
    }

    const total = items.reduce(function (sum, item) { return sum + item.count; }, 0);
    if (total > 120) {
      let remaining = 120;
      items.forEach(function (item) { item.count = Math.max(0, Math.min(item.count, remaining)); remaining -= item.count; });
    }

    const landscapeIds = new Set(['mountain', 'tree', 'pine tree', 'flower', 'rock', 'sun', 'moon', 'cloud', 'rainbow']);
    const wantsScene = !!opts.forceScene || opts.background === 'scene' || !!env.setting || env.weather || env.time !== 'day' || items.some(function (item) { return landscapeIds.has(item.id) || ['sky', 'far', 'mid'].includes((S.objects.get(item.id) || {}).layer); });
    const mode = opts.background === 'none' ? 'object' : (wantsScene ? 'scene' : 'object');
    if (opts.background === 'scene') env.setting = env.setting || 'open field';

    if (!items.length) {
      return {
        mode: 'scene', stage: Object.assign({}, env), items: [], texts,
        notes: { recognized: [], corrected, unknown: [], hint: 'Try a subject such as a cat, a robot, or a cozy house by a river.' }
      };
    }
    return { mode, stage: env, items, texts, notes: { recognized: Array.from(new Set(recognized)), corrected, unknown: Array.from(new Set(unknownDoodles)), hint: null } };
  }

  S.parse = parse;
  S._parser = { normalize, lemmatize, distance, unknownWords };
})(window);
