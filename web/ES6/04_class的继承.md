# Class 的继承

-   [构造函数](#构造函数)
-   [Object.getPrototypeOf()](#objectgetprototypeof)
-   [super](#super)
    -   [当作函数调用](#当作函数调用)
    -   [当作对象调用](#当作对象调用)
-   [类的 prototype 属性和**proto**属性](#类的-prototype-属性和__proto__属性)
    -   [实例的**proto**属性](#实例的__proto__属性)
-   [原先构造函数的继承](#原先构造函数的继承)
-   [mixin](#mixin)

## 构造函数

-   ES5 的继承，实质是先创造子类的实例对象 this，然后再将父类的方法添加到 this 上面（Parent.apply(this)）。ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到 this 上面（所以必须先调用 super 方法），然后再用子类的构造函数修改 this
-   **子类的构造函数必须调用父类的的构造函数**，这是因为子类自己的 this 对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用 super 方法，子类就得不到 this 对象
-   必须先调用父类的构造函数，才能使用关键字

```js
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class ColorPoint extends Point {
    constructor(x, y, color) {
        super(x, y); // 调用父类的constructor(x, y)
        this.color = color;
    }

    toString() {
        return this.color + ' ' + super.toString(); // 调用父类的toString()
    }
}
```

## Object.getPrototypeOf()

-   Object.getPrototypeOf 方法可以用来从子类上获取父类

```js
Object.getPrototypeOf(ColorPoint) === Point;
// true
```

## super

### 当作函数调用

-   super 作为函数调用时，代表父类的构造函数。ES6 要求，子类的构造函数必须执行一次 super 函数

### 当作对象调用

-   **super 作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类**

```js
class A {
    p() {
        return 2;
    }
}

class B extends A {
    constructor() {
        super();
        console.log(super.p()); // 2
    }
}

let b = new B();
```

-   **由于 super 指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过 super 调用的**

```js
class A {
    constructor() {
        this.p = 2;
    }
}

class B extends A {
    get m() {
        return super.p;
    }
}

// p是父类的实例属性，super无法引用到
let b = new B();
b.m; // undefined

class A {}
A.prototype.x = 2;

class B extends A {
    constructor() {
        super();
        console.log(super.x); // 2
    }
}
// 这个是定义在父类的原型对象上的，super可以取到
let b = new B();
```

-   ES6 规定，**在子类普通方法中通过 super 调用父类的方法时，方法内部的 this 指向当前的子类实例**

```js
class A {
    constructor() {
        this.x = 1;
    }

    print() {
        console.log(this.x);
    }
}

class B extends A {
    constructor() {
        super();
        this.x = 2;
    }

    m() {
        // 调用方法时，this指向的是当前的对象
        // 所以返回的是this.x,也就是2
        // 相当于super.print.call(this)
        super.print();
    }
}

let b = new B();
b.m(); // 2
```

```js
class A {
    constructor() {
        this.x = 1;
    }
}

class B extends A {
    constructor() {
        super();
        this.x = 2;
        super.x = 3;
        console.log(super.x); // undefined
        console.log(this.x); // 3
    }
}

let b = new B();
```

-   由于 this 指向子类实例，所以如果通过 super 对某个属性赋值，这时 super 就是 this，赋值的属性会变成子类实例的属性

```js
class A {
    constructor() {
        this.x = 1;
    }
}

class B extends A {
    constructor() {
        super();
        this.x = 2;
        // super.x赋值为3，这时等同于对this.x赋值为3
        super.x = 3;
        // 读取super.x的时候，读的是A.prototype.x，所以返回undefined
        console.log(super.x); // undefined
        console.log(this.x); // 3
    }
}

let b = new B();
```

-   如果 super 作为对象，用在静态方法之中，这时 super 将指向父类，而不是父类的原型对象

```js
class Parent {
    static myMethod(msg) {
        console.log('static', msg);
    }

    myMethod(msg) {
        console.log('instance', msg);
    }
}

class Child extends Parent {
    static myMethod(msg) {
        // 实际调用的是父类的static myMethod
        super.myMethod(msg);
    }

    myMethod(msg) {
        super.myMethod(msg);
    }
}

Child.myMethod(1); // static 1

var child = new Child();
child.myMethod(2); // instance 2
```

-   在子类的静态方法中通过 super 调用父类的方法时，方法内部的 this 指向当前的子类，而不是子类的实例

```js
class A {
    constructor() {
        this.x = 1;
    }
    static print() {
        console.log(this.x);
    }
}

class B extends A {
    constructor() {
        super();
        this.x = 2;
    }
    static m() {
        super.print();
    }
}

// 目前静态属性只能这么写
B.x = 3;
// 子类静态方法中的this,实际指的是子类
// 确定不是父类，否则这里就是返回的是undefined了
B.m(); // 3
```

-   使用 super 时，必须明确的指明是函数调用还是对象

```js
class A {}

class B extends A {
    constructor() {
        super();
        // super.valueOf(),说吸super是一个对象
        console.log(super.valueOf() instanceof B); // true
    }
}

let b = new B();
```

## 类的 prototype 属性和**proto**属性

-   Class 作为构造函数的语法糖，同时有 prototype 属性和**proto**属性，因此同时存在两条继承链
    -   子类的**proto**属性，表示构造函数的继承，总是指向父类
    -   子类 prototype 属性的**proto**属性，表示方法的继承，总是指向父类的 prototype 属性
-   理解两条原型链：
    -   **作为一个对象，子类（B）的原型（**proto**属性）是父类（A）**
    -   作为一个构造函数，子类（B）的原型对象（prototype 属性）是父类的原型对象（prototype 属性）的实例

```js
class A {}

class B extends A {}

B.__proto__ === A; // true
B.prototype.__proto__ === A.prototype; // true
```

-   类的继承是按照下面的模式实现的

```js
class A {}

class B {}

// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype);

// B 继承 A 的静态属性
Object.setPrototypeOf(B, A);

const b = new B();

// 具体的实现
Object.setPrototypeOf = function(obj, proto) {
    obj.__proto__ = proto;
    return obj;
};

Object.setPrototypeOf(B.prototype, A.prototype);
// 等同于
B.prototype.__proto__ = A.prototype;

Object.setPrototypeOf(B, A);
// 等同于
B.__proto__ = A;
```

-   extends 关键字后面可以跟多种类型的值,下面代码的 A，只要是一个有 prototype 属性的函数，就能被 B 继承。由于函数都有 prototype 属性（除了 Function.prototype 函数），因此 A 可以是任意函数

```js
class B extends A {}
```

-   子类继承 Object

```js
class A extends Object {}

// A其实就是构造函数Object的复制，A的实例就是Object的实例
A.__proto__ === Object; // true
A.prototype.__proto__ === Object.prototype; // true
```

```js
class A {}

//A作为一个基类（即不存在任何继承），就是一个普通函数，所以直接继承Function.prototype。
// 但是，A调用后返回一个空对象（即Object实例），所以A.prototype.__proto__指向构造函数（Object）的prototype属性
A.__proto__ === Function.prototype; // true
A.prototype.__proto__ === Object.prototype; // true
```

### 实例的**proto**属性

-   **子类实例的**proto**属性的**proto**属性，指向父类实例的**proto**属性**

```js
var p1 = new Point(2, 3);
var p2 = new ColorPoint(2, 3, 'red');

p2.__proto__ === p1.__proto__; // false
p2.__proto__.__proto__ === p1.__proto__; // true
```

-   通过子类实例的**proto**.**proto**属性，可以修改父类实例的行为

```js
p2.__proto__.__proto__.printName = function() {
    console.log('Ha');
};

p1.printName(); // "Ha"
```

## 原先构造函数的继承

-   语言内置的构造函数，通常用来生成数据结构

    -   Boolean()
    -   Number()
    -   String()
    -   Array()
    -   Date()
    -   Function()
    -   RegExp()
    -   Error()
    -   Object()

-   es5 中，这些原先的构造函数无法继承
-   **ES5 是先新建子类的实例对象 this，再将父类的属性添加到子类上**，由于父类的内部属性无法获取，导致无法继承原生的构造函数
-   **ES6 允许继承原生构造函数定义子类，因为 ES6 是先新建父类的实例对象 this**，然后再用子类的构造函数修饰 this，使得父类的所有行为都可以继承

```js
function MyArray() {
    Array.apply(this, arguments);
}

MyArray.prototype = Object.create(Array.prototype, {
    constructor: {
        value: MyArray,
        writable: true,
        configurable: true,
        enumerable: true
    }
});

// es5的原生构造函数无法继承
var colors = new MyArray();
colors[0] = 'red';
colors.length; // 0

colors.length = 0;
colors[0]; // "red"
```

```js
class MyArray extends Array {
    constructor(...args) {
        super(...args);
    }
}

var arr = new MyArray();
arr[0] = 12;
arr.length; // 1

arr.length = 0;
arr[0]; // undefined
```

-   Object 子类的行为差异
-   ES6 改变了 Object 构造函数的行为，一旦发现 Object 方法不是通过 new Object()这种形式调用，ES6 规定 Object 构造函数会忽略参数

```js
class NewObj extends Object {
    constructor() {
        super(...arguments);
    }
}
var o = new NewObj({ attr: true });
o.attr === true; // false
```

## mixin

```js
function mix(...mixins) {
    class Mix {}

    for (let mixin of mixins) {
        copyProperties(Mix.prototype, mixin); // 拷贝实例属性
        copyProperties(Mix.prototype, Reflect.getPrototypeOf(mixin)); // 拷贝原型属性
    }

    return Mix;
}

function copyProperties(target, source) {
    for (let key of Reflect.ownKeys(source)) {
        if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
            let desc = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, desc);
        }
    }
}

class DistributedEdit extends mix(Loggable, Serializable) {
    // ...
}
```
