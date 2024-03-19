#!/usr/bin/env node

const program = require('commander')
const bundle = require('../dist/bundle')
const pkg = require('../package.json')
const process = require('process')
const inquirer = require('inquirer')

program.command('init').action(() => {
  bundle.init()
})

program.command('watch').action(() => {
  bundle.watch()
})

program.command('link').action(() => {
  bundle.link()
})

program.command('build').action(() => {
  bundle.build()
})

program
  .command('add')
  .description('新建视图')
  .action(function() {
    inquirer
      .prompt([
        {
          type: 'list',
          message: '选择要创建的视图类型',
          name: 'mode',
          choices: [
            {
              name: '页面',
              value: 'page'
            },
            {
              name: '组件',
              value: 'component'
            }
          ]
        },
        {
          type: 'input',
          message: '请输入视图目录名称',
          name: 'path',
          validate: function(value) {
            var done = this.async()
            if (/^[a-z\d\-\/]+$/.test(value)) {
              done(null, true)
            } else {
              done('页面路径格式错误')
            }
          }
        },
        {
          type: 'confirm',
          name: 'subPackage',
          message: '是否为分包视图',
          default: true
        }
      ])
      .then((answers) => {
        if (answers.mode === 'component' && answers.subPackage) {
          inquirer
            .prompt([
              {
                type: 'input',
                message: '请输入分包目录',
                name: 'root',
                validate: function(value) {
                  var done = this.async()
                  if (/^[a-z\d\-\/]+$/.test(value)) {
                    done(null, true)
                  } else {
                    done('页面路径格式错误')
                  }
                }
              }
            ])
            .then((answer) => {
              answers = Object.assign(answers, answer)
              bundle.create(answers)
            })
          return
        }
        if (answers.mode === 'page') {
          inquirer
            .prompt([
              {
                type: 'input',
                message: '请输入页面路由别名（可为空）',
                name: 'alias'
              },
              {
                type: 'input',
                message: '请输入页面名称（可为空）',
                name: 'name'
              },
              {
                type: 'input',
                message: '请输入页面作者（可为空）',
                name: 'author'
              },
              {
                type: 'input',
                message: '请输入页面描述（可为空）',
                name: 'description'
              }
            ])
            .then((answer) => {
              answers = Object.assign(answers, answer)
              bundle.create(answers)
            })
          return
        }
        bundle.create(answers)
      })
  })

// parse 这个操作是必须的
program.version(pkg.version, '-v, --version').parse(process.argv)
