const path = require("path");
const url = require("url");
const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { config } = require("process");

const loggedIn = true;
let gridWindow, quadWindow, authWindow, startupWindow;

global.firebaseConfig = {
	apiKey: "AIzaSyDkWioRRLufkuGKibR_q5XWFt7BnE1UX3Y",
	authDomain: "cantor-nt.firebaseapp.com",
	databaseURL: "https://cantor-nt.firebaseio.com",
	projectId: "cantor-nt",
	storageBucket: "cantor-nt.appspot.com",
	messagingSenderId: "576526538577",
	appId: "1:576526538577:web:51d1fac76134cefc83e570",
	measurementId: "G-5GXG3C73VK",
};

const fb_app = initializeApp(global.firebaseConfig);
const auth = getAuth();

const pathCreater = (route) => {
	let indexPath;

	if (isDev && process.argv.indexOf("--noDevServer") === -1) {
		indexPath = url.format({
			protocol: "http:",
			host: `localhost:3000${"?" + route}`,
			slashes: true,
		});
	} else {
		indexPath =
			url.format({
				protocol: "file:",
				pathname: path.join(
					process.platform == "darwin" ? __dirname.split("/").slice(0, -2).join("/") : __dirname.split("\\").slice(0, -2).join("/"),
					"build",
					`index.html`
				),
				slashes: false,
			}) + `?${route}`;
	}

	return indexPath;
};

function createStartupWindow() {
	// Create the browser window.

	startupWindow = new BrowserWindow({
		width: 500,
		height: 300,
		transparent: true,
		frame: false,
		alwaysOnTop: true,
		webPreferences: {
			nodeIntegration: true,
			preload: __dirname + "\\preload.js",
		},
	});
	startupWindow.center();
	const route = "startup";
	createWindow(startupWindow, route, false, false);
}

function createAuthWindow() {
	// Create the browser window.
	authWindow = new BrowserWindow({
		show: false,
		webPreferences: {
			nodeIntegration: true,
			preload: __dirname + "\\preload.js",
		},
	});

	authWindow.maximize();
	const route = "auth";
	createWindow(authWindow, route, true, false);
}

function createGridWindow() {
	// Create the browser window.
	gridWindow = new BrowserWindow({
		width: 800,
		height: 600,
		show: false,
		webPreferences: {
			nodeIntegration: true,
			preload: __dirname + "\\preload.js",
		},
	});

	const route = "grid";
	createWindow(gridWindow, route, true, false);
}

function createQuadWindow() {
	// Create the browser window.
	quadWindow = new BrowserWindow({
		width: 800,
		height: 600,
		show: false,
		webPreferences: {
			nodeIntegration: true,
			preload: __dirname + "\\preload.js",
		},
	});

	const route = "quad";
	createWindow(quadWindow, route, true, false);
}

function createWindow(win, route, showDevTools = isDev, cancelAll = false) {
	win.loadURL(pathCreater(route));

	if (cancelAll) {
		win.on("close", (_) => {
			win = null;
			if (process.platform !== "darwin") {
				app.quit();
			}
		});
	}

	if (showDevTools && isDev) {
		win.webContents.openDevTools({ mode: "right" });
	}

	win.show();
}

// IPC channels
ipcMain.on("user-signin", (event, arg) => {
	// gets triggered by the async button defined in the App component
	createGridWindow();
	createQuadWindow();
	authWindow.close();
});

ipcMain.on("user-signout", (event, arg) => {
	// gets triggered by the async button defined in the App component
	gridWindow.close();
	quadWindow.close();
	createAuthWindow();
});

ipcMain.on("login-status", (event, status) => {
	console.log("login status: ", status);

	startupWindow.close();

	if (status) {
		createGridWindow();
		createQuadWindow();
	} else {
		createAuthWindow();
	}
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createStartupWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
