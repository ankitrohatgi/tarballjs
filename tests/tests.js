let testUtils = {
    fetchTar: function(filename) { 
        return new Promise((resolve, reject) => {
            fetch(filename).then(resp => resp.blob()).then((blob) => {
                let tar = new tarball.TarReader();
                tar.readFile(blob).then((fileInfo) => {
                    resolve(tar);
                });
            });
        });
    }
};

// Read tests
QUnit.module("Read Tests");
QUnit.test( "Count files", function( assert ) {
    let done = assert.async();
    testUtils.fetchTar("files/simple.tar").then((tar) => {
        let fileInfo = tar.getFileInfo();
        assert.equal(fileInfo.length, 3, "Has 3 files");
        assert.equal(fileInfo[0].name, "simple/", "Has simple directory");
        assert.equal(fileInfo[1].name, "simple/tux.png", "Has image file");
        assert.equal(fileInfo[2].name, "simple/hello.txt", "Has text file");
        done();
    });
});

QUnit.test( "Check file headers", function( assert ) {
    let done = assert.async();
    testUtils.fetchTar("files/simple.tar").then((tar) => {
        let fileInfo = tar.getFileInfo();
        assert.equal(fileInfo[1].name, "simple/tux.png", "File name is ok");
        assert.equal(fileInfo[1].type, "file", "File type is ok");
        assert.equal(fileInfo[1].size, 11913, "File size is ok");
        done();
    });
});

QUnit.test( "Check text file contents", function( assert ) {
    let done = assert.async();
    testUtils.fetchTar("files/simple.tar").then((tar) => {
        let text = tar.getTextFile("simple/hello.txt");
        assert.equal(text, "hello world!\n", "Text file contents are ok");
        done();
    });
});

QUnit.test( "Check image file contents", function( assert ) {
    let done = assert.async();
    testUtils.fetchTar("files/simple.tar").then((tar) => {
        let imageBlob = tar.getFileBlob("simple/tux.png", "image/png");
        let imageURL = URL.createObjectURL(imageBlob);
        let image = new Image();
        image.onload = (event) => {
            assert.equal(image.width, 265, "Image width is ok");
            assert.equal(image.height, 314, "Image height is ok");
            done();
        };
        image.src = imageURL;
    });
});

// write tests
QUnit.module("Write tests");

