import CpMenu from './CpMenu'
import CpWindow from './CpWindow'
import CpIpc from './CpIpc'

class CpMain {

    constructor() {
        this._menu = new CpMenu(this)
        this._ipc = new CpIpc(this)
        this._window = new CpWindow(this)

        //Start APP
        this._window.init()
    }

    get menu() {
        return this._menu
    }

    get window() {
        return this._window
    }

    get ipc() {
        return this._ipc
    }

    static get USER_ADMIN() {
        return '2'
    }

    static get USER_BASE() {
        return '1'
    }

}
export default CpMain