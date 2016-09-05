#### 连接
* 连接mysql,输入下面命令，然后再输入密码，也可以直接在连接中选择要使用的表名
```
mysql -h localhost -u root -p
或
mysql -h localhost -u root -p rancune
```

* 帮助，清除，退出
```
\h 或help
\c
\q 或 quit
```

* mysql通过寻找终止分号而不是输入行的结束来决定语句在哪儿结束。（换句话说，mysql接受
自由格式的输入：它收集输入行但直到看见分号才执行。）
```
mysql select version();now();user();
```

* 提示符含义
  1. -> 等待多行命令的下一行。
  2. '> 等待下一行，等待以单引号(“'”)开始的字符串的结束
  3. "> 等待下一行，等待以双引号(“"”)开始的字符串的结束。
  4. `> 等待下一行，等待以反斜点(‘`’)开始的识别符的结束。
  5. /* > 等待下一行，等待 /*开始的注释的结束*/
```
mysql> SELECT * FROM my_table WHERE name = 'Smith AND age < 30;
    '>
    '> '\c
```

#### 基本操作
* 显示所有的mysql管理的数据库
```
SHOW DATABASES;
```

* 显示当前使用的数据库
```
SELECT DATABASE();
```

* 显示当前数据库所有的表名
```
SHOW TABLES;
```

* 显示一个表的详细结构
```
DESCRIBE <table-name>;
```

#### 批处理操作
* 把你想要运行的命令放在一个文件中，然后告诉mysql从文件读取它的输入
```
mysql -h localhost -u root -p < /home/mysqldata/script/script
```

* 如果你有一个产生多个输出的查询，你可以通过一个分页器而不是盯着它翻屏到屏幕的顶端来
运行输出
```
shell> mysql < batch-file | more
```

* 可以将执行的结果输出到一个文件中
```
 mysql < batch-file > mysqlresult.txt
```

* 在批处理中输出的格式比交互模式下的简单，如果要输出的格式与交互一样，使用-t命令
```
mysql -t -h localhost -u root -p < /home/mysqldata/script/script
```

* 如果要输出mysql执行的语句
```
 mysql -vvv -t -h localhost -u root -p < /home/mysqldata/script/script
```
