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