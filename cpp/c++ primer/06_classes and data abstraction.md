# Classes and data abstraction

## const成员函数

- 在成员函数括号后面加上const,实际上是将this指针由Type * const 转化为了const Type * const,这样用该函数就不能改变对象的值。
- **const成员函数的声明和定义都要加上const**
- **常量对象，常量对象的指针与引用都只能调用常量成员函数**，其原因是调用成员函数，实际上隐式地用this指针去初始化成员函数的隐藏形参this，如果对象是常量对象，则this的类型为const Type *const类型，而一般的成员函数的隐形形参this是Type *const类的指针，因为不能用const Type *const初始化 Type *const,所以一般成员函数不能作用于const 对象，从而const对象也就只能调用const成员函数。
- 一个const成员函数如果以引用的形式返回*this,那么它的返回类型是常量引用
- 不能从 const 成员函数返回指向类对象的普通引用。const 成员函数只能返回 *this 作为一个 const 引用。

## 定义类相关的非成员函数

- 这些函数的声明应当与类的定义在同一个头文件中，常见的比如重载+ 、-、<<、>>的操作符，还有就是相关的一些友员函数

## 构造函数

- **构造函数不能声明为const类型**，构造函数完成初始化过程后，定义的const对象才获得常量属性
- 没有任何参数的构造函数为默认构造函数
- 如果没有任何构造函数，则编译器会创建合成的默认构造函数，**如果存在类内初始值，用它初始化，如果没有，执行默认初始化内置类型未定义，类类型调用默认构造函数，而没有默认构造函数的类类型则不能初始化，因而这些情况下最好手动创建默认构造函数**。编译器不一定会正确创建默认构造函数，比如类有了其它的非0个参数的构造函数有其它构造函数时，不会创建默认构造函数。
- c++ 11合成默认构造函数， sales_data() =default;=default既可以和声明一起出现在类的内部，也可以作为定义出现在类的外部
- **类数据成员的初始化应当采用构造函数初始值列表这种方法，而且最好不要覆盖类内初始值**,也就是在定义类时，数据成员的初始值。最好令构造函数初始值的顺序与成员声明的顺序一致，尽量避免用某些成员初始化其它的成员，因为有可能出现初始化顺序的错误。
- **当开始执行构造函数的函数体的时候，类成员的初始化其实已经完成了，在构造函数的函数体内对类成员执行“=”操作是赋值，而不是初始化**，所以当类的成员是顶层const，或者引用的时候，必须在初始化列表中对类成员初始化

```c++
class ConstRef
{
public:
    ConstRef(int ii);
private:
    int i;
    const int ci;
    int &ri;
}
ConstRef::ConstRef(int ii)
{
    i =ii;      //正确
    ci =ii;     //错误，顶层const不能赋值
    ri = i;     //错误,ri没被初始化
}
ConstRef::ConstRef(int ii):i(ii),ci(ii),ri(i) {}
```

- **委托构造函数**，实际上就是某个构造函数调用另外的构造函数，与初始化列表的格式相同

```c++
sales_data(std::string s, unsigned cnt,double price) :
                 bookNo(s),units_sold(cnt),revenue(cnt*price) {}
sales_data():sales_data("",0,0) {}
sales_data(std::istream &is) :sales_data()
{
        read(is, *this)
}
```

- 隐式的类类型转换，**当构造函数只接受一个实参时，它实际上定义了形参类型转换为类类型的隐式转化机制，这种构造函数也称转换构造函数**
- **隐式的类类型转换，只允许一步类型转换**

```c++
class Sales_data
{
public:
    Sales_data(const string &s) :bookNo(s) {}
private:
    string bookNo;
}

//错误，不能进行两步隐式类型转换
Sales_data a = "9999999999"  ;
//正确，隐式类型转换
Sales_data b = std::string("9999999999");
```

- **想要抑制构造函数定义的隐式转换，将构造函数声明为explicit**
- **explicit关键字只需要在类构造函数声明时使用，在类外定义是不能再加上explicit关键字，explicit构造函数只能用于直接初始化，不存在隐式类型转化**

```c++
class sales_data
{
    sales_data() =default;
    explicit sales_data(std::string &s):bookNo(s) {}
}
sales_data a = std::string("Hello world"); //错误，声明为explicit
salse_data b =sales_data( std::string("Hello world")); //正确，显示调用该函数
```

## 友元

- **友元机制允许一个类将对其非公有成员的访问权授予指定的函数或类**。
- 友元声明可以出现在类定义的任何地方,**友元不是授予友元关系的那个类的成员，所以它们不受声明出现部分的访问控制影响。** 通常，将友元声明成组地放在类定义的开始或结尾是个好主意。
- **友元可以是普通的非成员函数，或前面定义的其他类的成员函数，或整个类。将一个类设为友元，友元类的所有成员函数都可以访问授予友元关系的那个类的非公有成员。**
- 每个类控制自己的友元类和友元函数，**友元不存在继承与传递**
- 如果想让一组重载函数都成为一个类的友元，则要对于每一个函数都单独声明友元

```c++
     class Screen {
         // Window_Mgrmust be defined before class Screen
         friend Window_Mgr&
             Window_Mgr::relocate(Window_Mgr::index,
                                  Window_Mgr::index,
                                  Screen&);
         // ...restofthe Screen class
     };
```

- 在一个类里声明友关系，仅仅指明了访问的权限，友元函数或者友元类并没有在这里声明，哪怕在类的类内部定义了友元函数的函数体，在类外该函数仍然是未声明的，要手动声明，**所以在类中声明友元关系之外还要专门对函数或者类进行声明，不过通常将友元的声明和类本身放在一个头文件中**

```c++
struct X
{
    friend void f  {...}
    X()  {f();}               //错误，f未声明
    void g();
    void h();
} ;
 void X::g()   {return f();}  //错误，f未声明
 void f();
 void X::h()  {return f();}   //正确，f声明在作用域了
```

## 类的返回类型与作用域

- 与形参类型相比，返回类型出现在成员名字前面。**如果返回类型使用由类定义的类型，则必须使用完全限定名**

```c++
    class Screen {
     public:
         typedef std::string::size_type index;
         index get_cursor() const;
     };

     // index必须要用全限定名称
     inline Screen::index Screen::get_cursor() const
     {
         return cursor;
     }
```

### 名字查找与类的作用域

- **编译器处理完类中的全部声明后才会处理成员函数的定义**
- 名字查找首先会在类定义的范围内查找，其次才会查找外层作用域查找

```c++
typedef double Money;

class Account {
public:
    // 首先会在Account类作域查找，没找到会在外层作用域查找
    explicit Account(Money money);
public:
    Money balance() {
        return bal;
    }
private:
    Money bal;
};
```

## 聚合类与字面值常量类

- 聚合类
    - 所有成员public;
    - 没有定义任何构造函数;
    - 没有类内初始值;
    - 没有基类
    - 没有virtual函数
- 字面值常量类

## 类的成员

- **inline函数应该与类定义在同一个文件中，但可在在类的内部，也可以定义在类的外部**
- **可变数据成员，对数据成员加上mutable关键字，即使在const成员函数中也可以修改其值**

```c++
class Screen
{
public:
    void some_member() const;
private:
    mutable size_t access_ctr;
}
void Screen::some_member() const
{
    ++access_ctr;
}
```

- C++11新标准，可以给类的成员赋予类内初始值，**但是类内初始值必须使用=或者大括号，不能显示调用构造函数**
- 一旦一个类声明而没有定义时，该类是一个不完全类型，可以定义指向这种类型的指针与引用，也可以声明（但不能定义）以不完全类型作为参数或都返回类型的函数,因而一个类可以有自身类型的引用或指针，但是不能有自身类型的对象成员

## static成员

- 静态数据成员与类关联在一起，类型可以是常量、指针、引用、类类型
- **static 成员的关键字static在类中声明时要有，而在类外定义静态成员时不应当有static关键字**
- **非constexpr类型的static 数据成员必须在类定义体的外部定义**，constexpr类型的static成员可以类定义中初始化，const static 数据成员仍必须在类的定义体之外进行定义

```c++
class Account {
private:
    static const int number;
    // 如果要在类中初始化，必须用constexpr修饰
    static constexpr double rate = 0.03;
public:
    explicit Account(Money money);
public:
    Money balance() {
        return bal;
    }
private:
    Money bal;
};

const int Account:: number = 1;
```

- 普通成员都是给定类的每个对象的组成部分。static 成员独立于任何对象而存在，不是类类型对象的组成部分。所以静态数据成员的类型可以是它所属类的类类型，非静态数据成员只能声明为它所属类的指针或引用

```c++
class Bar {
     public:
         // ...
     private:
         static Bar mem1; // ok
         Bar *mem2;       // ok
         Bar mem3;        // error
     };
```

- **static成员函数不与任何对象绑定在一起，不包含this指针，所以 static 成员函数不能被声明为 const**。毕竟，将成员函数声明为 const 就是承诺不会修改该函数所属的对象。
- **static 成员函数也不能被声明为虚函数。**