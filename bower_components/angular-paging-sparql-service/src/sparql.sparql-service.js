/*
* Service for querying a SPARQL endpoint.
* Takes the endpoint URL as a parameter.
*/
(function() {
    'use strict';

    /* eslint-disable angular/no-service-method */
    angular.module('sparql')

    .factory('SparqlService', SparqlService);

    /* ngInject */
    function SparqlService($http, $q, _) {
        return function(configuration) {

            if (_.isString(configuration)) {
                // Backwards compatibility
                configuration = { endpointUrl: configuration };
            }

            var defaultConfig = { usePost: false };

            var config = angular.extend({}, defaultConfig, configuration);

            var executeQuery = config.usePost ? post : get;

            function get(qry) {
                return $http.get(config.endpointUrl + '?query=' + encodeURIComponent(qry) + '&format=json');
            }

            function post(qry) {
                var data = 'query=' + encodeURIComponent(qry);
                var conf = { headers: {
                    'Accept': 'application/sparql-results+json',
                    'Content-type' : 'application/x-www-form-urlencoded'
                } };
                return $http.post(config.endpointUrl, data, conf);
            }

            return {
                getObjects: function(sparqlQry) {
                    // Query the endpoint and return a promise of the bindings.
                    return executeQuery(sparqlQry).then(function(response) {
                        return response.data.results.bindings;
                    }, function(response) {
                        return $q.reject(response.data);
                    });
                }
            };
        };
    }
})();
