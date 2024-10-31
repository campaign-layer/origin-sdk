const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const babel = require("@rollup/plugin-babel");
const typescript = require("@rollup/plugin-typescript");
const json = require("@rollup/plugin-json");

module.exports = {
  input: "src/index.js",
  output: [
    {
      file: "dist/core.cjs.js",
      format: "cjs",
      exports: "auto",
    },
    {
      file: "dist/core.esm.js",
      format: "esm",
    },
  ],
  plugins: [
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    babel({ babelHelpers: "bundled" }),
    typescript({ declaration: true, outDir: "dist" }),
    json(),
  ],
  external: ["react", "react-dom", "@tanstack/react-query", "axios"],
};
