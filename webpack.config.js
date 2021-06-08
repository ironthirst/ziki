/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { merge } = require("webpack-merge");
const webpack = require("webpack");

const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// use environment's TARGET variable
const TARGET = process.env.TARGET || "development";

// this is the port where the dev-server will run on
const port = parseInt(process.env.PORT) || 8080;

const PATHS = {
  app: path.join(__dirname, "app"),
  dist: path.join(__dirname, "public/build"),
  serverRoot: path.join(__dirname, "public"),
};

console.log("Webpack is building for environment:", TARGET);
process.env.BABEL_ENV = TARGET;

const common = {
  entry: {
    app: path.resolve(PATHS.app, "index.tsx"),
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    symlinks: false, // no symlinks when resolving dependencies
  },
  output: {
    filename: "[name].js",
    path: PATHS.dist,
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true, // use a default directory for caching compilation result
              babelrc: false,
              presets: [
                // applied last to first
                "@babel/preset-react",
                "@babel/preset-typescript",
                ["@babel/preset-env", { targets: { browsers: "defaults" } }],
              ],
              plugins: [
                // the order matters for react-hot-loader/babel plugin
                // see https://github.com/gaearon/react-hot-loader/blob/master/examples/decorators/.babelrc
                "react-hot-loader/babel",
                ["@babel/plugin-proposal-private-methods", { loose: true }],
                ["@babel/plugin-proposal-class-properties", { loose: true }],
                // plugin-transform-runtime
                // the following allow us to use re-generator (which is needed by async/await syntax)
                ["@babel/plugin-transform-runtime", { regenerator: true }],
                "@babel/plugin-proposal-optional-chaining",
                "@babel/plugin-syntax-dynamic-import",
              ],
            }, // end babel-loader
          },
        ], // end rule.use
      },
      {
        // images
        test: /\.(png|jpe?g|gif|svg)$/i,
        exclude: /node_modules/,
        use: [{ loader: "file-loader" }],
      },
      {
        // data files
        test: /\.(tsv|csv|jl)$/i,
        exclude: /node_modules/,
        use: [{ loader: "file-loader" }],
      },
    ],
  },
  optimization: {
    moduleIds: "named",
    minimizer: [],
    // The following force a vendor chunk for all codes in node_modules
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            return "npm-vendors";
          },
        },
      },
    },
  },
  // "imported name" => "external exported symbol"
  externals: {
    react: "React",
    lodash: "_",
    "react-dom": "ReactDOM",
    "moment-timezone": "moment",
    moment: "moment",
    jquery: "$",
    marked: "marked",
    redux: "Redux",
    "react-router": "ReactRouter",
    "react-redux": "ReactRedux",
    "bootstrap/js/dist/modal": "$",
    "html-entities": "HTMLEntities",
  },
};

let merged = {};

if (TARGET === "development") {
  merged = merge(common, {
    mode: "development",
    plugins: [
      new BundleAnalyzerPlugin(),
      // new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ],
    devtool: "eval-source-map",
    resolve: {
      alias: {
        // use hot-loader's version of react-dom
        "react-dom": "@hot-loader/react-dom",
      },
    },
    devServer: {
      publicPath: "/build/", // where bundles are served
      contentBase: path.resolve(__dirname, "public"), // where other static files are served
      disableHostCheck: true, // allow it to run behind a nignx reverse proxy
      historyApiFallback: true,
      stats: "errors-only",
      hot: true,
      compress: true,
      host: "0.0.0.0",
      port,
    },
  });
} else if (TARGET === "production") {
  merged = merge(common, {
    mode: "production",
  });
} else {
  console.warn("No TARGET specified when running webpack");
  process.exit(1);
}

module.exports = merged;
