# HTML DOM

-   [DOM](#dom)
    -   [获得 html 元素](#获得html元素)
-   [html DOM 改变 html 内容](#html-dom改变html内容)
    -   [document.write()](#documentwrite)
    -   [innerHTML 属性](#innerhtml-属性)
    -   [改变 HTML 属性](#改变-html-属性)
-   [html DOM 改变 css 内容](#html-dom改变css内容)
-   [html DOM 事件](#html-dom事件)
    -   [常见的 html DOM 事件](#常见的html-dom事件)
        -   [onload 和 onunload](#onload-和-onunload)
        -   [onchange](#onchange)
        -   [onmouseover 和 onmouseout](#onmouseover-和-onmouseout)
        -   [onmousedown、onmouseup 以及 onclick 事件](#onmousedownonmouseup-以及-onclick-事件)
        -   [onfocus](#onfocus)
-   [HTML DOM EventListener](#html-dom-eventlistener)
    -   [向 Window 对象添加事件句柄](#向-window-对象添加事件句柄)
    -   [事件冒泡或事件捕获](#事件冒泡或事件捕获)

## DOM

![html Dom](./../../image-resources/web/pic_htmltree.gif)

### 获得 html 元素

-   **通过 id 查找 HTML 元素**

```html
<p id="intro">你好世界!</p>
<p>该实例展示了 <b>getElementById</b> 方法!</p>
<script>
    x = document.getElementById('intro');
    document.write('<p>文本来自 id 为 intro 段落: ' + x.innerHTML + '</p>');
</script>
```

-   **通过标签名查找 HTML 元素**

```html
<p>你好世界!</p>
<div id="main">
    <p>DOM 是非常有用的。</p>
    <p>该实例展示了 <b>getElementsByTagName</b> 方法</p>
</div>
<script>
    var x = document.getElementById('main');
    var y = x.getElementsByTagName('p');
    document.write('id="main"元素中的第一个段落为：' + y[1].innerHTML);
</script>
```

-   **通过标签名查找 HTML 元素**

```html
<p class="intro">你好世界!</p>
<p>该实例展示了 <b>getElementsByClassName</b> 方法!</p>
<script>
    x = document.getElementsByClassName('intro');
    document.write(
        '<p>文本来自 class 为 intro 段落: ' + x[0].innerHTML + '</p>'
    );
</script>
<p>
    <b>注意：</b>Internet Explorer 8 及更早 IE 版本不支持
    getElementsByClassName() 方法。
</p>
```

## html DOM 改变 html 内容

### document.write()

-   **document.write()** 可用于直接向 HTML 输出流写内容
-   **绝对不要在文档加载完成之后使用 document.write()**

```html
<!DOCTYPE html>
<html>
    <body>
        <script>
            document.write(Date());
        </script>
    </body>
</html>
```

### innerHTML 属性

-   innerHTML 属性设置或返回**开始和结束标签之间的 HTML**

```html
document.getElementById(id).innerHTML=new HTML
```

```html
<p id="p1">Hello World!</p>

<script>
    document.getElementById('p1').innerHTML = 'New text!';
</script>
```

### 改变 HTML 属性

```html
document.getElementById(id).attribute=new value
```

```html
<img id="image" src="smiley.gif" />

<script>
    document.getElementById('image').src = 'landscape.jpg';
</script>
```

## html DOM 改变 css 内容

```html
document.getElementById(id).style.property=new style
```

```html
<p id="p2">Hello World!</p>

<script>
    document.getElementById('p2').style.color = 'blue';
</script>

<p>The paragraph above was changed by a script.</p>
```

## html DOM 事件

-   事件可以直接**加上 js 代码，或者调用现成的函数**

```html
<h1 onclick="this.innerHTML='Ooops!'">点击文本!</h1>
```

```html
<!DOCTYPE html>
<html>
    <head>
        <script>
            function changetext(id) {
                id.innerHTML = 'Ooops!';
            }
        </script>
    </head>
    <body>
        <h1 onclick="changetext(this)">Click on this text!</h1>
    </body>
</html>
```

-   **可以通过 HTML 事件属性或者 DOM 分配事件**

```html
<button onclick="displayDate()">点我</button>
```

```html
document.getElementById("myBtn").onclick=function(){displayDate()};
```

### 常见的 html DOM 事件

#### onload 和 onunload

-   onload 和 onunload 事件会在用户进入或离开页面时被触发。
-   onload 事件可用于检测访问者的浏览器类型和浏览器版本，并基于这些信息来加载网页的正确版本。
-   onload 和 onunload 事件可用于处理 cookie

```html
<body onload="checkCookies()"></body>
```

#### onchange

-   onchange 事件常结合对输入字段的验证来使用

```html
<input type="text" id="fname" onchange="upperCase()" />
```

#### onmouseover 和 onmouseout

-   onmouseover 和 onmouseout 事件可用于在用户的鼠标移至 HTML 元素上方或移出元素时触发函数

```html
<div
    onmouseover="mOver(this)"
    onmouseout="mOut(this)"
    style="background-color:#D94A38;width:120px;height:20px;padding:40px;"
>
    Mouse Over Me
</div>
<script>
    function mOver(obj) {
        obj.innerHTML = 'Thank You';
    }
    function mOut(obj) {
        obj.innerHTML = 'Mouse Over Me';
    }
</script>
```

#### onmousedown、onmouseup 以及 onclick 事件

-   onmousedown, onmouseup 以及 onclick 构成了鼠标点击事件的所有部分。
-   首先当点击鼠标按钮时，会触发 onmousedown 事件
-   当释放鼠标按钮时，会触发 onmouseup 事件
-   最后，当完成鼠标点击时，会触发 onclick 事件。

#### onfocus

-   当元素获得焦点时触发

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>W3Cschool教程(w3cschool.cn)</title>
        <script>
            function myFunction(x) {
                x.style.background = 'yellow';
            }
        </script>
    </head>
    <body>
        输入你的名字: <input type="text" onfocus="myFunction(this)" />
        <p>当输入框获取焦点时，修改背景色（background-color属性） 将被触发。</p>
    </body>
</html>
```

## HTML DOM EventListener

```js
element.addEventListener(event, function, useCapture);
```

-   addEventListener() 方法用于向指定元素添加事件句柄。
-   addEventListener() 方法添加的事件句柄不会覆盖已存在的事件句柄。
-   可以向一个元素添加多个事件句柄。
-   可以向同个元素添加多个同类型的事件句柄，如：两个 "click" 事件。
-   可以向任何 DOM 对象添加事件监听，不仅仅是 HTML 元素。如： window 对象。
-   addEventListener() 方法可以更简单的控制事件（冒泡与捕获）。
-   当使用 addEventListener() 方法时, JavaScript 从 HTML 标记中分离开来，可读性更强， 在没有控制 HTML 标记时也可以添加事件监听。
-   可以使用 removeEventListener() 方法来移除事件的监听。

```js
function myFunction() {
    alert('Hello World!');
}

// 直接添加
element.addEventListener('click', function() {
    alert('Hello World!');
});

// 引用外部函数
element.addEventListener('click', myFunction);
```

### 向 Window 对象添加事件句柄

-   addEventListener() 方法允许你在 HTML DOM 对象添加事件监听， HTML DOM 对象如： HTML 元素, HTML 文档, window 对象。或者其他支出的事件对象如: xmlHttpRequest 对象。

```html
window.addEventListener("resize", function(){
document.getElementById("demo").innerHTML = sometext; });
```

### 事件冒泡或事件捕获

```js
element.addEventListener(event, function, useCapture);
```

-   侦听器在侦听时有三个阶段：捕获阶段、目标阶段和冒泡阶段。
-   顺序为：捕获阶段（根节点到子节点检查是否调用了监听函数）→ 目标阶段（目标本身）→ 冒泡阶段（目标本身到根节点）。
-   此处的参数 useCapture 确定侦听器是运行于捕获阶段、目标阶段还是冒泡阶段。 **如果将 useCapture 设置为 true，则侦听器只在捕获阶段处理事件，而不在目标或冒泡阶段处理事件。 如果 useCapture 为 false，则侦听器只在目标或冒泡阶段处理事件。**
-   要在所有三个阶段都侦听事件，请调用两次 addEventListener，一次将 useCapture 设置为 true，第二次再将 useCapture 设置为 false。

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>JavaScript</title>
        <meta name="author" content="Rancune" />
        <script src="static/js/basis.js"></script>
        <style type="text/css">
            .black_bold {
                color: black;
                font-weight: bold;
            }
        </style>

        <script>
            function onClickEvent(name) {
                log('onClickEvent:' + name);
            }

            function captureTrue(name) {
                log('Capture true:' + name);
            }

            function capturefalse(name) {
                log('Capture false 1:' + name);
            }

            function capturefalse2(name) {
                log('Capture false 2:' + name);
            }
        </script>
    </head>
    <body>
        <p class="black_bold">测试一下事件分发</p>
        <div
            id="parent"
            onclick="onClickEvent('parent')"
            style="width: 100px; height: 100px;background-color: black"
        >
            <button style="width: 50px; height: 50px;background-color: blue;">
                bro
            </button>
            <button
                id="child"
                onclick="onClickEvent('child')"
                style="width: 50px; height: 50px;background-color: red;"
            >
                child
            </button>
        </div>
    </body>

    <script>
        var parent = document.getElementById('parent');
        parent.addEventListener(
            'click',
            function() {
                captureTrue('parent');
            },
            true
        );
        parent.addEventListener(
            'click',
            function() {
                capturefalse('parent');
            },
            false
        );
        parent.addEventListener(
            'click',
            function() {
                capturefalse2('parent');
            },
            false
        );

        var child = document.getElementById('child');
        child.addEventListener(
            'click',
            function() {
                captureTrue('child');
            },
            true
        );
        child.addEventListener(
            'click',
            function() {
                capturefalse('child');
            },
            false
        );
        child.addEventListener(
            'click',
            function() {
                capturefalse2('child');
            },
            false
        );
    </script>
</html>
```

-   当点击没有设置事件的 bro 时

![chick bro](./../image-resources/web/click_bro.png)

-   当点击父元素的空白处时

![chick blank](./../image-resources/web/click_parent_blank.png)

-   当点击设置了事件的 child 时

![chick child](./../image-resources/web/click_child.png)
