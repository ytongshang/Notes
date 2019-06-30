# Widget

## Widget与Element

-   **Widget实际上就是Element的配置数据，Widget树实际上是一个配置树，而真正的UI渲染树是由Element构成**；不过，由于Element是通过Widget生成，所以它们之间有对应关系，所以在大多数场景，我们可以宽泛地认为Widget树就是指UI控件树或UI渲染树。
-   一个Widget对象可以对应多个Element对象。这很好理解，根据同一份配置（Widget），可以创建多个实例（Element）

## StatefulWidget

-   一个Stateful widget同时插入到widget树的多个位置时，flutter会调用createState()方法为每一个位置生成一个独立的state对象，**本质上就是一个StatefulElement对应一个State实例**
-   **State中的widget成员对象，表示与state实际关联的widget实例，但这种关联并非永久的**，在应用的生命期中，UI树的某一个节点的widget实例在重新构建时可能会发生变化，但State实例只会在第一次插入到树中时被创建，当重新构建时，如果widget被修改了，Flutter framework会动态设置

### State的生命周期

-   initState,当state对象被插入widget树时调用，并且只会调用一次
-   didUpdateWidget，当widget配置发生变化，**此时widget在树中会被替换，但是state对象是不会的**
-   reassemble，测试使用
-   deactivate,当state对象从widget树中被移除时，会回调这个函数，有些场景下，state对象会被从widget树的一个位置，移动到另外的一个位置，如果没有重新被插入树中会调用dispose方法
-   dispose，state对象被永久移除时，在这里释放资源
-   didChangeDependencies，当这个State的依赖发生变化时
-   setState，通知对象的内部状态发生了改变，可能用户界面发生改变，从而调用build方法
-   build,以下场景会被调用
    -   initState
    -   didUpdateWidget
    -   setState
    -   didChangeDependencies
    -  从widget一个位置移动到另一个位置，当然也会先调用deacctivate

### 状态管理

-   状态管理方式

    -  Widget管理自己的state
    -   父widget管理子widget状态
    -   混合管理(父widget和子widget都管理状态)

-   选择状态管理方式
    -   如果状态是用户数据，如复选框的选中状态、滑块的位置，则该状态最好由父widget管理。
    -   如果状态是有关界面外观效果的，例如颜色、动画，那么状态最好由widget本身来管理。
    -   如果某一个状态是不同widget共享的则最好由它们共同的父widget管理。

### 全局状态管理

-   **实现全局的事件总线**，在initState方法中订阅事件，当接受到事件时，重新build一下
-   使用reduc这样的全局状态包
