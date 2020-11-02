# Centos

## docker

[Docker基本操作,以及基于Docker部署SpringBoot项目](https://www.jianshu.com/p/dd59ce73f46e)
[docker run 与docker start的区别](https://www.cnblogs.com/x-poior/p/10566112.html)
[docker入门教程](http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)

```bash
yum update
yum install docker

# 启动docker
systemctl start cocker

# 开机自启
systemctl enable docker

# 查看docker版本
docker -v

# 更换docker容器镜像服务为阿里的仓库地址
mkdir -p /etc/docker
tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://vxozked9.mirror.aliyuncs.com"]
}
EOF
systemctl daemon-reload
systemctl restart docker
```

## docker基本操作

```bash
# 搜索镜像
docker search 镜像名

# 下载镜像
docker pull 镜像名

# 重命名镜像的REPOSITORY
docker tag IMAGE_ID NEW_NAME

# docker images
docker images

# 删除指定镜像 删除镜像前需要先删除占用的容器
docker rmi image-id

# 删除所有镜像
docker rmi $(docker images -q)

# 查看运行的容器列表
docker ps

# 查看所有的容器的状态
docker ps -a

# 运行镜像 -d 参数使容器在后台运行 --name 指定容器的名称,可以使用 -e 传递启动参数给容器
docker run --name 容器名 -d image-name
# 例如  启动redis
docker run --name test-redis -d redis

# 映射 例如 映射redis端口
docker run -d -p 6379:6379 --name test-redis redis

# 启动容器
docker start container-name/container-id

# 停止容器
docker stop container-name/container-id

# 删除指定容器
docker rm container-id
# 删除所有容器
docker rm $(docker ps -a -q)

# 常看容器日志
docker logs container-name/container-id

# 登录容器
docker exec -it container-name/container-id bash

# 编译镜像
docker build -t 镜像名 Dockerfile文件路径
```