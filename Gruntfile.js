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
  dest: 'target/app.js',
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
    keepAlive: false // develop task keeps this alive
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
        'app/**/*.{js,jsx}',
        '!app/libs/**/*.*'
      ],
      options: {
        force: true, // don't stop the build because JSHint doesn't know about JSX => ESLint
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
          'target/css/market-detail.css': 'app/less/public/market-detail.less',
          'target/css/main.css': 'app/less/public/main.less',
          'target/css/react-select.custom.css': 'app/less/public/react-select.custom.less'
        }
      }
    },
    watch: {
      less: {
        files: ['app/less/**/*.less'],
        tasks: ['less:build']
      },
      copy: {
        files: ['app/index.html', 'app/iamges/*', 'app/css/*', 'app/libs/*'],
        tasks: ['newer:copy:main']
      }
    },
    copy: {
      main: {
        files: [
          {
            'target/index.html': 'app/index.html'
          },
          {
            expand: true, // to use cwd
            cwd: 'app/images',
            src: '**',
            dest: 'target/images/'
          },
          { // this should be later replaced by less
            expand: true, // to use cwd
            cwd: 'app/css',
            src: '**',
            dest: 'target/css/'
          },
          {
            expand: true, // to use cwd
            cwd: 'app/libs',
            src: '**',
            dest: 'target/libs/'},
          {
            'target/css/bootstrap.css': 'node_modules/bootstrap/dist/css/bootstrap.css'
          },
          {
            'target/css/bootstrap.css.map': 'node_modules/bootstrap/dist/css/bootstrap.css.map'
          },
          {
            src: 'node_modules/font-awesome/fonts/*.*',
            dest: 'target/fonts/',
            expand: true, // expand to use flatten (Remove all path parts from generated dest paths)
            flatten: true
          },
          {
            src: 'node_modules/bootstrap/fonts/*.*',
            dest: 'target/fonts/',
            expand: true, // expand to use flatten (Remove all path parts from generated dest paths)
            flatten: true
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
  grunt.loadNpmTasks('grunt-newer');

  grunt.registerTask('build', ['jshint', 'browserify:build', 'less:build', 'copy']);
  grunt.registerTask('develop', ['browserify:watch', 'watch']);
  grunt.registerTask('default', ['build']);
};
