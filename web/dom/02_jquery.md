# jQuery

- [jQuery语法](#jquery语法)
- [文档就绪事件](#文档就绪事件)
- [选择器](#选择器)
- [事件](#事件)
- [jQuery效果](#jquery效果)
    - [显示/隐藏](#显示隐藏)
    - [淡入淡出](#淡入淡出)
    - [滑动](#滑动)
    - [动画](#动画)
- [jQuery HTML](#jquery-html)
    - [获取与设置](#获取与设置)
    - [添加元素](#添加元素)
    - [删除元素](#删除元素)
    - [css](#css)
        - [CSS类](#css类)
        - [css()方法](#css方法)
    - [尺寸](#尺寸)
- [遍历](#遍历)
    - [祖先](#祖先)
    - [后代](#后代)
    - [同胞](#同胞)
    - [过滤](#过滤)

## jQuery语法

```js
// 美元符号定义 jQuery
// 选择符（selector）"查询"和"查找" HTML 元素
// jQuery 的 action() 执行对元素的操作
$(selector).action()

// 隐藏当前元素
$(this).hide()

// 隐藏所有段落
$("p").hide()  

// 隐藏所有 class="test" 的段落
$("p .test").hide()

// 隐藏所有 id="test" 的元素
$("#test").hide()

```

- 链式语法

```js
$("#p1").css("color","red").slideUp(2000).slideDown(2000);

$("#p1").css("color","red")
  .slideUp(2000)
  .slideDown(2000);
```


## 文档就绪事件

- 所有 jQuery 函数位于一个 document ready 函数中,这是为了防止文档在完全加载（就绪）之前运行 jQuery 代码

```js
$(document).ready(function(){
   // 开始写 jQuery 代码...
});

$(function () {
    // 开始写 jQuery 代码...
});
```

## 选择器

```js
// 元素选择器
$("p")

// id选择器
$("#id")

// class选择器
$(".test")

// css选择器
$("p").css("background-color","red");
```

- 常用的选择器

```js
// 选取所有元素
$("*")

// 当前元素
$(this)

// 选取class为intro的<p>元素
$("p.intro")

// 选取第一个<p>元素
$("p:first")

// 选取<ul>元素的第一个<li>元素
$("ul li:first")

//选取每个 <ul> 元素的第一个 <li> 元素
$("ul li:first-child")

// 选取带有 href 属性的元素
$("[href]")

//选取所有 target 属性值等于 "_blank" 的 <a> 元素
$("a[target='_blank']")

// 选取所有 target 属性值不等于 "_blank" 的 <a> 元素
$("a[target!='_blank']")

// 选取所有 type="button" 的 <input> 元素 和 <button> 元素
$(":button")

// 选取偶数位置的 <tr> 元素
$("tr:even")

// 选取奇数位置的 <tr> 元素
$("tr:odd")
```

## 事件

- [jQuery绑定事件方法及区别(bind,click,on,live,one)](https://www.jb51.net/article/121130.htm)
- [.on()](https://www.jquery123.com/on/)

鼠标事件   | 键盘事件 | 表单事件 | 文档/窗口事件
-----------|----------|----------|--------
click      | keypress | submit   | load
dblclick   | keydown  | change   | resize
mouseenter | keyup    | focus    | scroll
mouseleave |          | blur     | unload

- **jQuery 1.7之后，事件绑定统一使用.on()方法，相应的取消绑定使用off()方法**
- **要绑定一个事件，并且只运行一次，然后删除自己， 请参阅.one()**

## jQuery效果

### 显示/隐藏

- $(selector)选中的元素的个数为n个，则callback函数会执行n次
- callback函数名后加括号，会立刻执行函数体，而不是等到显示/隐藏完成后才执行
- callback既可以是函数名，也可以是匿名函数

```js
// 可选的 speed 参数规定隐藏/显示的速度，可以取以下值："slow"、"fast" 或毫秒
// 可选的 callback 参数是隐藏或显示完成后所执行的函数名称
$(selector).hide(speed,callback);
$(selector).show(speed,callback);

// 切换 hide() 和 show() 方法
$(selector).toggle();
```

```js
$("#hide").click(function(){
  $("p").hide();
});

$("#show").click(function(){
  $("p").show();
});

$("button").click(function(){
  $("p").hide(1000);
});

$("button").click(function(){
  $("p").toggle();
});
```

### 淡入淡出

```js
$(selector).fadeIn(speed,callback);
$(selector).fadeOut(speed,callback);
$(selector).fadeToggle(speed,callback);

//fadeTo() 方法中必需的 opacity 参数将淡入淡出效果设置为给定的不透明度（值介于 0 与 1 之间）。
$(selector).fadeTo(speed,opacity,callback);
```

### 滑动

```js
// 向下滑动元素
$(selector).slideDown(speed,callback);

// 向上滑动元素
$(selector).slideUp(speed,callback);

// slideToggle() 方法可以在 slideDown() 与 slideUp() 方法之间进行切换
$(selector).slideToggle(speed,callback);
```

### 动画

- 基本动画

```js
// 必需的 params 参数定义形成动画的 CSS 属性
// 可选的 speed 参数规定效果的时长。它可以取以下值："slow"、"fast" 或毫秒
// 可选的 callback 参数是动画完成后所执行的函数名称
$(selector).animate({params},speed,callback);
```

```js
$("button").click(function(){
  $("div").animate({left:'250px'});
});

// 默认情况下，所有 HTML 元素都有一个静态位置，且无法移动。
// 如需对位置进行操作，要记得首先把元素的 CSS position 属性设置为 relative、fixed 或 absolute！
```

- 操作多个属性

```js
$("button").click(function(){
  $("div").animate({
    left:'250px',
    opacity:'0.5',
    height:'150px',
    width:'150px'
  });
});
```

- **使用相对值,需要在值的前面加上 += 或 -=**

```js
$("button").click(function(){
  $("div").animate({
    left:'250px',
    height:'+=150px',
    width:'+=150px'
  });
});
```

- 使用预先定义的值,可以把属性的动画值设置为 "show"、"hide" 或 "toggle"

```js
$("button").click(function(){
  $("div").animate({
    height:'toggle'
  });
});
```

- jQuery 提供针对动画的队列功能,如果您在彼此之后编写多个animate() 调用，**jQuery会创建包含这些方法调用的"内部"队列。然后逐一运行这些 animate 调用**

```js
$("button").click(function(){
  var div=$("div");
  div.animate({height:'300px',opacity:'0.4'},"slow");
  div.animate({width:'300px',opacity:'0.8'},"slow");
  div.animate({height:'100px',opacity:'0.4'},"slow");
  div.animate({width:'100px',opacity:'0.8'},"slow");
});

$("button").click(function(){
  var div=$("div");
  div.animate({left:'100px'},"slow");
  div.animate({fontSize:'3em'},"slow");
});
```

- 停止动画

```js
$(selector).stop(stopAll,goToEnd);

// 可选的stopAll参数规定是否应该清除动画队列。默认是false,即仅停止活动的动画，允许任何排入队列的动画向后执行。
// 可选的 goToEnd 参数规定是否立即完成当前动画。默认是 false。
// 默认地，stop() 会清除在被选元素上指定的当前动画。
```

- 色彩动画并不包含在核心 jQuery 库中

## jQuery HTML

### 获取与设置

- text() - 设置或返回所选元素的文本内容
- html() - 设置或返回所选元素的内容（包括 HTML 标记）
- val() - 设置或返回表单字段的值
- attr() 方法用于获取属性值
- text()、html() 以及 val()，同样拥有回调函数。回调函数有两个参数：**被选元素列表中当前元素的下标，以及原始（旧的）值。然后以函数新值返回您希望使用的字符串**

```js
// 获取text()
$("#btn1").click(function(){
  alert("Text: " + $("#test").text());
});

// 设置text()
$("#btn1").click(function(){
  $("#test1").text("Hello world!");
});

// 设置text()
$("#btn1").click(function(){
  $("#test1").text(function(i,origText){
    return "Old text: " + origText + " New text: Hello world!
    (index: " + i + ")";
  });
});

$("#btn2").click(function(){
  alert("HTML: " + $("#test").html());
});

$("#btn2").click(function(){
  $("#test2").html("<b>Hello world!</b>");
});

$("#btn2").click(function(){
  $("#test2").html(function(i,origText){
    return "Old html: " + origText + " New html: Hello <b>world!</b> 
    (index: " + i + ")";
  });
});

$("#btn1").click(function(){
  alert("Value: " + $("#test").val());
});

$("#btn3").click(function(){
  $("#test3").val("Dolly Duck");
});

$("button").click(function(){
  alert($("#w3s").attr("href"));
});

$("button").click(function(){
  $("#w3s").attr("href","//www.w3cschool.cn/jquery");
});

$("button").click(function(){
  $("#w3s").attr({
    "href" : "//www.w3cschool.cn/jquery",
    "title" : "jQuery 教程"
  });
});

$("button").click(function(){
  $("#w3cschool").attr("href", function(i,origValue){
    return origValue + "/jquery";
  });
});
```

### 添加元素

- append() - 在被选元素内部的结尾插入指定内容
- prepend() - 在被选元素内部的开头插入指定内容
- after() - 在被选元素之后插入内容
- before() - 在被选元素之前插入内容

```js
$("p").append("Some appended text.");

$("p").prepend("Some prepended text.");

function appendText() {
    var txt1="<p>Text.</p>";               // 使用 HTML 标签创建文本  
    var txt2=$("<p></p>").text("Text.");   // 使用 jQuery 创建文本
    var txt3=document.createElement("p");
    txt3.innerHTML="文本。";               // 使用 DOM 创建文本 text with DOM
    $("p").append(txt1,txt2,txt3);         // 追加新元素
}

$("img").after("在后面添加文本");

$("img").before("在前面添加文本");

function afterText() {
    var txt1="<b>I </b>";                    // 使用 HTML 创建元素  
    var txt2=$("<i></i>").text("love ");     // 使用 jQuery 创建元素
    var txt3=document.createElement("big");  // 使用 DOM 创建元素
    txt3.innerHTML="jQuery!";
    $("img").after(txt1,txt2,txt3);          // 在图片后添加文本
}
```

### 删除元素

- remove() - 删除被选元素（及其子元素）
- remove() 方法也可接受一个参数，允许您对被删元素进行过滤
- empty() - 从被选元素中删除子元素

```js
$("#div1").remove();

// 删除 class="italic" 的所有 <p> 元素
$("p").remove(".italic");

$("#div1").empty();

```

### css

#### CSS类

- addClass() - 向被选元素添加一个或多个类
- removeClass() - 从被选元素删除一个或多个类
- toggleClass() - 对被选元素进行添加/删除类的切换操作
- css() - 设置或返回样式属性

```js
.important
 {
 font-weight:bold;
 font-size:xx-large;
 }

 .blue
 {
 color:blue;
 }


$("button").click(function(){
    // 单个元素
    $("div").addClass("important");
    // 多个元素
    $("h1,h2,p").addClass("blue");
});

$("button").click(function(){
    // 设置多个类
    $("#div1").addClass("important blue");
});

$("button").click(function(){
    $("h1,h2,p").removeClass("blue");
});

$("button").click(function(){
  $("h1,h2,p").toggleClass("blue");
});
```

#### css()方法

- css() 方法设置或返回被选元素的一个或多个样式属性

```js
$("p").css("background-color");

$("p").css("background-color","yellow");

$("p").css({"background-color":"yellow","font-size":"200%"});
```

### 尺寸

- ![jQuery 尺寸](../image-resources/web/img_jquerydim.gif)

## 遍历

### 祖先

- parent() 方法返回被选元素的直接父元素
- parents() 方法返回被选元素的所有祖先元素，它一路向上直到文档的根元素 (&lt;html&gt;)
- parentsUntil() 方法返回介于两个给定元素之间的所有祖先元素

```js
// 直接父元素
$(document).ready(function(){
  $("span").parent();
});

// 所有祖先元素
$(document).ready(function(){
  $("span").parents();
});

// 所在祖先中是ul的元素
$(document).ready(function(){
  $("span").parents("ul");
});

// 介于 <span> 与 <div> 元素之间的所有祖先元素
$(document).ready(function(){
  $("span").parentsUntil("div");
});
```

### 后代

- children() 方法返回被选元素的所有直接子元素
- find() 方法返回被选元素的后代元素，一路向下直到最后一个后代

```js
// 每个 <div> 元素的所有直接子元素
$(document).ready(function(){
  $("div").children();
});

// 类名为 "1" 的所有 <p> 元素，并且它们是 <div> 的直接子元素
$(document).ready(function(){
  $("div").children("p.1");
});

// 返回属于 <div> 后代的所有 <span> 元素
$(document).ready(function(){
  $("div").find("span");
});

// 返回 <div> 的所有后代
$(document).ready(function(){
  $("div").find("*");
});
```

### 同胞

- siblings() 方法返回被选元素的所有同胞元素
- next() 方法返回被选元素的下一个同胞元素，**该方法只返回一个元素**
- nextAll() 方法返回被选元素的所有跟随的同胞元素
- nextUntil() 方法返回介于两个给定参数之间的所有跟随的同胞元素
- prev(), prevAll() 以及 prevUntil() 方法的工作方式与上面的方法类似，只不过方向相反而已：它们返回的是前面的同胞元素

```js
// 返回 <h2> 的所有同胞元素
$(document).ready(function(){
  $("h2").siblings();
});

// <h2> 的同胞元素的所有 <p> 元素
$(document).ready(function(){
  $("h2").siblings("p");
});

//  <h2> 的所有跟随的同胞元素
$(document).ready(function(){
  $("h2").nextAll();
});

// 返回介于 <h2> 与 <h6> 元素之间的所有同胞元素
$(document).ready(function(){
  $("h2").nextUntil("h6");
});
```

### 过滤

- first() 方法返回被选元素的首个元素
- last() 方法返回被选元素的最后一个元素
- eq() 方法返回被选元素中带有指定索引号的元素
- filter() 方法允许您规定一个标准。不匹配这个标准的元素会被从集合中删除，匹配的元素会被返回，**返回的是集合**
- not() 方法返回不匹配标准的所有元素，**返回的是集合**

```js
$(document).ready(function(){
  $("div p").first();
});

$(document).ready(function(){
  $("div p").last();
});

$(document).ready(function(){
  $("p").eq(1);
});

$(document).ready(function(){
  $("p").filter(".intro");
});

$(document).ready(function(){
  $("p").not(".intro");
});
```