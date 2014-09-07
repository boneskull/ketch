'use strict';

module.exports = function (grunt) {

  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      main: [
        'Gruntfile.js',
        '<%= pkg.main %>',
        '<%= mochacov.options.files %>'
      ],
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      }
    },

    // Unit tests.
    mochacov: {
      options: {
        files: 'test/*.spec.js'
      },
      main: {
        options: {
          reporter: 'spec'
        }
      },
      lcov: {
        options: {
          reporter: 'mocha-lcov-reporter',
          quiet: true,
          instrument: true,
          output: 'coverage/lcov.info'
        }
      },
      'html-cov': {
        options: {
          reporter: 'html-cov',
          output: 'coverage/index.html'
        }
      }
    },

    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: [
          'package.json',
          'README.md'
        ],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
      }
    },

    jsdox: {
      main: {
        options: {
          contentsEnabled: false
        },
        src: ['<%= pkg.main %>'],
        dest: '.'
      }
    },

    copy: {
      readme: {
        src: 'guts/ketch.md',
        dest: 'README.md'
      }
    },

    clean: {
      readme: 'guts/ketch.md'
    },

    codeclimate: {
      options: {
        file: 'coverage/lcov.info',
        token: '28d125c7f65a97007ae1d42cd0de10d04d23613f439640180b2087a89c8cc67c'
      }
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('test', ['jshint', 'mochacov:main']);
  grunt.registerTask('coverage', ['mochacov:lcov', 'codeclimate']);
  grunt.registerTask('html-cov', ['mochacov:html-cov']);

  grunt.registerTask('docs', ['jsdox', 'copy', 'clean']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);

};
