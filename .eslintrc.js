module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    "sourceType": "module"
  },
  env: {
    es2021: true,
    browser: true
  },
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'prettier'
  ],
  rules: {
    'vue/no-unused-vars': 'error',
    'no-trailing-spaces': 'error',
    '@typescript-eslint/ban-ts-comment': 'off'
  }
}
