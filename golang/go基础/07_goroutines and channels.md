# Goroutines and channels

- [Goroutines](#goroutines)
- [Channel](#channel)
- [不带缓存的Channel](#不带缓存的channel)
- [串联的Channels（Pipeline）](#串联的channelspipeline)
- [单方向的Channel](#单方向的channel)
- [带缓存的Channels](#带缓存的channels)
- [无缓冲的channel与有缓冲channel](#无缓冲的channel与有缓冲channel)
- [并发的循环](#并发的循环)
    - [易并行问题(embarrassingly parallel)](#易并行问题embarrassingly-parallel)
- [Select](#select)
- [channel使用](#channel使用)
    - [⽤简单⼯⼚模式打包并发任务和 channel](#⽤简单⼯⼚模式打包并发任务和-channel)
    - [⽤ channel 实现信号量 (semaphore)](#⽤-channel-实现信号量-semaphore)
    - [⽤ closed channel 发出退出通知](#⽤-closed-channel-发出退出通知)
    - [⽤ select 实现超时 (timeout)](#⽤-select-实现超时-timeout)

## Goroutines

- 默认情况下，**进程启动后仅允许⼀个系统线程服务于 goroutine。可使⽤环境变量或标准库函数 runtime.GOMAXPROCS 修改，让调度器⽤多个线程实现多核并⾏，⽽不仅仅是并发**
- **进程退出时，所有的goroutine都会被直接打断，程序退出**。
- **调⽤ runtime.Goexit 将⽴即终⽌当前 goroutine 执⾏,不会影响其它协程的执行**，调度器确保所有已注册 defer延迟调⽤被执⾏

```golang
func main() {
    wg := new(sync.WaitGroup)
    wg.Add(1)
    go func() {
        defer wg.Done()
        defer println("A.defer")
        func() {
            defer println("B.defer")
            runtime.Goexit() // 终⽌当前 goroutine
            println("B") // 不会执⾏
        }()
    println("A") // 不会执⾏
    }()
     wg.Wait()
}

// B.defer
// A.defer
```

- 和 yield 作⽤类似，Gosched 让出底层线程，将当前 goroutine 暂停，放回队列等待下次被调度执⾏

```golang
func main() {
    wg := new(sync.WaitGroup)
     wg.Add(2)
    go func() {
        defer wg.Done()
        for i := 0; i < 6; i++ {
            println(i)
            if i == 3 { runtime.Gosched() }
        }
    }()
 
    go func() {
        defer wg.Done()
        println("Hello, World!")
    }()
    wg.Wait()
}
```

- **除了从主函数退出或者直接终止程序之外，没有其它的编程方法能够让一个goroutine来打断另一个的执行**，但是可以通过goroutine之间的通信让一个goroutine请求其它的goroutine，并让被请求的goroutine自行结束执行

```golang
f()    // call f(); wait for it to return
go f() // create a new goroutine that calls f(); don't wait
```

## Channel

- **一个channel是一个通信机制**，它可以让一个goroutine通过它给另一个goroutine发送值信息。
- **channel对应一个make创建的底层数据结构的引用**。当我们复制一个channel或用于函数参数传递时，我们只是拷贝了一个channel引用
- **channel对象可以作为map的key**
- make函数创建的是一个无缓存的channel，但是**可以指定第二个整型参数，对应channel的容量。如果channel的容量大于零，那么该channel就是带缓存的channel。**

```golang
ch := make(chan int) // ch has type 'chan int'
ch = make(chan int)    // unbuffered channel
ch = make(chan int, 0) // unbuffered channel
ch = make(chan int, 3) // buffered channel with capacity 3
ch <- x  // a send statement
x = <-ch // a receive expression in an assignment statement
<-ch     // a receive statement; result is discarded
```

- Channel还支持close操作，用于关闭channel，**随后对基于该channel的任何发送操作都将导致panic异常。**
- **对一个已经被close过的channel进行接收操作依然可以接受到之前已经成功发送的数据；如果channel中已经没有数据的话将产生一个零值的数据。**

```golang
close(ch)
```

- **无论判断一个channel是否关闭，但是可以间接的用读操作的第二个返回值来判断**

```golang
ch := make(chan int)
//...

i,ok := <-ch
if !ok {
    //ch关闭了
}
```

- **range方法可以读取channel中的数据，直到channel关闭**

## 不带缓存的Channel

- **一个基于无缓存Channels的发送操作将导致发送者goroutine阻塞，直到另一个goroutine在相同的Channels上执行接收操作，当发送的值通过Channels成功传输之后，两个goroutine可以继续执行后面的语句。**如果接收操作先发生，那么接收者goroutine也将阻塞，直到有另一个goroutine在相同的Channels上执行发送操作。
- **基于无缓存Channels的发送和接收操作将导致两个goroutine做一次同步操作**
- **有时基于channels发送消息仅仅是用作两个goroutine之间的同步，这时候我们可以用struct{}空结构体作为channels元素的类型**，虽然也可以使用bool或int类型实现同样的功能，done <- 1语句也比done <- struct{}{}更短。

```golang
func main() {
    conn, err := net.Dial("tcp", "localhost:8000")
    if err != nil {
        log.Fatal(err)
    }
    done := make(chan struct{})
    go func() {
        io.Copy(os.Stdout, conn) // NOTE: ignoring errors
        log.Println("done")
        done <- struct{}{} // signal the main goroutine
    }()
    mustCopy(conn, os.Stdin)
    conn.Close()
    // 忽略传递的值，仅作为一个信号
    <-done // wait for background goroutine to finish
}
```

## 串联的Channels（Pipeline）

- Channels也可以用于将多个goroutine连接在一起，一个Channel的输出作为下一个Channel的输入。这种串联的Channels就是所谓的管道（pipeline）
- 像这样的串联Channels的管道（Pipelines）可以用在需要长时间运行的服务中，每个长时间运行的goroutine可能会包含一个死循环，
 在不同goroutine的死循环内部使用串联的Channels来通信

![pipeline](./../../image-resources/golang/pipeline.png)

```golang
func main() {
    naturals := make(chan int)
    squares := make(chan int)

    // Counter
    go func() {
        for x := 0; ; x++ {
            naturals <- x
        }
    }()

    // Squarer
    go func() {
        for {
            x := <-naturals
            squares <- x * x
        }
    }()

    // Printer (in main goroutine)
    for {
        fmt.Println(<-squares)
    }
}
```

- **如果发送者知道，没有更多的值需要发送到channel的话, 可以通过内置的close函数关闭channel来实现**，那样接收者可以停止不必要的接收等待。

```golang
close(naturals)
```

- 当一个channel被关闭后，再向该channel发送数据将导致panic异常。**当一个被关闭的channel中已经发送的数据都被成功接收后，后续的接收操作将不再阻塞，它们会立即返回一个零值**
 在上面的例子中，**如果仅仅关闭了naturals，打印的goroutine仍然可以源源不断的接受到0值序列，所以并不能终止打印序列**
- **没有办法直接测试一个channel是否被关闭**，但是接收操作有一个变体形式：它多接收一个结果，
 **第二个结果是一个布尔值ok，ture表示成功从channels接收到值，false表示channels已经被关闭并且里面没有值可接收**

```golang
// Squarer
go func() {
    for {
        x, ok := <-naturals
        if !ok {
            break // channel was closed and drained
        }
        squares <- x * x
    }
    close(squares)
}()
```

- Go语言的range循环可直接在channels上面迭代。**它依次从channel接收数据，当channel被关闭并且没有值可接收时跳出循环**

```golang
func main() {
    naturals := make(chan int)
    squares := make(chan int)

    // Counter
    go func() {
        for x := 0; x < 100; x++ {
            naturals <- x
        }
        close(naturals)
    }()

    // Squarer
    go func() {
        for x := range naturals {
            squares <- x * x
        }
        close(squares)
    }()

    // Printer (in main goroutine)
    for x := range squares {
        fmt.Println(x)
    }
}
```

- **其实并不需要关闭每一个channel。只有当需要告诉接收者goroutine，所有的数据已经全部发送时才需要关闭channel。**
 不管一个channel是否被关闭，当它没有被引用时将会被Go语言的垃圾自动回收器回收

## 单方向的Channel

- **当一个channel作为一个函数参数时，它一般总是被专门用于只发送或者只接收**

```golang
func counter(out chan int)

// 无法保证squarer函数只向一个in参数对应的channel发送数据或者从一个out参数对应的channel接收数据
func squarer(out, in chan int)
func printer(in chan int)
```

- Go语言的类型系统提供了单方向的channel类型，分别用于只发送或只接收的channel
- **类型chan<- int表示一个只发送int的channel，只能发送不能接收。**
- **类型<-chan int表示一个只接收int的channel，只能接收不能发送。箭头<-和关键字chan的相对位置表明了channel的方向。这种限制将在编译期检测**
- **任何双向channel向单向channel变量的赋值操作都将导致该隐式转换**。
- 这里并**没有反向转换的语法：也就是不能将一个类似chan<- int类型的单向型的channel转换为chan int类型的双向型的channel**

```golang
func counter(out chan<- int) {
    for x := 0; x < 100; x++ {
        out <- x
    }
    close(out)
}

func squarer(out chan<- int, in <-chan int) {
    for v := range in {
        out <- v * v
    }
    close(out)
}

func printer(in <-chan int) {
    for v := range in {
        fmt.Println(v)
    }
}

func main() {
    naturals := make(chan int)
    squares := make(chan int)
    go counter(naturals)
    go squarer(squares, naturals)
    printer(squares)
}
```

## 带缓存的Channels

- 带缓存的Channel内部持有一个元素队列。队列的最大容量是在调用make函数创建channel时通过第二个参数指定的
- **channel内部缓存的容量，可以用内置的cap函数获取**
- **对于内置的len函数，如果传入的是channel，那么将返回channel内部缓存队列中有效元素的个数**

```golang
ch = make(chan string, 3)
fmt.Println(cap(ch)) // "3"
```

- **向缓存Channel的发送操作就是向内部缓存队列的尾部插入元素，接收操作则是从队列的头部删除元素**。
- 如果内部缓存队列是满的，那么发送操作将阻塞直到因另一个goroutine执行接收操作而释放了新的队列空间。相反，如果channel是空的，接收操作将阻塞直到有另一个goroutine执行发送操作而向队列插入元素

```golang
ch <- "A"
ch <- "B"
ch <- "C"
fmt.Println(len(ch)) // "3"
fmt.Println(<-ch) // "A"
fmt.Println(<-ch) // "B"
fmt.Println(<-ch) // "C"
```

- 如果我们使用了无缓存的channel，那么下面两个慢的goroutines将会因为没有人接收而被永远卡住。这种情况，称为goroutines泄漏，这将是一个BUG。
 **和垃圾变量不同，泄漏的goroutines并不会被自动回收，因此确保每个不再需要的goroutine能正常退出是重要的。**

```golang
func mirroredQuery() string {
    responses := make(chan string, 3)
    go func() { responses <- request("asia.gopl.io") }()
    go func() { responses <- request("europe.gopl.io") }()
    go func() { responses <- request("americas.gopl.io") }()
    return <-responses // return the quickest response
}

func request(hostname string) (response string) { /* ... */ }
```

- 关于无缓存或带缓存channels之间的选择，或者是带缓存channels的容量大小的选择，都可能影响程序的正确性。
- **无缓存channel更强地保证了每个发送操作与相应的同步接收操作；**但是对于带缓存channel，这些操作是解耦的。
- 即使我们知道将要发送到一个channel的信息的数量上限，创建一个对应容量大小的带缓存channel也是不现实的，因为这要求在执行任何接收操作之前缓存所有已经发送的值。如果未能分配足够的缓冲将导致程序死锁。

## 无缓冲的channel与有缓冲channel

[对golang的Channel初始化的有缓存与无缓存解释](http://blog.csdn.net/paladinosment/article/details/42243303)

- golang channel 有缓冲 与 无缓冲 是有重要区别的,一个是同步的 一个是非同步的

```golang
c1:=make(chan int)         //无缓冲
c2:=make(chan int,1)       //有缓冲
c1<-1
```

- **无缓冲**:不仅仅是向 c1 通道放1，而是一直要等有别的协程 <-c1 接手了这个参数，那么c1<-1才会继续下去，要不然就一直阻塞着。
- **有缓冲**：c2<-1则不会阻塞，因为缓冲大小是1(其实是缓冲大小为0)，只有当放第二个值的时候，如果第一个还没被人拿走，这时候才会阻塞。

## 并发的循环

### 易并行问题(embarrassingly parallel)

- 易并行问题: 子问题都是完全彼此独立的问题

```golang
package thumbnail

// ImageFile reads an image from infile and writes
// a thumbnail-size version of it in the same directory.
// It returns the generated file name, e.g., "foo.thumb.jpg".
func ImageFile(infile string) (string, error)

func makeThumbnails(filenames []string) {
    for _, f := range filenames {
        if _, err := thumbnail.ImageFile(f); err != nil {
            log.Println(err)
        }
    }
}
```

```golang
// !!!!!!!!!!错误的写法
// makeThumbnails在它还没有完成工作之前就已经返回了。
// 它启动了所有的goroutine，每一个文件名对应一个，但没有等待它们一直到执行完毕
// 原因是main goroutine结束了，其它的goroutine也就结束了
func makeThumbnails2(filenames []string) {
    for _, f := range filenames {
        go thumbnail.ImageFile(f) // NOTE: ignoring errors
    }
}
```

- **没有什么直接的办法能够等待goroutine完成，但是我们可以改变goroutine里的代码让其能够将完成情况报告给外部的goroutine知晓，使用的方式是向一个共享的channel中发送事件**。因为我们已经确切地知道有len(filenames)个内部goroutine，所以外部的goroutine只需要在返回之前对这些事件计数

```golang
// 正确的写法
func makeThumbnails3(filenames []string) {
    ch := make(chan struct{})
    for _, f := range filenames {
        go func(f string) {
            thumbnail.ImageFile(f) // NOTE: ignoring errors
            ch <- struct{}{}
        }(f)
    }
    // Wait for goroutines to complete.
    for range filenames {
        // 其实这里不一定是每一个对应的，只需要保证数目就可以了
        <-ch
    }
}

// 错误 的写法
for _, f := range filenames {
    go func() {
        // 匿名函数的词法域问题（lexical environment）
        thumbnail.ImageFile(f) // NOTE: incorrect!
        // ...
    }()
}
```

- 从每一个worker goroutine往主goroutine中返回值

```golang
func makeThumbnails4(filenames []string) error {
    errors := make(chan error)

    for _, f := range filenames {
        go func(f string) {
            _, err := thumbnail.ImageFile(f)
            errors <- err
        }(f)
    }

    for range filenames {
        if err := <-errors; err != nil {
            // 错误的写法
            // 如果有多个错误，后面的错误不会被排空，会导致errors发生泄漏
            return err // NOTE: incorrect: goroutine leak!
        }
    }

    return nil
}
```

- 上面的代码当它遇到第一个非nil的error时会直接将error返回到调用方，使得没有一个goroutine去排空errors channel。这样剩下的worker goroutine在向这个channel中发送值时，都会永远地阻塞下去，并且永远都不会退出。这种情况叫做goroutine泄露，可能会导致整个程序卡住或者跑出out of memory的错误
- **最简单的解决办法就是用一个具有合适大小的buffered channel，这样这些worker goroutine向channel中发送错误时就不会被阻塞**。(一个可选的解决办法是创建一个另外的goroutine，当main goroutine返回第一个错误的同时去排空channel)

```golang
func makeThumbnails5(filenames []string) (thumbfiles []string, err error) {
    type item struct {
        thumbfile string
        err       error
    }

    ch := make(chan item, len(filenames))
    for _, f := range filenames {
        go func(f string) {
            var it item
            it.thumbfile, it.err = thumbnail.ImageFile(f)
            ch <- it
        }(f)
    }

    for range filenames {
        it := <-ch
        if it.err != nil {
            return nil, it.err
        }
        thumbfiles = append(thumbfiles, it.thumbfile)
    }

    return thumbfiles, nil
}
```

- 为了知道最后一个goroutine什么时候结束(最后一个结束并不一定是最后一个开始)，我们需要一个递增的计数器，在每一个goroutine启动时加一，在goroutine退出时减一。这需要一种特殊的计数器，这个计数器需要在多个goroutine操作时做到安全并且提供在其减为零之前一直等待的一种方法。这种计数类型被称为sync.WaitGroup
- 注意Add和Done方法的不对称。**Add是为计数器加一，必须在worker goroutine开始之前调用，而不是在goroutine中**；否则的话我们没办法确定Add是在"closer" goroutine调用Wait之前被调用。
- 并且Add还有一个参数，但Done却没有任何参数；其实它和Add(-1)是等价的。

```golang
func makeThumbnails6(filenames <-chan string) int64 {
    sizes := make(chan int64)
    var wg sync.WaitGroup // number of working goroutines
    for f := range filenames {
        // add方法必须在worker goroutine开始之前调用
        wg.Add(1)
        // worker
        go func(f string) {
            // 使用defer来确保计数器即使是在出错的情况下依然能够正确地被减掉
            defer wg.Done()
            thumb, err := thumbnail.ImageFile(f)
            if err != nil {
                log.Println(err)
                return
            }
            info, _ := os.Stat(thumb) // OK to ignore error
            sizes <- info.Size()
        }(f)
    }

    // closer
    go func() {
        wg.Wait()
        close(sizes)
    }()

    var total int64
    for size := range sizes {
        total += size
    }
    return total
}
```

## Select

```golang
select {
case <-ch1:
    // ...
case x := <-ch2:
    // ...use x...
case ch3 <- y:
    // ...
default:
    // ...
}
```

- select语句和switch语句稍微有点相似，也会有几个case和最后的default选择支。
- 每一个case代表一个通信操作(在某个channel上进行发送或者接收)并且会包含一些语句组成的一个语句块。
- 一个接收表达式可能只包含接收表达式自身，就像上面的第一个case，或者包含在一个简短的变量声明中，像第二个case里一样；第二种形式让你能够引用接收到的值。
- **select会等待case中有能够执行的case时去执行。当条件满足时，select才会去通信并执行case之后的语句；这时候其它通信是不会执行的。**
- **一个没有任何case的select语句写作select{}，会永远地等待下去**
- 如果有一个或多个IO操作可以完成，则Go运行时系统会随机的选择一个执行，否则的话，如果有default分支，则执行default分支语句，如果连default都没有，则select语句会一直阻塞，直到至少有一个IO操作可以进行

```golang
func main() {
    // ...create abort channel...
    abort := make(chan struct{})
    go func() {
        os.Stdin.Read(make([]byte, 1)) // read a single byte
        abort <- struct{}{}
    }()

    fmt.Println("Commencing countdown.  Press return to abort.")
    select {
    case <-time.After(10 * time.Second):
        // Do nothing.
    case <-abort:
        fmt.Println("Launch aborted!")
        return
    }
    launch()
}
```

- 有时候我们希望能够从channel中发送或者接收值，并避免因为发送或者接收导致的阻塞，尤其是当channel没有准备好写或者读时。select语句就可以实现这样的功能。select会有一个default来设置当其它的操作都不能够马上被处理时程序需要执行哪些逻辑。

```golang
select {
case <-abort:
    fmt.Printf("Launch aborted!\n")
    return
default:
    // do nothing
}
```

- channel的零值是nil。因为对一个nil的channel发送和接收操作会永远阻塞，在select语句中操作nil的channel永远都不会被select到。

## channel使用

### ⽤简单⼯⼚模式打包并发任务和 channel

```golang
func NewTest() chan int {
    c := make(chan int)
    rand.Seed(time.Now().UnixNano())
    go func() {
        // goroutine结束时才返随机数
        time.Sleep(time.Second)
        c <- rand.Int()
    }()
    return c
}

func main() {
    t := NewTest()
    println(<-t) // 等待 goroutine 结束返回。
}
```

### ⽤ channel 实现信号量 (semaphore)

```golang
func main() {
    wg := sync.WaitGroup{}
    wg.Add(3)

    sem := make(chan int, 1)

    for i := 0; i < 3; i++ {
        go func(id int) {
            defer wg.Done()
            sem <- 1 // 向 sem 发送数据，阻塞或者成功。
            for x := 0; x < 3; x++ {
                fmt.Println(id, x)
            }
            <-sem // 接收数据，使得其他阻塞 goroutine 可以发送数据。
        }(i)
    }
    wg.Wait()
}
```

### ⽤ closed channel 发出退出通知

- 原理：**关闭了一个channel并且被消费掉了所有已发送的值，从channel中读取会立即返回，并且产生零值**
- 方法：**不要向channel发送值，而是用关闭一个channel来进行广播**

```golang
var done = make(chan struct{})

func cancelled() bool {
    select {
    case <-done:
        return true
    default:
        return false
    }
}

go func() {
    os.Stdin.Read(make([]byte, 1)) // read a single byte
    close(done)
}()

for {
    select {
    case <-done:
        // Drain fileSizes to allow existing goroutines to finish.
        for range fileSizes {
            // Do nothing.
        }
        return
    case size, ok := <-fileSizes:
        // ...
    }
}

func walkDir(dir string, n *sync.WaitGroup, fileSizes chan<- int64) {
    defer n.Done()
    if cancelled() {
        return
    }
    for _, entry := range dirents(dir) {
        // ...
    }
}
```

### ⽤ select 实现超时 (timeout)

```golang
func main() {
    w := make(chan bool)
    c := make(chan int, 2)
    go func() {
        // selet只要其中一个可以执行完成就会退出
        // 可以搭配for进行循环
        select {
        case v := <-c: fmt.Println(v)
        case <-time.After(time.Second * 3): fmt.Println("timeout.")
        }
        w <- true
    }()
    // c <- 1 // 注释掉，引发 timeout。
    <-w
}
```

- **channel 是第⼀类对象，可传参 (内部实现为指针) 或者作为结构成员**

```golang
type Request struct {
    data []int
    ret chan int
}

func NewRequest(data ...int) *Request {
    return &Request{ data, make(chan int, 1) }
}

func Process(req *Request) {
    x := 0
    for _, i := range req.data {
        x += i
    }
    req.ret <- x
}

func main() {
    req := NewRequest(10, 20, 30)
    Process(req)
    fmt.Println(<-req.ret)
}
```
