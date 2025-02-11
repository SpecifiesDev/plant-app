// Import required modules
const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const SQLManager = require('./src/scripts/dbManager.js');

let mainWindow, sqlManager;

let devMode = false;

app.whenReady().then(async () => {
  // Add the global shortcut key to open the dev tools
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    BrowserWindow.getFocusedWindow().webContents.openDevTools();
  });

  globalShortcut.register('CommandOrControl+Shift+R', () => {
    if (mainWindow) {
      mainWindow.reload();
    }
  });

  // Create the browser window
  mainWindow = new BrowserWindow({
    fullscreen: !devMode,
    show: false, // Initially hide the main window
    backgroundColor: '#1E293B',  // Set the background color to match your app
    webPreferences: {
      nodeIntegration: true, // Enable node integration
      contextIsolation: false, // Enable context isolation,
      preload: path.join(__dirname, 'preload.js') // Use a preload script
    },
  });

  mainWindow.setMenu(null);

  // Load the loading screen content initially
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'loading.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Show the window once the loading screen content is loaded
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();  // Show the window
  });

  // Initialize SQLManager
  sqlManager = new SQLManager();
  let loadSuccess = false;
  try {
    sqlManager.init();
    loadSuccess = true;
  } catch (err) {
    console.error(err);
  }

  // use set timeout to ensure our loading lasts at least 5 seconds
  setTimeout(() => {
    // Load the main content after the loading period
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }));

    mainWindow.webContents.on('did-finish-load', () => {
      // if we loaded and verified the database, the renderer will know it's able to use a new sql manager for queries
      if (loadSuccess) {
        mainWindow.webContents.send('sql-manager-ready', { success: true });
      } else {
        mainWindow.webContents.send('sql-manager-ready', { success: false });
      }

      // Fade in the main window when content has loaded
      mainWindow.webContents.executeJavaScript(`
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        document.body.style.opacity = 0;  // Start fully transparent

        // Force a layout reflow to apply the initial opacity
        void document.body.offsetWidth;

        document.body.style.opacity = 1; // Fade in
      `);
    });
  }, 5200);
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