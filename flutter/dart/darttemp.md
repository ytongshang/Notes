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