const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');
const { URL } = require('url');

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
    title: 'Castle Keeper',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  // Open external links in the default browser, not in the app
  win.webContents.setWindowOpenHandler(({ url }) => {
    // Only allow safe protocols
    const parsed = new URL(url);
    if (['https:', 'http:'].includes(parsed.protocol)) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // Prevent navigation to external URLs
  win.webContents.on('will-navigate', (event, url) => {
    const parsed = new URL(url);
    const isLocal =
      parsed.protocol === 'file:' ||
      (isDev && parsed.hostname === 'localhost');
    if (!isLocal) {
      event.preventDefault();
    }
  });
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();

  app.on('activate', () => {
    // macOS: re-create window when dock icon is clicked with no open windows
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // On macOS it's conventional to keep the app running until Cmd+Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
