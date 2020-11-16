const VSHADER_SOURCE = `
  uniform float u_time;
  void main() {
    gl_Position = vec4(fract(sin(u_time)), 0.0, 0.0, 1.0);
    gl_PointSize = 10.0;
  }
`;

const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
  }
`


function main() {
  const canvas = document.querySelector("#canvas");
  const gl = getWebGLContext(canvas);

  const initFlag = initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

  run(gl);

}

/**
 * @param {WebGLRenderingContext} gl
 */
function run(gl) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 10);
}