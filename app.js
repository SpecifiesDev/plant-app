// Import required modules
const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

let devMode = false;

// Function to create the browser window
function createWindow() {
  // Create the browser window
 mainWindow = new BrowserWindow({
    fullscreen: !devMode,
    webPreferences: {
      nodeIntegration: true, // Enable node integration
      contextIsolation: false, // Enable context isolation
    }
  });

  mainWindow.setMenu(null);

  // Load the index.html file of the app
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
}



app.whenReady().then(() => {
  // Add the global shortcut key to open the dev tools
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    BrowserWindow.getFocusedWindow().webContents.openDevTools();
  });

  globalShortcut.register('CommandOrControl+Shift+R', () => {
    mainWindow.reload();
  });

  createWindow();
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Activate the app when it is re-activated
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});