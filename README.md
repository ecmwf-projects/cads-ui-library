# cads-ui-library
> Common UI Kit library, shared among CDS portal, toolbox, EQC, CIM

<p>
  <a href="https://github.com/ecmwf-projects/cads-ui-library/actions" target="_blank">
    <img alt="Unit tests" src="https://github.com/ecmwf-projects/cads-ui-library/workflows/Test/badge.svg" />
  </a>  
</p>

This is `cads-ui-library`. The aim of this UI library is to provide a set of styled and un-styled, accessible-first UI primitives that can be used and further customized in CDS and ADS portals.

## Usage

Install the library with Yarn:

```shell
yarn add @ecmwf-projects/cads-ui-library
```

or with NPM:

```shell
npm install @ecmwf-projects/cads-ui-library
```

Then, import the desired component into your project:

```shell
import { BaseButton } from '@ecmwf-projects/cads-ui-library'
```

## Publishing a new version

Increment the desired Semver version where the version can be one of `--major`, `--minor`, `--patch`. Run `yarn version -h` for a full list of flags:

```shell
yarn version --minor
```

This will also publish a release tag via `postversion` script.

The tag will trigger the related Github actions for publishing to the desired package registry.
