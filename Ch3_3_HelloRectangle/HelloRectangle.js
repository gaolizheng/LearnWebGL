var VSHADER_SOURCE = 
'attribute vec4 a_Position;\n'+
'void main(){\n'+
'gl_Position = a_Position;\n'+
'gl_PointSize = 10.0;\n'+
'}\n';

var FSHADER_SOURCE = 
'precision mediump float;\n'+
'void main(){\n'+
'gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n'+
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
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.drawArrays(gl.TRIANGLE_STRIP,0,n);
    gl.drawArrays(gl.TRIANGLES,0,n);
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 */
function initVertexBuffer(gl) {
    var a_Position = gl.getAttribLocation(gl.program,"a_Position");
    if (a_Position < 0) {
        console.error("can't find a_Position");
        return;
    }
    // var vertices = new Float32Array([-0.5,0.5,-0.5,-0.5,0.5,0.5,0.5,-0.5]); // 使用Triangle_Strip需要4个点
    var vertices = new Float32Array([-0.5,0.5,-0.5,-0.5,0.5,0.5,0.5,0.5,-0.5,-0.5,0.5,-0.5]); // 使用Triangles需要6个点
    var n = vertices.length/2;
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error("Failed to create the buffer object.");
        return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(a_Position);
    return n;
}