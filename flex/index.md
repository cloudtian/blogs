## Flex弹性布局

### 属性
Flex容器属性：`flex-direction`,`flex-wrap`,`flex-flow`,`justify-content`,`align-items`,`align-content`  
flex元素属性：`flex-grow`,`flex-shrink`,`flex-basis`,`flex,order`,`align-self`


### 主轴和交叉轴
主轴由`flex-direction`定义，另一根轴垂直于它。

`flex-direction`取值：
- row(默认值)
- row-reverse
- column
- column-reverse

### 起始线和终止线
用起始和终止来描述文档的书写模式，比左右更合适。  
### Flex容器
设置`display: flex` 或者 `display: inline-flex`。容器中的直系子元素就会变为flex元素。
- 元素排列为一行(flex-direction初始值为row)
- 元素从主轴的起始线开始
- 元素不会在主维度方向拉伸，但是可以缩小
- 元素被拉伸来填充交叉轴大小
- flex-basis属性为auto
- flex-wrap属性为nowrap

### 用flex-wrap实现多行Flex容器
`flex-wrap`取值：
- nowrap(默认值) 不换行
- wrap 换行，第一行在最上方
- wrap-reverse 换行，第一行在最下方

### 简写属性flex-flow
`flex-direction`和`flex-wrap`组合为简写属性`flex-flow`。

### flex元素上的属性
- `flex-basis`: 默认`auto`   
   定义了该元素的 __布局空白(available space)__ 的基准值。
  > 如果元素设定了宽度为100px,则`flex-basis`的值为100px。如果没有给元素设定尺寸`flex-basis`的值采用元素内容的尺寸。
- `flex-grow`: 默认`0`   
   处理flex元素在主轴上增加空间的问题。按比例分配空间。若被赋值为一个正整数，flex元素会以`flex-basis`为基础，沿主轴方向增长尺寸。
  > 如果所有元素设定`flex-grow`为1，容器中的布局空白被这些元素平分。如果容器中有三个子元素，第一个元素`flex-grow`值为2，其他元素值为1，那么第一个元素占有2/4，另外两个元素占1/4。
- `flex-shrink`: 默认`1`    
  处理flex元素在主轴上收缩的问题。可以把flex元素flex-shrink属性设置为正整数来缩小它所占空间到flex-basis以下。

Flex属性的简写: flex-grow, flex-shrink, flex-basis  
- flex: initial   
  把flex元素重置为Flexbox的初始值。相当于flex: 0 1 auto。
- flex: auto  
  等同于flex: 1 1 auto。flex元素在需要的时候既可以拉伸也可以收缩。
- flex: none   
  把flex元素设置为不可伸缩。flex: 0 0 auto。
- flex: `<positive-number>`   
  flex: 1 或者 flex: 2等相当于flex: 1 1 0。元素可以在flex-basis为0的基础上伸缩。

### 元素间的对齐和空间分配
`align-items`属性可以使元素在交叉轴方向对齐。  
`align-items`取值：
- stretch(默认值)  
  如果项目未设置高度或设置auto,则占满整个容器的高度。
- flex-start   
  使flex元素按flex容器的顶部对齐
- flex-end  
  使flex元素按flex容器的下部对齐
- center  
  使flex元素居中对齐
- baseline  
  项目中第一行文字的基线对齐

`justify-content`属性用来使元素在主轴方向上对齐。
`justify-content`取值：
- flex-start(默认值)  
  元素从容器的起始线排列
- flex-end  
  元素从容器的终止线排列
- center  
  元素在容器中间排列
- space-between  
  把元素排列好之后的剩余空间拿出来，平均分配到元素之间，所以元素之间间隔相等。（两端对齐，项目之间间隔相等）
- space-around  
  使每个元素的左右空间相等。（每个项目两侧间隔相同，所以每个项目之间间隔比项目与边框大一倍）

`align-content`属性定义多根轴线的对齐方法。如果项目中只有一根轴线，该属性不起作用。
- stretch(默认值)
- flex-start
- flex-end
- center
- space-between
- space-around

`order`属性规定了弹性容器中的可伸缩项目在布局时的顺序。元素按照`order`属性的值的增序进行布局。拥有相同 order 属性值的元素按照它们在源代码中出现的顺序进行布局。__数值越小越靠前，默认值为`0`。__

`align-self`会对齐当前flex行中的flex元素，并覆盖`align-items`的值。如果任何flex元素的侧轴方向margin值设置为auto,则会忽略`align-self`。
- auto(默认值) 继承父元素的`align-items`属性，如果没有父元素则设置为`stretch`。
- 其余取值与`align-items`属性完全一致。