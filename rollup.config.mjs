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
import multi from '@rollup/plugin-multi-entry';
import copy from 'rollup-plugin-copy';

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
  // React Native
  {
    input: "src/react-native/index.ts",
    output: {
      file: "dist/react-native/index.js",
      format: "cjs",
      exports: "auto",
      inlineDynamicImports: true,
    },
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        rootDir: "src",
      }),
      resolve({
        preferBuiltins: false,
        browser: false,
      }),
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled",
        presets: [
          ["@babel/preset-react", { runtime: "classic" }],
          [
            "@babel/preset-env",
            {
              targets: { node: "14" },
            },
          ],
        ],
      }),
      json(),
    ],
    external: [
      "react",
      "react-native", 
      "@react-native-async-storage/async-storage",
      "@tanstack/react-query",
      "axios",
      "viem",
      "viem/siwe",
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

  // React Native submodules: emit all .ts/.tsx as .js for Metro/Expo
  {
    input: [
      "src/react-native/types.ts",
      "src/react-native/storage.ts",
      "src/react-native/index.ts",
      "src/react-native/errors.ts",
      "src/react-native/hooks/index.ts",
      "src/react-native/example/CampAppExample.tsx",
      "src/react-native/context/SocialsContext.tsx",
      "src/react-native/context/OriginContext.tsx",
      "src/react-native/context/ModalContext.tsx",
      "src/react-native/context/CampContextNew.tsx",
      "src/react-native/context/CampContext.tsx",
      "src/react-native/components/icons.tsx",
      "src/react-native/components/icons-new.tsx",
      "src/react-native/components/CampModal.tsx",
      "src/react-native/components/CampButton.tsx",
      "src/react-native/auth/modals.tsx",
      "src/react-native/auth/hooksNew.ts",
      "src/react-native/auth/hooks.ts",
      "src/react-native/auth/buttons.tsx",
      "src/react-native/auth/AuthRN.ts",
      "src/react-native/appkit/index.tsx",
      "src/react-native/appkit/index.ts",
      "src/react-native/appkit/config.ts",
      "src/react-native/appkit/AppKitProvider.tsx",
      "src/react-native/appkit/AppKitButton.tsx"
    ],
    output: {
      dir: 'dist/react-native',
      format: 'cjs',
      exports: 'auto',
      preserveModules: true,
      preserveModulesRoot: 'src/react-native',
      entryFileNames: '[name].js',
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        rootDir: 'src',
        outDir: 'dist/react-native',
      }),
      resolve({
        preferBuiltins: false,
        browser: false,
      }),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
        presets: [
          ['@babel/preset-react', { runtime: 'classic' }],
          [
            '@babel/preset-env',
            {
              targets: { node: '14' },
            },
          ],
        ],
      }),
      json(),
      copy({
        targets: [
          { src: 'src/react-native/appkit/*.css', dest: 'dist/react-native/appkit' }
        ]
      })
    ],
    external: [
      'react',
      'react-native',
      '@react-native-async-storage/async-storage',
      '@tanstack/react-query',
      'axios',
      'viem',
      'viem/siwe',
      'viem/accounts',
    ],
  },
];

export default config;
