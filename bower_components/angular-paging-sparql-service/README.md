# Angular SPARQL service with paging and object mapping

Angular service for querying SPARQL endpoints, and mapping the results
as simple objects.

## Installation

`bower install angular-paging-sparql-service`

Include `sparql` in your module dependenies:

```
angular.module('myApp', ['sparql'])
```

## Usage

Provided injectable services:

`SparqlService` provides a constructor for a simple SPARQL query service
that simply returns results (bindings) based on a SPARQL query.

`AdvancedSparqlService` provides the same service as SparqlService, but adds
paging support for queries.

`QueryBuilderService` can be used to construct pageable SPARQL queries.

`objectMapperService` maps SPARQL results to objects.

Better documentation to come.
For now, see comments in the source code, and example projects:

* [SPARQL Faceter DBpedia demo](https://github.com/SemanticComputing/sparql-faceter-dbpedia-demo)
* [WarSampo death records](https://github.com/SemanticComputing/WarSampo-death-records)

## Development

Requires
[Karma](https://karma-runner.github.io/), and [Grunt](http://gruntjs.com/).

Install dev dependenies

`npm install`

### Running tests

`karma start`

### Building

`grunt build`
