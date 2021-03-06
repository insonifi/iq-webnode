var CompressionPlugin = require("compression-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack');
module.exports = {
  entry: {
    app: './app/index',
    dash: './app/dash',
    map: './app/map'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: ('style!css') },
      { test: /\.less$/, loader: ExtractTextPlugin.extract('style-loader', 'css!less') },
      {
        test: /\.(jsx?|es6)$/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        },
        exclude: /node_modules/
      },
      { test: /\.(jpe?g|png|gif|svg)$/, loaders: [
            'file?name=img/[name].[ext]',
            'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ] }
    ]
  },
  output: {
    path: './',
    publicPath: './',
    filename: '[name].js',
    sourceMapFilename: 'app.map'
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx', 'es6']
  },
  devtool: 'source-map',
  plugins: [
        new ExtractTextPlugin('[name].css'),
//         new webpack.DefinePlugin({NODE_ENV: 'production'}),
//         new webpack.optimize.DedupePlugin(),
//         new webpack.optimize.UglifyJsPlugin(),
        new HtmlWebpackPlugin()/*,
        new CompressionPlugin({
            asset: "{file}",
            algorithm: "gzip",
            regExp: /\.js$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })*/
    ]
}
