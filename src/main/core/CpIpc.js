import CpCoreObj from './CpCoreObj'

class CpIpc extends CpCoreObj {

    constructor(main) {
        super(main)

        this.registerIpcEvents()
    }

    registerIpcEvents() {
        super.ipcMain.on('set-application-menu', (event, data) => {
            this.main.menu.setApplicationMenu(data.role_id)
        })

        super.ipcMain.on('reload-projects-list', (event, data) => {
            this.main.window.mainWindow.webContents.send('refreshDashboardFinal')
        })
    }

}
export default CpIpc
