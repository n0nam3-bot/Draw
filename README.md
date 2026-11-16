<!-- README.md — project overview, local usage, architecture and contribution guide. -->
# Text-to-Sketch

Text-to-Sketch is a free, static sketching web app. Type a prompt and the app turns the objects it recognizes into a deterministic, hand-drawn pencil-style composition on an HTML5 canvas. It uses a built-in procedural drawing library and a rule-based parser; it does not use generative AI.

The project is designed to run without a build step or server-side code. Open `index.html` directly, publish the repository root with GitHub Pages, or deploy it as a plain static project on Vercel.

## What it does

- Draws built-in objects from nature, animals, people, buildings, vehicles, food, household items, tools and technology, space and sky, symbols, and fantasy.
- Understands a useful subset of prompt language: known object names and aliases, common plurals, quantities, several colors and sizes, selected modifiers, simple spatial relationships, some environments, and quoted text.
- Uses a seeded pseudo-random number generator so an unchanged prompt and seed produce the same layout and pencil variation.
- Turns an unrecognized noun-like word into a labelled doodle instead of failing silently.
- Provides a paper-like canvas, redraw, clear, PNG export, share/copy-link controls, examples, and mobile-friendly layout.
- Includes `gallery.html`, a visual catalog that draws each registered object and reports drawing warnings or objects that leave the canvas unchanged.

The built-in library currently contains **132 registered objects**:

| Category | Objects |
|---|---:|
| Nature | 15 |
| Animals | 14 |
| People | 12 |
| Buildings | 12 |
| Vehicles | 11 |
| Food | 11 |
| Household | 13 |
| Tools & tech | 13 |
| Space & sky | 12 |
| Symbols | 10 |
| Fantasy | 9 |
| **Total** | **132** |

The gallery is the practical check for the live registry. Run it after adding or changing an object.

## How it works

The app uses a parse → layout → render pipeline:

```text
Typed prompt
    |
    v
parser.js
  - normalize and tokenize text
  - match known names and aliases
  - infer counts, attributes, stage and text
  - record recognized, corrected and unknown words
    |
    v
layout.js
  - choose object or scene composition
  - place objects and resolve supported relationships
  - assign stable per-object seeds
    |
    v
sketchEngine.js + objects.js + library/*.js
  - draw procedural shapes with pencil-like strokes
  - apply modifiers and stage details
  - add the final paper-grain overlay
    |
    v
HTML5 canvas / PNG
```

### Files and script order

The application uses classic script tags. Keep this dependency order in `index.html` and `gallery.html`:

1. `sketchEngine.js`
2. `strokeFont.js`
3. `objects.js`
4. `library/nature.js`
5. `library/animals.js`
6. `library/people.js`
7. `library/buildings.js`
8. `library/vehicles.js`
9. `library/food.js`
10. `library/household.js`
11. `library/tools-tech.js`
12. `library/space-sky.js`
13. `library/symbols.js`
14. `library/fantasy.js`
15. `library/detail-art.js`
16. `illustration-tools.js`
17. `library/advanced-illustrations.js`
18. `visual-engine.js`
19. `library/animal-illustrator.js`
20. `parser.js`
21. `layout.js`
22. `app.js` (application page only; omit it from the gallery)

The reusable construction toolkit and its extension contract are documented in `VISUAL_ENGINE.md`.

Files are ordinary browser scripts that share the single `window.Sketchbook` namespace. Do not convert them to ES modules: classic scripts allow the app to run from a local `file://` URL in browsers that block local module imports.

## How the pencil effect is made

`SketchEngine` builds drawings from Canvas 2D paths. Lines receive multiple passes with small seeded offsets, slight wobble and rounded joins. Curves are sampled and stroked in pencil-like passes. Circles and ellipses are formed from perturbed segments rather than mathematically perfect outlines. Hatching is clipped to shapes, while scribbles and stippling add texture and shade.

The engine draws with a multiply compositing mode so overlapping graphite strokes darken. A small reusable paper-grain pattern is generated once and tiled rather than generating noise for every canvas pixel. The app avoids a per-pixel rendering loop for the sketch itself.

Random variation comes from `Sketchbook.rng(seed)`, a mulberry32-style seeded generator. `Sketchbook.hash(str)` creates a stable unsigned 32-bit seed from text. The same prompt and seed therefore reproduce the same composition. Redraw advances the seed to create a different variation.

## Run locally

1. Download or clone the repository.
2. Keep the directory structure unchanged.
3. Open `index.html` in a current browser.
4. To use a local static server instead, run `python3 -m http.server` in the repository root and open the local address printed by Python.
5. Open `gallery.html` to inspect the registered object drawings.

No package installation, compilation, or environment configuration is required.

## Deploy to GitHub Pages

1. Push the project files to the repository's `main` branch (or the branch you intend to publish).
2. Open the repository's **Settings → Pages**.
3. Under the build and deployment settings, choose **Deploy from a branch**.
4. Select `main` and the `/ (root)` folder, then save.
5. Open the Pages address shown by GitHub after the deployment completes.

The root-level `index.html` is the site entry point. Keep all script and stylesheet paths relative, such as `./app.js` and `./style.css`, so the project also works when published beneath a repository-name path.

## Deploy to Vercel

1. Import the repository into Vercel.
2. Choose the plain static project option.
3. Leave the framework preset as **Other** (or the equivalent no-framework choice).
4. Leave the build command empty and use the repository root as the output directory / public directory according to the Vercel project screen.
5. Deploy.

There is no `vercel.json` requirement and no build output directory because the files are served as static assets.

## Add an object

Add a definition to the correct category file under `library/`. Use a unique lowercase `id`, a short list of aliases, the category name, an approximate width-to-height `aspect`, and a recipe or custom `draw()` function.

A compact recipe definition looks like this:

```js
S.register({
  id: 'sample object',
  aliases: ['sample', 'sample thing'],
  category: 'tools-tech',
  layer: 'near',
  anchor: 'ground',
  aspect: 1,
  color: '#8c8173',
  plural: 3,
  anchors: {},
  shapes: [
    ['rect', 25, 35, 50, 50, { hatch: true }],
    ['line', 25, 35, 75, 35],
    ['ellipse', 50, 35, 12, 12, false],
    ['dot', 50, 60, 2]
  ]
});
```

Use JavaScript `true` and `false` (lowercase) in recipe values. Recipe coordinates use a local box that is 100 units tall, with its origin at the top-left. The object's `aspect` determines the box width. The `x, y` position passed by the engine is the bottom-center of the object. Keep important parts inside the box and make connected parts touch or overlap naturally.

Use these recipe instructions:

- `['line', x1, y1, x2, y2]`
- `['rect', x, y, width, height, { hatch: true }]`
- `['ellipse', cx, cy, rx, ry, { hatch: true }]`
- `['poly', [x1, y1, x2, y2, ...], closed, { hatch: true }]`
- `['curve', [x1, y1, x2, y2, ...]]`
- `['arc', cx, cy, radius, startAngle, endAngle]`
- `['dot', x, y, radius]`
- `['scribble', cx, cy, radiusX, radiusY, density]`

The registration helper also accepts a `draw(engine, x, y, scale, seed, opts)` function for objects that need custom organic or multi-step drawing. Use the engine's seeded random source (`engine.random()` or its drawing methods) rather than `Math.random()` so the object remains deterministic.

To add or improve name matching, add aliases to the object's `aliases` array. To add a color keyword, update the color names in `parser.js` and the color lookup in `layout.js`. To add an abstract concept, update the `CONCEPTS` mapping in `parser.js`. Environment names and their background behavior are defined in `ENVIRONMENTS` in `parser.js` and `drawBackdrop()` in `layout.js`.

After editing, open `gallery.html`, search for the new object, check its drawing at phone and desktop widths, and try its name and aliases in `index.html`.

## Supported categories

The library is grouped into `nature`, `animals`, `people`, `buildings`, `vehicles`, `food`, `household`, `tools-tech`, `space-sky`, `symbols`, and `fantasy`. The category files register their entries in `window.Sketchbook` when loaded.

## Honest limitations

This is not an AI image generator and does not understand every possible typed instruction. It can draw only from its built-in object library, authored subject models, the parser's known vocabulary and the fallback doodle system. Unknown words become labelled abstract doodles; they are not transformed into accurate drawings of arbitrary real-world objects. The Visual Engine adds reusable curve construction, lighting planes, pressure-tapered marks, material textures and basic skeletal posing for subject-specific illustrations. It does not learn visual concepts or infer arbitrary anatomy like a trained image model. Complex multi-clause grammar, fine spatial relationships, text placement, object proportions and dense scenes can still be interpreted imperfectly. The current German Shepherd model is an early stylized prototype, not a finished realistic illustration or a general-purpose image-generation model.

The drawing code uses Canvas 2D and browser APIs available in modern browsers. PNG sharing depends on browser support and may fall back to a download or image tab. Offline use begins after the local files are available; the project itself makes no runtime API calls or requires external assets.

## Contributing

- Keep the project static, dependency-free and usable from `file://`.
- Use relative asset paths and classic scripts.
- Preserve the `window.Sketchbook` interfaces and script loading order.
- Keep drawing deterministic; do not use `Math.random()` in object drawing or layout code.
- Prefer short recipes that contributors can understand and modify.
- Test new objects in `gallery.html` and test prompt recognition in `index.html`.
- Do not add network requests, external fonts, analytics, build tools, server code or API keys.
- Keep user-facing fallbacks friendly; unexpected input should not produce a blank canvas or raw error message.

## License

This project is licensed under the MIT License. See [`LICENSE`](./LICENSE).
