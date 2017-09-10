# tarballjs
Javascript library to create or read tar files in the browser

## Why?
It is often necessary to pack data into single files in the browser (e.g. creating a "project" file consisting of images+data in WebPlotDigitizer). One way is to create simple tarballs with all the data. There are a few existing libraries that do this, but this seems easy enough to do so I decided to do make my own library for learning purposes.

## Status
This library is just an intial hack at the moment. Here are a few known limitations:

- Browser only, no support for NodeJS.
- File name (including path) has to be less than 100 characters.
- Maximum total file size seems to be limited to ~1GB (exact limit is unknown).

If you are looking for more serious attempts, then please refer to the following:

- https://github.com/beatgammit/tar-js
- https://github.com/chriswininger/jstar
- https://github.com/InvokIT/js-untar (reading only)
- https://github.com/workhorsy/uncompress.js (reading only)
- http://stuk.github.io/jszip/ (active and well maintained project but for .zip files)

If you are aware of other implementations, then please let me know :)

## Reference

- https://en.wikipedia.org/wiki/Tar_(computing)
- https://www.gnu.org/software/tar/manual/html_node/Standard.html


