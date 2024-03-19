import { getPageConfigList, SRC_PATH, logSuccess } from '@/shared'
import fs from 'fs-extra'

export function link() {
  const pageConfigList = getPageConfigList('export')
  const pagesConfigPath = SRC_PATH + 'app_router.json'
  fs.outputJsonSync(pagesConfigPath, pageConfigList, {
    spaces: 2
  })
  logSuccess('create ' + pagesConfigPath)
}
