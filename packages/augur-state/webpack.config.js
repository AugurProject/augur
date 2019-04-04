const path = require('path');

module.exports = {
  entry: './src/run.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.json' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  externals:[{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }],
  node: {
    net: 'empty',
    fs: 'empty',
    dns: 'empty'
  }
};
