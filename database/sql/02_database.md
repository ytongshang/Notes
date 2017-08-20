# DDL

## DATABASE

### 创建databases

```sql
CREATE DATABASE database_name;
```

### mysql中database的基本操作

- 显示所有的mysql管理的数据库

 ```sql
SHOW DATABASES;
 ```

- 显示当前使用的数据库

```sql
SELECT DATABASE();
```

- 使用某个数据库

```sql
USE database_name;
```

## CREATE TABLE

### 基本语法

```sql
CREATE TABLE 表名称
(
列名称1 数据类型 约束,
列名称2 数据类型 约束,
列名称3 数据类型 约束,
....
)
```

### mysql中常用的数据结构

数据类型        | 描述
----------------|-----------------------------------------------------------------------------------
integer(size) int(size) smallint(size)tinyint(size)   | 仅容纳整数。在括号内规定数字的最大位数。
decimal(size,d) numeric(size,d) | 容纳带有小数的数字。"size"规定数字的最大位数。"d" 规定小数点右侧的最大位数。
char(size)      | 容纳固定长度的字符串（可容纳字母、数字以及特殊字符）。在括号中规定字符串的长度。
varchar(size)   | 容纳可变长度的字符串（可容纳字母、数字以及特殊的字符）。在括号中规定字符串的最大长度。
date(yyyymmdd)  | 容纳日期。
