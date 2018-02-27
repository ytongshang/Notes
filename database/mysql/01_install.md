# 安装MySql

## Ubuntu

- 安装

```bash
#安装mysql
sudo apt-get install mysql-server

# 依赖问题
sudo apt-get install -f
```

- 启动

```bash
service mysql start
service mysql stop
service mysql status

# 服务启动后端口查询
sudo netstat -anp | grep mysql
```

## 阿里云mysql远程连接

- **默认mysql只能本地访问，允许远程访问**

```bash
# ubuntu
sudo vi /etc/mysql/mysql.conf.d/mysqld.cnf

# 注释掉bind-address = 127.0.0.1 
```

- 本地root账户默认只能本地访问，允许远程访问,解决办法[mysql数据库设置远程连接权限](https://help.aliyun.com/knowledge_detail/40792.html?spm=5176.11065259.1996646101.searchclickresult.280a3ba03E06yq)

- **修改阿里云服务器的安全组，允许外部访问3306端口**

## 重置Root的密码

- 关闭MySQL server

```bash
# ubuntu
service mysql stop

# mac
mysql.server stop
```

- 终端进入mysql 的目录

```bash
# mac
cd /usr/local/mysql/bin
```

- sudo su 获取权限

- ./mysqld_safe --skip-grant-tables  然后重启mysql

```bash
./mysqld_safe --skip-grant-tables
```

- 重开一个终端，进入mysql命令交互模式

- 重新设置mysql密码

```bash
update user set authentication_string=password("新的密码") where User="root";
flush privileges;
```
