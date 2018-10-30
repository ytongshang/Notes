# CMAKE

- [CMake入门实战](http://www.hahack.com/codes/cmake/)
- [CMake Commands](https://cmake.org/cmake/help/latest/manual/cmake-commands.7.html)

## 总结

- CMakeLists.txt 的语法比较简单，由命令、注释和空格组成
- 其中命令是不区分大小写的
- 符号 # 后面的内容被认为是注释
- 命令由命令名称、小括号和参数组成，**参数之间使用空格进行间隔**

## 单个文件

```cmake
# CMake 最低版本号要求
cmake_minimum_required (VERSION 2.8)

# 项目信息
project (Demo1)

# 指定生成目标
add_executable(Demo main.cc)
```

## 多个文件

- **多个源文件以空格隔开，作为命令的参数**

```cmake
# CMake 最低版本号要求
cmake_minimum_required (VERSION 2.8)
# 项目信息
project (Demo2)
# 指定生成目标
add_executable(Demo main.cc MathFunctions.cc)
```

### aux_source_directory

- 使用 aux_source_directory 命令，该命令会查找指定目录下的所有源文件，然后将结果存进指定变量名
- **变量值的引用使用${变量名}**

```cmake
aux_source_directory(<dir> <variable>)
```

```cmake
# CMake 最低版本号要求
cmake_minimum_required (VERSION 2.8)

# 项目信息
project (Demo2)

# 查找当前目录下的所有源文件
# 并将名称保存到 DIR_SRCS 变量
aux_source_directory(. DIR_SRCS)

# 指定生成目标
add_executable(Demo ${DIR_SRCS})
```

## 多个目录，多个源文件

```cmake
./Demo3
    |
    +--- main.cc
    |
    +--- math/
          |
          +--- MathFunctions.cc
          |
          +--- MathFunctions.h
```

- 需要分别在项目根目录 Demo3 和 math 目录里各编写一个 CMakeLists.txt 文件。
- 将 math 目录里的文件编译成静态库再由 main 函数调用
- 根目录Demo3**使用命令 add_subdirectory 指明本项目包含一个子目录 math**，这样 math 目录下的 CMakeLists.txt 文件和源代码也会被处理,使用命令 target_link_libraries 指明可执行文件 main 需要连接一个名为 MathFunctions 的链接库

```cmake
# CMake 最低版本号要求
cmake_minimum_required (VERSION 2.8)

# 项目信息
project (Demo3)

# 查找当前目录下的所有源文件
# 并将名称保存到 DIR_SRCS 变量
aux_source_directory(. DIR_SRCS)

# 添加 math 子目录
add_subdirectory(math)

# 指定生成目标
add_executable(Demo main.cc)

# 添加链接库
target_link_libraries(Demo MathFunctions)

```

- math目录，使用add_library生成静态链接库

```cmake
# 查找当前目录下的所有源文件
# 并将名称保存到 DIR_LIB_SRCS 变量
aux_source_directory(. DIR_LIB_SRCS)

# 生成链接库
add_library (MathFunctions ${DIR_LIB_SRCS})
```