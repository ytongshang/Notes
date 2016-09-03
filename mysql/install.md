#### cygwin下的mysql配置
1. 安装相应的组件

2. 在/usr/share/mysql/下找到my-large.cnf
```
cp /usr/share/mysql/my-large.cnf  /etc/my.cnf
```

3. vim 修改my.cnf配置文件
```
# Try number of CPU's*2 for thread_concurrency
  thread_concurrency = 4
  # 另外还需要添加如下行指定mysql数据文件的存放位置：
  datadir = /home/mysqldata
```

4. 新建/home/mysqldata文件夹

5. 执行 mysql_install_db
```
/bin/mysql_install_db
```

6. 启动与关闭
```
/usr/share/mysql/mysql.server start

/usr/share/mysql/mysql.server stop
```
