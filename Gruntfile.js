'use strict';

module.exports = function (grunt) {
  
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
	mochacli: {
		src: ['test/*.js'],
		options: {
			globals: ['chai'],
			timeout: 6000,
			ignoreLeaks: false,
			ui: 'bdd',
			reporter: 'spec'
		}
	},
	jshint: {
		all: ['lib/**/*.js', 'test/**/*.js'],
		options: {
			jshintrc: '.jshintrc'
		}
	},
	jscs: {
		src: ['lib/**/*.js', 'test/**/*.js'],
		options: {
			config: '.jscsrc'
		}
	}
  });

  // Default task.
  grunt.registerTask('test', ['mochacli']);

};
