var _ = require('lodash');

var config = {};

config.envify = {};
config.envify.debug = {
  AUGUR_BRANCH_ID: '0x38a820692912b5f7a3bfefc2a1d4826e1da6beaed5fac6de3d22b18132133991'
};
config.envify.build = {
  // Use the demo branch when building for deployment.
  AUGUR_BRANCH_ID: '0x3d595622e5444dd258670ab405b82a467117bd9377dc8fa8c4530528242fe0c5'
};

config.browserify = {};
config.browserify.build = {
  src: ['app/app.jsx'],
  dest: 'app/augur.js',
  options: {
    browserifyOptions: {
      extensions: ['.jsx'],
      transform: [
        ['reactify', {'es6': true}],
        ['envify', config.envify.build]
      ]
    }
  }
};
config.browserify.watch = _.merge({
  options: {
    watch: true,
    keepAlive: true
  }
}, config.browserify.build);
config.browserify.watch.options.browserifyOptions.transform = [
  ['reactify', {'es6': true}],
  ['envify', config.envify.debug]
];

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: [
        '**/*.js',
        '!**/*.min.js',
        '!node_modules/**/*',
        '!app/augur.js',
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    browserify: {
      build: config.browserify.build,
      watch: config.browserify.watch,
      debug: _.merge({
        options: {
          browserifyOptions: {
            debug: true
          }
        }
      }, config.browserify.watch)
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['jshint', 'browserify:build']);
  grunt.registerTask('watchify', ['browserify:watch']);
};
