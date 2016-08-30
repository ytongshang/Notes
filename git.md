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

#### 相关概念
  1. git add 将修改放到暂存区
  2. git commit一次性的将暂存区的所有东西提交到某个分支中
  3. git 管理的是修改，而非文件

#### 丢掉修改
  1. 丢掉工作区的修改命令
  ```
  $ git checkout -- readme.txt
  ```

  2. 命令git checkout -- readme.txt意思就是，把readme.txt文件在工作区的修改全部撤销，这里有两种情况：一种是readme.txt自修改后还没有调用add,调用这个命令后，readme.txt的内容就会和仓库中的一样了；一种是readme.txt以及add了一次，又进行了修改，调用命令后，会回到上一次add的情况。

  3. **git checkout -- file** 命令中的 **--** 很重要，没有--，就变成了“切换到另一个分支”的命令

  4. 丢掉暂存区的修改
  ```
  git reset HEAD file
  ```

  5. **场景1**：当你改乱了工作区某个文件的内容，想直接丢弃工作区的修改时，用命令git checkout -- file。
  **场景2**：当你不但改乱了工作区某个文件的内容，还添加到了暂存区时，想丢弃修改，分两步，第一步用命令git reset HEAD file，就回到了场景1，第二步按场景1操作。
  **场景3**：已经提交了不合适的修改到版本库时，想要撤销本次提交，直接版本回溯。
