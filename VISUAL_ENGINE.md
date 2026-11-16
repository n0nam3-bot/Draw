# Sketchbook Visual Engine

The Visual Engine is the first reusable construction layer for Text-to-Sketch. It remains a rule-driven, procedural drawing system. It does not contain a trained model, external image collection, network dependency, or paid service.

## Load order

`index.html` and `gallery.html` load the Visual Engine after the shared object registry and the existing illustration helpers:

1. `sketchEngine.js`
2. `strokeFont.js`
3. `objects.js` and the category libraries
4. `illustration-tools.js`
5. `library/advanced-illustrations.js`
6. `visual-engine.js`
7. subject-specific model files such as `library/animal-illustrator.js`
8. `parser.js`, `layout.js`, and `app.js`

All scripts are classic scripts with relative paths. This preserves `file://` compatibility and GitHub Pages sub-path deployment.

## Coordinate system

Subject paths are authored on a 0–100 grid, with the origin at the top-left. The Visual Engine maps those points into the current `SketchEngine.withTransform()` object space. Path commands are:

- `['M', x, y]` — move to
- `['L', x, y]` — line to
- `['Q', cx, cy, x, y]` — quadratic curve
- `['C', c1x, c1y, c2x, c2y, x, y]` — cubic curve
- `['Z']` — close path

Malformed commands and non-finite coordinates are discarded or rejected before they reach Canvas 2D.

## Core API

`Sketchbook.visual` exposes:

- `path(engine, commands, options)` — smooth, multi-pass pencil contour.
- `fill(engine, commands, options)` — paper-safe solid or gradient region fill.
- `clip(engine, commands, callback)` — run marks inside a silhouette.
- `hatch(engine, commands, options)` — clipped directional or cross hatching.
- `texture(engine, commands, options)` — seeded short marks clipped to a shape.
- `strand(engine, points, options)` — normalized, pressure-tapered pencil strand.
- `strandLocal(engine, points, options)` — pressure-tapered strand in the current transformed Canvas coordinates.
- `volume(engine, commands, options)` — filled form with optional shadow texture.
- `anatomicalForm(engine, commands, options)` — volume with optional hand-authored lighting planes and material texture.
- `lightPlanes(engine, parentPath, planes)` — clipped highlight/shadow planes.
- `limb(engine, start, end, startRadius, endRadius, options)` — tapered limb volume.
- `makeRig(joints, bones)`, `poseRig(rig, pose)`, `solveTwoBone(...)`, and `drawRig(...)` — reusable skeletal landmarks and limb geometry.
- `material.fur`, `material.feather`, `material.scales`, `material.stone`, `material.wood`, `material.metal`, and `material.water` — seeded material treatments.
- `drawModel(engine, model, options)` — render a declarative list of region, line, hatch, and material-texture layers.

All procedural texture uses the engine's seeded random generator. A fixed prompt/seed therefore produces repeatable marks.

## Adding a constructed subject

Create a classic script under `library/` and register a normal object definition with `Sketchbook.register()`. Its `draw(engine, x, y, scale, seed, opts)` function runs inside the standard object transform. Use `Sketchbook.visual` to author normalized paths, volumes, material treatments and rig landmarks. Register a new ID or intentionally replace an existing ID; preserve existing aliases when replacing a definition.

A minimal model structure for `drawModel()` is:

```js
{
  id: 'sample-subject',
  layers: [
    { type: 'region', path: [['M', 18, 70], ['C', 28, 15, 75, 15, 84, 70], ['Z']], style: { outline: false } },
    { type: 'texture', material: 'fur', path: [['M', 18, 70], ['C', 28, 15, 75, 15, 84, 70], ['Z']], style: { count: 120, length: 2.4 } }
  ]
}
```

The sample is a contract illustration, not a finished subject drawing.

## Current first model and limitations

`library/animal-illustrator.js` replaces the earlier German Shepherd recipe with a hand-authored seated construction using a joint rig, a connected outer silhouette, overlapping form planes, face markings and seeded directional coat strokes. It is a first model to exercise the toolkit, not a finished realistic animal. It currently has one authored pose and needs further anatomy, facial, paw, coat and lighting refinement before it meets a professional illustration target.

The Visual Engine supplies drawing primitives and compositing tools; it does not infer arbitrary anatomy from first principles the way a trained image model does. Each new species, pose, object family and complex relation still needs authored grammar or subject-specific drawing rules. This is the honest limit of the no-AI, no-dataset approach.
