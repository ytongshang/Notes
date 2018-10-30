# String Vector and Array

## namespace

- 使用命名空间

```c++
using namespace std;
using std::cout;
using std::endl;
```

- **头文件中不应当包含using声明**，因为头文件会被拷贝到所有引用它的文件中去，如果头文件有某个using声明，那么每个使用了该头文件的文件都会有这个声明，对于某些程序来说，由于不经意间包含了一些名字，反而可能产生始料未及的名字冲突。

## String

### 拷贝初始化与直接初始化

- 如果使用等号初始化，实际上执行的是拷贝实始化
- 如果不使用等号，执行的是直接初始化

```c++
string s1= "hello world";  //拷贝初始化
string s2("hello wrold");  //直接实始化
string s3(3, "n");         //直接实始化，nnn
```

### getline

- getline函数从流中读取内容，直到遇到换行符，然后读取的内容被存到string中去，**换行符被丢弃，实际读取的string中不含有换行符**

```c++
string line;
while (getline(cin,line)) {
    cout << line << enld;
}
```

### size

- **string的size()函数返回的是类型是string::size_type类型，它是一个unsigned类型**，并且大小足够存放任何string的大小

```c++
string a = "yes";
string::size_type size1 = a.size();
// 也可以使用auto类型推断
auto size2 = a.size();
```

- **如果一个表达式中已经有了size()函数，那么就不要再使用int了，因为这样可以避免int与unsigned 类型混用的问题。**

### 字符串相加

- std::string对象与c风格字符串字面值并不是同一个类型
- **当std::string与字符串字面值一起混用时，必须保证每个"+"的两侧至少有一个是std::string对象**

### 处理字符串中的字符

#### 泛型for语句

- **如果想要改变string对象中的字符，那么泛型for语句中必须定义为引用类型**

```c++
string a = "Hello Wrold";
for (auto &c : a ) {
    c = toupper(c);
}
cout << a << endl;   // HELLO WORLD
```

#### 下标运算符

- []参数是string::size_type类型
- **[]运算符返回的是该位置上的字符的引用**

## vector

- **模板本身不是类或函数**，相反可以将模板看作为编译器生成类或函数编写的一份说明，编译器根据模板创建类或函数的过程被称为实例化，比如vector是模板并不是类型，vector<int>才是类型，这点与java是不同的
- **因为引用不是对象，所以不能创建引用的vector**

### vector的初始化

- **如果使用圆括号，可以说提供的值是用来构造vector对象的**，也就是调用其对应的构造函数的
- **如果用的是花括号，可以表达成我们想使用列表初始化该地象**，只有在无法执行列表初始化时才会考虑其它初始化方式
- **如果初始化时使用了花括号的形式但是提供的值又不能用来列表初始化，就要考虑用这样的值来构造vector对象了**，也就是考虑对应的构造函数

```c++
vector<int> ivec;               // 空的vector<int>
vector<int> ivec2(ivec);        // 把ivec的元素拷贝给ivec2
vector<int> ivec3{1,3,70};      // 列表初始化


vector<int> ivec4(10);          // 10 个元素
vector<int> ivec5{10};          // 1个元素，10
vector<int> ivec6(10,1);        // 10个元素，每个元素初始化为1
vector<int> ivec6{10,1};        // 2个元素，10，1

vector<string> svec{"hi"};      // 列表初始化，只有一个元素hi
vector<string> svec2("hi");     // 错误，不能使用字符串字面值初始化vector对象
vector<string> svec3{10};       // 10个默认初始化的元素
vector<string> svec4{10,"hi"};  // 10个元素，每个都为"hi"

```

### vector相关的操作

- **vector对象是能够高效增长的，因而在初始化时设定其大小是没有什么必要的，这点与java是不同的**

#### vector遍历

- 使用泛型for语句

```c++
vector<int> ivec = {1, 2, 3};

for (auto i : ivec) {
    i *= i;
}
// {1, 2, 3}

for (auto &i : ivec) {
    i *= i;
}
// 引用类型，v变为{1,4,9}
```

- **范围for语句体内不应当改变其所遍历序列的大小**

#### 下标操作符

- size()返回的类型是size_type
- **使用size_type类型时，必须用具体的类，而不能是模板**

```c++
vector<int> ::size_type // 正确
vector::size_type       // 错误
```

- **不能用下标形式添加元素，使用下标必须vector存在对应的元素**

```c++
vector<int> ivec;
for (decltype(ivec.size()) i = 0; i != 10; ++i) {
    ivec[i] = i;  // 错误，因为ivec不包含任何元素，所以不能使用下标运算符
}
```

## 迭代器

### 尾后迭代器

- 尾后迭代器：**指向容器尾元素的下一个位置，指向的实际是容器的一个本不存在的尾后元素**，只起到一个标记作用

```java
vector<int> ivec = {1,5,6,4,400};
auto b = ivec.begin(), e = ivec.end();
```

- 如果容器为空，那么beging与end返回的是同一个迭代器，都是尾后迭代器

### iterator与const_iterator

- iterator的对象可读也可以写
- **const_iterator可以读但是不能够写**
- **如果容器对象或string对象是一个常量，那么只能使用const_iterator**
- 如果容器对象与string对象不是常量，那么既可以用iterator又可以用const_iterator
- **如果要返回const_iterator,那么可以使用cbegin与cend函数**

```c++
vector<int> a;
const vector<int> b;
auto it1 = a.begin();   // vector<int>::iterator
auto it2 = b.begin();   // vector<int>::const_iterator
auto it3 = a.cbeign();  // vector<int>::const_iterator

```

### 迭代器支持的操作

#### 迭代器都支持的操作

- *iter
- item->item
- ++iter
- --iter
- iter1 == iter2
- iter1 != iter2

#### vector与string迭代器支持的操作

- iter + n;
- iter - n;
- iter1 += n
- iter1 -= n 
- iter1 - iter2  **返回的是difference_type**
- >, >=, <=, <

- **因为不是所有的迭代器都支持大小比较，但是所有的迭代器都支持 == 与 != 操作，所以在for循环中用 !=而不是 <**

```c++
std::string a = "Hello world";
for(auto it = a.begin(); it != a.end() && !isspace(*it); ++it) {
    *it = toupper(*it);
}
```

#### 迭代器与泛型for语句

- 不能在泛型语句中向vector对象添加元素
- 任何一个可能改变vector对象容量的操作，比如push_back,都会使该vector对象的迭代器失效

## 数组

- 数组的维度必须是常量表达式，值不变，并且在编译期间就可以确定的值
- 如果在函数内部定义了某种内置内置的数组，那么默认初始化会使数组含有未定义的值
- **数组的元素应为对象，所以不存在引用的数组**
- **数组不允许拷贝赋值，java中是允许的**
- 数组的下标类型 size_t类型，定义在cstddef中

### 复杂数组声明

- 理解复杂数组的声明，最好的办法是从数组的名字开始，按照由内向外的顺序

```c++
int *ptrs[10];    //10个整型指针的数组
int (*Parray)[10] = &arr;  // Parray指向一个含有10个整数的数组
int (&arrRef)[10] = arr;   // arrRef引用一个含有10个整数的数组
```

### 数组与指针

- **在很多用到数组名字的地方，编译器都会自动地将其替换为一个指向数组首元素的指针**
- 使用数组类型，就是使用一个指向该数组首元素的指针

```c++
int ia[] = {0,1,2,3,4,5,6,7,8,9};

// auto获得的是int指针
auto ia2(ia);  // ia2是一个整型指针，指向ia的第一个元素

// decltype获得是10个int的数组
decltype(ia) ia3 = {0,1,2,3,4,5,6,7,8,9};   // ia3是一个含有10个整数的数组
```

### 标准库函数begin与end

- c++11针对数组引入了两个名为begin与end的函数

```c++
int ia[] = {0,1,2,3,4,5,6,7,8,9};
int *begin = begin(ia);
int *last = end(ia);
while(begin != end) {
    cout << *begin << endl;
    begin++;
}
```

### 指针与下标

- 两个指针相减的结果是一种名为ptrdiff_t的标准库类型

```c++
int ia[] = {0,1,2,3,4,5,6,7,8,9};

int i = ia[2];    //2
int *p = ia;
i = *(p + 2);     // 等价于 i = ia[2];

int *q = &ia[2];  // 指向索引为2的元素
int k = p[1];     // p[1]等价于*(p+1),就是ia[3]表示的那个元素
int h = p[-2];    // p[-2] 等价于*(p-2)，就是ia[0]表示的元素
```

### c风格字符串

- **字符数组的结尾处有一个空字符，'\0'**

```c++
char a1[] = {'a', 'b', 'c'};        // 列表初始化，3个，不含'\0'
char a2[] = {'a', 'b', 'c', '\0'};  // 列表初始化，含有显示的空字符
char a3[] = "abc";                  // 自动添加表示字符串结束的空字符
const char a4[6] = "Daniel";        // 错误，没有空间可存放空字符
```

- **c标准库cstring函数操作对象必须是c风格字符串，也就是必须是以空字符作为结束的数组,不能用于std::string对象,也不能用于结尾不是空字符的字符数组**

```c++
strlen(p)      // 返回长度，不包含空字符
strcmp(p1, p2) // 比较，大于正，小于负，等于0
strcat(p1, p2) // 将p2附加到p1之后，返回p1
strcpy(p1, p2) // 将p2拷贝给p1，返回p1

char ca[] = {'C','+', '+'};
cout << strlen(ca) << endl;    // 严重错误，ca没有以空字符结束，不能使用cstring中的方法
```

- 任何出现字符串字面值的地方都可以用以空字符结束的字符数组来替代
- 允许使用以空字符结束的字符数组来初始化string或为string赋值
- string对象的加法运算中允许使用以空字符结束的字符数组作为其中一个运算对象，不能两个都是
- **如果要使用c风格字符串，无法直接用string对象来替代，必须用其c_str()函数**

```c++

string s = "Hello world";
char * str = s;               // 不能用string对象初始化char*
const char* str = s.c_str();  // 正确
```

- **如果执行完c_str()函数后程序想一直都能使用其返回的数组，最好将该数组重新拷贝一份**