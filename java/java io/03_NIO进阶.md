# NIO进阶

## FileChanne

### 打开FileChannel

```java
 * @see java.io.FileInputStream#getChannel()
 * @see java.io.FileOutputStream#getChannel()
 * @see java.io.RandomAccessFile#getChannel()
```

### 读写FileChannel

- 使用ByteBuffer读取文件内容

```java
RandomAccessFile aFile = new RandomAccessFile("data/nio-data.txt", "rw");
FileChannel inChannel = aFile.getChannel();

// 读
ByteBuffer buf = ByteBuffer.allocate(48);
int bytesRead = inChannel.read(buf);

// 写
String newData = "New String to write to file..." + System.currentTimeMillis();
ByteBuffer bufWrite = ByteBuffer.allocate(480);
bufWrite.clear();
bufWrite.put(newData.getBytes());
bufWrite.flip();
while(bufWrite.hasRemaining()) {
    channel.bufWrite(buf);
}
```

### 关闭

```java
channel.close();
```

### position

- 有时可能需要在FileChannel的某个特定位置进行数据的读/写操作。可以通过调用position()方法获取FileChannel的当前位置。
- 可以通过调用position(long pos)方法设置FileChannel的当前位置。
- 如果将位置设置在文件结束符之后，然后试图从文件通道中读取数据，读方法将返回-1
- 如果将位置设置在文件结束符之后，然后向通道中写数据，文件将撑大到当前位置并写入数据。这可能导致“文件空洞”，磁盘上物理文件中写入的数据间有空隙

```java
long pos = channel.position();
channel.position(pos +123);
```

### size

- FileChannel实例的size()方法将返回该实例所关联文件的大小。

```java
long fileSize = channel.size();
```

### FileChannel的truncate方法

- 可以使用FileChannel.truncate()方法截取一个文件。截取文件时，文件将指定长度后面的部分将被删除。

```java
channel.truncate(1024);
这个例子截取文件的前1024个字节。
```

### FileChannel的force方法

- FileChannel.force()方法将通道里尚未写入磁盘的数据强制写到磁盘上。出于性能方面的考虑，操作系统会将数据缓存在内存中，所以无法保证写入到FileChannel里的数据一定会即时写到磁盘上。要保证这一点，需要调用force()方法。
- force()方法有一个boolean类型的参数，指明是否同时将文件元数据（权限信息等）写到磁盘上。

```java
channel.force(true);
```

## SocketChannel

### 打开/关闭

```java
SocketChannel socketChannel = SocketChannel.open();
socketChannel.connect(new InetSocketAddress("http://jenkov.com", 80));

socketChannel.close();
```

### 读写SocketChannel

### 非阻塞模式

- 可以设置 SocketChannel 为非阻塞模式.设置之后，就可以在异步模式下调用connect(), read() 和write()了。

#### connect()

如果SocketChannel在非阻塞模式下，此时调用connect()，该方法可能在连接建立之前就返回了。为了确定连接是否建立，可以调用finishConnect()的方法。

```java

socketChannel.configureBlocking(false);
socketChannel.connect(new InetSocketAddress("http://jenkov.com", 80));
while(! socketChannel.finishConnect() ){
    //wait, or do something else...
}
```

#### write()

- 非阻塞模式下，write()方法在尚未写出任何内容时可能就返回了。所以需要在循环中调用write()。

#### read()

- 非阻塞模式下,read()方法在尚未读取到任何数据时可能就返回了。所以需要关注它的int返回值，它会告诉你读取了多少字节。

## ServerSocketChannel

### 打开/关闭ServerSocketChannel

```java
ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();

serverSocketChannel.close();
```

### 监听新进来的连接

- 通过 ServerSocketChannel.accept() 方法监听新进来的连接。
- 当 accept()方法返回的时候,它返回一个包含新进来的连接的 SocketChannel。
- 因此, accept()方法会一直阻塞到有新连接到达。

```java
// 通常不会仅仅只监听一个连接,在while循环中调用 accept()方法. 如下面的例子：

while(true){
    SocketChannel socketChannel = serverSocketChannel.accept();
    //do something with socketChannel...6
}
```

### ServerSocketChannel非阻塞模式

- ServerSocketChannel可以设置成非阻塞模式。
- 在非阻塞模式下，accept() 方法会立刻返回，**如果还没有新进来的连接,返回的将是null。 因此，需要检查返回的SocketChannel是否是null**

```java
ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
serverSocketChannel.socket().bind(new InetSocketAddress(9999));
serverSocketChannel.configureBlocking(false);
while(true){
    SocketChannel socketChannel = serverSocketChannel.accept();
    if(socketChannel != null){
         //do something with socketChannel...
    }
}
```