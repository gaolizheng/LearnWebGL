var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_MMatrix;\n' +
    'uniform mat4 u_VMatrix;\n' +
    'uniform mat4 u_PMatrix;\n' +
    'attribute vec3 a_Color;\n' +
    'varying vec3 v_Color;\n' +
    'void main(){\n' +
    'gl_Position = u_PMatrix * u_VMatrix * u_MMatrix * a_Position;\n' +
    'v_Color = a_Color;\n' +
    '}\n';

var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec3 v_Color;\n' +
    'void main(){\n' +
    'gl_FragColor = vec4(v_Color,1.0);\n' +
    '}\n';

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

    var u_MMatrix = gl.getUniformLocation(gl.program, "u_MMatrix");
    if (u_MMatrix == null) {
        console.error("can't find u_MMatrix");
        return;
    }

    var u_VMatrix = gl.getUniformLocation(gl.program, "u_VMatrix");
    if (u_VMatrix == null) {
        console.error("can't find u_VMatrix");
        return;
    }

    var u_PMatrix = gl.getUniformLocation(gl.program, "u_PMatrix");
    if (u_PMatrix == null) {
        console.error("can't find u_PMatrix");
        return;
    }

    var pMatrix = new Matrix4();
    pMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
    gl.uniformMatrix4fv(u_PMatrix, false, pMatrix.elements);

    var vMatrix = new Matrix4();
    vMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
    gl.uniformMatrix4fv(u_VMatrix, false, vMatrix.elements);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var mMatrix = new Matrix4();
    mMatrix.setTranslate(-0.5, 0, 0);
    gl.uniformMatrix4fv(u_MMatrix, false, mMatrix.elements);

    gl.drawArrays(gl.TRIANGLES, 0, n);

    mMatrix.setTranslate(0.5, 0, 0);
    gl.uniformMatrix4fv(u_MMatrix, false, mMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, n);
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
        0.0, 0.5, -4, 0.4, 1.0, 0.4,
        -0.25, -0.5, -4, 0.4, 1.0, 0.4,
        0.25, -0.5, -4, 1.0, 0.4, 0.4,

        0.0, 0.5, -2, 1.0, 0.4, 0.4,
        -0.25, -0.5, -2, 1.0, 1.0, 0.4,
        0.25, -0.5, -2, 1.0, 1.0, 0.4,

        0.0, 0.5, 0.0, 0.4, 0.4, 1.0,
        -0.25, -0.5, 0.0, 0.4, 0.4, 1.0,
        0.25, -0.5, 0.0, 1.0, 0.4, 0.4,
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
