/**
 * 三角形位移变换
 */
// 顶点着色器, 描述顶点特性
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform vec4 u_Translation;
  void main() {
    gl_Position = a_Position + u_Translation;
  }
`;

// 片元着色器， 处理像素
const FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
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

  const u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
  if (u_Translation < 0) {
    console.error("无法找到u_Translation变量");
    return;
  }
  gl.uniform4f(u_Translation, 0.5, 0.5, 0.0, 1.0);

  const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (u_FragColor < 0) {
    console.error("无法找到u_FragColor变量");
    return;
  }

  const len = initVertexBuffers(gl);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, len);
}

function initVertexBuffers(gl) {
  const vertexes = new Float32Array([
    -0.5, -0.5, 0.5, -0.5, 0.0, 0.5
  ]);

  const len = vertexes.length / 2;
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexes, gl.STATIC_DRAW);
  
  // 获取a_Position的存储位置
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.error("无法找到attribute变量");
    return;
  }

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // 建立缓冲区到attribute真正连接
  gl.enableVertexAttribArray(a_Position);
  return len;
}