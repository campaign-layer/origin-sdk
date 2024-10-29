const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'camp-sdk.js',
    globalObject: 'this',
    library: {
        name: 'CampSDK',
        type: 'umd',
    }
  },
};