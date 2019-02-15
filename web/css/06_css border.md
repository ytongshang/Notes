# 边界

## 常用属性

- border设定四个边的样式
- border-top, border-right, border-bottom, border-left: 设置边界一侧的宽度，样式和颜色。
- border-width, border-style, border-color: 设置边界宽度、样式或颜色，但是会设置边界的四个边。
- 您还可以单独三个属性中的一个并且设置其中一侧边界生效。border-top-width, border-top-style, border-top-color等

```css
p {
  padding: 10px;
  background: yellow;
  border: 2px solid red;
}
```

## border-radius

- **创建椭圆形角（x半径与y半径不同）。两个不同的半径用正斜杠（/）分隔**

```css
border-radius: 20px;

/* 1st value is top left and bottom right corners,
   2nd value is top right and bottom left  */
border-radius: 20px 10px;

/* 1st value is top left corner, 2nd value is top right
   and bottom left, 3rd value is bottom right  */
border-radius: 20px 10px 50px;

/* top left, top right, bottom right, bottom left */
border-radius: 20px 10px 50px 0;

/*border radius为椭圆形角*/
border-radius: 10px / 20px;
border-radius: 10px 30px / 20px 40px;
```

- 分别设置框的每个角的边界半径
    - border-top-left-radius
    - border-top-right-radius
    - border-bottom-left-radius
    - border-bottom-right-radius