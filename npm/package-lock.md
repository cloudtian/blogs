### npm-package-locks
npm锁文件的说明

从概念上讲，`package.json`是作为`npm install`的输入，那么输入则是一个格式化的`node_modules`依赖树: _一种对你声明的依赖的表现形式_ 。理想情况下，npm应该像存函数那样，在任何时候，相同的`package.json`应该生成完全一样的`node_modules`依赖树。某些情况下，这是可以的，但是其他更多的情况下，npm做不到这样，主要有以下多个原因：
- 不同版本的npm（或其他包管理器）都曾安装过一个包，每种采用的安装算法稍微不同。
- 在你上一次安装过某个`semver-range`表示的包版本号之后该包的新版本又发布了，这样就会使用更新的版本。
- 某个依赖包可能发布了新的版本，即使使用特别的依赖说明符也会被更新。（使用`1.2.3`代替`^1.2.3`）
- 安装包的源地址不再可用，或允许版本突变(不像npm主源地址)，同一个版本号下存在不同版本的包。

例如，package A:  
```javascript
{
    "name": "A",
    "version": "0.1.0",
    "dependencies": {
        "B": "<0.1.0"
    }
}
```
package B:
```javascript
{
    "name": "B",
    "version": "0.0.1",
    "dependencies": {
        "C": "<0.1.0"
    }
}
```
package C:
```javascript
{
    "name": "c",
    "version": "0.0.1"
}
```
如果源地址中只有A,B,C包的唯一版本可用，那么一个正常的`npm install A`会安装
```
A@0.1.0
`-- B@0.0.1
    `-- C@0.0.1
```
然而，如果`B@0.0.2`被发布后，`npm install A`会安装
```
A@0.1.0
`-- B@0.0.2
    `-- C@0.0.1
```
假设新版本没有修改B的依赖。当然，B的新版本可能包含一个新版本的C或者其他新依赖。如果这种改动是不合理的，A包的作者可以指定依赖于`B@0.0.1`。然而A的作者和B的作者不是同一个人，A的作者没有途径去声明当B没有更新时他也不需要更新C的依赖。

为了预防这种潜在的问题，npm使用了`package-lock.json`或者,如果存在`npm-shrinkwrap.json`，这些文件叫做包的锁，或者锁文件。

无论何时你运行`npm install`，npm生成或更新锁文件，看起来像这样：
```javascript
{
  "name": "A",
  "version": "0.1.0",
  ...metadata fields...
  "dependencies": {
    "B": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/B/-/B-0.0.1.tgz",
      "integrity": "sha512-DeAdb33F+"
      "dependencies": {
        "C": {
          "version": "git://github.com/org/C.git#5c380ae319fc4efe9e7f2d9c78b0faa588fd99b4"
        }
      }
    }
  }
}
```
这个文件描述了一个精确的，更重要的是可复制的`node_modules`依赖树。一旦生成该文件，以后的任何安装都将以这个文件为基础，而不是根据`package.json`重新计算依赖版本。

锁文件的出现改变了安装依赖的行为：
- 锁文件描述的树模块是可复制的。这意味着可以复制文件中描述的结构，如果可用，使用“resolved”中引用的特定文件，如果不可用，则使用“version”恢复到正常的包解析。
- 依赖树可以遍历，能够以通常的方式安装任何缺少的依赖项。

如果`package.json`的script属性中包含`preshrinkwrap`,`shrinkwrap`或者`postshrinkwrap`，他们会按序执行。`preshrinkwrap`和`shrinkwrap`会压缩包之前执行，`postshrinkwrap`会在之后执行。这些脚本运行在两个锁文件`package-lock.json`和`npm-shrinkwrap.json`中。例如对于一些生成后的文件进行后加工。
```javascript
"scripts": {
  "postshrinkwrap": "json -I -e \"this.myMetadata = $MY_APP_METADATA\""
}
```

**使用被锁定的包**
使用一个被锁定的包与一个没有锁文件的包是不同的：任何更新`node_modules`或`package.json`依赖的命令会自动同步已存在的锁文件。包括`npm install`,`npm rm`, `npm update`等等。可以通过使用`--no-save`选项来阻止一同更新。或使用`--no-shrinkwrap`允许`package.json`更新而`package-lock.json`或`npm-shrinkwrap.json`不变。

强烈推荐你提交生成的锁文件来控制版本，这会让你团队中的其他人，部署，持续集成，或其他通过`npm install`来获取包依赖的人能够得到与你开发相同的依赖包。除此之外，这些变动是可读的，而且当npm对你的`node_modules`包做任何修改的时候会通知你，因此你可以注意到是否有传递依赖关系被更新了等等。

**解决锁文件冲突**
有时候，两个独立的npm安装生成的锁文件在源代码控制系统中会导致合并冲突。`npm@5.7.0`之后的版本，这些冲突可以通过手动处理`package.json`的冲突，然后再运行`npm install [--package-lock-only]`来解决。npm会自动解决任何冲突并且输出一个合理的包含所有分支依赖树的合并后的锁文件，如果提供了`--package-lock-only`，这将不会修改本地的`node_modules/`。

为了使这个过程在git上无缝结合，可以考虑安装`npm-merge-driver`，这会告诉git在没有用户交互的情况下如何操作。更简单的是`npx npm-merge-driver install -g`就可以了，甚至可以运行在`npm@5.7.0`版本之前的npm 5，虽然有一些麻烦。如果`package.json`文件本身冲突了，你必须手动解决这个问题，并手动运行`npm install`，即使使用合并驱动程序也是如此。