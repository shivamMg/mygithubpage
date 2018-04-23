var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');
var Webpack = require('webpack');


module.exports = {
  entry: './app/index.js',
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: { loader: 'css-loader', options: { minimize: true } },
        }),
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { minimize: true } },
            'sass-loader',
          ]
        }),
      },
      { test: /\.svg$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
      { test: /\.png$/, loader: 'url-loader?limit=10000&mimetype=image/png' },
      { test: /(raleway-latin|raleway-latin-ext)\.woff2$/, loader: 'url-loader?limit=100000&mimetype=application/font-woff2' },
    ]
  },
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/app/index.html',
      filename: 'index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
    }),
    new ExtractTextPlugin('styles.css'),
    new StyleExtHtmlWebpackPlugin(),
    new Webpack.optimize.UglifyJsPlugin(),
  ]
}