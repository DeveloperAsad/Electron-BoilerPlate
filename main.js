const { app, BrowserWindow, ipcMain, Menu } = require('electron');

// allow user to only open one instance of the application
const lock = app.requestSingleInstanceLock();
if (!lock) {
    app.quit();
    return;
}

const DEV = !app.isPackaged;
// const RESOURCES = DEV ? __dirname : process.resourcesPath;

// if in dev mode then watch for build changes and reload electron
DEV && require('electron-reload')(`${__dirname}/build`);

// const appMenu = Menu.buildFromTemplate([
//     {
//         label: 'Restocks Rus',
//         submenu: [
//             { role: 'about' },
//             { type: 'separator' },
//             { role: 'services', submenu: [] },
//             { type: 'separator' },
//             { role: 'hide' },
//             { role: 'hideothers' },
//             { role: 'unhide' },
//             { type: 'separator' },
//             { role: 'quit' }
//         ]
//     }
// ])

if (process.platform === 'darwin') {
    Menu.setApplicationMenu(appMenu);
}


let window = null;
let shouldQuit = false;

// let tray = null;
// createTray = () => {
//     tray = new Tray(`${RESOURCES}/build/static/assets/tray.png`);
//     let template = [
//         {
//             label: 'Open Restocks Rus', accelerator: 'CmdOrCtrl+Shift+B' , click: () => {
//                 if (window && !window.isDestroyed()) window.show();
//             }
//         },
//         {
//             label: 'Quit', click: () => {
//                 shouldQuit = true;
//                 app.quit();
//             }
//         }
//     ]
//     DEV && template.unshift({
//         label: 'Open DevTools',
//         click:  () => {
//             if (window && !window.isDestroyed()) window.webContents.openDevTools();
//         }
//     })
//     let trayMenu = Menu.buildFromTemplate(template)
//     tray.setContextMenu(trayMenu);
// }

createMainWindow = () => {
    window = new BrowserWindow({
        width: 980,
        height: 660,
        minWidth : 720,
        minHeight : 580,
        show: false,
        resizable : false,
        // frame : false
        // backgroundColor : '#181818'
    // alwaysOnTop : DEV
    });
    window.setTitle('Phone Book');
    // window.setMenu(null);
    // window.setIcon(`${RESOURCES}/build/static/assets/tray.png`);
    window.loadURL(`file://${__dirname}/build/static/index.html`)
    window.once('ready-to-show', () => {
        window.show();
    })
    window.on('close', e => {
        if (shouldQuit) return;
        e.preventDefault();
        window.hide();
    })
}

app.on('ready', () => {
    createMainWindow();
    // createTray();
})

// add support for basic text editing
const contextMenuTemplate = [
    { role: 'cut', accelerator: 'CmdOrCtrl+X' },
    { role: 'copy', accelerator: 'CmdOrCtrl+C' },
    { role: 'paste', accelerator: 'CmdOrCtrl+V' },
]
const contextMenu = Menu.buildFromTemplate(contextMenuTemplate);
ipcMain.on('open-contextmenu', e => {
    contextMenu.popup(window);
})

// ipcMain.on('update-available', (e,url) => {
//     download(window, url).then(res => {
//         let filename = res.getSavePath();
//         let choice = dialog.showMessageBox(
//             window,
//             {   
//                 title : 'Restocks Rus', 
//                 message: 'Restocks Rus is ready to update. Do you want to quit and install?',
//                 cancelId : 1,
//                 buttons : ['Yes, Sure!', 'Ask me Later']
//             }
//         );
//         if (choice != 0)  return;
//         try {
//             let proc = spawn(filename,[],{detached: true});
//             shouldQuit = true;
//             app.quit();
//         }
//         catch (e) {
//             console.log('[quit-and-install]',e);
//         }
//     }).catch(e => {
//         console.log('[dl-update]',e);
//     })
// })