import fs from 'fs-extra'
import {
  hasOwn,
  getTabBar,
  getGlobalStyle,
  VUE_TPL,
  VUE_TPL_3,
  SRC_PATH,
  UNI_ROUTER_PATH,
  logWarn,
  logSuccess,
  fileSuffix
} from '@/shared'

// create json/helper/vue
export function createPageConfig(pageConfig, type) {
  const pagePath = pageConfig.path
  const pageFilePath = SRC_PATH + pagePath
  const pageVuePath = pageFilePath + '.vue'
  const pageNVuePath = pageFilePath + '.nvue'
  const pageJsonPath = pageFilePath + '.json'
  const pageHelperPath = pageFilePath.replace('index', 'helper') + fileSuffix

  // create json
  if (!fs.existsSync(pageJsonPath)) {
    fs.outputJsonSync(pageJsonPath, pageConfig, {
      spaces: 2
    })
    logSuccess('create ' + pageJsonPath)
  } else {
    logWarn(pageJsonPath + ' 已存在，不执行创建操作。')
  }
  // create vue
  if (!fs.existsSync(pageVuePath) && !fs.existsSync(pageNVuePath)) {
    let vueTpl = ''
    const manifestJson = fs.readJsonSync(SRC_PATH + 'manifest.json')
    if (manifestJson.vueVersion && manifestJson.vueVersion === '3') {
      vueTpl = VUE_TPL_3
    } else {
      vueTpl = VUE_TPL
    }
    let pageClassName = pagePath.split('/')
    pageClassName = pageClassName[pageClassName.length - 2]
    vueTpl = vueTpl.replace('#PAGE_NAME#', pageClassName)
    fs.outputFileSync(pageVuePath, vueTpl, 'utf-8')
    logSuccess('create ' + pageVuePath)
  } else {
    logWarn(pageVuePath + ' 已存在，不执行创建操作。')
  }
  // create helpers
  if (!fs.existsSync(pageHelperPath)) {
    fs.outputFileSync(pageHelperPath, `// helper ${pageHelperPath}`, 'utf-8')
    logSuccess('create ' + pageHelperPath)
  } else {
    logWarn(pageHelperPath + ' 已存在，不执行创建操作。')
  }
}

// create _uni_router
export function createUniRouter() {
  // create tabBar
  const tabBar = getTabBar()
  const tabBarPath = UNI_ROUTER_PATH + 'tabBar.json'
  if (hasOwn(tabBar, 'list')) {
    delete tabBar.list
    if (!fs.existsSync(tabBarPath)) {
      fs.outputJsonSync(tabBarPath, tabBar, {
        spaces: 2
      })
      logSuccess('create ' + 'tabBar')
    } else {
      logWarn(tabBarPath + ' 已存在，不执行创建操作。')
    }
  }

  // create globalStyle
  const globalStyle = getGlobalStyle()
  const globalStylePath = UNI_ROUTER_PATH + 'globalStyle.json'
  if (!fs.existsSync(globalStylePath)) {
    fs.outputJsonSync(globalStylePath, globalStyle, {
      spaces: 2
    })
    logSuccess('create ' + 'globalStyle')
  } else {
    logWarn(tabBarPath + ' 已存在，不执行创建操作。')
  }
}

// create routers/alias
export function createPageAlias(pagesConfig) {
  let pagesPath = {
    HOME_PAGE: '',
    TAB_LIST: []
  }
  pagesConfig.forEach((pageConfig) => {
    if (hasOwn(pageConfig, '#entrance')) {
      pagesPath = {
        ENTRANCE_PAGE: pageConfig.path,
        ...pagesPath
      }
      return
    }
    if (hasOwn(pageConfig, '#home') && pageConfig['#home']) {
      pagesPath['HOME_PAGE'] = pageConfig.path
      if (hasOwn(pageConfig, '#tab')) {
        pagesPath['TAB_LIST'].push(pageConfig.path)
      }
      return
    }
    if (hasOwn(pageConfig, '#tab') && pageConfig['#tab']) {
      pagesPath['TAB_LIST'].push(pageConfig.path)
    }
    let aliasName = ''
    if (pageConfig['#config'].alias) {
      aliasName = pageConfig['#config'].alias
    } else {
      const filterAlias = pageConfig.path
        .replace(/^pages\//, '')
        .replace(/\/index$/, '')
      aliasName = filterAlias.split('/').join('_').toUpperCase()
    }
    pagesPath[aliasName] = pageConfig.path
  })
  const aliasPath = SRC_PATH + 'routers/alias' + fileSuffix
  const aliasTpl = `export default ${JSON.stringify(pagesPath)}${
    fileSuffix === '.ts' && ' as const'
  }`
  fs.outputFileSync(aliasPath, aliasTpl, 'utf-8')
  logSuccess('create ' + aliasPath)
}

// create routers/exclude.js
export function createPageExclude(pageConfigList) {
  const excludeList = {}
  pageConfigList.forEach((item) => {
    const exclude = item['#config'].exclude
    const pagePath = item.path
    if (exclude) {
      if (excludeList[exclude]) {
        excludeList[exclude].push(pagePath)
      } else {
        excludeList[exclude] = [pagePath]
      }
    }
  })
  const excludeTpl = `export default ${JSON.stringify(excludeList)}${
    fileSuffix === '.ts' && ' as const'
  }`
  const excludePath = SRC_PATH + 'routers/exclude' + fileSuffix
  fs.outputFileSync(excludePath, excludeTpl, 'utf-8')
  logSuccess('create ' + excludePath)
}
