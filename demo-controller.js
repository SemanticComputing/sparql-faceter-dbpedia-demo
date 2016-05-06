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

        // Disable the facets while reusults are being retrieved.
        function disableFacets() {
            return vm.isLoadingResults;
        }

        function getFacetOptions() {
            var options = dbpediaService.getFacetOptions();
            options.updateResults = updateResults;
            // Get initial facet values from URL parameters (refresh/bookmark) using facetUrlStateHandlerService.
            options.initialValues = facetUrlStateHandlerService.getFacetValuesFromUrlParams();
            return options;
        }

        // Get results based on facet selections (each time the selections change).
        function updateResults(facetSelections) {
            // Update the URL parameters based on facet selections
            facetUrlStateHandlerService.updateUrlParams(facetSelections);
            vm.isLoadingResults = true;

            // The dbpediaService returns a (promise of a) pager object.
            dbpediaService.getResults(facetSelections)
            .then(function(pager) {
                vm.pager = pager;
                vm.pageNo = 1;
                return getPage();
            });
        }

        // Get a page of mapped objects.
        // Angular-UI pagination handles the page number changes.
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
