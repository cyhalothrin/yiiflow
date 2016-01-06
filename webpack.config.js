var autoprefixer = require('autoprefixer');
var precss = require('precss');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: __dirname + '/src/assets/src/main.js',
  output: {
    path: __dirname + '/src/assets/dist/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
        )
      },
      {
        test: /\.jade$/,
        loader: 'jade-loader'
      }
    ]
  },
  postcss: function () {
    return [autoprefixer, precss];
  },
  resolve: {
    extensions: ['', '.js', '.css', '.jade']
  },
  plugins: [
    new ExtractTextPlugin('styles.css', { allChunks: true })
  ]
};
