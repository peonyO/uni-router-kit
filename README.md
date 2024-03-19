# uni-router-kit

uni-router-kit: 一个用于提升 uni-app 开发体验以及对路由管理的扩展套件。

## 安装

```
$ npm install uni-router-kit --save-dev
```

## 命令

```
// package.json 配置以下脚本
"scripts": {
  "rkit:init": "npx rkit init",
  "rkit:build": "npx rkit build",
  "rkit:watch": "npx rkit watch",
  "rkit:add": "npx rkit add",
  "rkit:link": "npx rkit link"
},

// 执行脚本
$ npm run rkit:init // 根据 pages.json 初始化目录中配置

$ npm run rkit:build // 根据目录下 index.json 变化, 生成新的 pages.json 以及 router/alias.js 和 router/exclude.js

$ npm run rkit:watch // 监听目录下 index.json 变化, 生成新的 pages.json 以及 router/alias.js 和 router/exclude.js

$ npm run rkit:add // 新增页面，请使用此命令

? 选择要创建的视图类型 (Use arrow keys)
> 页面 ✔
  组件
? 请输入视图目录名称 template/user
? 是否为分包视图 (y/N) N
? 请输入页面路由别名 PERSONAL_CENTER
? 请输入页面名称 个人中心
? 请输入页面作者 张三
? 请输入页面描述 用户在此页面可查看个人信息

$ npm run rkit:link // 导出所有页面的配置

```

## 注意事项

- **请忽略 pages.json 文件目录的修改，防止提交文件时冲突**
- **生成为 vue 文件，如需要 nvue 请手动修改文件后缀**
