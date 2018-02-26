# GolangWeb

- [表单](#表单)
    - [表单的enctype属性](#表单的enctype属性)
    - [golang对form body的处理](#golang对form-body的处理)
    - [验证表达的输入](#验证表达的输入)
        - [校验必填参数](#校验必填参数)
        - [常用的一些校验](#常用的一些校验)
    - [预防跨站脚本](#预防跨站脚本)
    - [防止多次递交表单](#防止多次递交表单)
- [Session劫持](#session劫持)
    - [cookieonly和token](#cookieonly和token)
    - [间隔生成新的SID](#间隔生成新的sid)

## 表单

### 表单的enctype属性

- enctype 属性规定在发送到服务器之前应该如何对表单数据进行编码
- 默认地，表单数据会编码为 "application/x-www-form-urlencoded"。就是说，在发送到服务器之前，所有字符都会进行编码（空格转换为 "+" 加号，特殊符号转换为 ASCII HEX 值）
- application/x-www-form-urlencoded   表示在发送前编码所有字符（默认）
- multipart/form-data   不对字符编码。在使用包含文件上传控件的表单时，必须使用该值。
- text/plain    空格转换为 "+" 加号，但不对特殊字符编码

### golang对form body的处理

- **默认情况下，Handler里面是不会自动解析form的，必须显式的调用r.ParseForm()后，才能对这个表单数据进行操作**
- **r.Form里面包含了所有请求的参数，比如URL中query-string、POST的数据、PUT的数据，所以当你在URL中的query-string字段和POST冲突时，会保存成一个slice，里面存储了多个值**
- FormValue()
    - **request本身也提供了FormValue()函数来获取用户提交的参数**。如r.Form["username"]也可写成r.FormValue("username")。
    - **调用r.FormValue时会自动调用r.ParseForm，所以不必提前调用。**
    - **r.FormValue只会返回同名参数中的第一个**，若参数不存在则返回空字符串

### 验证表达的输入

#### 校验必填参数

#### 常用的一些校验

```golang
// 是否是数字
getint,err:=strconv.Atoi(r.Form.Get("age"))
if err! = nil{
    //数字转化出错了，那么可能就不是数字
}
if m, _ := regexp.MatchString("^[0-9]+$", r.Form.Get("age")); !m {
    return false
}

// 是否是中文
// 可以使用 unicode 包提供的 func Is(rangeTab *RangeTable, r rune) bool 来验证
if m, _ := regexp.MatchString("^\\p{Han}+$", r.Form.Get("realname")); !m {
    return false
}

// 是否是英文
if m, _ := regexp.MatchString("^[a-zA-Z]+$", r.Form.Get("engname")); !m {
    return false
}

// 是否是Email
if m, _ := regexp.MatchString(`^([\w\.\_]{2,10})@(\w{1,}).([a-z]{2,4})$`, r.Form.Get("email")); !m {
    return false
}

//下拉菜单

//<select name="fruit">
//<option value="apple">apple</option>
//<option value="pear">pear</option>
//<option value="banana">banana</option>
//</select>
那么我们可以这样来验证

slice:=[]string{"apple","pear","banana"}

v := r.Form.Get("fruit")
for _, item := range slice {
    if item == v {
        return true
    }
}
return false

//单选菜单
//<input type="radio" name="gender" value="1">男
//<input type="radio" name="gender" value="2">女

slice:=[]string{"1","2"}

for _, v := range slice {
    if v == r.Form.Get("gender") {
        return true
    }
}
return false
```

### 预防跨站脚本

### 防止多次递交表单

- 原理：
    - 在服务器为一次请求生成一个唯一标识token，token保存在服务器
    - 在请求中将token当作隐式参数传给客户端，客户端在请求时带上token
    - 服务器在收到请求时，判断token的正确性，并且处理完成后，将token移除
    - 如果客户端再次提交并且token没变，服务器因为token失效，就可以忽略这次请求

## Session劫持

- 在session技术中，客户端和服务端通过session的标识符来维护会话， 但这个标识符很容易就能被嗅探到，从而被其他人利用。它是中间人攻击的一种类型

### cookieonly和token

- **第一步，sessionID的值只允许cookie设置，而不是通过URL重置方式设置，同时设置cookie的httponly为true**,这个属性是设置是否可通过客户端脚本访问这个设置的cookie
    - 第一这个可以防止这个cookie被XSS读取从而引起session劫持
    - 第二cookie设置不会像URL重置方式那么容易获取sessionID
- **第二步，每个请求里面加上token**，实现类似防止form重复递交类似的功能，我们在每个请求里面加上一个隐藏的token，然后每次验证这个token，从而保证用户的请求都是唯一性

```golang
h := md5.New()
salt:="astaxie%^7&8888"
io.WriteString(h,salt+time.Now().String())
token:=fmt.Sprintf("%x",h.Sum(nil))
if r.Form["token"]!=token{
    //提示登录
}
sess.Set("token",token)
```

### 间隔生成新的SID

- **我们给session额外设置一个创建时间的值，一旦过了一定的时间，我们销毁这个sessionID，重新生成新的session**，这样可以一定程度上防止session劫持的问题

```golang
createtime := sess.Get("createtime")
if createtime == nil {
    sess.Set("createtime", time.Now().Unix())
} else if (createtime.(int64) + 60) < (time.Now().Unix()) {
    globalSessions.SessionDestroy(w, r)
    sess = globalSessions.SessionStart(w, r)
}
```