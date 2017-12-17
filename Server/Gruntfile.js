module.exports = function(grunt) {
  
      // Project configuration
      grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        env : {
          dev : {
            NODE_ENV : 'development'
          },
          production: {
            NODE_ENV : 'production'
          }
         },
      
         nodemon: {                                     // Add the nodemon task
            dev: { script: 'index.js' }
        },

        jshint: {                                       // Add the jshint task
            options: {
              reporter: require('jshint-stylish'),
              esversion: 6                              // JavaScript version ES6              
            },
             all: ['Grunfile.js', 'config/*.js', 'index.js','app/**/*.js',/*'test/test.js'*/]     // Files to be checked.  Add to this as we add more to the server             
           }
       
      });
    
      grunt.loadNpmTasks('grunt-contrib-jshint');       // Load the modules
      grunt.loadNpmTasks('grunt-contrib-nodemon');
      grunt.loadNpmTasks('grunt-env');
    
      grunt.registerTask('default', [                  // Add the nodemon task to both task lists and the jshint task to the dev taks list
          'env:dev',
          'jshint',
          'nodemon'
        ]);

       grunt.registerTask('production', [
          'env:production',
          'nodemon'
        ]);
      
      };

      
    
     
  
  