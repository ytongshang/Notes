# Sql

- [基本语法](#基本语法)
- [DDL](#ddl)
    - [DATABASE](#database)
        - [创建databases](#创建databases)
        - [mysql中database的基本操作](#mysql中database的基本操作)
    - [CREATE TABLE](#create-table)
        - [mysql中常用的数据结构](#mysql中常用的数据结构)
- [DML](#dml)
    - [SELECT](#select)
    - [INSERT](#insert)
    - [UPDATE](#update)
    - [DELETE](#delete)
    - [WHERE](#where)
    - [AND 和OR](#and-和or)
    - [ORDER BY](#order-by)
    - [TOP相关](#top相关)
        - [TOP](#top)
        - [TOP PERCENT](#top-percent)
    - [LIKE](#like)
        - [通配符](#通配符)
    - [IN](#in)
    - [BETWEEN](#between)
    - [ALIAS](#alias)

## 基本语法

- sql语句末尾可以有分号，也可以没有分号

- DDL数据定义
    - CREATE DATABASE
    - ALTER DATABASE
    - CREATE TABLE
    - ALTER TABLE
    - DROP TABLE
    - CREATE INDEX
    - DROP INDEX

- DML数据操作语言
    - SELECT
    - UPDATE
    - DELETE
    - INSERT INTO

## DDL

### DATABASE

#### 创建databases

```sql
CREATE DATABASE database_name;
```

#### mysql中database的基本操作

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

### CREATE TABLE

```sql
CREATE TABLE 表名称
(
列名称1 数据类型 约束,
列名称2 数据类型 约束,
列名称3 数据类型 约束,
....
)
```

#### mysql中常用的数据结构

数据类型        | 描述
----------------|-----------------------------------------------------------------------------------
integer(size) int(size) smallint(size)tinyint(size)   | 仅容纳整数。在括号内规定数字的最大位数。
decimal(size,d) numeric(size,d) | 容纳带有小数的数字。"size"规定数字的最大位数。"d" 规定小数点右侧的最大位数。
char(size)      | 容纳固定长度的字符串（可容纳字母、数字以及特殊字符）。在括号中规定字符串的长度。
varchar(size)   | 容纳可变长度的字符串（可容纳字母、数字以及特殊的字符）。在括号中规定字符串的最大长度。
date(yyyymmdd)  | 容纳日期。

## DML

### SELECT

```sql
SELECT 列名称 FROM 表名称
SELECT * FROM 表名称
SELECT DISTINCT 列名称 FROM 表名称
```

### INSERT

```sql
INSERT INTO 表名称 VALUES (值1, 值2,....)

INSERT INTO table_name (列1, 列2,...) VALUES (值1, 值2,....)
```

```sql
INSERT INTO Persons
VALUES ('Gates', 'Bill', 'Xuanwumen 10', 'Beijing')

-- 插入部分列
INSERT INTO Persons (LastName, Address)
VALUES ('Wilson', 'Champs-Elysees')
```

### UPDATE

```sql
UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 某值
```

```sql
UPDATE Person SET FirstName = 'Fred'
WHERE LastName = 'Wilson'

-- 修改多行
UPDATE Person SET Address = 'Zhongshan 23', City = 'Nanjing'
WHERE LastName = 'Wilson'
```

### DELETE

- DELETE 语句用于删除表中的行

```sql
DELETE FROM 表名称 WHERE 列名称 = 值
```

```sql
-- 删除某行
DELETE FROM Person
WHERE LastName = 'Wilson'

--可以在不删除表的情况下删除所有的行。这意味着表的结构、属性和索引都是完整的
DELETE FROM table_name
DELETE * FROM table_name
```

### WHERE

```sql
SELECT 列名称 FROM 表名称 WHERE 列 运算符 值
```

操作符  | 描述
--------|--------------
=       | 等于
<>      | 不等于
>       | 大于
<       | 小于
>=      | 大于等于
<=      | 小于等于
BETWEEN | 在某个范围内
LIKE    | 搜索某种模式

- **SQL 使用单引号来环绕文本值**,大部分数据库系统也接受双引号。
- **如果是数值，不要使用引号**

### AND 和OR

```sql
SELECT * FROM Persons
WHERE FirstName='Thomas' AND LastName='Carter'

SELECT * FROM Persons
WHERE firstname='Thomas' OR lastname='Carter'

SELECT * FROM Persons
WHERE (FirstName='Thomas' OR FirstName='William') AND LastName='Carter'
```

### ORDER BY

- **升序:ASC 降序:DESC**
- **指定了ORDER BY，但没有指定ASC，DESC，默认是ASC**
- **排序允许有多个字段**， 先对第一个字段排序，然后对结果按第二个字段，依次类推
- [MySql Order By 多个字段 排序规则](http://blog.csdn.net/xlxxcc/article/details/52250963)

```sql
-- 以Company升序排列，其他字段出现的顺序是自然排序的
SELECT Company, OrderNumber
FROM Orders
ORDER BY Company

-- 先以Company进行升序，然后再以OrderNumber进行升序
SELECT Company, OrderNumber
FROM Orders
ORDER BY Company, OrderNumber

-- 实际等同于ORDER BY Company ASC, OrderNumber DESC
SELECT Company, OrderNumber
FROM Orders
ORDER BY Company, OrderNumber DESC
```

### TOP相关

#### TOP

- TOP 子句用于规定要返回的记录的数目
- 并非所有的数据库系统都支持 TOP 子句

```sql
-- SQL Server
SELECT TOP number|percent column_name(s)
FROM table_name
```

```sql
-- MySQL中的limit与top作用类似
SELECT *
FROM Persons
LIMIT 5
```

#### TOP PERCENT

- 希望从上面的 "Persons" 表中选取 50% 的记录

```sql
-- SQL server
SELECT TOP 50 PERCENT * FROM Persons
```

- mysql中不支持top percent,但是可以通过count间接来实现

```sql
-- 可以通过count查询所以的数目，间接实现百分比
mysql> select count(*) as rows from city;

-- 向变量赋值@percent 取前50%的行数
mysql> select count(*)*50/100 into @percent from city;

-- 预设SQL语句
mysql> prepare stmt from "select * from city limit ?";

-- 运行预设SQL语句
mysql> execute stmt using @percent;
```

### LIKE

- LIKE 操作符用于在 WHERE 子句中搜索列中的指定模式,一般要搭配通配符使用

```sql
-- 以B开头的城市
select * from city where Name Like 'B%';

-- 以alya结尾的城市
select * from city where Name like '%alya';

-- 中间含有lany的城市
select * from city where Name like '%lany%';

--中间不含有字母a的城市
select * from city where Name not like '%a%';
```

#### 通配符

- 在搜索数据库中的数据时，您可以使用 SQL 通配符
- **通配符必须和LIKE一起使用**

通配符                      | 描述
----------------------------|----------------------------
%                           | 替代一个或多个字符
_                           | 仅替代一个字符
[charlist]                  | 字符列中的任何单一字符
[!charlist] 或者[^charlist] | 不在字符列中的任何单一字符

### IN

- IN 操作符允许我们在 WHERE 子句中规定多个值

```sql
SELECT column_name(s)
FROM table_name
WHERE column_name IN (value1,value2,...)
```

```sql
select * from city where CountryCode in ('USA','UZB');
```

### BETWEEN

- 操作符 BETWEEN ... AND 会选取介于两个值之间的数据范围。**这些值可以是数值、文本或者日期**
- **不同的数据库对于区间的闭合是有区别的，如果不清楚，可以考虑使用具体的逻辑操作符**

```sql
SELECT column_name(s)
FROM table_name
WHERE column_name
BETWEEN value1 AND value2
```

```sql
-- 列出人数在1 与40000之间的城市
select * from city where Population between 1 and 40000;

-- 人数不在1与500000之间的城市
-- 对于不在区间内，使用NOT操作符
select * from city where Population not between 1 and 500000;
```

### ALIAS

- 通过使用 SQL，可以为列名称和表名称指定别名（Alias）

```sql
-- 表的别名
SELECT column_name(s)
FROM table_name
AS alias_name

-- 列的别名
SELECT column_name AS alias_name
FROM table_name
```

```sql
-- 假设我们有两个表分别是："Persons" 和 "Product_Orders"
-- 希望列出 "John Adams" 的所有定单
-- 表名的别名使我们书写起来更加的方便
SELECT po.OrderID, p.LastName, p.FirstName
FROM Persons AS p, Product_Orders AS po
WHERE p.LastName='Adams' AND p.FirstName='John'

-- 有意义的别名
SELECT LastName AS Family, FirstName AS Name
FROM Persons
```