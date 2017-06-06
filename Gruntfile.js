module.exports = function (grunt) {
  grunt.initConfig({
    eslint: {
      target: ["index.js"]
    }
  });

  // tasks
  grunt.loadNpmTasks("grunt-eslint");

  // aliases
  grunt.registerTask("test", ["eslint"]);
  grunt.registerTask("default", ["test"]);
};