const { app, BrowserWindow, ipcMain } = require('electron'); //
const path = require('path'); //
require('dotenv').config(); // Carrega as variáveis de ambiente do .env

function createWindow () {
    // Cria a janela do navegador.
    const win = new BrowserWindow({
        width: 800, //
        height: 600, //
        webPreferences: {
            nodeIntegration: true, //
            contextIsolation: false, //
            enableRemoteModule: true, //
        }
    });

    // Carrega o index.html do aplicativo.
    win.loadFile('index.html'); //

    // Abre o DevTools (opcional).
    // win.webContents.openDevTools();
}

// Este método será chamado quando o Electron terminar de inicializar.
app.whenReady().then(createWindow); //

// Fecha o aplicativo quando todas as janelas forem fechadas (Windows e Linux).
app.on('window-all-closed', () => { //
    if (process.platform !== 'darwin') { //
        app.quit(); //
    }
});

// Recria uma janela no aplicativo quando o ícone do dock é clicado (macOS).
app.on('activate', () => { //
    if (BrowserWindow.getAllWindows().length === 0) { //
        createWindow(); //
    }
});

// Listener para a chave de API da Maritaca
ipcMain.on('get-maritaca-api-key', (event) => { //
    event.returnValue = process.env.MARITACA_API_KEY; //
});