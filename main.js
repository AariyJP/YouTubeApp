const electron = require('electron');
const { app, BrowserWindow, Menu, MenuItem, clipboard, Tray, nativeImage } = electron;
const rightMenu = require('electron-context-menu');

let win = null;

app.on("window-all-closed", () =>
{
  app.quit();
});

app.on("ready", () =>
{
  win = new BrowserWindow({show: false, titleBarStyle: 'hidden', width: 1330, height: 900});
  win.loadURL(`https://www.youtube.com`);
  var webContents = win.webContents;
  webContents.insertCSS('* { font-family: system-ui!important; } ::-webkit-scrollbar { display:none; } #container.ytd-masthead, header { -webkit-app-region: drag!important; } yt-icon-button, yt-icon, #container.ytd-searchbox, ytd-topbar-menu-button-renderer, a, ytcp-icon-button, ytcp-button, input { -webkit-app-region: no-drag!important; } html:not(.style-scope)[dark], :not(.style-scope)[dark] { --yt-spec-brand-background-primary: rgba(50, 0, 0, 0.9)!important } #items > ytd-compact-link-renderer:nth-child(3), #buttons > ytd-topbar-menu-button-renderer:nth-child(1), #items > ytd-compact-link-renderer:nth-child(5), #items > ytd-compact-link-renderer:nth-child(3) { display: none!important;}');
  if(process.platform == "darwin")
    webContents.insertCSS('#start.ytd-masthead { margin-left: 60px; }');
  tray = new Tray(nativeImage.createFromPath('youtube.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'YouTubeApp', type: 'normal', enabled: false },
    { type: 'separator', enabled: false },
    { label: '終了', type: 'normal' }
  ]);
  tray.setContextMenu(contextMenu);

  const menu = new Menu();
  menu.append(new MenuItem(
    {
    label: 'YouTubeApp',
    submenu: 
    [
      {
        role: 'about',
        label: 'YouTubeAppについて'
      },
      {
        label: "現在のURLをコピー",
        accelerator: process.platform === 'darwin' ? 'Option+C' : 'Alt+C',
        click: () => { clipboard.writeText(webContents.getURL()) }
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

  win.once('ready-to-show', () =>
  {
    win.show();
  });
  webContents.on('new-window', (event, url) =>
  {
    event.preventDefault();
    electron.shell.openExternal(url);
  });
  win.on("closed", () =>
  {
    win = null;
  });
});