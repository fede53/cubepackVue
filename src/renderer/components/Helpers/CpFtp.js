require('dotenv').config()

const ClientFTP = require('ftp');
const path = require('path');
const fs = require('fs')
const mkDirRec = require('mkdir-recursive');

const connectionParams = {
    host: process.env.FTP_SRC_IP,
    port:'21',
    user: process.env.FTP_SRC_USERNAME,
    password: process.env.FTP_SRC_PASSWORD,
    keepalive: 10000
}

class CpFtp {

    constructor(main) {
        //NOP
    }

    downloadFiles(fileList, localPath, projectID, isObject, callback) {
        var ftpClient = new ClientFTP();
        ftpClient.on('ready', function(err) {
            console.log("CONNECT")
            for( var i=0; i<fileList.length; i++) {
                var fileName = isObject ? fileList[i].path : fileList[i];
                (
                    function (localPath, fileName) {
                        ftpClient.get(process.env.FTP_SRC_FOLDER + '/' + projectID +  fileName, (err, stream) => {
                            if (err) {
                                throw err
                                console.log(err)
                            }
                            stream.once('close', () => {
                                ftpClient.end()
                            });
                            mkDirRec.mkdirSync(localPath + path.dirname(fileName))
                            stream.pipe(fs.createWriteStream(localPath + fileName));
                            callback(false)
                        })
                    }
                )(localPath, fileName)
            }
        })
        ftpClient.on('close', function(err) {
            callback(true)
        })
        ftpClient.connect(connectionParams)
    }

    uploadFiles(fileList, localPath, projectID, isObject, callback) {
        var ftpClient = new ClientFTP();
        ftpClient.on('ready', function(err) {
            console.log("CONNECT")
            for( var i=0; i<fileList.length; i++) {
                var fileName = isObject ? fileList[i].path : fileList[i];
                (
                    function (localPath, fileName) {
                        var ftpRelativePath = process.env.FTP_SRC_FOLDER + '/' + projectID +  path.dirname(fileName)
                        var ftpFileName = path.basename(fileName)
                        ftpClient.mkdir(ftpRelativePath, true, function(err) {
                            if (err) {
                                console.log('FTP MKDIR ERROR')
                                return 0
                            }
                            ftpClient.put(localPath + fileName, ftpRelativePath + '/' + ftpFileName, function(err) {
                                if (err) {
                                    console.log('FTP PUT ERROR' + ftpRelativePath + '/' + ftpFileName)
                                    return 0
                                }
                                callback(false)
                                ftpClient.end();
                            });
                        })
                        console.log(ftpRelativePath, ftpFileName)
                    }
                )(localPath, fileName)
            }
        })
        ftpClient.on('close', function(err) {
            callback(true)
        })
        ftpClient.connect(connectionParams)
    }

}
export default CpFtp