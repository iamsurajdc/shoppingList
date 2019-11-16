const electron = require("electron");
const url = require("url");
const path = require("path");

const {app, BrowserWindow, Menu, MenuItem, ipcMain} = electron;

let mainWindow;
let addWindow;

// Listen for the app to be ready

app.on('ready', () => {
    // create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
          },
    });

    //Load html into window

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Close Window

    mainWindow.on('closed', () => {
        app.quit();    
    });

    // Build Menu from template

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    
    // Insert Menu
    Menu.setApplicationMenu(mainMenu);
});

// Handle Add Window

createAddWindow = () => {

    addWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
          },
        height: 400,
        width: 600,
        title: 'Add Shopping List Item'
    });

    //Load html into window

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    addWindow.on('close', () => {
        addWindow = null;
    });

};

// catch item:add

    ipcMain.on('item:add', (e, item) => {
        console.log("TCL: item", item)
        mainWindow.webContents.send('item:add', item);
        addWindow.close();
    });

// 
// Create Menu template

    const mainMenuTemplate = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Add Item',
                    click() {
                        createAddWindow();
                    }
                },
                {
                    label: 'Clear Item',
                    click() {
                        mainWindow.webContents.send('item:clear');
                    }
                }, 
                {
                    label: 'Quit',
                    accelerator: process.platform === 'darwin' ? 'Command + Q': 'Ctrl + Q',
                    click() {
                        app.quit();
                    }
                }
            ]
        }
    ];

    // If mac, add empty object to menu
if( process.platform === 'darwin') {
    mainMenuTemplate.unshift({});
}

// add dev tools item if not in prod

if(process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
            label: 'Toggle DevTools',
            accelerator: process.platform === 'darwin' ? 'Command + I': 'Ctrl + I',
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}