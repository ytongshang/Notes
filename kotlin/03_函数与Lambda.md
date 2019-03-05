# 函数与 Lambda 表达式

## 默认参数

-   函数可以有默认参数，**override 一个带有默认参数的方法时，必须省略默认参数值**
-   **如果一个默认参数在一个无默认参数之前，那么该默认值只能通过命名参数调用**
-   如果最后一个 lambda 表达式参数从括号外传给函数调用，那么允许默认参数不传值

```kotlin
// 构造函数的默认参数
open class A(val name: String = "HelloWorld") {
    open fun print(x: String = "AAA") {
        println(x)
    }

    fun add(x: Int = 0, y: Int) {
        print("x:$x, y:$y")
    }
}

class B(name: String) : A(name) {
    override fun print(x: String) {
        println("B:$x")
    }
}


fun main(args: Array<String>) {
    val a1 = A("Kotlin")
    println(a1.name)

    val a2 = A()
    println(a2.name)

    // 命名参数调用
    a1.add(x= 1, y = 2)
    a1.add(0, 1)
    a1.add(y = 1)
}
```

## 命名参数

-   所有的位置参数都要放在第一个命名参数之前

```kotlin
fun namedParam(x: Int, y: Int = 2, z: Int, w: Int) {
}

namedParam(x= 1, z = 2, w = 4)
```

## 单表达式函数

```kotlin
fun double(x: Int): Int = x * 2
fun trible(x: Int) = x * 3
```

## 可变数量的参数

-   vararg，实际上是一个数组
-   只能有一个参数为 vararg
-   如果不是列表中的最后一个参数，使用命名参数
-   如果已有一个数组，使用 spread 操作符

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) {
        result.add(t)
    }
    return result
}

val list1 = asList(1, 2, 3)
val array = arrayOf(1, 2, 3, 4)
val list2 = asList(100, 2, *array, 100)
```

## 中缀表示法

-   infix
-   中缀表示法，忽略该调用的点与圆括号
-   要求
    -   必须成员函数或扩展函数
    -   必须只有一个参数
    -   其参数不得接受可变数量的参数且不能有默认值
-   **中缀函数调用的优先级低于算术表达式，类型转换和 rangeTo 操作符**

```kotlin
infix fun Int.a(x: Int): Int {
    return 1
}

println(1 a 2)
println(1.a(2))
```

## 函数作用域

### 局部函数

-   支持在函数中定义函数
-   支持闭包

### 尾递归函数

## 高阶函数与 lambda 表达式

-   first class

### 高阶函数

-   将函数用作参数或返回值的函数

```kotlin
fun <T, R> Collection<T>.fold(initial: R,
                              combine: (acc: R, next: T) -> R): R {
    var result : R = initial
    for (element in this) {
        result = combine(result, element)
    }
    return result
}
```

### 函数类型

-   Unit 返回类型不可省略
-   **函数类型可以有一个额外的接收者类型，A.(B) -> C, 表示可以在 A 的接收者对象上以一个 B 类型参数来调用并返回一个 C 类型值的函数**
-   挂起函数，supend () ->Unit ,supend A.(B) -> C
-   函数类型指定为可空
-   箭头表示法，右结合
-   类型别名

```kotlin
// 可空函数参数
fun f1(x: (() -> Unit)?) {
}

// 右结合
fun f2(): (Int) -> ((Int) -> Unit) {
    //
}

// 类型别名
typealias f3 = (Int, Int) -> Unit
```

## Lambda
