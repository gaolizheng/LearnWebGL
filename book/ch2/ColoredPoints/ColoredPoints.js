var VSHADER_SOURCE = '' +
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main(){\n' +
    'gl_Position = a_Position;\n' +
    'gl_PointSize = a_PointSize;\n' +
    '}\n';

var FSHADER_SOURCE = '' +
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main(){\n' +
    'gl_FragColor = u_FragColor;\n' +
    '}\n';

function main() {
    var canvas = document.getElementById("webgl");
    if (!canvas) {
        return false;
    }
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return false;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("init shader error");
        return false;
    }

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log("error on a_Position");
        return;
    }

    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (u_FragColor == null) {
        console.log("error on u_FragColor");
        return;
    }

    canvas.onmousedown = function (ev) {
        click(ev, gl, canvas, a_Position, u_FragColor);
    }

    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if (a_PointSize < 0) {
        console.log("error on a_PointSize");
        return;
    }
    gl.vertexAttrib1f(a_PointSize, 10.0);

    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];
var g_colors = [];
function click(ev, gl, canvas, a_Position, u_FragColor) {
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
    g_points.push([x, y]);
    g_colors.push([Math.abs(x), Math.abs(y), (Math.abs(x) + Math.abs(y)) / 2, 1.0]);;
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (var index = 0; index < g_points.length; index++) {
        var p = g_points[index];
        var color = g_colors[index];
        gl.vertexAttrib3f(a_Position, p[0], p[1], 0.0);
        gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}