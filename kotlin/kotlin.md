# Kotlin

## 变量

-   **val 只能赋值一次, 相当于 java 中的 final**
-   **val 是可以先定义暂时不赋值,如果只定义不赋值，必须指定类型**
-   **可重新赋值的变量 var**

```kt
val a:Int = 1;
val b = 2;
val c : Int;
c = 3;

var x = 5;
x += 1;
```

-   支持全局变量与函数

```kotlin
val PI = 3.14;
var x = 0;
fun increment() {
    x += 1
}
```
