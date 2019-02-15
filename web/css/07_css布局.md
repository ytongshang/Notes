# CSS布局

## position

- [CSS position 相对定位和绝对定位](https://www.runoob.com/w3cnote/css-position-static-relative-absolute-fixed.html)

### static

- 对象遵循常规流。忽略 top, bottom, left, right 或者 z-index 声明

### relative

- 定位是相对于其正常位置进行定位
- **设置了relative的元素仍然处在文档流中，元素的宽高不变，设置偏移量也不会影响其他元素的位置。**
- **最外层容器设置为relative定位，在没有设置宽度的情况下，宽度是整个浏览器的宽度**

### absolute

- **设置了absolute的元素脱离了文档流,元素在没有设置宽度的情况下，宽度由元素里面的内容决定**。脱离后原来的位置相当于是空的，下面的元素会来占据位置
- **定位是相对于离元素最近的设置了绝对或相对定位的父元素决定的**，如果没有父元素设置绝对或相对定位，则元素相对于根元素即html元素定位。

### fixed

- 与absolute一致，但偏移定位是以窗口为参考。当出现滚动条时，对象不会随着滚动

### sticky

- 对象在常态时遵循常规流。
- 它就像是relative和fixed的合体，当在屏幕中时按常规流排版，当卷动到屏幕外时则表现如fixed。该属性的表现是现实中你见到的吸附效果。（CSS3）

### clip

- 依据上-右-下-左的顺序**提供相对自身左上角为(0,0)坐标计算的四个偏移数值**，其中任一数值都可用auto替换，即此边不剪切

## float

- [float](https://developer.mozilla.org/zh-CN/docs/CSS/float)

## flex

- [Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
