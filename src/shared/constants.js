import { isCli } from "./path";
import fs from "fs-extra";
import { hasOwn } from "./utils";

export const SRC_PATH = isCli() ? "src/" : "";
const isTs = hasOwn(
  fs.readJsonSync("package.json").devDependencies,
  "typescript"
);
export const fileSuffix = isTs ? ".ts" : ".js";
export const UNI_ROUTER_PATH = SRC_PATH + "routers/config/";
export const UNI_CONFIG_PATH = "router.config.js";
export const VUE_TPL = `<template>
  <view class="#PAGE_NAME#">

  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped></style>`;

export const VUE_TPL_3 = `<template></template>

<script lang="ts" setup></script>

<style lang="scss"></style>`;
