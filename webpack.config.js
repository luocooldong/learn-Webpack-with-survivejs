const merge = require("webpack-merge")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const parts = require("./webpack.parts")


const path = require("path");
const glob = require("glob");


const PATHS = {
  app: path.join(__dirname, "src"),
};

const commonConfig = merge([
  {
    // entry: {
    //   style: glob.sync("./src/**/*.css"),
    // },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Webpack demo"
      })
    ]
  },

  parts.purifyCSS({
    paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }),
  }),
])

const productionConfig = merge([
  parts.extractCSS({
    // use: "css-loader",
    use: ["css-loader", parts.autoprefix()],
  }),
]);

const developmentConfig = merge([
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT
  }),
  parts.loadCSS(),
])

module.exports = mode => {
  if (mode === "production") {
    return merge(commonConfig, productionConfig, { mode })
  }

  return merge(commonConfig, developmentConfig, { mode })
}
