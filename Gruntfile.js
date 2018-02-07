'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    eslint: {
      target: [
        'Gruntfile.js',
        'index.js'
      ]
    }
  });

  // tasks
  grunt.loadNpmTasks('grunt-eslint');

  // aliases
  grunt.registerTask('test', ['eslint']);
  grunt.registerTask('default', ['test']);
};
