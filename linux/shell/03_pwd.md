* print working directory

* pwd [选项]

* 查看”当前工作目录“的完整路径
 1. **pwd -L** :打印逻辑路径，使用环境中的路径，即使包含了符号链接
 2. **pwd -P** :打印物理路径，如果目录是一个链接目录，则会打印其链接所指的物理路径
 3. 如果使用pwd没有指定参数，会使用pwd -P