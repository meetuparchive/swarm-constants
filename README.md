swarm-constants
===============

[![npm version](https://badge.fury.io/js/swarm-constants.svg)](https://badge.fury.io/js/swarm-constants)
[![Build Status](https://travis-ci.org/meetup/swarm-constants.svg?branch=master)](https://travis-ci.org/meetup/swarm-constants)

This project contains cross-platform "design constants" for the
[Swarm Design System](https://github.com/meetup/swarm-design-system), generated
using [`style-dictionary`](https://amzn.github.io/style-dictionary/#/README);

# Table of Contents

* [Documentation](#documentation)
* [Using constants in your application](#using-swarm-constants-in-your-application)
* [Development](#development)

----------

# Documentation
Documentation is generated from `properties/` and published on github pages:

- [CSS Custom Properties](https://meetup.github.io/swarm-constants/)
- More TK

# Using `swarm-constants` in your application
See the `dist/` directory for platfrom-specific distributions.

# Development
This project uses [`style-dictionary`](https://amzn.github.io/style-dictionary/#/README)
and follows conventions of [`style-dictionary`](https://amzn.github.io/style-dictionary/#/README).

## Overview
This project follows these steps to create distributions:

0. Read all JSON files in [`properties/`](https://github.com/meetup/swarm-constants/tree/master/properties)
1. Transform JSON into distributions, using options specified in `config.json`
3. On pushes to `master`, Travis builds a release and publishes an npm package containing
   a `dist/` directory. The `dist/` directory of the published package is a build artifact
   of `style-dictionary`.

## Scripts

Command              | Result
-------------------- | -----------------------------
`yarn run build`     | Compiles distributions

## Modifying or adding values
Edit `json` files in `properties/`. Please use the
["Category/Type/Item" convention](https://amzn.github.io/style-dictionary/property_structure)
for object structure. Colors should be expressed as an rgba array, `[R,G,B,A]`.

## Adding distributions
The `style-dictionary` library uses a [`config.json`](https://amzn.github.io/style-dictionary/configuration)
file to configure distributions. You can use one of the [`built in formats`](https://amzn.github.io/style-dictionary/formats_and_templates)
provided by `style-dictionary`, you can register your own format, or use one of the custom
formats documented below.

## Custom transforms



## Custom formats
