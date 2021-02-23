## 跨站脚本攻击XSS

> Cross Site Scripting，缩写XSS（为了不和层叠样式表Cascading Style Sheets，CSS的缩写混淆，所以缩写为XSS） 跨站脚本是一种网站应用程序的安全漏洞攻击，是代码注入的一种。它允许恶意用户将代码注入到网页上，其他用户在观看网页时就会受到影响。这类攻击通常包含了HTML以及用户端脚本语言。

XSS的实质其实是HTML代码与JavaScript代码的注入。  
跨站脚本攻击是指恶意攻击者往Web页面里插入恶意JavaScript代码，当用户浏览该页面时，嵌入在其中的代码会被执行，从而达到恶意攻击用户的目的。

- 反射型XSS  
  反射型XSS也被称为非持久化性XSS。需要欺骗用户自己去点击链接才能触发XSS代码，（服务器中没有这样的页面和内容），一般容易出现在搜索页面。  
  是现在最容易出现的一种XSS漏洞。当用户访问一个带有XSS代码的URL请求时，服务器端接收数据后处理，然后把带有XSS代码的数据发送到浏览器，浏览器解析这段带有XSS代码的数据，最终造成XSS漏洞。

  当一个网站的代码中包含类似下面的语句：
  `<?php echo $_GET['keyword']; ?> `
  那么在访问时设置 `/?keyword=<script>alert(document.cookie)</script>`，则可执行预设好的JavaScript代码，获取cookie。

  
  ```
  用户输入带有参数的URL --> 
  JavaScript处理URL并获取参数 --> 
  通过DOM调用参数对页面进行排版 --> 
  通过DOM动态输出到页面上
  ```


- 存储型XSS  
  存储型XSS又被称为持久化性XSS。代码是存储在服务器中的，如在个人信息或发表文章等地方，加入代码，如果没有过滤或过滤不严，那么这些代码将存储在服务器中，用户访问该页面的时候触发代码执行。这种XSS比较危险，容易造成蠕虫，盗窃cookies。

  ```
  用户输入带有参数的URL或BODY域数据 -->   
  服务器将参数存入数据库 -->   
  通过JSON格式返回参数到页面 --> 
  通过DOM调用参数进行排版 -->  
  通过DOM动态输出到页面上
  ```

- DOM型XSS  
  DOM型XSS的不同之处在于DOM型XSS一般和服务器的解析响应没有直接关系，而是在JavaScript脚本动态执行的过程中产生的。

  ```
  <html>
    <head>
        <script>
            function xsstest () {
                var str = document.getElementById('input').value;
                var text =  "<img src='" + str + "'></img>";
                document.getElementById('output').innerHTML = text;
            
            }
        </script>
    </head>
    <body>
        <div id="output"></div>
        <input type="text" value="" id="input" size="50"/>
        <input type="button" value=submit onclick="xsstest()" /> 
    </body>
  </html>
  输入 x' onerror='javascript:alert(/xss/) 即可触发XSS。
  ```

危害  
- 网络钓鱼，包括盗取各类用户账号
- 窃取用户cookie信息，从而获取用户隐私信息，或利用用户身份进一步对网站执行恶意操作
- 劫持用户（浏览器）会话，从而执行任意操作，例如进行非法转账，强制发表日志，发送电子邮件等
- 强制弹出广告页面，刷流量等
- 网页挂马
- 进行恶意操作，例如任意篡改页面信息，删除文章等
- 进行大量的客户端攻击，如DDOS攻击
- 获取客户端信息，例如用户的浏览历史，真实ip，开放端口等
- 控制受害者机器向其他网站发起攻击
- 结合其他漏洞进一步扩大攻击
- 提升用户权限，包括进一步渗透网站
- 传播XSS跨站脚本蠕虫等
- ......



XSS修复
- 不含有富文本编辑器（自定义样式）且没有使用DOM的站点：  
   输入：过滤双引号，单引号，左右尖括号，分号  
   输出：对上述字符进行HTML实体编码即可。

- 不含有富文本编辑器但使用DOM的站点  
  输入：在DOM中转义双引号，单引号，左右尖括号，分号  
  输出：在输出之前进行编码，如： innerHTML=encodeHTML(output)。


- 含有富文本编辑器但没有使用DOM的站点  
  输入：过滤双引号，单引号，分号  
  输出：对上述字符进行HTML实体编码即可。

- 不含有富文本编辑器但使用DOM的站点  
  指哪儿修哪儿

  