/**
 * 在该示例中
 * 使用TRIANGLE_STRIP模式绘制了矩形
 */
// 顶点着色器, 描述顶点特性
const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_TexCoord;
  varying vec2 v_TexCoord;

  void main() {
    gl_Position = a_Position;
    v_TexCoord = a_TexCoord;
  }
`;

// 片元着色器， 处理像素
const FSHADER_SOURCE = `
  precision mediump float;
  uniform sampler2D u_Sampler;
  varying vec2 v_TexCoord;

  void main() {
    gl_FragColor = texture2D(u_Sampler, v_TexCoord);
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
  
  const len = initVertexBuffers(gl);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (!initTexture(gl, len)) {
    console.error("失败！");
    return;
  }

  
}

function initVertexBuffers(gl) {
  // 绘制多个三角形,从第二个开始给出新三角形最后一个顶点即可。注意顺序。
  const vertexes = new Float32Array([
    -0.5,  0.5, 0.0, 1.0,
    -0.5, -0.5, 0.0, 0.0,
     0.5,  0.5, 1.0, 1.0,
     0.5, -0.5, 1.0, 0.0
  ]);

  const FSIZE = vertexes.BYTES_PER_ELEMENT;
  const len = 4;

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexes, gl.STATIC_DRAW);
  
  // 获取a_Position的存储位置
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.error("无法找到attribute变量");
    return;
  }

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);

  // 建立缓冲区到attribute真正连接
  gl.enableVertexAttribArray(a_Position);

  var a_TexCoord = gl.getAttribLocation(gl.program, "a_TexCoord");
  if (a_TexCoord < 0) {
    console.error("无法找到a_TexCoord变量");
    return;
  }

  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_TexCoord);
  return len;
}

// 创建纹理
function initTexture(gl, len) {
  let texture  = gl.createTexture();
  let u_Sampler = gl.getUniformLocation(gl.program, "u_Sampler");
  let img = new Image();
  img.src = "../resources/img/block.png";
  img.onload = function() {
    // 像素存储模式 y轴翻转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    // 激活纹理单元
    gl.activeTexture(gl.TEXTURE0);
    // 绑定纹理对象到纹理单元
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // 设置纹理的表现规则
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // 将纹理图像(img)分配给纹理对象
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    gl.uniform1i(u_Sampler, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, len);
  }

  return 1;
}