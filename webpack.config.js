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
        generator: {
          filename: 'img/[name][ext]',
        },
      },

      // Babel
      {
        test: /\.js$/,
        exclude: {
          and: [/node_modules/],
          not: [
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
      title: 'Template Repo',
      filename: 'index.html',
      template: 'src/template.html',
    }),
  ],
};
