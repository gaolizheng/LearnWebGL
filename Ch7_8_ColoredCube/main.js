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
    var vertices = new Float32Array([
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, //front面 v0-4
        1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, //right v0345
        1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, //up v0561
        -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, //left 
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, //down
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0 //back
    ]);
    var colors = new Float32Array([
        0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, //front
        0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, //right
        1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, //up
        1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, //left
        1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, //btm
        0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0 //back
    ]);
    var indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23
    ]);

    initArrayBuffers(gl, vertices, 3, gl.FLOAT, "a_Position");
    initArrayBuffers(gl, colors, 3, gl.FLOAT, "a_Color");


    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        console.error("Failed to create the index buffer object.");
        return;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {*} data 
 * @param {*} num 
 * @param {*} type 
 * @param {*} attribute 
 */
function initArrayBuffers(gl, data, num, type, attribute) {
    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    if (a_attribute < 0) {
        console.error("can't find " + attribute);
        return false;
    }
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.error("Failed to create the array buffer object.");
        return false;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
}
