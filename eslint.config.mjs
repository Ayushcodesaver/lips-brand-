import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'convex/_generated/**',
      'next-env.d.ts',
      // GSD workflow framework (third-party tooling, not app code)
      '.zcode/**',
      '.planning/**',
      'gsd-core/**',
      'scripts/**',
      'gsd-file-manifest.json',
      '.gsd-runtime',
    ],
  },
];

export default eslintConfig;
