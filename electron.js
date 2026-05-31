const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { URL } = require('url');

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'D&D Combat Tracker',
    webPreferences: {
      // Keep contextIsolation enabled for security
      contextIsolation: true,
      // Disable Node.js in renderer — not needed, Dexie runs in browser context
      nodeIntegration: false,
      sandbox: true,
    },
    icon: path.join(__dirname, 'public', 'favicon.ico'),
  });

  if (isDev) {
    // Development: load from Vite dev server
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    // Production: load built index.html
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
