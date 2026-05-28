import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

const candidatePaths = [
  path.resolve(currentDirectory, "../../.env"),
  path.resolve(currentDirectory, "../.env")
];

let envLoaded = false;

const loadEnv = () => {
  if (envLoaded) {
    return;
  }

  for (const envPath of candidatePaths) {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      envLoaded = true;
      return;
    }
  }

  dotenv.config();
  envLoaded = true;
};

export default loadEnv;
