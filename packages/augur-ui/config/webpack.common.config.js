const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkerPlugin = require('worker-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const { buildConfig } = require('@augurproject/artifacts');
const { serializeConfig } = require('@augurproject/utils');


const PATHS = {
  APP: path.resolve(__dirname, '../src'),
  BUILD: path.resolve(__dirname, '../build'),
  TEST: path.resolve(__dirname, '../test'),
  WASM: path.resolve(__dirname, '../../../node_modules/@0x/mesh-browser/wasm'),
  ROOT_MONOREPO: path.resolve(__dirname, "../../../"),
  ROOT_UI: path.resolve(__dirname, '../'),
  SITEMAP: path.resolve(__dirname, '../src/modules/sitemap'),
  ORBIT: path.resolve(__dirname, '../../orbit-web'),
};

const AUGUR_ENV = process.env.AUGUR_ENV || process.env.ETHEREUM_NETWORK || 'local';
const config = buildConfig(AUGUR_ENV);

if(!process.env.CURRENT_COMMITHASH || !process.env.CURRENT_VERSION) {
  const gitRevisionPlugin = new GitRevisionPlugin({
    branch: false
  });
  process.env.CURRENT_COMMITHASH = process.env.CURRENT_COMMITHASH || gitRevisionPlugin.commithash();
  process.env.CURRENT_VERSION = process.env.CURRENT_VERSION || gitRevisionPlugin.version();
}

module.exports = {
  mode: 'development',
  entry: {
    // 'assets/styles/styles': `${PATHS.APP}/styles`,
    augur: [
      `${PATHS.APP}/web-workers-exit`,
      'react-dates/initialize',
      'react',
      'react-dom',
      'redux',
      'redux-thunk',
      'react-datetime',
      `${PATHS.APP}/main`,
    ],
  },
  output: {
    pathinfo: false,
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: PATHS.BUILD,
    publicPath: '',
  },
  resolve: {
    modules: ['node_modules', PATHS.APP],
    extensions: ['.html', '.less', '.json', '.js', '.jsx', '.ts', '.tsx'],
    alias: {
      assets: path.resolve(PATHS.APP, 'assets'),
      config: path.resolve(PATHS.APP, 'config'),
      modules: path.resolve(PATHS.APP, 'modules'),
      reducers: path.resolve(PATHS.APP, 'reducers'),
      services: path.resolve(PATHS.APP, 'services'),
      utils: path.resolve(PATHS.APP, 'utils'),
      test: PATHS.TEST,
      assertions: path.resolve(PATHS.TEST, 'assertions'),
    },
    symlinks: false,
  },
  module: {
    rules: (rules = [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          experimentalWatchApi: true,
          projectReferences: true,
          transpileOnly: process.env.TYPE_CHECKING !== 'true',
        },
      },
      //{
      //  test: /\.js$/,
      //  use: ["source-map-loader"],
      //  enforce: "pre",
      //  include: /@augurproject\/.*/,
      //  exclude: /node_modules\/.*/,
      //},
      {
        test: /npm-cli|node-hid/,
        loader: 'null-loader',
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
      {
        test: /\.(mp3|png)$/,
        loader: 'file-loader',
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              camelCase: true,
              modules: true,
              namedExport: true,
              localIdentName: '[name]_[local]',
            },
          },
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: PATHS.ROOT_UI,
              },
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /.*(node_modules|orbit-web).*/,
        include: PATHS.SITEMAP,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ]),
  },
  optimization: {
    // https://webpack.js.org/configuration/optimization/#optimization-usedexports
    // `unusedExports: true` is required by DeadCodePlugin
    usedExports: true,
    splitChunks: {
      maxSize: 7 * 1024 * 1024,
    },
  },
  plugins: [
    new WorkerPlugin({
      globalObject: 'self',
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(PATHS.APP, 'StableIPFSLoader.html'),
        to: path.resolve(PATHS.BUILD, 'StableIPFSLoader.html'),
      },
      {
        from: path.resolve(PATHS.ROOT_MONOREPO, 'node_modules/@0x/mesh-browser/wasm/main.wasm'),
        to: path.resolve(PATHS.BUILD, 'zerox.wasm'),
      },
      {
        from: path.resolve(PATHS.APP, 'config/manifest.json'),
        to: path.resolve(PATHS.BUILD, 'config'),
      },
      {
        from: path.resolve(PATHS.APP, 'favicon.ico'),
        to: PATHS.BUILD,
      },
      {
        from: path.resolve(PATHS.APP, 'assets/fonts'),
        to: path.resolve(PATHS.BUILD, 'fonts'),
      },
      {
        from: path.resolve(PATHS.APP, 'assets/images'),
        to: path.resolve(PATHS.BUILD, 'images'),
      },
      {
        from: path.resolve(PATHS.APP, 'assets/videos'),
        to: path.resolve(PATHS.BUILD, 'videos'),
      },
      {
        from: path.resolve(PATHS.APP, 'sitemap.xml'),
        to: PATHS.BUILD,
      },
      {
        from: path.resolve(PATHS.APP, 'robots.txt'),
        to: PATHS.BUILD,
      },
      {
        from: path.resolve(PATHS.ORBIT, 'dist'),
        to: path.resolve(PATHS.BUILD, 'chat'),
      },
    ]),
    new HtmlWebpackPlugin({
      template: path.resolve(PATHS.APP, 'index.ejs'),
      environment: process.env.NODE_ENV,
      chunksSortMode: (a, b) => {
        const order = [
          'web-workers-exit',
          'common',
          'assets/scripts/vendor',
          'assets/styles/styles',
          'main',
        ];

        return order.indexOf(b.names[0]) + order.indexOf(a.names[0]);
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        AUGUR_ENV: JSON.stringify(AUGUR_ENV),
        AUTO_LOGIN: process.env.AUTO_LOGIN || false,
        CURRENT_COMMITHASH: JSON.stringify(process.env.CURRENT_COMMITHASH),
        CURRENT_VERSION: JSON.stringify(process.env.CURRENT_VERSION),
        ETHEREUM_NETWORK: JSON.stringify(AUGUR_ENV),
        IPFS_STABLE_LOADER_HASH: JSON.stringify(process.env.IPFS_STABLE_LOADER_HASH),

        // Set this var to remove code that is problematic for us to host.
        // Will need to be negated in the relevant conditionals.
        AUGUR_HOSTED: process.env.AUGUR_HOSTED || false,
        ENABLE_MAINNET: process.env.ENABLE_MAINNET || false,
        REPORTING_ONLY: process.env.REPORTING_ONLY || false,

        CONFIGURATION: serializeConfig(config)
      },
    }),
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  devtool: 'source-map',
};
