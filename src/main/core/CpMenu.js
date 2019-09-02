import CpCoreObj from './CpCoreObj'
import CpMain from './CpMain'

class CpMenu extends CpCoreObj {

    constructor(main) {
        super(main)

        //Init main menu
        this.genericOperation = [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ];

        this.genericEditOperation = [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" },
            { type: 'separator'},
            {
                label: 'Dev tool',
                click: (menuItem, currentWindow) => {
                    currentWindow.webContents.openDevTools()
                    super.main.window.modalWindow.webContents.openDevTools()
                }
            }
        ];
    }

    setApplicationMenu(userRole) {
        var currentTemplate = this.createDefaultMenu();
        if(userRole == CpMain.USER_BASE) {
            currentTemplate = this.createUserMenu();
        } else if(userRole == CpMain.USER_ADMIN) {
            currentTemplate = this.createAdminMenu();
        }
        super.Menu.setApplicationMenu(super.Menu.buildFromTemplate(currentTemplate));
    }

    createDefaultMenu() {
        let menuTemplate = [
            {
                label: "Edit",
                submenu: this.genericEditOperation
            }
        ];
        if (process.platform === 'darwin') {
            menuTemplate.unshift({
                label: super.app.getName(),
                submenu: this.genericOperation
            })
        }
        return menuTemplate;
    }

    createUserMenu() {
        let menuTemplate = [
            {
                label: "Edit",
                submenu: this.genericEditOperation
            },
            {
                label: 'Project',
                submenu: [
                    {
                        label: 'New Project',
                        click: (menuItem, currentWindow) => {
                            super.main.window.mainWindow.webContents.send(CpMenu.PROJECT_NEW)
                        }
                    },
                    { type: 'separator'},
                    { label: 'Clone Project',
                        click: (menuItem, currentWindow) => {
                            super.main.window.mainWindow.webContents.send(CpMenu.PROJECT_CLONE)
                        }
                    },
                ]
            },
            {
                label: 'Settings',
                submenu: [
                    {
                        label: 'Account',
                        click: (menuItem, currentWindow) => {
                            super.main.window.mainWindow.webContents.send(CpMenu.ACCOUNT_SETTINGS)
                        }
                    }
                ]
            }
        ];
        if (process.platform === 'darwin') {
            menuTemplate.unshift({
                label: super.app.getName(),
                submenu: this.genericOperation
            })
        }

        return menuTemplate;
    }

    createAdminMenu() {
        var menuTemplate = [
            {
                label: "Edit",
                submenu: this.genericEditOperation
            },
            {
                label: 'Project',
                submenu: [
                    {
                        label: 'New Project',
                        click: (menuItem, currentWindow) => {
                            super.main.window.mainWindow.webContents.send(CpMenu.PROJECT_NEW)
                        }
                    },
                    { type: 'separator'},
                    { label: 'Clone Project',
                        click: (menuItem, currentWindow) => {
                            super.main.window.mainWindow.webContents.send(CpMenu.PROJECT_CLONE)
                        }
                    },
                ]
            },
            {
                label: 'Settings',
                submenu: [
                    {
                        label: 'Account',
                        click: (menuItem, currentWindow) => {
                            super.main.window.mainWindow.webContents.send(CpMenu.ACCOUNT_SETTINGS)
                        }
                    },
                    { type: 'separator'},
                    {
                        label: 'Users',
                        click: (menuItem, currentWindow) => {
                            super.main.window.mainWindow.webContents.send(CpMenu.USERS)
                        }
                    }
                ]
            }
        ];
        if (process.platform === 'darwin') {
            menuTemplate.unshift({
                label: super.app.getName(),
                submenu: this.genericOperation
            })
        }

        return menuTemplate
    }

    static get PROJECT_NEW() {
        return 'project_new'
    }

    static get PROJECT_CLONE() {
        return 'project_clone'
    }

    static get ACCOUNT_SETTINGS() {
        return 'settings'
    }

    static get USERS() {
        return 'users'
    }

}
export default CpMenu
