'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        clean: {
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '{,*/}*.js'
            ]
        },
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'web/scripts/',
                    src: '**/*.js',
                    dest: '.tmp/scripts'
                }]
            }
        },
        uglify: {
            dist: {
                files: {
                    'public/hosted/scripts.js': [
                        '.tmp/scripts/**/*.js'
                    ]
                }
            }
        }
    });

    grunt.registerTask('default', [
        'clean:server',
        'jshint',
        'ngmin',
        'uglify'
    ]);
};
