const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const GitRevisionPlugin = require("git-revision-webpack-plugin");
const gitRevisionPlugin = new GitRevisionPlugin();

const PATHS = {
  BUILD: path.resolve(__dirname, "../build"),
  APP: path.resolve(__dirname, "../src"),
  TEST: path.resolve(__dirname, "../test")
};

// COMMON CONFIG
const rules = [
  {
    test: /\.worker\.[jt]s$/,
    use: [
      "worker-loader",
      "babel-loader"
    ]
  },
  {
    test: /\.js$/,
    use: ["source-map-loader"],
    enforce: "pre"
  },
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
];

const babelConfig = {
  test: /\.[jt]sx?$/,
  loader: "babel-loader",
  exclude: /(node_modules|bower_components)/
};

if(process.env.TYPE_CHECKING === "true") {
  rules.push({
    test: /\.tsx?$/,
    loader: "ts-loader",
    options: {
      projectReferences: true
    }
  });
  babelConfig.test = /\.jsx?$/;
}

rules.unshift(babelConfig);

module.exports = {
  mode: "development",
  entry: [
    // 'assets/styles/styles': `${PATHS.APP}/styles`,
    `${PATHS.APP}/web-workers-exit`,
    "react",
    "react-dom",
    "redux",
    "redux-thunk",
    "moment",
    "react-datetime",
    "@babel/polyfill",
    `${PATHS.APP}/main`
  ],
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
    rules: rules
  },
  plugins: [
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
  }
};
