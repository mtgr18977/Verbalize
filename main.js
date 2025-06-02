const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
    // Cria a janela do navegador.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // Habilita o Node.js no renderer
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            // Caminho para o preload (opcional)
            // preload: path.join(__dirname, 'preload.js')
        }
    });

    // Carrega o index.html do aplicativo.
    win.loadFile('index.html');

    // Abre o DevTools (opcional).
    // win.webContents.openDevTools();
}

// Este método será chamado quando o Electron terminar de inicializar.
app.whenReady().then(createWindow);

// Fecha o aplicativo quando todas as janelas forem fechadas (Windows e Linux).
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Recria uma janela no aplicativo quando o ícone do dock é clicado (macOS).
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});