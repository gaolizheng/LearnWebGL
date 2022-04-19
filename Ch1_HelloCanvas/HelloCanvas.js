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
    gl.clearColor(0.0,0.0,0.0,0.5);
    gl.clear(gl.COLOR_BUFFER_BIT);
}