# Kotlin

## 变量

- val 只读局部变量，只能赋值一次
- var 可重新岍赋值的关健字

```kotlin
val a:Int = 1;
val b = 2;
val c : Int;
c = 3;

var x = 5;
x += 1;
```

- 支持全局变量与函数

```kotlin
val PI = 3.14;
var x = 0;
fun increment() {
    x += 1
}
```