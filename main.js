const { app, dialog, BrowserWindow } = require('electron');
const { autoUpdater } = require("electron-updater");
require("dotenv").config();

// console.log(process.env.GH_TOKEN); // 토큰 값 확인

autoUpdater.autoInstallOnAppQuit = false;

let updateWin;

function writeMessageToWindow(text) {
  console.log("writeMessageToWindow:", text); // 메시지 로그 추가
  updateWin.webContents.send("message", text);
}

function createWindow() {
  updateWin = new BrowserWindow({
    titleBarStyle: 'hiddenInset',
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  console.log("개발자 도구 열기"); // 개발자 도구 열기 로그 추가
  updateWin.webContents.openDevTools();

  updateWin.loadURL(`https://re-dam.vercel.app/`);
}

autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'TailorChain',
  repo: 'redamDAPP',
  private: false,
  // token: process.env.GH_TOKEN
});

autoUpdater.on("checking-for-update", () => {
  console.log("checking-for-update 이벤트 발생"); // 이벤트 발생 로그 추가
  writeMessageToWindow("업데이트 확인 중...");
});

autoUpdater.on("update-available", () => {
  console.log("update-available 이벤트 발생"); // 이벤트 발생 로그 추가
  writeMessageToWindow("신규 버전 확인 및 업데이트 가능.");
});

autoUpdater.on("update-not-available", () => {
  console.log("update-not-available 이벤트 발생"); // 이벤트 발생 로그 추가
  writeMessageToWindow("신규 버전 없음.");
});

autoUpdater.on("error", (err) => {
  console.error("autoUpdater 에러:", err); // 에러 로그 추가
  writeMessageToWindow("에러 발생 : " + err);
});

autoUpdater.on("download-progress", (progressObj) => {
  let progressMsg = "Downloaded " + progressObj.percent + "%";
  console.log("download-progress:", progressMsg); // 다운로드 진행률 로그 추가
  writeMessageToWindow(progressMsg);
});

autoUpdater.on("update-downloaded", (info) => {
  console.log("update-downloaded 이벤트 발생:", info); // 다운로드 완료 로그 추가
  writeMessageToWindow("신규 버전 설치 파일 다운로드 완료.");

  const option = {
    type: "question",
    buttons: ["Yes", "No"],
    defaultId: 0,
    title: "UPDATER",
    message: "프로그램 업데이트를 진행하시겠습니까?",
  };

  dialog.showMessageBox(updateWin, option).then(function (res) {
    writeMessageToWindow(res.response.toString());

    if (res.response == 0) {
      writeMessageToWindow('프로그램 종료 및 업데이트');
      autoUpdater.quitAndInstall();
    } else {
      writeMessageToWindow('프로그램 업데이트 안함');
    }
  });
});

app.on("ready", async () => {
  console.log("checkForUpdates 호출 전"); // 호출 전 로그 추가
  createWindow();
  autoUpdater.checkForUpdates();
});