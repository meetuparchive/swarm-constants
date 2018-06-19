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
1. `style-dictionary` transforms keys and properties from JSON into an intermediate
   format, a plain JS object referred to as "dictionary".
2. `style-dictionary` then can generate distributions from the "dictionary" object based on formats/templates specified in `config.json`
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

--------------

## Custom transforms
A [_transform_](https://amzn.github.io/style-dictionary/#/transforms) is a function that
is used to transform a value or key name from JSON. For example, transforming an
`[r,g,b,a]` array into a hex or CSS color. `swarm-constants` uses a few custom transforms
that are not provided by `style-dictionary`:

### `color/optimizedRGBA`
Converts color values to optimized CSS `rgba()`. If alpha channel is 1, uses `rgb()`.

```js
// Matches: color category properties
// Returns:
"rgba(84, 96, 107, 0.6)"
"rgb(53, 62, 72)"
```

### `color/androidHex8`
Converts color values to android 8 digit hex

```js
// Matches: color category properties
// Returns:
"#ff2e3e48"
"#ffffffff"
```

### `name/cti/customProperty`
Returns a style property name as a CSS custom property definition name.

```js
// Matches: all
// Returns:
"--c-blue"
"--c--textPrimary"
"--space-1"
```

### `attribute/colorValues`
Adds calculated color values to dictionary object properties.

```js
// Matches: style properties in `color` category
// adds a `colorValues` object to each property of the dictionary
{
	colorValues: { rgba, hex, hsv, hsl, androidHex8 }
}
```

### `attribute/colorVarNames`
Adds calculated color var names to dictionary object properties.

```js
// Matches: style properties in `color` category
// adds a `colorVarNames` object to each property of the dictionary
{
	colorVarNames: { android, sass, js, customProperty }
}
```

## Custom formats
A [_format_](https://amzn.github.io/style-dictionary/#/formats) is essentially a script or
template to control the formatting of output for a given distribution. `swarm-constants`
uses a few custom formats that are not defined in `style-dictionary`:

## Custom style properties
[_Style properties_](https://amzn.github.io/style-dictionary/#/README?id=style-properties) refer to the JSON definitions in the [`properties/`](https://github.com/meetup/swarm-constants/tree/master/properties)
directory. We use a few custom style properties in `swarm-constants` to meet our
responsive and color needs:

