const vertex_shader_source = `
// an attribute will receive data from a buffer
attribute vec2 a_position;
attribute vec4 a_color;

uniform mat3 matrix;

varying vec4 c;

// all shaders have a main function
void main() {
  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = vec4(matrix * vec3(a_position, 1), 1);

  c = a_color;
}
`;

const fragment_shader_source = `
// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;

varying vec4 c;

void main() {
  // gl_FragColor is a special variable a fragment shader
  // is responsible for setting
//   gl_FragColor = color;
    gl_FragColor = c;
}
`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function matrixMultiply(matrix1, matrix2) {
    return new Array(matrix1.length).fill(0).map(row => new Array(matrix2[0].length).fill(0)).map((row, i) => {
        return row.map((_, j) => {
            return matrix2[i].reduce((sum, val, k) => sum + (val * matrix1[k][j]), 0)
        })
    })
}

// window.addEventListener(`DOMContentLoaded`, () => {
const gl_canvas = document.querySelector(`#webgl-canvas`);

const translate_x = document.querySelector(`#translate-x`);
const translate_y = document.querySelector(`#translate-y`);

const rotate = document.querySelector(`#rotate`);

const gl_context = gl_canvas.getContext(`webgl`);

const vertex_shader = createShader(
    gl_context,
    gl_context.VERTEX_SHADER,
    vertex_shader_source
);
const fragment_shader = createShader(
    gl_context,
    gl_context.FRAGMENT_SHADER,
    fragment_shader_source
);

const program = createProgram(gl_context, vertex_shader, fragment_shader);

gl_context.useProgram(program);

const positionAttributeLocation = gl_context.getAttribLocation(
    program,
    `a_position`
);
const positionBuffer = gl_context.createBuffer();
gl_context.bindBuffer(gl_context.ARRAY_BUFFER, positionBuffer);

// 6 2d points
const positions = [
    -0.4, -0.3,
    -0.4, 0.3, 
    0.4, -0.3, 
    -0.4, 0.3, 
    0.4, -0.3, 
    0.4, 0.3
];

gl_context.bufferData(
    gl_context.ARRAY_BUFFER,
    new Float32Array(positions),
    gl_context.STATIC_DRAW
);
gl_context.enableVertexAttribArray(positionAttributeLocation);
// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
const size = 2; // 2 components per iteration
const type = gl_context.FLOAT; // the data is 32bit floats
const normalize = false; // don't normalize the data
const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
const offset = 0; // start at the beginning of the buffer
gl_context.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
);

const colorAttributeLocation = gl_context.getAttribLocation(program, `a_color`);
const colorBuffer = gl_context.createBuffer();
gl_context.bindBuffer(gl_context.ARRAY_BUFFER, colorBuffer);

const colors = [
    0, 0, 1, 1,
    1, 1, 1, 1,
    0, 0, 1, 1,
    1, 1, 1, 1,
    0, 0, 1, 1,
    1, 1, 1, 1,
]

gl_context.bufferData(
    gl_context.ARRAY_BUFFER,
    new Float32Array(colors),
    gl_context.STATIC_DRAW
);

gl_context.enableVertexAttribArray(colorAttributeLocation);

gl_context.vertexAttribPointer(
    colorAttributeLocation,
    4,
    gl_context.FLOAT,
    false,
    0,
    0
);

const matrixUniformLocation = gl_context.getUniformLocation(program, `matrix`);

function render() {
    gl_context.viewport(
        0,
        0,
        gl_context.canvas.width,
        gl_context.canvas.height
    );

    gl_context.clearColor(0, 0, 0, 1);
    gl_context.clear(gl_context.COLOR_BUFFER_BIT);
    gl_context.useProgram(program);

    const translation_matrix = [
        [1, 0, 0,],
        [0, 1, 0,],
        [Number(translate_x.value), Number(translate_y.value), 1,]
    ]

    const rotate_value = Number(rotate.value);

    const rotation_matrix = [
        [Math.cos(2 * Math.PI * rotate_value), -Math.sin(2 * Math.PI * rotate_value), 0,],
        [Math.sin(2 * Math.PI * rotate_value), Math.cos(2 * Math.PI * rotate_value), 0,],
        [0, 0, 1,]
    ]

    const result = matrixMultiply(translation_matrix, rotation_matrix);

    document.querySelector(`#translate-matrix`).innerHTML = translation_matrix.map((row) => row.map((val) => `<div class="box">${val.toFixed(2)}</div>`).join('')).map((s) => `<div class="row">${s}</div>`).join('');
    document.querySelector(`#rotate-matrix`).innerHTML = rotation_matrix.map((row) => row.map((val) => `<div class="box">${val.toFixed(2)}</div>`).join('')).map((s) => `<div class="row">${s}</div>`).join('');
    document.querySelector(`#result-matrix`).innerHTML = result.map((row) => row.map((val) => `<div class="box">${val.toFixed(2)}</div>`).join('')).map((s) => `<div class="row">${s}</div>`).join('');

    gl_context.uniformMatrix3fv(matrixUniformLocation, false, [].concat(...result));

    // gl_context.uniform4f(colorUniformLocation, 1, 0, 0, 1);

    const primitiveType = gl_context.TRIANGLES;
    const offset = 0;
    const count = 6;
    gl_context.drawArrays(primitiveType, offset, count);

    // gl_context.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
    // gl_context.drawArrays(primitiveType, 3, count);

    // requestAnimationFrame(render);
}

// requestAnimationFrame(render);

let handle = 0;
function animate() {
    cancelAnimationFrame(handle);
    handle = requestAnimationFrame(render);
}
animate();

translate_x.addEventListener(`input`, animate)
translate_y.addEventListener(`input`, animate)
rotate.addEventListener(`input`, animate)

// });
