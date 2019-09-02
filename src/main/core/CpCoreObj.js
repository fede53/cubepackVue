require('dotenv').config()

import { app, Menu, ipcMain } from 'electron'
import path from 'path'

class CpCoreObj {

    constructor(main) {
        this._main = main
        this._assetsPath = app.getAppPath() + '/resources/app/assets/'
        this._modelsPath = app.getAppPath() + '/resources/core/models/'
    }

    get main() {
        return this._main;
    }

    set main(main) {
        this._main = main;
    }

    get app() {
        return app
    }

    get ipcMain() {
        return ipcMain
    }

    get Menu() {
        return Menu
    }

    get path() {
        return path
    }

    get assetsPath() {
        return this._assetsPath
    }

    get modelsPath() {
        return this._modelsPath
    }

    static get appPath() {
        return app.getAppPath()
    }
}
export default CpCoreObj