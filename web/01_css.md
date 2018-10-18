# CSS

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

```html
h3 {
    color:red;
    text-align:left;
    font-size:8pt;
}
```

- 而内部样式表拥有针对 h3 选择器的两个属性:

```html
h3 {
    text-align:right;
    font-size:20pt;
}
```

- 假如拥有内部样式表的这个页面同时与外部样式表链接，那么 h3 得到的样式是,即颜色属性将被继承于外部样式表，而文字排列（text-alignment）和字体尺寸（font-size）会被内部样式表中的规则取代。

```html
color:red;
text-align:right;
font-size:20pt;
```