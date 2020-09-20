const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  mode: 'development',
  entry: './src/scripts/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [new HtmlWebpackPlugin({ template: './index.html' })],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src/scripts')],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, 'src/assets/styles')],
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 4000,
  },
}
