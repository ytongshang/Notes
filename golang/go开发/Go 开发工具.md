# Go 开发工具

## Godoc

- 启动godoc服务器

```bash
godoc -http=:6060

http://localhost:6060
```

- 文档里显示代码调用示例
    - 示例代码必须单独存放在一个文件中，**文件名必须以_test.go结尾，比如chapter01_test.go**
    - 在这个go文件里，**定义一个名字为Example的函数，参数为空**
    - 示例的输出采用注释的方式，以//Output:开头，另起一行，每行输出占一行。

```goalng
package lib
import "fmt"
func Example() {
    sum:=Add(1,2)
    fmt.Println("1+2=",sum)
    //Output:
    //1+2=3
}
```

## Go命令行

- [Go开发工具](http://www.flysnow.org/2017/03/08/go-in-action-go-tools.html)
- 查看某个命令的用法

```bash
## 查看go build的用法
go help build
```

### go build

- 常见用法

```bash
## 当前目录
go build

## 当前目录
go build .

## 具体文件
go build hello.go

## 具体包
go build flysnow.org/tools

## 3个点表示匹配所有字符串
## go build就会编译tools目录下的所有包
go build flysnow.org/tools/...
```

- [Go环境变量](https://golang.org/doc/install/source#environment)
- GOOS指的是目标操作系统
    - darwin
    - freebsd
    - linux
    - windows
    - android
    - dragonfly
    - netbsd
    - openbsd
    - plan9
    - solaris
- GOARCH指的是目标处理器的架构
    - arm
    - arm64
    - 386
    - amd64
    - ppc64
    - ppc64le
    - mips64
    - mips64le
    - s390x

```bash
## 生成linux amd64位系统的程序
## 前面两个赋值，是更改环境变量，只针对本次运行有效，不会更改我们默认的配置
GOOS=linux GOARCH=amd64 go build flysnow.org/hello
```

## go get

- 下载更新指定的包以及依赖的包，并对它们进行编译和安装

```bash
## 下载指定包
go get github.com/spf13/cobra

# -u 的下载或更新指定的包
go get -u github.com/spf13/cobra

# -v表示显示下载的进度以及更多的调试信息
go get -u github.com/spf13/cobra
```

## 其它常见命令

```bash
## 手动删除生成的文件
go clean

## 运行main.go，参数为12
go run main.go 12

## 查看环境变量
go env

## 生成到gopath/bin目录下
go install

## 格式式
go fmt

## 检查一些小的语法错误，比较有限
go vet

## go的测试
## 具体的ide中可以使用具体的插件 golang->右键->go to -> test
go test
```