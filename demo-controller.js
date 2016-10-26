(function() {

    'use strict';

    angular.module('facetApp')

    /*
    * The controller.
    */
    .controller('MainController', MainController);

    /* @ngInject */
    function MainController($scope, FacetHandler, dbpediaService, facetUrlStateHandlerService) {
        var vm = this;

        // page is the current page of results.
        vm.page = [];
        vm.pageNo = 0;
        vm.getPage = getPage;
        vm.makeArray = makeArray;

        vm.disableFacets = disableFacets;

        // Listen for the facet events
        // This event is triggered when a facet's selection has changed.
        $scope.$on('sf-facet-constraints', updateResults);
        // This is the initial configuration event
        var initListener = $scope.$on('sf-initial-constraints', function(event, cons) {
            updateResults(event, cons);
            // Only listen once, then unregister
            initListener();
        });

        // Get the facet configurations from dbpediaService.
        vm.facets = dbpediaService.getFacets();
        // Initialize the facet handler
        vm.handler = new FacetHandler(getFacetOptions());

        // Disable the facets while reusults are being retrieved.
        function disableFacets() {
            return vm.isLoadingResults;
        }

        // Setup the FacetHandler options.
        function getFacetOptions() {
            var options = dbpediaService.getFacetOptions();
            options.scope = $scope;

            // Get initial facet values from URL parameters (refresh/bookmark) using facetUrlStateHandlerService.
            options.initialState = facetUrlStateHandlerService.getFacetValuesFromUrlParams();
            return options;
        }


        // Get results based on facet selections (each time the selections change).
        function updateResults(event, facetSelections) {
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
            // getTotalCount calculates the total number of result objects.
            vm.pager.getTotalCount().then(function(count) {
                vm.totalCount = count;
            }).then(function() {
                // Get the page.
                // (The pager uses 0-indexed pages, whereas Angular-UI pagination uses 1-indexed pages).
                return vm.pager.getPage(vm.pageNo-1);
            }).then(function(page) {
                vm.page = page;
                vm.isLoadingResults = false;
            }).catch(function(error) {
                vm.error = error;
                vm.isLoadingResults = false;
            });
        }

        function makeArray(val) {
            return angular.isArray(val) ? val : [val];
        }
    }
})();
