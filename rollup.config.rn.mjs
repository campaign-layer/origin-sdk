import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import nodePolyfills from "rollup-plugin-polyfill-node";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import fs from "fs";
import path from "path";
import json from "@rollup/plugin-json";

const cleanupDtsPlugin = () => {
  return {
    name: "cleanup-rn-dts",
    buildEnd: async () => {
      // Clean up React Native specific build artifacts
      if (fs.existsSync(path.resolve("./dist/react-native/core"))) {
        fs.rmSync(path.resolve("./dist/react-native/core"), { recursive: true });
      }
      
      if (fs.existsSync(path.resolve("./dist/react-native/react-native"))) {
        fs.rmSync(path.resolve("./dist/react-native/react-native"), { recursive: true });
      }

      // Remove extra .d.ts files
      fs.readdirSync(path.resolve("./dist/react-native")).forEach((file) => {
        if (file.endsWith(".d.ts") && file !== "index.d.ts") {
          fs.unlinkSync(path.resolve("./dist/react-native", file));
        }
      });
    },
  };
};

const config = [
  // React Native Core Build
  {
    input: "src/react-native/index.ts",
    output: [
      {
        file: "dist/react-native/index.cjs",
        format: "cjs",
        exports: "auto",
        inlineDynamicImports: true,
      },
      {
        file: "dist/react-native/index.esm.js",
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
        declarationDir: "dist/react-native",
      }),
      resolve({
        preferBuiltins: false,
        browser: false, // React Native is not browser
      }),
      babel({
        babelHelpers: "bundled",
        presets: [
          ["@babel/preset-react", { runtime: "automatic" }],
          [
            "@babel/preset-env",
            {
              exclude: ["@babel/plugin-transform-classes"],
            },
          ],
        ],
      }),
      nodePolyfills(),
      json(),
      terser({
        format: {
          comments: "all",
        },
      }),
    ],
    external: [
      "react",
      "react-native",
      "@react-native-async-storage/async-storage",
      "@tanstack/react-query",
      "@reown/appkit-react-native",
      "react-native-get-random-values",
      "react-native-url-polyfill",
      "axios",
      "viem",
      "viem/siwe",
      "viem/accounts",
      /^@react-native/,
      /^react-native-/,
    ],
  },
  // React Native Types
  {
    input: "src/react-native/index.ts",
    output: {
      file: "dist/react-native/index.d.ts",
      format: "esm",
    },
    plugins: [dts(), cleanupDtsPlugin()],
  },
];

export default config;
