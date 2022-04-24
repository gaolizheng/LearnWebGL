var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'uniform mat4 u_NormalMatrix;\n' +
    'attribute vec4 a_Color;\n' +
    'attribute vec4 a_Normal;\n' +
    'uniform vec3 u_LightColor;\n' +
    'uniform vec3 u_LightDirection;\n' +
    'uniform vec3 u_AmbientLight;\n' +
    'varying vec4 v_Color;\n' +
    'void main(){\n' +
    'gl_Position = u_MvpMatrix * a_Position;\n' +
    'vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);\n' +
    'float nDotL = max(dot(u_LightDirection, normal), 0.0);\n' +
    'vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;\n' +
    'vec3 ambient = u_AmbientLight * a_Color.rgb;\n' +
    'v_Color = vec4(diffuse + ambient, a_Color.a);\n' +
    '}\n';

var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main(){\n' +
    'gl_FragColor = v_Color;\n' +
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

    var u_LightColor = gl.getUniformLocation(gl.program, "u_LightColor");
    if (u_LightColor == null) {
        console.error("can't find u_LightColor");
        return;
    }

    var u_LightDirection = gl.getUniformLocation(gl.program, "u_LightDirection");
    if (u_LightDirection == null) {
        console.error("can't find u_LightDirection");
        return;
    }

    var u_AmbientLight = gl.getUniformLocation(gl.program, "u_AmbientLight");
    if (u_AmbientLight == null) {
        console.error("can't find u_AmbientLight");
        return;
    }
    var u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");
    if (u_NormalMatrix == null) {
        console.error("can't find u_NormalMatrix");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.uniform3f(u_LightColor, 1.0, 0.4, 0.0);
    gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
    var lightDirection = new Vector3([0.0, 0.0, 1.0]);
    lightDirection.normalize();
    gl.uniform3fv(u_LightDirection, lightDirection.elements);
    var vMatrix = new Matrix4();
    vMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 100.0);
    vMatrix.lookAt(0.0, 0.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
    document.onkeydown = function (ev) {
        keydown(ev, gl, n, u_MvpMatrix, vMatrix, u_NormalMatrix);
    };
    draw(gl, n, u_MvpMatrix, vMatrix, u_NormalMatrix);
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 */
function initVertexBuffer(gl) {
    var vertices = new Float32Array([
        1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5, 0.0, 1.5, 1.5, 0.0, 1.5, //front
        1.5, 10.0, -1.5, 1.5, 10.0, 1.5, 1.5, 0.0, 1.5, 1.5, 0.0, -1.5, //right
        1.5, 10.0, -1.5, -1.5, 10.0, -1.5, -1.5, 10.0, 1.5, 1.5, 10.0, 1.5, //up
        -1.5, 10.0, 1.5, -1.5, 10.0, -1.5, -1.5, 0.0, -1.5, -1.5, 0.0, 1.5, //left 
        -1.5, 0.0, -1.5, 1.5, 0.0, -1.5, 1.5, 0.0, 1.5, -1.5, 0.0, 1.5, //down
        -1.5, 10.0, -1.5, 1.5, 10.0, -1.5, 1.5, 0.0, -1.5, -1.5, 0.0, -1.5 //back
    ]);
    var colors = new Float32Array([
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
    ]);
    var normals = new Float32Array([
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0
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
    initArrayBuffers(gl, normals, 3, gl.FLOAT, "a_Normal");


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


var ANGLE_STEP = 3.0;
var g_arm1Angle = -90.0;
var g_joint1Angle = 0.0;
/**
 * 
 * @param {*} ev 
 * @param {*} gl 
 * @param {*} n 
 */
function keydown(ev, gl, n, u_MvpMatrix, vMatrix, u_NormalMatrix) {
    switch (ev.keyCode) {
        case 38: // Up
            if (g_joint1Angle < 135.0) g_joint1Angle += ANGLE_STEP;
            break;
        case 40: // Down
            if (g_joint1Angle > -135.0) g_joint1Angle -= ANGLE_STEP;
            break;
        case 39: // Right
            g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
            break;
        case 37: // Left
            g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360;
            break;
        default: return;
    }
    draw(gl, n, u_MvpMatrix, vMatrix, u_NormalMatrix);
}

var g_modelMatrix = new Matrix4(), g_mvpMatrix = new Matrix4();
/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {*} n 
 * @param {*} u_MvpMatrix 
 * @param {*} mvpMatrix 
 */
function draw(gl, n, u_MvpMatrix, vMatrix, u_NormalMatrix) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //arm1
    var arm1Length = 10.0;
    g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
    g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);
    drawBox(gl, n, u_MvpMatrix, vMatrix, u_NormalMatrix);

    //arm2
    g_modelMatrix.translate(0.0, arm1Length, 0.0);
    g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0);
    g_modelMatrix.scale(1.3, 1.0, 1.3);
    drawBox(gl, n, u_MvpMatrix, vMatrix, u_NormalMatrix);
}

var g_normalMatrix = new Matrix4();
/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {*} n 
 * @param {*} height 
 * @param {*} u_MvpMatrix 
 * @param {*} mvpMatrix 
 */
function drawBox(gl, n, u_MvpMatrix, vMatrix, u_NormalMatrix, nMatrix) {
    g_mvpMatrix.set(vMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}
