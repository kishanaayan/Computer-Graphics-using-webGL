const canvas = document.querySelector(`canvas#webgl-canvas`);
const gl_context = canvas.getContext(`webgl`);




const vertex_shader_source = `
attribute vec2 pos;

void main() {
  gl_Position = vec4(pos, 0, 1);
}
`;
const vertex_shader = gl_context.createShader(gl_context.VERTEX_SHADER);
gl_context.shaderSource(vertex_shader, vertex_shader_source);
gl_context.compileShader(vertex_shader);




const fragment_shader_source = `
precision mediump float;

void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
}
`;
const fragment_shader = gl_context.createShader(gl_context.FRAGMENT_SHADER);
gl_context.shaderSource(fragment_shader, fragment_shader_source);
gl_context.compileShader(fragment_shader);




const program = gl_context.createProgram();
gl_context.attachShader(program, vertex_shader);
gl_context.attachShader(program, fragment_shader);
gl_context.linkProgram(program);




const positions = [
    -0.5, -0.5,
    0.5, -0.5,
    0, 0.5
];
const positionBuffer = gl_context.createBuffer();
gl_context.bindBuffer(gl_context.ARRAY_BUFFER, positionBuffer);
gl_context.bufferData(
    gl_context.ARRAY_BUFFER,
    new Float32Array(positions),
    gl_context.STATIC_DRAW
);

const positionAttributeLocation = gl_context.getAttribLocation(program, `pos`);
gl_context.enableVertexAttribArray(positionAttributeLocation);
gl_context.vertexAttribPointer(
    positionAttributeLocation,
    2, // size - 2D vector
    gl_context.FLOAT, // type
    false, //normalize
    0, // = size * sizeof(gl.FLOAT)
    0 // offset
);




function render() {
    gl_context.viewport(0, 0, gl_context.canvas.width, gl_context.canvas.height);

    gl_context.clearColor(0, 0, 0, 1);
    gl_context.clear(gl_context.COLOR_BUFFER_BIT);
    gl_context.useProgram(program);

    gl_context.drawArrays(
        gl_context.TRIANGLES, // primitive
        0, // offset
        3 // count
    );
}

requestAnimationFrame(render);
