* 基本命令
  1. more [-dlfpcsu ] [-num ] [+/ pattern] [+ linenum] [file ... ]
  2. more命令和cat的功能一样都是查看文件里的内容，但有所不同的是more可以按页来查看文件的内容，
  还支持直接跳转行等功能

* 命令参数
  1. +n 从笫n行开始显示
  2. -n 定义屏幕大小为n行
  3. +/pattern 在每个档案显示前搜寻该字串（pattern），然后从该字串前两行之后开始显示  
  4. -c 从顶部清屏，然后显示
  5. -d 提示“Press space to continue，’q’ to quit（按空格键继续，按q键退出）”，禁用响铃功能
  6. -l 忽略Ctrl+l（换页）字符
  7. -p 通过清除窗口而不是滚屏来对文件进行换页，与-c选项相似
  8. -s 把连续的多个空行显示为一行
  9. -u 把文件内容中的下画线去掉

* 常用操作命令
  1. Enter    向下n行，需要定义。默认为1行
  2. Ctrl+F   向下滚动一屏
  3. 空格键  向下滚动一屏
  4. Ctrl+B  返回上一屏
  5. =       输出当前行的行号
  6. ：f     输出文件名和当前行的行号
  7. V      调用vi编辑器
  8. !命令   调用Shell，并执行命令
  9. q       退出more


* 命令示例
1. 从第三行显示内容
```
more +3 test.log
```

2. 从文件中查找第一个出现"day3"字符串的行，并从该处前两行开始显示输出
```
more +/day3 test.log
```

3. 每屏显示5行
```
more -5 test.log
```

4. 列一个目录下的文件，由于内容太多，我们应该学会用more来分页显示。这得和管道 | 结合起来,每页
显示5个文件信息，按 Ctrl+F 或者 空格键 将会显示下5条文件信息。
```
ls -l  | more -5
```