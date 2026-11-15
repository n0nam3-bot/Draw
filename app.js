/* app.js — mobile-first controls, deterministic sketch sessions and offline export. */
(function (root) {
  'use strict';

  const S = root.Sketchbook;
  const canvas = document.getElementById('sketch-canvas');
  const promptInput = document.getElementById('prompt');
  const status = document.getElementById('status');
  const sketchButton = document.getElementById('sketch-button');
  const redrawButton = document.getElementById('redraw-button');
  const clearButton = document.getElementById('clear-button');
  const downloadButton = document.getElementById('download-button');
  const copyButton = document.getElementById('copy-button');
  const surpriseButton = document.getElementById('surprise-button');
  const colorsInput = document.getElementById('colors');
  const backgroundInput = document.getElementById('background');
  const shapeInput = document.getElementById('shape');
  const canvasWrap = document.getElementById('canvas-wrap');

  const EXAMPLES = [
    'A cozy house next to a winding river with two pine trees under a bright sun and birds',
    'A German Shepherd sitting with two pine trees in the background and a bright sun to the left',
    'A robot holding a red balloon at night',
    'Three cats sleeping on a sofa',
    'A pirate ship sailing under a full moon',
    'A dragon guarding a castle on a hill',
    'A giant pizza with mushrooms'
  ];
  const SURPRISE_WORDS = ['cat', 'elephant', 'rocket', 'castle', 'pizza', 'butterfly', 'robot', 'flower', 'unicorn', 'bicycle', 'planet', 'mushroom', 'pirate ship', 'pine tree', 'house', 'dragon'];
  const SHAPES = {
    wide: [800, 500],
    square: [600, 600],
    tall: [500, 700]
  };

  let logicalWidth = 800;
  let logicalHeight = 500;
  let currentPrompt = '';
  let currentSeed = 1;
  let currentScene = null;
  let currentPlaced = [];
  let cachedBlob = null;
  let cachedFilename = 'sketch.png';
  let resizeFrame = 0;

  function shapeDimensions() {
    let shape = shapeInput ? shapeInput.value : 'auto';
    if (shape === 'auto') shape = root.innerWidth < 600 ? 'square' : 'wide';
    return SHAPES[shape] || SHAPES.wide;
  }

  function fileNameFor(prompt) {
    const words = String(prompt || 'untitled sketch').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48);
    return 'sketch-' + (words || 'untitled') + '.png';
  }

  function renderCanvas(scene, seed, placements) {
    const dimensions = shapeDimensions();
    logicalWidth = dimensions[0];
    logicalHeight = dimensions[1];
    const ratio = Math.max(1, Math.min(Number(root.devicePixelRatio) || 1, 2));
    canvas.width = Math.round(logicalWidth * ratio);
    canvas.height = Math.round(logicalHeight * ratio);
    canvas.style.aspectRatio = logicalWidth + ' / ' + logicalHeight;
    canvas.setAttribute('aria-label', currentPrompt ? 'Pencil sketch of ' + currentPrompt : 'Blank sketch paper');

    const ctx = canvas.getContext('2d');
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const engine = new S.SketchEngine(ctx, logicalWidth, logicalHeight, seed, { colored: !!(scene && scene.colored) });
    if (!scene) {
      engine.clear();
      engine.applyPaperTexture(true);
      return;
    }
    const placed = placements || S.layout(scene, logicalWidth, logicalHeight, seed);
    S.render(engine, placed, scene);
    currentPlaced = placed;
  }

  function cacheDownload() {
    cachedBlob = null;
    const offscreen = document.createElement('canvas');
    offscreen.width = logicalWidth * 2;
    offscreen.height = logicalHeight * 2;
    const ctx = offscreen.getContext('2d');
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    const engine = new S.SketchEngine(ctx, logicalWidth, logicalHeight, currentSeed, { colored: !!(currentScene && currentScene.colored) });
    if (currentScene) {
      const exportPlacements = S.layout(currentScene, logicalWidth, logicalHeight, currentSeed);
      S.render(engine, exportPlacements, currentScene);
    } else {
      engine.clear();
      engine.applyPaperTexture(true);
    }
    cachedFilename = fileNameFor(currentPrompt);
    offscreen.toBlob(function (blob) {
      cachedBlob = blob;
    }, 'image/png');
  }

  function statusMessage(scene) {
    const names = scene.notes.recognized;
    const uniqueNames = Array.from(new Set(names));
    let message = '';
    if (uniqueNames.length) {
      message = 'Drew ' + uniqueNames.join(', ') + '.';
    } else if (scene.items.length) {
      message = 'Drew a mystery doodle.';
    } else {
      message = 'Made a little landscape to get you started.';
    }
    if (scene.notes.unknown && scene.notes.unknown.length) {
      message += ' Didn’t recognize ' + scene.notes.unknown.map(function (word) { return '“' + word + '”'; }).join(', ') + ', so I doodled ' + (scene.notes.unknown.length === 1 ? 'it' : 'them') + '.';
    }
    if (scene.notes.corrected && scene.notes.corrected.length) {
      message += ' I interpreted ' + scene.notes.corrected.map(function (entry) { return '“' + entry.from + '” as “' + entry.to + '”'; }).join(', ') + '.';
    }
    if (scene.notes.hint) message += ' ' + scene.notes.hint;
    return message;
  }

  function updateHash(prompt, seed) {
    const encoded = encodeURIComponent(prompt).replace(/%20/g, '+');
    const nextHash = '#p=' + encoded + '&s=' + (seed >>> 0);
    if (root.history && root.history.replaceState) {
      try { root.history.replaceState(null, '', nextHash); }
      catch (error) { root.location.hash = nextHash; }
    } else {
      root.location.hash = nextHash;
    }
  }

  function readHash() {
    const value = String(root.location.hash || '').replace(/^#/, '');
    if (!value) return null;
    const params = new URLSearchParams(value);
    const prompt = params.get('p');
    const seed = Number(params.get('s'));
    if (prompt == null) return null;
    return { prompt: prompt.replace(/\+/g, ' '), seed: Number.isFinite(seed) ? seed >>> 0 : S.hash(prompt) };
  }

  function sketch(prompt, seed) {
    currentPrompt = String(prompt == null ? '' : prompt).trim();
    currentSeed = seed == null ? S.hash(currentPrompt + '|original') : seed >>> 0;
    if (promptInput) promptInput.value = currentPrompt;
    const background = backgroundInput ? backgroundInput.value : 'auto';
    const scene = S.parse(currentPrompt, { colored: !!(colorsInput && colorsInput.checked), background });
    scene.colored = !!(colorsInput && colorsInput.checked);
    scene.items.forEach(function (item) { item.colored = scene.colored; });
    currentScene = scene;
    const dimensions = shapeDimensions();
    logicalWidth = dimensions[0];
    logicalHeight = dimensions[1];
    currentPlaced = S.layout(scene, logicalWidth, logicalHeight, currentSeed);
    renderCanvas(scene, currentSeed, currentPlaced);
    status.textContent = statusMessage(scene);
    updateHash(currentPrompt, currentSeed);
    cacheDownload();
    if (canvasWrap && canvasWrap.scrollIntoView && root.innerWidth < 700) {
      canvasWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return scene;
  }

  function redraw() {
    if (!currentScene) return sketch(promptInput.value || EXAMPLES[0]);
    const nextSeed = (currentSeed + 0x9E3779B9) >>> 0;
    sketch(currentPrompt, nextSeed);
  }

  function clearCanvas() {
    currentPrompt = '';
    currentScene = null;
    currentPlaced = [];
    cachedBlob = null;
    promptInput.value = '';
    renderCanvas(null, 1, []);
    status.textContent = 'Canvas cleared. Type anything to start a new sketch.';
    if (root.history && root.history.replaceState) {
      try { root.history.replaceState(null, '', root.location.pathname + root.location.search); }
      catch (error) { root.location.hash = ''; }
    } else {
      root.location.hash = '';
    }
    promptInput.focus();
  }

  function downloadFallback(blob) {
    if (!blob) {
      status.textContent = 'The image is still being prepared. Tap Download PNG again in a moment.';
      return;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = cachedFilename;
    link.style.display = 'none';
    if ('download' in link) {
      document.body.appendChild(link);
      link.click();
      link.remove();
      root.setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    } else {
      const viewer = root.open('', '_blank');
      if (viewer) {
        viewer.document.open();
        viewer.document.write('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Save your sketch</title></head><body style="margin:0;padding:16px;background:#f8f5ee;font:16px system-ui;text-align:center"><p>Press and hold the image to save it.</p><img alt="Your pencil sketch" src="' + url + '" style="display:block;max-width:100%;height:auto;margin:auto"></body></html>');
        viewer.document.close();
      } else {
        status.textContent = 'Your browser blocked the image tab. Use the browser menu to save this page.';
      }
    }
  }

  function download() {
    if (!currentScene && !cachedBlob) {
      status.textContent = 'Sketch something before downloading.';
      return;
    }
    if (!cachedBlob) {
      status.textContent = 'Preparing your PNG. Tap Download PNG again in a moment.';
      cacheDownload();
      return;
    }
    if (root.navigator && root.navigator.share && root.File) {
      try {
        const file = new File([cachedBlob], cachedFilename, { type: 'image/png' });
        if (root.navigator.canShare && root.navigator.canShare({ files: [file] })) {
          root.navigator.share({ files: [file], title: 'My Text-to-Sketch drawing' }).catch(function () {});
          return;
        }
      } catch (error) {
        // Fall through to the standard file download.
      }
    }
    downloadFallback(cachedBlob);
  }

  function copyLink() {
    const url = root.location.href;
    if (root.navigator && root.navigator.clipboard && root.navigator.clipboard.writeText) {
      root.navigator.clipboard.writeText(url).then(function () {
        status.textContent = 'Sketch link copied. Share it with anyone.';
      }).catch(function () {
        fallbackCopy(url);
      });
    } else {
      fallbackCopy(url);
    }
  }

  function fallbackCopy(value) {
    const helper = document.createElement('textarea');
    helper.value = value;
    helper.setAttribute('readonly', 'readonly');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (error) { copied = false; }
    helper.remove();
    status.textContent = copied ? 'Sketch link copied.' : 'Copy this link from your browser address bar.';
  }

  function surprise() {
    const seed = Date.now() >>> 0;
    const random = S.rng(seed);
    const first = SURPRISE_WORDS[Math.floor(random() * SURPRISE_WORDS.length)];
    const second = SURPRISE_WORDS[Math.floor(random() * SURPRISE_WORDS.length)];
    const prompt = random() > 0.5 ? 'A ' + first + ' next to a ' + second : 'A ' + first + ' with a ' + second;
    sketch(prompt, seed);
  }

  function submitPrompt() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      status.textContent = 'Type a subject, scene, or even a made-up word to sketch.';
      promptInput.focus();
      return;
    }
    sketch(prompt);
    promptInput.blur();
  }

  function addExampleChips() {
    const container = document.getElementById('examples');
    if (!container) return;
    EXAMPLES.forEach(function (example) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'example-chip';
      button.textContent = example;
      button.addEventListener('click', function () {
        sketch(example);
        promptInput.blur();
      });
      container.appendChild(button);
    });
  }

  function handleResize() {
    if (resizeFrame) root.cancelAnimationFrame(resizeFrame);
    resizeFrame = root.requestAnimationFrame(function () {
      resizeFrame = 0;
      if (currentScene) {
        currentPlaced = S.layout(currentScene, shapeDimensions()[0], shapeDimensions()[1], currentSeed);
        renderCanvas(currentScene, currentSeed, currentPlaced);
        cacheDownload();
      } else {
        renderCanvas(null, 1, []);
      }
    });
  }

  sketchButton.addEventListener('click', submitPrompt);
  redrawButton.addEventListener('click', redraw);
  clearButton.addEventListener('click', clearCanvas);
  downloadButton.addEventListener('click', download);
  copyButton.addEventListener('click', copyLink);
  surpriseButton.addEventListener('click', surprise);
  promptInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitPrompt();
    }
  });
  [colorsInput, backgroundInput].forEach(function (control) {
    control.addEventListener('change', function () {
      if (currentPrompt) sketch(currentPrompt, currentSeed);
    });
  });
  shapeInput.addEventListener('change', handleResize);
  root.addEventListener('resize', handleResize);

  addExampleChips();
  const permalink = readHash();
  const initialPrompt = permalink ? permalink.prompt : EXAMPLES[0];
  const initialSeed = permalink ? permalink.seed : S.hash(initialPrompt + '|original');
  sketch(initialPrompt, initialSeed);
})(window);
