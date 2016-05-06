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

        // Facet definitions (using basic facets)
        var facets = {
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
            '{ ?s <http://dbpedia.org/ontology/genre> <http://dbpedia.org/resource/Science_fiction> . } ' +
            'UNION { ?s <http://dbpedia.org/ontology/genre> <http://dbpedia.org/resource/Hard_science_fiction> . } ';

        var facetOptions = {
            endpointUrl: endpointUrl,
            rdfClass: '<http://dbpedia.org/ontology/Writer>',
            constraint: constraint,
            preferredLang : 'en'
        };

        var prefixes =
        ' PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
        ' PREFIX dbp: <http://dbpedia.org/property/>' +
        ' PREFIX dbo: <http://dbpedia.org/ontology/>' +
        ' PREFIX foaf: <http://xmlns.com/foaf/0.1/>';

        // resultSet is a subquery that returns the URIs (?id) of the results
        // with <FACET_SELECTIONS> as a placeholder for the facet selections
        // and <PAGE> as a placeholder for paging.
        // The idea is to page the result set (the ids) only, not the entire query.
        var resultSet =
        ' SELECT DISTINCT ?id { ' +
        '  <FACET_SELECTIONS> ' +
           constraint +
        '  ?s a dbo:Writer .' +
        '  BIND(?s AS ?id) ' +
        ' } ORDER BY ?id ' +
        ' <PAGE> ';

        var resultSetQry = prefixes + resultSet;

        // This is the actual result query with all optional data.
        // (Using a placeholder and string replace for the result set
        // so that it doesn't need to be written twice).
        var query = prefixes +
        ' SELECT * WHERE {' +
        '  { ' +
        '    <RESULTSET> ' +
        '  } ' +
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
        '   ?id foaf:depiction ?depiction . ' +
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
        '   ?id dbo:genre [ rdfs:label ?genre ] . ' +
        '   FILTER(langMatches(lang(?genre), "en")) ' +
        '  }' +
        '  OPTIONAL { ' +
        '   ?id dbo:notableWork [ rdfs:label ?notableWork ] . ' +
        '   FILTER(langMatches(lang(?notableWork), "en")) ' +
        '  }' +
        ' }';

        // Add the result set to the query.
        query = query.replace(/<RESULTSET>/g, resultSet);

        // FacetResultHandler is a service that queries the endpoint with
        // the query and maps the results to objects.
        var resultHandler = new FacetResultHandler(endpointUrl, facets);

        // This function receives the facet selections from the controller
        // and gets the results from DBpedia.
        // Returns a proimise.
        function getResults(facetSelections) {
            return resultHandler.getResults(facetSelections, query, resultSetQry);
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
