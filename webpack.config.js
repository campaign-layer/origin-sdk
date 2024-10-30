const path = require("path");
module.exports = [
  {
    // UMD library
    mode: "production",
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "core.js",
      globalObject: "this",
      library: {
        name: "camp-sdk",
        type: "umd",
      },
    },
    optimization: {
      minimize: false,
    },
  },
];
