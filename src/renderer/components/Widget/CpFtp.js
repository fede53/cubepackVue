const ClientFTP = require('ftp');
const path = require('path');
const fs = require('fs')
const mkDirRec = require('mkdir-recursive');

let ftpData = {
    ftp_server: '151.236.33.162',
    ftp_username: 'cubepack',
    ftp_password: 'Vfzh88^3',
    ftp_folder: '/httpdocs'
}

class CpFtp {

    constructor(main) {
        //NOP
    }

    downloadFiles(fileList, localPath) {
        var ftpClient = new ClientFTP();
        ftpClient.on('ready', function(err) {
            console.log("CONNECT")
            for( var i=0; i<fileList.length; i++) {
                var fileName = fileList[i];
                (
                    function (localPath, fileName) {
                        ftpClient.get(ftpData.ftp_folder + fileName, (err, stream) => {
                            if (err) throw err;
                            stream.once('close', () => {
                                ftpClient.end();
                            });
                            mkDirRec.mkdirSync(localPath + path.dirname(fileName))
                            stream.pipe(fs.createWriteStream(localPath + fileName));
                        })
                    }
                )(localPath, fileName)
            }
        });
        ftpClient.connect(
            { 
                host: ftpData.ftp_server, 
                port:'21', 
                user: ftpData.ftp_username, 
                password: ftpData.ftp_password, 
                keepalive: 10000 
            }
        );
    }

    uploadFiles(fileList, localPath) {
        var ftpClient = new ClientFTP();
        ftpClient.on('ready', function(err) {
            console.log("CONNECT")
            for( var i=0; i<fileList.length; i++) {
                var fileName = fileList[i];
                (
                    function (localPath, fileName) {
                        ftpClient.get(ftpData.ftp_folder + fileName, (err, stream) => {
                            if (err) throw err;
                            stream.once('close', () => {
                                ftpClient.end();
                            });
                            mkDirRec.mkdirSync(localPath + path.dirname(fileName))
                            stream.pipe(fs.createWriteStream(localPath + fileName));
                        })
                    }
                )(localPath, fileName)
            }
        });
        ftpClient.connect(
            { 
                host: ftpData.ftp_server, 
                port:'21', 
                user: ftpData.ftp_username, 
                password: ftpData.ftp_password, 
                keepalive: 10000 
            }
        );
    }

    /*
    ftpClient.on('ready', function(err) {
        if (err) {
            console.log('------ CONNECTION ERROR ------')
            console.log(err)
            console.log('------ CONNECTION ERROR ------')
            throw err;
        }
        ftpClient.mkdir(ftpRelativePath, true, function(err) {
            if (err) {
                console.log('------ MKDIR ERROR ------')
                console.log(err)
                console.log('------ CONNECTION ERROR ------')
                throw err;
            }
            ftpClient.put(localFile, ftpRelativePath + '/' + ftpFileName, function(err) {
                if (err) {
                    console.log('------ COPY ERROR ------')
                    console.log(err)
                    console.log('------ CONNECTION ERROR ------')
                    throw err;
                }
                console.log('------ FILE COPIATO ------', localFile + ' -> ' +  ftpRelativePath + '/' + ftpFileName);

                writeLog('upload', ftpRelativePath + '/' + ftpFileName);

                ftpClient.end();
            });
        });
    });
    */
}
export default CpFtp