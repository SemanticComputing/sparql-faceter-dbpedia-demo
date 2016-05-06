/*
 * Semantic faceted search
 *
 */

(function() {

    'use strict';

    angular.module('facetApp')

    /*
    * Controller for the results view.
    */
    .controller( 'MainController', function (dbpediaService, facetUrlStateHandlerService) {

        var vm = this;

        vm.facetOptions = getFacetOptions();
        vm.facets = dbpediaService.getFacets();
        vm.disableFacets = disableFacets;

        vm.page = [];
        vm.pageNo = 0;
        vm.getPage = getPage;

        function disableFacets() {
            return vm.isLoadingResults;
        }

        function getFacetOptions() {
            var options = dbpediaService.getFacetOptions();
            options.updateResults = updateResults;
            // Get initial facet values from URL parameters (refresh/bookmark)
            options.initialValues = facetUrlStateHandlerService.getFacetValuesFromUrlParams();
            return options;
        }

        function updateResults(facetSelections) {
            // Update the URL parameters based on facet selections
            facetUrlStateHandlerService.updateUrlParams(facetSelections);
            vm.isLoadingResults = true;

            dbpediaService.getResults(facetSelections)
            .then(function(pager) {
                vm.pager = pager;
                vm.pageNo = 1;
                return getPage();
            });
        }

        function getPage() {
            vm.isLoadingResults = true;
            vm.pager.getTotalCount().then(function(count) {
                vm.totalCount = count;
            }).then(function() {
                return vm.pager.getPage(vm.pageNo-1);
            }).then(function(page) {
                vm.page = page;
                vm.isLoadingResults = false;
            }).catch(function(error) {
                vm.error = error;
                vm.isLoadingResults = false;
            });
        }

    });
})();
