# Heap

## 数据结构定义

-   完全二叉树
-   每一个节点的值都必须大于等于(或小于等于)其子树中的每一个节点的值
-   从下标 0 开始，节点 i
    -   左节点，2i + 1
    -   右节点, 2(i + 1)
    -   父节点，(i-1)/2
-   **大小为 n 的堆，最后一个非叶子节点，实际也就是最后一个节点的父节点，下标(n-1)/2**

## 数组原地建堆

-   方法 1：**假设起始堆中只有一个数据，然后调用堆的插入将数组后面的数据依次插入堆化**，从前向后处理数组数据，每个数组插入堆中，从下向上堆化
-   方法 2：从最后一个非叶子节点开始，依次堆化, **最后一个非叶子节点，也就是最后一个节点的父节点，最后一个节点size -1(假设堆的大小为size),那么最后一个非叶子节点下标为(size-1-1)/2**

## 排序

-   **一次堆化后，每次将堆顶与最后一个元素交换位置，然后堆大小减1，递归整个过程**
