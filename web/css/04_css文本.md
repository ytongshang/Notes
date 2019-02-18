# CSS 文本

- [字体样式](#字体样式)
  - [color](#color)
  - [font-family](#font-family)
    - [字体栈](#字体栈)
  - [font-size](#font-size)
    - [简单的 size 示例](#简单的-size-示例)
  - [font-style](#font-style)
  - [font-weight](#font-weight)
  - [text-transform](#text-transform)
  - [text-decoration](#text-decoration)
  - [text-shadow](#text-shadow)
  - [text-align](#text-align)
  - [line-height](#line-height)
  - [letter-spacing 与 word-spacing](#letter-spacing-与-word-spacing)
  - [其它属性](#其它属性)
  - [font](#font)

## 字体样式

### color

### font-family

- 浏览器只会把在当前机器上可用的字体应用到当前正在访问的网站上；**如果字体不可用，那么就会用浏览器默认的字体代替 default font.**

#### 字体栈

- 由于你无法保证你想在你的网页上使用的字体的可用性 (甚至一个网络字体可能由于某些原因而出错), 你可以提供一个字体栈 (font stack)，这样的话，浏览器就有多种字体可以选择了
- **在字体栈的最后提供一个合适的通用的字体名称是个不错的办法**
- **有一些字体名称不止一个单词，比如 Trebuchet MS ，那么就需要用引号包裹**

```css
p {
  font-family: 'Trebuchet MS', Verdana, sans-serif;
}
```

### font-size

- font-size
- 单位
  - px
  - em,**1em 等于我们设计的当前元素的父元素上设置的字体大小**
  - rem,这个单位的效果和 ems 差不多，除了 **1rem 等于 HTML 中的根元素的字体大小**,(i.e. html) ，而不是父元素
- 元素的 font-size 属性是从该元素的父元素继承的,所以这一切都是从整个文档的根元素（html）开始
- 浏览器的 font-size 标准设置的值为 16px

#### 简单的 size 示例

- 将 html 中 font-size 设置 10px,方便计算
- 在样式表的指定区域列出所有 font-size 的规则集是一个好主意，这样它们就可以很容易被找到

```css
html {
  font-size: 10px;
}

h1 {
  font-size: 2.6rem;
}

p {
  font-size: 1.4rem;
  color: red;
  font-family: Helvetica, Arial, sans-serif;
}
```

### font-style

- normal
- italic
- oblique:文本设置为斜体字体的模拟版本，也就是将普通文本倾斜的样式应用到文本中

### font-weight

- normal
- bold
- lighter,bolder,将当前元素的粗体设置为比其父元素粗体更细或更粗一步。100–900: 数值粗体值，如果需要，可提供比上述关键字更精细的粒度控制

### text-transform

- none
- uppercase
- lowercase
- capitalize:转换所有单词让其首字母大写
- full-width: 将所有字形转换成固定宽度的正方形，类似于等宽字体，允许对齐。拉丁字符以及亚洲语言字形（如中文，日文，韩文）

### text-decoration

- none
- overline
- line-through
- underline
- **text-decoration 可以一次接受多个值**
- **同时注意 text-decoration 是一个缩写形式**，它由 text-decoration-line, text-decoration-style 和 text-decoration-color 构成

```css
.text {
  text-decoration: underline, overline;
}
```

### text-shadow

```css
text-shadow: 4px 4px 5px red;
```

- 参数
  - 阴影与原始文本的水平偏移
  - 阴影与原始文本的垂直偏移;效果基本上就像水平偏移，除了它向上/向下移动阴影，而不是左/右。这个值必须指定
  - 模糊半径 - 更高的值意味着阴影分散得更广泛。如果不包含此值，则默认为 0，这意味着没有模糊
  - 阴影的基础颜色
- **正偏移值可以向右移动阴影，但也可以使用负偏移值来向左移动阴影**
- **可以通过包含以逗号分隔的多个阴影值，将多个阴影应用于同一文本**

```css
text-shadow: -1px -1px 1px #aaa, 0px 4px 1px rgba(0, 0, 0, 0.5),
  4px 4px 5px rgba(0, 0, 0, 0.7), 0px 0px 7px rgba(0, 0, 0, 0.4);
```

### text-align

- left
- right
- center
- justify,使文本展开，改变单词之间的差距，使所有文本行的宽度相同,如果你要使用这个，你也应该考虑一起使用别的东西，比如 hyphens，打破一些更长的词语

### line-height

- 接受普通的长度单位
- 也接受无单位的值，作为乘数，**无单位的值乘以 font-size 来获得 line-height**
- 推荐的行高大约是 1.5–2

```css
line-height: 1.5;
```

### letter-spacing 与 word-spacing

### 其它属性

### font

- 许多字体的属性也可以通过 font 的简写方式来设置 . **这些是按照以下顺序来写的： font-style, font-variant, font-weight, font-stretch, font-size, line-height, and font-family**
- **只有 font-size 和 font-family 是一定要指定的**
- **font-size 和 line-height 属性之间必须放一个正斜杠**

```css
font: italic normal bold normal 3em/1.5 Helvetica, Arial, sans-serif;
```
