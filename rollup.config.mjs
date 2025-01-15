import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import nodePolyfills from "rollup-plugin-polyfill-node";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

const config = [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/core.cjs",
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
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        rootDir: "src",
      }),
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
    input: "src/react/auth/index.tsx",
    output: {
      file: "dist/react/index.esm.js",
      format: "esm",
      exports: "auto",
      inlineDynamicImports: true,
      banner: "'use client';",
    },
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        // exclude: ["**/*.d.ts"],
        rootDir: "src",
        // include: ["src/global.d.ts"],
      }),
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
          [
            "@babel/preset-env",
            {
              exclude: ["@babel/plugin-transform-classes"],
            },
          ],
        ],
      }),
      nodePolyfills(),
      postcss({
        plugins: [autoprefixer],
        modules: true,
        extract: false,
        minimize: true,
        sourceMap: true,
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
  // {
  //   input: "src/react/auth/index.tsx",
  //   output: {
  //     file: "dist/react/index.d.ts",
  //     format: "esm",
  //   },
  //   plugins: [dts()],
  // },
];

export default config;
