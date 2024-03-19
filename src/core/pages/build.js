import fs from "fs-extra";
import { hasOwn } from "@/shared";

// 获取页面的 pages.json 配置
export function getRouterPages(pageConfigList) {
  const pagesJSON = {
    pages: [],
    subPackages: [],
  };
  const homeList = [];
  const tabBarList = [];
  pageConfigList.forEach((item) => {
    if (hasOwn(item, "#home") && item["#home"]) {
      homeList.push({
        path: item.path,
        style: item.style,
      });
    } else if (hasOwn(item, "#entrance") && item["#entrance"]) {
      homeList.unshift({
        path: item.path,
        style: item.style,
      });
    } else if (hasOwn(item, "#tab") && item["#tab"] && !hasOwn(item, "#home")) {
      tabBarList.push({
        path: item.path,
        style: item.style,
      });
    } else if (hasOwn(item, "#subPackage")) {
      const subPackageOfIndex = pagesJSON.subPackages.findIndex(
        (subPackage) => {
          return subPackage.root === item["#subPackage"].root;
        }
      );
      const subPackagePath = item.path.replace(
        item["#subPackage"].root + "/" || "",
        ""
      );
      if (~subPackageOfIndex) {
        const page = {
          path: subPackagePath,
          style: item.style,
        };
        pagesJSON.subPackages[subPackageOfIndex].pages.push(page);
      } else {
        const subPackage = {
          root: item["#subPackage"].root,
          pages: [
            {
              path: subPackagePath,
              style: item.style,
            },
          ],
        };
        pagesJSON.subPackages.push(subPackage);
      }
    } else {
      pagesJSON.pages.push({
        path: item.path,
        style: item.style,
      });
    }
  });
  pagesJSON.pages = [...homeList, ...tabBarList, ...pagesJSON.pages];
  return pagesJSON;
}

// get _uni_router 配置
export function getUniRouter(uniRouter) {
  const othorRouterConfig = {};
  uniRouter.forEach((jsonPath) => {
    const json = fs.readJsonSync(jsonPath);
    const keyName = jsonPath
      .replace(/^src\/routers\/config\//, "")
      .replace(/\.json$/, "");
    othorRouterConfig[keyName] = json;
  });
  return {
    ...othorRouterConfig,
  };
}
