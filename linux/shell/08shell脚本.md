# 管道命令符
- 管道命令符"|"的作用是将前一个命令的标准输出当作后后一个命令的标准输入，格式为 **命令A|命令B**

- 管道命令符可以使用多次，**命令A|命令B|命令C...**

- 示例
  - 统计被限制登录的用户的个数
  ```
  grep /sbin/nologin /etc/passwd | wc -l
  ```

  - 向linuxprobe发送一封邮件
  ```
  echo "Mail Content" | mail -s "Subject" linuxprobe
  ```

  - 修改root的密码
  ```
  echo "newpassword" | passwd --stdin root
  ```

# 输入输出重定向
- 输入输出定义
```
标准输入(STDIN，文件描述符为0)：默认从键盘输入，为0时表示是从其他文件或命令的输出。
标准输出(STDOUT，文件描述符为1)：默认输出到屏幕，为1时表示是文件。
错误输出(STDERR，文件描述符为2)：默认输出到屏幕，为2时表示是文件。
```

- 输出重定向符
```
命令 > 文件	将标准输出重定向到一个文件中（清空原有文件的数据）
命令 2> 文件	将错误输出重定向到一个文件中（清空原有文件的数据）
命令 >> 文件	将标准输出重定向到一个文件中（追加到原有内容的后面）
命令 2>> 文件	将错误准输出重定向到一个文件中（追加到原有内容的后面）
命令 >> 文件 2>$1	将标准输出与错误输出共同写入到文件中（追加到原有内容的后面）
```

- 输入重定向符
```
命令 < 文件	将文件作为命令的标准输入
命令 << 分界符	从标准输入中读入，直到遇见“分界符”才停止
命令 < 文件1 > 文件2	将文件1作为命令的标准输入并将标准输出到文件2
```

- 示例
  - 将man的帮助文档写到文件中
  ```
  man man > /root/man.txt
  ```

  - 向readme.txt中写入一行文字
  ```
  echo "Hello World" > readme.txt
  ```

  - 向readme.txt中追加一行文字
  ```
  echo "Hello World" >>readme.txt
  ```

  - 将readme.txt文件输入重定向来计算行数
  ```
  wc -l < readme.txt
  ```

  - 从标准输入读入，直到遇到over结束，将内容发给root
  ```
  mail -s "Readme" root@linuxprobe.com <<over
  > I think linux is very practical
  > I hope to learn more
  > can you teach me ?
  > over
  ```
  - 将命令的错误信息输出到文件中
  ```
  ls xxxxxxx 2> /root/stderr.txt
  ```

# 命令通配符

- 通配符
```
*	匹配零个或多个字符。
?	匹配任意单个字符。
[0-9]	匹配范围内的数字。
[abc]	匹配已出的任意字符。
```

- 特殊字符扩展
```
\(反斜杠)	转义后面单个字符
''(单引号)	转义所有的字符
""(双引号)	变量依然生效
``(反引号)	执行命令语句
```

- 示例
  - 查看sda开头的所有设备文件
  ```
  ls /dev/sda*
  ```

  - 查看sda后面有一个字符的设备文件
  ```
  ls /dev/sda?
  ```

  - 查看sda后面包含0-9数字的设备文件：
  ```
  ls /dev/sda[0-9]
  ```

  - 查看sda后面是1或3或5的设备文件
  ```
  ls /dev/sda[135]
  ```

  - 变量
  ```
  PRICE = 5;
  echo "Price is $PRICE"   Price is 5
  echo "Price is \$$PRICE" Price is $5
  echo 'Price is \$$PRICE' Price is \$$PRICE
  ```

# 环境变量
