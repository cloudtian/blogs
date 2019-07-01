### npm-shrinkwrap
锁定发行的依赖版本。

`npm shrinkwrap`

此命令将`package-lock.json`重新定义为可发行的`npm-shrinkwrap.json`或者干脆创建一个新的。这个文件通过该命令创建并更新并且将优先于任何其他已存在或未来的`package-lock.json`文件。

### npm-shrinkwrap.json
可发行的锁文件

`npm-shrinkwrap.json`是通过`npm shrinkwrap`创建出来的。和`package-lock.json`相同，有一个重要的警告：不像`package-lock.json`,`npm-shrinkwrap.json`会包含在包发行的内容之内。

当应用程序需要通过发布程序到源上进行部署的时候，强烈建议使用`npm-shrinkwrap.json`。例如，守护进程和命令行工具作为全局安装或开发依赖是。强烈建议库发行者发布此文件，因为这将阻止终端用户控制传递依赖项更新。

除此之外，如果`package-lock.json`和`npm-shrinkwrap.json`出现在包的根目录里面，`package-lock.json`会被忽视。