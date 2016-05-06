(function() {

    'use strict';

    /* eslint-disable angular/no-service-method */
    angular.module('facetApp', ['seco.facetedSearch'])

    /*
     * DBpedia service
     */
    .service('dbpediaService', dbpediaService);

    /* @ngInject */
    function dbpediaService(FacetResultHandler) {

        this.getResults = getResults;
        this.getFacets = getFacets;
        this.getFacetOptions = getFacetOptions;


        // Facet definitions (basic facets)
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

        // resultSet is a subquery that returns the URIs of the results
        // with <FACET_SELECTIONS> as a placeholder for the facet selections
        // and <PAGE> as a placeholder for paging.
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

        query = query.replace(/<RESULTSET>/g, resultSet);

        // FacetResultHandler is a service that queries the endpoint with
        // the query and maps the results to objects.
        var resultHandler = new FacetResultHandler(endpointUrl, facets);

        function getResults(facetSelections) {
            return resultHandler.getResults(facetSelections, query, resultSetQry);
        }

        function getFacets() {
            return facets;
        }

        function getFacetOptions() {
            return facetOptions;
        }
    }
})();
