# Statements

## 基础

- 类、对象，结构、枚举等的声明和定义都是语句，后面都要加上一个分号
- 使用空语句时应当加上注释，让其它人知道这是一个 null statement，空语句块一样
- if else语句中， else 匹配最后出现的尚未匹配的 if 子句，建议总是在 if 、else后面使用花括号，避免错误
- switch语句，case标签必须是整型常量除非逻辑需要，每一个分支后面跟一个break,最好加上default语句，如果default语句什么都不做，加上一个空语句或空块

## 循环

- 无法确定循环要迭代多少次，并且一开始就要判断条件，用while语句
- **do-while语句,对于do-while语句中如果要定义循环变量，不允许在条件部分里定义变量，可以在循环部分，或者在语句外定义**
- **分号不要忘记！！**

```c++
do  {
   //statement
} while (condition);
```

## 泛形for语句

- **expression必须为一个序列，要想改变序列中元素的话，则declaration定义为序列元素的引用**
- **不能使用泛形for增删容器中的元素**

```c++
for(declaration:expression)
    statement
```