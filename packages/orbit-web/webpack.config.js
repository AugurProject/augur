'use strict'

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const config = {
  entry: ['@babel/polyfill', './src/index.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: './',
    filename: '[name].[hash:20].js',
    globalObject: 'this'
  },
  resolve: {
    alias: {
      components: path.join(__dirname, './src/components/'),
      config: path.join(__dirname, './src/config/'),
      containers: path.join(__dirname, './src/containers/'),
      context: path.join(__dirname, './src/context/'),
      fonts: path.join(__dirname, './src/fonts/'),
      images: path.join(__dirname, './src/images/'),
      locales: path.join(__dirname, './src/locales/'),
      stores: path.join(__dirname, './src/stores/'),
      styles: path.join(__dirname, './src/styles/'),
      themes: path.join(__dirname, './src/themes/'),
      utils: path.join(__dirname, './src/utils/'),
      views: path.join(__dirname, './src/views/')
    }
  },
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: ['worker-loader', 'babel-loader'],
        include: path.resolve('src')
      },
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        include: path.resolve('src')
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('postcss-preset-env')()]
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('postcss-preset-env')()]
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash:20].[ext]',
            outputPath: 'images/'
          }
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:20].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      favicon: 'src/images/orbit_logo_32x32.png'
    })
  ]
}

module.exports = (env, argv) => {
  const isDevServer = path.basename(require.main.filename) === 'webpack-dev-server.js'

  if (isDevServer) {
    config.devtool = 'inline-source-map'

    config.devServer = {
      compress: true,
      hot: true,
      host: '0.0.0.0',
      port: 8001,
      publicPath: '/'
    }
  }

  if (!isDevServer) {
    config.plugins = config.plugins.concat([new CleanWebpackPlugin()])
  }

  return config
}
