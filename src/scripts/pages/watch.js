import glob from "glob";
import chokidar from "chokidar";
import { UNI_ROUTER_PATH, SRC_PATH, logInfo, logSuccess } from "@/shared";
import { build } from "./build";

export function watch() {
  const uniRouter = glob.sync(`${UNI_ROUTER_PATH}/*.json`);
  const routersFilesPath = glob.sync(SRC_PATH + "*pages/**/*.json");
  const watcher = chokidar.watch([...routersFilesPath, ...uniRouter]);
  let isReady = false;

  watcher
    .on("ready", () => {
      isReady = true;
      logInfo("watcher is ready, waiting for changes...");
      build();
    })
    .on("add", (path) => {
      if (isReady) {
        logSuccess("add file [" + path + "]");
        build();
      }
    })
    .on("addDir", (path) => {
      if (isReady) {
        logSuccess("add directory [" + path + "]");
        build();
      }
    })
    .on("change", (path) => {
      if (isReady) {
        logSuccess("change [" + path + "]");
        build();
      }
    })
    .on("unlink", (path) => {
      if (isReady) {
        logSuccess("unlink [" + path + "]");
        build();
      }
    });

  return watcher;
}
