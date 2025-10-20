// @ts-check
import antfu from '@antfu/eslint-config'

export default await antfu(
  {
    unocss: false,
    vue: {
      overrides: {
        'vue/no-restricted-syntax': ['error', {
          selector: 'VElement[name=\'a\']',
          message: 'Use NuxtLink instead.',
        }],
      },
    },
    ignores: [
      'public/**',
    ],
  },
  {
    rules: {
      // TODO: migrate all process reference to `import.meta.env` and remove this rule
      'node/prefer-global/process': 'off',
    },
  },
)
