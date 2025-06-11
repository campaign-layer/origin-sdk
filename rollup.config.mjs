import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import nodePolyfills from "rollup-plugin-polyfill-node";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import fs from "fs";
import path from "path";
import json from "@rollup/plugin-json";

const cleanupDtsPlugin = () => {
  return {
    name: "cleanup-dts",
    buildEnd: async () => {
      fs.rmSync(path.resolve("./dist/core"), { recursive: true });
      fs.rmSync(path.resolve("./dist/react/auth"), { recursive: true });
      fs.rmSync(path.resolve("./dist/react/context"), { recursive: true });

      fs.readdirSync(path.resolve("./dist")).forEach((file) => {
        if (file.endsWith(".d.ts") && file !== "core.d.ts") {
          fs.unlinkSync(path.resolve("./dist", file));
        }
      });

      fs.readdirSync(path.resolve("./dist/react")).forEach((file) => {
        if (file.endsWith(".d.ts") && file !== "index.esm.d.ts") {
          fs.unlinkSync(path.resolve("./dist/react", file));
        }
      });

      fs.copyFileSync(
        path.resolve("./dist/core.d.ts"),
        path.resolve("./dist/core.esm.d.ts")
      );
    },
  };
};

const config = [
  // Core
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
      json(),
      terser({
        format: {
          comments: "all",
        },
      }),
    ],
    external: ["axios", "viem", "viem/siwe", "viem/accounts"],
  },
  // React
  {
    input: "src/react/auth/index.tsx",
    output: {
      file: "dist/react/index.esm.js",
      format: "esm",
      exports: "auto",
      inlineDynamicImports: true,
      banner: "'use client';",
      paths: {
        "@campnetwork/origin": "../core.esm",
      }
    },
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        rootDir: "src",
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
      json(),

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
      "@campnetwork/origin",
      "viem/accounts",
    ],
  },
  // Core types
  {
    input: "src/index.ts",
    output: {
      file: "dist/core.d.ts",
      format: "esm",
    },
    plugins: [dts()],
  },
  // React types
  {
    input: "dist/react/auth/index.d.ts",
    output: {
      file: "dist/react/index.esm.d.ts",
      format: "esm",
    },
    plugins: [dts(), cleanupDtsPlugin()],
  },
];

export default config;
