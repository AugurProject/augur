const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkerPlugin = require('worker-plugin');

const GitRevisionPlugin = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin();

const PATHS = {
  APP: path.resolve(__dirname, '../src'),
  BUILD: path.resolve(__dirname, '../build'),
  TEST: path.resolve(__dirname, '../test'),
  WASM: path.resolve(__dirname, '../../../node_modules/@0x/mesh-browser/wasm'),
  ROOT_UI: path.resolve(__dirname, '../'),
  SITEMAP: path.resolve(__dirname, '../src/modules/sitemap'),
  ORBIT: path.resolve(__dirname, '../../orbit-web'),
};

module.exports = {
  mode: 'development',
  entry: {
    // 'assets/styles/styles': `${PATHS.APP}/styles`,
    augur: [
      `${PATHS.APP}/web-workers-exit`,
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
        exclude: /node_modules/,
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
        from: path.resolve(PATHS.WASM, 'main.wasm'),
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
    new GitRevisionPlugin({
      branch: true,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        IPFS_STABLE_LOADER_HASH: process.env.IPFS_STABLE_LOADER_HASH,
        ETHEREUM_NETWORK: JSON.stringify(
          process.env.ETHEREUM_NETWORK || 'local'
        ),
        AUTO_LOGIN: process.env.AUTO_LOGIN || false,

        // Set this var to remove code that is problematic for us to host.
        // Will need to be negated in the relevant conditionals.
        AUGUR_HOSTED: process.env.AUGUR_HOSTED || false,
        ENABLE_MAINNET: process.env.ENABLE_MAINNET || false,
        CURRENT_BRANCH: JSON.stringify(gitRevisionPlugin.branch()),

        // Config overrides
        NETWORK_ID: process.env.NETWORK_ID,

        ETHEREUM_HTTP: process.env.ETHEREUM_HTTP,
        ETHEREUM_WS: process.env.ETHEREUM_WS,
        ETHEREUM_RPC_RETRY_COUNT: process.env.ETHEREUM_RPC_RETRY_COUNT,
        ETHEREUM_RPC_RETRY_INTERVAL: process.env.ETHEREUM_RPC_RETRY_INTERVAL,
        ETHEREUM_RPC_CONCURRENCY: process.env.ETHEREUM_RPC_CONCURRENCY,

        GAS_LIMIT: process.env.GAS_LIMIT,
        GAS_PRICE: process.env.GAS_PRICE,

        ENABLE_FAUCETS: process.env.ENABLE_FAUCETS,
        NORMAL_TIME: process.env.NORMAL_TIME,
        ETHEREUM_PRIVATE_KEY: process.env.ETHEREUM_PRIVATE_KEY,
        SAVE_PRIVATE_KEY: process.env.SAVE_PRIVATE_KEY,
        CONTRACT_INPUT_PATH: process.env.CONTRACT_INPUT_PATH,
        WRITE_ARTIFACTS: process.env.WRITE_ARTIFACTS,

        GSN_ENABLED: process.env.GSN_ENABLED,

        ZEROX_RPC_ENABLED: process.env.ZEROX_RPC_ENABLED,
        ZEROX_RPC_WS: process.env.ZEROX_RPC_WS,
        ZEROX_MESH_ENABLED: process.env.ZEROX_MESH_ENABLED,
        ZEROX_USE_BOOTSTRAP_LIST: process.env.ZEROX_USE_BOOTSTRAP_LIST,
        ZEROX_MESH_BOOTSTRAP_LIST: process.env.ZEROX_MESH_BOOTSTRAP_LIST,

        SDK_ENABLED: process.env.SDK_ENABLED,
        SDK_WS: process.env.SDK_WS,

        UPLOAD_BLOCK_NUMBER: process.env.UPLOAD_BLOCK_NUMBER,

        ADDRESSES: process.env.ADDRESSES,
      },
    }),
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
};
