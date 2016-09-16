# git clone

- 基本命令

  ```
  git clone <远程版本库> <本地目录名>
  ```

- git clone支持多种协议，除了HTTP(s)以外，还支持SSH、Git、本地文件协议等

  ```
  $ git clone http[s]://example.com/path/to/repo.git/
  $ git clone ssh://example.com/path/to/repo.git/
  $ git clone git://example.com/path/to/repo.git/
  $ git clone /opt/git/project.git
  $ git clone file:///opt/git/project.git
  $ git clone ftp[s]://example.com/path/to/repo.git/
  $ git clone rsync://example.com/path/to/repo.git/
  ```

# git remote

- 为了便于管理，Git要求每个远程主机都必须指定一个主机名。git remote命令就用于管理主机名

  ```
  git remote
  origin
  ```

- git remote -v | --verbose 列出详细信息，可以查看远程主机的网址

  ```
  git remote --verbose
  origin  https://github.com/ytongshang/Notes.git (fetch)
  origin  https://github.com/ytongshang/Notes.git (push)
  ```

- 克隆版本库的时候，所使用的远程主机自动被Git命名为origin。如果想用其他的主机名，需要 用git clone命令的-o选项指定

  ```
  git clone -o jQuery https://github.com/jquery/jquery.git
  git remote
  jQuery
  ```

- git remote show命令加上主机名，可以查看该主机的详细信息

  ```
  git remote show origin
  remote origin
  Fetch URL: https://git.coding.net/Rancune/learnGit.git
  Push  URL: https://git.coding.net/Rancune/learnGit.git
  HEAD branch: master
  Remote branch:
  master tracked
  Local branch configured for 'git pull':
  master merges with remote master
  Local ref configured for 'git push':
  master pushes to master (up to date)
  ```

- git remote add命令用于添加远程主机

  ```
  git remote add origin https://git.coding.net/Rancune/learnGit.git
  ```

- git remote rm命令用于删除远程主机。

  ```
  git remote rm origin
  ```

- git remote rename命令用于远程主机的改名。

  ```
  git remote rename origin hapi
  ```

# git fetch

- 一旦远程主机的版本库有了更新(Git术语叫做commit)，需要将这些更新取回本地，这时就要 用到git fetch命令,下面命令将某个远程主机的更新，全部取回本地

  ```
  git fetch <远程主机名>
  ```

- 默认情况下，git fetch取回所有分支(branch)的更新。如果只想取回特定分支的更新，可以指 定分支名

  ```
  git fetch <远程主机名> <分支名>
  git fetch origin master
  ```

- 所取回的更新，在本地主机上要用"远程主机名/分支名"的形式读取,**此时本地的分支与远程主机的分支 是没有合并的,两者还是独立的**，比如origin主机的master，就要用origin/master读取。 git branch命令的-r选项，可以用来查看远程分支，-a选项查看所有分支

  ```
  git branch -r
  origin/master
  git branch -a
  master
  remotes/origin/master
  ```

- 本地主机的当前分支是master，远程分支是origin/master。取回远程主机的更新以后，可以在 它的基础上，可以用checkout命令切换到另外的一个分支

  ```
  git checkout master 切换本地的主分支
  git checkout origin/master 切换到origin的主分支
  ```

- 也可以使用git merge命令或者git rebase命令，在本地分支上合并远程分支

  ```
  git merge origin/master
  # 或者
  git rebase origin/master
  ```

# git pull

- git pull命令的作用是，取回远程主机某个分支的更新，再与本地的指定分支合并, 实际上是git fetch与git merge两个命令的合并

  ```
  git pull <远程主机名> <远程分支名>:<本地分支名>
  ```

- 取回origin主机的next分支，与本地的master分支合并，需要写成下面这样

  ```
  git pull origin next:master
  ```

- 如果远程分支是与当前分支合并，则冒号后面的部分可以省略

  ```
  git pull origin next
  ```

- 3中的命令表示，取回origin/next分支，再与当前分支合并。实质上，这等同于先做git fetch，再做git merge

  ```
  git fetch origin
  或git fetch origin next
  git merge origin/next
  ```

- Git会自动在本地分支与远程分支之间，建立一种追踪关系(tracking)。比如，在git clone的时候， 所有本地分支默认与远程主机的同名分支，建立追踪关系，也就是说，本地的master分支自动 "追踪"origin/master分支,上面命令指定master分支追踪origin/next分支

  ```
  git branch --set-upstream master origin/next
  ```

- 如果当前分支与远程分支存在追踪关系，git pull就可以省略远程分支名,下面命令表示，本地的当前 分支自动与对应的origin主机"追踪分支"(remote-tracking branch)进行合并

  ```
  git pull origin
  ```

- 如果当前分支只有一个追踪分支，连远程主机名都可以省略。当前分支自动与唯一一个追踪分支进行合并

  ```
  git pull
  ```

- 如果合并需要采用rebase模式，可以使用–rebase选项

  ```
  git pull --rebase <远程主机名> <远程分支名>:<本地分支名>
  ```

# git push

- 把本地库的所有内容推送到远程库上,分支推送顺序的写法是<来源地>:<目的地>，所以 git pull是<远程分支>:<本地分支>，而git push是<本地分支>:<远程分支>。

  ```
  git push <远程主机名> <本地分支名>:<远程分支名>
  ```

- 将本地的master分支推送到origin主机的master分支。如果后者不存在，则会被新建

  ```
  git push origin master
  ```

- 如果省略本地分支名，则表示删除指定的远程分支，因为这等同于推送一个空的本地分支到远程 分支。下面命令表示删除origin主机的master分支

  ```
  git push origin :master
  git push origin --delete master
  ```

- 如果当前分支与远程分支之间存在追踪关系，则本地分支和远程分支都可以省略,下面命令表示， 将当前分支推送到origin主机的对应分支

  ```
  git push origin
  ```

- 如果当前分支只有一个追踪分支，那么主机名都可以省略

  ```
  git push
  ```

- 下面命令将本地的master分支推送到origin主机，同时指定origin为默认主机，后面就可以 不加任何参数使用git push了

  ```
  git push -u origin master
  ```

- 就是不管是否存在对应的远程分支，将本地的所有分支都推送到远程主机，这时需要使用–all选项

  ```
  git push --all origin
  ```

- 如果远程主机的版本比本地版本更新，推送时Git会报错，要求先在本地做git pull合并差异， 然后再推送到远程主机。这时，如果你一定要推送，可以使用–force选项,下面命令使用–force选项， 结果导致在远程主机产生一个"非直进式"的合并(non-fast-forward merge)。除非你很确定要这样做， 否则应该尽量避免使用–force选项

  ```
  git push --force origin
  ```

- git push不会推送标签(tag)，除非使用–tags选项。

  ```
  git push origin -tags
  ```

# git 标签

- 创建标签，首先切换到对应的分支,默认会为当前的分支 **HEAD** 打上标签

  ```
  git checkout dev
  git tag "v0.1"
  ```

- 默认标签是打在最新提交的commit上的，还可以为历史提交打上标签

```
git log --pretty=oneline --abbrev-commit
6a5819e merged bug fix 101
cc17032 fix bug 101
7825a50 merge with no-ff
6224937 add merge
59bc1cb conflict fixed
400b400 & simple
75a857c AND simple
fec145a branch test
d17efd8 remove test.txt

git tag v0.9 6224937
```

- 标签不是按时间顺序列出，而是按字母排序的。可以用git show

  <tagname>查看标签信息</tagname>

  ```
  git show v0.9
  ```

- 还可以创建带有说明的标签，用-a指定标签名，-m指定说明文字

  ```
  git tag -a v0.1 -m "version 0.1 released" 3628164
  ```

- 可以通过-s用私钥签名一个标签,签名采用PGP签名，因此，必须首先安装gpg（GnuPG），如 果没有找到gpg，或者没有gpg密钥对，就会报错

  ```
  git tag -s v0.2 -m "signed version 0.2 released" fec145a
  ```

- 如果标签打错了，也可以删除,因为创建的标签都只存储在本地，不会自动推送到远程。所以，打错 的标签可以在本地安全删除

  ```
  git tag -d v0.1
  ```

- 如果要推送某个标签到远程，使用命令git push <远程主机名>

  <tagname>
  </tagname>

  ```
  git push origin v1.0
  ```

- 一次性推送全部尚未推送到远程的本地标签

  ```
  git push origin --tags
  ```

- 如果标签已经推送到远程，要删除远程标签就麻烦一点，先从本地删除,然后，从远程删除。 删除命令也是push，第一种方式相当于push一个空的tag到原来的v0.9的tag,这里origin 与:之前有一个 空格，下面则是一种删除方法，与git 删除远程分支的原理差不多。

  ```
  git tag -d v0.9
  git push origin :refs/tags/v0.9
  或
  git push origin --delete tag <tagname>
  或
  git push origin : <tagname>
  ```
