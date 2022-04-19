# WebGL

## ch8_1 实现漫反射和环境反射

### <漫反射光颜色> = <入射光颜色> x <表面基底颜色> x cosθ

θ为入射光与表面的夹角，cosθ 可以通过光线方向和法线方向两个向量的点积计算。原理是:

$\vec{n}$ = (nx, ny, nz)

$\vec{l}$ = (lx, ly, lz)

$\vec{n}$$\cdot$$\vec{l}$ = nx * lx + ny * ly + nz * lz

$\vec{n}$$\cdot$$\vec{l}$ = $|\vec{n}|$ * $|\vec{l}|$ * cosθ

所以当 $|\vec{n}|$ 和 $|\vec{l}|$ 都为1时(将一个向量的长度调整为1的过程叫做归一化)，$\vec{n}$ $\cdot$ $\vec{l}$ 就是cosθ，
需要注意光线方向实际是光线入射方向的反方向，即从入射点指向光源方向。

### <环境反射光颜色> = <入射光颜色> x <表面基底颜色>

### <表面反射光颜色> = <漫反射光颜色> + <环境反射光颜色>

![image](https://github.com/gaolizheng/LearnWebGL/blob/master/Ch8_1_LightedCube/effect.png)

