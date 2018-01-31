# Socket

- TCP Socket和UDP Socket
- 网络层的“ip地址”可以唯一标识网络中的主机，而传输层的“协议+端口”可以唯一标识主机中的进程。
 **这样利用三元组（ip地址，协议，端口）就可以标识网络的进程**

## IP

- go中的ip

```golang
type IP []byte

addr := net.ParseIP(name)
if addr == nil {
    fmt.Println("Invalid address")
} else {
    fmt.Println("The address is ", addr.String())
}
```

## TCP Socket

### TCPConn

- **类型TCPConn**，可以用来作为客户端和服务器端交互的通道

```golang
func (c *TCPConn) Write(b []byte) (int, error)
func (c *TCPConn) Read(b []byte) (int, error)
```

### TCPAddr

- **TCPAddr类型**，表示一个TCP的地址信息

```golang
type TCPAddr struct {
    IP IP
    Port int
    Zone string // IPv6 scoped addressing zone
}
```

- **通过ResolveTCPAddr获取一个TCPAddr**

```golang
func ResolveTCPAddr(net, addr string) (*TCPAddr, os.Error)

// net参数是"tcp4"、"tcp6"、"tcp"中任意一个，分别表示IPv4-only, IPv6-only或者TCP(IPv4, IPv6的任意一个)
// addr表示域名或者IP地址
```

### TCP Client和Server

- 在Client端通过net包中的DialTCP函数来建立一个TCP连接

```golang
func DialTCP(network string, laddr, raddr *TCPAddr) (*TCPConn, error)
// net参数是"tcp4"、"tcp6"、"tcp"中的任意一个
// laddr表示本机地址，一般设置为nil
// raddr表示远程的服务地址
```

- 在Server端我们需要绑定服务到指定的非激活端口，并监听此端口，当有客户端请求到达的时候可以接收到来自客户端连接的请求

```golang
func ListenTCP(network string, laddr *TCPAddr) (*TCPListener, error)
func (l *TCPListener) Accept() (Conn, error)
```

```golang
func main() {
    service := ":1200"
    tcpAddr, err := net.ResolveTCPAddr("tcp4", service)
    checkError(err)
    listener, err := net.ListenTCP("tcp", tcpAddr)
    checkError(err)
    for {
        conn, err := listener.Accept()
        if err != nil {
            continue
        }
        go handleClient(conn)
    }
}

func handleClient(conn net.Conn) {
    defer conn.Close()
    daytime := time.Now().String()
    conn.Write([]byte(daytime)) // don't care about return value
    // we're finished with this client
}

func handleClient(conn net.Conn) {
    conn.SetReadDeadline(time.Now().Add(2 * time.Minute)) // set 2 minutes timeout
    request := make([]byte, 128) // set maxium request length to 128B to prevent flood attack
    defer conn.Close()  // close connection before exit
    for {
        read_len, err := conn.Read(request)

        if err != nil {
            fmt.Println(err)
            break
        }

        if read_len == 0 {
            break // connection already closed by client
        } else if strings.TrimSpace(string(request[:read_len])) == "timestamp" {
            daytime := strconv.FormatInt(time.Now().Unix(), 10)
            conn.Write([]byte(daytime))
        } else {
            daytime := time.Now().String()
            conn.Write([]byte(daytime))
        }

        request = make([]byte, 128) // clear last read content
    }
}

func checkError(err error) {
    if err != nil {
        fmt.Fprintf(os.Stderr, "Fatal error: %s", err.Error())
        os.Exit(1)
    }
}
```

### 控制tcp连接

- 建立连接的超时时间

```golang
// 设置建立连接的超时时间，客户端和服务器端都适用，当超过设置时间时，连接自动关闭。
func DialTimeout(net, addr string, timeout time.Duration) (Conn, error)
```

- 写入/读取一个连接的超时时间

```golang
func (c *TCPConn) SetReadDeadline(t time.Time) error
func (c *TCPConn) SetWriteDeadline(t time.Time) error
```

- KeepAlive

```golang
//设置keepAlive属性，是操作系统层在tcp上没有数据和ACK的时候，会间隔性的发送keepalive包，操作系统可以通过该包来判断一个tcp连接是否已经断开
func (c *TCPConn) SetKeepAlive(keepalive bool) os.Error
```

## UDP socket

- Go语言包中处理UDP Socket和TCP Socket不同的地方就是在服务器端处理多个客户端请求数据包的方式不同,UDP缺少了对客户端连接请求的Accept函数。其他基本几乎一模一样，只有TCP换成了UDP而已

```golang
func ResolveUDPAddr(net, addr string) (*UDPAddr, os.Error)
func DialUDP(net string, laddr, raddr *UDPAddr) (c *UDPConn, err os.Error)
func ListenUDP(net string, laddr *UDPAddr) (c *UDPConn, err os.Error)
func (c *UDPConn) ReadFromUDP(b []byte) (n int, addr *UDPAddr, err os.Error)
func (c *UDPConn) WriteToUDP(b []byte, addr *UDPAddr) (n int, err os.Error)
```

```golang
service := os.Args[1]
udpAddr, err := net.ResolveUDPAddr("udp4", service)
checkError(err)
conn, err := net.DialUDP("udp", nil, udpAddr)
checkError(err)
_, err = conn.Write([]byte("anything"))
checkError(err)
var buf [512]byte
n, err := conn.Read(buf[0:])
checkError(err)
fmt.Println(string(buf[0:n]))
```

```golang
func main() {
    service := ":1200"
    udpAddr, err := net.ResolveUDPAddr("udp4", service)
    checkError(err)
    conn, err := net.ListenUDP("udp", udpAddr)
    checkError(err)
    for {
        handleClient(conn)
    }
}
func handleClient(conn *net.UDPConn) {
    var buf [512]byte
    _, addr, err := conn.ReadFromUDP(buf[0:])
    if err != nil {
        return
    }
    daytime := time.Now().String()
    conn.WriteToUDP([]byte(daytime), addr)
}

func checkError(err error) {
    if err != nil {
        fmt.Fprintf(os.Stderr, "Fatal error ", err.Error())
        os.Exit(1)
    }
}
```

## REST(REpresentational State Transfer)

- **Resouces**:就是我们平常上网访问的一张图片、一个文档、一个视频等资源通过URI来定位，也就是一个URI表示一个资源
- **Representation**：URI确定一个资源，在HTTP请求的头信息中用Accept和Content-Type字段指定，这两个字段才是对"表现层"的描述
- **状态转化**：GET用来获取资源，POST用来新建资源（也可以用于更新资源），PUT用来更新资源，DELETE用来删除资源

## RPC
