var webpack = require('webpack');
var Clean = require('clean-webpack-plugin');

module.exports = {
  entry: {
    main: './assets/javascripts/main.js'
  },

  resolve: {
    modules: [
      __dirname + '/assets/javascripts',
      __dirname + '/node_modules',
    ],
    extensions: ['.js']
  },

  output: {
    path: __dirname + '/.tmp/dist',
    filename: 'assets/javascripts/[name].bundle.js',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },

  plugins: [
    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new Clean(['.tmp']),

  ],
};