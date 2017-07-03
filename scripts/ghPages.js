const ghpages = require('gh-pages');

//
// For now, we're only publishing color docs
//
ghpages.publish('dist/doc/color/', (err) => {
    if (err) {
        throw new Error(err);
    }
});