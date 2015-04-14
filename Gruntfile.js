var _ = require('lodash');

var browserifyConfig = {
  src: ['app/app.jsx'],
  dest: 'app/augur.js',
  options: {
    browserifyOptions: {
      extensions: ['.jsx'],
      transform: [
        [ 'reactify', {'es6': true} ]
      ]
    }
  }
}

module.exports = function(grunt) {
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
      build: browserifyConfig,
      watch: _.merge({
        options: {
          watch: true,
          keepAlive: true,
          browserifyOptions: {
            debug: true
          }
        }
      }, browserifyConfig)
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('watchify', ['browserify:watch']);
};
