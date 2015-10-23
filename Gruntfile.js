module.exports = function(grunt){


	//project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		mochaTest:{
			test:{
				options:{
					reporter:'spec',
					quiet:false,
					ui:'tdd'
				},
				src:['test/**/*.js']
			}
		}
	});

	//load task
	grunt.loadNpmTasks('grunt-mocha-test');

	//default grunt task
	grunt.registerTask('default', ['mochaTest']);
};