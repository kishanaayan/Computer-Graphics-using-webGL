const vertex_shader_source = `
attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 matrix;

varying vec4 color;

void main() {
  gl_Position = matrix * a_position;

  color = a_color;
}
`;

const fragment_shader_source = `
precision mediump float;

varying vec4 color;

void main() {
    gl_FragColor = color;
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

function matrixMultiply(matrix2, matrix1) {
    // matrix1 * matrix2
    return new Array(matrix1.length).fill(0).map(
        (row, r) => new Array(matrix2[0].length).fill(0).map(
            (_, c) => matrix1[r].reduce((sum, val, k) => sum + (val * matrix2[k][c]), 0)
        )
    )
}

// window.addEventListener(`DOMContentLoaded`, () => {
const gl_canvas = document.querySelector(`#webgl-canvas`);

const translate_x = document.querySelector(`#translate-x`);
const translate_y = document.querySelector(`#translate-y`);
const translate_z = document.querySelector(`#translate-z`);

const rotate_x = document.querySelector(`#rotate-x`);
const rotate_y = document.querySelector(`#rotate-y`);
const rotate_z = document.querySelector(`#rotate-z`);

const perspective = document.querySelector(`#perspective`);
const p = document.querySelector(`#p`);

const gl_context = gl_canvas.getContext(`webgl`);
gl_context.enable(gl_context.DEPTH_TEST);
// gl_context.enable(gl_context.CULL_FACE);

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

// const positions = [
//     0, 0, 0.9,
//     0.5, 0, 0.9,
//     0, 0.5, 0.9,
    
//     -0.5, -0.5, -0.9,
//     0, -0.5, -0.9,
//     -0.5, 0, -0.9,
// ];

const positions = [
    0.5, 0.5, 0.5,
    0.5, -0.5, 0.5,
    -0.5, -0.5, 0.5,
    -0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    -0.5, -0.5, 0.5,

    0.5, -0.5, -0.5,
    0.5, 0.5, -0.5,
    -0.5, -0.5, -0.5,
    0.5, 0.5, -0.5,
    -0.5, 0.5, -0.5,
    -0.5, -0.5, -0.5,

    0.5, 0.5, 0.5,
    0.5, 0.5, -0.5,
    0.5, -0.5, 0.5,
    0.5, -0.5, -0.5,
    0.5, -0.5, 0.5,
    0.5, 0.5, -0.5,

    -0.5, 0.5, -0.5,
    -0.5, 0.5, 0.5,
    -0.5, -0.5, 0.5,
    -0.5, -0.5, 0.5,
    -0.5, -0.5, -0.5,
    -0.5, 0.5, -0.5,

    0.5, 0.5, -0.5,
    0.5, 0.5, 0.5,
    -0.5, 0.5, -0.5,
    -0.5, 0.5, -0.5,
    0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5,

    0.5, -0.5, -0.5,
    -0.5, -0.5, -0.5,
    0.5, -0.5, 0.5,
    0.5, -0.5, 0.5,
    -0.5, -0.5, -0.5,
    -0.5, -0.5, 0.5,
];

gl_context.bufferData(
    gl_context.ARRAY_BUFFER,
    new Float32Array(positions),
    gl_context.STATIC_DRAW
);
gl_context.enableVertexAttribArray(positionAttributeLocation);
// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
const size = 3; // 3 components per iteration
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
    1, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1,

    0, 1, 0, 1,
    0, 1, 0, 1,
    0, 1, 0, 1,
    0, 1, 0, 1,
    0, 1, 0, 1,
    0, 1, 0, 1,
    
    1, 1, 0, 1,
    1, 1, 0, 1,
    1, 1, 0, 1,
    1, 1, 0, 1,
    1, 1, 0, 1,
    1, 1, 0, 1,

    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,

    0, 1, 1, 1,
    0, 1, 1, 1,
    0, 1, 1, 1,
    0, 1, 1, 1,
    0, 1, 1, 1,
    0, 1, 1, 1,

    1, 0, 1, 1,
    1, 0, 1, 1,
    1, 0, 1, 1,
    1, 0, 1, 1,
    1, 0, 1, 1,
    1, 0, 1, 1,
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
    gl_context.clear(gl_context.COLOR_BUFFER_BIT | gl_context.DEPTH_BUFFER_BIT);
    gl_context.useProgram(program);

    const translation_matrix = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [Number(translate_x.value), Number(translate_y.value), Number(translate_z.value), 1,],
    ]

    const rotate_x_value = Number(rotate_x.value);
    const rotate_y_value = Number(rotate_y.value);
    const rotate_z_value = Number(rotate_z.value);

    const rotation_x_matrix = [
        [1, 0, 0, 0],
        [0, Math.cos(2 * Math.PI * rotate_x_value), -Math.sin(2 * Math.PI * rotate_x_value), 0],
        [0, Math.sin(2 * Math.PI * rotate_x_value), Math.cos(2 * Math.PI * rotate_x_value), 0],
        [0, 0, 0, 1,],
    ]

    const rotation_y_matrix = [
        [Math.cos(2 * Math.PI * rotate_y_value), 0, -Math.sin(2 * Math.PI * rotate_y_value), 0],
        [0, 1, 0, 0],
        [Math.sin(2 * Math.PI * rotate_y_value), 0, Math.cos(2 * Math.PI * rotate_y_value), 0],
        [0, 0, 0, 1,],
    ]

    const rotation_z_matrix = [
        [Math.cos(2 * Math.PI * rotate_z_value), -Math.sin(2 * Math.PI * rotate_z_value), 0, 0],
        [Math.sin(2 * Math.PI * rotate_z_value), Math.cos(2 * Math.PI * rotate_z_value), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1,],
    ];

    const f = Number(p.value);
    const perspective_projection = [
        [(f+1)/1.5, 0, 0, 0],
        [0, (f+1)/1.5, 0, 0],
        [0, 0, 1, f],
        [0, 0, f, 1]
    ];

    const totalRotation = matrixMultiply(matrixMultiply(rotation_x_matrix, rotation_y_matrix), rotation_z_matrix);

    let result = matrixMultiply(translation_matrix, totalRotation);
    if (perspective.checked) {
        result = matrixMultiply(perspective_projection, result);
    }

    document.querySelector(`#translate-matrix`).innerHTML = translation_matrix.map((row) => row.map((val) => `<div class="box">${val.toFixed(2)}</div>`).join('')).map((s) => `<div class="row">${s}</div>`).join('');
    document.querySelector(`#rotate-matrix`).innerHTML = totalRotation.map((row) => row.map((val) => `<div class="box">${val.toFixed(2)}</div>`).join('')).map((s) => `<div class="row">${s}</div>`).join('');
    document.querySelector(`#projection-matrix`).innerHTML = perspective_projection.map((row) => row.map((val) => `<div class="box">${val.toFixed(2)}</div>`).join('')).map((s) => `<div class="row">${s}</div>`).join('');
    document.querySelector(`#result-matrix`).innerHTML = result.map((row) => row.map((val) => `<div class="box">${val.toFixed(2)}</div>`).join('')).map((s) => `<div class="row">${s}</div>`).join('');

    gl_context.uniformMatrix4fv(matrixUniformLocation, false, [].concat(...result));

    // gl_context.uniform4f(colorUniformLocation, 1, 0, 0, 1);

    const primitiveType = gl_context.TRIANGLES;
    const offset = 0;
    const count = positions.length / 3;
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

translate_x.addEventListener(`input`, animate);
translate_y.addEventListener(`input`, animate);
translate_z.addEventListener(`input`, animate);

rotate_x.addEventListener(`input`, animate);
rotate_y.addEventListener(`input`, animate);
rotate_z.addEventListener(`input`, animate);

perspective.addEventListener(`input`, animate);
p.addEventListener(`input`, animate);

// });
