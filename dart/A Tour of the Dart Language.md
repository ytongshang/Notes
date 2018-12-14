# A Tour of the Dart Language

- [A Tour of the Dart Language](https://www.dartlang.org/guides/language/language-tour)

- [基本概念](#基本概念)
- [变量](#变量)
- [final 与 const](#final-与-const)
- [类型](#类型)
    - [string](#string)
    - [map list](#map-list)
    - [Function](#function)
    - [函数参数](#函数参数)
    - [返回值](#返回值)
    - [cascade](#cascade)
    - [匿名函数](#匿名函数)
    - [闭包](#闭包)
- [运算符](#运算符)
    - [其它](#其它)
- [语句](#语句)
    - [循环](#循环)
- [Exceptions](#exceptions)
    - [catch](#catch)
    - [finally](#finally)

## 基本概念

- 一切都是对象，所有继承于Object,int,double也是Object
- **函数支持全局函数，也支持类的成员与静态函数**
- **支持全局变量，也支持类的成员与静态变量**

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

- **dart没有public,protected和private,以下滑线开头的标识符对于library是private的**

## 变量

- **dart是强类型语言，如果类型不定，使用dynamic与object**

```Dart
dynamic name = "Bob'
```

- **所有变量没有初始化为null,即使是int,因为int也是对象**

```Dart
int lineCount;
assert(lineCount == null)
```

## final 与 const

- final只能被设置一次值
- **const是编译期间的常量**，const隐式是final的
- **final变量必须在构造函数体开始前初始化，在变量定义的地方，构造函数参数或Initializer list**

```Dart
class Test {
  final int _a = 1;
  final int _b;

  Test (int a) : _b = a {
    print("");
  }
}
```

## 类型

### string

- 在string中使用变量或表达式的值，$variableName (or ${expression})

```Dart
printInteger(int aNumber) {
  print('The number is $aNumber.'); // Print to console.
}
```

- 多行string,使用三层引号

```Dart
var s1 = '''
You can create
multi-line strings like this one.
''';

var s2 = """This is also a
multi-line string.""";
```

- **raw string,不进行转义,字符串前加上raw**

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

### Function

- **Dart中function也是对象,也是first-class对象**
- => 等号等价于 { return expr; }， 返回中只能有一个表达式，而不是语句，因而可以是条件表达式

```Dart
bool isNoble(int atomicNumber) => _nobleGases[atomicNumber] != null;
```

### 函数参数

- 函数调用时使用命名参数
- @required，表示必须的参数
- 用[]来表示可选参数
- 参数用=指定默认值，但默认值必须是编译常量

```Dart
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

### 返回值

- **所有的函数都返回一个值，如果没有指定返回值，那么返回null**

```Dart
foo() {}

// 如果没有指定返回类型，那么是null
print(foo() == null);
```

### 匿名函数

```Dart
([[Type] param1[, …]]) {
  codeBlock;
};

// 参数用括号括起来，可以带上参数类型，也可以不带
List<String> strList = ['abc', 'def', 'hij'];
  strList.forEach( (String a) {
    print(a);
  });

List<String> strList = ['abc', 'def', 'hij'];
  strList.forEach( (a) {
    print(a);
  });

```

### 闭包

- 支持闭包

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

- 函数相等性

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

Description              | Operator
-------------------------|---------------------------------------------------------------------------------
unary postfix            | expr++    expr--    ()    []     .      ?.
unary prefix             | -expr    !expr    ~expr    ++expr    --expr
multiplicative           | *    /    %  ~/
additive                 | +    -
shift                    | <<    >>
bitwise AND              | &
bitwise XOR              | ^
bitwise OR               | &#124;
relational and type test | >=    >    <=    <    as    is    is!
equality                 | ==    !=
logical AND              | &&
logical OR               | &#124;&#124;
if null                  | ??
conditional              | expr1 ? expr2 : expr3
cascade                  | ..
assignment               | =    *=    /=    ~/=    %=    +=    -=    <<=    >>=    &=  ^=    &#124;=    ??=

### 算术运算符

- ~/ 除法，返回整数

```Dart
// Result is a double
assert(5 / 2 == 2.5);

// Result is an int
assert(5 ~/ 2 == 2);
```

### type test operators

- as is is!

```Dart
// 先进行类型检测
if (emp is Person) {
    emp.firstName = 'Bob';
}

// 直接进行类型转换，如果emp不是Person，会Exception
(emp as Person).firstName = 'Bob';
```

### 赋值

- = 和 ??=

```Dart
// 无论a是什么，都将value的值赋值给它
a = value;

// 如果b为null,那么将value赋值给它，否则b保持不变
b ??= value;
```

### 条件运算符

- condition ? expr1 : expr2
- expr1 ?? expr2 **如果expr1不为null,返回expr1,否则返回expr2**

```Dart
var visibility = isPublic ? 'public' : 'private';

// 如果name为null，返回Guest,否则返回name
String playerName(String name) => name ?? 'Guest';
```

### cascade

- 对同一个对象，执行多个动作，相当于return this

```Dart
querySelector('#sample_text_id')
    ..text = 'Click me!'
    ..onClick.listen(reverseText);
```

## 运算符

- **dart支持运算符重载**
- 对于双目运算符，运算符左边的对象决定了使用的是哪一个重载的运算符

```Dart
assert(5 / 2 == 2.5); // Result is a double
assert(5 ~/ 2 == 2); // Result is an int
```

### 其它

- ?. 条件成员操作符

```Dart
// 如果a为null,不做什么，否则调用a的test方法
a?.test()
// a为null,返回null,否则返回a的value成员
a?.value
```

## 语句

### 循环

- 实现了Iterable使用forEach()
- List,Set使用for-in

```Dart
var collection = [0, 1, 2];
for (var x in collection) {
  print(x); // 0 1 2
}
```

## Exceptions

- **Dart可以抛出任何非null的对象，而不仅是Exception**，但一般情况下我们都会抛出实现了Error或Exception的类型对象
- **Dart中抛出的都是unchecked exceptions**,因而方法不一定会指明抛出什么异常，我们也并不要求去捕获这些异常
- 抛出异常是语句，所以在可以在=>中使用

```Dart
void distanceTo(Point other) => throw UnimplementedError();
```

### catch

- on 用来指明类型
- catch用来处理异常对象,**catch可以接受两个参数，第一个参数为异常对象，第二个为StackTrace**
- **再次抛出异常，使用rethrow**

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

- 与java中的finally一样

## Class

### constructors

- **Dart中的关健字new不是必需的**

#### const constructors

- 构造函数前加上const，返回编译期的常量对象， 两次const constructors返回的是同一个对象

```Dart
var a = const ImmutablePoint(1, 1);
var b = const ImmutablePoint(1, 1);

// They are the same instance!
assert(identical(a, b));
```

- const位置

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

### runtimeType

- runtimeType返回运行时类型

```Dart
print('The type of a is ${a.runtimeType}');
```

### 对象初始化

- Dart中所有变量都是对象，**所有未初始化的成员变量都是null**
- **所有成员变量都会生成一个隐式的getter方法，所有非final的成员变量都会生成一个隐式的setter方法**，而私有变量(以_开头的变量)不会自动生成getter与setter
- **如果在定义成员变量的地方初始化，那么成员变量的初始化早于构造函数与初始化列表**

### 构造函数
