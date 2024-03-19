import fs from 'fs-extra'
import glob from 'glob'
import { SRC_PATH } from './constants'
import { formatJson, hasOwn } from './utils'
import { logError } from './log'

function validateUniApp() {
  let result = ''
  if (fs.pathExistsSync('manifest.json')) {
    result = 'hx'
  } else if (fs.pathExistsSync('src/manifest.json')) {
    result = 'cli'
  }
  return result
}

const isUniApp = validateUniApp()
// 是否通过 cli 创建的项目
export function isCli() {
  return isUniApp === 'cli'
}

// 获取pages.json
export function getPagesJSON() {
  const srcPagesJsonPath = SRC_PATH + 'pages.json'
  try {
    const pagesJsonString = fs.readFileSync(srcPagesJsonPath, 'utf-8')
    const pagesJsonContent = formatJson(pagesJsonString)
    return pagesJsonContent
  } catch (error) {
    logError('未找到 pages.json 文件')
  }
}

// 获取 TabBar
export function getTabBar() {
  const pagesJsonContent = getPagesJSON()
  return pagesJsonContent.tabBar || {}
}

// 获取 globalStyle
export function getGlobalStyle() {
  const pagesJsonContent = getPagesJSON()
  return pagesJsonContent.globalStyle
}

// 获取所有页面目录下 index.json 的配置
export function getPageConfigList(type) {
  const pageConfigPath = glob.sync(SRC_PATH + '*pages/**/*.json')
  const pageConfigList = []
  pageConfigPath.forEach(item => {
    const pageConfig = JSON.parse(fs.readFileSync(item, 'utf-8'))
    if (hasOwn(pageConfig['#config'], 'using') && !pageConfig['#config'].using && type !== 'export') {
      return
    }
    pageConfigList.push(pageConfig)
  })
  return pageConfigList
}
