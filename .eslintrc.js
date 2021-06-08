module.exports = {
  // specify the parser
  parser: "@typescript-eslint/parser",
  extends: [
    // basic eslint rules
    "eslint:recommended",
    // typescript specifict lint rules
    "plugin:@typescript-eslint/recommended",
    // prettier formatting rules
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint", "promise", "react"],
  rules: {
    // allow typescript to infer return type
    "@typescript-eslint/explicit-function-return-type": "off",
    // allow exporting function without specifying return types
    "@typescript-eslint/explicit-module-boundary-types": "off",
    // allow typescript to define type by using function defined later
    "@typescript-eslint/no-use-before-define": "off",
    // warn when variable is marked as not used in jsx syntax
    "react/jsx-uses-vars": "off",
    "comma-dangle": ["error", "always-multiline"],
    "@typescript-eslint/no-unused-vars": "off",
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // standard option to turn on jsx syntax // ref: https://eslint.org/docs/user-guide/configuring
    },
  },
  env: {
    browser: true, // this code is running in browser (has window)
    es6: true, // use es6 (ecma2015), support is wide enough // ref: https://www.w3schools.com/js/js_versions.asp
    node: true, // for linting config file (such as this)
  },
};
