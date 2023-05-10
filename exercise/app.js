// API 키를 dot.env에 보관하기 위함.
require("dotenv").config();

// 서버를 유지하기 위함.
const express = require("express");
const session = require("express-session"); // ㅁㅁㅁㅁㅁ
const app = express();
const port = 3000;

// chatgpt를 연결하기 위함.
const { Configuration, OpenAIApi } = require("openai");
const axios = require("axios");
const configuration = new Configuration({
  apiKey: process.env.CHATGPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

// 녹음을 하기 위함
const path = require("path"); // 경로설정
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const mic = require("mic");
const { Readable } = require("stream");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
ffmpeg.setFfmpegPath(ffmpegPath);

// 초기값 세팅
messages = [
  {
    role: "system",
    content:
      "You are a conversation practice bot. Take on any role you want and talk to me. Answer concisely in one or two sentences if possible, and ask questions from time to time.",
  },
];

// public 폴더를 Client가 이용할 수 있도록 설정.
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "my-secret-key", // 세션을 암호화하기 위한 키
    resave: false,
    saveUninitialized: true,
  })
);

// flag 설정
let flag = 0;
// 언어 설정.
let lang = "en";

// js파일 경로 설정
let main = require("./chatGPT.js"); // Gpt 불러옴
let textToSpeech = require("./textToSpeech.js"); // text-to-speech 불러옴
let listFiles = require("./listFiles.js");

// checkFLag
function checkFlag(req) {
  return new Promise((resolve) => {
    function check() {
      if (req === undefined) {
        setTimeout(check, 100);
      } else {
        resolve(req);
      }
    }
    check();
  });
}

// 사용자 음성 녹음. >>> 텍스트 파일로 변환.
function recordAudio(filename) {
  return new Promise((resolve, reject) => {
    const micInstance = mic({
      rate: "16000",
      channels: "1",
      fileType: "wav",
    });

    const micInputStream = micInstance.getAudioStream();
    const output = fs.createWriteStream(filename);
    const writable = new Readable().wrap(micInputStream);

    writable.pipe(output);
    console.log("녹음을 시작합니다..");
    micInstance.start();

    // 녹음이 종료 될때까지 while문 작동, 이후 flag 1을 만난 후 녹음을 종료함.
    async function waitForFlag() {
      while (flag === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // while 루프 내에서 플래그 변수를 다시 확인하기 전에 1초의 지연을 도입하는 데 사용됩니다. 이렇게 하면 루프에서 과도한 CPU 사용을 방지하고 프로그램이 플래그가 변경되기를 기다리는 동안 다른 작업을 수행할 수 있습니다
        console.log("녹음 중 입니다. : flag =", flag);
      }

      micInstance.stop();
      console.log("녹음을 종료합니다. : flag =", flag);

      deleteRecordedAudio(filename); // 녹음이 종료되면 생성된 파일을 삭제함
      resolve();
    }
    waitForFlag();
    micInputStream.on("error", (err) => {
      reject(err);
    });
  });
}

// 녹음 파일을 whisper에 보냄 >>> 음성을 텍스트 파일로 변환.
async function transcribeAudio(filename) {
  const transcript = await openai.createTranscription(
    fs.createReadStream(filename), //번역할 파일
    "whisper-1", //사용할 모델
    undefined, // the prompt to use for transcription
    "json", // the format of the transcription
    1, // temperture
    "en" //language en, es, fr, it, de, ja, ko, nl, pl, pt , ru ,zh-cn, zh-tw
  );
  return transcript.data.text;
}

// User의 녹음파일을 삭제함.
function deleteRecordedAudio(filename) {
  fs.unlink(filename, (err) => {
    if (err) {
      console.error("User의 음성파일을 삭제 실패했습니다.", err);
    } else {
      console.log(`User의 음성 파일을 삭제했습니다. ${filename}`);
    }
  });
}

// public 폴더안의 모든 파일을 삭제하기 위함.
function clearPublicFolder() {
  let i;
  listFiles()
    .then((files) => {
      // 파일 목록을 사용하여 작업 수행
      for (i = 0; i < files.length; i++) {
        console.log(files[i], "이 삭제되었습니다.");
        let deleteFile = files[i];
        deleteRecordedAudio1(deleteFile);
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

//새로 접근할때마다 파일 모두 삭제함.
// clearPublicFolder();

function deleteRecordedAudio1(filename) {
  const filePath = path.join(__dirname, "./public", filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`${filePath} 경로의 파일이 삭제되었습니다.`);
  });
}

// Gpt의 음성 파일의 이름을 설정.
async function tts(gptMsg) {
  const now = new Date();
  newFilename2 = `recorded_audio_${now.getFullYear()}-${
    now.getMonth() + 1
  }-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}.mp3`;
  await textToSpeech(gptMsg, newFilename2, lang);
  console.log(newFilename2);
}

// Root 접근: index 파일을 렌더링
app.get("/", (req, res) => {
  req.session.flag;
  console.log("req.session.flag", req.session.flag);
  res.render("index");
});

// Start 접근:
app.get("/start", (req, res) => {
  console.log("/start에 접근하였습니다.");
  //새로운 파일이름을 만들어주기 위함. newFilename은 전역변수로 설정. ex) record_audio_년_월_일_시간_분_초.wav
  const now = new Date();
  newFilename = `recorded_audio_${now.getFullYear()}-${
    now.getMonth() + 1
  }-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}.wav`;

  // recordAudio 함수를 사용하여, flag 초기화
  recordAudio(newFilename).then(() => {
    //녹음이 종료된 후, flag 초기화

    checkFlag(req.session.flag);
    console.log("녹음 종료되었습니다.");
    res.json(flag);
  });
});

// Stop 접근
app.get("/stop", async (req, res) => {
  console.log("-----번역을 시작합니다.------");
  // User가 한말을 text로 변환.
  const transcription = await transcribeAudio(newFilename);
  res.json({ transcription });
  //번역이 끝났음을 알기 위함.
  flag = 1;
  console.log("User음성 <- 텍스트 변환 완료", transcription, "falg = ", flag);
  messages.push({ role: "user", content: transcription });
});

// chat 접근
app.get("/chat", async (req, res) => {
  // 질문이 gpt에 들어가고, 대답이 나옴
  const answer = await main(messages);
  messages.push({ role: "assistant", content: answer });
  console.log("Gpt의 대답 - ", answer);
  console.log(messages);
  // Gpt의 대답을 음성으로 변환.
  await tts(answer);
  console.log("녹음완료");
  res.json({ answer, newFilename2 }); // 대답을 뿌려줌
});

app.get("/delete", async (req, res) => {
  console.log("/delete 접근");
  // public 폴더 안에 있는 newFilename2 파일을 삭제.
  await deleteRecordedAudio1(newFilename2);
  console.log("삭제 완료");
  res.json(); // 의미없음 - /delete의 끝을 알리기 위함.
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});