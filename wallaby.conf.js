module.exports = function (wallaby) { // eslint-disable-line
  return {
    files: [
      'src/**/*.@(js|jsx|json|less)',
      '!src/**/*[.-]test.js?(x)',
      'test/**/*.@(less|json)',
      'test/*.js',
    ],
    tests: [
      'src/**/*[.-]test.js?(x)',
      'test/**/*.js?(x)',
      '!test/*.js',
    ],
    compilers: {
      '**/*.js?(x)': wallaby.compilers.babel(),
    },
    env: {
      type: 'node',
    },
    testFramework: 'mocha',
    setup: function (wallaby) { // eslint-disable-line
      require('./test/setup')
      require('chai/register-assert')
    },
    delays: {
      run: 500,
    },
  }
}
