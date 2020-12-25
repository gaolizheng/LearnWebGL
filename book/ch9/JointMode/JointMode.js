var VSHADER_SOURCE = '' +
    'attribute vec4 a_Position;\n' + // 顶点坐标
    'attribute vec4 a_Normal;\n' + // 法线向量
    'uniform mat4 u_MvpMatrix;\n' + // mvp矩阵
    'uniform mat4 u_NormalMatrix;\n' + // 模型逆转置矩阵
    'varying vec4 v_Color;\n' + // 顶点颜色
    'void main(){\n' +
    'gl_Position = u_MvpMatrix*a_Position;\n' + // 计算定点位置
    'vec3 lightDirection = normalize(vec3(0.0,0.5,0.7));\n' + // 平行光方向
    'vec4 color = vec4(1.0,0.4,0.0,1.0);\n' + // 顶点颜色
    'vec3 normal = normalize((u_NormalMatrix*a_Normal).xyz);\n' + // 旋转后的法向量
    '}\n';