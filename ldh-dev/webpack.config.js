// webpack 라이브러리에 대한 설정 파일

const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports={
  context: path.join(__dirname + '/src'),
  entry: './resources/js/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname + '/dist')
  },
  mode: 'none',
  plugins: [

    new CopyWebpackPlugin({
      patterns: [
        {
          from: "resources/assets/",
          to: "assets/"
        }
      ]
    }),

    new HtmlWebPackPlugin({
      template: './index.html',
      filename: 'index.html'
    })
  ]
}
