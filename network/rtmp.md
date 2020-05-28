# RTMP

## 相关文档

- [带你吃透RTMP](https://www.jianshu.com/p/b2144f9bbe28)

## 简介

-   RTMP协议是应用层协议，是要靠底层可靠的传输层协议（通常是TCP）来保证信息传输的可靠性的。
-   在基于传输层协议的链接建立完成后，RTMP协议也要客户端和服务器通过“握手”来建立基于传输层链接之上的RTMP Connection链接，在Connection链接上会传输一些控制信息，如SetChunkSize,SetACKWindowSize。
-   其中CreateStream命令会创建一个Stream链接，用于传输具体的音视频数据和控制这些信息传输的命令信息。-   **RTMP协议传输时会对数据做自己的格式化，这种格式的消息我们称之为RTMP Message**
-   **而实际传输的时候为了更好地实现多路复用、分包和信息的公平性，发送端会把Message划分为带有Message ID的Chunk，每个Chunk可能是一个单独的Message，也可能是Message的一部分，在接受端会根据chunk中包含的data的长度，message id和message的长度把chunk还原成完整的Message，从而实现信息的收发**

## Message

-   **Timestamp（时间戳）**：消息的时间戳（但不一定是当前时间，后面会介绍），4个字节
-   **Length(长度)**：是指Message Payload（消息负载）即音视频等信息的数据的长度，3个字节
-   **TypeId(类型Id)**：消息的类型Id，1个字节
-   **Message Stream ID（消息的流ID）**：每个消息的唯一标识，划分成Chunk和还原Chunk为Message的时候都是根据这个ID来辨识是否是同一个消息的Chunk的，4个字节，并且以小端格式存储

## Chunking

- RTMP在收发数据的时候并不是以Message为单位的，而是把Message拆分成Chunk发送，而且必须在一个Chunk发送完成之后才能开始发送下一个Chunk。每个Chunk中带有MessageID代表属于哪个Message，接受端也会按照这个id来将chunk组装成Message
- **通过拆分，数据量较大的Message可以被拆分成较小的“Message”，这样就可以避免优先级低的消息持续发送阻塞优先级高的数据**，比如在视频的传输过程中，会包括视频帧，音频帧和RTMP控制信息，如果持续发送音频数据或者控制数据的话可能就会造成视频帧的阻塞，然后就会造成看视频时最烦人的卡顿现象。- **同时对于数据量较小的Message，可以通过对Chunk Header的字段来压缩信息，从而减少信息的传输量**

## 协议控制消息

- **set Chunk Size(Message Type ID=1):设置chunk中Data字段所能承载的最大字节数**，默认为128B，通信过程中可以通过发送该消息来设置chunk Size的大小（不得小于128B），而且通信双方会各自维护一个chunkSize，两端的chunkSize是独立的
- **Abort Message(Message Type ID=2):当一个Message被切分为多个chunk，接受端只接收到了部分chunk时，发送该控制消息表示发送端不再传输同Message的chunk，接受端接收到这个消息后要丢弃这些不完整的chunk**。Data数据中只需要一个CSID，表示丢弃该CSID的所有已接收到的chunk
- **Acknowledgement(Message Type ID=3):当收到对端的消息大小等于窗口大小（Window Size）时接受端要回馈一个ACK给发送端告知对方可以继续发送数据**
- **Window Acknowledgement Size(Message Type ID=5):发送端在接收到接受端返回的两个ACK间最多可以发送的字节数。**
- **Set Peer Bandwidth(Message Type ID=6):限制对端的输出带宽**。接受端接收到该消息后会通过设置消息中的Window ACK Size来限制已发送但未接受到反馈的消息的大小来限制发送端的发送带宽。如果消息中的Window ACK Size与上一次发送给发送端的size不同的话要回馈一个Window Acknowledgement Size的控制消息

## 命令

- 发送命令消息的对象有两种，一种是NetConnection，表示双端的上层连接，一种是NetStream，表示流信息的传输通道，控制流信息的状态，如Play播放流，Pause暂停

### NetConnection Commands

- connect:用于客户端向服务器发送连接请求
- Call:用于在对端执行某函数，即常说的RPC：远程进程调用
- Create Stream：创建传递具体信息的通道，从而可以在这个流中传递具体信息，传输信息单元为Chunk

### NetStream Commands

- Netstream建立在NetConnection之上，通过NetConnection的createStream命令创建，用于传输具体的音频、视频等信息。在传输层协议之上只能连接一个NetConnection，但一个NetConnection可以建立多个NetStream来建立不同的流通道传输数据
    - play
    - play2，**play2命令可以将当前正在播放的流切换到同样数据但不同比特率的流上，服务器端会维护多种比特率的文件来供客户端使用play2命令来切换**
    - deleteStream(删除流)：用于客户端告知服务器端本地的某个流对象已被删除，不需要再传输此路流
    - receiveAudio(接收音频)：通知服务器端该客户端是否要发送音频
    - receiveVideo(接收视频)：通知服务器端该客户端是否要发送视频
    - publish(推送数据)：由客户端向服务器发起请求推流到服务器
    - seek(定位流的位置)：定位到视频或音频的某个位置，以毫秒为单位
    - pause（暂停）：客户端告知服务端停止或恢复播放