# 并发实践

## 同步访问共享的可变数据

- 同步synchronized保证了互斥性和可见性
- 对于多线程的代码，最好的情况是要么共享不可变的数据，要么不共享可变的数据
- **当多个线程共享可变数据的时候，每个读或写数据的操作都必须执行同步**
- **如果只需要线程之间交互通信，不需要互斥，volatile修饰符就是一种可以接受的同步形式**

## 避免过度同步

### 不要调用外来的方法

- **在一个被同步的区域内部，不要调用被设计成可以被覆盖的方法(也就是不要调用非final方法)，**
 **也不要调用由客户端以函数对象的形式提供的方法**
- 可以被Override的方法或者以函数对象提供的方法，会导致同步出错或者死锁

### 限制同步区域的工作量

- 在同步区域之外的调用被称为开放调用，**开放调用除了避免死锁之外，还可以极大的增加并发性**，
 外来方法的调用可以时间任意长，如果在同步区域内调用外来方法，其它线程对受保护资源的访问可能就会被拒绝
- **通常应当在同步区域内做尽可能少的事情**，获得锁，检查共享数据，转换数据，释放锁

### 其它

- 如果一个可变的类要并发使用，**一方面可以使这个类变成线程安全的**，通过在内部同步，可以获得明显比外部锁定
 整个对象更高的并发性，**另一方面不做任何同步，并且在文档中说明类不是线程安全的**，其同步性由调用者维护

- **如果方法修改了静态的域，必须同步对这个域的域问**，即使它往往只用于单个线程的访问，因为客户在这种方法上执行外部同步是不可能的
 因为不可能保证其他不相关的客户也会执行外部同步

- 对于list的由多个线程访问，一方面可以做一个快照，另一方面可以使用并发集合CopyAndWriteArrayList

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

## 并发工具优于wait与notify

- 使用java.util.concurrent中的Executor Framewor,并发集合和同步器


## 线程安全性的文档化

## 慎用延迟初始化

## 不要依赖于线程调度器

## 避免使用线程组

