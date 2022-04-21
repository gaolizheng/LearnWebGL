var VSHADER_SOURCE = 
'attribute vec4 a_Position;\n'+
'attribute vec2 a_TexCoord;\n'+
'attribute vec4 a_Normal;\n'+
'attribute float a_Face;\n'+
'uniform mat4 u_MvpMatrix;\n'+
'uniform mat4 u_MMatrix;\n'+
'uniform mat4 u_NormalMatrix;\n'+
'varying vec2 v_TexCoord;\n'+
'varying vec3 v_Position;\n'+
'varying vec4 v_Normal;\n'+
'varying float v_Face;\n'+
'void main(){\n'+
'gl_Position = u_MvpMatrix * a_Position;\n'+
'v_TexCoord = a_TexCoord;\n'+
'v_Position = vec3(u_MMatrix * a_Position);\n'+
'v_Normal = normalize(u_NormalMatrix * a_Normal);\n'+
'}\n';

var FSHADER_SOURCE = 
'precision mediump float;\n'+
'uniform sampler2D u_Sampler;\n'+
'uniform vec3 u_LightPosition;\n'+
'uniform vec3 u_LightColor;\n'+
'uniform vec3 u_AmbientColor;\n'+
'uniform bool u_Clicked;\n'+
'varying vec3 v_Position;\n'+
'varying vec2 v_TexCoord;\n'+
'varying vec4 v_Normal;\n'+
'varying float v_Face;\n'+
'void main(){\n'+
'vec3 texColor = vec3(texture2D(u_Sampler, v_TexCoord));\n'+
'vec3 lightDir = normalize(u_LightPosition - v_Position);\n'+
'if (u_Clicked) {\n'+
'gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n'+
'} else {\n'+
'vec3 normal = normalize(vec3(v_Normal));\n'+
'vec3 diffuse = u_LightColor * texColor * max(dot(lightDir, normal), 0.0);\n'+
'vec3 ambient = u_AmbientColor * texColor;\n'+
'gl_FragColor = vec4(diffuse + ambient,1.0);\n'+
'}\n'+
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

    if (!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)) {
        console.error("init shader failed");
        return;
    }

    var n = initVertexBuffer(gl);
    if (!n||n<=0) {
        return;
    }

    var u_MvpMatrix = gl.getUniformLocation(gl.program,"u_MvpMatrix");
    if (u_MvpMatrix == null) {
        console.error("can't find u_MvpMatrix");
        return;
    }

    var u_MMatrix = gl.getUniformLocation(gl.program,"u_MMatrix");
    if (u_MMatrix == null) {
        console.error("can't find u_MMatrix");
        return;
    }

    var u_NormalMatrix = gl.getUniformLocation(gl.program,"u_NormalMatrix");
    if (u_NormalMatrix == null) {
        console.error("can't find u_NormalMatrix");
        return;
    }

    var u_Sampler = gl.getUniformLocation(gl.program,"u_Sampler");
    if (u_Sampler == null) {
        console.error("can't find u_Sampler");
        return;
    }

    var u_LightPosition = gl.getUniformLocation(gl.program,"u_LightPosition");
    if (u_LightPosition == null) {
        console.error("can't find u_LightPosition");
        return;
    }

    var u_LightColor = gl.getUniformLocation(gl.program,"u_LightColor");
    if (u_LightColor == null) {
        console.error("can't find u_LightColor");
        return;
    }

    var u_AmbientColor = gl.getUniformLocation(gl.program,"u_AmbientColor");
    if (u_AmbientColor == null) {
        console.error("can't find u_AmbientColor");
        return;
    }

    var u_Clicked = gl.getUniformLocation(gl.program,"u_Clicked");
    if (u_Clicked == null) {
        console.error("can't find u_Clicked");
        return;
    }
    
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.enable(gl.DEPTH_TEST);
    var vMatrix = new Matrix4();
    var pMatrix = new Matrix4();
    var vpMatrix = new Matrix4();
    vMatrix.setLookAt(0,0,7,0,0,0,0,1,0);
    pMatrix.setPerspective(30,1,1,100);
    vpMatrix.set(pMatrix).multiply(vMatrix);

    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    gl.uniform3f(u_LightPosition, 0.0, 0.0, 3.0);
    gl.uniform3f(u_AmbientColor, 0.2, 0.2, 0.2);
    gl.uniform1i(u_Clicked, 0);

    var texture = gl.createTexture();
    var image = new Image();
    image.onload = function () {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.uniform1f(u_Sampler, 0);
        startLoop(gl, n, u_MvpMatrix, vpMatrix, u_MMatrix, u_NormalMatrix);
        canvas.onmousedown = function (ev) {
            var x = ev.clientX, y = ev.clientY;
            var rect = ev.target.getBoundingClientRect();
            if ( x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom) {
                var x_in_canvas = x - rect.left, y_in_canvas = rect.bottom - y;
                var picked = check(x_in_canvas, y_in_canvas, gl, n, u_MvpMatrix, vpMatrix, u_MMatrix, u_NormalMatrix, u_Clicked);
                if (picked) {
                    alert("The cube was selected");
                }
            }
        }
    }
    image.crossOrigin = "anonymous"
    image.src = "http://static.yximgs.com/udata/pkg/DDZ/ddzicon_01.jpg";
}

var g_XAngle = 0.0;
var g_YAngle = 0.0;
var g_Step = 1;
function startLoop( gl, n, u_MvpMatrix, vpMatrix, u_MMatrix, u_NormalMatrix) {
    var tick = function () {
        g_XAngle += g_Step;
        g_YAngle += g_Step;
        draw(gl, n, u_MvpMatrix, vpMatrix, u_MMatrix, u_NormalMatrix);
        requestAnimationFrame(tick);
    }
    tick();
}

function check(x, y, gl, n, u_MvpMatrix, vpMatrix, u_MMatrix, u_NormalMatrix, u_Clicked) {
    var picked = false;
    gl.uniform1i(u_Clicked, 1);
    draw(gl, n, u_MvpMatrix, vpMatrix, u_MMatrix, u_NormalMatrix);
    var pixels = new Uint8Array(4);
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    if (pixels[0] == 255) {
        picked = true;
    }
    gl.uniform1i(u_Clicked, 0);
    draw(gl, n, u_MvpMatrix, vpMatrix, u_MMatrix, u_NormalMatrix);
    return picked;
}

function draw(gl, n, u_MvpMatrix, vpMatrix, u_MMatrix, u_NormalMatrix) {
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    var mMatrix = new Matrix4();
    var mvpMatrix = new Matrix4();
    mMatrix.setRotate(g_XAngle,1.0,0.0,0.0);
    mMatrix.rotate(g_YAngle,0.0,1.0,0.0);
    mMatrix.scale(0.5,0.5,0.5);
    gl.uniformMatrix4fv(u_MMatrix, false, mMatrix.elements);
    var normalMatrix = new Matrix4();
    normalMatrix.setInverseOf(mMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements)
    mvpMatrix.set(vpMatrix).multiply(mMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 */
function initVertexBuffer(gl) {
    var vertices = new Float32Array([
        1.0,1.0,1.0, -1.0,1.0,1.0, -1.0,-1.0,1.0, 1.0,-1.0,1.0, // 前 v0v1v2v3 0,1,2,3
        1.0,1.0,-1.0, 1.0,1.0,1.0, 1.0,-1.0,1.0, 1.0,-1.0,-1.0, // 右 v4v0v3v5 4,5,6,7
        1.0,1.0,-1.0, -1.0,1.0,-1.0, -1.0,1.0,1.0, 1.0,1.0,1.0, // 上 v4v6v1v0 8,9,10,11
        -1.0,1.0,1.0, -1.0,1.0,-1.0, -1.0,-1.0,-1.0, -1.0,-1.0,1.0, // 左 v1v6v7v2 12,13,14,15
        -1.0,1.0,-1.0, 1.0,1.0,-1.0, 1.0,-1.0,-1.0, -1.0,-1.0,-1.0, // 后 v6v4v5v7 16,17,18,19
        -1.0,-1.0,-1.0, 1.0,-1.0,-1.0, 1.0,-1.0,1.0, -1.0,-1.0,1.0,// 下 v7v5v3v2 20,21,22,23
    ]);
    var uvs = new Float32Array([
        1.0,1.0, 0.0,1.0, 0.0,0.0, 1.0,0.0,
        1.0,1.0, 0.0,1.0, 0.0,0.0, 1.0,0.0,
        1.0,1.0, 0.0,1.0, 0.0,0.0, 1.0,0.0,
        1.0,1.0, 0.0,1.0, 0.0,0.0, 1.0,0.0,
        1.0,1.0, 0.0,1.0, 0.0,0.0, 1.0,0.0,
        1.0,1.0, 0.0,1.0, 0.0,0.0, 1.0,0.0,
    ]);
    var faces = new Uint8Array([
        1, 1, 1, 1,
        2, 2, 2, 2,
        3, 3, 3, 3,
        4, 4, 4, 4,
        5, 5, 5, 5,
        6, 6, 6, 6
    ])
    var normals = new Float32Array([
        0.0,0.0,1.0, 0.0,0.0,1.0, 0.0,0.0,1.0, 0.0,0.0,1.0, // 前 v0v1v2v3 0,1,2,3
        1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0, // 右 v4v0v3v5 4,5,6,7
        0.0,1.0,0.0, 0.0,1.0,0.0, 0.0,1.0,0.0, 0.0,1.0,0.0, // 上 v4v6v1v0 8,9,10,11
        -1.0,0.0,0.0, -1.0,0.0,0.0, -1.0,0.0,0.0, -1.0,0.0,0.0, // 左 v1v6v7v2 12,13,14,15
        0.0,0.0,-1.0, 0.0,0.0,-1.0, 0.0,0.0,-1.0, 0.0,0.0,-1.0, // 后 v6v4v5v7 16,17,18,19
        0.0,-1.0,0.0, 0.0,-1.0,0.0, 0.0,-1.0,0.0, 0.0,-1.0,0.0, // 下 v7v5v3v2 20,21,22,23
    ]);
    var indices = new Uint8Array([
        0,1,2,0,2,3,//前
        4,5,6,4,6,7,//右
        8,9,10,8,10,11,//上
        12,13,14,12,14,15,//左
        16,17,18,16,18,19,//右
        20,21,22,20,22,23,//下
    ]);

    initArrayBuffers(gl, vertices, 3, gl.FLOAT, "a_Position");
    initArrayBuffers(gl, faces, 1, gl.UNSIGNED_BYTE, "a_Face");
    initArrayBuffers(gl, uvs, 2, gl.FLOAT, "a_TexCoord");
    initArrayBuffers(gl, normals, 3, gl.FLOAT, "a_Normal");

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);
    return indices.length;
}

function initArrayBuffers(gl, data, num, type, attribute) {
    var buffer = gl.createBuffer();
    if (!buffer) {
        console.error("Failed to create the buffer object.");
        return;
    }
    var attr = gl.getAttribLocation(gl.program, attribute);
    if (attr < 0) {
        console.error("can't find " + attribute);
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.vertexAttribPointer(attr, num, type, false, 0, 0);
    gl.enableVertexAttribArray(attr);
}
