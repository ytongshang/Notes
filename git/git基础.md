# git教程

- [git 教程](http://www.yiibai.com/git/home.html)
- [廖雪峰git 教程](http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/)
- [官方教程](https://git-scm.com/book/zh/v1/Git-%E5%88%86%E6%94%AF-%E4%BD%95%E8%B0%93%E5%88%86%E6%94%AF)

## git 全局设置

- name和email

  ```git
  git config --global user.name "Your Name"
  git config --global user.email "email@example.com"
  ```

- 不带任何参数的git push，默认只推送当前分支，这叫做simple方式。此外， 还有一种matching方式，会推送所有有对应的远程分支的本地分支。Git 2.0版本之前， 默认采用matching方法，现在改为默认采用simple方式。如果要修改这个设置， 可以采用git config命令

  ```git
  git config --global push.default matching
  git config --global push.default simple
  ```

- 指定编辑器

  ```git
  git config --global core.editor
  ```
- 换行

  ```git
  //windows
  git config --global core.autocrlf true

  //linux mac
  git config --global core.autocrlf input
  ```

- 保存密码

  ```git
  git config --global credential.helper store

  windows：
  git config --global credential.helper wincred
  ```

## 创建一个新的git项目

- 创建一个新的git 项目

  ```git
  mkdir learnGit
  cd learnGit
  git init
  ```

## commit rm

- 将一个文件加入到git项目,-m 用来指定commit的描述

  ```git
  git add readme.md
  git add .
  git commit -m "add readme"
  git commit -a -m "commit message"
  ```

- 删除文件

  ```git
  git rm <文件名>
  ```

- 如果前面以及加入一暂存区了，要删除的话，带-f参数

  ```git
  git rm -f <文件名>
  ```

- 我们想把文件从 Git 仓库中删除（亦即从暂存区域移除），但仍然希望保留在当前工作目录中。换句 话说，仅是从跟踪清单中删除。比如一些大型日志文件或者一堆 .a 编译文件，不小心纳入仓库后，要移除 跟踪但不删除文件，以便稍后在 .gitignore 文件中补上，用 --cached 选项即可

  ```git
  git rm --cached readme.txt
  ```

## 查询

- 查看git项目的状态,git status仅仅列出了哪些文件有变化

  ```git
  git status
  ```

- 要查看尚未暂存的文件更新了哪些部分，不加参数直接输入 git diff，通过 **：q** 退出diff查看

  ```git
  git diff readme.md
  ```

- 若要看已经暂存起来的文件和上次提交时的快照之间的差异，可以用 git diff --cached 命令，或者 git diff --staged命令

  ```git
  git diff --cached
  git diff --staged
  ```

- 单单 git diff 不过是显示还没有暂存起来的改动，而不是这次工作和上次提交之间的差异。所以有时候 你一下子暂存了所有更新过的文件后，运行 git diff 后却什么也没有，就是这个原因

- 查看提交历史,查看具体文件的提交历史,还可以格式化log记录

  ```git
  git log
  git log a.log
  git log --pretty=oneline
  ```

## 版本回溯

- 在git中，用**HEAD**表示当前版本，也就是最新的版本

- 上一个版本 **HEAD^**,上上一个版本 **HEAD^^**,而前100个版本的写法为：**HEAD~100**

- git回溯到上一个版本

  ```git
  git reset --hard HEAD^
  ```

- 回溯到某个具体的版本

  ```git
  git reset --hard commit_id
  git reset --hard de97194 ([master de97194] add b.log)
  ```

- 可以用git reflog查看每一次提交命令,然后就可以回溯到自己想要回溯的某个版本了

  ```git
  git reflog de97194 HEAD@{0}:
  reset: moving to de97194 8a90150 HEAD@{1}:
  reset: moving to HEAD^ de97194 HEAD@{2}:
  commit: add b.log 8a90150 HEAD@{3}:
  commit: edit a.log d6eb71f HEAD@{4}:
  commit (initial): add a.log
  git reset --hard 8a90150
  ```

## 相关概念

- git add 将修改放到暂存区

- git commit一次性的将暂存区的所有东西提交到某个分支中

- git 管理的是修改，而非文件

## 丢掉修改

- 丢掉工作区的修改命令

  ```git
  git checkout -- readme.txt
  ```

- 命令git checkout -- readme.txt意思就是，把readme.txt文件在工作区的修改全部撤销，这里有两种情况：一种是readme.txt自修改后还没有调用add,调用这个命令后，readme.txt的内容就会和仓库中的一样了；一种是readme.txt以及add了一次，又进行了修改，调用命令后，会回到上一次add的情况。

- **git checkout -- file** 命令中的 **--** 很重要，没有--，就变成了"切换到另一个分支"的命令

- 丢掉暂存区的修改

  ```git
  git reset HEAD file
  ```

- 回溯版本

  - **场景1**：当你改乱了工作区某个文件的内容，想直接丢弃工作区的修改时，用命令git checkout -- file。
  - **场景2**：当你不但改乱了工作区某个文件的内容，还添加到了暂存区时，想丢弃修改，分两步，第一步用命令git reset HEAD file，就回到了场景1，第二步按场景1操作。
  - **场景3**：已经提交了不合适的修改到版本库时，想要撤销本次提交，直接版本回溯。

## .gitignore文件

- 文件格式

  - 所有空行或者以注释符号 ＃ 开头的行都会被 Git 忽略。
  - 可以使用标准的 glob 模式匹配。
  - 匹配模式最后跟反斜杠（/）说明要忽略的是目录。
  - 要忽略指定模式以外的文件或目录，可以在模式前加上惊叹号（!）取反

- 示例

  ```git
  # 此为注释 – 将被 Git 忽略
  # 忽略所有 .a 结尾的文件
  *.a
  # 但 lib.a 除外
  !lib.a
  # 仅仅忽略项目根目录下的 TODO 文件，不包括 subdir/TODO
  /TODO
  # 忽略 build/ 目录下的所有文件
  build/
  # 会忽略 doc/notes.txt 但不包括 doc/server/arch.txt,仅限一级目录
  doc/*.txt
  # ignore all .txt files in the doc/ directory
  doc/_*/_.txt
  ```
