# Binary Search

-   [使用条件](#使用条件)
-   [查找等于给定值](#查找等于给定值)
-   [查找第一个值等于给定值的元素](#查找第一个值等于给定值的元素)
-   [查找最后一个值等于给定值的元素](#查找最后一个值等于给定值的元素)
-   [查找第一个 >=给定值的元素](#查找第一个-给定值的元素)
-   [查找最后一个<= 给定值的元素](#查找最后一个-给定值的元素)

## 使用条件

-   顺序表
-   有序

## 查找等于给定值

-   low <= high
-   防止越界，low + ((high-low) >>>1),而不是(low + high) /2
-   下次迭代为 mid + 1，或者 mid -1

```java
public static int binarySearch(int[] a, int fromIndex, int toIndex, int k) {
        if (a == null) {
            return -1;
        }
        checkRange(a, fromIndex, toIndex);
        int low = fromIndex;
        int high = toIndex;
        while (low <= high) {
            int mid = low + ((high - low) >>> 1);
            int value = a[mid];
            if (value == k) {
                return mid;
            } else if (value > k) {
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        return -1;
    }
```

## 查找第一个值等于给定值的元素

```java
 /**
     * 查找第一个值等于给定值的元素
     */
    public static int findFirstEquals(int[] a, int fromIndex, int toIndex, int k) {
        if (a == null) {
            return -1;
        }
        checkRange(a, fromIndex, toIndex);
        int low = fromIndex;
        int high = toIndex;
        while (low <= high) {
            int mid = low + ((high - low) >>> 1);
            int value = a[mid];
            if (value > k) {
                high = mid - 1;
            } else if (value < k) {
                low = mid + 1;
            } else {
                if (mid == 0 || a[mid - 1] != k) {
                    return k;
                } else {
                    high = mid - 1;
                }
            }
        }
        return -1;
    }
```

## 查找最后一个值等于给定值的元素

```java
    /**
     * 查找最后一个值等于给定值的元素
     */
    public static int findLastEquals(int[] a, int fromIndex, int toIndex, int k) {
        if (a == null) {
            return -1;
        }
        checkRange(a, fromIndex, toIndex);
        int low = fromIndex;
        int high = toIndex;
        while (low <= high) {
            int mid = low + ((high - low) >>> 1);
            int value = a[mid];
            if (value > k) {
                high = mid - 1;
            } else if (value < k) {
                low = mid + 1;
            } else {
                if (mid == toIndex || a[mid + 1] != k) {
                    return mid;
                } else {
                    low = mid + 1;
                }
            }
        }
        return -1;
    }
```

## 查找第一个 >=给定值的元素

```java
/**
     * 查找第一个 >=给定值的元素
     */
    public static int findFirstNoLessThan(int[] a, int fromIndex, int toIndex, int k) {
        if (a == null) {
            return -1;
        }
        checkRange(a, fromIndex, toIndex);
        int low = fromIndex;
        int high = toIndex;
        while (low <= high) {
            int mid = low + ((high - low) >>> 1);
            int value = a[mid];
            if (value < k) {
                low = mid + 1;
            } else {
                if (mid == 0 || a[mid - 1] < k) {
                    return mid;
                } else {
                    high = mid - 1;
                }
            }
        }
        return -1;
    }
```

## 查找最后一个<= 给定值的元素

```java
    /**
     * 查找最后一个<= 给定值的元素
     */
    public static int findLastNoMoreThan(int[] a, int fromIndex, int toIndex, int k) {
        if (a == null) {
            return -1;
        }
        checkRange(a, fromIndex, toIndex);
        int low = fromIndex;
        int high = toIndex;
        while (low <= high) {
            int mid = low + ((high - low) >>> 1);
            int value = a[mid];
            if (value > k) {
                high = mid - 1;
            } else {
                if (mid == toIndex || a[mid + 1] > k) {
                    return mid;
                } else {
                    low = mid + 1;
                }
            }
        }
        return -1;
    }
```
