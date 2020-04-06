# Expression

- [C++运算符优先级](https://www.sojson.com/operation/cxx.html)

## 左值与右值

- **当一个对象被用作右值的时候，用的是对象的值(内容)：当对象被用作左值的时候，用的是对象的身份(在内存中的位置)**
- **对于左值可以执行取地址操作**
- **在需要右值的地方可以用左值来代替，但是不能把右值当左值使用**
- **如果表达式的值是左值，那么decltype作用于该表达式（不是变量），得到的是一个引用类型**

- 常见的用到左值的地方：
    - 赋值，a=b,a为非const左值对象，返回左值
    - 取地址，作用于左值对象，所得的指针是一个右值，int *pa = &a;a为左值对象，pa为右值
    - 内置解引用，下标运算符，迭代器解引用，string，vector的下标运算符的结果为左值
    - 递增递减运算符作用于左值，++a，--a,其前置版本所得结果也是左值
- decltype，如果表达式的求值结果是左值，decltype作用于该表达式(不是变量)得到一个引用类型

```c++
int a = 100;
int *pa = &a;
decltype (*pa) c = a; // 类型为int&，必须初始化
decltype(&pa) d;      // 类型为int**
```

## 求值顺序

- 明确定义了运算对象求值顺序：&&,||,?:和逗号运算符
- 如果改变了某个运算对象的值，在表达式的其它地方不要再使用这个运算对象，因为同一个表达式中的运算对象的求值顺序是没有
 规定的

## 算术运算符

- **C++11规定除法的商一律向0取整，也就是直接切除小数部分**，比如将-3.6,-3.2转换为整数都是向0取整，都是-3
- m%n的符号与m相同
- (-m)/n,m/(-n)都等于-(m/n)
- m%(-n)等于m%n,(-m)%n等于-（m%n）

## 逻辑与关系运算符

- **除非进行比较运算时运算对象是布尔类型，否则不要使用布尔字面值true与false作为运算对象**

```c++
// 正确作法
if（val） {...}
if(!val) {...}

// 可能出现的错误
int val = 2;
// 因为小整型会自动转换为整型，所以true->1,所以只有当val=1时，val==true才为真，其它都是假
if (val == true) {...}
```

## 赋值运算符

- 赋值运算符的左侧必须是一个可以修改的左值
- 赋值运算符的结果是左侧的运算对象，并且也是一个左值
- 采用**初始值列表的方式初始化，如果左侧运算对象是内置类型，那么初始值列表最多只能包含一个值，而且该值即使转换的话其所占空间也不大于目标空间**
- 无论左侧的运算对象是什么，初始值列表都可以为空，此时编译器会创建一个值初始化的临时变量，并且赋给左侧的对象

```c++
int k = 0;
k = {3.14}      //错误，列表初始化不能将double转为int
```

## 自增自减运算符

- **前置版本将对象本身作为左值返回，后置版本则将对象初始值的副本作为右值返回**
- **除非必须，否则不用自增自减运算符的后置版本**

```c++
auto pbeg = v.begin();
while(pbeg != v.end() && *pbeg >= 0) {
    cout << *pbeg++ <<endl;
    // 由于后置自增运算符的优先级高于解引用运算符，实际相当于*(pbeg++), 将pbeg的值加1，并且返回运算前对象值的副本
}
```

## 箭头运算符与点运算符

- 箭头运算符作用于一个指针类型的运算对象，结果是一个左值
- 点运算符分为两类：如果成员所属的对象是左值，那么结果是左值，如果成员所属的对象是右值，那么结果是右值

## 位运算符

- 求反：~
- 左移：<<
- 右移：>>
- 位与：&
- 位异或：^
- 位或：|

- 一般只用位运算符去处理unsigned类型
- 左移在右侧插入值为0的二进制位，
- 右移的行为依赖其左侧的运算对象的类型：
   - 如果运算对象是无符号类型，在左侧插入值为0的二进制位
   - 如果该运算对象是带符号类型，在左侧插入符号位的副本或值为0的二进制位，视具体环境而定

## sizeOf运算符

- sizeof运算符返回一个表达式或一个类型名字所占的字节数

```c++
sizeof (type)
sizeof expr
```

- sizeof满足右结合律，**返回类型是一个size_t的类型的常量表达式，可以做数组的容量等**

```c++
Sales_data data, *p;
sizeof(Sales_data);         //存储Sales_data的空间大小
sizeof data;                // 同sizeof(Sales_data)
sizeof p;                   // 指针所占的空间大小
sizeof *p;                  // 同sizeof(Sales_data),p不需要有效
sizeof data.revenue         // Sales_data 中间revenue成员对应类型的大小
sizeof Sales_data::revenue  // 另一种获得revenue成员大小的方式
```

- sizeof不会实际求算对象的值，所以即使p是一个无效（没有初始化）的指针，sizeof也不会有什么影响

- 常见的结果
    - sizeof char 返回1
    - 对引用类型，返回被引用对象所占空间的大小
    - 对于指针类型，返回指针本身所占空间的大小
    - 对解引用指针执行sizeof运算得到指针指向的对象所占的空间大小，指针不需要有效
    - 对于数组执行sizeof，等价于对数组中所有元素执行一次sizeof然后求和，sizeof不会把数组当指针处理，与decltype相同
    - sizeof()作用于string、vector时，只返回该类型固定部分的大小，不计算对象中元素占用了多少空间

```c++
int ia[10] = {};
// 总长度/首个元素的大小，返回数组长度
constexpr size_t sz = sizeof(ia) / sizeof(*ia);
```

## 类型转换

- 算术转换：运算符的运算对象转换成最宽的字符，比如int 与unsigned int一起，int转换为unsigned int
- 整型提升：小整型转换为int(bool,char,signed char,unsigned char,short,unsigned short)
  较大的char(wchar_t,char16_t,char32_t)转为int,unsigned int,long,unsigned long ,long long ,unsigne,long long中能容纳对象的最小的类型
- 如果无符号不小于有符号的，有符号的转为无符号的，如果有有符号的大于无符号类型，具体行为依赖于机器
- 数组转为指向首元素的指针
- 0，nullptr转换为任意类型的指针
- 非0为true,0为false
- 允许将指向非常量的指针或引用转换成指针相应常量的引针/引用，也就是可以用T的指针/引用初始化const T的指针/引用

 ```c++
 int i;
 const int &j = i ;   // 正确
 const int *p = &i;   // 正确
 int &r = j, *q = p;  // 错误，非const指针/指针只能用非const初始化
 ```

## 强制转换

### const_cast

- const_cast ，改变对象的const,对于底层const的增删，只能用const_cast,只有使用 const_cast才能将const性质转换掉。在这种情况下，试图使用其他三种形式的强制转换都会导致编译时的错误。类似地，除了添加或删除_const 特性，用const_cast 符来执行其他任何类型转换，都会引起编译错误。

```c++
const char *pc;
char *ptr = const_cast<char*>(pc);
```

- **常见的一种用法就是先定义了类的const成员函数，想定义其非const的重载时，先将非const参数用const_cast转化为底层const,然后调用其底层const版本的函数，最后又将参数转回为非底层const**

### static_cast

- 只要不包含底层const,都可以使用static_cast
- 当需要将一个较大的算术类型赋值给较小的类型时，使用强制转换非常有用。此时，强制类型转换告诉程序的读者和编译器：我们知道并且不关心潜在的精度损失。
 对于从一个较大的算术类型到一个较小类型的赋值，编译器通常会产生警告。当我们显式地提供强制类型转换时，警告信息就会被关闭。 
- 如果编译器不提供自动转换，使用 static_cast 来执行类型转换也是很有用的。例如，下面的程序使用 static_cast 找回存放在 void* 指针中的值

```c++
double d = 15.0;
void* p = &d;
// ok: address of any data object can be stored in a void*
// ok: converts void* back to the original pointer type
double *dp = static_cast<double*>(p);
```

### dynamic_cast

- dynamic_cast只用于对象的指针和引用。
- 当用于多态类型时，它允许任意的隐式类型转换以及相反过程。
- 不过，与static_cast不同，在后一种情况里（注：即隐式转换的相反过程），dynamic_cast会检查操作是否有效。
 也就是说，它会检查转换是否会返回一个被请求的有效的完整对象。检测在运行时进行。如果被转换的指针不是一个被请求的有效完整的对象指针，返回值为NULL.
- dynamic_cast 主要用于执行“安全的向下转型（safe downcasting）”，也就是说，要确定一个对象是否是一个继承体系中的一个特定类型。它是唯一不能用旧风格语法执行的强制转型，也是唯一可能有重大运行时代价的强制转型。

```c++
 //假定 Base 是至少带一个虚函数的类，并且 Derived 类派生于 Base 类。如果有一个名为 basePtr 的指向 Base 的
 //指针，就可以像这样在运行时将它强制转换为指向 Derived 的指针：
  if (Derived *derivedPtr = dynamic_cast<Derived*>(basePtr)) {
     // use the Derived object to which derivedPtr points
   } else { // BasePtr points at a Base object
      // use the Base object to which basePtr points
   }

 ```

### reinterpret_cast

- 是特意用于底层的强制转型，导致实现依赖（implementation-dependent）（就是说，不可移植）的结果，基本上很少见.

### 旧式强制类型转换

```c++
type(expr);
(type)expr;
```