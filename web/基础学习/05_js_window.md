# Window

## 简介

- 所有浏览器都支持 window 对象。它表示浏览器窗口。
- 所有 JavaScript 全局对象、函数以及变量均自动成为 window 对象的成员。**全局变量是 window 对象的属性。全局函数是 window 对象的方法。甚至 HTML DOM 的 document 也是 window 对象的属性之一**

### Window的子对象

- Window的子对象主要有如下几个：
    - JavaScript document 对象
    - JavaScript frames 对象
    - JavaScript history 对象
    - JavaScript location 对象
    - JavaScript navigator 对象
    - JavaScript screen 对象

### Window常用的一些方法

```js
// 浏览器窗口的尺寸
var w=window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var h=window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

window.open()      // - 打开新窗口
window.close()     // - 关闭当前窗口
window.moveTo()    // - 移动当前窗口
window.resizeTo()  //- 调整当前窗口的尺寸
```

## Screen

- screen.availWidth screen.availHeight 属性返回访问者屏幕的宽度/高度，以像素计，减去界面特性，比如窗口任务栏

```js
<script>
document.write("可用高度: " + screen.availHeight);
</script>
```

## Location

- window.location 对象用于获得当前页面的地址 (URL)，并把浏览器重定向到新的页面。这种方法既可以用于具有onclick事件的标签，也可以用于满足某些条件进行跳转，特点是方便且灵活

```js
// 返回 web 主机的域名
location.hostname

// 返回当前页面的路径和文件名
location.pathname

// 返回 web 主机的端口 （80 或 443）
location.port

// 返回所使用的 web 协议（http:// 或 https://)
location.protocol

//返回当前页面的 URL
location.href

//方法加载新的文档
window.location.assign("http://www.w3cschool.cn")
```

## History

```js
// 与在浏览器点击后退按钮相同
history.back()

//与在浏览器中点击向前按钮向前相同
history.forward()
```

## Navigator

- window.navigator 对象包含有关访问者浏览器的信息

```js
<div id="example"></div>

<script>

txt = "<p>Browser CodeName: " + navigator.appCodeName + "</p>";
txt+= "<p>Browser Name: " + navigator.appName + "</p>";
txt+= "<p>Browser Version: " + navigator.appVersion + "</p>";
txt+= "<p>Cookies Enabled: " + navigator.cookieEnabled + "</p>";
txt+= "<p>Platform: " + navigator.platform + "</p>";
txt+= "<p>User-agent header: " + navigator.userAgent + "</p>";
txt+= "<p>User-agent language: " + navigator.systemLanguage + "</p>";
document.getElementById("example").innerHTML=txt;

</script>
```

- 来自 navigator 对象的信息具有误导性，不应该被用于检测浏览器版本
- 由于不同的浏览器支持不同的对象，您可以使用对象来检测浏览器。例如，由于只有 Opera 支持属性 "window.opera"，您可以据此识别出 Opera

```js
if (window.opera) {...some action...}
```

## 弹窗

- 警告弹窗

```js
window.alert("sometext");
```

- 确认框

```js
window.confirm("sometext");

var r = window.confirm("按下按钮");
if (r==true) {
    x="你按下了\"确定\"按钮!";
} else {
    x="你按下了\"取消\"按钮!";
}
```

- 提示框

```js
window.prompt("sometext","defaultvalue");

var person = window.prompt("请输入你的名字","Harry Potter");
if (person!=null && person!="") {
    x="你好 " + person + "！今天感觉如何？";
}
```

## Cookies

### 创建Cookie

- 创建cookie如下

```js
document.cookie="username=John Doe";

// 指定过期时间，默认情况下，cookie 在浏览器关闭时删除
document.cookie="username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 GMT";

// 使用 path 参数告诉浏览器 cookie 的路径。默认情况下，cookie 属于当前页面
document.cookie="username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 GMT; path=/";
```

### 读取Cookie

- **document.cookie 将以字符串的方式返回所有的 cookies**，类型格式： cookie1=value; cookie2=value; cookie3=value;

```js
var x = document.cookie;
```

### 修改Cookie

- 修改 cookies 类似于创建 cookies

```js
document.cookie="username=John Smith; expires=Thu, 18 Dec 2013 12:00:00 GMT; path=/";
```

### 删除Cookie

- **删除 cookie 非常简单。您只需要设置 expires 参数为以前的时间即可**，如下所示，设置为 Thu, 01 Jan 1970 00:00:00 GMT
- 删除时不必指定 cookie 的值

```js
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
```

```js
var COOKIE_NICKNAME = "nickname";

// cookie
function setCookie(key, value, expiredDays) {
    var d = new Date();
    d.setTime(d.getTime() + expiredDays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = key + "=" + value + ";" + expires;
}

function getCookie(key) {
    var name = key + "=";
    var cookie = document.cookie.split(";");
    for (var i = 0; i < cookie.length; i++) {
        var v = cookie[i].trim();
        if (v.indexOf(name) === 0) {
            return v.substring(name.length, v.length)
        }
        return "";
    }
}
```