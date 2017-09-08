let tarball = {};

tarball.TarReader = class {
    constructor(arrayBuffer) {
        this.buffer = arrayBuffer;
        this.fileInfo = [];
        this._readFileInfo();
    }

    _readFileInfo() {
        this.fileInfo = [];
        let offset = 0;
        let file_size = 0;       
        let file_name = "";
        let file_type = null;
        while(offset < this.buffer.byteLength - 512) {
            file_name = this._readString(offset, 100); // file name
            if(file_name.length == 0) {
                break;
            }
            file_type = this._readFileType(offset);
            file_size = this._readFileSize(offset);

            this.fileInfo.push({
                "name": file_name,
                "type": file_type,
                "size": file_size,
                "header_offset": offset
            });

            offset += (512 + 512*Math.trunc(file_size/512));
            if(file_size % 512) {
                offset += 512;
            }
        }
    }

    getFileInfo() {
        return this.fileInfo;
    }

    _readString(str_offset, size) {
        let strView = new Uint8Array(this.buffer, str_offset, size);
        let i = 0;
        let rtnStr = "";
        while(strView[i] != 0) {
            rtnStr += String.fromCharCode(strView[i]);
            i++;
        }
        return rtnStr;
    }

    _readFileType(header_offset) {
        // offset: 156
        let typeView = new Uint8Array(this.buffer, header_offset+156, 1);
        let typeStr = String.fromCharCode(typeView[0]);
        if(typeStr == "0") {
            return "file";
        } else if(typeStr == "5") {
            return "directory";
        } else {
            return typeStr;
        }
    }

    _readFileSize(header_offset) {
        // offset: 124
        let szView = new Uint8Array(this.buffer, header_offset+124, 12);
        let szStr = "";
        for(let i = 0; i < 11; i++) {
            szStr += String.fromCharCode(szView[i]);
        }
        return parseInt(szStr,8);
    }

    _readFileBlob(file_offset, size, mimetype) {
        let view = new Uint8Array(this.buffer, file_offset, size);
        let blob = new Blob([view], {"type": mimetype});
        return blob;
    }

    _readTextFile(file_offset, size) {
        let view = new Uint8Array(this.buffer, file_offset, size);
        let data = "";
        for(let i = 0; i < size; i++) {
            data += String.fromCharCode(view[i]);
        }
        return data;
    }

    getTextFile(file_name) {
        let i = this.fileInfo.findIndex(info => info.name == file_name);
        if(i >= 0) {
            let info = this.fileInfo[i];
            return this._readTextFile(info.header_offset+512, info.size); 
        }
    }

    getFileBlob(file_name, mimetype) {
        let i = this.fileInfo.findIndex(info => info.name == file_name);
        if(i >= 0) {
            let info = this.fileInfo[i];
            return this._readFileBlob(info.header_offset+512, info.size, mimetype); 
        }
    }
};

tarball.TarWriter = class {
};
