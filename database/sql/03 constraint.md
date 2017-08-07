# CONSTRAINT

- 约束用于限制加入表的数据的类型。
- 可以在创建表时规定约束（通过 CREATE TABLE 语句），或者在表创建之后也可以（通过 ALTER TABLE 语句）。
- 常见的约束

```sql
NOT NULL
UNIQUE
DEFAULT
PRIMARY KEY
FOREIGN KEY
CHECK
```

## NOT NULL

- NOT NULL 约束强制列不接受 NULL 值。
- NOT NULL 约束强制字段始终包含值。这意味着，如果不向字段添加值，就无法插入新记录或者更新记录

```sql
CREATE TABLE Persons
(
Id_P int NOT NULL,
LastName varchar(255) NOT NULL,
FirstName varchar(255),
Address varchar(255),
City varchar(255)
)
```

## UNIQUE

- UNIQUE 约束唯一标识数据库表中的每条记录。
- UNIQUE 和 PRIMARY KEY 约束均为列或列集合提供了唯一性的保证。
- PRIMARY KEY 拥有自动定义的 UNIQUE 约束。
- 每个表可以有多个 UNIQUE 约束，但是每个表只能有一个 PRIMARY KEY 约束

### 基本使用

```sql
CREATE TABLE Persons
(
Id_P int NOT NULL UNIQUE,
LastName varchar(255) NOT NULL,
FirstName varchar(255),
Address varchar(255),
City varchar(255)
)
```

```sql
CREATE TABLE Persons
(
Id_P int NOT NULL,
LastName varchar(255) NOT NULL,
FirstName varchar(255),
Address varchar(255),
City varchar(255),
UNIQUE (Id_P)
)
```

### 如果需要命名 UNIQUE 约束，以及为多个列定义 UNIQUE 约束，请使用下面的 SQL 语法：

```sql
CREATE TABLE Persons
(
Id_P int NOT NULL,
LastName varchar(255) NOT NULL,
FirstName varchar(255),
Address varchar(255),
City varchar(255),
CONSTRAINT uc_PersonID UNIQUE (Id_P,LastName)
)
```

### 增加Unique约束

```sql
ALTER TABLE Persons
ADD UNIQUE (Id_P)
```

```sql
ALTER TABLE Persons
ADD CONSTRAINT uc_PersonID UNIQUE (Id_P,LastName)
```

### 撤消Unique约束

```sql
# mysql
ALTER TABLE Persons
DROP INDEX uc_PersonID
```

```sql
# SQL Server / Oracle / MS Access
ALTER TABLE Persons
DROP CONSTRAINT uc_PersonID
```

## DEFAULT

- DEFAULT 约束用于向列中插入默认值。
- 如果没有规定其他的值，那么会将默认值添加到所有的新记录。

```sql
CREATE TABLE Persons
(
Id_P int NOT NULL,
LastName varchar(255) NOT NULL,
FirstName varchar(255),
Address varchar(255),
City varchar(255) DEFAULT 'Sandnes'
)
```

- 通过使用类似 GETDATE() 这样的函数，DEFAULT 约束也可以用于插入系统值：

```sql
CREATE TABLE Orders
(
Id_O int NOT NULL,
OrderNo int NOT NULL,
Id_P int,
OrderDate date DEFAULT GETDATE()
)
```

### 新增DEFAULT约束

```sql
# mysql
ALTER TABLE Persons
ALTER City SET DEFAULT 'SANDNES'
```

```sql
# SQL Server / Oracle / MS Access
ALTER TABLE Persons
ALTER COLUMN City SET DEFAULT 'SANDNES'
```

### 撤销

```sql
# mysql
ALTER TABLE Persons
ALTER City DROP DEFAULT
```

```sql
# SQL Server / Oracle / MS Access
ALTER TABLE Persons
ALTER COLUMN City DROP DEFAULT
```

## CHECK

- CHECK 约束用于限制列中的值的范围。
- 如果对单个列定义 CHECK 约束，那么该列只允许特定的值。
- 如果对一个表定义 CHECK 约束，那么此约束会在特定的列中对值进行限制

```sql
CREATE TABLE Persons
(
Id_P int NOT NULL,
LastName varchar(255) NOT NULL,
FirstName varchar(255),
Address varchar(255),
City varchar(255),
CHECK (Id_P>0)
)
```

```sql
CREATE TABLE Persons
(
Id_P int NOT NULL,
LastName varchar(255) NOT NULL,
FirstName varchar(255),
Address varchar(255),
City varchar(255),
CONSTRAINT chk_Person CHECK (Id_P>0 AND City='Sandnes')
)
```

### 增加CHECK约束

```sql
ALERT TABLE Persons
ADD CHECK (ID_P > 0)
```

```sql
ALTER TABLE Persons
ADD CONSTRAINT chk_person CHECK (ID_P > 0 AND City = "Sandnes")
```

### 撤消CHECK约束

```sql
# SQL Server / Oracle / MS Access
ALTER TABLE Persons
DROP CONSTRAINT chk_persion
```

```sql
# SQL Server / Oracle / MS Access
ALTER TABLE Persons
DROP CHECK chk_persion
```
