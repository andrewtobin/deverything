'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        clean: ['.tmp', 'public/*.*'],
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
        less: {
            compile: {
                options: {
                    paths: ['web/style'],
                    cleancss: true
                },
                files: {
                    'public/style.css': 'web/style/style.less'
                }
            }
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
                    'public/scripts.js': [
                        '.tmp/scripts/**/*.js'
                    ]
                }
            }
        }
    });

    grunt.registerTask('default', [
        'clean',
        'jshint',
        'less',
        'ngmin',
        'uglify'
    ]);
};
