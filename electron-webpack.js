var path = require('path')


var APP_DIR = path.resolve(__dirname, 'src')

var config = {
  entry: APP_DIR + '/index.js',
  resolve: {
    extensions: ['.html', '.less', '.json', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test : /\.jsx?/,
        loader : 'babel-loader'
      },
      {
        test: /\.less/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]_[local]'
            }
          },
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.css/,
        use: ['style-loader', 'postcss-loader']
      }
    ]
  }
}

module.exports = config
