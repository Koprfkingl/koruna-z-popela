/* Windows app: one window that shows the game from www/ over a private app:// scheme,
   so fetch() and the sound files work the same as on the web. */
const { app, BrowserWindow, protocol, net, Menu, shell, dialog } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');

const ROOT = path.join(__dirname, '..', 'www');
const TITLE = 'Koruna z popela';

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } }]);

function createWindow() {
  const win = new BrowserWindow({
    width: 1280, height: 860, minWidth: 360, minHeight: 480,
    title: TITLE, backgroundColor: '#0a0909', autoHideMenuBar: true,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: { contextIsolation: true, sandbox: true, autoplayPolicy: 'no-user-gesture-required' }
  });
  win.loadURL('app://hra/index.html');
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'F11') { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
    if (input.key === 'Escape' && win.isFullScreen()) { win.setFullScreen(false); e.preventDefault(); }
  });
}

app.whenReady().then(() => {
  protocol.handle('app', async (req) => {
    const file = path.normalize(path.join(ROOT, decodeURIComponent(new URL(req.url).pathname)));
    if (!file.startsWith(ROOT)) return new Response('', { status: 403 });
    try { return await net.fetch(pathToFileURL(file).toString()); } catch (e) { return new Response('', { status: 404 }); }
  });
  if (process.platform !== 'darwin') Menu.setApplicationMenu(null);
  createWindow();
  checkForUpdates();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

/* Windows: download a new version from GitHub Releases in the background and offer a restart.
   The Mac build is not signed by Apple, so it cannot replace itself; the game shows a download button there. */
function checkForUpdates() {
  if (process.platform !== 'win32' || !app.isPackaged) return;
  let autoUpdater;
  try { ({ autoUpdater } = require('electron-updater')); } catch (e) { return; }
  autoUpdater.on('update-downloaded', async info => {
    const r = await dialog.showMessageBox({ type: 'info', buttons: ['Restartovat teď', 'Později'], defaultId: 0, cancelId: 1,
      title: TITLE, message: `Je připravená nová verze ${info.version}.`, detail: 'Hra se zavře a hned znovu spustí. Uložené hry zůstanou. Když dáš „Později“, nová verze se nainstaluje při příštím zavření.' });
    if (r.response === 0) autoUpdater.quitAndInstall();
  });
  autoUpdater.on('error', () => {});
  autoUpdater.checkForUpdates().catch(() => {});
}

app.on('window-all-closed', () => app.quit());
