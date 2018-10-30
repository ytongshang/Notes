# Functions

## 生命周期与作用域

- 名字的作用域是程序文本的一部分，名字在其中可见
- 对象的生命周期是程序执行过程中该对象存在的一段时间
- 局部变量，自动变量，static局部变量

## 基础

- **函数的名字也必须在使用之前声明**
- 变量/函数声明一般在头文件中

```c++
void print(vector<int>::const_iterator beg, vector<int>::const_iterator end);
```

## 函数的返回值类型

- 函数的返回类型可以是内置类型（如 int 或者 double）、类类型或复合类型（如 int& 或 string*），还可以是void类型
- **函数不能返回另一个函数或者内置数组类型，但可以返回指向函数的指针，或指向数组元素的指针**

```c++
// ok: pointer to first element of the array 
// 这个函数返回一个 int 型指针，该指针可以指向数组中的一个元素。
int *foo_bar() { /* ... */ }
```

## 函数参数传递

- 形参与实参
- 参数传递只有值传递与引用传递，其中指针的传递也是值传递

### 值传递

- 非引用类型的参数通过复制对应的实参实现初始化。当用实参初始化形参时，函数并没有访问调用所传递的实参本身，因此不会修改实参的值。
- 非引用形参表示对应实参的局部副本。对这类形参的修改仅仅改变了局部副本的值。一旦函数执行结束，这些局部变量的值也就没有了。

### 指针形参

- 函数的形参可以是指针，此时将复制实参指针。与其他非引用类型的形参一样，该类形参的任何改变也仅作用于局部副本。
- **如果函数将新指针赋给形参，主调函数使用的实参指针的值没有改变。因为指针存储着对象的地址，因而可以通过解引用改变所指对象的值，当然底层const除外。**

```c++
void reset(int *ip) {
    *ip = 0;     // changes the value of the object to which ip points 
    ip = 0;      // changes only the local value of ip; the argument is unchanged 
}
```

- **如果保护指针指向的值，则形参需定义为指向const对象的指针**，底层const：

```c++
void use_ptr(const int *p) {
    // use_ptr may read but not write to *p
}
```

### 引用传递

- 在C++中，使用引用形参较指针形参更安全和更自然，**对于较大的类对象、容器类型、不支持拷贝操作的类型，采用引用形参**
- **引用形参的另一种用法是向主调函数返回额外的结果，方法是向函数额外传递一个引用参数**

```c++
// returns an iterator that refers to the first occurrence of value
// the reference parameter occurs contains a second return value
vector<int>::const_iterator find_val(
    vector<int>::const_iterator beg,             // first element
    vector<int>::const_iterator end,             // one past last element
    int value,                                    // the value we want
    vector<int>::size_type &occurs)              // number of times it occurs
{
             // res_iter will hold first occurrence, if any
             vector<int>::const_iterator res_iter = end;
             occurs = 0; // set occurrence count parameter
             for ( ; beg != end; ++beg)
                     if (*beg == value) {
                     // remember first occurrence of value
                     if (res_iter == end)
                        res_iter = beg;
                     ++occurs; // increment occurrence count
                 }
             return res_iter;  // count returned implicitly in occurs
         }
```

## const形参

### 顶层const形参

- **会忽略掉顶层const,用实参初始化时传递常量对象、非常量对象都可以**
- 在调用函数时，如果**该函数使用非引用非指针的非const形参，则既可给该函数传递 const 实参也可传递非 const 的实参**。
- **如果是顶层const，则在函数中，不可以改变实参的局部副本。由于实参仍然是以副本的形式传递，因此传递给fcn的既可以是 const 对象也可以是非 const 对象。**

```c++
// 因而以下函数会出现重复定义的错误：

void fcn(const int i) { /* fcn can read but not write to i */ }
void fcn(int i) { /* ... */ }            // error: redefines fcn(int)
```

​- **如果使用引用形参的唯一目的是避免复制实参**，也就是说不需要修改实参的值，仅仅是对于较大对象希望用引用提高效率什么的，**则应将形参定义为const引用，这样既可以避免复制，又可以避免修改相应的值**。

### 底层const

- 实际上是用实参初始化形参
- **形参为底层const引用或指针，则可用const对象、非const对象初始化都可以**
- **如果形参为非const引用或指针，只能用非const对象初始化**
- **如果函数具有普通的非const引用形参**，则显然不能通过 const 对象进行调用。但比较容易忽略的是，**调用这样的函数时，传递一个右值或具有需要转换的类型的对象同样是不允许的,实际上也就是用实参初始化非const引用，只能使用对应类型的非const左值**
- 应该将不需要修改的引用形参定义为const引用。普通的非const引用形参在使用时不太灵活。这样的形参既不能用const对象初始化，也不能用字面值或产生右值的表达式实参初始化。

```c++
// function takes a non-const reference parameter
     int incr(int &val)
     {
         return ++val;
     }
     int main()
     {
         short v1 = 0;
         const int v2 = 42;
         int v3 = incr(v1);   // error: v1 is not an int
         v3 = incr(v2);       // error: v2 is const
         v3 = incr(0);        // error: literals are not lvalues
         v3 = incr(v1 + v2);  // error: addition doesn't yield an lvalue
         int v4 = incr(v3);   // ok: v3 is a non const object type int
     }
```

## 数组形参

- 由于数组不允许拷贝，使用数组时会将其转化为指针，无法以值传递的方式使用数组参数，**传递数组指针实际传递的是指向数组首元素的指针**

```c++
//常见的数组形参调用
void print(const  int *,size_t size);         //传递大小防止越界
void print(const int [ ]);
void print(const int [10]);                   //期望传递的数组的大小，但实际上不一定
void print(const int *beg, const int *end);   //类似stl传递
```

- c++允许将变量定义为数组的引用，同理形参也可以是数组的引用

```c++
//传递大小为10的数组的引用，其中（&arr）括号不可缺，调用函数时，大小必须为10的int数组，不如指针的方便
//用实参初始化时，必须用大小为10的int数组初始化
void print (int (&arr)[10]);

// 传递多维数组时，第二维以及其后的数组维数不能省略
// matrix指向数组的首元素，该数组的元素是由10个整数构成的数组
void print(int (*matrix)[10],int rowSize)

//等价于
void print(int matrix[][10],int rowSize)
int main(int argc,char* argv[]){...}
int main(int argc,char **argv) {...}
```

## vector等容器的形参

- 一般不传递整个容器，事实上，C++ 程序员倾向于通过传递指向容器中需要处理的元素的迭代器来传递容器：

```c++
// pass iterators to the first and one past the last element to print
void print(vector<int>::const_iterator beg, vector<int>::const_iterator end)
     {
         while (beg != end) {
             cout << *beg++;
             if (beg != end) cout << " "; // no space after last element
         }
         cout << endl;
     }
```

## 含有可变形参的函数

### initializer_list

- 对于函数实参全部类型相同，但是实参数量未知，可以使用initializer_list类型的形参，用于表示某种特定类型的值的数组，有点类似于vector,区别在于不能修改其中元素的值

```c++
initializer_list<T> lst;
initializer_list<T> lst{a,b,c,...};
lst2(lst1);
lst2 = lst1;
lst1.begin();
lst1.end();
```

- **向initializer_list中传递一个值的序列，必须把序列放在一对花括号中**
- 含有initializer_list参数的函数还可以有其它的参数
- 由于initializer_list中元素值不可修改，一般用范围for语句，并将变量定义为const auto elem来操作其中的元素

```c++
void error_msg(initializer_list<string> ist)
{
    for(auto beg = ist.begin();beg != ist.end();++beg)
        cout<<*beg<<" ";
    cout<<endl;
}
​
void error_msg(ErrCode e,initializer_list<string> ist)
{
    cout<<e.msg<<":";
    for(const auto &elem:ist)
        cout<<elem<<" ";
    cout<<endl;
}
```

### 省略符形参

- 省略符只能放在形参列表的最后一个位置
- 省略符对应的形参不做类型检查

```c++
void foo(parm_list,...);
void foo(...);
```

### 可变参数模板

- 对于实参型不同，数量不定的情况，使用可变参数模板

## return语句

```c++
//return 语句有两种形式：
​
return ;
return expression;
```

- 返回类型为 void 的函数通常不能使用第二种形式的 return 语句，但是，当expression是另一个返回类型也为void的函数的时候，是可以的
- 在含有return语句的循环后面也应该有一条return语句，没有的话是错误的，也会经常忽略掉。
- **不要返回局部变量的引用与指针，函数调用结束， 局部变量被销毁，要返回在一个局部区域定义的变量，则应当将对象new出来，参考cocos2d-x**
- 返回类型决定函数调用是否为左值，如果为左值，则可以对左值赋值

```c++
char & get_char(string &str,string::size_type index)
{
    return str[index];
}
//则可以：
string s("a value");
get_char(s ,0) = 'A' ;
```

### 列表初始化返回值

- 列表初始化返回值,其实就是将返回值的定义初始化过程省略，直接调用列表初始化的形式

```c++
vector<string> process()
{
    //...
    if(expected.empty())
        return {};
    else
        return {"a","b"};
}
```

### 返回数组的指针

```c++
// 返回数组指针，有三种方法：
// Type (*functionName(parameter_list))[dimension]
int (*func(int i))[10] ;   //返回一个大小为10的int数组

// c++ 11特性
auto func(int i)  ->int (*) [10];

//由于decltype返回的是数组的类型，转化为指针时，则应当在前面加个*，
// 并且这里返回的类型里包括了数组的维数，必须是大小为5的int数组
int odd[]={1,3,5,7,9};
decltype (odd)  *arrPtr( int i) ;
```

## 函数重载

- **仅顶层const无法构成重载,仅返回类型不同也无法构成重载**

```c++
// 下面三个无法构成重载
Record lookup(Phone);
Record lookup(const Phone);
Record * lookup(Phone)
```

- **底层const可以形成重载**

```c++
Record lookup(Phone &);
Record lookup(const Phone&);
Record lookup(Phone *);
Record lookup(const Phone*);
```

### 重载与作用域，

- 局部变量会隐藏掉全局的变量
- 哪怕一个为函数，一个为一种数据类型，只要同名就会隐藏掉， **在 C++ 中，名字查找发生在类型检查之前**

## 默认实参

- **一旦某个形参被赋予了默认值，它后面的所有形参都必须有默认值**
- **默认参数在头文件中声明，在源文件中要定义没有默认参数时的函数体**

```c++
std::string screen(sz width = 24, sz height = 80) {
    std::string desc;
    desc += "width:" + std::to_string(width);
    desc += ",height:" + std::to_string(height);
    return desc;
}

int main() {
    cout << screen() << endl;
    cout << screen(100) << endl;
    cout << screen(100, 200) << endl;
    return 0;
}
```

## inline函数与constexpr函数

- inline函数在头文件中定义
- constexpr函数，是指能用于常量表达式的函数，函数的返回类型和形参类型都是字面值类型（算术类型、引用、指针，不包括类类型），函数体中有且仅有一条return语句，constexpr函数被隐式的指定为内联函数
- constexpr函数内部可以包含其它语句，只要这些语句在运行时不执行任何操作就行，例如其中可以有空语句，类型别名，以及using声明
- constexpr函数不一定返回常量表达式

```c++
constexpr int new_size() {return 42;}
constexpr size_t scale(size_t factor) {return new_size()*factor;}
int i =2;
int a[scale(2)]; //可以，是常量表达式
int a2[scale(i)] ; //错误，编译期间不能得到数组大小的值，错误

```

## 函数匹配

- 候选函数，同名且可见
- 可行函数，形参数量相同，每个实参与形参类型相同，或可转化为形参类型
- 最佳匹配，实参类型与形参类型越接近，匹配越好

## 函数指针

- 定义函数指针，返回类型 (*指针变量名)(参数表)，只表示返回类型为这个，参数列表为这些的这样的一类函数，但没有初始化，
- 初始化时，直接用函数指针=函数名，或函数指针=&函数名。
- 指向不同类型的函数指针不存在转化规则，除了nullptr,0，null. 函数指针的匹配要精确匹配

```c++
bool lengthCompare(const string&, const string&);
bool (*funcPtr)(const string &,const string&);
funcPtr = lengthCompare;
funcPtr = &lengthCompare;
```

- 函数指针形参。**函数的形参不能声明函数类型，但可以声明为函数指针类型**

```c++
//自动转化为函数指针,如cocos2dx 中的回调函数
void useBigger(const string &s1, const string &s2, bool f(const string &,const string &));
void useBigger(const string &s1, const string &s2, bool(*f)(const string &,const string &));

//typedef 或者using 声明
typedef  bool (*Func) (const string &, const string &) ;
using   Func = bool (*) (const string &,const strng &);
```

### 返回指向函数的指针

- 使用typedef或者using

```c++
using funcPtr  = int (*) (int ,int );
funcPtr f1(int ) ;
```

- 与数组类似，使用auto与decltype

```c++
auto fi(int ) ->int (*)(int ,int );

//decltype返回的是函数类型，如果要用函数指针，则要加上*
int f(int ,int ) ;
decltype(f)  *f1(int ) ;
```