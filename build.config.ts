import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    './src/index',
    {
      builder: 'mkdist',
      input: './src/locales',
      outDir: './dist/locales',
    },
  ],
  rollup: {
    emitCJS: true,
  },
  outDir: './dist',
  declaration: 'compatible',
  failOnWarn: false,
});
