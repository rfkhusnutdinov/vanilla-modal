import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import autoprefixer from "autoprefixer";
import path, { resolve } from "path";
import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";

// ----------------------
// Константы
// ----------------------
const NODE_ENV = process.env.NODE_ENV || "development";
const PROD = NODE_ENV === "production";

const SCRIPTS_OUTPUT_NAME = "MyLibrary";

const SCRIPTS_SRC_PATH = "src";
const SCRIPTS_DIST_PATH = "dist/js";
const SCRIPTS_FILES = ["index.ts"];

const STYLES_DIST_PATH = "dist";

// ----------------------
// Плагины
// ----------------------
const BASE_PLUGINS = [
  commonjs(),
  nodeResolve(),
  typescript({ tsconfig: "./tsconfig.json" }),
  babel({
    babelHelpers: "bundled",
    exclude: "node_modules/**",
    extensions: [".js", ".mjs", ".ts"],
  }),
];

// ----------------------
// PostCSS конфигурация
// ----------------------
function createPostcssConfig(baseName, minimize = false) {
  return postcss({
    extract: resolve(STYLES_DIST_PATH, `${baseName}${minimize ? ".min" : ""}.css`),
    minimize,
    sourceMap: !PROD,
    use: ["sass"],
    plugins: [autoprefixer()],
  });
}

// ----------------------
// JS конфигурации
// ----------------------
function createJsConfig(file) {
  const input = path.join(SCRIPTS_SRC_PATH, file);
  const baseName = path.parse(file).name;

  const configs = [
    {
      input,
      output: {
        format: "esm",
        file: path.join(SCRIPTS_DIST_PATH, `${baseName}.esm.js`),
        sourcemap: !PROD,
      },
      plugins: [createPostcssConfig(baseName, false), ...BASE_PLUGINS],
    },
    {
      input,
      output: {
        file: path.join(SCRIPTS_DIST_PATH, `${baseName}.d.ts`),
        format: "es",
      },
      plugins: [postcss({ inject: false, extract: false }), dts()],
    },
  ];

  if (PROD) {
    configs.push(
      {
        input,
        output: {
          format: "umd",
          file: path.join(SCRIPTS_DIST_PATH, `${baseName}.js`),
          name: SCRIPTS_OUTPUT_NAME,
          sourcemap: !PROD,
        },
        plugins: [createPostcssConfig(baseName, false), ...BASE_PLUGINS],
      },
      {
        input,
        output: {
          format: "umd",
          file: path.join(SCRIPTS_DIST_PATH, `${baseName}.min.js`),
          name: SCRIPTS_OUTPUT_NAME,
          sourcemap: false,
        },
        plugins: [createPostcssConfig(baseName, true), ...BASE_PLUGINS, terser()],
      },
    );
  }

  return configs;
}

export default SCRIPTS_FILES.flatMap(createJsConfig);
