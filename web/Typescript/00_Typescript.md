# Typescript

## 基础类型

-   模版字符串
-   枚举
-   any 允许你在编译时可选择地包含或移除类型检查
-   void 只能用 undefined 初始化, 不能用 null 初始化
-   null 和 undefinecd 有自己的类型
-   **Object 的实例不能用 null 实始化**
-   never 是任何类型的子类
-   类型断言，一般用 as 语句

```ts
let isDone: boolean = true;

let num1: number = 10;
let num2: number = NaN;

let firstName: string = 'bob';
let lastName: string = 'smith';
let fullName: string = `firstName : ${firstName}, lastName: ${lastName}`;

let numArray: number[] = [1, 2];
let stringArray: Array<String> = [];

let x: [string, number] = ['string', 10];
console.log(x);
x[0].substr(1, 2);
x[1].toFixed(10);

enum Color {
    Red = 1,
    Green,
    Blue
}

let color: Color = Color.Blue;
let colorName: string = Color[2];

let notSure: any = 'string';
notSure = 4;
notSure = false;
//
notSure.toFixed();

let obj: Object = {};

let list: any[] = [1, true, 'false'];
list[0] = false;

function voidFunc(name?: string | number | boolean): void {
    console.log(name);
}

voidFunc('hello');
voidFunc(19);
voidFunc(false);
voidFunc(undefined);

// void 只能用undefined赋值
let unusable: void = undefined;
// let unusable1: void = null;
let unusable2: null = null;
let unusable3: undefined = undefined;
let unusable4: Object = {};
// let unusable5: Object = null;

// never是任何类型的子类
function error(msg: string): never {
    throw new Error(msg);
}
let fail: string = error('test');

// 类型断言
let someValue: any = 'this is a string';
let strLength: number = (someValue as string).length;
strLength = (<string>someValue).length;
```
