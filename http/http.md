通过百度抓包来分析请求头和响应头各个字段的含义。

### General
Request URL: https://www.baidu.com/
> 请求资源的url地址
Request Method: GET
> 请求方法：GET
Status Code: 200 OK
> 请求状态码，200 ok证明请求成功
Remote Address: 220.181.38.150:443
> 远程服务器地址，url中域名（www.baidu.com）对应的IP地址，所以也可以通过https://220.181.38.150:443来访问
Referrer Policy: strict-origin-when-cross-origin
> Referrer 说明是从哪个页面发起改请求的
> Referrer Policy 控制请求头中Referrer的内容,取值有如下几种
> 'no-referrer', 'no-referrer-when-downgrade', 'same-origin', 'origin', 'strict-origin',
> 'origin-when-cross-origin', 'strict-origin-when-cross-origin', 'unsafe-url'


### Response Headers
Bdpagetype: 1
Bdqid: 0xaeb6301100162792
Cache-Control: private
> 告诉浏览器，什么环境可以安全地缓存文档
Connection: keep-alive
> 服务器和客户端通信时对于长连接如何进行处理
Content-Encoding: gzip
> 数据在传输过程中所使用的压缩编码方式
Content-Type: text/html;charset=utf-8
> 数据的类型
Date: Mon, 18 Oct 2021 02:24:30 GMT
> 数据从服务器发送的时间
Expires: Mon, 18 Oct 2021 02:24:07 GMT
> 文档过期时间
Server: BWS/1.1
> 服务器名字
Set-Cookie: BDSVRTM=0; path=/
Set-Cookie: BD_HOME=1; path=/
Set-Cookie: H_PS_PSSID=; path=/; domain=.baidu.com
> 设置和页面关联的cookie
Strict-Transport-Security: max-age=172800
Traceid: 1634523870046673997812589302657934829458
Transfer-Encoding: chunked
> 数据传输的方式
X-Frame-Options: sameorigin
X-Ua-Compatible: IE=Edge,chrome=1


### Request Headers
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
> 表示浏览器支持的MIME类型
Accept-Encoding: gzip, deflate, br
> 浏览器支持的压缩类型
Accept-Language: zh-CN,zh;q=0.9
> 浏览器支持的语言类型，并且优先支持靠前的语言类型，q表示优先级，取值0-1
Cache-Control: no-cache
> 指定请求和响应的缓存机制
Connection: keep-alive
> 浏览器与服务器通信时对于长连接如何处理
Cookie: BIDUPSID=E17D761CAA387FCE5307335EB2981D93; PSTM=1634523861; BAIDUID=E17D761CAA387FCE0ADC8A0E9784C36B:FG=1; BD_HOME=1; H_PS_PSSID=; BD_UPN=12314353; BA_HECTOR=a12k2584200h2h0ghb1gmpmmk0q
> Cookie，发送给服务器，这些cookie是之前服务器发送给浏览器的
Host: www.baidu.com
> 请求的主机域名地址
Pragma: no-cache
sec-ch-ua: "Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: none
Sec-Fetch-User: ?1
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36
> 客户端的一些相关信息，比如 操作系统，浏览器及版本，浏览器渲染引擎