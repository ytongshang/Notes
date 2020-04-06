# JS中this关键字详解

- [深入理解javascript原型和闭包（10）——this](https://www.cnblogs.com/wangfupeng1988/p/3988422.html)
- [JS中this关键字详解](https://www.cnblogs.com/lisha-better/p/5684844.html)

- 函数的以下几种调用方式, **不管函数是按哪种方法来调用的，谁调用这个函数或方法,this关键字就指向谁**
    - 普通函数调用
    - 作为对象的方法来调用
    - 作为构造函数来调用
    - 使用apply/call方法来调用
    - Function.prototype.bind方法
    - es6箭头函数

## 普通函数调用

```js
function person1() {
    this.name = "person1";
    console.log(this);
    console.log(this.name);
}

person1();
// Window
// person1
```

- person1函数作为普通函数调用，实际上person1是作为全局对象window的一个方法来进行调用的,即window.person1();
- 所以这个地方是window对象调用了person方法,那么person函数当中的this即指window,同时window还拥有了另外一个属性name,值为"person1"

## 作为方法来调用

```js
    var name2 = "WindowName2";
    var person2 = {
        name2: "person2Name2",
        showName: function () {
            console.log(this.name2);
        }
    };

    person2.showName();   // person2Name2
    // showName作为person2的方法来调用，所以this指向person2,所以输出为person2Name2

    var person2ShowName = person2.showName;
    // 将person2.showName赋值给person2ShowName，而person2ShowName是作为window的一个属性
    // 调用person2ShowName实际就是作为window的一个方法来调用，所以这里是外部的全局变量，也就是WindowName2
    person2ShowName(); // WindowName2
```