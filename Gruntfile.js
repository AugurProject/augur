var _ = require('lodash');

var browserifyConfig = {
  src: ['augur/static/main.js'],
  dest: 'augur/static/app.js'
}

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: [
        '**/*.js',
        '!**/*.min.js',
        '!node_modules/**/*',
        '!augur/static/app.js',
        '!augur/static/ethereum.poc8.js'
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
