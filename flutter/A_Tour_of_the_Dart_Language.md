# A Tour of the Dart Language

-   [A Tour of the Dart Language](https://www.dartlang.org/guides/language/language-tour)

-   [基本概念](#基本概念)
-   [变量](#变量)
-   [final 与 const](#final-与-const)
-   [类型](#类型)
    -   [string](#string)
    -   [map list](#map-list)
        -   [List](#list)
    -   [Function](#function)
        -   [函数参数](#函数参数)
        -   [返回值](#返回值)
        -   [匿名函数](#匿名函数)
        -   [闭包](#闭包)
-   [Operators](#operators)
    -   [算术运算符](#算术运算符)
    -   [type test operators](#type-test-operators)
    -   [赋值](#赋值)
    -   [条件运算符](#条件运算符)
    -   [cascade](#cascade)
    -   [其它](#其它)
-   [语句](#语句)
    -   [循环](#循环)
    -   [switch](#switch)
-   [Exceptions](#exceptions)
    -   [catch](#catch)
    -   [finally](#finally)
-   [Class](#class)
    -   [runtimeType](#runtimetype)
    -   [对象初始化](#对象初始化)
    -   [构造函数](#构造函数)
        -   [初始化列表](#初始化列表)
        -   [调用父类的构造函数](#调用父类的构造函数)
        -   [调用自身](#调用自身)
        -   [Constant constructors](#constant-constructors)
        -   [Factory constructors](#factory-constructors)
        -   [命名构造函数](#命名构造函数)
    -   [Methods](#methods)
        -   [getters and setters](#getters-and-setters)
        -   [abstract](#abstract)
        -   [Implicit interfaces](#implicit-interfaces)
        -   [Extending a class](#extending-a-class)
        -   [Overriding members](#overriding-members)
        -   [类型协变 covariant](#类型协变-covariant)
        -   [Overridable operators](#overridable-operators)
    -   [Enumerated types](#enumerated-types)
    -   [mixin](#mixin)
    -   [Class variables and methods](#class-variables-and-methods)
        -   [static](#static)
-   [Generics](#generics)
    -   [常见使用](#常见使用)
    -   [Dart 中泛型与 java 的不同](#dart-中泛型与-java-的不同)
    -   [泛型中的 extends](#泛型中的-extends)
    -   [泛型方法](#泛型方法)
-   [Libraries and visibility](#libraries-and-visibility)
    -   [Lazily loading a library](#lazily-loading-a-library)
    -   [Implementing libraries](#implementing-libraries)
-   [Asynchrony support](#asynchrony-support)
    -   [await 与 async](#await-与-async)
    -   [Streams](#streams)
    -   [Generators](#generators)
        -   [使用方法](#使用方法)
-   [Callable classed](#callable-classed)
-   [Isolates](#isolates)
-   [Typedefs](#typedefs)
-   [Metadata](#metadata)

## 基本概念

-   一切都是对象，所有继承于 Object,int,double 也是 Object
-   **函数支持全局函数，也支持类的成员与静态函数**
-   **支持全局变量，也支持类的成员与静态变量**

```Dart
void main() {
  var a = 1;
  printInteger(a);
  printInteger(test);
}

int test = 10;

void printInteger(int number) {
  print("the number is $number");
}
```

-   **dart 没有 public,protected 和 private,以下滑线开头的标识符对于 library 是 private 的**

## 变量

-   **dart 是强类型语言，如果类型不定，使用 dynamic 与 object**

```Dart
dynamic name = "Bob'
```

-   **所有变量没有初始化为 null,即使是 int,因为 int 也是对象**

```Dart
int lineCount;
assert(lineCount == null)
```

## final 与 const

-   final 只能被设置一次值
-   **const 是编译期间的常量**，const 隐式是 final 的
-   **final 变量必须在构造函数体开始前初始化，在变量定义的地方，构造函数参数或 Initializer list**

```Dart
class TestFinal {
  // 在定义变量的地方初始化
  final int a = -1;
  final int b;
  final int c;
  final int d;

  // 用语法糖在构造函数的参数中初始化
  // 在初始化列表中初始化
  TestFinal(this.b, this.c, int d) : d = d;
}

```

## 类型

### string

-   在 string 中使用变量或表达式的值，$variableName (or ${expression})

```Dart
printInteger(int aNumber) {
  print('The number is $aNumber.'); // Print to console.
}
```

-   多行 string,使用三层引号

```Dart
var s1 = '''
You can create
multi-line strings like this one.
''';

var s2 = """This is also a
multi-line string.""";
```

-   **raw string,不进行转义,字符串前加上 r**

```Dart
var s = r'In a raw string, not even \n gets special treatment.';
```

### map list

```Dart
var list = [1, 2, 3];

// 编译期常量
var constantList = const [1, 2, 3];

var gifts = {
  // Key:    Value
  'first': 'partridge',
  'second': 'turtledoves',
  'fifth': 'golden rings'
};

var gifts = Map();
gifts['first'] = 'partridge';
gifts['second'] = 'turtledoves';
gifts['fifth'] = 'golden rings';
```

#### List

-   **List 的构造函数中如果指定长度，那么它是定长的，相当于数组，向其中添加元素不能超过初始指定的长度**
-   如果不指定长度，那么相当于 ArrayList，会自增长
-   **List 如果调用 length 指定长度，那么[0, length)范围内的“空”出来**

```Dart
  List<int> l = new List(2);
  l.add(1);
  l.add(2);
  // 向其中添加3会报错，因为长度初始指定，那么它就是定长的数组
  // l.add(3);

  List<int> a = new List();
  a.length = 2;
  a.add(1);
  a.add(2);
  a.add(3);
  print(a.length);
  print(a);
// 开始指定长度为2，后面又添加3个元素，所以最后length为5
// 5
// [null, null, 1, 2, 3]
```

### Function

-   **Dart 中 function 也是对象,也是 first-class 对象**
-   => 等号等价于 { return expr; }， 返回中只能有一个表达式，而不是语句，因而可以是条件表达式

```Dart
bool isNoble(int atomicNumber) => _nobleGases[atomicNumber] != null;
```

#### 函数参数

-   使用{param1, param2, …}来定义命名函数参数
-   **@required 表示必须的参数，import 'package:meta/meta.dart'; 但是参数本身可以为 null**
-   用[]来表示可选参数
-   可以为命名函数参数与可选参数用=指定默认值，但默认值必须是编译期的常量

```Dart
// {param1, param2, …}定义命名函数参数
void enableFlags({bool bold, bool hidden}) {...}
// 调用时可选的命名调用
enableFlags(bold: true, hidden: false);

// 必要的参数，可用@required注解
const Scrollbar({Key key, @required Widget child})

// device是可选参数
String say(String from, String msg, [String device]) {
  var result = '$from says $msg';
  if (device != null) {
    result = '$result with a $device';
  }
  return result;
}

// 参数默认值，必须编译常量
void enableFlags({bool bold = false, bool hidden = false}) {...}
enableFlags(bold: true);

// 参数默认值也可以是list,因为编译器常量的原因，所以加上const
void doStuff(
    {List<int> list = const [1, 2, 3],
    Map<String, String> gifts = const {
      'first': 'paper',
      'second': 'cotton',
      'third': 'leather'
    }}) {
  print('list:  $list');
  print('gifts: $gifts');
}
```

#### 返回值

-   **所有的函数都返回一个值，如果没有指定返回值，那么返回 null**
-   如果指定返回 void，那么返回值不能与 null 比较

```Dart
foo() {}

// 如果没有指定返回类型，那么是null
print(foo() == null);
```

#### 匿名函数

```Dart
([[Type] param1[, …]]) {
  codeBlock;
};

// 参数用括号括起来，可以带上参数类型，也可以不带
List<String> strList = ['abc', 'def', 'hij'];
strList.forEach( (String a) {
  print(a);
});

strList.forEach((item) => print("$item"));
```

#### 闭包

-   支持闭包

```Dart
Function makeAdder(num addBy) {
  return (num i) => addBy + i;
}

void main() {
  // Create a function that adds 2.
  var add2 = makeAdder(2);

  // Create a function that adds 4.
  var add4 = makeAdder(4);

  assert(add2(3) == 5);
  assert(add4(3) == 7);
}
```

-   函数相等性

```Dart
void foo() {} // A top-level function

class A {
  static void bar() {} // A static method
  void baz() {} // An instance method
}

void main() {
  var x;

  // Comparing top-level functions.
  x = foo;
  // true
  print(foo == x);

  // 同一个类的静态方法相等
  x = A.bar;
  // true
  print(A.bar == x);

  // Comparing instance methods.
  var v = A(); // Instance #1 of A
  var w = A(); // Instance #2 of A
  var y = w;
  x = w.baz;

  // 相同对象的成员函数相同
  // true
  print(y.baz == x);

  // 不同对象的成员函数不相等
  // true
  print(v.baz != w.baz);
}
```

## Operators

-   **dart 支持运算符重载**
-   对于双目运算符，运算符左边的对象决定了使用的是哪一个重载的运算符

```Dart
assert(5 / 2 == 2.5); // Result is a double
assert(5 ~/ 2 == 2); // Result is an int
```

| Description              | Operator                                        |
|--------------------------|-------------------------------------------------|
| unary postfix            | expr++ expr-- () [] . ?.                        |
| unary prefix             | -expr !expr ~expr ++expr --expr                 |
| multiplicative           | \* / % ~/                                       |
| additive                 | + -                                             |
| shift                    | << >>                                           |
| bitwise AND              | &                                               |
| bitwise XOR              | ^                                               |
| bitwise OR               | &#124;                                          |
| relational and type test | >= > <= < as is is!                             |
| equality                 | == !=                                           |
| logical AND              | &&                                              |
| logical OR               | &#124;&#124;                                    |
| if null                  | ??                                              |
| conditional              | expr1 ? expr2 : expr3                           |
| cascade                  | ..                                              |
| assignment               | = \*= /= ~/= %= += -= <<= >>= &= ^= &#124;= ??= |

### 算术运算符

-   ~/ 除法，返回整数

```Dart
// Result is a double
assert(5 / 2 == 2.5);

// Result is an int
assert(5 ~/ 2 == 2);
```

### type test operators

-   as is is!

```Dart
// 先进行类型检测
if (emp is Person) {
    emp.firstName = 'Bob';
}

// 直接进行类型转换，如果emp不是Person，会Exception
(emp as Person).firstName = 'Bob';
```

### 赋值

-   = 和 ??=

```Dart
// 无论a是什么，都将value的值赋值给它
a = value;

// 如果b为null,那么将value赋值给它，否则b保持不变
b ??= value;
```

### 条件运算符

-   condition ? expr1 : expr2
-   expr1 ?? expr2 **如果 expr1 不为 null,返回 expr1,否则返回 expr2**

```Dart
var visibility = isPublic ? 'public' : 'private';

// 如果name为null，返回Guest,否则返回name
String playerName(String name) => name ?? 'Guest';
```

### cascade

-   对同一个  对象，执行多个动作，相当于 return this

```Dart
querySelector('#sample_text_id')
    ..text = 'Click me!'
    ..onClick.listen(reverseText);
```

### 其它

-   ?. 条件成员操作符

```Dart
// 如果a为null,不做什么，否则调用a的test方法
a?.test()
// a为null,返回null,否则返回a的value成员
a?.value
```

## 语句

### 循环

-   普通的 for 循环
-   实现了 Iterable 使用 forEach()
-   List,Set 使用 for-in

```Dart
var collection = [0, 1, 2];
for (var x in collection) {
  print(x); // 0 1 2
}
```

### switch

-   强制 break,否则的话，需要使用 label 语句来实现 fall through

```Dart
var command = 'CLOSED';
switch (command) {
  case 'CLOSED':
    executeClosed();
    continue nowClosed;
  // Continues executing at the nowClosed label.

  nowClosed:
  case 'NOW_CLOSED':
    // Runs for both CLOSED and NOW_CLOSED.
    executeNowClosed();
    break;
}
```

## Exceptions

-   **Dart 可以抛出任何非 null 的对象，而不仅是 Exception**，但一般情况下我们都会抛出实现了 Error 或 Exception 的类型对象
-   **Dart 中抛出的都是 unchecked exceptions**,因而方法不一定会指明抛出什么异常，我们也并不要求去捕获这些异常
-   抛出异常是语句，所以在可以在=>中使用

```Dart
void distanceTo(Point other) => throw UnimplementedError();
```

### catch

-   on 用来指明类型
-   catch 用来处理异常对象,**catch 可以接受两个参数，第一个参数为异常对象，第二个为 StackTrace**
-   **再次抛出异常，使用 rethrow**

```Dart
try {
  breedMoreLlamas();
} on OutOfLlamasException {
  // A specific exception
  buyMoreLlamas();
} on Exception catch (e) {
  // Anything else that is an exception
  print('Unknown exception: $e');
} catch (e) {
  // No specified type, handles all
  print('Something really unknown: $e');
}

try {
  // ···
} on Exception catch (e) {
  print('Exception details:\n $e');
} catch (e, s) {
  print('Exception details:\n $e');
  print('Stack trace:\n $s');
}

void misbehave() {
  try {
    dynamic foo = true;
    print(foo++); // Runtime error
  } catch (e) {
    print('misbehave() partially handled ${e.runtimeType}.');
    rethrow; // Allow callers to see the exception.
  }
}
```

### finally

-   与 java 中的 finally 一样

### 异常的捕获

- 同步的异常可以捕获
- **async函数中异常，通过await调用时，可以对整个捕获**

```dart
void test1() {
  throw Exception("test1 exception");
}

Future test2() async {
  return Future.delayed(Duration(seconds: 2), () {
    throw Exception("test2 exception");
  });
}

// 正常的捕获
 try {
    test1();
  } catch (e) {
    print(e);
  }

//  也可以捕获
try {
    await test2();
  } catch (e) {
    print("async catch");
    print(e);
  }

// 不使用await,这种异常捕获不了
  try {
    test2();
  } catch (e) {
    print("async catch");
    print(e);
  }
```

## Class

-   **Dart 中的关健字 new 不是必需的**

### runtimeType

-   runtimeType 返回运行时类型

```Dart
print('The type of a is ${a.runtimeType}');
```

### 对象初始化

-   Dart 中所有变量都是对象，**所有未初始化的成员变量都是 null**
-   **所有成员变量都会生成一个隐式的 getter 方法，所有非 final 的成员变量都会生成一个隐式的 setter 方法**
-   **如果在定义成员变量的地方初始化，那么成员变量的初始化早于构造函数与初始化列表**

### 构造函数

-   ClassName or ClassName.identifier
-   **构造函数如果函数体为空，可以直接省略{},用;替代**
-   **构造函数不会被继承**

```Dart
class Point {
  num x, y;

  // Syntactic sugar for setting x and y
  // before the constructor body runs.
  Point(this.x, this.y);
}
```

#### 初始化列表

-   **初始化列表先于构造函数体执行**
-   **final 对象只能在定义成员变量的地方和初始化列表中初始化**，不能在构造函数中初始化
-   可以在初始化列表中进行值判断

```Dart
Point.fromJson(Map<String, num> json)
    : x = json['x'],
      y = json['y'] {
  print('In Point.fromJson(): ($x, $y)');
}

// final对象的初始化
class Point {
  final num x;
  final num y;
  final num distanceFromOrigin;

  Point(x, y)
      : x = x,
        y = y,
        distanceFromOrigin = sqrt(x * x + y * y);
}

// 值判断
Point.withAssert(this.x, this.y) : assert(x >= 0) {
  print('In Point.withAssert(): ($x, $y)');
}
```

#### 调用自身

```Dart
class Point {
  num x, y;

  // The main constructor for this class.
  Point(this.x, this.y);

  // Delegates to the main constructor.
  Point.alongXAxis(num x) : this(x, 0);
}
```

#### Constant constructors

-   所有成员变量为 final
-   构造函数前加上 const
-   const 构造函数如果调用时间面也加上 const,返回的对象可能是同一个编译期的常量对象

```Dart
class ImmutablePoint {
  static final ImmutablePoint origin =
      const ImmutablePoint(0, 0);

  final num x, y;

  const ImmutablePoint(this.x, this.y);
}
```

-   const 位置

```Dart
// 假设ImmutablePoint是const constractors
// 常量对象
const pointAndLine = const {
  'point': const [const ImmutablePoint(0, 0)],
  'line': const [const ImmutablePoint(1, 10), const ImmutablePoint(-2, 11)],
};

// 返回的也是常量对象
const pointAndLine = {
  'point': [ImmutablePoint(0, 0)],
  'line': [ImmutablePoint(1, 10), ImmutablePoint(-2, 11)],
};

// 常量对象
var a = const ImmutablePoint(1, 1); // Creates a constant

// 非常量对象
var b = ImmutablePoint(1, 1);
```

#### Factory constructors

-   工厂构造函数，factory, 主要用于不是每一次都创建新的对象
-   可以返回同一个对象
-   factory 构造函数中没法引用 this

```Dart
class Logger {
  final String name;
  bool mute = false;

  // _cache is library-private, thanks to
  // the _ in front of its name.
  static final Map<String, Logger> _cache =
      <String, Logger>{};

  factory Logger(String name) {
    if (_cache.containsKey(name)) {
      return _cache[name];
    } else {
      final logger = Logger._internal(name);
      _cache[name] = logger;
      return logger;
    }
  }

  Logger._internal(this.name);

  void log(String msg) {
    if (!mute) print(msg);
  }
}
```

#### 命名构造函数

-   因为构造函数不会被继承，所以**如果子类想要调用父类的命名构造函数，那么子类必须自己实现同名的构造函数**

```Dart
class Point {
  num x, y;

  Point(this.x, this.y);

  // Named constructor
  Point.origin() {
    x = 0;
    y = 0;
  }
}
```

#### 对象构造顺序

-   类继承后，类实例的初始化顺序
    -   类按顺序定义的变量
    -   initializer list
    -   super 类型按顺序定义的成员变量
    -   super 的构造函数
    -   自身的构造函数

```Dart
String test(String a) {
  print(a);
  return a;
}


class Parent {
  String parentVar = test("parentVar");

  Parent(int x) {
    print("Parent constructor");
  }
}

class Child extends Parent {
  int a = 0;

  String childVar = test("childVar");

  Child(int x, int y)
      : a = x,
        super(y) {
    print("Child contructor");
  }
}

void main() {
  Child child = Child(1, 2);
}

// childVar
// parentVar
// Parent constructor
// Child contructor

```

### Methods

#### getters and setters

-   **每一个成员变量都有一个隐式的 getter,非 final 的对象都有一个隐式的 setter**
-   **可以通过实现 getter 与 setter 为对象增加额外的属性**

```Dart
class Rectangle {
  num left, top, width, height;

  Rectangle(this.left, this.top, this.width, this.height);

  // Define two calculated properties: right and bottom.
  num get right => left + width;
  set right(num value) => left = value - width;
  num get bottom => top + height;
  set bottom(num value) => top = value - height;
}
```

#### abstract

#### Implicit interfaces

-   **Dart 中要实现的接口可以是一个具体的类,并且要求重写所有可见的方法**
-   **实接一个接口，接口中的可见的隐式的 setter 与 getter 也会被要求重写**
-   **如果不想实现部分方法，可以重写 noSuchMethod 方法**

```Dart
class Person {
  // In the interface, but visible only in this library.
  final _name;

  // Not in the interface, since this is a constructor.
  Person(this._name);

  // In the interface.
  String greet(String who) => 'Hello, $who. I am $_name.';

  String _greet(String who) => 'Hello, $who. I am $_name.';
}

// 如果ImplementInterface与Person在一个library中，则要求重写greet,_greet与_name的setter方法(_name的setter因为final不存在)
//  如果ImplementInterface与Person不在一个library中，则只要求重写greet方法，其它的两个方法因为可见性的原因不要求重写
class ImplementInterface implements Person {
  @override
  // TODO: implement _name
  get _name => null;

  @override
  String greet(String who) {
    // TODO: implement greet
    return null;
  }

  @override
  String _greet(String who) {
    // TODO: implement _greet
    return null;
  }
}
```

-   实现多个接口

```Dart
class Point implements Comparable, Location {...}
```

#### Extending a class

-   使用 super 调用父类方法

#### Overriding members

-   @override

#### 类型协变 covariant

-   如果需要缩小一个方法的参数或者变量值，并且是类型安全的，可以使用关键字 covariant
-   相当于 java 中的类型协变
-   返回值的类型协变是默认支持的
-   函数参数的类型协变，也就是参数是原来参数的子类，必须加上 covariant 关健字

```Dart
class Animal {
  void chase(Animal x) { ... }
}

class Mouse extends Animal { ... }

class Cat extends Animal {
  void chase(covariant Mouse x) { ... }
}
```

#### Overridable operators

![重载运算符](../../image-resources/flutter/运算符重载.png)

-   != 不需要重载，重载==就可以了

```Dart
class Vector {
  final int x, y;

  Vector(this.x, this.y);

  Vector operator +(Vector v) => Vector(x + v.x, y + v.y);
  Vector operator -(Vector v) => Vector(x - v.x, y - v.y);

  // Operator == and hashCode not shown. For details, see note below.
  // ···
}
```

### Enumerated types

-   index()方法返回 index,第一个枚举返回 0
-   返回所有的枚举 values
-   枚举可以用在 switch 中

```Dart
enum Color { red, green, blue }
assert(Color.red.index == 0);

List<Color> colors = Color.values;
assert(colors[2] == Color.blue);
```

### mixin

#### mixin 基础

-   **个人在用途上认为 mixin 是 java 中带有变量与代码实现的 interface，定义了在不同继承体系中可以通用的方法与变量**

-   实现一个 mixin
    -   创建一个继承 Object 的类
    -   不要创建构造函数，只有默认构造函数
    -   除非要将 mixin 当作普通类使用，否则使用 mixin 而非 class 关键字

```Dart
// 首先定义一个mixin
// 里面可以包含代码和成员变量
mixin Musical {
  bool canPlayPiano = false;
  bool canCompose = false;
  bool canConduct = false;

  void entertainMe() {
    if (canPlayPiano) {
      print('Playing piano');
    } else if (canConduct) {
      print('Waving hands');
    } else {
      print('Humming to self');
    }
  }
}

class A {}

class B {}

// C和D继承体系不一样，但是却同时有Musical中的成员变量与方法
class C extends A with Musical {

}

class D extends B with Musical {

}


void main() {
  C c = new C();
  c.canCompose = true;
  c.entertainMe();

  D d = new D();
  d.canPlayPiano = true;
  d.entertainMe();
}
```

-   指定只有某些类可以使用 mixin,使用 on

```Dart
// 只有Musician可以使用mixin MusicalPerformer
mixin MusicalPerformer on Musician {
  // ···
}
```

#### mixin 的调用顺序

-   [Dart: What are mixins?](https://medium.com/flutter-community/dart-what-are-mixins-3a72344011f3)

-   Dart 中的 mixin 是线性的，是一层一层覆盖的，并不会继承所有混合的类的“遗产”，后面的会覆盖前面的

![mixIn01](../../image-resources/flutter/mixin01.jpg)

```Dart
class A {
  void test() {
    print("A.test()");
  }
}

class B {
  void test() {
    print("B.test()");
  }
}

class P {
  void test() {
    print("P.test()");
  }
}

class AB extends P with A, B {}

class BA extends P with B, A {}

void main() {
  AB().test();  // B.test()
  BA().test(); // A.test()
}
```

-   **一个 mixin 类的实例，它既是其父类的子类，也是其 mixin 的子类**, 在 Dart 中每一个类也是一个接口，通过 mixin 生成的类，它不仅包含了 mixin 的成员，也实现了 mixin 的接口 mmix

```Dart
class A {
  void test() {
    print("A.test()");
  }
}

class B {
  void test() {
    print("B.test()");
  }
}

class P {
  void test() {
    print("P.test()");
  }
}

class AB extends P with A, B {}

AB ab = AB();
print(ab is P);     // true
print(ab is A);    // true
print(ab is A);    // true
```

```Dart
abstract class Super {
  void method() {
    print("Super");
  }
}

class MySuper implements Super {
  @override
  void method() {
    print("MySuper");
  }
}

mixin Mixin on Super {
  void method() {
    super.method();
    print("Sub");
  }
}

class Client extends MySuper with Mixin {}

Client().method();
 // MySuper
 // Sub
// 最终调用的是Mixin中的super.method()和print("Sub)
// 只不过super指借的是MySuper
```

![mixIn02](../../image-resources/flutter/mixin02.jpg)

## Generics

### 常见使用

-   Using collection literals

```Dart
var names = <String>['Seth', 'Kathy', 'Lars'];
var pages = <String, String>{
  'index.html': 'Homepage',
  'robots.txt': 'Hints for web robots',
  'humans.txt': 'We are people, not machines'
};
```

-   构造函数中

```Dart
var names = List<String>();
names.addAll(['Seth', 'Kathy', 'Lars']);
var nameSet = Set<String>.from(names);
```

### Dart 中泛型与 java 的不同

-   **java 中的泛型使用擦除实现，而 Dart 不是的**

```Dart
var names = List<String>();
names.addAll(['Seth', 'Kathy', 'Lars']);
print(names is List<String>); // true

var names = <String>["Seth", "Kathy", "Lars"];
var ids = <int>[1, 2, 3];
// 在java中两者都是list,类型是一样的，但是在Dart中两者的类型是不一样的
print(names.runtimeType == ids.runtimeType);
```

### 泛型中的 extends

-   泛型参数中可以指定

```Dart
class Foo<T extends SomeBaseClass> {
  // Implementation goes here...
  String toString() => "Instance of 'Foo<$T>'";
}

class Extender extends SomeBaseClass {...}

var someBaseClassFoo = Foo<SomeBaseClass>();
var extenderFoo = Foo<Extender>();
```

### 泛型方法

-   [Using Generic Methods.](https://github.com/dart-lang/sdk/blob/master/pkg/dev_compiler/doc/GENERIC_METHODS.md)
-   与 java 的不同之处在于，**java 中除了 static 方法，否则不能使用定义类时指定泛型参数之外的泛型参数，但是 Dart 中是可以的**

```Dart

class TestGeneric<T extends num> {

  bool test<E> (List<E> list) {
    return false;
  }
}

TestGeneric testGeneric = new TestGeneric<int>();
  testGeneric.test(<String>["a", "b", "c"]);
```

## Libraries and visibility

-   Dart 中一个每一个 app 都是一个 library
-   \_开头的成员变量与方法在 library 中都仅在同一个 libary 中可见

```Dart
// 指定一个library
library learningdart;

// 系统的以dart开头
import 'dart:html';

// 自己的以package开头的schem

import 'package:test/test.dart';
```

-   library prefix

```Dart
import 'package:lib1/lib1.dart';
import 'package:lib2/lib2.dart' as lib2;

// Uses Element from lib1.
Element element1 = Element();

// Uses Element from lib2.
lib2.Element element2 = lib2.Element();
```

-   import part of a library

```Dart
// Import only foo.
import 'package:lib1/lib1.dart' show foo;

// Import all names EXCEPT foo.
import 'package:lib2/lib2.dart' hide foo;
```

### Lazily loading a library

-   可以使用 lazily 引入的地方

    -   减少 app 启动时间
    -   ab 测试
    -   load 一些比较少用的功能

-   具体使用
    -   使用 deferred as 引入
    -   当需要的时候，使用 loadLibrary

```Dart
// 后面的引入都会放到hello的namespace中
import 'package:greetings/hello.dart' deferred as hello;
```

```Dart
// 使用async和await加载libary
Future greet() async {
  await hello.loadLibrary();
  hello.printGreeting();
}
```

-   注意事项
    -   **一个 deferred libary 在加载完成之前，常量并不是常量**
    -   **不能使用 deferred libary 中的类型**，考虑将接口类型放到一个 import file 和 deferred library 都会引入的 library
    -   **Dart 会将代码引入到 deferred as 的命名空间中**
    -   返回一个 Future 对象

### Implementing libraries

-   [Create Library Packages](https://www.dartlang.org/guides/libraries/create-library-packages)

## Asynchrony support

-   Dart 中使用异步主要有
    -   await 与 async
    -   Future 相关的 API [Future API](https://www.dartlang.org/guides/libraries/library-tour#future)

### await 与 async

-   **也许 async 是一个耗时的方法，但是并不会等待方法执行完成**
-   **await 必须与 async 方法一起使用**
-   **await 返回一个 Future 对象**
-   **使用 try catch 和 final 来处理 await 方法中的错误与清理工作**
-   一个 async 方法中，可以多次调用 await

```Dart
Future checkVersion() async {
  var version = await lookUpVersion();
  // Do something with version
}
```

```Dart
try {
  version = await lookUpVersion();
} catch (e) {
  // React to inability to look up the version
} finally {
  // clean up
}
```

```Dart
// 可以多次使用async
Future test() async {
  var entrypoint = await findEntrypoint();
  var exitCode = await runExecutable(entrypoint, args);
  await flushThenExit(exitCode);
}
```

### Streams

-   使用 streams 的方式

    -   使用 async 与 await for
    -   使用 Streams 相关的 API [Stream API](https://www.dartlang.org/guides/libraries/library-tour#stream)

-   一定要配合 async 方法一起使用
-   await for 中的对象一定要是一个 Stream
-   使用 await for 一定要注意，要确定我们的确需要 stream 所有的结果
-   退出 stream,使用 break 与 return

```Dart
Future main() async {
  // ...
  await for (var request in requestServer) {
    handleRequest(request);
  }
  // ...
}
```

### Generators

-   同步：Iterable
-   异步：Stream
-   [Generator](https://www.dartlang.org/articles/language/beyond-async)

#### 使用方法

-   同步方法上加上 sync*, 异步方法上加上 async*
-   使用 yield 产生数据

```Dart
// 同步sync*
Iterable<int> naturalsTo(int n) sync* {
  int k = 0;
  while (k < n) yield k++;
}
```

```Dart
Stream<int> asynchronousNaturalsTo(int n) async* {
  int k = 0;
  while (k < n) yield k++;
}
```

-   如果 generator 是循环的，可以通过使用 yield\* 增加性能

```Dart
Iterable<int> naturalsDownFrom(int n) sync* {
  if (n > 0) {
    yield n;
    yield* naturalsDownFrom(n - 1);
  }
}
```

## Callable classed

-   [Emulating Functions in Dart](https://www.dartlang.org/articles/language/emulating-functions)
-   如果想让类对象能够像函数一样被调用，实现 call()方法
-   Dart 遇到这种语法时，首先当函数调用，不成功时，尝试调用参数合适的 call 方法，如果也失败了，尝试调用 noSuchMethod 方法

```Dart
class WannabeFunction {
  call(String a, String b, String c) => '$a $b $c!';
}

main() {
  var wf = new WannabeFunction();
  var out = wf("Hi","there,","gang");
  print('$out');
}
```

## Isolates

## Typedefs

-   目前 Dart 仅支持 Function 的 typedef
-   **typedef 的好处是可以保存函数的类型信息**

```Dart
typedef Compare = int Function(Object a, Object b);

class SortedCollection {
  Compare compare;

  SortedCollection(this.compare);
}

// Initial, broken implementation.
int sort(Object a, Object b) => 0;

void main() {
  SortedCollection coll = SortedCollection(sort);
  assert(coll.compare is Function);
  assert(coll.compare is Compare);
}
```

-   **typedef 中因为相当于别名，也支持泛型**

```Dart
typedef Compare<T> = int Function(T a, T b);

int sort(int a, int b) => a - b;

void main() {
  assert(sort is Compare<int>); // True!
}
```

## Metadata

-   相当于 java 中的 anotation
-   常见的 metadata
    -   @deprecated
    -   @override
    -   @Todo
    -   @required
