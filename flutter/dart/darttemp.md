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