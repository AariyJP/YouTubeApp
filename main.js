const electron = require('electron');
const { app, BrowserWindow, Menu, MenuItem, clipboard, Tray, nativeImage, session } = electron;
const rightMenu = require('electron-context-menu');

let win = null;

app.disableHardwareAcceleration();
app.on("ready", () =>
{

  if(process.platform == "darwin")
    win = new BrowserWindow({show: false, titleBarStyle: 'hiddenInset', width: 1330, height: 745});
  else
    win = new BrowserWindow({show: false, titleBarStyle: 'hidden', titleBarOverlay: {color: '#2f0202',symbolColor: '#FFFFFF'}, width: 1330, height: 745});
  win.loadURL(`https://www.youtube.com`);
  var webContents = win.webContents;

  const contextMenu = Menu.buildFromTemplate([
    { label: 'YouTubeApp', type: 'normal', enabled: false },
    { type: 'separator', enabled: false },
    { label: '終了', type: 'normal', click: () => { app.quit(); } }
  ]);
  tray = new Tray(nativeImage.createFromPath('youtube.png'));
  tray.setContextMenu(contextMenu);
  
  const menu = new Menu();
  menu.append(new MenuItem(
    {
    label: 'YouTubeApp',
    submenu: 
    [
      {
        label: '現在のURLをコピー',
        accelerator: process.platform === 'darwin' ? 'Option+C' : 'Alt+C',
        click: () => { clipboard.writeText(webContents.getURL()); }
      },
      {
        label: '拡大',
        role: 'zoomIn'
      },
      {
        label: '縮小',
        role: 'zoomOut'
      },
      {
        label: '拡大率をリセット',
        role: 'resetZoom'
      },
      {
        role: 'toggleDevTools',
        label: '開発者ツールを切り替え'
      },
      {
        label: '終了',
        role: 'quit'
      }
    ]
  }));
  Menu.setApplicationMenu(menu);

  rightMenu
  ({
    prepend: (defaultActions, parameters, browserWindow) =>
    [
      {
        label: '現在のURLをコピー',
        visible: true,
        click: () => {
          clipboard.writeText(win.getURL());
        }
      }
    ],
    showSaveImage: true
  });

  webContents.on('new-window', (event, url) =>
  {
    event.preventDefault();
    electron.shell.openExternal(url);
  });

  webContents.on('page-favicon-updated', () =>
  {
    webContents.insertCSS('* { font-family: system-ui!important; } ::-webkit-scrollbar { display:none; } #container.ytd-masthead, header { -webkit-app-region: drag!important; -webkit-user-select: none!important; } yt-icon-button, yt-icon, #container.ytd-searchbox, ytd-topbar-menu-button-renderer, a, ytcp-icon-button, ytcp-button, input { -webkit-app-region: no-drag!important; } html:not(.style-scope)[dark], :not(.style-scope)[dark] { --yt-spec-brand-background-primary: rgba(50, 0, 0, 0.9)!important; } html:not(.style-scope) { --yt-spec-brand-background-primary: rgba(255, 200, 200, 0.9)!important; }');
    if(process.platform == "darwin")
      webContents.insertCSS('#start.ytd-masthead, ytcp-header { padding-left: 60px; }');
    else
      webContents.insertCSS('#end.ytd-masthead, .right-section { padding-right: 140px; }');
  });

  win.once('ready-to-show', () =>
  {
    win.show();
  });

  win.on("closed", () =>
  {
    win = null;
  });

});

app.on("window-all-closed", () =>
{
  app.quit();
})