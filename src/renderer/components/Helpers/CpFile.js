const path = require('path')
const fs = require('fs')

class CpFile {

    constructor(main) {
        //NOP
    }

    walk(dir, baseDir, done) {
        var results = [];
        fs.readdir(dir, (err, list) => {
            if (err) return done(err);
            var pending = list.length;
            if (!pending) return done(null, results);
            list.forEach((file) => {
                file = path.resolve(dir, file);
                fs.stat(file, (err, stat) => {
                    if (stat && stat.isDirectory()) {
                        this.walk(file, baseDir, (err, res) => {
                            results = results.concat(res);
                            if (!--pending) done(null, results);
                        });
                    } else {
                        var fileCheckName = file.replace(baseDir, '');
                        var filename = path.basename(fileCheckName);
                        results.push({'path': fileCheckName, 'name' : filename });
                        if (!--pending) done(null, results);
                    }
                });
            });
        });
    }

}
export default CpFile