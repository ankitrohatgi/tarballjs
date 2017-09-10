# tarballjs
Javascript library to create or read tar files in the browser

## Why?
It is often necessary to pack data into single files in the browser (e.g. creating a "project" file consisting of images+data in WebPlotDigitizer). One way is to create simple tarballs with all the data. There are a few existing libraries that do this, but this seems easy enough to do so I decided to do make my own library for learning purposes.

## Status
There are a few known limitations with this library:

- Browser only, no support for NodeJS.
- File name (including path) has to be less than 100 characters.
- Maximum total file size seems to be limited to somewhere between 500MB to 1GB (exact limit is unknown).

Some benefits of using this library:

- Code is a lot cleaner than most other implementations that I can find.
- Unit tests for read and write.

## Browser Support
This works fine on any recent version of Chrome, Firefox or Safari. To test your browser, run the unit tests here: http://arohatgi.info/tarballjs/tests/ 

## Running Unit Tests
For Chrome, the test page has to be hosted on a HTTP server. An easy way is to use Python:

In the root directory of this project, do:

    python -m SimpleHTTPServer 8000

Then browse to http://localhost:8000/tests/

For a quick test, you can visit: http://arohatgi.info/tarballjs/tests/

In Firefox, you can simply load tests/index.html without starting a web server.

## Other Implementations

- https://github.com/beatgammit/tar-js
- https://github.com/chriswininger/jstar
- https://github.com/InvokIT/js-untar (reading only)
- https://github.com/workhorsy/uncompress.js (reading only)
- http://stuk.github.io/jszip/ (active and well maintained project but for .zip files)

If you are aware of other implementations, then please let me know :)

## References

- https://en.wikipedia.org/wiki/Tar_(computing)
- https://www.gnu.org/software/tar/manual/html_node/Standard.html


