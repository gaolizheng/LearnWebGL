var VSHADER_SOURCE =
    'attribute vec4 a_Position;' +
    'attribute float a_PointSize;' +
    'void main(){\n' +
    'gl_Position = a_Position;\n' +
    'gl_PointSize = a_PointSize;\n' +
    '}\n';

var FSHADER_SOURCE =
    'void main(){\n' +
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

    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, VSHADER_SOURCE);
    gl.compileShader(vs);
    var compiled = gl.getShaderParameter(vs, gl.COMPILE_STATUS);
    if (!compiled) {
        var error = gl.getShaderInfoLog(vs);
        console.log("Compiled vs shader fail:" + error);
        gl.deleteShader(vs);
        return;
    }

    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, FSHADER_SOURCE);
    gl.compileShader(fs);
    compiled = gl.getShaderParameter(fs, gl.COMPILE_STATUS);
    if (!compiled) {
        var error = gl.getShaderInfoLog(fs);
        console.log("Compiled fs shader fail:" + error);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        var error = gl.getProgramInfoLog(program);
        console.log("link program fail:" + error);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        return;
    }

    gl.useProgram(program);
    gl.program = program;

    var a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if (a_Position < 0) {
        console.log("can not find a_Position");
        return;
    }

    var a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize");
    if (a_PointSize < 0) {
        console.log("can not find a_PointSize");
        return;
    }
    gl.vertexAttrib1f(a_PointSize, 20);

    canvas.onmousedown = function (ev) {
        click(ev, gl, canvas, a_Position);
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];
function click(ev, gl, canvas, a_Position) {
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
    g_points.push(x);
    g_points.push(y);

    gl.clear(gl.COLOR_BUFFER_BIT);
    var len = g_points.length;
    for (let index = 0; index < len; index += 2) {
        gl.vertexAttrib3f(a_Position, g_points[index], g_points[index + 1], 0.0);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}