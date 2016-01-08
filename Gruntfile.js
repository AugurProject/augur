var _ = require('lodash');

var config = {};

config.envify = {};
config.envify.debug = {
  AUGUR_BRANCH_ID: 1010101
};
config.envify.build = {
  AUGUR_BRANCH_ID: 1010101
};

config.browserify = {};
config.browserify.build = {
  src: ['app/main.jsx'],
  dest: 'app/app.js',
  options: {
    browserifyOptions: {
      extensions: ['.jsx', '.js'],
      transform: [
        ['babelify'],
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
  ['babelify'],
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
        '!app/app.js',
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
    },
    copy: {
      assets: {
        files: {
          'app/css/bootstrap.css': 'node_modules/bootstrap/dist/css/bootstrap.css',
          'app/css/bootstrap.map.css': 'node_modules/bootstrap/dist/css/bootstrap.map.css'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['jshint', 'browserify:build', 'copy']);
  grunt.registerTask('watchify', ['browserify:watch']);
};
