var imageResUrl1 = "http://static.yximgs.com/udata/pkg/DDZ/ddzicon_01.jpg";
var imageResUrl2 = "https://cdnfile.corp.kuaishou.com/kc/files/a/KGTest/ChessGame/KKD/Test/test/Mask.png";
var VSHADER_SOURCE = 
'attribute vec4 a_Position;\n'+
'attribute vec2 a_TexCoord;\n'+
'varying vec2 v_TexCoord;\n'+
'void main(){\n'+
'gl_Position = a_Position;\n'+
'v_TexCoord = a_TexCoord;\n'+
'}\n';

var FSHADER_SOURCE = 
'precision mediump float;\n'+
'uniform sampler2D u_Sampler0;\n'+
'uniform sampler2D u_Sampler1;\n'+
'varying vec2 v_TexCoord;\n'+
'void main(){\n'+
'vec4 color0 = texture2D(u_Sampler0, v_TexCoord);\n'+
'vec4 color1 = texture2D(u_Sampler1, v_TexCoord);\n'+
'gl_FragColor = color0 * color1;\n'+
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

    if (!initTextures(gl,n)) {
        return;
    }
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
    var a_TexCoord = gl.getAttribLocation(gl.program,"a_TexCoord");
    if (a_TexCoord < 0) {
        console.error("can't find a_TexCoord");
        return;
    }
    var vertices = new Float32Array([
        -0.5,-0.5,0.0,0.0, // 左下
        0.5,-0.5,1.0,0.0, // 右下
        0.5,0.5,1.0,1.0, // 右上
        -0.5,-0.5,0.0,0.0, // 左下
        0.5,0.5,1.0,1.0, // 右上
        -0.5,0.5,0.0,1.0, // 左上
    ]);
    var n = 6;
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error("Failed to create the buffer object.");
        return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    var FSIZE = vertices.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,FSIZE * 4,0);
    gl.enableVertexAttribArray(a_Position);

    gl.vertexAttribPointer(a_TexCoord,2,gl.FLOAT,false,FSIZE*4, FSIZE*2);
    gl.enableVertexAttribArray(a_TexCoord);
    return n;
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {Number} n 
 */
function initTextures(gl,n) {
    var texture0 = gl.createTexture();
    var texture1 = gl.createTexture();
    var u_Sampler0 = gl.getUniformLocation(gl.program,"u_Sampler0");
    var u_Sampler1 = gl.getUniformLocation(gl.program,"u_Sampler1");
    var image0 = new Image();
    var image1 = new Image();
    image0.onload = function () {
        loadTexture(gl,n,texture0,u_Sampler0,image0,0);
    }
    image1.onload = function () {
        loadTexture(gl,n,texture1,u_Sampler1,image1,1);
    }
    image0.crossOrigin = "anonymous"
    image1.crossOrigin = "anonymous"
    image0.src = imageResUrl1;
    image1.src = imageResUrl2;
    return true;
}

var TexTargetCount = 2;
var texCount = 0;
/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {*} n 
 * @param {*} texture 
 * @param {*} u_Sampler 
 * @param {*} image 
 */
function loadTexture(gl,n,texture,u_Sampler,image,count) {
    texCount++;
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1); // 对纹理图像进行Y轴反转
    if (count == 0) {
        gl.activeTexture(gl.TEXTURE0); // 开启0号纹理单元    
    }else{
        gl.activeTexture(gl.TEXTURE1); // 开启1号纹理单元
    }
    
    gl.bindTexture(gl.TEXTURE_2D, texture); // 向target绑定纹理对象
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // 配置纹理参数
    //一张jpg一张png为什么只需要指定成RGBA
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, count);

    if (texCount == TexTargetCount) {
        gl.clearColor(0.0,0.0,0.0,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES,0,n);   
    }
}