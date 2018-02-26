# Sql

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

## SELECT

```sql
SELECT 列名称 FROM 表名称
SELECT * FROM 表名称
SELECT DISTINCT 列名称 FROM 表名称
```

## WHERE

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

## AND 和OR

```sql
SELECT * FROM Persons WHERE FirstName='Thomas' AND LastName='Carter'

SELECT * FROM Persons WHERE firstname='Thomas' OR lastname='Carter'

SELECT * FROM Persons WHERE (FirstName='Thomas' OR FirstName='William') AND LastName='Carter'
```

## ORDER BY

- **升序:ASC 降序:DESC**
- **指定了ORDER BY，但没有指定ASC，DESC，默认是ASC**
- **排序允许有多个字段**， 先对第一个字段排序，然后对结果按第二个字段，依次类推
- [MySql Order By 多个字段 排序规则](http://blog.csdn.net/xlxxcc/article/details/52250963)

```sql
-- 以Company升序排列，其他字段出现的顺序是自然排序的
SELECT Company, OrderNumber FROM Orders ORDER BY Company

-- 先以Company进行升序，然后再以OrderNumber进行升序
SELECT Company, OrderNumber FROM Orders ORDER BY Company, OrderNumber

-- 实际等同于ORDER BY Company ASC, OrderNumber DESC
SELECT Company, OrderNumber FROM Orders ORDER BY Company, OrderNumber DESC
```

## TOP相关

### TOP

- TOP 子句用于规定要返回的记录的数目
- 并非所有的数据库系统都支持 TOP 子句

```sql
-- SQL Server
SELECT TOP number|percent column_name(s) FROM table_name
```

```sql
-- MySQL中的limit与top作用类似
SELECT * FROM Persons LIMIT 5
```

### TOP PERCENT

- 希望从上面的 "Persons" 表中选取 50% 的记录

```sql
-- SQL server
SELECT TOP 50 PERCENT * FROM Persons
```

- mysql中不支持top percent,但是可以通过
