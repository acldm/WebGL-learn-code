function main() {
  const canvas = document.querySelector("#canvas");
  const gl = getWebGLContext(canvas);
  if (!gl) {
    return;
  }

  gl.clearColor(0.0, 0, 0, 1.0);
  // 清空颜色缓冲区 = 清空画布
  gl.clear(gl.COLOR_BUFFER_BIT);
}