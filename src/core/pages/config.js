import { hasOwn } from '../../shared/utils'

// construct page config
export function createIndexJson(pagesJsonContent) {
  let pages = pagesJsonContent.pages
  const subPackages = pagesJsonContent.subPackages
  const tabBar = pagesJsonContent.tabBar
  // #subPackages
  if (subPackages && subPackages.length > 0) {
    const subPackagesPages = []
    subPackages.forEach((subPackage) => {
      subPackage.pages.forEach((page) => {
        const subPackagePath = subPackage.root + page.path
        const pageJson = {
          path: subPackagePath,
          style: page.style,
          '#subPackage': {
            root: subPackage.root
          }
        }
        subPackagesPages.push(pageJson)
      })
    })
    // 合并 pages subPackages
    pages = pages.concat(subPackagesPages)
  }
  // #tab
  if (tabBar && tabBar.list && tabBar.list.length > 0) {
    tabBar.list.forEach((tab, tIndex) => {
      pages.forEach((page) => {
        // #home
        if (tIndex === 0 && page.path === tab.pagePath) {
          page['#home'] = true
          page['#tab'] = {
            pagePath: page.path,
            text: tab.text,
            iconPath: tab.iconPath,
            selectedIconPath: tab.selectedIconPath
          }
        }
        if (page.path === tab.pagePath) {
          page['#tab'] = {
            pagePath: page.path,
            text: tab.text,
            iconPath: tab.iconPath,
            selectedIconPath: tab.selectedIconPath
          }
        }
      })
    })
  } else {
    pages[0]['#home'] = true
  }
  // #config
  pages.forEach((page) => {
    page['#config'] = {
      name: '页面名称',
      author: '页面作者',
      description: '页面描述'
    }
    if (!hasOwn(page, '#home') && !hasOwn(page, '#tab') && !hasOwn(page, '#entrance')) {
      const filterAlias = page.path.replace(/^pages\//, '').replace(/\/index$/, '')
      const alias = filterAlias.split('/').join('_').toUpperCase()
      page['#config'] = {
        ...page['#config'],
        alias: alias
      }
    }
  })
  return pages
}
