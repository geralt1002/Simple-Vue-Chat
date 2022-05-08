module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'prettier',
    'prettier/vue',
  ],
  plugins: ['vue'],
  'prettier/prettier': [
    'error',
    {
      endOfLine: 'auto',
    },
  ],
}
