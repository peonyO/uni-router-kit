import { getPagesJSON } from '@/shared'
import {
  createIndexJson,
  createPageConfig,
  createUniRouter,
  createPageAlias
} from '@/core'

function readPagesJson() {
  const pagesJsonContent = getPagesJSON()
  return createIndexJson(pagesJsonContent)
}

function initPageConfig(pageList) {
  pageList.forEach(pageConfig => {
    createPageConfig(pageConfig, 'init')
  })
}

export function init() {
  const pageConfigList = readPagesJson()
  // create json/helper/vue/nvue
  initPageConfig(pageConfigList)
  // create _uni_router
  createUniRouter()
  // create alias
  createPageAlias(pageConfigList)
}
