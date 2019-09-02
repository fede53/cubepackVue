import { BrowserWindow } from 'electron'
import CpCoreObj from './CpCoreObj'

class CpWindow extends CpCoreObj {

    constructor(main) {
        super(main)

        this._pageUrl = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`
        this._modalWindow = null
        this._mainWindow = null
    }

    init(){
        super.app.on('ready', () => {
            this.processInit()
            //this.ui = new UiManager(this.mainWindow)
            //this.ui.loadRoutes()
            //new IpcManager().socketIpc()
            this.start()
        })

        super.app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                super.app.quit()
            }
        })

        super.app.on('activate', () => {
            if (this.mainWindow === null) {
                this.processInit()
            }
        })
    }

    processInit(){
        this.createMainWindow()
        this.createModalWindow()
        this.createApplicationMenu()

    }

    start() {
        this.mainWindow.loadURL( this.pageUrl );
        this.mainWindow.focus();
    }

    createMainWindow(){
        this._mainWindow = new BrowserWindow({
            width: 1024,
            height: 700,
            frame: true,
            icon: super.path.join(__dirname, 'assets/icons/png/64x64.png')
        })
        this._mainWindow.on('closed', () => {
            this._mainWindow = null
            super.app.quit()
        })
    }

    createModalWindow(){
        this._modalWindow = new BrowserWindow({
            parent: this._mainWindow,
            modal: true,
            show: false
        })
        this._modalWindow.on('close', (e) =>{
            e.preventDefault();
            this._modalWindow.hide();
        });
    }

    createApplicationMenu(){
        super.main.menu.setApplicationMenu();
    }

    openInMain(url){
        console.log(this._pageUrl+url)
        this._mainWindow.loadURL(this._pageUrl+url)
    }

    openInModal(url){
        console.log(this._pageUrl+url)
        this._modalWindow.loadURL(this._pageUrl+url)
        this._modalWindow.show()
    }

    get mainWindow(){
        return this._mainWindow;
    }

    get modalWindow(){
        return this._modalWindow;
    }

    get pageUrl(){
        return this._pageUrl;
    }

}
export default CpWindow