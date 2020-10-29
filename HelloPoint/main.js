
// 顶点着色器
const VSHADER_SOURCE = `
  void main() {
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
    gl_PointSize = 10.0;
  }
`;

// 片元着色器
const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
  }
`;

function main() {
  const canvas = document.querySelector("#canvas");
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.error("无法取得WebGL渲染上下文!");
    return;
  }


  const initShaderFlag = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  if (!initShaderFlag) {
    console.error("初始化着色器失败!");
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // 清空颜色缓冲区 = 清空画布
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.POINTS, 0, 1);
}