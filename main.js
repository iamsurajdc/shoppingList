const electron = require("electron");
const url = require("url");
const path = require("path");

const {app, BrowserWindow, Menu, MenuItem} = electron;

let mainWindow;

// Listen for the app to be ready

app.on('ready', () => {
    // create new window
    mainWindow = new BrowserWindow({
        // webPreferences: {
        //     webSecurity: 'false'
        // }
    });

    //Load html into window

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Build Menu from template

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    
    // Insert Menu
    Menu.setApplicationMenu(mainMenu);
});

// Create Menu template

    const mainMenuTemplate = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Add Item'
                },
                {
                    label: 'Clear Item'
                }, 
                {
                    label: 'Quit',
                    click() {
                        app.quit();
                    }
                }
            ]
        }
    ];