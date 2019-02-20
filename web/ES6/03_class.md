# Class

-   [ES6 Class 基础](#es6-class基础)
-   [constructor 方法、](#constructor方法)
-   [类的实例](#类的实例)
-   [get set](#get-set)
-   [属性表达式](#属性表达式)
-   [Class 表达式](#class表达式)
-   [注意点](#注意点)
    -   [不存在变量提升](#不存在变量提升)
    -   [name 属性](#name属性)
    -   [this 指向](#this指向)
    -   [静态方法](#静态方法)
    -   [实例属性写法](#实例属性写法)
    -   [静态属性](#静态属性)
    -   [私有属性与方法](#私有属性与方法)
    -   [new.target](#newtarget)

## ES6 Class 基础

-   ES6 的 class 可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的 class 写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已
    -   constructor 方法，这就是构造方法
    -   this 关键字则代表实例对象
    -   定义“类”的方法的时候，前面不需要加上 function 这个关键字
    -   事实上，**类的所有方法都定义在类的 prototype 属性上面**

```js
// es5
function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.toString = function() {
    return '(' + this.x + ', ' + this.y + ')';
};

var p = new Point(1, 2);

// es6写法
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
}

// 下面说明class只是一个语法糖
typeof Point; // function
Point === Point.prototype.contructor; // true
```

```js
class Point {
    constructor() {
        // ...
    }

    toString() {
        // ...
    }

    toValue() {
        // ...
    }
}

// 等同于
Point.prototype = {
    constructor() {},
    toString() {},
    toValue() {}
};
```

-   **es6 类的内部所有定义的方法，都是不可枚举的（non-enumerable）,这一点与 es5 不一致**

```js
// es6
class Point {
    constructor(x, y) {
        // ...
    }

    toString() {
        // ...
    }
}

Object.keys(Point.prototype);
// []
Object.getOwnPropertyNames(Point.prototype);
// ["constructor","toString"]

// es5
var Point = function(x, y) {
    // ...
};

Point.prototype.toString = function() {
    // ...
};

Object.keys(Point.prototype);
// ["toString"]
Object.getOwnPropertyNames(Point.prototype);
// ["constructor","toString"]
```

## constructor 方法、

-   **一个类必须有 constructor 方法**
-   如果没有显式定义，一个空的 constructor 方法会被默认添加
-   **类必须使用 new 调用**，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用 new 也可以执行

## 类的实例

-   与 ES5 一样，**实例的属性除非显式定义在其本身（即定义在 this 对象上），否则都是定义在原型上（即定义在 class 上）**

```js
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
}

var point = new Point(2, 3);

point.toString(); // (2, 3)

// x,y 都是定义在 this上
point.hasOwnProperty('x'); // true
point.hasOwnProperty('y'); // true
point.hasOwnProperty('toString'); // false
point.__proto__.hasOwnProperty('toString'); // true
```

-   与 es5 一样，类的所有实例共享一个原型对象
-   **可以通过实例的**proto**属性为“类”添加方法，最好用 Object.getPrototypeOf()**

```js
var p1 = new Point(2, 3);
var p2 = new Point(3, 2);

// 都指向Point.prototype
p1.__proto__ === p2.__proto__;
//true

// 也就是为其构造函数的prototype新增方法
p1.__proto__.printName = function() {
    return 'Oops';
};

p1.printName(); // "Oops"
p2.printName(); // "Oops"

var p3 = new Point(4, 2);
p3.printName(); // "Oops"
```

## get set

-   与 ES5 一样，在“类”的内部可以使用 get 和 set 关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为

```js
class MyClass {
    constructor() {
        // ...
    }
    get prop() {
        return 'getter';
    }
    set prop(value) {
        console.log('setter: ' + value);
    }
}

let inst = new MyClass();

inst.prop = 123;
// setter: 123

inst.prop;
// 'getter'
```

-   存值函数和取值函数是设置在属性的 Descriptor 对象上的

```js
class CustomHTMLElement {
    constructor(element) {
        this.element = element;
    }

    get html() {
        return this.element.innerHTML;
    }

    set html(value) {
        this.element.innerHTML = value;
    }
}

var descriptor = Object.getOwnPropertyDescriptor(
    CustomHTMLElement.prototype,
    'html'
);

'get' in descriptor; // true
'set' in descriptor; // true
```

## 属性表达式

-   类的属性名，可以采用表达式

```js
let methodName = 'getArea';

class Square {
    constructor(length) {
        // ...
    }

    // 方法名getArea，是从表达式得到的
    [methodName]() {
        // ...
    }
}
```

## Class 表达式

-   与函数一样，类也可以使用表达式的形式定义

```js
// 这个类的名字是MyClass而不是Me
// Me只在 Class 的内部代码可用，指代当前类
const MyClass = class Me {
    getClassName() {
        return Me.name;
    }
};

let inst = new MyClass();
inst.getClassName(); // Me
Me.name; // ReferenceError: Me is not defined

//  省略类名
const MyClass = class {
    /* ... */
};
```

-   采用 Class 表达式，可以写出立即执行的 Class

```js
let person = new class {
    constructor(name) {
        this.name = name;
    }

    sayName() {
        console.log(this.name);
    }
}('张三');

person.sayName(); // "张三"
```

## 注意点

-   类和模块的内部，默认是严格模式

### 不存在变量提升

```js
new Foo(); // ReferenceError
class Foo {}
```

### name 属性

```js
class Point {}

Point.Name; // Point
```

### this 指向

-   **类的内部，this 指向类的实例对象,但是，必须非常小心，一旦单独使用该方法，很可能报错。**
    -   解决办法 1：在构造方法中绑定 this，这样就不会找不到 print 方法了
    -   解决办法 2：使用箭头函数

```js
class Logger {
    printName(name = 'there') {
        this.print(`Hello ${name}`);
    }

    print(text) {
        console.log(text);
    }
}

const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
```

```js
class Logger {
    constructor() {
        this.printName = this.printName.bind(this);
    }

    // ...
}

class Logger {
    constructor() {
        this.printName = (name = 'there') => {
            this.print(`Hello ${name}`);
        };
    }

    // ...
}
```

### 静态方法

-   **类相当于实例的原型，所有在类中定义的方法，都会被实例继承**。
-   如果在一个方法前，加上 static 关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”

```js
class Foo {
    static classMethod() {
        return 'hello';
    }
}

Foo.classMethod(); // 'hello'

var foo = new Foo();
foo.classMethod();
// TypeError: foo.classMethod is not a function
```

-   static method 中的 this 指的是类，而不是实例

```js
class Foo {
    static bar() {
        this.baz();
    }
    static baz() {
        console.log('hello');
    }
    baz() {
        console.log('world');
    }
}

Foo.bar(); // hello
```

-   父类的静态方法，可以被子类继承

```js
class Foo {
    static classMethod() {
        return 'hello';
    }
}

class Bar extends Foo {}

Bar.classMethod(); // 'hello'
```

-   **静态方法也是可以从 super 对象上调用的**

```js
class Foo {
    static classMethod() {
        return 'hello';
    }
}

class Bar extends Foo {
    static classMethod() {
        return super.classMethod() + ', too';
    }
}

Bar.classMethod(); // "hello, too"
```

### 实例属性写法

-   实例属性除了写在 constructor 里面，还可以写在类的最顶层

```js
// 写在constructor中间，当作实例属性
class IncreasingCounter {
    constructor() {
        this._count = 0;
    }
    get value() {
        console.log('Getting the current value!');
        return this._count;
    }
    increment() {
        this._count++;
    }
}

class IncreasingCounter {
    // 写在与contructor同级的最顶层
    _count = 0;
    get value() {
        console.log('Getting the current value!');
        return this._count;
    }
    increment() {
        this._count++;
    }
}
```

### 静态属性

-   静态属性指的是 Class 本身的属性，即 Class.propName
-   目前只有下面这种写法可行，因为 ES6 明确规定，Class 内部只有静态方法，没有静态属性。

```js
class Foo {}

// 目前只有这种写法
Foo.prop = 1;
Foo.prop; // 1

// 新写法
// 但这种写法只是一种提案
class Foo {
    static prop = 1;
}
```

### 私有属性与方法

### new.target

-   ES6 为 new 命令引入了一个 new.target 属性，该属性一般用在构造函数之中，**返回 new 命令作用于的那个构造函数**
-   **如果构造函数不是通过 new 命令调用的，new.target 会返回 undefined，因此这个属性可以用来确定构造函数是怎么调用的**

```js
function Person(name) {
    if (new.target !== undefined) {
        this.name = name;
    } else {
        throw new Error('必须使用 new 命令生成实例');
    }
}

// 另一种写法
function Person(name) {
    if (new.target === Person) {
        this.name = name;
    } else {
        throw new Error('必须使用 new 命令生成实例');
    }
}

var person = new Person('张三'); // 正确
var notAPerson = Person.call(person, '张三'); // 报错
```

-   **Class 内部调用 new.target，返回当前 Class**

```js
class Rectangle {
    constructor(length, width) {
        console.log(new.target === Rectangle);
        this.length = length;
        this.width = width;
    }
}

var obj = new Rectangle(3, 4); // 输出 true
```

-   **子类继承父类时，new.target 会返回子类**,利用这个特点，可以写出不能独立使用、必须继承后才能使用的类

```js
class Rectangle {
    constructor(length, width) {
        console.log(new.target === Rectangle);
        // ...
    }
}

class Square extends Rectangle {
    constructor(length) {
        // 对于子类来说，new.target返回的是Square
        super(length, length);
    }
}

var obj = new Square(3); // 输出 false
```

```js
class Shape {
    constructor() {
        if (new.target === Shape) {
            throw new Error('本类不能实例化');
        }
    }
}

class Rectangle extends Shape {
    constructor(length, width) {
        super();
        // ...
    }
}

var x = new Shape(); // 报错
var y = new Rectangle(3, 4); // 正确
```
