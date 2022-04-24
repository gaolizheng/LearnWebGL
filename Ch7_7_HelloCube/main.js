var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'attribute vec3 a_Color;\n' +
    'varying vec3 v_Color;\n' +
    'void main(){\n' +
    'gl_Position = u_MvpMatrix * a_Position;\n' +
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

    var u_MvpMatrix = gl.getUniformLocation(gl.program, "u_MvpMatrix");
    if (u_MvpMatrix == null) {
        console.error("can't find u_MvpMatrix");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var mMatrix = new Matrix4();
    var vMatrix = new Matrix4();
    var pMatrix = new Matrix4();
    var mvpMatrix = new Matrix4();

    mMatrix.setTranslate(0, 0, 0);
    vMatrix.setLookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    pMatrix.setPerspective(30, 1, 1, 100);
    mvpMatrix.set(pMatrix).multiply(vMatrix).multiply(mMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

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
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0,  // v0
        -1.0, 1.0, 1.0, 1.0, 0.0, 1.0,  // v1
        -1.0, -1.0, 1.0, 1.0, 0.0, 0.0,  // v2
        1.0, -1.0, 1.0, 1.0, 1.0, 0.0,  // v3
        1.0, -1.0, -1.0, 0.0, 1.0, 0.0,  // v4
        1.0, 1.0, -1.0, 0.0, 1.0, 1.0,  // v5
        -1.0, 1.0, -1.0, 0.0, 0.0, 1.0,  // v6
        -1.0, -1.0, -1.0, 0.0, 0.0, 0.0   // v7
    ]);
    var indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,//前
        5, 0, 3, 5, 3, 4,//右
        5, 6, 1, 5, 1, 0,//上
        1, 6, 7, 1, 7, 2,//左
        4, 7, 2, 4, 2, 3,//下
        5, 6, 7, 5, 7, 4,//后
    ]);
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error("Failed to create the vertex buffer object.");
        return;
    }
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        console.error("Failed to create the index buffer object.");
        return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var FSIZE = vertices.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    return indices.length;
}
