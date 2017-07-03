swarm-constants
===============

This project contains cross-platform "design constants" for the 
[Swarm Design System](https://github.com/meetup/swarm-design-system), generated 
using [`style-dictionary`](https://amzn.github.io/style-dictionary/);

## Documentation
Documentation is generated from `properties/` and published on github pages:

- [Colors](https://meetup.github.io/swarm-constants/)

### Usage
Edit `json` files in `properties/`. Please use the 
["Category/Type/Item" convention](https://amzn.github.io/style-dictionary/property_structure) 
for object structure. Colors should be expressed as an rgba array, `[R,G,B,A]`.

We commit our distributions to make it easier for consumers to import design constants. 
To regenerate distributions, use command `yarn run build`.

#### Adding distributions
The `style-dictionary` library uses a [`config.json`](https://amzn.github.io/style-dictionary/configuration) 
file to configure distributions. You can use one of the [`built in formats`](https://amzn.github.io/style-dictionary/formats_and_templates)
provided by `style-dictionary`, or you can register your own format.

### Scripts

Command              | Result
-------------------- | -----------------------------
`yarn run build`     | Compiles distributions


### Known issues
- colors converted to RGB hex in Sass
- alpha channels not preserved in output
	- needs `transform` updates in config
