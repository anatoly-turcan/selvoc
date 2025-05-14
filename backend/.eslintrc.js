module.exports = {
  extends: '../.eslintrc.js',
  env: {
    node: true,
  },
  rules: {
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        pathGroups: [
          { pattern: '@modules', group: 'internal' },
          { pattern: '@modules/**', group: 'internal' },
          { pattern: '@config', group: 'internal' },
          { pattern: '@config/**', group: 'internal' },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
};
