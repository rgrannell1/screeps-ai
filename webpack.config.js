
const path = require('path')
const webpack = require('webpack')

const AI_DIR = path.resolve(__dirname, 'src/ai')
const BUILD_DIR = path.resolve(__dirname, 'dist')

const config = {
  entry: {
    main: AI_DIR + '/main.ts'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].js',
    libraryTarget: 'commonjs'
  },
  optimization: {
    minimize: false
  }
}

module.exports = config
