### HTTP 协议发展
- HTTP0.9 (1991年) 只支持get方法不支持请求头
- HTTP1.0 (1996年) 基本成型，支持请求头，富文本，状态码，缓存，连接无法复用
- HTTP1.1 (1997年) 支持连接复用，分块发送，断点续传
- HTTP2.0 (2015年) 二进制分帧传输，多路复用，头部压缩，服务器推送等
- HTTP3.0 (2018年) QUIC与2013年实现，2018年10月，IETF的HTTP工作组和QUIC工作组共同决定将QUIC上的HTTP映射称为HTTP/3，一以提前使其称为全球标准


### HTTP0.9版本
#### 请求方法
只支持GET请求，不支持其他请求方式。因此客户端向服务端传输信息量非常有限，也就是现在常用的POST请求无法使用
#### 请求头header
不能在请求中指定版本号，服务端只具有返回HTML字符串的能力
#### 响应即关闭
服务端响应之后，立即关闭TCP连接


### HTTP1.0版本
#### 请求方法
新增了POST,DELETE,PUT,HEADER等方式，提高了客户端向服务端发送信息的量级
#### 请求头和响应头
添加了请求头和响应头的概念，可以在通信中指定HTTP协议版本号，以及其他header信息，使得C/S交互更加灵活方便
#### 数据传输内容
扩充了传输内容格式包括：图片，音视频资源，二进制等都可进行传输，相比0.9的只能传输html内容让http的应用场景更多
#### 缺点：
- 连接复用性差
- 无状态


### HTTP1.1版本
#### 长连接支持
新增Connection字段可设置keep-alive值保持连接不断开。（但仍然存在队头阻塞问题，服务端只有处理一个回应才会进行下一个回应）
#### 管道化
在长连接的基础上，管道化可以不等第一个请求响应继续发送后面的请求，但响应的顺序还是按照请求的顺序返回。即在同一个TCP连接中，客户端可以同时发送多个请求，进一步改进HTTP协议的传输效率。
#### 请求方法
新增PUT,OPTIONS等请求方法
#### host字段
Host字段用来指定服务器的域名，这样可以将多种请求发往同一台服务器上的不同网站，提高了服务器的复用。
#### 断点续传
支持请求头带Range和服务器响应Accept-Range


### HTTP2.0版本
#### 二进制分帧
1.x是文本协议，2.0是以二进制帧为基本单位，可以说是一个二进制协议。将所有传输的消息分割为消息和帧，并采用二进制格式的编码，帧中包含数据和标识符，使得网络传输变得高效而灵活。
#### 多路复用
1.x中建立多个连接的消耗以及效率都存在问题，2.0版本的多路复用多个请求共用一个连接，多个请求可以同时在一个TCP连接上并发，主要借助于二进制帧中的标识进行区分实现链路的复用。
#### 首部压缩
使用Hpack算法对头部header数据进行压缩，从而减少请求的大小提高效率。  
维护一份相同的静态字典，包含常见的头部名称，以及特别常见的头部名称与值的组合。静态字典就是把常用的头部映射为字节较短的索引序号。  
维护一份相同的动态字典，可以动态添加内容，支持基于静态哈夫曼码表的哈夫曼编码。动态字典的生成过程其实就是通知对方添加映射。
#### 流控
利用流来实现多路复用，这引入了对TCP连接的使用争夺，会造成流被阻塞。流量控制方案确保在同一连接上的多个流之间不会造成破坏性的干扰。流量控制会用于各个独立的流，也会用于整个连接。
#### 服务端推送
1.x之前服务端都是收到请求后被动执行，在2.0版本允许服务器主动向客户端发送资源，这样在客户端可以起到加速的作用。
#### 缺陷
- 建立连接时间长（本质是TCP的问题）
- 队头阻塞问题
- 移动互联网领域表现不佳（弱网环境）

### HTTP3.0版本
#### 无队头阻塞
HTTP2在一个TCP连接上同时发送4个Stream。其中Stream1已经正确到达，冰杯应用层读取。但是Stream2的第3个tcp segment丢失了，TCP为了保证数据的可靠性，需要发送端传第3个segment才能通知应用层读取接下去的数据，虽然这个时候Stream3和Stream4的全部数据已经到达了接收端，但都被阻塞住了。  
不仅如此，由于HTTP2强制使用TLS，还存在一个TLS协议层面的队头阻塞。Record是TLS协议处理的最小单元，最大不能超过16K，一些服务器比如Nginx默认的大小就是16K，由于一个Record必须经过数据一致性校验才能进行加解密，所以一个16K的record，就算丢了一个字节，也会导致已经接收到的15.99K数据无法处理，因为它不完整。  
quic最基本的传输单元是Packet，不会超过MTU的大小，整个加密和认证都是基于Packet的，不会跨越多个Packet。这样就能避免TLS协议存在的队头阻塞。Stream之间相互独立，比如Stream2丢了一个Packet，不会影响Stream3和Stream4。不存在TCP队头阻塞。
#### 连接迁移
连接迁移业务不中断的条件
#### 低连接延迟
自定义拥塞控制