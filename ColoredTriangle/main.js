/**
 * 绘制彩色三角形
 */
// 顶点着色器, 描述顶点特性
const VSHADER_SOURCE = `
  // x' = x cos b - y cos b
  // y' = x sin b + y sin b
  // z' = z
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  void main() {
    gl_Position = a_Position;
    v_Color = a_Color;
  }
`;

// 片元着色器， 处理像素
const FSHADER_SOURCE = `
  precision mediump float;
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
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

  updateDraw(gl);
}

function initVertexBuffers(gl) {
  const vertexes = new Float32Array([
    -0.5, -0.5, 1.0, 0, 0,
    0.5, -0.5, 0, 1.0, 0,
    0.0, 0.5, 0, 0, 1.0
  ]);

  const FSIZE = vertexes.BYTES_PER_ELEMENT;

  const len = vertexes.length / 5;
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexes, gl.STATIC_DRAW);
  
  // 获取a_Position的存储位置
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.error("无法找到attribute变量");
    return -1;
  }

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
  // 建立缓冲区到attribute真正连接
  gl.enableVertexAttribArray(a_Position);


  const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_Color < 0) {
    console.error("无法找到a_Color变量");
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE* 5, FSIZE * 2);
  gl.enableVertexAttribArray(a_Color);

  return len;
}


let rotate = 0;
function updateDraw(gl) {
  const len = initVertexBuffers(gl);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, len);
  requestAnimationFrame(() => updateDraw(gl));

}