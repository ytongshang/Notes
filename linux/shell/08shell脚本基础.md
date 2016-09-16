# 管道命令符

- 管道命令符"|"的作用是将前一个命令的标准输出当作后后一个命令的标准输入，格式为 **命令A|命令B**

- 管道命令符可以使用多次，**命令A|命令B|命令C...**

- 示例

  - 统计被限制登录的用户的个数

    ```bash
    grep /sbin/nologin /etc/passwd | wc -l
    ```

  - 向linuxprobe发送一封邮件

    ```bash
    echo "Mail Content" | mail -s "Subject" linuxprobe
    ```

  - 修改root的密码

    ```bash
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
  命令 > 文件    将标准输出重定向到一个文件中（清空原有文件的数据）
  命令 2> 文件    将错误输出重定向到一个文件中（清空原有文件的数据）
  命令 >> 文件    将标准输出重定向到一个文件中（追加到原有内容的后面）
  命令 2>> 文件    将错误准输出重定向到一个文件中（追加到原有内容的后面）
  命令 >> 文件 2>$1    将标准输出与错误输出共同写入到文件中（追加到原有内容的后面）
  ```

- 输入重定向符

  ```
  命令 < 文件    将文件作为命令的标准输入
  命令 << 分界符    从标准输入中读入，直到遇见“分界符”才停止
  命令 < 文件1 > 文件2    将文件1作为命令的标准输入并将标准输出到文件2
  ```

- 示例

  - 将man的帮助文档写到文件中

    ```bash
    man man > /root/man.txt
    ```

  - 向readme.txt中写入一行文字

    ```bash
    echo "Hello World" > readme.txt
    ```

  - 向readme.txt中追加一行文字

    ```bash
    echo "Hello World" >>readme.txt
    ```

  - 将readme.txt文件输入重定向来计算行数

    ```bash
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
  - 匹配零个或多个字符。
  ? 匹配任意单个字符。
  [0-9] 匹配范围内的数字。
  [abc] 匹配已出的任意字符。
  ```

- 特殊字符扩展

  ```
  \(反斜杠)    转义后面单个字符
  ''(单引号)    转义所有的字符
  ""(双引号)    变量依然生效
  ``(反引号)    执行命令语句
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

- alias命令用于设置命令的别名，格式为：**alias 别名=命令**,unalias命令用于取消命令的别名，格式为：**unalias 别名**

  ```
  比如担心复制文件时误将文件覆盖，可以重命名cp
  alias cp = "cp -i"
  unalias cp
  ```

- 在linux中所有的一切都是文件，命令文件也不例外，内部命令：属于解释器内部的；外部命令：独立于解释器外的命令文件

  ```
  步骤一:如果是以绝对/相对路径输入的命令则直接执行（如执行/bin/ls）。
  步骤二:检查是否为alias别名命令。
  步骤三:由bash判断其是“内部命令”还是“外部命令”。
  步骤四：通过$PATH变量中定义的路径进行命令查找
  ```

- 查看当前所有的环境变量，查看当前环境变量$PATH的值

  ```
  env
  echo $PATH
  ```

- 增加一个$PATH的值环境变量

  ```
  PATH=$PATH:/root/bin
  ```

- 重要的环境变量

  ```
  HOME    用户的主目录“家”。
  SHELL    当前的shell是哪个程序
  HISTSIZE    历史命令记录条数
  MAIL    邮件信箱文件
  LANG    语系数据
  RANDOM    随机数字
  PS1    bash提示符
  HISTFILESIZE    history命令存储数量
  PATH    在路径中的目录查找执行文件
  EDITOR    默认文本编辑器
  HOME    用户主目录
  ```

- 假设需要设置一个变量"WORKDIR"，让每个用户执行"cd $WORKDIR"都登陆到/home/workdir目录中，定义方法：变量名称=新的值，查看方法：echo $变量名称

  ```
  mkdir /home/workdir
  WORKDIR = /home/workdir
  cd $WORKDIR
  ```

- 环境变量是有范围的，一个用户设置的环境变量，其它用户不一定能用，这是因为就在于变量有作用范围。 export命令用于将局部变量提升为全局变量，格式为：**export 变量名[=变量值]**

  ```
  export WORKDIR
  ```
