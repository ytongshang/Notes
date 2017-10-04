# 并发实践

* [同步访问共享的可变数据](#同步访问共享的可变数据)
* [避免过度同步](#避免过度同步)
  * [不要调用外来的方法](#不要调用外来的方法)
  * [限制同步区域的工作量](#限制同步区域的工作量)
  * [其它](#其它)
* [Executor和Task优于线程](#executor和task优于线程)
* [并发工具优于wait与notify](#并发工具优于wait与notify)
  * [并发集合](#并发集合)
  * [notify 与 wait](#notify-与-wait)
* [线程安全性的文档化](#线程安全性的文档化)
  * [线程安全分类](#线程安全分类)
* [慎用延迟初始化](#慎用延迟初始化)
  * [double-check](#double-check)
  * [static holder 模式](#static-holder-模式)
  * [single-check](#single-check)
* [不要依赖于线程调度器](#不要依赖于线程调度器)
* [避免使用线程组](#避免使用线程组)

## 同步访问共享的可变数据

* 同步synchronized保证了互斥性和可见性
* 对于多线程的代码，最好的情况是要么共享不可变的数据，要么不共享可变的数据
* **当多个线程共享可变数据的时候，每个读或写数据的操作都必须执行同步**
* **如果只需要线程之间交互通信，不需要互斥，volatile修饰符就是一种可以接受的同步形式**

## 避免过度同步

### 不要调用外来的方法

* **在一个被同步的区域内部，不要调用被设计成可以被覆盖的方法\(也就是不要调用非final方法\)，**
  **也不要调用由客户端以函数对象的形式提供的方法**
* 可以被Override的方法或者以函数对象提供的方法，会导致同步出错或者死锁

### 限制同步区域的工作量

* 在同步区域之外的调用被称为开放调用，**开放调用除了避免死锁之外，还可以极大的增加并发性**，
  外来方法的调用可以时间任意长，如果在同步区域内调用外来方法，其它线程对受保护资源的访问可能就会被拒绝
* **通常应当在同步区域内做尽可能少的事情**，获得锁，检查共享数据，转换数据，释放锁

### 其它

* 如果一个可变的类要并发使用，**一方面可以使这个类变成线程安全的**，通过在内部同步，可以获得明显比外部锁定  
  整个对象更高的并发性，**另一方面不做任何同步，并且在文档中说明类不是线程安全的**，其同步性由调用者维护

* **如果方法修改了静态的域，必须同步对这个域的域问**，即使它往往只用于单个线程的访问，因为客户在这种方法上执行外部同步是不可能的  
  因为不可能保证其他不相关的客户也会执行外部同步

* 对于list的由多个线程访问，一方面可以做一个快照，另一方面可以使用并发集合CopyAndWriteArrayList

```java
// 使用快照的方法
private final List<SetObserver<E>> observers = new ArrayList<>();

private void notifyElementAdded(E element) {
    List<SetObserver<E>> snapshot = null;
    synchronized(observers) {
        snapshot = new ArrayListM<>(observers);
    }
    for (SetObserver<E> observer : smapshot) {
        observer.added(this, element);
    }
}

// 使用并发集使 copyandwritearraylist
private final List<SetObserver<E>> observers = new CopyAndWriteArrayList<>();
```

## Executor和Task优于线程

* Executor将工作单元与任务的执行分离开来
* 对于小负载使用newCachedThreadPool\(\)
* 而于大负载，由于线程资源是有限的，可以使用newFixedThreadPool,或者直接使用ThreadPoolExecutor
* 对于java.util.Timer,由于所有任务都是由同一个线程来调度，因此所有任务都是串行执行的，同一时间只能有一个任务在执行，
  前一个任务的延迟或异常都将会影响到之后的任务,并且一个任务抛出异常，后继的不会继续执行，所以如果有多个任务可能并行执行，使用SchedulecThreadPoolExecutor

## 并发工具优于wait与notify

* 使用java.util.concurrent包主要包括的Executor Framewor,并发集合和同步器
* **对于并发的Map,应当使用ConcurrentHashMap**而不是Collections.synchronizedMap\(\)或者HashTable\(\);
* 应当使用并发集合，而不是外部同步集合

### 并发集合

* 参见《Java Concurrency in Practice》

### notify 与 wait

* **始终应该使用wait循环模式来调用wait方法，永远不要在循环之外调用wait方法**

```java
// wait 的标准使用方法
synchronized(obj) {
    while (condition does not hole) {
        obj.wait();
    }

    // perform action for appropriate contion
}
```

* 对于notify和notifyAll,合理而而保守的方法是总是调用notifyAll,这样可以避免不相
  关线程意外或者恶意的等待。

## 线程安全性的文档化

### 线程安全分类

* **不可变的类（immutable）**：**实例不变，不需要外部同步**，比如String
* **无条件的线程安全\(unconditionally thread-safe\)**:内部有足够的同步，它的实例可以被并发的访问，比如ConcurrentHashMap
* **有条件的线程安全\(Conditionally thread-safe\)**：除了有些方要需要外部同步，其它与无条件线程安全类一样，**比如Collections.synchronized包装返回的集合，它们的迭代器要求外部同步**
* **非线程安全（not thread-safe）**:实例可变，调用时必须用自己选择的外部同步包围每个方法调用，比如ArrayList和HashMap
* **线程对立（thread-hostile）**：很少，也不应当有这样的类，一般原因是没有同步修改静态数据

## 慎用延迟初始化

* 大多数的域应当正常初始化，而不是延迟初始化
* 为了性能目地，或者为了破坏有害的初始化循环，必须要延迟初始化的话，可以使用对应的延迟初始化方法
* **对于实例域应当使用double-check**
* **对于静态域使用内部static holder的方式**
* **对于可以反复初始化的域，使用single-check**

### double-check

* **变量应当被声明为volatile的**
* 局部变量result在《Effective Java》中据说可以提高性能，没有测试过

```java
private volatile FieldType field;

FieldType getField() {
    FieldType result = field;
    if (result == null) {
        synchronized(this) {
            result = filed;
            if (result == null) {
                result = filed = computeFieldValue();
            }
        }
    }
    return result;
}
```

### static holder 模式

* 一般应用于static 成员变量

```java
private static class FieldHolder {
    static final FieldType field = computeField();
}

static FieldType getField() {
    return FieldHolder.field;
}
```

### single-check

* **变量应当被声明为volatile的**

```java
private volatile FieldType field;

public FieldType getField() {
    FieldType result = field;
    if (result == null) {
        result  = field = computeField();
    }
    return result;
}
```

## 不要依赖于线程调度器

* **任何依赖于线程调度器来达到性能要求或者正确性的代码，都是不可移值的**

* **如果线程没有在做有意义的工作，就不应当运行**，可以通过适当的设置Executor的线程的数目，保持任务合适的大小，  
  任务也不应当太小，否则分配任务也会浪费时间

* **线程不应当处于忙等待**

```java
public class SlowCountDownLatch {
    private int count;
    public SlowCountDownLatch(int count) {
        if (count < 0) {
            throw new IllegalArgumentException();
        }
        this.count = count;
    }

    public void await() {
        while (true) {
            synchronized(this) {
                if (count == 0) {
                    return;
                }
            }
        }
    }

    public synchronized void countDown() {
        if (count != 0) {
            count --;
        }
    }
}
```

* 如果一个程序不能工作，是因为某些线程无法像其它线程那样获得足够的时间，**那么不要企图调用Thread.yield\(\)来修正该程序列。**，
* **Thread.yield\(\)的唯一作用是在测试期间增加程序列的并发性**
* **不要试图操作线程的优先级，线程的优先级是java平台最不可移值的特性。**

## 避免使用线程组

* 线程组没有提供太多实用的功能，而且它们的很多功能还是有缺陷的，因此没有任何必要使用线程组。



