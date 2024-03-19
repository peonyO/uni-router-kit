import {
  formatDateTime
} from './utils'
const colors = require('colors/safe')

function getTagText() {
  return '[' + formatDateTime() + '] '
}

function getPerfix() {
  return '[uniaid]' + getTagText()
}

export function log(msg) {
  console.log(getPerfix() + msg)
}

export function logSuccess(msg) {
  console.log(colors.brightGreen(getPerfix() + msg))
}

export function logInfo(msg) {
  console.log(colors.brightBlue(getPerfix() + msg))
}

export function logWarn(msg) {
  console.log(colors.brightYellow(getPerfix() + msg))
}

export function logError(msg) {
  console.log(colors.brightRed(getPerfix() + msg))
}
