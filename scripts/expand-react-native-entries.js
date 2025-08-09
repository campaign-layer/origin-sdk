// scripts/expand-react-native-entries.js
// Expands all .ts/.tsx files in src/react-native/ for Rollup multi-entry
const glob = require('glob');
const path = require('path');

const files = glob.sync('src/react-native/**/*.{ts,tsx}', { absolute: false });

console.log(JSON.stringify(files));
