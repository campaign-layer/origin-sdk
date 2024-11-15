const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const babel = require("@rollup/plugin-babel");
// const typescript = require("@rollup/plugin-typescript");
const json = require("@rollup/plugin-json");
const nodePolyfills = require("rollup-plugin-polyfill-node");

const config = [
  {
    input: "src/index.js",
    output: [
      {
        file: "dist/core.cjs.js",
        format: "cjs",
        exports: "auto",
        inlineDynamicImports: true,
      },
      {
        file: "dist/core.esm.js",
        format: "esm",
        exports: "auto",
        inlineDynamicImports: true,
      },
    ],
    plugins: [
      resolve({
        preferBuiltins: false,
        browser: true,
      }),
      commonjs(),
      babel({ babelHelpers: "bundled" }),
      json(),
      nodePolyfills(),
    ],
    external: [
      "react",
      "react-dom",
      "@tanstack/react-query",
      "axios",
      "viem",
      "@walletconnect/ethereum-provider",
    ],
  },
  {
    input: "src/auth/viem/walletconnect.js",
    output: [
      {
        file: "dist/auth/viem/walletconnect.cjs.js",
        format: "cjs",
        exports: "auto",
        inlineDynamicImports: true,
      },
      {
        file: "dist/auth/viem/walletconnect.esm.js",
        format: "esm",
        exports: "auto",
        inlineDynamicImports: true,
      },
    ],
    plugins: [
      resolve({
        preferBuiltins: false,
        browser: true,
      }),
      commonjs(),
      babel({ babelHelpers: "bundled" }),
      json(),
      nodePolyfills(),
    ],
    external: ["react", "react-dom"],
  },
];

module.exports = config;
