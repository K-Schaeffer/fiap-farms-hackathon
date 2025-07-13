// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: [
    'expo',
    'plugin:prettier/recommended'
  ],
  ignorePatterns: ['/dist/*'],
  rules: {
    'prettier/prettier': 'error'
  }
};
