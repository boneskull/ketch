'use strict';

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        'Gruntfile.js',
        '<%= pkg.main %>',
        '<%= mochacov.main %>'
      ],
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      }
    },

    // Unit tests.
    mochacov: {
      main: ['test/*.spec.js']
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
        src: ['<%= pkg.main %>'],
        dest: '.'
      }
    }

  });

  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['jshint', 'mochacov']);

  grunt.registerTask('release', 'Update docs, bump & tag for release', function(target) {
    grunt.task.run('bump-only:' + target);
    grunt.task.run('jsdox');
    grunt.task.run('bump-commit');
  });

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test']);

};
