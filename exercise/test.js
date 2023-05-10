async function waitForFlag() {
  while (flag === 0) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("녹음 중 입니다. : flag =", flag);
  }
  resolve();
}
flag = 1;
waitForFlag();
