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

var eyeX = 0.2, eyeY = 0.25, eyeZ = 0.25;
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

    var matrix = new Matrix4();

    document.onkeydown = function (ev) {
        keydown(ev, gl, n, u_MVMatrix, matrix);
    };

    draw(gl, n, u_MVMatrix, matrix);
}

function draw(gl, n, u_MVMatrix, matrix) {
    matrix.setLookAt(eyeX, eyeY, eyeZ, 0, 0, 0, 0, 1, 0).rotate(0, 0, 0, 1);
    gl.uniformMatrix4fv(u_MVMatrix, false, matrix.elements);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

/**
 * 
 * @param {*} ev 
 * @param {WebGLRenderingContext} gl 
 * @param {*} n 
 * @param {*} u_MVMatrix 
 * @param {*} matrix 
 */
function keydown(ev, gl, n, u_MVMatrix, matrix) {
    if (ev.keyCode == 68) {
        eyeX += 0.01;
    } else if (ev.keyCode == 65) {
        eyeX -= 0.01;
    } else if (ev.keyCode == 87) {
        eyeY += 0.01;
    } else if (ev.keyCode == 83) {
        eyeY -= 0.01;
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
        0.0, 0.5, -0.4, 0.4, 1.0, 0.4,
        -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
        0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

        0.0, 0.5, -0.2, 1.0, 0.4, 0.4,
        -0.5, -0.5, -0.2, 1.0, 1.0, 0.4,
        0.5, -0.5, -0.2, 1.0, 1.0, 0.4,

        0.0, 0.5, 0.0, 0.4, 0.4, 1.0,
        -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
        0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
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
