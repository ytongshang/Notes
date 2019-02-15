# module

## export

- **一个模块就是一个独立的文件。该文件内部的所有变量，外部无法获取。**
- 如果你希望外部能够读取模块内部的某个变量，就必须使用export关键字输出该变量

```js
export var firstName = "Michael";
export var lastName = "Jackson";
export var year = 1958;

/*或者这种写法*/
export {firstName, lastName, year};
```

- **export命令除了输出变量，还可以输出函数与类**

```js
export function multiply(x, y) {
    return x * y;
}
```

- export输出的变量可以使用as指定别名

```js
function v1() { ... }
function v2() { ... }

export {
  v1 as streamV1,
  /*v2还可以指定两个别名*/
  v2 as streamV2,
  v2 as streamLatestVersion
};
```

- export命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系

```js
// 报错
export 1;

// 报错
var m = 1;
export m;

// 写法一
export var m = 1;

// 写法二
var m = 1;
export {m};

// 写法三
var n = 1;
export {n as m};
```

- **function和class的输出，也必须遵守这样的写法**

```js
// 报错
function f() {}
export f;

// 正确
export function f() {};

// 正确
function f() {}
export {f};
```

- **export语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值**

```js
export var foo = 'bar';
// 500毫秒后 foo的值变为了baz
setTimeout(() => foo = 'baz', 500);
```

## import

- 使用export命令定义了模块的对外接口以后，其他 JS 文件就可以通过import命令加载这个模块

```js
// main.js
import {firstName, lastName, year} from './profile.js';

function setName(element) {
  element.textContent = firstName + ' ' + lastName;
}
```

- 使用as指定别名

```js
import { lastName as surname } from './profile.js';
```

- **import命令输入的变量都是只读的，因为它的本质是输入接口**。也就是说，不允许在加载模块的脚本里面，改写接口
- 输出变量a,如果a是一个对象，改写a的属性是允许的,并且其他模块也可以读到改写后的值。不过，这种写法很难查错，建议凡是输入的变量，都当作完全只读，轻易不要改变它的属性

```js
import {a} from './xxx.js'
a = {}; // Syntax Error : 'a' is read-only;

import {a} from './xxx.js'
a.foo = 'hello'; // 合法操作
```

- **import命令具有提升效果，会提升到整个模块的头部，首先执行**
- **由于import是静态执行，所以不能使用表达式和变量**，这些只有在运行时才能得到结果的语法结构

```js
foo();
// 与函数声明一样，具有提升效果
import { foo } from 'my_module';

// 报错
import { 'f' + 'oo' } from 'my_module';

// 报错
let module = 'my_module';
import { foo } from module;

// 报错
if (x === 1) {
  import { foo } from 'module1';
} else {
  import { foo } from 'module2';
}
```

- import语句会执行所加载的模块
- 如果多次重复执行同一句import语句，那么只会执行一次，而不会执行多次

```js
// 相当于执行了lodash的代码
import 'lodash';

import { foo } from 'my_module';
import { bar } from 'my_module';
// 只会执行一次，等同于
import { foo, bar } from 'my_module';
```

## 整体加载

- 除了指定加载某个输出值，还**可以使用整体加载，即用星号（*）指定一个对象，所有输出值都加载在这个对象上面**

```js
// circle.js
export function area(radius) {
  return Math.PI * radius * radius;
}

export function circumference(radius) {
  return 2 * Math.PI * radius;
}
```

```js
// main.js
import { area, circumference } from './circle';
console.log('圆面积：' + area(4));
console.log('圆周长：' + circumference(14));

// 整体加载到命名空间circle中间去
import * as circle from './circle';
console.log('圆面积：' + circle.area(4));
console.log('圆周长：' + circle.circumference(14));
```

- 模块整体加载所在的那个对象（上例是circle），应该是可以静态分析的，所以不允许运行时改变

```js
import * as circle from './circle';

// 下面两行都是不允许的
circle.foo = 'hello';
circle.area = function () {};
```

## export default

- export default命令，为模块指定默认输出
- **一个模块只能有一个默认输出，因此export default命令只能使用一次**

```js
// export-default.js
export default function () {
  console.log('foo');
}
```

- export default命令用在非匿名函数前，也是可以的

```js
// export-default.js
export default function foo() {
  console.log('foo');
}

// 或者写成
function foo() {
  console.log('foo');
}
// 这里也不能用大括号
export default foo;
```

- **import export default的输出时，不使用大括号**

```js
// import-default.js
// import可以指定任何名字
// import后面不能加大括号
import customName from './export-default';
customName(); // 'foo'
```

- 本质上，export default就是输出一个叫做default的变量或方法，然后系统允许你为它取任意名字
- 正是因为export default命令其实只是输出一个叫做default的变量，所以它后面不能跟变量声明语句

```js
// modules.js
function add(x, y) {
  return x * y;
}
export {add as default};
// 等同于
// export default add;

// app.js
import { default as foo } from 'modules';
// 等同于
// import foo from 'modules';

// 正确
export var a = 1;

// 正确
var a = 1;
export default a;

// 错误
// 有变量声明语句
export default var a = 1;
```

- 一条import中，同时输入默认方法和其他接口，可以写成下面这样

```js
// import default
import _ from 'lodash';

// import default ,import others
import _, { each, forEach } from 'lodash';
```

- export default 也可以用来输出类

```js
// MyClass.js
export default class { ... }

// main.js
import MyClass from 'MyClass';
let o = new MyClass();
```

## export与import的复合写法

- 如果在一个模块之中，先输入后输出同一个模块，import语句可以与export语句写在一起

```js
export { foo, bar } from 'my_module';
// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };

// 接口改名
export { foo as myFoo } from 'my_module';

// 整体输出
export * from 'my_module';

// 输出原来的默认接口
export { default } from 'foo';

// 具名接口改为默认接口
export { es6 as default } from './someModule';
// 等同于
import { es6 } from './someModule';
export default es6;
```

```js
// 下面三种import语句，没有对应的复合写法
import * as someIdentifier from "someModule";
import someIdentifier from "someModule";
import someIdentifier, { namedIdentifier } from "someModule";
```

## 模块的继承

```js
// circle.js
export function area(radius) {
  return Math.PI * radius * radius;
}

export function circumference(radius) {
  return 2 * Math.PI * radius;
}
```

```js
// circleplus.js
// circleplus继承circle

// 先输出circle模块的所有属性和方法
// export *命令会忽略circle模块的default方法
export * from 'circle';

// 输出了自定义的e变量和默认方法
export var e = 2.71828182846;
export default function(x) {
  return Math.exp(x);
}

// circleplus.js
// 只输出circle模块的area方法，且将其改名为circleArea
export { area as circleArea } from 'circle';
```

## 跨模块的常量

- **const声明的常量只在当前代码块有效**,如果想设置跨模块的常量（即跨多个文件），或者说一个值要被多个模块共享，可以采用下面的写法

```js
// constants.js 模块
export const A = 1;
export const B = 3;
export const C = 4;

// test1.js 模块
import * as constants from './constants';
console.log(constants.A); // 1
console.log(constants.B); // 3

// test2.js 模块
import {A, B} from './constants';
console.log(A); // 1
console.log(B); // 3
```

- 如果要使用的常量非常多，可以建一个专门的constants目录，将各种常量写在不同的文件里面，保存在该目录下

```js
// constants/db.js
export const db = {
  url: 'http://my.couchdbserver.local:5984',
  admin_username: 'admin',
  admin_password: 'admin password'
};

// constants/user.js
export const users = ['root', 'admin', 'staff', 'ceo', 'chief', 'moderator'];

// constants/index.js
export {db} from './db';
export {users} from './users';

// 使用的时候只用加载index.js就可以了
// script.js
import {db, users} from './constants/index';
```