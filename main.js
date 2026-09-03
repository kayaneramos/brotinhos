const { app, BrowserWindow } = require("electron");
const path = require("path");

function criarJanela() {
  const janela = new BrowserWindow({
    width: 850,
    height: 750,
    frame: true,
    title: "Brotinhos",
    resizable: false
  });

  janela.loadFile("index.html");
}

app.whenReady().then(() => {
  criarJanela();
});