# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres
to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [6.1.15] 2023-06-14

### Fixed

- `StringListArrayWidget`, `StringListWidget`, `StringChoiceWidget` now fail gracefully in case of a mismatched persisted selection 

## [6.1.14] 2023-06-14

### Fixed

- Sub-widget Select all / Clear all behaviour under constraints for `StringListArrayWidget`

## [6.1.13] 2023-06-13

### Added

- Select all / Clear all behavior refined
- `getGeoExtentFieldValue` into UI library
- `ExclusiveGroupWidget` no longer crashes for missing children attribute

## [6.1.2] 2023-05-30

### Fixed

- fixed a typo in range validation for `GeographicExtentWidget`

## [6.1.1] 2023-05-29

### Added

- allow meta key in `GeographicExtentWidget`

## [6.1.0] 2023-05-29

### Added

- validation for `GeographicExtentWidget`

## [6.0.4] 2023-05-15

### Changed

- COPDS-1045: Mandatory selection message in `StringChoiceWidget`
- COPDS-1046: `LicenceWidget` must not render if licences is missing or is an empty list

## [6.0.3] 2023-05-10

### Changed

- non-optional 'default' for `StringChoiceWidget`

## [6.0.1] 2023-05-09

### Added

- validation accessibility and styles for `GeographicExtentWidget`

## [6.0.0] 2023-05-09

### Added

- support for widget validation
- initial validation for `GeographicExtentWidget`

## [5.3.1] 2023-05-03

### Fixed

- prevent form submission when `WidgetTooltip` is used inside a form

## [5.3.0] 2023-04-26

### Added

- ability to show active selected items in `StringListArrayWidget` accordions.

## [5.1.0] 2023-04-21

### Added

- ability to bypass the `required` attribute for `StringListArrayWidget`, `StringListWidget`, `StringChoiceWidget`, and `ExclusiveGroupWidget` children.

## [5.0.2] - 2023-04-18

### Fixed

- visual regression in radio and checkbox

## [5.0.1] - 2023-04-18

### Fixed

- visual regression in radio and checkbox

### Added

- ability to override CSS for inputs grid

## [5.0.0] - 2023-04-12

### Added

- `ExclusiveGroupWidget`
- `GeographicExtentWidget` initial
- `StringListArrayWidget` now available in UI library
- `StringListWidget` now available in UI library
- `StringChoiceWidget` now available in UI library

## [3.4.0] - 2023-03-24

### Changed

- refined accessibility for `WidgetTooltip`

## [3.3.1] - 2023-03-10

### Changed

- fixed a typo in `KeywordSearchWidget`

## [3.3.0] - 2023-03-09

### Changed

- refine default selections for `KeywordSearchWidget`

## [3.2.2] - 2023-02-14

### Changed

- mandatory default selections for `KeywordSearchWidget`

## [3.2.1] - 2023-02-14

### Fixed

- dead code in `KeywordSearchWidget`

## [3.2.0] - 2023-02-14

### Added

- ability to pass default selections to `KeywordSearchWidget`

## [3.1.0] - 2023-02-14

## [3.0.3-0] (beta) - 2023-02-13

### Added

- ability to pass form props to `KeywordSearchWidget`

## [3.0.2-0] (beta) - 2023-02-13

### Added

- ability to override query params transformer to `KeywordSearchWidget` via `keywordQueryParamTransformer`

## [3.0.1-0] (beta) - 2023-02-13

### Added

- `keywordQueryParam` to `KeywordSearchWidget` component (initial)

## [3.0.0-0] (beta) - 2023-02-13

### Added

- `KeywordSearchWidget` component (initial)

### Changed

`AccordionSingle`:

- removed background color
- added `data-stylizable`
- allow empty `rootProps`
