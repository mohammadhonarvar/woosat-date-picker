import html from '@web/rollup-plugin-html';
import { copy } from '@web/rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import summary from 'rollup-plugin-summary';
import replace from '@rollup/plugin-replace';
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    html({
      input: 'index.html',
      minify: true,
    }),
    resolve({
      dedupe: ['lit'],
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
      'DEBUG': 'false',
      'console.log': 'void 0',
      'console.info': 'void 0',
      'console.debug': 'void 0',
    }),
    minifyHTML(),
    terser({
      ecma: 2020,
      module: true,
      toplevel: true,
      warnings: true,
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 3,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        properties: {
          regex: /^_/,
        },
      },
      format: {
        comments: false,
      },
    }),
    summary(),
    visualizer({ filename: 'build/stats.html', open: false }),
    copy({
      patterns: ['images/**/*'],
    }),
  ],
  output: {
    dir: 'build',
    sourcemap: false,
  },
  preserveEntrySignatures: 'strict',
  treeshake: {
    moduleSideEffects: false,
  },
};
