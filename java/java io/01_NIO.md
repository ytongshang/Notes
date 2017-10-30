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