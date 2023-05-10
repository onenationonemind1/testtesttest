// pulic 폴더 안의 파일 리스트를 출력.

const fs = require("fs");
const path = require("path");

async function listFiles() {
  const publicPath = path.join(__dirname, "public");

  try {
    const files = await fs.promises.readdir(publicPath);
    console.log(files);
    return files;
  } catch (err) {
    console.error(err);
  }
}

module.exports = listFiles;
