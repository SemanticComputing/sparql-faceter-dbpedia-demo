'use strict';

/* global module */
module.exports = function(grunt) {

    grunt.initConfig({
        ngtemplates: {
            'seco.facetedSearch': {
                src: [
                    'src/facets/basic/facets.basic-facet.directive.html',
                    'src/facets/text/facets.text-facet.directive.html',
                    'src/facets/timespan/facets.timespan-facet.directive.html'
                ],
                dest: 'dist/templates.js'
            }
        },
        concat: {
            js: {
                src: [
                    'src/facets/facets.module.js',
                    'src/faceturlstate/faceturlstate.url-state-handler-service.js',
                    'src/results/results.service.js',
                    'src/facets/facets.facet-mapper-service.js',
                    'src/facets/facets.facet-selection-formatter.js',
                    'src/facets/facets.facet-handler.service.js',
                    'src/facets/facets.text-with-selection.filter.js',
                    'src/facets/facets.abstract-facet.controller.js',
                    'src/facets/basic/facets.basic-facet.facet.js',
                    'src/facets/basic/facets.basic-facet.controller.js',
                    'src/facets/basic/facets.basic-facet.directive.js',
                    'src/facets/text/facets.text-facet.facet.js',
                    'src/facets/text/facets.text-facet.controller.js',
                    'src/facets/text/facets.text-facet.directive.js',
                    'src/facets/timespan/facets.timespan-facet.facet.js',
                    'src/facets/timespan/facets.timespan-facet.controller.js',
                    'src/facets/timespan/facets.timespan-facet.directive.js',
                    'src/facets/hierarchy/facets.hierarchy-facet.facet.js',
                    'src/facets/hierarchy/facets.hierarchy-facet.controller.js',
                    'src/facets/hierarchy/facets.hierarchy-facet.directive.js',
                    'dist/templates.js'
                ],
                dest: 'dist/semantic-faceted-search.js'
            },
            css: {
                src: ['src/css/facets.css'],
                dest: 'dist/semantic-faceted-search.css'
            }
        },
        clean: {
            templates: ['dist/templates.js']
        },
        ngdocs: {
            all: ['src/**/*.js'],
            sourceLink: true,
            options: {
                title: 'SPARQL Faceter'
            }
        }
    });

    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ngdocs');

    grunt.registerTask('build', [
        'ngtemplates',
        'concat:js',
        'concat:css',
        'clean:templates'
    ]);

    grunt.registerTask('doc', [
        'ngdocs:all'
    ]);
};
