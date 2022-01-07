const path = require('path');
const isProduction = process.env.NODE_ENV === 'production';
const stylesHandler = 'style-loader';

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../public/dist')
  },
  devServer: {
    open: true,
    hot: true,
    host: 'localhost'
  },
  plugins: [
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset'
      }
    ]
  }
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
    config.devtool = 'source-map';
  }
  return config;
};
