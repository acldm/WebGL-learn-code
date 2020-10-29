/**
 * 在该示例中
 * 顶点着色器指定了点的位置和尺寸
 * 片元着色器指定了顶点的颜色
 */
// 顶点着色器, 描述顶点特性
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute float a_PointSize;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
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

  // 获取a_Position的存储位置
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.error("无法找到attribute变量");
    return;
  }

  // 获取a_Position的存储位置
  const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
  if (a_PointSize < 0) {
    console.error("无法找到a_PointSize attribute变量");
    return;
  }

  const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (u_FragColor < 0) {
    console.error("无法找到u_FragColor attribute变量");
    return;
  }
  
  gl.vertexAttrib1f(a_PointSize, 20.0);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  canvas.addEventListener('click', e => click(e, gl, canvas, a_Position, u_FragColor));
}

const gPoints = [];
const gColors = [];

/**
 * 
 * @param {*} e 
 * @param {GLint} gl 
 * @param {*} canvas 
 * @param {*} a_Position 
 * @param {*} u_FragColor 
 */
function click(e, gl, canvas, a_Position, u_FragColor) {
  let x = e.clientX;
  let y = e.clientY;
  const rect = e.target.getBoundingClientRect();
  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  gPoints.push([x, y]);
  gColors.push([
    x < 0 ? 0.5 : 1.0,
    y < 0 ? 1.0 : 0.5,
    0.0,
    1.0
  ]);

  // 清空颜色缓冲区 = 清空画布
  gl.clear(gl.COLOR_BUFFER_BIT);

  const len = gPoints.length;
  for (let i = 0; i < len; i++) {
    gl.vertexAttrib3f(a_Position, ...gPoints[i], 0.0);
    gl.uniform4f(u_FragColor, ...gColors[i])
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}