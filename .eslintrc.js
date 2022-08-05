// eslint-disable-next-line no-undef
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint', 'prettier',
    ],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "airbnb",
      "plugin:prettier/recommended",
      "prettier/@typescript-eslint"
    ],
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/indent": ["error", 2],
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "error"
    }
  };