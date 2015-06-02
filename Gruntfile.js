var _ = require('lodash');

var config = {};

config.envify = {};
config.envify.debug = {
  AUGUR_BRANCH_ID: "0x00000000000000000000000000000000000000000000000000000000000f69b5",
  RPC_HOST: 'localhost:8545'
};
config.envify.build = {
  // alpha branch for testing
  AUGUR_BRANCH_ID: '0x00000000000000000000000000000000000000000000000000000000000f69b5',
  RPC_HOST: 'localhost:8545'
};

config.browserify = {};
config.browserify.build = {
  src: ['app/app.jsx'],
  dest: 'app/augur.js',
  options: {
    browserifyOptions: {
      extensions: ['.jsx'],
      transform: [
        ['babelify', {}],
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
  ['babelify', {}],
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
