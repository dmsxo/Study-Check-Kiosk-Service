import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const serialAPI = {
  scan: () => ipcRenderer.send('scan-qr'),

  onData: (callback) => {
    const wrapper = (_e, data) => callback(data);
    ipcRenderer.on('serial-data', wrapper);

    // cleanup용 반환 함수
    return () => ipcRenderer.removeListener('serial-data', wrapper);
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('serialAPI', serialAPI);
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.serialAPI = serialAPI;
}
