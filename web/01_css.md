# CSS

- [参考资料](#参考资料)
- [CSS 格式](#css-格式)
- [CSS使用](#css使用)
    - [内联样式](#内联样式)
    - [内部样式表](#内部样式表)
    - [外部样式表](#外部样式表)
    - [优先级](#优先级)
- [id 和 class选择器](#id-和-class选择器)
    - [id 选择器](#id-选择器)
    - [class 选择器](#class-选择器)
    - [多重样式](#多重样式)
- [CSS分组和嵌套选择器](#css分组和嵌套选择器)
    - [分组选择器](#分组选择器)
    - [嵌套选择器](#嵌套选择器)
    - [后代选择器](#后代选择器)
    - [子元素选择器](#子元素选择器)
    - [相邻兄弟选择器](#相邻兄弟选择器)
    - [普通兄弟选择器](#普通兄弟选择器)
- [属性选择器](#属性选择器)
- [伪类与伪元素](#伪类与伪元素)
- [常用的属性](#常用的属性)
    - [position](#position)
        - [static](#static)
        - [relative](#relative)
        - [absolute](#absolute)
        - [fixed](#fixed)
        - [sticky](#sticky)
        - [clip](#clip)

## 参考资料

- [CSS参考手册](http://www.css88.com/book/css/)

## CSS 格式

![css样式](./../image-resources/web/selector.gif)

## CSS使用

### 内联样式

```html
<p style="color:blue;margin-left:20px;">This is a paragraph.</p>
```

### 内部样式表

```html
<head>
    <style type="text/css">
        body {
            background-color: yellow;
        }

        p {
            color: blue;
        }
    </style>
</head>
```

### 外部样式表

```html
<head>
    <link rel="stylesheet" type="text/css" href="mystyle.css">
</head>
```

### 优先级

- 内联 > 内部 > 外部

## id 和 class选择器

### id 选择器

- CSS 中 id 选择器以 "#" 来定义
- HTML元素以id属性来设置id选择器
- ID属性不要以数字开头，数字开头的ID在 Mozilla/Firefox 浏览器中不起作用
- **ID属性只能在每个 HTML 文档中出现一次**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Form</title>
    <meta name="author" content="Rancune">
    <style type="text/css">
        #param1 {
            color: red;
            text-align: center;
        }

    </style>
</head>
<body>
<h4 id="param1">id选择器</h4>
</body>
</html>
```

### class 选择器

- class 选择器用于描述一组元素的样式，class 选择器有别于id选择器，**class可以在多个元素中使用**
- class 选择器在HTML中以class属性表示
- 在 CSS 中，类选择器以一个点"."号显示

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Form</title>
    <meta name="author" content="Rancune">
    <style type="text/css">
        .center {
            text-align: center;
        }
    </style>
</head>
<body>
<h4 class="center">class选择器</h4>
<h5 class="center">class选择器</h5>
</body>
</html>
```

- **可以指定针对特定的HTML元素使用的class**

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>W3Cschool教程(w3cschool.cn)</title>
<style>
    p.center {
        text-align:center;
    }
</style>
</head>

<body>
<h1 class="center">This heading will not be affected</h1>
<p class="center">This paragraph will be center-aligned.</p>
</body>
</html>
```

### 多重样式

- **如果某些属性在不同的样式表中被同样的选择器定义，那么属性值将从更具体的样式表中被继承过来**
- 外部样式表拥有针对 h3 选择器的三个属性：

```css
h3 {
    color:red;
    text-align:left;
    font-size:8pt;
}
```

- 而内部样式表拥有针对 h3 选择器的两个属性:

```css
h3 {
    text-align:right;
    font-size:20pt;
}
```

- 假如拥有内部样式表的这个页面同时与外部样式表链接，那么 h3 得到的样式是,即颜色属性将被继承于外部样式表，而文字排列（text-alignment）和字体尺寸（font-size）会被内部样式表中的规则取代。

```css
color:red;
text-align:right;
font-size:20pt;
```

## CSS分组和嵌套选择器

- [CSS样式之复合选择器](https://blog.csdn.net/Pruett/article/details/77912878?locationNum=5&fps=1)

### 分组选择器

- 在样式表中有很多具有相同样式的元素，可以使用分组选择器。每个选择器用逗号分隔.

```css

h1,h2,p {
    color:green;
}
```

### 嵌套选择器

- 适用于选择器内部的选择器的样式

```html

p {
    color:blue;
}

.marked {
    background-color: red;
}

.marked p {
    color: black;
}

<p>普通的p的样式，字是蓝色的</p>

<div class="marked">
    <p>marked 内部的p 字应当是黑色的</p>
</div>
```

### 后代选择器

- 后代选取器匹配**所有指定元素的后代元素**

```css
E F { sRules }
```

### 子元素选择器

- 与后代选择器相比，子元素选择器（Child selectors）只能选择作为**某元素直接子元素的元素**

```css
E > F {sRules}
```

### 相邻兄弟选择器

- 相邻兄弟选择器选取指定元素的**第一个相邻兄弟元素**

```css
E + F {sRules}
```

### 普通兄弟选择器

- 普通兄弟选择器选取所有指定元素的**所有相邻兄弟元素**

```html
E ~ F {sRules}
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Form</title>
    <meta name="author" content="Rancune">
    <style type="text/css">

        * {
            color: blue;
        }

        body {
            background-color: white;
        }

        #param1 {
            color: red;
            text-align: center;
        }

        .center {
            text-align: center;
        }

        h4.right {
            text-align: right;
        }

        .marked {
            background-color: red;
        }

        .marked p {
            color: black;
        }

        /*子类选择器*/
        div h1 {
            color: red;
        }

        /*子类选择器*/
        div > h2 {
            color: #00e7ef;
        }

        div + h5 {
            color: chartreuse;
        }

        div ~ p {
            color: blueviolet;
        }
    </style>
</head>
<body>
<h4 id="param1">id选择器</h4>

<h4 class="center">class选择器</h4>

<h4 class="right">测试特定元素的class</h4>

<p>普通的p的样式，字是蓝色的</p>

<div class="marked">
    <p>marked 内部的p 字应当是黑色的</p>
</div>

<div>
    <h1>后代选择器，应当是红色的</h1>
</div>

<div>
    <h2>子元素选择器，应当是#00e7ef</h2>
    <div>
        <span><h2>非直接子类，应当是默认的blue</h2></span>
    </div>
</div>

<div>
    <p>test,默认颜色blue</p>
</div>
<h5>相邻兄弟，应当是chartreuse的</h5>
<h5>非相邻兄弟,应当是默认颜色blue</h5>

<div>
    <p>test,默认颜色blue</p>
</div>
<p>相邻兄弟，blueviolet</p>
<p>相邻兄弟, blueviolet</p>


</body>
</html>
```

## 属性选择器

- **包含某个属性**

```css
/*选择具有att属性的E元素*/
E[att] { sRules }
```

```html
<style>
img[alt] {
    margin: 10px;
}
</style>

<img src="图片url" alt="" />
<img src="图片url" />
<!--将会命中第一张图片，因为匹配到了alt属性-->
```

- 属性值

```css
/*选择具有att属性且属性值等于val的E元素*/
E[att="val"] { sRules }

/*选择具有att属性且属性值为一用空格分隔的字词列表，其中一个等于val的E元素（包含只有一个值且该值等于val的情况）*/
E[att~="val"] { sRules }

/*选择具有att属性且属性值为以val开头的字符串的E元素。*/
E[att^="val"] { sRules }

/*选择具有att属性且属性值为以val结尾的字符串的E元素。*/
E[att$="val"] { sRules }

/*选择具有att属性且属性值为包含val的字符串的E元素*/
E[att*="val"] { sRules }

/*选择具有att属性且属性值为以val开头并用连接符"-"分隔的字符串的E元素，如果属性值仅为val，也将被选择*/
E[att|="val"] { sRules }
```

## 伪类与伪元素

- CSS伪类是用来添加一些选择器的特殊效果.由于状态的变化是非静态的，所以**元素达到一个特定状态时，它可能得到一个伪类的样式；当状态改变时，它又会失去这个样式**。由此可以看出，它的功能和class有些类似，但它是基于文档之外的抽象，所以叫伪类
- CSS伪元素是用来添加一些选择器的特殊效果。**CSS伪元素控制的内容和元素是没有差别的，但是它本身只是基于元素的抽象，并不存在于文档中，所以称为伪元素**

```html
selector:pseudo-class {property:value;}

// CSS类也可以使用伪类
selector.class:pseudo-class {property:value;}
```

选择器          | 示例           | 示例说明
----------------|----------------|----------------------------
:link           | a:link         | 选择所有未访问链接
:visited        | a:visited      | 选择所有访问过的链接
:active         | a:active       | 选择正在活动链接
:hover          | a:hover        | 把鼠标放在链接上的状态
:focus          | input:focus    | 选择元素输入后具有焦点
:first-letter   | p:first-letter | 选择每个&lt;p&gt; 元素的第一个字母
:first-line     | p:first-line   | 选择每个&lt;p&gt; 元素的第一行
:first-child    | p:first-child  | 选择器匹配属于任意元素的第一个子元素的 &lt;p&gt; 元素
:before         | p:before       | 在每个&lt;p&gt;元素之前插入内容
:after          | p:after        | 在每个&lt;p&gt;元素之后插入内容
:lang(language) | p:lang(it)     | 为&lt;p&gt;元素的lang属性选择一个开始值

## 常用的属性

### position

- [CSS position 相对定位和绝对定位](https://www.runoob.com/w3cnote/css-position-static-relative-absolute-fixed.html)

#### static

- 对象遵循常规流。忽略 top, bottom, left, right 或者 z-index 声明

#### relative

- 定位是相对于其正常位置进行定位
- **设置了relative的元素仍然处在文档流中，元素的宽高不变，设置偏移量也不会影响其他元素的位置。**
- **最外层容器设置为relative定位，在没有设置宽度的情况下，宽度是整个浏览器的宽度**

#### absolute

- **定位是相对于离元素最近的设置了绝对或相对定位的父元素决定的**，如果没有父元素设置绝对或相对定位，则元素相对于根元素即html元素定位。
- **设置了absolute的元素脱离了文档流,元素在没有设置宽度的情况下，宽度由元素里面的内容决定**。脱离后原来的位置相当于是空的，下面的元素会来占据位置

#### fixed

- 与absolute一致，但偏移定位是以窗口为参考。当出现滚动条时，对象不会随着滚动

#### sticky

- 对象在常态时遵循常规流。
- 它就像是relative和fixed的合体，当在屏幕中时按常规流排版，当卷动到屏幕外时则表现如fixed。该属性的表现是现实中你见到的吸附效果。（CSS3）

#### clip

- 依据上-右-下-左的顺序**提供相对自身左上角为(0,0)坐标计算的四个偏移数值**，其中任一数值都可用auto替换，即此边不剪切