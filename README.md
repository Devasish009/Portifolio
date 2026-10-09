# Spider-Man — Beyond the Mask

A responsive, editable HTML/CSS/JavaScript recreation inspired by Meher Ali's Dribbble video:
https://dribbble.com/shots/26902936-3D-Spiderman-Website-Design

## Open it

Open `dist/index.html` directly in a browser, or run `npm start` with Node.js and visit http://127.0.0.1:4173. No dependencies or build step are required. Google Fonts loads online; local fallback fonts work offline.

## Edit it

- `dist/index.html`: content, sections, links, image credits.
- `dist/styles.css`: colors, typography, layouts, breakpoints, animation.
- `dist/app.js`: menu, scroll progress, reveal effects, parallax, ability accordion.
- `dist/assets/portrait.jpg`: large hero portrait.
- `dist/assets/hero.png`: classic suit cutout.

The opening logo, typography, dark/red treatment, character imagery, and story sections recreate the reference's direction. This is a new implementation, not the original website source. Character motion uses 2D images and CSS transforms, not the original rotating 3D model. For that exact effect, supply a licensed rigged GLB/GLTF model and its animation clips, then replace the image layers with a WebGL scene. The Dribbble presentation's surrounding red frame is not part of the website viewport.

## Assets and credits

- Reference design: Meher Ali (link above).
- Portrait: https://hdqwalls.com/spiderman-self-portrait-wallpaper
- Classic suit: https://www.pngaaa.com/detail/2924041 (listed non-commercial use).
- Spider-Man belongs to Marvel. This is an unofficial personal fan prototype. Asset files are supplied for that prototype; source listings do not establish commercial rights. Replace with appropriately licensed assets for commercial deployment.

An image generation attempt was rejected; no AI-generated image is included.

Features: responsive layouts, keyboard-accessible dialogs, native section navigation, reduced-motion support, ability accordion, scroll reveals and progress, mouse parallax. No analytics, forms, accounts, or backend services.
