# NIO

## 总结

- Channel,Buffer,Selectors
- 所有的 IO 在NIO 中都从一个Channel 开始。Channel 有点象流。 数据可以从Channel读到Buffer中，也可以从Buffer 写到Channel中。

## Channel

- Java NIO的通道类似流，但又有些不同：
    - 既可以从通道中读取数据，又可以写数据到通道。但流的读写通常是单向的。
    - 通道可以异步地读写。
    - 通道中的数据总是要先读到一个Buffer，或者总是要从一个Buffer中写入。

- 常见的Channel
    - FileChannel 从文件中读写数据。
    - DatagramChannel 能通过UDP读写网络中的数据。
    - SocketChannel 能通过TCP读写网络中的数据。
    - ServerSocketChannel可以监听新进来的TCP连接，像Web服务器那样。对每一个新进来的连接都会创建一个SocketChannel

- Channel示例

```java
RandomAccessFile aFile = new RandomAccessFile("data/nio-data.txt", "rw");
FileChannel inChannel = aFile.getChannel();

ByteBuffer buf = ByteBuffer.allocate(48);

int bytesRead = inChannel.read(buf);
while (bytesRead != -1) {
    System.out.println("Read " + bytesRead);
    buf.flip();

    while(buf.hasRemaining()){
        System.out.print((char) buf.get());
    }

    buf.clear();
    bytesRead = inChannel.read(buf);
}

aFile.close();
```

## Buffer

- Buffer(缓冲区)本质上是一块可以写入数据，然后可以从中读取数据的内存，这块内存中有很多可以存储byte（或int、char等）的小单元。这块内存被包装成NIO Buffer对象，并提供了一组方法，用来方便的访问该块内存。

- 非boolean的基本类型都有一个对应的Buffer类型

### Capacity/Limit/Position/Mark

- mark <= position <= limit <= capacity

#### Capacity

- 作为一个内存块，Buffer有一个固定的大小值，也叫“capacity”.你只能往里写capacity个byte、long，char等类型。一旦Buffer满了，需要将其清空（通过读数据或者清除数据）才能继续写数据往里写数据。

#### Limit

- 在写模式下，Buffer的limit表示你最多能往Buffer里写多少数据。 **写模式下，limit等于Buffer的capacity**。
- 当切换Buffer到读模式时， limit表示你最多能读到多少数据。**因此，当切换Buffer到读模式时，limit会被设置成写模式下的position值。**换句话说，你能读到之前写入的所有数据（limit被设置成已写数据的数量，这个值在写模式下就是position）

#### Position

- **当你写数据到Buffer中时，position表示当前的位置**。初始的position值为0.当一个byte、long等数据写到Buffer后， position会向前移动到下一个可插入数据的Buffer单元。position最大可为capacity – 1.
- 当读取数据时，也是从某个特定位置读。当将Buffer从写模式切换到读模式，position会被重置为0. 当从Buffer的position处读取数据时，position向前移动到下一个可读的位置。

#### Mark

- 一个临时存放的位置下标。调用mark()会将mark设为当前的position的值，以后调用reset()会将position属性设置为mark的值。
- mark的值总是小于等于position的值，如果将position的值设的比mark小，当前的mark值会被抛弃掉。

### Buffer的分配

- 分配buffer对象

```java
ByteBuffer buf = ByteBuffer.allocate(48);

CharBuffer charBuff = CharBuffer.allocate(48);
```

### 向Buffer中写数据

- 通过Channel向buffer中写数据，也就是从channel中读数据

```java
int bytesRead = channel.read(buf);
// 返回读取的字节数
```

- 通过对应的put方法,put方法有很多对应的重载的方法

```java
buf.put(127);
```

### 从Buffer中读数据

- 从Buffer读取数据到channel，也就是向channel中写数据

```java
int bytesWrite = channel.write(buf);
```

- **由于buffer不能保证一次向channel中写完数据，所以一般要通过循环**

```java
while(buf.remaining()) {
    channel.write(buf);
}
```

- 使用get()方法从Buffer中读取数据的例子,get方法有很多版本，允许你以不同的方式从Buffer中读取数据。例如，从指定position读取，或者从Buffer中读取数据到字节数组

```java
byte aByte = buf.get()
```

### flip()方法

- flip方法将Buffer从写模式切换到读模式
- 调用flip()方法会将position设回0，并将limit设置成之前position的值。
 换句话说，position现在用于标记读的位置，limit表示之前写进了多少个byte、char等 —— 现在能读取多少个byte、char等

```java
public final Buffer flip() {
    limit = position;
    position = 0;
    mark = -1;
    return this;
}
```

### rewind()方法

- rewind()在读写模式下都可用，它单纯的将当前位置置0，同时取消mark标记，仅此而已；
- 也就是说**写模式下limit仍保持与Buffer容量相同，只是重头写而已**
- 读模式下limit仍然与rewind()调用之前相同，也就是flip()调用之前写模式下的position的最后位置，flip()调用后此位置变为了读模式的limit位置，即越界位置

```java
 public final Buffer rewind() {
    position = 0;
    mark = -1;
    return this;
}
```

### clear()与compact()方法

- 一旦读完Buffer中的数据，需要让Buffer准备好再次被写入。可以通过clear()或compact()方法来完成。
- **如果调用的是clear()方法，position将被设回0，limit被设置成 capacity的值**。换句话说，Buffer 被清空了。Buffer中的数据并未清除，只是这些标记告诉我们可以从哪里开始往Buffer里写数据。
- 如果Buffer中有一些未读的数据，调用clear()方法，数据将“被遗忘”，意味着不再有任何标记会告诉你哪些数据被读过，哪些还没有。
- 如果Buffer中仍有未读的数据，且后续还需要这些数据，但是此时想要先先写些数据，那么使用compact()方法。compact()方法将所有未读的数据拷贝到Buffer起始处。然后将position设到最后一个未读元素正后面。limit属性依然像clear()方法一样，设置成capacity。现在Buffer准备好写数据了，但是不会覆盖未读的数据。

```java
public final Buffer clear() {
    position = 0;
    limit = capacity;
    mark = -1;
    return this;
}
```

### mark()与reset()

- 通过调用Buffer.mark()方法，可以标记Buffer中的一个特定position。之后可以通过调用Buffer.reset()方法恢复到这个position。

```java
buffer.mark();
//call buffer.get() a couple of times, e.g. during parsing.
buffer.reset();  //set position back to mark.
```

### Scatter/Gather

- Java NIO开始支持scatter/gather，scatter/gather用于描述从Channel中读取或者写入到Channel的操作。
- 分散（scatter）从Channel中读取是指在读操作时将读取的数据写入多个buffer中。因此，Channel将从Channel中读
 取的数据“分散（scatter）”到多个Buffer中。
- 聚集（gather）写入Channel是指在写操作时将多个buffer的数据写入同一个Channel，因此，Channel将多个Buffer中的数据“聚集（gather）”后发送到Channel。

#### Scatter

- scatter / gather经常用于需要将传输的数据分开处理的场合，例如传输一个由消息头和消息体组成的消息，你可能会将消息体和消息头分散到不同的buffer中，这样你可以方便的处理消息头和消息体。

```java
ByteBuffer header = ByteBuffer.allocate(128);
ByteBuffer body   = ByteBuffer.allocate(1024);

ByteBuffer[] bufferArray = { header, body };
channel.read(bufferArray);
```

- 注意buffer首先被插入到数组，然后再将数组作为channel.read() 的输入参数。read()方法按照buffer在数组中的顺序将从channel中读取的数据写入到buffer，当一个buffer被写满后，channel紧接着向另一个buffer中写。
- **Scattering Reads在移动下一个buffer前，必须填满当前的buffer，这也意味着它不适用于动态消息**(消息大小不固定)。换句话说，如果存在消息头和消息体，消息头必须完成填充（例如 128byte），Scattering Reads才能正常工作

#### Gather

```java
ByteBuffer header = ByteBuffer.allocate(128);
ByteBuffer body   = ByteBuffer.allocate(1024);

//write data into buffers

ByteBuffer[] bufferArray = { header, body };
channel.write(bufferArray);
```

- buffers数组是write()方法的入参，write()方法会按照buffer在数组中的顺序，将数据写入到channel，**注意只有position和limit之间的数据才会被写入**。
- 因此，如果一个buffer的容量为128byte，但是仅仅包含58byte的数据，那么这58byte的数据将被写入到channel中。**因此与Scattering Reads相反，Gathering Writes能较好的处理动态消息**

### 通道之间的数据传送

- 在Java NIO中，如果两个通道中有一个是FileChannel，那你可以直接将数据从一个channel 传输到另外一个channel

#### transferFrom()

```java
 public abstract long transferFrom(ReadableByteChannel src, long position, long count) throws IOException;
```

- src 来源于哪一个channel，其中FileChannel实现了ReadableByteChannel
- **position指的是调用transferFrom方法的channel，也就是表示在toChannel的position位置开始写入**
- 整个方法的意思是从src中读取最多count个byte，然后往函数的调用方（本Channel）的position开始写入，
 但是有可能由于src中还剩的byte小于count个，**导致最后实际写入toChannel的值，也就是函数的返回值小于count**
- **方法调用后不会修改本channel的positon，而src由于读取数据，src的positon会向后移动实际读取的byte数的位置**

```java
RandomAccessFile fromFile = new RandomAccessFile("fromFile.txt", "rw");
FileChannel      fromChannel = fromFile.getChannel();

RandomAccessFile toFile = new RandomAccessFile("toFile.txt", "rw");
FileChannel      toChannel = toFile.getChannel();

long position = 0;
long count = fromChannel.size();

toChannel.transferFrom(position, count, fromChannel);
```

#### transferTo()

```java
public abstract long transferTo(long position, long count,
                                    WritableByteChannel target)
        throws IOException;
```

- target，写入的channel
- position,**是指函数调用方的channel，也就是从fromChannel（本channel）的postion位置开始读取数据**
- 整个方法的意思是从函数的调用方（本channel）的position位置开始读取最多count个byte，然后从写入到target中，
 但是有可能由于本channel中还剩的byte小于count个，**导致最后实际写入target的值，也就是函数的返回值小于count**
- **方法调用后不会修改本channel的positon，而target由于读取数据,target的positon会向后移动实际读取的byte数的位置**

## Selector

![Selector](./../../image-resources/java/io/nio_selector.png)

### Selector的创建

```java
Selector selector = Selector.open();
```

### 向Selector注册通道

```java
// 获得一个selectableChannel
// SelectableChannel channel = ...
channel.configureBlocking(false);
SelectionKey key = channel.register(selector,SelectionKey.OP_READ,attachMent);
```

#### configureBlocking

- **channel与Selector一起使用时，channel必须处理非阻塞模式下**，因而FileChannel不能与Selector一起使用

#### 注册时的interest集合

- 注意register()方法的第二个参数。这是一个“interest集合”，意思是在通过Selector监听Channel时对什么事件感兴趣。可以监听四种不同类型的事件：
    - Connect
    - Accept
    - Read
    - Write
- 通道触发了一个事件意思是该事件已经就绪。所以，某个channel成功连接到另一个服务器称为“连接就绪”。一个server socket  channel准备好接收新进入的连接称为“接收就绪”。一个有数据可读的通道可以说是“读就绪”。等待写数据的通道可以说是“写就绪”。
 这四种事件用SelectionKey的四个常量来表示：
    - SelectionKey.OP_CONNECT
    - SelectionKey.OP_ACCEPT
    - SelectionKey.OP_READ
    - SelectionKey.OP_WRITE
- 如果对不止一种事件感兴趣，那么可以用“位或”操作符将常量连接起来，如下：

```java
int interestSet = SelectionKey.OP_READ | SelectionKey.OP_WRITE;
```

### SelectionKey

#### SelectionKey的interest集合

- interest集合是Selector感兴趣的集合，用于指示选择器对通道关心的操作，可通过SelectionKey对象的interestOps()获取。
- 最初，该兴趣集合是通道被注册到Selector时传进来的值。我们可以通过以下方法来判断Selector是否对Channel的某种事件感兴趣

```java
int interestSet = selectionKey.interestOps();

boolean isInterestedInAccept  = (interestSet & SelectionKey.OP_ACCEPT) == SelectionKey.OP_ACCEPT；
boolean isInterestedInConnect = interestSet & SelectionKey.OP_CONNECT;
boolean isInterestedInRead    = interestSet & SelectionKey.OP_READ;
boolean isInterestedInWrite   = interestSet & SelectionKey.OP_WRITE;
```

- **该集合不会被选择器改变，但是可通过interestOps()改变**

```java
selectionKey.interestOps(SelectionKey.OP_READ|SelectionKey.OP_WRITE);
```

#### ready集合

- **ready集合是通道已经就绪的操作的集合，表示一个通道准备好要执行的操作了**,可通过SelctionKey对象的readyOps()来获取相关通道已经就绪的操作。
- 需要注意的是，通过readyOps()方法返回的就绪状态指示只是一个提示，底层的通道在任何时候都会不断改变，而其他线程也可能在通道上执行操作并影响到它的就绪状态。另外，我们不能直接修改read集合

```java
int readySet = selectionKey.readyOps();
```

- **它是interest集合的子集，并且表示了interest集合中从上次调用select()以后已经就绪的那些操作**。（比如选择器对通道的read,write操作感兴趣，而某时刻通道的read操作已经准备就绪可以被选择器获知了，前一种就是interest集合，后一种则是ready集合。）。JAVA中定义以下几个方法用来检查这些操作是否就绪：

```java
selectionKey.isAcceptable();
selectionKey.isConnectable();
selectionKey.isReadable();
selectionKey.isWritable();
```

#### Channel + Selector

- 从SelectionKey访问Channel和Selector很简单。如下：

```java
Channel  channel  = selectionKey.channel();
Selector selector = selectionKey.selector();
```

#### 附加对象

- 可以将一个附加对象绑定到SelectionKey上，以便容易的识别给定的通道。通常有两种方式：
- 在注册的时候直接绑定：

```java
SelectionKey key=channel.register(selector,SelectionKey.OP_READ,theObject);
```

- 在绑定完成之后附加:

```java
selectionKey.attach(theObject);//绑定
```

- 绑定之后，可通过对应的SelectionKey取出该对象:

```java
selectionKey.attachment();
```

- 如果要取消该对象，则可以通过该种方式:

```java
selectionKey.attach(null);
```

- 需要注意的是如果附加的对象不再使用，一定要人为清除，因为垃圾回收器不会回收该对象，若不清除的话会成内存泄漏。

### 通过Selector选择通道

#### 已注册的键的集合(Registered key set)

- 所有与选择器关联的通道所生成的键的集合称为已经注册的键的集合。并不是所有注册过的键都仍然有效。
- 这个集合通过keys()方法返回，并且可能是空的。这个已注册的键的集合不是可以直接修改的；
 试图这么做的话将引发java.lang.UnsupportedOperationException

#### 已选择的键的集合(Selected key set)

- 已注册的键的集合的子集。
- 这个集合的每个成员都是相关的通道被选择器(在前一个选择操作中)判断为已经准备好的，并且包含于键的interest集合中的操作。
 这个集合通过selectedKeys()方法返回(并有可能是空的)。
- 不要将已选择的键的集合与ready集合弄混了。这是一个键的集合，每个键都关联一个已经准备好至少一种操作的通道。
 每个键都有一个内嵌的ready集合，指示了所关联的通道已经准备好的操作。
- 键可以直接从这个集合中移除，但不能添加。试图向已选择的键的集合中添加元素将抛出java.lang.UnsupportedOperationException。

#### 已取消的键的集合(Cancelled key set)

- 已注册的键的集合的子集，
- 这个集合包含了cancel()方法被调用过的键(这个键已经被无效化)，但它们还没有被注销。这个集合是选择器对象的私有成员，因而无法直接访问

#### Select

- 通过Selector的select（）方法可以选择已经准备就绪的通道（这些通道包含你感兴趣的的事件）。比如你对读就绪的通道感兴趣，
 那么select（）方法就会返回读事件已经就绪的那些通道。
- 下面是Selector几个重载的select()方法：
    - select():**阻塞**到至少有一个通道在你注册的事件上就绪了
    - select(long timeout)：和select()一样，**但最长阻塞时间为timeout毫秒**
    - selectNow():**非阻塞**，只要有通道就绪就立刻返回。
- **select()方法返回的int值表示有多少通道已经就绪,是自上次调用select()方法后有多少通道变成就绪状态。**
- **之前在select（）调用时进入就绪的通道不会在本次调用中被记入，而在前一次select（）调用进入就绪但现在已经不在处于就绪的通道也不会被记入。**例如：首次调用select()方法，如果有一个通道变成就绪状态，返回了1，若再次调用select()方法，如果另一个通道就绪了，它会再次返回1。如果对第一个就绪的channel没有做任何操作，现在就有两个就绪的通道，但在每次select()方法调用之间，只有一个通道就绪了。
- 一旦调用select()方法，并且返回值不为0时，则可以通过调用Selector的selectedKeys()方法来访问已选择键集合。如下：

```java
Selector selector = Selector.open();
channel.configureBlocking(false);
SelectionKey key = channel.register(selector, SelectionKey.OP_READ);
while(true) {
  int readyChannels = selector.select();
  if(readyChannels == 0) continue;
  Set selectedKeys = selector.selectedKeys();
  Iterator keyIterator = selectedKeys.iterator();
  while(keyIterator.hasNext()) {
    SelectionKey key = keyIterator.next();
    if(key.isAcceptable()) {
        // a connection was accepted by a ServerSocketChannel.
    } else if (key.isConnectable()) {
        // a connection was established with a remote server.
    } else if (key.isReadable()) {
        // a channel is ready for reading
    } else if (key.isWritable()) {
        // a channel is ready for writing
    }
    keyIterator.remove();
  }
}
```

#### wakeup

- 当selector由于调用select()或select(long)阻塞后，**可以调用selector的wakeup()方法，阻塞在select()方法上的线程会立马返回**。
- **如果当前没有selection操作正在进行(select()或select(long)阻塞)，下一个调用select()或select(long)也会立即返回，后续的select()和select(long)的操作则会正常阻塞**

#### close()

- 用完Selector后调用其close()方法会关闭该Selector，且使注册到该Selector上的所有SelectionKey实例无效。
- **通道本身并不会关闭**
