# Html

- [head标签](#head标签)
    - [常用的meta标签](#常用的meta标签)
        - [format-detection](#format-detection)
- [常用标签](#常用标签)
    - [水平线](#水平线)
    - [换行](#换行)
    - [文本格式化](#文本格式化)
    - [图片](#图片)

## head标签

```html

<!DOCTYPE html>
<html>
<head>
    <!--meta定义了HTML文档中的元数据-->
    <meta charset="utf-8">
    <!--title定义了文档的标题-->
    <title>html head相关标签</title>
    <meta name="description" content="head相关标签">
    <meta name="keywords" content="HTML,head">
    <meta name="author" content="Rancune">
    <!--base定义了页面链接标签的默认链接地址-->
    <base href="https://www.w3cschool.cn/statics/images/" ; target="_blank">
    <link rel="stylesheet" type="text/css" href="styles.css">
    <style type="text/css">
        h1 {
            color: red;
        }

        p {
            color: blue;
        }
    </style>
</head>
<body>
<h1>A heading</h1>
<p><img src="logo.png"> - 注意这里我们设置了图片的相对地址。能正常显示是因为我们在 head 部分设置了 base 标签，该标签指定了页面上所有链接的默认 URL，所以该图片的访问地址为
    "https://www.w3cschool.cn/statics/images/logo.png";

<p><a href="https://www.w3cschool.cn/">w3cschool.cn</a>- 注意这个链接会在新窗口打开，即便它没有 target="_blank" 属性。因为在 base 标签里我们已经设置了
    target 属性的值为 "_blank"。</p>

</body>
</html>
```

### 常用的meta标签

#### format-detection

- format-detection —— 格式检测，用来检测html里的一些格式，主要有以下几个设置
- telephone
    - 主要作用是是否设置自动将你的数字转化为拨号连接
    - telephone=no 禁止把数字转化为拨号链接
    - telephone=yes 开启把数字转化为拨号链接，默认开启
- email
    - 告诉设备不识别邮箱，点击之后不自动发送
    - email=no 禁止作为邮箱地址
    - email=yes 开启把文字默认为邮箱地址，默认情况开启
- adress
    - adress=no 禁止跳转至地图
    - adress=yes 开启点击地址直接跳转至地图的功能, 默认开启

```html
<meta name=”format-detection” content=”telephone=no”>
<meta name=”format-detection” content=”email=no” >
<meta name=”format-detection” content=”adress=no” >

<!--或者下面的写法-->
<meta name=”format-detection” content=”telephone=no,email=no,adress=no”>
```

## 常用标签

### 水平线

```html
<p>这是一个段落。</p>
<hr>
```

### 换行

```html
<p>
使用br元素<br>在文本中<br>换行。
</p>
```

### 文本格式化

```html
<b>加粗文本</b><br><br>
<i>斜体文本</i><br><br>
<!--code标签的功能有：将文本变成等宽字体以及提示这段文本是源程序代码-->
<code>电脑自动输出</code><br><br>
这是 <sub> 下标</sub> 和 <sup> 上标</sup>
```

### 图片

```html
<img src="pulpit.jpg" alt="Pulpit rock" width="304" height="228">
```