# Tree

## 基本

-   ![树的基础概念](./../image-resources/algo/tree基础.jpg)

## 二叉树基础

-   满二叉树
-   完全二叉树
-   前序遍历
-   中序遍历
-   后序 遍历
-   按层遍历
-   **用数组表示完全二叉树，从位置 1 开始存储数据，如果节点 X 存储在数组中下标为 i 的位置，下标为 2 i 就是左子节点，2i+1 就是右子节点**

## 二分搜索树

-   **在树中的任意一个节点，其左子树中的每个节点的值，都要小于这个节点的值，而右子树节点的值都大于这个节点的值**

### 查找

```java
    public TreeNode find(int data) {
        if (root == null) {
            return null;
        }
        TreeNode node = root;
        while (node != null) {
            if (node.value == data) {
                return root;
            } else if (node.value > data) {
                node = node.left;
            } else {
                node = node.right;
            }
        }
        return null;
    }
```

### 插入

```java
    public void insert(int data) {
        if (root == null) {
            root = new TreeNode(data);
            return;
        }
        TreeNode p = root;
        while (p != null) {
            if (data >= p.value) {
                if (p.right == null) {
                    p.right = new TreeNode(data);
                    return;
                }
                p = p.right;
            } else {
                if (p.left == null) {
                    p.left = new TreeNode(data);
                    return;
                }
                p = p.left;
            }
        }
    }
```

### 删除

```java
    public void delete(int value) {
        TreeNode p = root;
        TreeNode pp = null;
        while (p != null && p.value != value) {
            // 首先查找要删除的节点
            pp = p;
            if (p.value > value) {
                p = p.left;
            } else {
                p = p.right;
            }
        }
        if (p == null) {
            // 没有找到值为value的节点
            return;
        }
        if (p.left != null && p.right != null) {
            // 查找右子树最小的叶子节点
            // 或者左子树最大的叶子节点
            TreeNode minP = p.right;
            TreeNode minPP = p;
            while (minP.left != null) {
                minPP = minP;
                minP = minP.left;
            }
            // 顶点的值设为右最小节点的值，相当于顶点那个值不存在了，只要删除右最小节点就可以了
            p.value = minP.value;
            // 要删除的的节点从顶点变为了右子树最小的节点
            p = minP;
            pp = minPP;
        }
        // 最终删除的都变成了叶子节点，或只有一个节点的节点
        TreeNode child;
        if (p.left != null) {
            child = p.left;
        } else if (p.right != null) {
            child = p.right;
        } else {
            child = null;
        }
        if (pp == null) {
            // 删除的是根节点
            root = null;
        } else if (pp.left == p) {
            // 删除的是左节点
            pp.left = child;
        } else {
            // 删除的是右节点
            pp.right = child;
        }
    }
```
