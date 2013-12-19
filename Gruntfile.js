'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
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
        uglify: {
            dist: {
                files: {
                    'public/scripts/scripts.js': [
                        'public/bower_components/**/*.js',
                        'public/objects/**/*.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', [
        'jshint'
        //'uglify'
    ]);
};
