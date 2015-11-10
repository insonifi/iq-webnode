var CompressionPlugin = require("compression-webpack-plugin");
var webpack = require('webpack');
module.exports = {
  entry: {
    app: './app/index'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.less$/, loader: 'style!css!less' },
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
    filename: 'app.js',
    sourceMapFilename: 'app.map'
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx', 'es6']
  },
  devtool: 'source-map',
  plugins: [
        // new webpack.DefinePlugin({NODE_ENV: 'production'}),
        // new webpack.optimize.DedupePlugin(),
        // new webpack.optimize.UglifyJsPlugin(),
        new CompressionPlugin({
            asset: "{file}",
            algorithm: "gzip",
            regExp: /\.js$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ]
}
