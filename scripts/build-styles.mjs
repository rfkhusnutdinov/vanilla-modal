import { compile } from "sass";
import { writeFile } from "fs/promises";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

import { isProd, getFilenameWithoutExt, deleteAllFilesInDir } from "./utils.mjs";
import { STYLES_DIST_PATH, STYLES_FILES, STYLES_SRC_PATH } from "./constants.mjs";

const PROD = isProd();

async function processCss(css, plugins, outFile, label) {
  console.log(`📦  Processing CSS → ${label}`);
  try {
    const result = await postcss(plugins).process(css, { from: undefined });
    result.warnings().forEach((warn) => console.warn("⚠️  " + warn.toString()));
    await writeFile(outFile, result.css);
    console.log(`✅  Done: ${outFile}`);
  } catch (err) {
    console.error(`❌  Failed: ${label}`, err);
    throw err;
  }
}

async function buildStyles(file) {
  const fullFilePath = `${STYLES_SRC_PATH}/${file}`;
  const filenameWithoutExt = getFilenameWithoutExt(file);

  console.log(`\n🚀 Start building styles: ${file}`);

  const { css } = compile(fullFilePath, {
    sourceMap: !PROD,
    sourceMapIncludeSources: !PROD,
    style: PROD ? "compressed" : "expanded",
  });

  const basePlugins = [autoprefixer()];

  // Конфигурации сборки для текущего файла
  const configs = [
    {
      outFile: `${STYLES_DIST_PATH}/${filenameWithoutExt}.css`,
      plugins: PROD ? [...basePlugins, cssnano()] : basePlugins,
      label: `${file} (.css)`,
    },
    ...(PROD
      ? [
          {
            outFile: `${STYLES_DIST_PATH}/${filenameWithoutExt}.min.css`,
            plugins: [...basePlugins, cssnano()],
            label: `${file} (.min.css)`,
          },
        ]
      : []),
  ];

  for (const { outFile, plugins, label } of configs) {
    await processCss(css, plugins, outFile, label);
  }

  console.log(`🎉 Finished building styles: ${file}`);
}

export async function buildAllStyles() {
  console.log(`\n🧹 Cleaning styles folder: ${STYLES_DIST_PATH}`);
  await deleteAllFilesInDir(STYLES_DIST_PATH);

  console.log(`\n🔨 Building ${STYLES_FILES.length} style files...`);
  await Promise.all(STYLES_FILES.map(buildStyles));
  console.log(`\n✨ All styles built successfully!`);
}

await buildAllStyles();
