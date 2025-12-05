import chokidar from "chokidar";

import { buildAllScripts } from "./build-scripts.mjs";
import { buildAllStyles } from "./build-styles.mjs";

chokidar.watch("src/js").on("change", async () => {
  await buildAllScripts();
});

chokidar.watch("src/styles").on("change", async () => {
  await buildAllStyles();
});
