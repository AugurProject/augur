const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkerPlugin = require('worker-plugin');

const GitRevisionPlugin = require("git-revision-webpack-plugin");
const gitRevisionPlugin = new GitRevisionPlugin();

const PATHS = {
  BUILD: path.resolve(__dirname, "../build"),
  APP: path.resolve(__dirname, "../src"),
  TEST: path.resolve(__dirname, "../test"),
  ORBIT: path.resolve(__dirname, "../../orbit-web"),
};

module.exports = {
  mode: "development",
  entry: {
    // 'assets/styles/styles': `${PATHS.APP}/styles`,
    augur: [
      'regenerator-runtime/runtime',
      `${PATHS.APP}/web-workers-exit`,
      "react",
      "react-dom",
      "redux",
      "redux-thunk",
      "moment",
      "react-datetime",
      `${PATHS.APP}/main`
    ],
  },
  output: {
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
    path: PATHS.BUILD,
    publicPath: ""
  },
  resolve: {
    modules: ["node_modules", PATHS.APP],
    extensions: [".html", ".less", ".json", ".js", ".jsx", ".ts", ".tsx"],
    alias: {
      assets: path.resolve(PATHS.APP, "assets"),
      config: path.resolve(PATHS.APP, "config"),
      modules: path.resolve(PATHS.APP, "modules"),
      reducers: path.resolve(PATHS.APP, "reducers"),
      services: path.resolve(PATHS.APP, "services"),
      store: path.resolve(PATHS.APP, "store"),
      utils: path.resolve(PATHS.APP, "utils"),
      test: PATHS.TEST,
      assertions: path.resolve(PATHS.TEST, "assertions")
    },
    symlinks: false
  },
  module: {
    rules: rules = [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          projectReferences: true,
          transpileOnly: (process.env.TYPE_CHECKING !== "true")
        }
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre",
        include: /@augurproject\/.*/,
        exclude: /node_modules\/.*/,
      },
      {
        test: /npm-cli|node-hid/,
        loader: "null-loader"
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/"
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          {
            loader: "typings-for-css-modules-loader",
            options: {
              camelCase:true,
              modules: true,
              namedExport: true,
              localIdentName: "[name]_[local]"
            }
          },
          "postcss-loader",
          "less-loader"
        ]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "postcss-loader"
        ]
      }
    ]
  },
  plugins: [
    new WorkerPlugin({
      globalObject: 'self'
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(PATHS.APP, "config/manifest.json"),
        to: path.resolve(PATHS.BUILD, "config")
      },
      {
        from: path.resolve(PATHS.APP, "favicon.ico"),
        to: PATHS.BUILD
      },
      {
        from: path.resolve(PATHS.APP, "assets/fonts"),
        to: path.resolve(PATHS.BUILD, "fonts")
      },
      {
        from: path.resolve(PATHS.APP, "assets/images"),
        to: path.resolve(PATHS.BUILD, "images")
      },
      {
        from: path.resolve(PATHS.APP, "sitemap.xml"),
        to: PATHS.BUILD
      },
      {
        from: path.resolve(PATHS.APP, "robots.txt"),
        to: PATHS.BUILD
      },
      {
        from: path.resolve(PATHS.ORBIT, "dist"),
        to: path.resolve(PATHS.BUILD, "chat")
      },
    ]),
    new HtmlWebpackPlugin({
      template: path.resolve(PATHS.APP, "index.ejs"),
      environment: process.env.NODE_ENV,
      chunksSortMode: (a, b) => {
        const order = [
          "web-workers-exit",
          "common",
          "assets/scripts/vendor",
          "assets/styles/styles",
          "main"
        ];

        return order.indexOf(b.names[0]) + order.indexOf(a.names[0]);
      }
    }),
    new GitRevisionPlugin({
      branch: true
    }),
    new webpack.DefinePlugin({
      "process.env": {
        GETH_PASSWORD: JSON.stringify(process.env.GETH_PASSWORD),
        ETHEREUM_NETWORK: JSON.stringify(process.env.ETHEREUM_NETWORK || "dev"),
        AUTO_LOGIN: process.env.AUTO_LOGIN || false,

        // Set this var to remove code that is problematic for us to host.
        // Will need to be negated in the relevant conditionals.
        AUGUR_HOSTED: process.env.AUGUR_HOSTED || false,
        ENABLE_MAINNET: process.env.ENABLE_MAINNET || false,
        CURRENT_BRANCH: JSON.stringify(gitRevisionPlugin.branch())
      }
    })
  ],
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty"
  },
  devtool: "eval"
};
