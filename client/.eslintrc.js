module.exports = {
  plugins: ['import-x'],
  rules: {
    'import-x/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    'import-x/alias': {
      '@': './src',
    },
  },
};
