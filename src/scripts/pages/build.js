import glob from 'glob'
import fs from 'fs-extra'
import {
  getPageConfigList,
  SRC_PATH,
  UNI_ROUTER_PATH,
  logWarn
} from '@/shared'
import {
  createPageAlias,
  createPageExclude,
  getRouterPages,
  getUniRouter
} from '@/core'

function getNewPagesJson(pageConfigList) {
  // 获取 _uni_router 配置信息
  const uniRouter = glob.sync(`${UNI_ROUTER_PATH}/*.json`)
  const uniRouterConfig = getUniRouter(uniRouter)
  // 获取页面配置信息
  const routerPages = getRouterPages(pageConfigList)
  // 生成 pages.json
  const pages·json = Object.assign(routerPages, uniRouterConfig)
  const pagesJsonPath = SRC_PATH + 'pages.json'
  fs.outputJsonSync(pagesJsonPath, pages·json, {
    spaces: 2
  })
}

export function build() {
  const pageConfigList = getPageConfigList()
  if (pageConfigList.length === 0) {
    logWarn('请先使用 init 命令，初始化项目')
    return
  } else {
    const homeList = pageConfigList.filter(item => {
      return item['#home']
    })
    const entranceList = pageConfigList.filter(item => {
      return item['#entrance']
    })
    if (homeList.length > 1) {
      logWarn('[#home] 配置最多只能有一个')
      return
    }
    if (entranceList.length > 1) {
      logWarn('[#entrance] 配置最多只能有一个')
      return
    }
  }
  // 创建新的 pages.json
  getNewPagesJson(pageConfigList)
  // 创建路由拦截配置文件
  createPageExclude(pageConfigList)
  // 创建页面路径别名文件
  createPageAlias(pageConfigList)
}
