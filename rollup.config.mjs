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
  // React Native - Single bundle like React (LEGACY REMOVAL)
  // Remove old React Native build
  // {
  //   input: "src/react-native/index.ts",
  //   ...
  // },
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
  // React Native types - using same approach as React
  {
    input: 'src/react-native/index.ts',
    output: {
      file: 'dist/react-native/index.d.ts',
      format: 'esm',
    },
    plugins: [dts()],
  },

  // React Native - Proper file structure like TypeScript build
  {
    input: {
      'index': 'src/react-native/index.ts',
      'storage': 'src/react-native/storage.ts',
      'types': 'src/react-native/types.ts',
      'errors': 'src/react-native/errors.ts',
      'appkit/index': 'src/react-native/appkit/index.ts',
      'appkit/AppKitProvider': 'src/react-native/appkit/AppKitProvider.tsx',
      'appkit/AppKitButton': 'src/react-native/appkit/AppKitButton.tsx',
      'appkit/config': 'src/react-native/appkit/config.ts',
      'auth/AuthRN': 'src/react-native/auth/AuthRN.ts',
      'auth/buttons': 'src/react-native/auth/buttons.tsx',
      'auth/modals': 'src/react-native/auth/modals.tsx',
      'auth/hooks': 'src/react-native/auth/hooks.ts',
      'components/CampButton': 'src/react-native/components/CampButton.tsx',
      'components/CampModal': 'src/react-native/components/CampModal.tsx',
      'components/icons': 'src/react-native/components/icons.tsx',
      'context/CampContext': 'src/react-native/context/CampContext.tsx',
      'context/OriginContext': 'src/react-native/context/OriginContext.tsx',
      'context/SocialsContext': 'src/react-native/context/SocialsContext.tsx',
      'context/ModalContext': 'src/react-native/context/ModalContext.tsx',
      'hooks/index': 'src/react-native/hooks/index.ts',
      'example/CampAppExample': 'src/react-native/example/CampAppExample.tsx'
    },
    output: {
      dir: 'dist/react-native',
      format: 'esm',
      exports: 'auto',
      preserveModules: false,
      entryFileNames: '[name].js',
      chunkFileNames: '[name].js',
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
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
    ],
    external: [
      'react',
      'react-native', 
      '@react-native-async-storage/async-storage',
      '@tanstack/react-query',
      'viem',
      'viem/siwe',
      'viem/accounts',
      // Internal module references
      './storage',
      './types',
      './errors',
      './auth/AuthRN',
      './appkit/AppKitProvider',
      './appkit/AppKitButton',
      './context/CampContext',
      './hooks/index',
      '../core/origin',
      '../core/twitter',
      '../core/spotify',
      '../core/tiktok',
      '../constants',
      '../utils',
      '../errors',
    ],
  },
];

export default config;
