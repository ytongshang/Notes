#### 常用命令
* 查看命令
```
man man
```

* echo,echo命令用于在终端显示字符串或变量，格式为：**echo [字符串 | 变量]**
```
echo hello world
echo $SHELL
```

* date date命令用于显示/设置系统的时间或日期，格式为：**date [选项] [+指定的格式]**
```
date
date "+%Y-%m-%d %H:%M:%S"
```
* 重启
```
reboot
```

* 关机
```
shutdown
poweroff
halt
```

* wget命令用于使用命令行下载网络文件，格式为：**wget [参数] 下载地址**
```
-b	后台下载模式。
-O	下载到指定目录。
-t	最大尝试次数。
-c	断点续传
-p	下载页面内所有资源,包括图片、视频等。
-r	递归下载
```

* sudo sudo是superuser do的简写，sudo是linux系统管理指令，是允许系统管理员让普通用户
执行一些或者全部的root命令的一个工具，如halt，reboot，su等等。这样不仅减少了root用户的
登陆 和管理时间，同样也提高了安全性
```
sudo poweroff
sudo reboot
```

#### 系统状态检查命令
* 网络相关 ifconfig用于获取网卡配置与网络状态等信息，格式为 **ifconfig [网络设备] [参数]**
查看本机当前的网卡配置与网络状态等信息:
```
ifconfig
```

* uname命令用于查看系统内核版本等信息，格式为：**uname [-a]**
```uname -a
```

* uptime命令用于查看系统的负载情况，格式为：**uptime**,以下命令用来每秒刷新一次获
得当前的系统负载情况
```
watch -n 1 uptime“
```

* free命令用于显示当前系统中内存的使用量情况，格式为：**free [-m/-g]**，表示以什么单位
mb还是gb
```
free -m
```

* who命令用于查看当前登入主机的用户情况，格式为：**who [参数]**
```
who
```

* last命令用于查看所有系统的登入记录，格式为：**last [参数]**
```
last
```

* history命令用于显示历史执行过的命令，格式为：**history**，保存在.bash_history中，
history默认会保存1000条执行过的命令，若要修改可直接编辑/etc/profile文件的HISTSIZE值
```
history
history -c 清空历史记录
```

* sosreport命令用于收集系统系统配置并诊断信息后输出结论文档，格式为：**sosreport**
当我们的红帽系统出现故障需要联系红帽厂商或其他技术支持时，大多数情况都需要提供使用到这个命令。
收集系统本地配置信息并诊断：
```
sosreport
```
