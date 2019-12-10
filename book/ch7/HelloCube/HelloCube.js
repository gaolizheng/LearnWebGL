var VSHADER_SOURCE = '' +
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main(){\n' +
    'gl_Position = u_MvpMatrix * a_Position;\n' +
    'v_Color = a_Color;\n' +
    '}\n';

var FSHADER_SOURCE = '' +
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'varying vec4 v_Color;\n' +
    'void main(){\n' +
    'gl_FragColor = v_Color;\n' +
    '}\n';


function main() {
    var canvas = document.getElementById("webgl");
    var gl = canvas.getContext("webgl");
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("error on init shader");
        return;
    }
    var n = initVertexBuffers(gl);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    var mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(30, 1, 1, 100);
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, // v0 白色
        -1.0, 1.0, 1.0, 1.0, 0.0, 1.0, // v1 品红色
        -1.0, -1.0, 1.0, 1.0, 0.0, 0.0, // v2 红色
        1.0, -1.0, 1.0, 1.0, 1.0, 0.0, // v3
        1.0, -1.0, -1.0, 0.0, 1.0, 0.0, // v4
        1.0, 1.0, -1.0, 0.0, 1.0, 1.0, // v5
        -1.0, 1.0, -1.0, 0.0, 0.0, 1.0, // v6
        -1.0, -1.0, -1.0, 0.0, 0.0, 0.0, // v7
    ]);
    var indices = new Uint8Array([
        0, 1, 2, 0, 2, 3, // 前
        0, 3, 4, 0, 4, 5, // 右
        0, 5, 6, 0, 6, 1, // 上
        1, 6, 7, 1, 7, 2, // 左
        7, 4, 3, 7, 3, 2, // 下
        4, 7, 6, 4, 6, 5, // 后
    ]);

    var vertexColorBuffer = gl.createBuffer();
    var indexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length
}