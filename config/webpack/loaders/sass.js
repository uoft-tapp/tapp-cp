const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { env } = require('../configuration.js')

module.exports = {
  test: /\.(scss|sass|css)$/i,
  use: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
      { loader: 'css-loader' },
//      { loader: 'postcss-loader', options: { sourceMap: true } },
      'resolve-url-loader',
      { loader: 'sass-loader' }
    ]
  })
}
