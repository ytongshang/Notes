# background

## background-color

- 设置背景颜色作为后备也是很重要的

## background-image

### url()指定图片背景

```css
p {
    background-color : yellow;
    background-image: url(https://mdn.mozillademos.org/files/13026/fire-ball-icon.png);
}
```

### 渐变

- [【CSS】渐变背景（background-image）](https://www.jianshu.com/p/58b340a037ea)

## background-repeat

- no-repeat
- repeat-x
- repeat-y
- repeat

## background-position

- 允许我们在背景中任意位置放置背景图像。通常，该属性将使用两个通过空格分隔的值，该空间指定了图像的水平(x)和垂直(y)坐标。
- **图像的左上角是原点(0,0)。把背景想象成一个图形，x坐标从左到右，y坐标从上到下**
- 可取值
    - px绝对值
    - rems相对值
    - 百分比， background-position:90% 25%
    - 关键字：left,center,right, top,center,bottom
- 可以混用值 background-position:99% center
- **如果只指定一个值，假定为水平值，垂直默认为center**

## background-attachment

- scroll: 会使元素的背景在页面滚动时滚动
- fixed: 会使元素的背景相对于视口固定
- local: local 值将背景设置为它所设置的元素的背景，因此当您滚动元素时，背景会随之滚动

## background-size

- 指定背景尺寸

```css
backgrond-size:16px 16px;
```

## 多个背景

- 可以指定多个背景

```css
background-image: url(image.png), url(background-tile.png);
background-repeat: no-repeat, repeat;
```

```css
div {
/*同时指定多个背景*/
background: url(image.png) no-repeat 99% center,
            url(background-tile.png),
            linear-gradient(to bottom, yellow, #dddd00 50%, orange);
background-color: yellow;
}
```