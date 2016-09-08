* cat [选项] [文件]...
  1. 一次显示整个文件 **cat fileName**
  2. 从键盘创建一个文件，**cat > fileName，当输入完成后，ctrl+C结束**
  3. 将几个文件合并为一个文件:**cat file1 file2 > file**

* 命令参数
  1. -A, --show-all 等价于 -vET
  2. -b, --number-nonblank 对非空输出行编号
  3. -e  等价于 -vE
  4. -E, --show-ends 在每行结束处显示 **$** 符号
  5. -n, --number 对输出的所有行编号,由1开始对所有输出的行数编号
  6. -s, --squeeze-blank  有连续两行以上的空白行，就代换为一行的空白行
  7. -t  与 -vT 等价
  8. -T, --show-tabs 将跳格字符显示为 ^I
  9. -u  (被忽略)
  10. -v, --show-nonprinting   使用 ^ 和 M- 引用，除了 LFD 和 TAB 之外

* 命令示例
  1. 显示a.log中的内容
  ```
  cat a.log
  ```
  2. 创建一个新的文件，从建盘输入内容，只有文件不存在的时候，才会创建
  ```
  cat > b.log
  abc
  ```
  输入完成后以ctrl + c结束
  3. 把 a.log 的文件内容加上行号后输入 c.log 这个文件里
  ```
  cat -n a.log > c.log
  ```
  4. **tac (反向列示)**
  cat命令反过来写，功能与cat相反，cat是第一行到最后一行连续显示在屏幕上，而tac则是从最
  后一行到第一行显示在屏幕上
