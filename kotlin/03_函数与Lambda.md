# 函数与 Lambda 表达式

-   [默认参数](#默认参数)
-   [命名参数](#命名参数)
-   [单表达式函数](#单表达式函数)
-   [可变数量的参数](#可变数量的参数)
-   [中缀表示法](#中缀表示法)
-   [函数作用域](#函数作用域)
    -   [局部函数](#局部函数)
    -   [尾递归函数](#尾递归函数)
-   [高阶函数与 lambda 表达式](#高阶函数与-lambda-表达式)
    -   [高阶函数](#高阶函数)
    -   [函数类型](#函数类型)
-   [Lambda](#lambda)
    -   [lambda 表达式传给最后一个参数](#lambda-表达式传给最后一个参数)
    -   [it：单个参数的隐式名称](#it单个参数的隐式名称)
    -   [从 lambda 表达式中返回一个值](#从-lambda-表达式中返回一个值)
    -   [下划线用于未使用的变量](#下划线用于未使用的变量)
    -   [lambda 表达式中的解构](#lambda-表达式中的解构)
-   [匿名函数](#匿名函数)
-   [闭包](#闭包)
-   [带有接收者的函数字面值](#带有接收者的函数字面值)

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

```kotlin
// val/var 变量名 = { 操作的代码 }
val l1 = { println() }

// val/var 变量名 : (参数的类型，参数类型，...) -> 返回值类型 = {参数1，参数2，... -> 操作参数的代码 }
val l3: (Int, Int) -> Int = { x, y -> x + y }

// val/var 变量名 = { 参数1 ： 类型，参数2 : 类型, ... -> 操作参数的代码 }
val l2 = { x: Int, y: Int -> x + y }
```

### lambda 表达式传给最后一个参数

-   **如果函数的最后一个参数接受函数，那么作为相应参数传入的 lambda 表达式可以放在圆括号之外**
-   **如果该 lambda 表达式是调用时唯一的参数，那么圆括号可以完全省略**

```kotlin
fun test(x: Int, f: (Int, Int) -> Int) {
}

fun test1(f: (Int, Int) -> Int) {
}

test(1, { x: Int, y: Int -> x + y })
// 一般用下面这种写法
test(1) { x: Int, y: Int -> x + y }

test1() {x: Int, y:Int -> x + y}
// 可以直接省略圆括号
test1 { x: Int, y:Int -> x + y}
```

### it：单个参数的隐式名称

-   **如果 lambda 只有一个参数，并且编译器可以识别出签名，可以不用声明唯一的参数并且忽略->,该参数会隐式声明为 it**

```kotlin
fun test2(x: Int, f: (Int) -> Int) {
}
// 正常的lambda表达式
test2(1) {x: Int -> x}
//只有一个参数，并且类型为Int,可以省略无用的参数与->，直接使用it
test2(1) {it}
```

### 从 lambda 表达式中返回一个值

-   隐式返回最后一个表达式的值
-   使用限定的返回语法从 lambda 显示返回一个值

```kotlin
val list = mutableListOf(1, 2, 3)
    list.filter {
        val flag = it > 2
        // 默认返回最后一个表达式的值
        flag
    }

    list.filter {
        // 因为return语句只能返回函数的运行，所以这里要使用限定的语法
        return@filter it > 2
    }
```

### 下划线用于未使用的变量

-   如果 lambda 表达式的参数未使用，使用下划线

```kotlin
 val map = mutableMapOf(
        "a" to "b",
        "c" to "d"
)
map.forEach { _, value -> println(value) }
```

### lambda 表达式中的解构

## 匿名函数

-   与一般函数类似，只不过没有函数名
-   对于具有表达式函数体的匿名函数将自动推断返回类型，而具有代码块函数体的返回类型必须显示指定返回类型，或者已假定为 Unit
-   匿名函数参数总是在括号内传递，只有 lambda 允许将函数体留在圆括号外面

```kotlin
fun test(x: Int, f: (Int, Int) -> Int) {
}

test(1, fun(x: Int, y: Int) = x + y)

test(1, fun(x: Int, y: Int): Int {
    return x + y
})
```

-   lambda 表达式与匿名函数的一个很大的区别在于不带标签的 return 的**非局部返回的行为**
    -   **lambda 表达式中的 不带标签的 return 将从包含它的函数返回**
    -   **匿名函数中的 不带标签的 return 将从匿名函数自身返回**

## 闭包

-   **lambda 表达式，匿名函数，局部函数，对象表达式可以访问其闭包，并且可以修改闭包中捕获的变量**

```kotlin
var sum = 0
val ints = listOf(1, 2, 3)
ints.filter { it > 0 }.forEach { sum += it }
println(sum)
```

## 带有接收者的函数字面值

-   在这样的函数字面值内部，传给调用的接收者对象成为隐式的 this,以便访问接收者对象的成员而无需任何额外的限定符

```kotlin
val f: Int.(Int) -> Int = {other: Int -> other + this}
println(1.f(2))

class HTML {
    fun createBody() {}
}

fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()
    html.createBody()
    return html
}
```

-   最重要使用限定接收者的函数值的地方:type-safe builders

```kotlin
class HTML {
    fun createBody() {}
}

fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()
    html.createBody()
    return html
}
```

## 函数
