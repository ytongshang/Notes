# CONSTRAINT

- 约束用于限制加入表的数据的类型。
- 可以在创建表时规定约束（通过 CREATE TABLE 语句），或者在表创建之后也可以（通过 ALTER TABLE 语句）。
- 常见的约束

```sql
NOT NULL
UNIQUE
DEFAULT
CHECK
PRIMARY KEY
FOREIGN KEY
```

## NOT NULL

- **NOT NULL 约束强制列不接受 NULL 值**。
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
- **UNIQUE 和 PRIMARY KEY 约束均为列或列集合提供了唯一性的保证。**
- PRIMARY KEY 拥有自动定义的 UNIQUE 约束。
- **每个表可以有多个 UNIQUE 约束，但是每个表只能有一个 PRIMARY KEY 约束**

### 基本使用

```sql
-- 单列的Unique约束
CREATE TABLE Persons(
  Id_P INT UNIQUE ,
  LastName VARCHAR(255) NOT NULL ,
  FirstName VARCHAR(255) ,
  Address VARCHAR(255),
  City VARCHAR(255)
);

-- 命名 UNIQUE 约束
-- 多个列定义 UNIQUE 约束
CREATE TABLE Persons (
  Id_P      INT          NOT NULL,
  LastName  VARCHAR(255) NOT NULL,
  FirstName VARCHAR(255),
  Address   VARCHAR(255),
  City      VARCHAR(255),
  CONSTRAINT uc_PersonId UNIQUE (Id_P, LastName)
);
```

### 增加Unique约束

```sql
-- 增加单列Unique约束
ALTER TABLE Persons ADD UNIQUE (Id_P)

-- 增加多列Unique约束
ALTER TABLE Persons ADD CONSTRAINT test UNIQUE (Address, City);
```

### 撤消Unique约束

```sql
-- mysql 使用DROP INDEX
ALTER TABLE Persons DROP INDEX uc_PersonID

-- SQL Server / Oracle / MS Access
ALTER TABLE Persons DROP CONSTRAINT uc_PersonID
```

## Primary Key

- PRIMARY KEY 约束唯一标识数据库表中的每条记录。
- **主键必须包含唯一的值，自带Unique属性**
- **主键列不能包含 NULL 值。**
- **每个表都应该有一个主键，并且每个表只能有一个主键。**

```sql
-- 单列Primary Key
CREATE TABLE Persons (
  Id_P      INT          PRIMARY KEY ,
  LastName  VARCHAR(255) NOT NULL,
  FirstName VARCHAR(255),
  Address   VARCHAR(255),
  City      VARCHAR(255)
);

-- 多列Primary Key
CREATE TABLE Persons (
  Id_P      INT          NOT NULL ,
  LastName  VARCHAR(255) NOT NULL,
  FirstName VARCHAR(255),
  Address   VARCHAR(255),
  City      VARCHAR(255),
  CONSTRAINT pk_PersonId PRIMARY KEY (Id_P, LastName)
);
```

### 增加 PRIMARY KEY

```sql
-- 增加单列Primary Key
ALTER TABLE Persons ADD PRIMARY KEY (Id_P)

-- 增加多列Primary Key
ALTER TABLE Persons ADD CONSTRAINT pk_Persons PRIMARY KEY (Id_p, LastName)
```

### 撤消Primary key

```sql
-- SQL Server / Oracle / MS Access
ALTER TABLE Persons DROP CONSTRAINT pk_Persons

-- MYSQL
-- 一方面mysql没有DROP CONSTRAINT
-- 另一方面与Unique的DROP INDEX比较，mysql中 pk_Persons并不是一个命名的CONSTRAINT
ALTER TABLE Persons DROP PRIMARY KEY
```

## Foreign key

- **一个表中的 FOREIGN KEY 指向另一个表中的 PRIMARY KEY。**
- FOREIGN KEY 约束用于预防破坏表之间连接的动作
- FOREIGN KEY 约束也能防止非法数据插入外键列，因为它必须是它指向的那个表中的值之一

```sql
CREATE TABLE Orders
(
Id_O int NOT NULL,
OrderNo int NOT NULL,
Id_P int,
PRIMARY KEY (Id_O),
FOREIGN KEY (Id_P) REFERENCES Persons(Id_P)
)

-- 命名的foreign key
CREATE TABLE Orders
(
Id_O int NOT NULL,
OrderNo int NOT NULL,
Id_P int,
PRIMARY KEY (Id_O),
CONSTRAINT fk_PerOrders FOREIGN KEY (Id_P) REFERENCES Persons(Id_P)
```

### 增加 FOREIGN KEY

```sql
ALTER TABLE Orders
  ADD FOREIGN KEY(Id_P) REFERENCES Persons(Id_P)

-- 增加命名的foreign key
ALTER TABLE Orders
  ADD CONSTRAINT fk_Persons FOREIGN KEY (Id_P) REFERENCES Persons (Id_P);
```

### 撤消FOREIGN KEY

```sql
-- mysql
ALTER TABLE Orders
DROP FOREIGN KEY fk_PerOrders

-- SQL Server / Oracle / MS Access
ALTER TABLE Orders
DROP CONSTRAINT fk_PerOrders
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

### 撤销DEFAULT约束

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
# mysql
ALTER TABLE Persons
DROP CHECK chk_persion
```