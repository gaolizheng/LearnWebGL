# WebGL

## ch8_1 光照效果

### <漫反射光颜色> = <入射光颜色> x <表面基底颜色> x cosθ

>θ为入射光与表面的夹角，cosθ 可以通过光线方向和法线方向两个向量的点积计算。原理是:

>>**n** = (nx, ny, nz)

>>**l** = (lx, ly, lz)

>>**n** · **l** = nx * lx + ny * ly + nz * lz

>>**n** · **l** = ｜**n**｜ * ｜**l**｜ * cosθ

>>所以当 ｜**n**｜ 和 ｜**l**｜ 都为1时(将一个向量的长度调整为1的过程叫做归一化)，**n** · **l** 就是cosθ，
需要注意光线方向实际是光线入射方向的反方向，即从入射点指向光源方向。

### <环境反射光颜色> = <入射光颜色> x <表面基底颜色>

### <表面反射光颜色> = <漫反射光颜色> + <环境反射光颜色>

![image](https://github.com/gaolizheng/LearnWebGL/blob/master/Ch8_1_LightedCube/effect.png)

## ch8_2 运动物体的光照效果
>物体的运动会改变每个表面的法向量，平移、旋转和缩放对法向量的影响如下:

>>平移变换不会改变法向量

>>旋转变换会改变法向量

>>缩放变换对法向量的影响较为复杂，有可能会产生印象也可能不产生影响（比如等比缩放）

>计算经模型矩阵变换后的法向量，可以用变换前的法向量乘以模型矩阵的逆转置矩阵。

>>逆矩阵：如果矩阵**M**的逆矩阵是**R**，那么**M** * **R**或**R** * **M**的结果都是单位矩阵。

>>求逆转置矩阵的步骤:1.求原矩阵的逆矩阵。 2.将你矩阵进行转置。

>待补充数学相关知识

![image](https://github.com/gaolizheng/LearnWebGL/blob/master/Ch8_2_LightedMovedCube/effect.png)