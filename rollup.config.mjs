import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import nodePolyfills from "rollup-plugin-polyfill-node";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import terser from "@rollup/plugin-terser";

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
      babel({ babelHelpers: "bundled" }),
      nodePolyfills(),
      terser({
        format: {
          comments: "all",
        },
      }),
    ],
    external: ["axios", "viem", "viem/siwe"],
  },
  {
    input: "src/react/auth/index.jsx",
    output: {
      file: "dist/react/index.esm.js",
      format: "esm",
      exports: "auto",
      inlineDynamicImports: true,
    },

    plugins: [
      resolve({
        preferBuiltins: false,
        browser: true,
      }),
      babel({
        generatorOpts: { importAttributesKeyword: "with" },
        exclude: "node_modules/**",
        babelHelpers: "bundled",
        presets: [
          ["@babel/preset-react", { runtime: "classic" }],
          ["@babel/preset-env", {
            exclude: ["@babel/plugin-transform-classes"]
          }],
        ],
      }),
      nodePolyfills(),
      postcss({
        plugins: [autoprefixer],
        modules: true,
        extract: false,
        minimize: true,
      }),
    ],
    external: [
      "react",
      "react-dom",
      "wagmi",
      "@walletconnect/ethereum-provider",
      "axios",
      "viem",
      "viem/siwe",
      "@tanstack/react-query",
    ],
  },
];

export default config;
