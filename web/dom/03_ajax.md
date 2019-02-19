# AJAX

- js是单线程，而ajax则是异步的 JavaScript 和 XML

## XMLHttpRequest

- **XMLHttpRequest是整个ajax的基础**

### 创建

```js
var xmlhttp;
if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
} else {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}
```

### Header

```js
xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
```

### 发送

```js
open(method,url,async)
```

- 规定请求的类型、URL 以及是否异步处理请求。
    - method：请求的类型；GET 或 POST
    - url：文件在服务器上的位置
    - async：true（异步）或 false（同步）

```js
send(string)
```

- 将请求发送到服务器。string：仅用于 POST 请求

```js
xmlhttp.open("GET","ajax_info.txt",true);
xmlhttp.send();
```

### GET POST

```js
xmlhttp.open("GET","/try/ajax/demo_get.php",true);
xmlhttp.send();

xmlhttp.open("GET","/try/ajax/demo_get.php?t=" + Math.random(),true);
xmlhttp.send();

xmlhttp.open("GET","/try/ajax/demo_get2.php?fname=Henry&lname=Ford",true);
xmlhttp.send();

xmlhttp.open("POST","/try/ajax/demo_post.php",true);
xmlhttp.send();

xmlhttp.open("POST","/try/ajax/demo_post2.php",true);
xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xmlhttp.send("fname=Henry&lname=Ford");
```

### 响应

#### 返回数据

属性         | 描述
-------------|----------------
responseText | 获得字符串形式的响应数据。
responseXML  | 获得 XML 形式的响应数据。

#### readyState

- onreadystatechange 存储函数（或函数名），每当 readyState 属性改变时，就会调用该函数
- readyState,存有 XMLHttpRequest 的状态。从 0 到 4 发生变化
    - 0: 请求未初始化
    - 1: 服务器连接已建立
    - 2: 请求已接收
    - 3: 请求处理中
    - 4: 请求已完成，且响应已就绪
- status
    - 200: "OK"

```js
xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
    }
}
```

## jQuery.ajax()

- [jQuery.ajax()](http://api.jquery.com/jquery.ajax/)