# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/),
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [0.9.0] - 2017-11-27

- QueryBuilderService replaces multiple instances of <RESULT_SET>.
- The whole error object is returned when a request fails rather than just
  the data attrubute.

## [0.8.1] - 2017-09-14

### Changed
- Add configuration option for http headers.

## [0.8.0] - 2017-07-14

### Changed
- Make code safe for minification (without ng-templates).

## [0.7.2] - 2017-05-19

### Fixed
- Fix bug introduced by the previous update.

## [0.7.1] - 2017-05-18

### Added
- Changelog

### Fixed
- Fix pager getTotalCount so that the count will not be queried multiple times
  unnecessarily.

[Unreleased]: https://github.com/SemanticComputing/angular-paging-sparql-service/compare/0.8.1...HEAD
[0.9.0]: https://github.com/SemanticComputing/angular-paging-sparql-service/compare/0.8.1...0.9.0
[0.8.1]: https://github.com/SemanticComputing/angular-paging-sparql-service/compare/0.8.0...0.8.1
[0.8.0]: https://github.com/SemanticComputing/angular-paging-sparql-service/compare/0.7.2...0.8.0
[0.7.2]: https://github.com/SemanticComputing/angular-paging-sparql-service/compare/0.7.1...0.7.2
[0.7.1]: https://github.com/SemanticComputing/angular-paging-sparql-service/compare/0.7.0...0.7.1
