import path from "path";

import { rollup } from "rollup";
import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

import { isProd, deleteAllFilesInDir } from "./utils.mjs";
import { SCRIPTS_FILES, SCRIPTS_SRC_PATH, SCRIPTS_DIST_PATH } from "./constants.mjs";

const PROD = isProd();
const SOURCEMAP = !PROD;

const BASE_PLUGINS = [
  commonjs(),
  nodeResolve(),
  babel({
    babelHelpers: "bundled",
    exclude: "node_modules/**",
  }),
];

function resolveFileName(template, file) {
  return template.replace("[name]", path.parse(file).name);
}

async function buildBundle(input, format, fileName, file, plugins) {
  const resolvedFileName = resolveFileName(fileName, file);
  console.log(`📦  Building ${file} → ${resolvedFileName} (${format})...`);

  try {
    const bundle = await rollup({
      input,
      plugins,
    });

    await bundle.write({
      sourcemap: SOURCEMAP,
      format,
      dir: SCRIPTS_DIST_PATH,
      entryFileNames: fileName,
    });

    console.log(`✅  Done: ${resolvedFileName}`);
  } catch (err) {
    console.error(`❌  Failed: ${file} (${resolvedFileName})`, err);
    throw err;
  }
}

async function buildScripts(file) {
  const fullFilePath = `${SCRIPTS_SRC_PATH}/${file}`;
  console.log(`\n🚀 Start building: ${file}`);

  const configs = [
    { format: "umd", fileName: "[name].js" },
    { format: "esm", fileName: "[name].esm.js" },
    ...(PROD ? [{ format: "umd", fileName: "[name].min.js", extra: [terser()] }] : []),
  ];

  for (const { format, fileName, extra = [] } of configs) {
    await buildBundle(fullFilePath, format, fileName, file, [...BASE_PLUGINS, ...extra]);
  }

  console.log(`🎉 Finished building: ${file}`);
}

export async function buildAllScripts() {
  console.log(`\n🧹 Cleaning output folder: ${SCRIPTS_DIST_PATH}`);
  await deleteAllFilesInDir(SCRIPTS_DIST_PATH);

  console.log(`\n🔨 Building ${SCRIPTS_FILES.length} scripts...`);
  await Promise.all(SCRIPTS_FILES.map(buildScripts));
  console.log(`\n✨ All scripts built successfully!`);
}

await buildAllScripts();
