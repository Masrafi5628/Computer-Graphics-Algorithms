const vertexShaderSource = `
    attribute vec2 aPosition;

    void main() {
        gl_PointSize = 5.0; // Adjust point size for visibility
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
`;

const fragmentShaderSource = `
    precision mediump float;

    void main() {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Black color for points
    }
`;

function initWebGL(canvas) {
    const gl = canvas.getContext("webgl");
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
        return null;
    }
    return gl;
}

function initShaders(gl) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }
    gl.useProgram(shaderProgram);
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function drawScene(gl, shaderProgram, vertices) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    gl.drawArrays(gl.POINTS, 0, vertices.length / 2);
}

const canvas = document.getElementById("glcanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = initWebGL(canvas);

if (gl) {
    gl.clearColor(1.0, 1.0, 1.0, 1.0); // White background
    const shaderProgram = initShaders(gl);

    // Define vertices for a single point at (0, 0)
    const vertices = [
        0.0, 0.0
    ];

    drawScene(gl, shaderProgram, vertices);
}
