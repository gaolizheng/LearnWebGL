var VSHADER_SOURCE = 
'attribute vec4 a_Position;\n'+
'attribute float a_PointSize;\n'+
'void main(){\n'+
'gl_Position = a_Position;\n'+
'gl_PointSize = a_PointSize;\n'+
'}\n';

var FSHADER_SOURCE = 
'precision mediump float;\n'+
'uniform vec4 u_FragColor;\n'+
'void main(){\n'+
'gl_FragColor = u_FragColor;\n'+
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
        console.error("vs shader compiled error:"+error);
        gl.deleteShader(vs);
        return;
    }

    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs,FSHADER_SOURCE);
    gl.compileShader(fs);
    compiled = gl.getShaderParameter(fs,gl.COMPILE_STATUS);
    if (!compiled) {
        var error = gl.getShaderInfoLog(fs);
        console.error("fs shader compiled error:"+error);
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
        console.error("program linked error:"+error);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteProgram(program);
        return;
    }

    gl.useProgram(program);
    gl.program = program;

    var a_PointSize = gl.getAttribLocation(program,"a_PointSize");
    if (a_PointSize < 0) {
        console.error("can't find a_PointSize");
        return;
    }
    gl.vertexAttrib1f(a_PointSize,10.0);

    var a_Position = gl.getAttribLocation(program,"a_Position");
    if (a_Position < 0) {
        console.error("can't find a_Position");
        return;
    }

    var u_FragColor = gl.getUniformLocation(program,"u_FragColor");
    if (u_FragColor == null) {
        console.error("can't find u_FragColor");
        return;
    }

    canvas.onmousedown = function (ev) {
        click(ev,canvas,gl,a_Position,u_FragColor);
    }

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}


var g_points = [];
/**
 * 
 * @param {MouseEvent} ev 
 * @param {HTMLCanvasElement} canvas 
 * @param {WebGLRenderingContext} gl 
 * @param {*} a_Position 
 */
function click(ev,canvas,gl,a_Position,u_FragColor) {
    var x = ev.clientX;
    var y = ev.clientY;
    /**
     * @type {DOMRect}
     */
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    g_points.push(x);
    g_points.push(y);

    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let index = 0; index < g_points.length; index+=2) {
        x = g_points[index];
        y = g_points[index+1];
        gl.vertexAttrib3f(a_Position,x,y,0.0);
        gl.uniform4f(u_FragColor,x + 0.5,y+0.5,0.0,1.0);
        gl.drawArrays(gl.POINTS,0,1);
    }
}
