const path = require("path");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

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
  },
  {
    // ES Module
    mode: "production",
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "main.js",
      globalObject: "this",
      library: {
        type: "module",
      },
    },
    experiments: {
      outputModule: true, // needed for `module` library type
    },
  }
];
