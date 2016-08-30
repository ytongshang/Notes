#### git 全局设置
  1. name和email
```
git config --global user.name "Your Name"
git config --global user.email "email@example.com"
```

#### 创建一个新的git项目
  1. 创建一个新的git 项目
```
mkdir learnGit
cd learnGit
git init
```

#### commit
  1. 将一个文件加入到git项目,-m 用来指定commit的描述
```
git add readme.md
git commit -m “add readme”
```

#### 查询

  1. 查看git项目的状态
```
git status
```

  2. 查看某个文件的变化情况,通过 **：q** 退出diff查看
```
git diff readme.md
```

  3. 查看提交历史,查看具体文件的提交历史,还可以格式化log记录
```
git log
git log a.log
git log --pretty=oneline
```

#### 版本回溯
  1. 在git中，用**HEAD**表示当前版本，也就是最新的版本

  2. 上一个版本 **HEAD^**,上上一个版本 **HEAD^^**,而前100个版本的写法为：**HEAD~100**

  3. git回溯到上一个版本
  ```
  git reset --hard HEAD^
  ```

  4. 回溯到某个具体的版本
  ```
  git reset --hard commit_id
  git reset --hard de97194     ([master de97194] add b.log)
  ```

  5. 可以用git reflog查看每一次提交命令,然后就可以回溯到自己想要回溯的某个版本了
  ```
  git reflog

  de97194 HEAD@{0}: reset: moving to de97194
  8a90150 HEAD@{1}: reset: moving to HEAD^
  de97194 HEAD@{2}: commit: add b.log
  8a90150 HEAD@{3}: commit: edit a.log
  d6eb71f HEAD@{4}: commit (initial): add a.log

  git reset --hard 8a90150
  ```
