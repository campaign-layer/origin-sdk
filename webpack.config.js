const path = require("path");

module.exports = [
  {
    // UMD library
    mode: 'production',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'core.js',
      globalObject: 'this',
      library: {
        name: 'camp-sdk',
        type: 'umd',
      },
    },
  },
  {
    // ES Module
    mode: 'production',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js',
      globalObject: 'this',
      library: {
        type: 'module',
      },
    },
    experiments: {
      outputModule: true, // needed for `module` library type
    },
  },
  {
    // React library
    mode: 'production',
    entry: './src/react/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'react.js',
      library: {
        type: 'module',
      },
    },
    experiments: {
      outputModule: true, // needed for `module` library type
    },
  }
];