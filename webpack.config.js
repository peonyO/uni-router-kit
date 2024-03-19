const path = require('path')
const nodeExternals = require('webpack-node-externals')

const isProduction = process.env.NODE_ENV === 'production'

let projectPath = ''

if (process.env.ADDRESS === 'home') {
  projectPath = 'E:/LD-project/uniapp_app/node_modules/uni-router-kit/dist'
}

module.exports = {
  entry: './src/scripts/index',
  target: 'node',
  mode: 'production',
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  output: {
    filename: 'bundle.js',
    path: isProduction ? path.resolve(__dirname, 'dist') : projectPath,
    libraryTarget: 'umd'
  },
  externals: [nodeExternals()]
}
