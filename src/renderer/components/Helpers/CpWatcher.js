require('dotenv').config()

const path = require('path');
const fs = require('fs')
const watch = require('node-watch');
const compileScss = require('./Scss');

class CpWatcher {

    constructor(projectObj, store) {
        try {
            if( typeof this.currentWatcher != 'undefined' && this.currentWatcher != null ) {
                this.currentWatcher.stop()
            }
            this.store = store
            this.startWaching(projectObj)
        } catch(err) {
            console.log('WATCH ERROR', err);
        }
    }

    startWaching(projectObj) {
        try {
            this.currentWatcher = watch(projectObj.local_folder, { recursive: true }, (evt, name) => {
                var currentFileExtension = path.extname(name)
                var currentFileName = path.basename(name, currentFileExtension)

                if( evt == 'update' || evt == 'remove' ) {
                    this.store.dispatch('projectsModule/scanProjectFolder', { local_folder: projectObj.local_folder })
                }
                if( currentFileExtension == '.scss' ) {

                    compileScss.default
                        .process({
                            from: '/Users/federicovarese/Documents/ARCHIVIO/SITI/TEST-CUBEPACK/PR1/17/minisiti/sass/global.scss',
                            to: '/Users/federicovarese/Documents/ARCHIVIO/SITI/TEST-CUBEPACK/PR1/17/minisiti/css/global.css',
                        })
                        .then(function() {
                    })
                    .catch(function(error) {
                        console.log(error);
                    });    
                }
            })
            this.currentWatcher.on('ready', () => {
                console.log('start', 'start watching');
            });
            this.currentWatcher.on('error', (err) => {
                console.log('error', 'watching error');
            });

        } catch(err) {
            console.log('Watcher error');
        }
    }
}
export default CpWatcher