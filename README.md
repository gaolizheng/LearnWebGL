# WebGL

## ch8_1 光照效果

### <漫反射光颜色> = <入射光颜色> x <表面基底颜色> x cosθ

>θ为入射光与表面的夹角，cosθ 可以通过光线方向和法线方向两个向量的点积计算。原理是:

>>法向量: ![](https://latex.codecogs.com/svg.image?\vec{n}=(nx,ny,nz))

>>光线向量: ![](https://latex.codecogs.com/svg.image?\vec{l}=(lx,ly,lz))

>>点积: ![](https://latex.codecogs.com/svg.image?\vec{n}\cdot\vec{l}=nx\times&space;lx&plus;ny\times&space;ly&plus;nz\times&space;lz)

>>点积: ![](https://latex.codecogs.com/svg.image?\vec{n}\cdot\vec{l}=\left|&space;\vec{n}\right|\cdot\left|&space;\vec{l}\right|\times&space;\cos&space;\theta&space;)

>>所以当![](https://latex.codecogs.com/svg.image?\left|&space;\vec{n}\right|)和![](https://latex.codecogs.com/svg.image?|&space;\vec{l}&space;|)都为1时(将一个向量的长度调整为1的过程叫做归一化)，![](https://latex.codecogs.com/svg.image?\vec{n}\cdot\vec{l}) 就是cosθ，
需要注意光线方向实际是光线入射方向的反方向，即从入射点指向光源方向。

>>归一化计算方法，以 ![](https://latex.codecogs.com/svg.image?\vec{n}&space;=&space;(nx,&space;ny,&space;nz)) 为例，向量长度 ![](https://latex.codecogs.com/svg.image?m=|\vec{n}|=\sqrt{nx^2&plus;ny^2&plus;nz^2})，那么归一化后 ![](https://latex.codecogs.com/svg.image?\vec{n}=(\frac{nx}{m},\frac{ny}{m},\frac{nz}{m}))

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

>>求逆转置矩阵的步骤:1.求原矩阵的逆矩阵。 2.将逆矩阵进行转置。

>待补充数学相关知识

![image](https://github.com/gaolizheng/LearnWebGL/blob/master/Ch8_2_LightedMovedCube/effect.png)

## ch8_3 点光源光照

>点光源与平行光的区别在于入射光的角度是随顶点坐标变化的，所以不能指定光源方向，而要指定光源位置，逐顶点计算入射光线方向。

>将立方体放大一些，比较容易看到立方体上有一些不自然的线条，这是因为我们是通过计算顶点光照颜色然后内差值出每个片元的颜色。

![image](https://github.com/gaolizheng/LearnWebGL/blob/master/Ch8_3_PointLightedCube/effect.png)

## ch8_4 使用片元着色器计算光照

>使用片元着色器计算光照与使用顶点着色器区别不大，顶点着色器计算顶点世界坐标和法向量，经过内插之后，片元着色器就可以拿到每个片元的世界坐标和法向量，
需要注意的是虽然顶点着色器已经对法向量做过归一化，但是片元着色器需要再做一次，因为内插值后法向量可能不再是1.0了。

>当有多个点光源时，就需要在片元着色器中计算每一个点光源对片元的颜色贡献，并将他们全部加起来。

![image](https://github.com/gaolizheng/LearnWebGL/blob/master/Ch8_4_PointLightedCube/effect.png)

## ch9_1 单关节模型

>一个关节连接两个手臂，大臂带动小臂，小臂的运动不影响大臂

![image](https://github.com/gaolizheng/LearnWebGL/blob/master/Ch9_1_JointMode/effect.png)

## ch10_1 用鼠标控制物体旋转

>用鼠标控制立方体旋转，立方体有纹理贴图，并添加光照。

## ch10_2 用鼠标选中物体

>点击鼠标判断是否选中了立方体，判断的方法是点击时判断是否在canvas范围内，如果在范围内将立方体渲染成红色，读取点击位置的颜色值，如果R分量是255就代表此次点击是点中了立方体。立刻再将立方体换回原颜色。

## ch10_3 用鼠标选中物体的某一个面

>点击立方体的某一个面，被点中的面变成白色，其他面颜色不变。实现方式与ch10_2类似，首先将每个面的索引值1-6传入着色器程序，当点中立方体时，就将面的索引值写入颜色的alpha分量，然后读取点击位置颜色的alpha分量来确定点击的是哪个面，再将此值传如着色器与面的索引值比对，相同则用白色，不同则用原颜色。

![image](https://github.com/gaolizheng/LearnWebGL/blob/master/Ch10_3_PickFace/effect.png)

## ch10_4 雾化

>远处的物体看上去较为模糊的现象叫做雾化。

>使用线性雾化方式，即某一点的雾化程度取决于它与视点之间的距离，距离越远雾化程度越高。线性雾化有起点和终点，起点代表开始雾化之处，终点表示完全雾化之处。某一点的雾化程度被定义为雾化因子

>><雾化因子> = (<终点> - <当前点与视点的距离>)/(<终点> - <起点>)

>让立方体延Z轴移动，看到其雾化程度加深

![image](https://github.com/gaolizheng/LearnWebGL/blob/master/Ch10_4_Fog/effect1.png)

![image](https://github.com/gaolizheng/LearnWebGL/blob/master/Ch10_4_Fog/effect2.png)

## ch10_5 颜色混合

>开启颜色混合需要调用gl.enable(gl.BLEND)方法，并使用gl.blendFunc方法指定混合函数

![image](https://github.com/gaolizheng/LearnWebGL/blob/master/Ch10_5_Blend/effect.png)

## ch10_6 多个Shader

>使用多个Shader需要创建多个program，并按需要切换program

![image](https://github.com/gaolizheng/LearnWebGL/blob/master/Ch10_6_ChangeShader/effect.png)

## ch10_7 使用FrameBuffer渲染内容到纹理（离屏渲染）

>之前都是将内容渲染到颜色缓冲区然后显示到屏幕上，还可以通过使用帧缓冲区将内容渲染成一张纹理再贴到其他物体上。

>帧缓冲区对象(FrameBuffer Object)可以用来替代颜色缓冲区或深度缓冲区，绘制到帧缓冲区的内容不直接显示到canvas上，你可以先对帧缓冲区中的内容做一些处理再显示，或者直接使用其中的内容作为纹理对象。在帧缓冲区中进行绘制的过程又称为离屏渲染。

>>当使用帧缓冲区时，绘制并不是直接发生在其中的，而是发生在帧缓冲区所关联的对象上。一个帧缓冲区有3个关联对象：颜色关联对象、深度关联对象和模版关联对象，分别用来替代颜色缓冲区、深度缓冲区和模版缓冲区。

>>帧缓冲区的每个关联对象可以是两种类型的：纹理对象或者渲染缓冲区对象(RenderBuffer Object)

>>使用帧缓冲区的步骤：
>>1. 创建帧缓冲区对象(gl.createFramebuffer()) 
>>2. 创建纹理对象并设置其尺寸和参数(gl.createTexture()、gl.bindTexture()、gl.texImage2D()、gl.Parameteri()) 
>>3. 创建渲染缓冲区对象(gl.createRenderbuffer()) 
>>4. 绑定渲染缓冲区对象并设置其尺寸(gl.bindRenderbuffer()、gl.renderbufferStorage()) 
>>5. 将帧缓冲区的颜色关联对象指定为一个纹理对象(gl.framebufferTexture2D()) 
>>6. 将帧缓冲区的深度关联对象指定为一个渲染缓冲区对象(gl.framebufferRenderbuffer()) 
>>7. 检查帧缓冲区是否正确配置(gl.checkFramebufferStatus())

![image](https://github.com/gaolizheng/LearnWebGL/blob/master/Ch10_7_FrameBuffer/effect.png)

## ch10_8 阴影贴图

>将视点移动到光源位置，所有能够看到的片元就是光线能照到的，记录下片元的z值渲染到帧缓冲区作为阴影贴图。移回视点再渲染，比较待渲染的片元的坐标变换到光源坐标系下的z值，与阴影贴图记录值的大小，如果大于阴影贴图记录的值，说明无法被光线照射到，用较浅的颜色绘制，反之用正常颜色绘制。

>比较z值与阴影贴图的值大小时，需要加一个偏移量，这是为了解决精度不一致造成的无法正确比较大小的问题。（会产生马赫带）

![image](https://github.com/gaolizheng/LearnWebGL/blob/master/Ch10_8_ShadowMap/effect.png)