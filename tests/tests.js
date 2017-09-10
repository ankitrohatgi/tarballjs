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
    },
    generateTar: function(download) {
        // generate a tarball and read it back
        return new Promise((resolve, reject) => {
            let tarWriter = new tarball.TarWriter();
            tarWriter.addFolder("myfolder/");
            tarWriter.addTextFile("myfolder/first.txt", "this is some text");
            tarWriter.addTextFile("myfolder/second.txt", "some more text");
            fetch("files/simple/tux.png").then(resp => resp.blob()).then((blob) => {
                let file = blob;
                file.name = "tux.png";
                file.lastModifiedDate = new Date();
                tarWriter.addFile("myfolder/tux.png", file);
                if(download) {
                    tarWriter.download("generated.tar").then(() => {
                        resolve(null);
                    });
                } else {
                    tarWriter.write().then((tarBlob) => {
                        let tarFile = tarBlob;
                        let tarReader = new tarball.TarReader();
                        tarReader.readFile(tarFile).then((fileInfo) => {
                            resolve(tarReader);
                        });
                    });
                }
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
QUnit.test( "Count files", function( assert ) {
    let done = assert.async();
    testUtils.generateTar().then((tar) => {
        let fileInfo = tar.getFileInfo();
        assert.equal(fileInfo.length, 4, "file count is ok");
        done();
    });
});

QUnit.test( "Check file headers", function( assert ) {
    let done = assert.async();
    testUtils.generateTar().then((tar) => {
        let fileInfo = tar.getFileInfo();
        assert.equal(fileInfo[3].name, "myfolder/tux.png", "file name is ok");
        assert.equal(fileInfo[3].type, "file", "file type is ok");
        assert.equal(fileInfo[3].size, 11913, "file size is ok");
        done();
    });
});

QUnit.test( "Check text file contents", function( assert ) {
    let done = assert.async();
    testUtils.generateTar().then((tar) => {
        let text = tar.getTextFile("myfolder/second.txt");
        assert.equal(text, "some more text", "text file contents are ok");
        done();
    });
});

QUnit.test( "Check image file contents", function( assert ) {
    let done = assert.async();
    testUtils.generateTar().then((tar) => {
        let imageBlob = tar.getFileBlob("myfolder/tux.png", "image/png");
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

QUnit.test( "Download test", function( assert ) {
    let done = assert.async();
    testUtils.generateTar(true).then((tar) => {
        assert.ok(1, "download test completed, please check tar file manually");
        done();
    });
});


