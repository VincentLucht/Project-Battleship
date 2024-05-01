const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    bundle: path.resolve(__dirname, './src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name][contenthash].js',
    clean: true,
    assetModuleFilename: '[name][ext]',
  },

  // source maps
  devtool: 'source-map',

  // dev Server
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },

  // add loaders
  module: {
    rules: [
      // CSS
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },

      // images
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },

      // Babel
      {
        test: /\.js$/,
        exclude: {
          and: [/node_modules/], // Exclude libraries in node_modules ...
          not: [
            // Except for a few of them that needs to be transpiled because they use modern syntax
            /unfetch/,
            /d3-array|d3-scale/,
            /@hapi[\\/]joi-date/,
          ],
        },
      },
    ],
  },

  // plugins
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Template Repo', // change title to whatever you want
      filename: 'index.html',
      // add template, will delete new additions to index.html otherwise
      template: 'src/template.html',
    }),
  ],
};
