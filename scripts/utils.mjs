import { readdir, unlink } from "fs/promises";
import path from "path";

export function isProd() {
  return process.argv.some((arg) => arg.toLowerCase() === "--prod");
}

export function getFilenameWithoutExt(filePath) {
  return path.parse(filePath).name;
}

export async function deleteAllFilesInDir(dirPath) {
  try {
    const files = await readdir(dirPath);

    await Promise.all(files.map((file) => unlink(path.join(dirPath, file))));
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(`Ошибка при очистке директории ${dirPath}:`, err);
    }
  }
}
