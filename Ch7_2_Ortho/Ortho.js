var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_MVMatrix;\n' +
    'attribute vec3 a_Color;\n' +
    'varying vec3 v_Color;\n' +
    'void main(){\n' +
    'gl_Position = u_MVMatrix * a_Position;\n' +
    'v_Color = a_Color;\n' +
    '}\n';

var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec3 v_Color;\n' +
    'void main(){\n' +
    'gl_FragColor = vec4(v_Color,1.0);\n' +
    '}\n';

var g_near = 0.0, g_far = 0.6;
function main() {
    /**
     * @type {HTMLCanvasElement}
     */
    var canvas = document.getElementById("webgl");
    if (!canvas) {
        return;
    }

    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error("init shader failed");
        return;
    }

    var n = initVertexBuffer(gl);
    if (!n || n <= 0) {
        return;
    }

    var u_MVMatrix = gl.getUniformLocation(gl.program, "u_MVMatrix");
    if (u_MVMatrix == null) {
        console.error("can't find u_MVMatrix");
        return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    var matrix = new Matrix4();

    document.onkeydown = function (ev) {
        keydown(ev, gl, n, u_MVMatrix, matrix);
    };

    draw(gl, n, u_MVMatrix, matrix);
}

function draw(gl, n, u_MVMatrix, matrix) {
    matrix.setOrtho(-1, 1, -1, 1, g_near, g_far);
    gl.uniformMatrix4fv(u_MVMatrix, false, matrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

var offset = 0.1;
/**
 * 
 * @param {*} ev 
 * @param {WebGLRenderingContext} gl 
 * @param {*} n 
 * @param {*} u_MVMatrix 
 * @param {*} matrix 
 */
function keydown(ev, gl, n, u_MVMatrix, matrix) {
    if (ev.keyCode == 68) { // d
        g_near += offset;
    } else if (ev.keyCode == 65) {  // a
        g_near -= offset;
    } else if (ev.keyCode == 87) { // w
        g_far += offset;
    } else if (ev.keyCode == 83) {  // s
        g_far -= offset;
    } else {
        return;
    }
    draw(gl, n, u_MVMatrix, matrix);
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 */
function initVertexBuffer(gl) {
    var a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if (a_Position < 0) {
        console.error("can't find a_Position");
        return;
    }
    var a_Color = gl.getAttribLocation(gl.program, "a_Color");
    if (a_Color < 0) {
        console.error("can't find a_Color");
        return;
    }
    var vertices = new Float32Array([
        0.0, 0.5, -0.4, 0.0, 0.0, 1.0,
        -0.5, -0.5, -0.4, 0.0, 0.0, 1.0,
        0.5, -0.5, -0.4, 0.0, 0.0, 1.0,

        -0.5, 0.5, -0.2, 0.0, 1.0, 0.0,
        0.5, 0.5, -0.2, 0.0, 1.0, 0.0,
        0.0, -0.5, -0.2, 0.0, 1.0, 0.0,

        0.0, 0.5, 0.0, 1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 1.0, 0.0, 0.0,
        0.5, -0.5, 0.0, 1.0, 0.0, 0.0,
    ]);
    var n = 9;
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error("Failed to create the buffer object.");
        return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var FSIZE = vertices.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);
    return n;
}
