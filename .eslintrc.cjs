/* eslint-env node */
module.exports = {
  extends: [
    'standard',
    '@nuxt/eslint-config'
  ],
  root: true,
  overrides: [
    {
      files: ['*.ts', '*.vue'],
      rules: {
        'no-undef': 'off'
      }
    }
  ]
}
