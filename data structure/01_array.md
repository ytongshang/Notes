# Array

## 基础

-   连续内存空间，存储相同类型的数据
-   下标从 0 开始，**a[k]\_address = base_address + k \* type_size,也适用于 0**
-   插入删除代价大
-   根据下标随机访问 O(1)
-   插入
    -   插入位置 k,k-n 之间的数据移动, **从后向前搬运**，O(n)
    -   插入位置 k,k 位置的数据移动到数组末尾，新数据插入位置 k,O(1)
-   删除
    -   删除 k 位置的数据，搬运数据 k-n 的数据，**从前向后搬运**，O(n)
    -   删除 k 位置的数据，将 k 位置标记为已删除，多次删除操作集中在一起执行，**标记清除算法**
    -   **删除后记得清除引用，防止内存泄漏**

## 技巧

-  扩容的技巧，参考ArrayList源码

```java

    public void add(T value) {
        ensureCapacity(size + 1);
        data[size++] = value;
    }

    private void ensureCapacity(int minCapacity) {
        minCapacity = Math.max(minCapacity, DEFAULT_SIZE);
        if (minCapacity - data.length > 0) {
            grow(minCapacity);
        }
    }

    private void grow(int minCapacity) {
        int oldCapacity = data.length;
        int newCapacity = data.length + (data.length >> 1);
        if (newCapacity < minCapacity) {
            newCapacity = minCapacity;
        }
        data = Arrays.copyOf(data, newCapacity);
    }
```

- 数组的拷贝使用以下的方法

```java
System.ArrayCopy();
Arrays.copyOf()；
```

-  remove之后，需要将引用置空，否则还会持有它的引用

```java
    public T remove(int index) {
        checkRange(index, 0, size);
        T value = (T) data[index];
        int moved = (size - 1) - (index + 1) + 1;
        if (moved > 0) {
            System.arraycopy(data, index + 1, data, index, moved);
        }
        // 去掉引用,否则还会持有引用的，不会gc
        data[size--] = null;

        return value;
    }
```

- removeAll，以被remove的集合遍例，因为Collection.contains可能有优化的,比如HashSet

```java
    public void removeAll(Collection<T> a) {
        if (a == null || a.isEmpty()) {
            return;
        }
        int w = 0;
        for (int i = 0; i < size; ++i) {
            if (!a.contains(data[i])) {
                data[w++] = data[i];
            }
        }
        if (w != size) {
            for (int i = w; i < size; ++i) {
                data[i] = null;
            }
        }
        size = w;
    }
```
