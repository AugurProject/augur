var _ = require('lodash');

var browserify = {};
browserify.build = {
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
};
browserify.watch = _.merge({
  options: {
    watch: true,
    keepAlive: true
  }
}, browserify.build);

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
      build: browserify.build,
      watch: browserify.watch,
      debug: _.merge({
        options: {
	  browserifyOptions: {
            debug: true
	  }
        }
      }, browserify.watch)
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['jshint', 'browserify:build']);
  grunt.registerTask('watchify', ['browserify:watch']);
};
