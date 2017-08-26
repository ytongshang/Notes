# String Vector and Array

## namespace

- 使用命名空间

```c++
using namespace std;
using std::cout;
using std::endl;
```

- **头文件中不应当包含using声明**，因为头文件会被拷贝到所有引用它的文件中去，如果头文件有某个using声明，那么每个使用了该头文件的文件都会有这个声明，对于某些程序来说，
 由于不经意间包含了一些名字，反而可能产生始料未及的名字冲突。
 
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


### 泛型for语句

- **如果想要改变string对象中的字符，那么泛型for语句中必须定义为引用类型**

```c++
string a = "Hello Wrold";
for (auto &c : a ) {
    c = toupper(c);
}
cout << a << endl;   // HELLO WORLD
```





































