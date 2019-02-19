# Interface And Class

## 接口

-   在 TypeScript 里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约
-   **与 golang 一样，不需要显示的 implements 接口**
-   **接口不仅可以是方法，还可以是属性**

```ts
interface LabelledValue {
    label: string;
}

function printLabel(labelledObj: LabelledValue) {
    console.log(labelledObj.label);
}

let myObj = { size: 10, label: 'Size 10 Object' };
printLabel(myObj);
```

### 可选属性

-   **接口里的属性不全都是必需的。 有些是只在某些条件下存在，或者根本不存在**。 可选属性在应用“option bags”模式时很常用，即给函数传入的参数对象中只有部分属性赋值了
-   **可选属性用?表示**
-   好处
    -   可以对可能存在的属性进行预定义
    -   可以捕获引用了不存在的属性时的错误

```ts
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    let newSquare = { color: 'white', area: 100 };
    if (config.color) {
        newSquare.color = config.color;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}

let mySquare = createSquare({ color: 'black' });
```

### 只读属性

-   一些对象属性只能在对象刚刚创建的时候修改其值

```ts
interface Point {
    readonly x: number;
    readonly y: number;
}
```

-   可以通过赋值一个对象字面量来构造一个 Point。 赋值后，x 和 y 再也不能被改变了

```ts
let p1: Point = { x: 10, y: 20 };
p1.x = 5; // error!
```

```ts
// ReadonlyArray 与Array类似，不过不能再修改了
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!
```

#### readonly vs const

-   做为变量使用的话用 const，若做为属性则使用 readonly

### 额外的属性检查

-   对象字面量会被特殊对待而且会经过额外属性检查，当将它们赋值给变量或作为参数传递的时候。**如果一个对象字面量存在任何“目标类型”不包含的属性时，你会得到一个错误**

```ts
interface SquareConfig {
    color?: string;
    width?: number;
}

// error: 'colour' not expected in type 'SquareConfig'
let mySquare = createSquare({ colour: 'red', width: 100 });
```

-   解决办法
    -   类型断言
    -   添加一个字符串索引签名
    -   将这个对象赋值给一个另一个变量

```ts
// 使用类型断言
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);

// 最佳实现
// 在这里表示SquareConfig可能有任意数量的其它类型的属性
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}

// 只有字面常量才会有额外的类型检查
// 一般不要这么做，因为这个一般都会是代码bug
let squareOptions = { colour: 'red', width: 100 };
let mySquare = createSquare(squareOptions);
```

### 函数类型

-   与其它语言一样的函数签名
-   函数的参数名不需要与接口里定义的名字相匹配

```ts
interface SearchFunc {
    (source: string, subString: string): boolean;
}
```

```ts
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    let result = source.search(subString);
    return result > -1;
};

let mySearch: SearchFunc;
mySearch = function(src: string, sub: string): boolean {
    let result = src.search(sub);
    return result > -1;
};
```

### 可索引的类型

-   **可索引类型具有一个索引签名，它描述了对象索引的类型，还有相应的索引返回值类型**

```ts
interface StringArray {
    [index: number]: string;
}

let myArray: StringArray;
myArray = ['Bob', 'Fred'];

let myStr: string = myArray[0];
```

-   索引相关
    -   Typescript 支持两种索引签名：字符串和数字。
    -   可以同时使用两种类型的索引，但是**数字索引的返回值类型必须是字符串索引返回值类型的子类型**， 这是因为当使用 number 来索引时，JavaScript 会将它转换成 string 然后再去索引对象。 也就是说用 100（一个 number）去索引等同于使用"100"（一个 string）去索引，因此两者需要保持一致

```ts
class Animal {
    name: string;
}
class Dog extends Animal {
    breed: string;
}

// 错误：使用数值型的字符串索引，有时会得到完全不同的Animal!
interface NotOkay {
    [x: number]: Animal;
    [x: string]: Dog;
}
```

-   **字符串索引签名能够很好的描述 dictionary 模式，并且它们也会确保所有属性与其返回值类型相匹配**

```ts
interface NumberDictionary {
    // 定义了字符串索引，也就是定义了所有的属性其返回类型要一致
    // 这里也就是定义了所有的属性类型都必须为number
    [index: string]: number;
    length: number; // 可以，length是number类型
    name: string; // 错误，`name`的类型与索引类型返回值的类型不匹配
}
```

-   将索引签名设置为只读，这样就防止了给索引赋值

```ts
interface ReadonlyStringArray {
    readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ['Alice', 'Bob'];
// 因为索引签名是只读的
myArray[2] = 'Mallory'; // error!
```

### 类类型实现接口

-   可以像 java 一样，使用 implements 实现接口
-   **接口描述的是类的公共部分**

```ts
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}

class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) {}
}
```

### 类的静态部分与实例部分

-   当你操作类和接口的时候，你要知道**类是具有两个类型的：静态部分的类型和实例的类型。 你会注意到，当你用构造器签名去定义一个接口并试图定义一个类去实现这个接口时会得到一个错误**

```ts
interface ClockConstructor {
    new (hour: number, minute: number);
}

// 错误
// 因为当一个类实现了一个接口时，只对其实例部分进行类型检查。 constructor存在于类的静态部分，所以不在检查的范围内
class Clock implements ClockConstructor {
    currentTime: Date;
    constructor(h: number, m: number) {}
}
```

```ts
interface ClockConstructor {
    new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
    tick();
}

function createClock(
    ctor: ClockConstructor,
    hour: number,
    minute: number
): ClockInterface {
    return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
    constructor(h: number, m: number) {}
    tick() {
        console.log('beep beep');
    }
}
class AnalogClock implements ClockInterface {
    constructor(h: number, m: number) {}
    tick() {
        console.log('tick tock');
    }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);
```

```ts
interface ClockConstructor {
    new (hour: number, minute: number);
}

interface ClockInterface {
    tick();
}

const Clock: ClockConstructor = class Clock implements ClockInterface {
    constructor(h: number, m: number) {}
    tick() {
        console.log('beep beep');
    }
};
```

### 接口继承

```ts
interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

// 可以继承多个接口
interface Square extends Shape, PenStroke {
    sideLength: number;
}

// 强转类型
let square = <Square>{};
square.color = 'blue';
square.sideLength = 10;
square.penWidth = 5.0;
```

### 混合类型

-   一个对象可以同时做为函数和对象使用，并带有额外的属性

```ts
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

// 第三方js库，可能要这么写
function getCounter(): Counter {
    let counter = <Counter>function(start: number): string {
        return '';
    };
    counter.interval = 123;
    counter.reset = function() {};
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

### 接口继承类

-   当接口继承了一个类类型时，它会继承类的成员但不包括其实现，**就好像接口声明了所有类中存在的成员，但并没有提供具体实现一样**
-   **接口同样会继承到类的 private 和 protected 成员， 这意味着当你创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现（implement）**

```ts
class Control {
    private state: any;
}

// 接口继承类，也会继承private和protected成员
// 所以这里SelectableContro也有state属性
//  因为只有Control的子类才能够拥有一个声明于Control的私有成员state这对私有成员的兼容性是必需的
// 所以只有Control的子类才能继承SelectableControl接口
interface SelectableControl extends Control {
    select(): void;
}

class Button extends Control implements SelectableControl {
    select() {}
}

class TextBox extends Control {
    select() {}
}

// Error: Property 'state' is missing in type 'Image'.
class Image implements SelectableControl {
    select() {}
}

class Location {}
```
