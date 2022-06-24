const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
	sendMessage: (channel, arg) => ipcRenderer.send(channel, arg),
});
