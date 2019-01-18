## CSS网格布局
CSS网格布局使我们能够将网页分成具有简单属性的行和列。它还能使我们在不改变任何HTML的情况下，使用CSS来定位和调整网格内的每个元素。

### 网格容器
在元素上声明`display: grid`或`display: inline-grid`来创建一个网格容器。
这个元素的所有直系子元素都将成为网格元素。

### 网格轨道
定义网格的轨道，通过`grid-template-columns`和`grid-template-rows`属性来定义网格中的行和列。一个网格轨道就是网格中任意两条线之间的空间。

**fr单位**  
轨道可以使用任何长度单位进行定义。网格还新增了一个`fr`单位代表网格容器中可用空间的一等份，而且可用随着可用空间增长和收缩。

**repeat()**  
多轨道的大型网格可使用`repeat()`标记来重复部分或整个轨道列表。  
`grid-template-columns: 1fr 1fr 1fr;` =>  `grid-template-columns: repeat(3, 1fr);`

**隐式和显示网格**  
显式网格：包含了在`grid-template-columns`和`grid-template-rows`属性中定义的行和列。  
隐式网格：用`grid-template-columns`属性定义了列轨道，但是让网格按所需内容创建行，这些行会被创建在隐式网格中。

在隐式网格中用`grid-auto-rows`和`grid-auto-columns`属性来定义一个设置大小尺寸的轨道。
> `grid-auto-rows: 200px`可以设置隐式网格中轨道的高度是200px

`grid-auto-row`可以调整网格中隐式行的大小。网格也可以按列来自动定位项目，只需要设置`grid-auto-flow: column`。此时网格将根据以定义的`grid-template-rows`按列摆放项目。

创建没有缺口的布局：`grid-auto-flow: dense`，列优先流向：`griid-auto-flow: column dense`。

**轨道大小和minmax()**  
设置网格的最小尺寸或最大尺寸，可以设置`auto`自动变换。
> `grid-auto-rows: minmax(100px, auto)` 行的最小高度为100px，如果内容大小超过100px，那么行会根据内容大小自动变换：根据本行中最高的单元，把空间扩展到足够容纳该单元。

```css
.normal-grid {
    display: grid;   
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 50px;
}
```
```html
<div class="normal-grid">
    <div>One</div>
    <div>Two</div>
    <div>Three</div>
    <div>Four</div>
    <div>Five</div>
    <div>Six</div>
</div>
```
![normal-grid](https://github.com/cloudtian/blogs/blob/master/css-grid-layout/normal-grid.png)

### 网格线
构成网格结构的分界线，每行的行网格线(水平的)和每列的列网格线(垂直的)。网格线的编号顺序取决于文章的书写模式。 

**跨轨道放置网格元素**  
元素默认延伸一个轨道
- `grid-column-start`
- `grid-column-end`
  > 缩写 `grid-column`
- `grid-row-start` 
- `grid-row-end`
  > 缩写 `grid-row`
> 使元素跨越整个网格：`grid-column: 1 / -1`;

可以在`grid-row-start`/`grid-row-end` 和 `grid-column-start`/`grid-column-end` 属性中使用 `span` 关键字。`span`表示跨越轨道数量。

### 网格单元
网格单元是在一个网格元素中最小的单位。

### 网格区域
网格元素可以向行或着列的方向扩展一个或多个单元，并且会创建一个网格区域。

`grid-area` 属性可以把网格线的4个属性的合并（`块起始 / 行起始 / 块结束 / 行结束`）用于定位一个网格区域。
也可以给区域命名，然后在`grid-template-areas`属性中指定这个区域的位置。

```css
.header {
    grid-area: hd;
}
.footer {
    grid-area: ft;
}
.content {
    grid-area: main;
}
.sidebar {
    grid-area: sd;
}
.grid-area-named {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-auto-rows: minmax(100px, auto);
    grid-template-areas: 
    "hd hd hd hd   hd   hd   hd   hd   hd"
    "sd sd sd main main main main main main"
    "sd sd sd ft   ft   ft   ft   ft   ft"
}
```
```html
<div class="grid grid-area-named">
    <div class="grid-item header">Header</div>
    <div class="grid-item sidebar">Sidebar</div>
    <div class="grid-item content">Content</div>
    <div class="grid-item footer">Footer</div>
</div>
```
![area-named-grid](https://github.com/cloudtian/blogs/blob/master/css-grid-layout/area-named-grid.png)

### 网格间距
网格单元之间的间距，包括横向间距`grid-column-gap`和纵向间距`grid-row-gap`。两个属性合并缩写`grid-gap: grid-row-gap grid-column-gap`。如果只给出一个值，那么这个值会同时应用于行间距和列间距。

### 嵌套网格
一个网格元素也可以成为一个网格容器。

**子网格**  
在父级网格元素的轨道定义中就能定义一个嵌套网格。_子网格在浏览器中还未实现，并随时可能从规范中移除_

### 使用z-index控制层级
多个网格项目可以占用同一个网格单位。

**控制顺序**  
可以在网格项目发生重叠时使用z-index属性控制重叠的顺序。
