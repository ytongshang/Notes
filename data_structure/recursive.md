# Recursive

## 选择递归

-   一个问题的解可以分解为几个子问题的解
-   这个问题与分解之后的子问题，除了数据规模不同，求解思路完全一样
-   存在递归终止条件

## 递归代码的弊端

### 递归代码要警惕堆栈溢出

-   当最大深度比较小时，可以通过限制调用的最大深度来解决这个问题
-   **最大深度比较大时，使用非递归代码，循环，或者自己模拟一个栈 用非递归代码实现**

```java
int depth = 0;
int f(int n) {
    ++depth;
    if (depth > 1000) {
        throw new Exception();
    }
    if (n ==1) return 1;
    return f(n-1) + 1;
}
```

### 警惕重复计算

-   使用递归会出来重复计算的问题

```java
public int f (int n) {
    if (n == 1) return 1;
    if (n == 2) return 2;

    if (hasSolvedList.containsKey(n)) {
        return hasSolvedList.get(n);
    }

    int ret = f(n-1) + f (n-2);
    hasSolvedList.put(n, ret);
    return ret;
}
```

### 函数调用过多

### 空间复杂度高

## 其它

- 递归调试
    -   打印日志方式
    -   条件断点
