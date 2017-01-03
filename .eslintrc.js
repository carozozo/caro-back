module.exports = {
  'env': {
    'es6': true,
    'node': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'sourceType': 'module'
  },
  'parser': 'babel-eslint',
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'backtick'
    ],
    'semi': [
      'error',
      'never'
    ],
    'no-console': 0
  },
  'globals': {
    'console': true,
    '_': true,
    'ck': true,
    'assert': true,
    'describe': true,
    'it': true,
    'before': true,
    'after': true,
  }
}