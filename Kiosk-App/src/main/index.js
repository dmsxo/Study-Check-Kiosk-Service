import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { SerialPort } from 'serialport'

let mainWindow;
let portCheckInterval;
let port;

async function getPort(){
  const ports = await SerialPort.list();
  const targetPort = ports.find(port => port.vendorId === '1B4F' && port.productId === '9206');

  return targetPort.path;
}

function startPortCheck() {
  if (portCheckInterval) return; // 이미 돌아가면 중복 X
  portCheckInterval = setInterval(connectSerial, 2000); // 2초 간격
}

// 재탐색 중지
function stopPortCheck() {
  if (portCheckInterval) {
    clearInterval(portCheckInterval);
    portCheckInterval = null;
  }
}

async function connectSerial() {
  try {
    const path = await getPort();

    if (!path) {
      mainWindow.webContents.send('port-status', 'disconnected');
      return;
    }

    mainWindow.webContents.send('port-status', 'connected');

    port = new SerialPort({ path, baudRate: 9600});

    port.on('data', (chunk) => {
      const line = chunk.toString().trim();
      console.log(line);
      if (line && mainWindow) {
        mainWindow.webContents.send('serial-data', line);
      }
    });

    port.on('open', () => {
      console.log(`Serial port opened on ${path}`);
      mainWindow.webContents.send('port-status', 'connected');
    });

    port.on('close', () => {
      mainWindow.webContents.send('port-status', 'disconnected');
      startPortCheck();
    });

    port.on('error', () => {
      mainWindow.webContents.send('port-status', 'disconnected');
      startPortCheck();
    });

    stopPortCheck(); // 연결되면 재탐색 중지
  } catch (err) {
    console.error('connectSerial error:', err);
    mainWindow.webContents.send('port-status', 'disconnected');
    startPortCheck();
  }
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
    contextIsolation: false,
    webSecurity: false,          // 외부 요청 허용
    allowRunningInsecureContent: true
    }
  })

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      "Content-Security-Policy": [
        "default-src 'self'; connect-src 'self' http://localhost:3000 http://127.0.0.1:3000 ws:; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval';"
      ]
    }
  });
});

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  connectSerial()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 시리얼 데이터 들어오면 바로 Renderer로 전송

ipcMain.on('scan-qr', () => {
  if (!port || !port.isOpen) {
    console.warn('[ipc] 포트 미연결 상태에서 start-qr 요청');
    if (mainWindow) mainWindow.webContents.send('serial-error', '포트 미연결');
    return;
  }
  port.write('s'); // QR 스캔 시작 신호 전송
});

ipcMain.on('stop-scan-qr', () => {
  if (!port || !port.isOpen) {
    console.warn('[ipc] 포트 미연결 상태에서 stop-scan-qr 요청');
    if (mainWindow) mainWindow.webContents.send('serial-error', '포트 미연결');
    return;
  }
  port.write('c'); // QR 스캔 시작 신호 전송
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
