var CompressionPlugin = require("compression-webpack-plugin");
module.exports = {
  entry: {
    app: './app/index'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.less$/, loader: 'style!css!less' },
      { test: /\.jsx$/, loader: 'jsx?harmony' },
      { test: /\.(jpe?g|png|gif|svg)$/, loaders: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
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
    extensions: ['', '.js', '.jsx']
  },
  devtool: 'source-map',
  plugins: [
        new CompressionPlugin({
            asset: "{file}",
            algorithm: "gzip",
            regExp: /\.js$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ]
}
