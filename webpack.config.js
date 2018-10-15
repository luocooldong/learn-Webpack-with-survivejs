const merge = require("webpack-merge")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const parts = require("./webpack.parts")

const path = require("path");
const glob = require("glob");


const PATHS = {
  app: path.join(__dirname, "src"),

  build: path.join(__dirname, "dist"),
};

const commonConfig = merge([
  {
    // entry: {
    //   style: glob.sync("./src/**/*.css"),
    // },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Webpack demo"
      }),
      // new webpack.optimize.LimitChunkCountPlugin({
      //   maxChunks: 1,
      // }),
    ]
  },

  parts.minifyJavaScript(),

  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true,
      },
      // Run cssnano in safe mode to avoid
      // potentially unsafe transformations.
      safe: true,
    },
  }),

  parts.purifyCSS({
    paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }),
  }),

  parts.loadJavaScript({ include: PATHS.app }),
])

const productionConfig = merge([
  parts.clean(PATHS.build),

  parts.minifyJavaScript(),

  parts.generateSourceMaps({ type: "source-map" }),

  parts.extractCSS({
    // use: "css-loader",
    use: ["css-loader", parts.autoprefix()],
  }),
  parts.loadImages({
    options: {
      limit: 15000,
      name: "[name].[ext]",
    },
  }),
  {
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "initial",
          },
        },
      },
    },
  },

  parts.attachRevision(),
]);

const developmentConfig = merge([
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT
  }),
  parts.loadCSS(),
  parts.loadImages(),
])

module.exports = mode => {
  process.env.BABEL_ENV = mode;



  if (mode === "production") {
    return merge(commonConfig, productionConfig, { mode })
  }

  return merge(commonConfig, developmentConfig, { mode })
}


