swarm-constants
===============

[![npm version](https://badge.fury.io/js/swarm-constants.svg)](https://badge.fury.io/js/swarm-constants)
[![Build Status](https://travis-ci.org/meetup/swarm-constants.svg?branch=master)](https://travis-ci.org/meetup/swarm-constants)

This project contains cross-platform "design constants" for the
[Swarm Design System](https://github.com/meetup/swarm-design-system), generated
using [`style-dictionary`](https://amzn.github.io/style-dictionary/);

## Documentation
Documentation is generated from `properties/` and published on github pages:

- [CSS Custom Properties](https://meetup.github.io/swarm-constants/)
- More TK

## Using `swarm-constants` in your application
See the `dist/` directory for platfrom-specific distributions.

## Development

### Modifying or adding values
Edit `json` files in `properties/`. Please use the
["Category/Type/Item" convention](https://amzn.github.io/style-dictionary/property_structure)
for object structure. Colors should be expressed as an rgba array, `[R,G,B,A]`.

#### Adding distributions
The `style-dictionary` library uses a [`config.json`](https://amzn.github.io/style-dictionary/configuration)
file to configure distributions. You can use one of the [`built in formats`](https://amzn.github.io/style-dictionary/formats_and_templates)
provided by `style-dictionary`, or you can register your own format.

### Scripts

Command              | Result
-------------------- | -----------------------------
`yarn run build`     | Compiles distributions

