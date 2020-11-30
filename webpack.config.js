var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ["./index.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: "/node_modules/",
        loader: "babel-loader",
        options: {
          sourceType: "unambiguous",
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: ["@babel/plugin-transform-runtime"],
        },
      },
      // { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
  ],
};
