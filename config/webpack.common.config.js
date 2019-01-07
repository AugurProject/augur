const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const DeadCodePlugin = require('webpack-deadcode-plugin');

const PATHS = {
  BUILD: path.resolve(__dirname, "../build"),
  APP: path.resolve(__dirname, "../src"),
  TEST: path.resolve(__dirname, "../test")
};

// COMMON CONFIG
module.exports = {
  mode: "development",
  entry: {
    // 'assets/styles/styles': `${PATHS.APP}/styles`,
    "assets/scripts/vendor": [
      "react",
      "react-dom",
      "redux",
      "redux-thunk",
      "moment",
      "react-datetime"
    ],
    main: `${PATHS.APP}/main`
  },
  output: {
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
    path: PATHS.BUILD,
    publicPath: ""
  },
  resolve: {
    modules: ["node_modules", PATHS.APP],
    extensions: [".html", ".less", ".json", ".js", ".jsx"],
    alias: {
      // NOTE --  these aliases are utilized during build + linting,
      //          only testing utilizes the aliases w/in .babelrc
      src: PATHS.APP,
      config: path.resolve(PATHS.APP, "config"),
      assets: path.resolve(PATHS.APP, "assets"),
      modules: path.resolve(PATHS.APP, "modules"),
      utils: path.resolve(PATHS.APP, "utils"),
      services: path.resolve(PATHS.APP, "services"),
      test: PATHS.TEST,
      assertions: path.resolve(PATHS.TEST, "assertions")
    },
    symlinks: false
  },
  module: {
    rules: [
      {
        test: /npm-cli|node-hid/,
        loader: "null-loader"
      },
      {
        test: /\.less$/,
        enforce: "pre",
        loader: "import-glob-loader"
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        query: {
          minimize: true
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
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
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: "[name]_[local]"
            }
          },
          "postcss-loader",
          "less-loader"
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "postcss-loader"]
      }
    ]
  },
  optimization: {
    // https://webpack.js.org/configuration/optimization/#optimization-usedexports
    // `unusedExports: true` is required by DeadCodePlugin
    usedExports: true,
  },
  plugins: [
    new DeadCodePlugin({
      // failOnHint: true, // (default: false), if true will stop the build if unused code/files are found.
      patterns: [
        'src/**/*.(js|jsx|css)',
      ],
      exclude: [
        '**/*.(stories|spec).(js|jsx)',
        '**/*.test.js', // certain test files (executed by `yarn test`) live in the src/ dir and so DeadCodePlugin interprets them as dead even though they're not
        '**/__mocks__/**', // DeadCodePlugin interprets __mocks__/* files as dead because these files aren't used explicitly, they are part of mocking magic during `yarn test`
        '**/splash.css', // splash.css is hardcoded into build process and appears dead to DeadCodePlugin
      ],
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(PATHS.APP, "splash.css"),
        to: path.resolve(PATHS.BUILD, "assets/styles")
      },
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
        to: path.resolve(PATHS.BUILD, "assets/fonts")
      },
      {
        from: path.resolve(PATHS.APP, "assets/images"),
        to: path.resolve(PATHS.BUILD, "assets/images")
      },
      {
        from: path.resolve(PATHS.APP, "sitemap.xml"),
        to: PATHS.BUILD
      },
      {
        from: path.resolve(PATHS.APP, "robots.txt"),
        to: PATHS.BUILD
      }
    ]),
    new HtmlWebpackPlugin({
      template: path.resolve(PATHS.APP, "index.ejs"),
      environment: process.env.NODE_ENV,
      chunksSortMode: (a, b) => {
        const order = [
          "common",
          "assets/scripts/vendor",
          "assets/styles/styles",
          "main"
        ];

        return order.indexOf(b.names[0]) + order.indexOf(a.names[0]);
      }
    }),
    new webpack.DefinePlugin({
      "process.env": {
        GETH_PASSWORD: JSON.stringify(process.env.GETH_PASSWORD),
        ETHEREUM_NETWORK: JSON.stringify(process.env.ETHEREUM_NETWORK || "dev"),
        AUTO_LOGIN: process.env.AUTO_LOGIN || false,

        // Set this var to remove code that is problematic for us to host.
        // Will need to be negated in the relevant conditionals.
        AUGUR_HOSTED: process.env.AUGUR_HOSTED || false,
        ENABLE_MAINNET: process.env.ENABLE_MAINNET || false
      }
    })
  ],
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty"
  }
};
