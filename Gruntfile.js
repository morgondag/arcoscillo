module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Minify HTML
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'index.html':'_src/index.html', // destination : source
                }
            }
        },
        // Build CSS
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'style.min.css':'_src/sass/style.scss', // destination : source
                }
            }
        },
        // Minify JavaScript
        uglify: {
            build: {
                dest: 'script.min.js',
                src: '_src/js/script.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['htmlmin','sass','uglify']);
};