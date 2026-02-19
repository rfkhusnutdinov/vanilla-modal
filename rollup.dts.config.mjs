import path from "path";
import dts from "rollup-plugin-dts";

const SCRIPTS_SRC_PATH = "src";
const SCRIPTS_DIST_PATH = "dist";
const SCRIPTS_FILES = ["index.ts"];

const createDtsConfig = (file) => ({
  input: path.join(SCRIPTS_SRC_PATH, file),
  output: {
    file: path.join(SCRIPTS_DIST_PATH, `${path.parse(file).name}.d.ts`),
    format: "es",
  },
  plugins: [dts()],
});

export default SCRIPTS_FILES.map(createDtsConfig);
