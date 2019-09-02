const ClientFTP = require('ftp');

class CpFtp {

    constructor() {

    }

    downloadFiles(fileList) {
        var ftpClient = new ClientFTP();
        ftpClient.on('ready', function(err) {
            for( var i=0; i<data.result.length; i++) {
                var fileName = data.result[i];
                (
                    function (localPath, fileName) {
                        ftpClient.get(ftpData.ftp_folder + fileName, (err, stream) => {

                            if (err) throw err;
                            stream.once('close', () => {
                                ftpClient.end();
                            });
                            console.log('CREATE -> '+localPath + path.dirname(fileName));
                            mkDirRec.mkdir(localPath + path.dirname(fileName), (err) => {
                                if (err) console.log(err);
                                console.log('INSIDE -> '+localPath + fileName);
                                stream.pipe(fs.createWriteStream(localPath + fileName));
                            });
                        })
                    }
                )(localPath, fileName)
            }
        });
        ftpClient.connect(connectionParams);
    }

}
export default CpFtp
