(function() {

    'use strict';

    /* eslint-disable angular/no-service-method */

    // Module definition, note the dependency.
    angular.module('facetApp', ['seco.facetedSearch'])

    /*
     * DBpedia service
     * Handles SPARQL queries and defines facet configurations.
     */
    .service('dbpediaService', dbpediaService);

    /* @ngInject */
    function dbpediaService(FacetResultHandler) {

        /* Public API */

        // Get the results from DBpedia based on the facet selections.
        this.getResults = getResults;
        // Get the facet definitions.
        this.getFacets = getFacets;
        // Get the facet options.
        this.getFacetOptions = getFacetOptions;

        /* Implementation */

        // Facet definitions
        var facets = {
            // Text search facet for names
            '<http://www.w3.org/2000/01/rdf-schema#label>': {
                type: 'text',
                enabled: true,
                name: 'Name'
            },
            // Basic facets
            '<http://dbpedia.org/ontology/genre>': {
                enabled: true,
                name: 'Genre'
            },
            '<http://dbpedia.org/ontology/birthPlace>': {
                enabled: true,
                name: 'Birth Place'
            },
            '<http://dbpedia.org/ontology/citizenship>': {
                name: 'Citizenship'
            }
        };

        var endpointUrl = 'http://dbpedia.org/sparql';

        // Restrict to writers in the (hard) science fiction genre.
        // This is completely optional.
        // The subject variable in the constraint should be "?s".
        var constraint =
        '{ ?s <http://dbpedia.org/ontology/genre> <http://dbpedia.org/resource/Science_fiction> . } UNION ' +
        '{ ?s <http://dbpedia.org/ontology/genre> <http://dbpedia.org/resource/Hard_science_fiction> . } ';

        // Both rdfClass and constraint are optional, but you will most likely want to
        // define at least one of them, or you might get bad results when there are no
        // facet selections.
        // rdfClass is just a shorthand constraint for '?s a <rdfClass> .'
        var facetOptions = {
            endpointUrl: endpointUrl, // required
            rdfClass: '<http://dbpedia.org/ontology/Writer>', // optional
            constraint: constraint, // optional
            preferredLang : 'en' // required
        };

        var prefixes =
        ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
        ' PREFIX dbp: <http://dbpedia.org/property/>' +
        ' PREFIX dbo: <http://dbpedia.org/ontology/>' +
        ' PREFIX foaf: <http://xmlns.com/foaf/0.1/>';

        // This is the result query, with <RESULT_SET> as a placeholder for
        // the result set subquery that is formed from the facet selections.
        // The variable names used in the query will be the property names of
        // the reusulting mapped objects.
        // Note that ?id is the variable used for the result resource here, and not ?s,
        // as in the constraint option.
        // Variable names with a '__' (double underscore) in them will results in
        // an object. I.e. here ?work__id, ?work__label, and ?work__link will be
        // combined into an object:
        // writer.work = { id: '[work id]', label: '[work label]', link: '[work link]' }
        var queryTemplate =
        ' SELECT * WHERE {' +
        '  <RESULT_SET> ' +
        '  OPTIONAL { '+
        '   ?id rdfs:label ?name . ' +
        '   FILTER(langMatches(lang(?name), "en")) ' +
        '  }' +
        '  OPTIONAL { ' +
        '   ?id dbp:birthDate ?birthDate . ' +
        '  }' +
        '  OPTIONAL { ' +
        '   ?id dbp:deathDate ?deathDate . ' +
        '  }' +
        '  OPTIONAL { ' +
        '   ?id dbo:thumbnail ?depiction . ' +
        '  }' +
        '  OPTIONAL { ' +
        '   ?work__id dbo:author ?id ; ' +
        '    rdfs:label ?work__label ; ' +
        '    foaf:isPrimaryTopicOf ?work__link . ' +
        '   FILTER(langMatches(lang(?work__label), "en")) ' +
        '  }' +
        '  OPTIONAL { ' +
        '   ?id foaf:isPrimaryTopicOf ?wikipediaLink . ' +
        '  }' +
        '  OPTIONAL { ' +
        '   ?id dbp:birthPlace ?birthPlace . ' +
        '   FILTER(langMatches(lang(?birthPlace), "en")) ' +
        '  }' +
        '  OPTIONAL { ' +
        '   ?id dbo:abstract ?abstract . ' +
        '   FILTER(langMatches(lang(?abstract), "en")) ' +
        '  }' +
        '  OPTIONAL { ' +
        '   ?id dbo:genre/rdfs:label ?genre . ' +
        '   FILTER(langMatches(lang(?genre), "en")) ' +
        '  }' +
        '  OPTIONAL { ' +
        '   ?id dbo:notableWork/rdfs:label ?notableWork . ' +
        '   FILTER(langMatches(lang(?notableWork), "en")) ' +
        '  }' +
        ' }';

        var resultOptions = {
            prefixes: prefixes, // required if the queryTemplate uses prefixes
            queryTemplate: queryTemplate, // required
            resultsPerPage: 10, // optional (default is 10)
            pagesPerQuery: 1, // optional (default is 1)
            paging: true // optional (default is true), if true, enable paging of the results
        };

        // FacetResultHandler is a service that queries the endpoint with
        // the query and maps the results to objects.
        var resultHandler = new FacetResultHandler(endpointUrl, facets, facetOptions,
                resultOptions);

        // This function receives the facet selections from the controller
        // and gets the results from DBpedia.
        // Returns a promise.
        function getResults(facetSelections) {
            // If there are variables used in the constraint option (see above),
            // you can also give getResults another parameter that is the sort
            // order of the results (as a valid SPARQL ORDER BY sequence, e.g. "?id").
            // The results are sorted by URI (?id) by default.
            return resultHandler.getResults(facetSelections);
        }

        // Getter for the facet definitions.
        function getFacets() {
            return facets;
        }

        // Getter for the facet options.
        function getFacetOptions() {
            return facetOptions;
        }
    }
})();
