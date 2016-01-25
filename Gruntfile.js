var _ = require("lodash");

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
    less: {
      build: {
        files: {
          'app/css/market-detail.css': 'app/less/public/market-detail.less',
          'app/css/main.css': 'app/less/public/main.less'
        }
      }
    },
    watch: {
      less: {
        files: ['app/less/**/*.less'],
        tasks: ['less:build']
      }
    },
    copy: {
      assets: {
        files: {
          'app/css/bootstrap.css': 'node_modules/bootstrap/dist/css/bootstrap.css',
          'app/css/bootstrap.css.map': 'node_modules/bootstrap/dist/css/bootstrap.css.map'
        }
      },
      fonts: { // so much fonts
        files: [
          {
            expand: true, // expand to use flatten (Remove all path parts from generated dest paths)
            flatten: true,
            src: 'node_modules/font-awesome/fonts/*.*',
            dest: 'app/fonts/'
          },
          {
            expand: true, // expand to use flatten (Remove all path parts from generated dest paths)
            flatten: true,
            src: 'node_modules/bootstrap/fonts/*.*',
            dest: 'app/fonts/'
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['jshint', 'browserify:build', 'less:build', 'copy']);
  grunt.registerTask('watchify', ['browserify:debug', 'watch:less']);
};
