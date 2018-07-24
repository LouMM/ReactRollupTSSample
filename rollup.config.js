import typescript from "typescript";
import typescriptPlugin from "rollup-plugin-typescript2";
import livereload from "rollup-plugin-livereload";
import serve from "rollup-plugin-serve";
import replace from "rollup-plugin-replace"

import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
  plugins: [
    replace({
        // The react sources include a reference to process.env.NODE_ENV so we need to replace it here with the actual value
        'process.env.NODE_ENV': JSON.stringify('development'),
      })
    // nodeResolve makes rollup look for dependencies in the node_modules directory
    ,nodeResolve({
      browser: true
    }),
    commonjs({
      // All of our own sources will be ES6 modules, so only node_modules need to be resolved with cjs
      include: "node_modules/**",
      namedExports: {
        // The commonjs plugin can't figure out the exports of some modules, so if rollup gives warnings like:
        // ⚠️   'render' is not exported by 'node_modules/react-dom/index.js'
        // Just add the mentioned file / export here
        "node_modules/react-dom/index.js": ["render"],
        "node_modules/react/index.js": [
          "Children",
          "Component",
          "PropTypes",
          "createElement"
        ]
      }
    }),
    typescriptPlugin({ typescript }),
    serve({
      port: 3000
      ,verbose: true
      //historyApiFallback: true,
      ,contentBase: "."
    })
    //,livereload({ watch: 'dist' })
  ], //transpile only, no error checking
  input: "./src/index.tsx",
  output: {
    file: "./dist/bundle.js",
    format: "iife",
    sourcemap: true
  }
};
