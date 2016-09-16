'use strict';
module.exports = function(grunt) {
    // подгружаем необходимые плагины
    require('load-grunt-tasks')(grunt);

    require('time-grunt')(grunt);
    // конфигурация
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concurrent: {
            stream1: ['jshint', 'copy', 'sass', 'dev_prod_switch'],
            stream2: ['concat', 'cssmin'],
            stream3: ['removelogging'],
            stream4: ['uglify']
        },
        jshint: {
            options: {
                'browser': true,
                'esnext': true,
                'globals': {
                    '$': true,
                    'console': true,
                    'jQuery': true
                },
                'strict': true,
                'globalstrict': false,
                'curly': true,
                'quotmark': true,
                'eqeqeq': true,
                'eqnull': true,
                'expr': true,
                'latedef': true,
                'onevar': true,
                'noarg': true,
                'node': true,
                'trailing': true,
                'undef': true,
                'unused': true
            },
            '<%== pkg.name %>': {
                src: ['js/**/*.js']
            }
        },
        bower_concat: {
            all: {
                dest: {
                    'js': 'tmp/bower.js',
                    'css': 'tmp/bower.css'
                },
                dependencies: {
                    'bootstrap': 'jquery'
                },
                bowerOptions: {
                    relative: false
                }
            }
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            },
            dist: {
                src: [
                    'tmp/bower.js',
                    'js/*',
                ],
                dest: 'tmp/build.js'
            },
        },
        removelogging: {
            dist: {
                src: 'tmp/build.js',
                dest: 'tmp/build.clean.js',
 
                options: {
                    // see below for options. this is optional. 
                }
            }
        },
        uglify: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            },
            build: {
                src: 'tmp/build.clean.js',
                dest: 'release/js/script.min.js'
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'css/style-sass.css': 'css/style.scss',
                }
            }
        },
        cssmin: {
            dist: {
                options: {
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                files: {
                    'release/css/style.min.css' : [
                        'bower_components/bootstrap/dist/css/bootstrap.css',
                        'css/*.css',
                    ]
                }
            }
        },
        watch: {
            sass: {
                files: 'css/*.scss',
                tasks: ['newer:sass'],
            },
            js: {
                files: 'js/*.js',
                tasks: ['newer:jshint']
            }
        },
        dev_prod_switch: {
            options: {
                // Can be ran as `grunt --env=dev` or ``grunt --env=prod``
                // environment: grunt.option('env') || 'dev', // 'prod' or 'dev'
                environment: 'prod', // 'prod' or 'dev'
                env_char: '#',
                env_block_dev: 'env:dev',
                env_block_prod: 'env:prod'
            },
            dynamic_mappings: {
                files: [{
                    expand: true,
                    cwd: '',
                    src: ['*.html', '*.php'],
                    dest: 'release/'
                }]
            }
        },
        copy: {
            main: {
                files: [
                {expand: true, flatten: true, src: ['img/*'], dest: 'release/img/', filter: 'isFile'},
                {expand: true, flatten: true, src: ['bower_components/bootstrap/fonts/*'], dest: 'release/fonts/', filter: 'isFile'},
                ]
            },
        }
    });

    // регистрируем задачи
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('prod', ['bower_concat', 'concurrent:stream1', 'concurrent:stream2', 'concurrent:stream3', 'concurrent:stream4']);
};
