const path = require("path")
const webpack = require("webpack")
// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  webpack: {
    resolve: {
      extensions: ["*", ".mjs", ".js", ".vue", ".json"],
      fallback: {
        crypto: false,
        // fs: false,
      },
    },
    // plugins: [new NodePolyfillPlugin()],
    configure: (webpackConfig, _) => {
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      })
      webpackConfig.resolve.fallback = {
        crypto: false,
        buffer: require.resolve("buffer"),
        stream: require.resolve("stream-browserify"),
      }
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: "process/browser",
          Buffer: ["buffer", "Buffer"],
        })
      )
      console.log(webpackConfig)
      return webpackConfig
    },
  },
}
