var VSHADER_SOURCE =
    'void main() {\n' +
    'gl_Position = vec4(0.5,0.0,0.0,1.0);\n' +
    'gl_PointSize = 10.0;\n' +
    '}\n';
var FSHADER_SOURCE =
    'void main() {\n' +
    'gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n' +
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
    // 创建顶点着色器
    var vs = gl.createShader(gl.VERTEX_SHADER);
    if (vs == null) {
        console.log('unable to create vs');
        return;
    }
    gl.shaderSource(vs, VSHADER_SOURCE);
    gl.compileShader(vs);
    var compiled = gl.getShaderParameter(vs, gl.COMPILE_STATUS);
    if (!compiled) {
        var error = gl.getShaderInfoLog(vs);
        console.log('Failed to compile vshader: ' + error);
        gl.deleteShader(vs);
        return;
    }

    // 创建片段着色器
    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (fs == null) {
        console.log('unable to create fs');
        return;
    }
    gl.shaderSource(fs, FSHADER_SOURCE);
    gl.compileShader(fs);
    var compiled = gl.getShaderParameter(fs, gl.COMPILE_STATUS);
    if (!compiled) {
        var error = gl.getShaderInfoLog(fs);
        console.log('Failed to compile fshader: ' + error);
        gl.deleteShader(fs);
        return;
    }

    var program = gl.createProgram();
    if (!program) {
        return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        var error = gl.getProgramInfoLog(program);
        console.log('Failed to link program: ' + error);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        return;
    }
    gl.useProgram(program);
    gl.program = program;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);
}