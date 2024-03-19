import fs from 'fs-extra'
import {
  SRC_PATH,
  VUE_TPL,
  VUE_TPL_3,
  logWarn,
  logSuccess
} from '@/shared'
import { createPageConfig } from '@/core'
import { build } from './build'

function createPage(answers) {
  let { path } = answers
  const { subPackage } = answers
  path = path.replace(/^\//, '').replace(/\/$/, '')
  path = path.match(/^\/?pages\//) ? path : 'pages/' + path
  path = path.match(/\/index$/) ? path : path + '/index'
  const filterAlias = path.replace(/^pages\//, '').replace(/\/index$/, '')
  const alias = filterAlias.split('/').join('_').toUpperCase()
  let config = {
    path,
    style: {
      'app-plus': {},
      'h5': {},
      'mp-weixin': {},
      'mp-alipay': {},
      'mp-baidu': {},
      'mp-toutiao': {}
    },
    '#config': {
      name: answers.name || '页面名称',
      author: answers.author || '页面作者',
      description: answers.description || '页面描述',
      alias: answers.alias || alias
    }
  }
  if (subPackage) {
    config = {
      ...config,
      '#subPackage': {
        root: `${path.split('/')[0]}/${path.split('/')[1]}`
      }
    }
  }
  const pagePath = config.path
  const pageFilePath = SRC_PATH + pagePath
  const pageDir = pageFilePath.replace(/\/[a-z\d\-]+$/, '')
  if (fs.existsSync(pageDir)) {
    logWarn(`目录[${pageDir}]已存在，为确保每个页面拥有独立的目录，将不会执行创建操作。`)
    return
  }
  createPageConfig(config, 'create')
  build()
}

function createComponent(answers) {
  let { path, root } = answers
  const { subPackage } = answers
  if (root) {
    root = root.match(/\/$/) ? root : root + '/'
    root = root.replace(/^\//, '')
    root = root.match(/^\/?pages\//) ? root : 'pages/' + root
  }
  path = path.replace(/^\//, '').replace(/\/$/, '')
  path = path.match(/^\/?components\//) ? path : 'components/' + path
  path = path.match(/\/index$/) ? path : path + '/index'
  if (subPackage && root) {
    path = root + path
    if (!fs.existsSync(SRC_PATH + root)) {
      logWarn(`未找到【${SRC_PATH + root}】此分包目录，请创建后重新创建组件`)
      return
    }
  }
  const componentVuePath = SRC_PATH + path + '.vue'
  if (fs.existsSync(componentVuePath)) {
    logWarn(`【${componentVuePath}】此组件已存在`)
    return
  }
  const componentNVuePath = SRC_PATH + path + '.nvue'
  if (fs.existsSync(componentNVuePath)) {
    logWarn(`【${componentNVuePath}】此组件已存在`)
    return
  }
  let pageClassName = componentVuePath.split('/')
  pageClassName = pageClassName[pageClassName.length - 2]
  let vueTpl = VUE_TPL
  const manifestJson = fs.readJsonSync(SRC_PATH + 'manifest.json')
  if (manifestJson.vueVersion && manifestJson.vueVersion === '3') {
    vueTpl = VUE_TPL_3
  } else {
    vueTpl = VUE_TPL
  }
  vueTpl = vueTpl.replace('#PAGE_NAME#', pageClassName)
  fs.outputFileSync(componentVuePath, vueTpl, 'utf-8')
  logSuccess('create ' + componentVuePath)
}

export function create(answers) {
  if (answers.mode === 'page') {
    createPage(answers)
  } else if (answers.mode === 'component') {
    createComponent(answers)
  }
}
