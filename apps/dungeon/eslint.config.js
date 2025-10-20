// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    pnpm: true,
  },
  // allow console statements in backend code
  { rules: { 'no-console': 'off' } },
)
