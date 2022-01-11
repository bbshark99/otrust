module.exports = {
  "ignorePatterns": ["build/**"],
  "env": {
    "browser": true,
    "es6": true,
    "jest": true,
    "node": true
  },
  "extends": ["airbnb", "airbnb-typescript", "plugin:prettier/recommended", "plugin:react/recommended"],
  "plugins": ["react", "react-hooks", "jsx-a11y", "prettier", "testing-library", "jest-dom"],
  "globals": {},
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "project": "./tsconfig.json",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "settings": {
    "import/resolver": {
      "node": {
        "paths": ["src"]
      }
    }
  },
  "rules": {
    "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
    "import/order": [2, { "groups": ["builtin", "external"], "newlines-between": "always" }],
    "import/prefer-default-export": "off",
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".tsx"] }],
    "react/jsx-indent": "off",
    "react/jsx-indent-props": "off",
    "react/jsx-one-expression-per-line": "off",
    "react/jsx-props-no-spreading": "off",
    "react/prefer-stateless-function": [2],
    "react/prop-types": "off",
    "prettier/prettier": "error",
    "class-methods-use-this": "off",
    "consistent-return": "off",
    "func-names": "off",
    "max-len": "off",
    "no-param-reassign": "off",
    "no-process-exit": "off",
    "no-return-await": "off",
    "no-shadow": ["warn", { "builtinGlobals": false, "hoist": "functions", "allow": [] }],
    "no-underscore-dangle": "off",
    "no-unused-vars": ["warn", { "argsIgnorePattern": "req|res|next|val" }],
    "no-console": "warn",
    "no-debugger": "error",
    "object-shorthand": "off",
    "spaced-comment": "off",
    "space-infix-ops": [2],
    "testing-library/await-async-query": "error",
    "testing-library/no-await-sync-query": "error",
    "testing-library/no-debug": "warn",
    "jest-dom/prefer-checked": "error",
    "jest-dom/prefer-enabled-disabled": "error",
    "jest-dom/prefer-required": "error",
    "jest-dom/prefer-to-have-attribute": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "no-restricted-syntax": "warn"
  }
}
