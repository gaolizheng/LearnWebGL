var VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n'+
    'attribute float a_PointSize;\n'+
    'void main() {\n'+
    'gl_Position = a_Position;\n'+
    'gl_PointSize = a_PointSize;\n'+
    '}\n';
var FSHADER_SOURCE = 
    'void main() {\n'+
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
    
    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs,VSHADER_SOURCE);
    gl.compileShader(vs);
    var compiled = gl.getShaderParameter(vs,gl.COMPILE_STATUS);
    if (!compiled) {
        var error = gl.getShaderInfoLog(vs);
        console.log("Compiled vs failed:"+error);
        gl.deleteShader(vs);
        return;
    }

    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs,FSHADER_SOURCE);
    gl.compileShader(fs);
    var compiled = gl.getShaderParameter(fs,gl.COMPILE_STATUS);
    if (!compiled) {
        var error = gl.getShaderInfoLog(fs);
        console.log("Compiled fs failed:"+error);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program,vs);
    gl.attachShader(program,fs);
    gl.linkProgram(program);
    var linked = gl.getProgramParameter(program,gl.LINK_STATUS);
    if (!linked) {
        var error = gl.getProgramInfoLog(program);
        console.log("link program failed:"+error);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        return;
    }
    gl.useProgram(program);
    gl.program = program;

    // 获取attribute变量的存储位置
    // 我的理解是着色器程序会先开辟变量所需的内存空间，此处获取的是地址指针
    var a_Position = gl.getAttribLocation(gl.program,'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    // 将顶点位置传给attribute变量
    gl.vertexAttrib3f(a_Position,0.5,0.0,0.0);

    var a_PointSize = gl.getAttribLocation(gl.program,'a_PointSize');
    if (a_PointSize<0) {
        console.log('Failed to get the storage location of a_PointSize');
        return;
    }
    gl.vertexAttrib1f(a_PointSize,20.0);

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS,0,1);
}