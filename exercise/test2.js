const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const configuration = new Configuration({
  apiKey: "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",
});

format = "json";
language = "en";
async function transcribe() {
  const openai = new OpenAIApi(configuration);
  const resp = await openai.createTranscription(
    fs.createReadStream("a.wav"), // audio input file
    "whisper-1", // Whisper model name.
    undefined, // Prompt
    format, // Output format. Options are: json, text, srt, verbose_json, or vtt.
    1, // Temperature.
    language // ISO language code. Eg, for english `en`
  );

  console.log(resp.data);
}

transcribe();
