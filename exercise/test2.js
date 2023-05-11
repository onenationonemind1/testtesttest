const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const fs = require("fs");
const configuration = new Configuration({
  apiKey: process.env.CHATGPT_API_KEY,
});

async function transcribe(filename) {
  const openai = new OpenAIApi(configuration);
  const resp = await openai.createTranscription(
    fs.createReadStream(filename),
    "whisper-1" // Whisper model name.
  );

  console.log(resp.data.text);
}

transcribe("b.mp3");
