var VSHADER_SOURCE = '' +
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_xformMatrix;\n' +
    'void main(){\n' +
    'gl_Position = u_xformMatrix*a_Position;\n' +
    '}\n';

var FSHADER_SOURCE = '' +
    'void main(){\n' +
    'gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n' +
    '}\n';

var ANGLE = 90;
function main() {
    var canvas = document.getElementById("webgl");
    var gl = canvas.getContext('webgl');
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("error on initShaders");
        return;
    }
    var n = initVertexBuffers(gl);
    var radian = Math.PI * ANGLE / 180.0;
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);
    // 按列主序
    // var xformMatrix = new Float32Array([ // 旋转矩阵
    //     cosB, sinB, 0.0, 0.0,
    //     -sinB, cosB, 0.0, 0.0,
    //     0.0, 0.0, 1.0, 0.0,
    //     0.0, 0.0, 0.0, 1.0
    // ]);
    // var xformMatrix = new Float32Array([ // 平移矩阵
    //     1.0, 0.0, 0.0, 0.0,
    //     0.0, 1.0, 0.0, 0.0,
    //     0.0, 0.0, 1.0, 0.0,
    //     0.5, 0.5, 0.0, 1.0
    // ]);
    // var xformMatrix = new Float32Array([ // 缩放矩阵
    //     0.5, 0.0, 0.0, 0.0,
    //     0.0, 0.5, 0.0, 0.0,
    //     0.0, 0.0, 1.0, 0.0,
    //     0.0, 0.0, 0.0, 1.0
    // ]);
    var xformMatrix = new Float32Array([ // 平移加旋转矩阵
        cosB, sinB, 0.0, 0.0,
        -sinB, cosB, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.5, 0.5, 0.0, 1.0
    ]);
    var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    var vertiecs = new Float32Array([0.0, 0.5, -0.5, 0.0, 0.5, 0.0]);
    var n = vertiecs.length / 2;
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertiecs, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    return n;
}