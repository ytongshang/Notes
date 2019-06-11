# temp

- 类继承后，类实例的初始化顺序
    - 类按顺序定义的变量
    - initializer list
    - super类型按顺序定义的成员变量
    - super的构造函数
    - 自身的构造函数

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

## 常量构造函数

- 所有成员变量为final
- 构造函数前加上const
- const构造函数如果调用时间面也加上const,返回的对象可能是同一个

```Dart
class Point {
  final int x;
  final int y;

  const Point(this.x, this.y);
}

Point p1 = const Point(1, 1);
Point p2 = const Point(1, 1);
print("p1==p2:${p1 == p2}");   // true

Point p3 = Point(1, 1);
print("p1==p3:${p1 == p3}");  // false

Point p4= const Point(2, 2);
print("p1==p4:${p1 == p4}");  // false
```

## factory构造函数

- 工厂构造函数
- 可以返回同一个对象
- factory构造函数中没法引用this

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

## implementes

- 一个类实际定义了它的对外接口，在Dart中不仅可以Implements一个Interface，还可以Implements一个类
- Implements一个类，实际上实现了类的对外接口，但是不包含它的实现

```Dart
// package:flutter_app/test.dart
class Point {
  final int x;
  final int y;
  int _size;

  Point(this.x, this.y);
}

// package:flutter_app/test.dart
class PointImplement implements Point {
  @override
  int get x => null;

  @override
  int get y => null;

  //  在同一个package下，所以需要重写私有的_size
  @override
  int _size;
}

// package:flutter_app/test2.dart
// 与test.dart不在同一个包下，所以不需要重写_size
import 'package:flutter_app/test.dart';
class PointImplement2 implements Point {
  @override
  int get x => null;

  @override
  int get y => null;
}
```

## covariant 

- 相当于java中的类型协变
- 返回值的类型协变是默认支持的
- 函数参数的类型协变，也就是参数是原来参数的子类，必须加上covariant关健字

```Dart
class Animal {
  void chase(Animal b) {

  }

  Animal test() {
    return this;
  }
}

class Mouse extends Animal {

}

class Cat extends Animal {

  // 函数参数协变，加上covariant关健字
  @override
  void chase(covariant Mouse b) {
    super.chase(b);
  }

  // 返回值的类型协变，默认是支持的
  @override
  Cat test() {
    return this;
  }
}
```