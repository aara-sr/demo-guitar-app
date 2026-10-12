# Guitar One prototype

Static, clickable iOS-style prototype for Guitar One, an AI guitar tutor for beginners. It uses only plain HTML, CSS, and vanilla JavaScript. There is no camera, microphone, audio, machine learning, backend, or build step.

## Run

Double-click `index.html`, or open the folder with VS Code and use Live Server. The phone frame scales down automatically when the viewport is shorter than the reference device.

## SF Symbols font

Place the local font at `assets/fonts/SFSymbols.ttf`. The symbol names used by the prototype are listed in the comment at the top of `symbols.js`. Paste the correct private-use glyph for each name into the `SYMBOLS` map. Until then, the visible fallback characters keep every icon legible.

## Demo behavior

The permission dialogs, camera readiness checks, strum accuracy, tuner drift, metronome, alerts, sheets, toasts, lesson completion, and reset link are simulated entirely in `app.js`.