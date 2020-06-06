# RTMP

## 相关文档

-   [带你吃透 RTMP](https://www.jianshu.com/p/b2144f9bbe28)

## 简介

-   RTMP 协议是应用层协议，是要靠底层可靠的传输层协议（通常是 TCP）来保证信息传输的可靠性的。
-   在基于传输层协议的链接建立完成后，RTMP 协议也要客户端和服务器通过“握手”来建立基于传输层链接之上的 RTMP Connection 链接，在 Connection 链接上会传输一些控制信息，如 SetChunkSize,SetACKWindowSize。
-   其中 CreateStream 命令会创建一个 Stream 链接，用于传输具体的音视频数据和控制这些信息传输的命令信息。- **RTMP 协议传输时会对数据做自己的格式化，这种格式的消息我们称之为 RTMP Message**
-   **而实际传输的时候为了更好地实现多路复用、分包和信息的公平性，发送端会把 Message 划分为带有 Message ID 的 Chunk，每个 Chunk 可能是一个单独的 Message，也可能是 Message 的一部分，在接受端会根据 chunk 中包含的 data 的长度，message id 和 message 的长度把 chunk 还原成完整的 Message，从而实现信息的收发**

## Message

-   **Timestamp（时间戳）**：消息的时间戳（但不一定是当前时间，后面会介绍），4 个字节
-   **Length(长度)**：是指 Message Payload（消息负载）即音视频等信息的数据的长度，3 个字节
-   **TypeId(类型 Id)**：消息的类型 Id，1 个字节
-   **Message Stream ID（消息的流 ID）**：每个消息的唯一标识，划分成 Chunk 和还原 Chunk 为 Message 的时候都是根据这个 ID 来辨识是否是同一个消息的 Chunk 的，4 个字节，并且以小端格式存储

## Chunking

-   RTMP 在收发数据的时候并不是以 Message 为单位的，而是把 Message 拆分成 Chunk 发送，而且必须在一个 Chunk 发送完成之后才能开始发送下一个 Chunk。每个 Chunk 中带有 MessageID 代表属于哪个 Message，接受端也会按照这个 id 来将 chunk 组装成 Message
-   **通过拆分，数据量较大的 Message 可以被拆分成较小的“Message”，这样就可以避免优先级低的消息持续发送阻塞优先级高的数据**，比如在视频的传输过程中，会包括视频帧，音频帧和 RTMP 控制信息，如果持续发送音频数据或者控制数据的话可能就会造成视频帧的阻塞，然后就会造成看视频时最烦人的卡顿现象。- **同时对于数据量较小的 Message，可以通过对 Chunk Header 的字段来压缩信息，从而减少信息的传输量**

## 协议控制消息

-   **set Chunk Size(Message Type ID=1):设置 chunk 中 Data 字段所能承载的最大字节数**，默认为 128B，通信过程中可以通过发送该消息来设置 chunk Size 的大小（不得小于 128B），而且通信双方会各自维护一个 chunkSize，两端的 chunkSize 是独立的
-   **Abort Message(Message Type ID=2):当一个 Message 被切分为多个 chunk，接受端只接收到了部分 chunk 时，发送该控制消息表示发送端不再传输同 Message 的 chunk，接受端接收到这个消息后要丢弃这些不完整的 chunk**。Data 数据中只需要一个 CSID，表示丢弃该 CSID 的所有已接收到的 chunk
-   **Acknowledgement(Message Type ID=3):当收到对端的消息大小等于窗口大小（Window Size）时接受端要回馈一个 ACK 给发送端告知对方可以继续发送数据**
-   **Window Acknowledgement Size(Message Type ID=5):发送端在接收到接受端返回的两个 ACK 间最多可以发送的字节数。**
-   **Set Peer Bandwidth(Message Type ID=6):限制对端的输出带宽**。接受端接收到该消息后会通过设置消息中的 Window ACK Size 来限制已发送但未接受到反馈的消息的大小来限制发送端的发送带宽。如果消息中的 Window ACK Size 与上一次发送给发送端的 size 不同的话要回馈一个 Window Acknowledgement Size 的控制消息

## 命令

-   发送命令消息的对象有两种，一种是 NetConnection，表示双端的上层连接，一种是 NetStream，表示流信息的传输通道，控制流信息的状态，如 Play 播放流，Pause 暂停

### NetConnection Commands

-   connect:用于客户端向服务器发送连接请求
-   Call:用于在对端执行某函数，即常说的 RPC：远程进程调用
-   Create Stream：创建传递具体信息的通道，从而可以在这个流中传递具体信息，传输信息单元为 Chunk

### NetStream Commands

-   Netstream 建立在 NetConnection 之上，通过 NetConnection 的 createStream 命令创建，用于传输具体的音频、视频等信息。在传输层协议之上只能连接一个 NetConnection，但一个 NetConnection 可以建立多个 NetStream 来建立不同的流通道传输数据
    -   play
    -   play2，**play2 命令可以将当前正在播放的流切换到同样数据但不同比特率的流上，服务器端会维护多种比特率的文件来供客户端使用 play2 命令来切换**
    -   deleteStream(删除流)：用于客户端告知服务器端本地的某个流对象已被删除，不需要再传输此路流
    -   receiveAudio(接收音频)：通知服务器端该客户端是否要发送音频
    -   receiveVideo(接收视频)：通知服务器端该客户端是否要发送视频
    -   publish(推送数据)：由客户端向服务器发起请求推流到服务器
    -   seek(定位流的位置)：定位到视频或音频的某个位置，以毫秒为单位
    -   pause（暂停）：客户端告知服务端停止或恢复播放

## 直播选用 RTMP

-   多路复用
    -   创建多个 stream，音视频流的分开
-   分包
    -   RTMP Message
    -   RTMP 要将 Message 拆分成不同的 Chunk
    -   通过拆分，数据量较大的 Message 可以被拆分成较小的“Message”，这样就可以避免优先级低的消息持续发送阻塞优先级高的数据，比如在视频的传输过程中，会包括视频帧，音频帧和 RTMP 控制信息，如果持续发送音频数据或者控制数据的话可能就会造成视频帧的阻塞，然后就会造成看视频时最烦人的卡顿现象。同时对于数据量较小的 Message，可以通过对 Chunk Header 的字段来压缩信息，从而减少信息的传输量
-   命令
    -   play,receiveAudio, receiveVideo, deleteStream
-   CDN 的支持和优化
-   各平台的支持，android,ios 开源实现，浏览器的 flash 支持
-   延迟较低，相比较于 hls,与 http-flv 相当
