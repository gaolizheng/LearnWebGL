var Plane_VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main(){\n' +
    'gl_Position = u_MvpMatrix * a_Position;\n' +
    'v_TexCoord = a_TexCoord;\n' +
    '}\n';

var Plane_FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform sampler2D u_Sampler;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main(){\n' +
    'gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
    '}\n';

var Cube_VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'uniform mat4 u_MMatrix;\n' +
    'uniform mat4 u_NormalMatrix;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'attribute vec4 a_Normal;\n' +
    'varying vec2 v_TexCoord;\n' +
    'varying vec3 v_Position;\n' +
    'varying vec4 v_Normal;\n' +
    'void main(){\n' +
    'gl_Position = u_MvpMatrix * a_Position;\n' +
    'v_TexCoord = a_TexCoord;\n' +
    'v_Position = vec3(u_MMatrix * a_Position);\n' +
    'v_Normal = normalize(u_NormalMatrix * a_Normal);\n' +
    '}\n';

var Cube_FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform sampler2D u_Sampler;\n' +
    'uniform vec3 u_LightPosition;\n' +
    'uniform vec3 u_LightColor;\n' +
    'uniform vec3 u_AmbientColor;\n' +
    'varying vec3 v_Position;\n' +
    'varying vec2 v_TexCoord;\n' +
    'varying vec4 v_Normal;\n' +
    'void main(){\n' +
    'vec3 texColor = vec3(texture2D(u_Sampler, v_TexCoord));\n' +
    'vec3 lightDir = normalize(u_LightPosition - v_Position);\n' +
    'vec3 normal = normalize(vec3(v_Normal));\n' +
    'vec3 diffuse = u_LightColor * texColor * max(dot(lightDir, normal), 0.0);\n' +
    'vec3 ambient = u_AmbientColor * texColor;\n' +
    'gl_FragColor = vec4(diffuse + ambient,1.0);\n' +
    '}\n';

var g_XAngle = 0.0;
var g_YAngle = 0.0;
var g_Step = 1;
var OFFSCREEN_WIDTH = 256;
var OFFSCREEN_HEIGHT = 256;
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
    var planeProgram = createProgram(gl, Plane_VSHADER_SOURCE, Plane_FSHADER_SOURCE);
    var cubeProgram = createProgram(gl, Cube_VSHADER_SOURCE, Cube_FSHADER_SOURCE);


    planeProgram.a_Position = gl.getAttribLocation(planeProgram, "a_Position");
    planeProgram.a_TexCoord = gl.getAttribLocation(planeProgram, "a_TexCoord");
    planeProgram.u_Sampler = gl.getUniformLocation(planeProgram, "u_Sampler");

    cubeProgram.a_Position = gl.getAttribLocation(cubeProgram, "a_Position");
    cubeProgram.a_Normal = gl.getAttribLocation(cubeProgram, "a_Normal");
    cubeProgram.a_TexCoord = gl.getAttribLocation(cubeProgram, "a_TexCoord");
    cubeProgram.u_MvpMatrix = gl.getUniformLocation(cubeProgram, "u_MvpMatrix");
    cubeProgram.u_MMatrix = gl.getUniformLocation(cubeProgram, "u_MMatrix");
    cubeProgram.u_NormalMatrix = gl.getUniformLocation(cubeProgram, "u_NormalMatrix");
    cubeProgram.u_LightPosition = gl.getUniformLocation(cubeProgram, "u_LightPosition");
    cubeProgram.u_LightColor = gl.getUniformLocation(cubeProgram, "u_LightColor");
    cubeProgram.u_AmbientColor = gl.getUniformLocation(cubeProgram, "u_AmbientColor");
    cubeProgram.u_Sampler = gl.getUniformLocation(cubeProgram, "u_Sampler");

    var plane = initPlaneBuffer(gl);
    var texCube = initTexBuffer(gl);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    var vMatrix = new Matrix4();
    var pMatrix = new Matrix4();
    var vpMatrix = new Matrix4();
    vMatrix.setLookAt(0, 0, 30, 0, 0, 0, 0, 1, 0);
    pMatrix.setPerspective(30, 1, 1, 100);
    vpMatrix.set(pMatrix).multiply(vMatrix);

    var planeVPMatrix = new Matrix4();
    planeVPMatrix.setPerspective(30, OFFSCREEN_WIDTH / OFFSCREEN_HEIGHT, 1, 100);
    planeVPMatrix.lookAt(0.0, 2.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    var cubeVPMatrix = new Matrix4();
    cubeVPMatrix.setPerspective(30, OFFSCREEN_WIDTH / OFFSCREEN_HEIGHT, 1, 100);
    cubeVPMatrix.lookAt(0.0, 2.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

    var texture = initTextures(gl, cubeProgram);
    var tick = function () {
        g_XAngle += g_Step;
        g_YAngle += g_Step;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        drawplane(gl, planeProgram, plane, vpMatrix);
        drawTexCube(gl, cubeProgram, texCube, texture, vpMatrix);
        requestAnimationFrame(tick);
    }
    tick();
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {*} planeProgram 
 * @param {*} plane 
 * @param {*} vpMatrix 
 */
function drawplane(gl, program, cube, vpMatrix) {
    gl.useProgram(program);
    initAttributeVariable(gl, program.a_Position, cube.vertexBuffer);
    initAttributeVariable(gl, program.a_Normal, cube.normalBuffer);
    initAttributeVariable(gl, program.a_Color, cube.colorBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indexBuffer);
    drawCube(gl, program, cube, vpMatrix, -4.0);
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {*} cubeProgram 
 * @param {*} texCube 
 * @param {*} vpMatrix 
 */
function drawTexCube(gl, program, cube, texture, vpMatrix) {
    gl.useProgram(program);
    initAttributeVariable(gl, program.a_Position, cube.vertexBuffer);
    initAttributeVariable(gl, program.a_Normal, cube.normalBuffer);
    initAttributeVariable(gl, program.a_TexCoord, cube.uvBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cube.indexBuffer);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    drawCube(gl, program, cube, vpMatrix, 4.0);
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {*} program 
 * @param {*} cube 
 * @param {*} vpMatrix 
 */
function drawCube(gl, program, cube, vpMatrix, x) {
    var mMatrix = new Matrix4();
    var mvpMatrix = new Matrix4();
    mMatrix.setTranslate(x, 0, 0);
    mMatrix.rotate(g_XAngle, 1.0, 0.0, 0.0);
    mMatrix.rotate(g_YAngle, 0.0, 1.0, 0.0);

    gl.uniformMatrix4fv(program.u_MMatrix, false, mMatrix.elements);
    var normalMatrix = new Matrix4();
    normalMatrix.setInverseOf(mMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(program.u_NormalMatrix, false, normalMatrix.elements)
    mvpMatrix.set(vpMatrix).multiply(mMatrix);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, mvpMatrix.elements);

    gl.uniform3f(program.u_AmbientColor, 0.2, 0.2, 0.2);
    gl.uniform3f(program.u_LightPosition, 0.0, 0.0, 3.0);
    gl.uniform3f(program.u_LightColor, 1.0, 1.0, 1.0);

    gl.drawElements(gl.TRIANGLES, cube.numIndices, gl.UNSIGNED_BYTE, 0);
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {*} attr 
 * @param {*} buffer 
 */
function initAttributeVariable(gl, attr, buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(attr, buffer.num, buffer.type, false, 0, 0);
    gl.enableVertexAttribArray(attr);
}

function initPlaneBuffer(gl) {
    var vertices = new Float32Array([
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,
    ]);
    var indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,
    ]);
    var o = new Object();
    o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
    o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
    o.numIndices = indices.length;
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return o;
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 */
function initTexBuffer(gl) {
    var vertices = new Float32Array([
        1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, // 前 v0v1v2v3 0,1,2,3
        1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, // 右 v4v0v3v5 4,5,6,7
        1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, // 上 v4v6v1v0 8,9,10,11
        -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, // 左 v1v6v7v2 12,13,14,15
        -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, // 后 v6v4v5v7 16,17,18,19
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,// 下 v7v5v3v2 20,21,22,23
    ]);
    var uvs = new Float32Array([
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    ])
    var normals = new Float32Array([
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, // 前 v0v1v2v3 0,1,2,3
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, // 右 v4v0v3v5 4,5,6,7
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, // 上 v4v6v1v0 8,9,10,11
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // 左 v1v6v7v2 12,13,14,15
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, // 后 v6v4v5v7 16,17,18,19
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, // 下 v7v5v3v2 20,21,22,23
    ]);
    var indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,//前
        4, 5, 6, 4, 6, 7,//右
        8, 9, 10, 8, 10, 11,//上
        12, 13, 14, 12, 14, 15,//左
        16, 17, 18, 16, 18, 19,//右
        20, 21, 22, 20, 22, 23,//下
    ]);
    var o = new Object();
    o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
    o.uvBuffer = initArrayBufferForLaterUse(gl, uvs, 2, gl.FLOAT);
    o.normalBuffer = initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT);
    o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);

    o.numIndices = indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return o;
}

function initArrayBufferForLaterUse(gl, data, num, type) {
    var buffer = gl.createBuffer();

    if (!buffer) {
        console.error("Failed to create the buffer object.");
        return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    buffer.num = num;
    buffer.type = type;
    return buffer;
}

function initElementArrayBufferForLaterUse(gl, data, type) {
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return null;
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

    buffer.type = type;

    return buffer;
}

function initTextures(gl, program) {
    var texture = gl.createTexture();
    var image = new Image();
    image.onload = function () {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.uniform1i(program.u_Sampler, 0);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    image.crossOrigin = "anonymous"
    image.src = "http://static.yximgs.com/udata/pkg/DDZ/ddzicon_01.jpg";
    return texture;
}
