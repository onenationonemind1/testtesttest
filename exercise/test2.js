const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const fs = require("fs");
const configuration = new Configuration({
  apiKey: process.env.CHATGPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function transcribe(filename) {
  try {
    const resp = await openai.createTranscription(
      fs.createReadStream(filename),
      "whisper-1", //사용할 모델
      "undefined", // the prompt to use for transcription
      "json", // the format of the transcription
      1, // temperture
      "en"
    );
    console.log(resp.data.text);
  } catch (e) {
    console.error(e);
  }
}

transcribe("b.mp3");
