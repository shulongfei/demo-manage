GIT刚入门时很多地方对自己造成了一些困扰的地方，也没有找到一份比较完整的使用资料，故做一个总结。以下为自己工作中用过，并总结出来的的常用命令，建议学习的同时使用github练习[github 官网](https://github.com)。

中文文件编码命令： git config --global core.quotepath false

## 1.1 安装 git（官网）

### windwos上安装
在 Windows 上安装 Git 也有几种安装方法。 官方版本可以在 Git 官方网站下载。 打开 http://git-scm.com/download/win，下载会自动开始。 要注意这是一个名为 Git for Windows的项目（也叫做 msysGit），和 Git 是分别独立的项目；更多信息请访问 http://msysgit.github.io/。

### mac上安装
在 Mac 上安装 Git 有多种方式（自带的就可以用）。 最简单的方法是安装 Xcode Command Line Tools。 Mavericks （10.9） 或更高版本的系统中，在 Terminal 里尝试首次运行 git 命令即可。 如果没有安装过命令行开发者工具，将会提示你安装

## 1.2 本地如何拥有一个远程项目（pc）
### 准备工作
条件：当远端已存在一个项目

当git安装完成之后，我们先初始化用户名和邮箱，默认为注册用户名和邮箱。
```git
git config --global user.name "shulongfei"
git config --global user.email "shulongfei@163.com"
```
### 本地pc拥有一个远端项目
xxx：表示远端地址

**方式1：从远端复制一个项目到本地**
```git
  git clone xxx
```
> 说明：
`git clone`: 复制一个远端项目

**方式2：当本地存在一个项目，将其关联并推送到远端**
```git 
  cd existing_folder
  git init
  git remote add origin xxx
  git commit
  git push -u origin master
```
> 说明：
1. `cd`: 进入到某个文件夹
2. `git init`: 初始化
3. `git remote add orgin xxx`: 连接远端项目
4. `git add`: 提交到本地缓存
5. `git commit`: 提交到本地仓库
6. `git push -u origin master`: 将代码推送到远端

**方式3：当本地存在一个远端仓库**
```git
  cd existing_repo
  git remote add origin xxx
  git push -u origin --all
  git push -u origin --tags
```
> `注`: 方式3个人很少用到不做说明。

## 1.3 GIT常用撤销操作
### git add之后的撤销操作
`git reset HEAD`: 表示撤销所有

`git reset HEAD  xxx xxx`: 表示撤销需要撤销的文件,多个文件之间用空格隔开
### git commit 或 push 之后的撤销操作
`git commit --amend `: 修改commit的注释，已最后一次修改的内容为主

`git log`: 查看提交的日期和id

`git reset --soft id`: 回退到某个版本，只回退了commit的信息，不会恢复到index file一级。如果还要提交，直接commit即可

`git reset id`: 回退到某个版本，回退了add的信息，恢复到了index file一级。如果还要提交，需 add->commit

`git reset –-hard id`: 彻底回退到某个版本，本地的源码也会变为上一个版本的内容，撤销的commit中所包含的更改被冲掉 慎用！

## 1.4 如何解决冲突
**方式1：本人常用**
```
  1、先 commit 提交本地代码至缓存 git add ->  git commit -m '注释内容'
  2、git pull  则出现冲突文件名 文件内容则标注出冲突的内容如：
     <<<<<<< HEAD
          本地修改
     =======
          远端别人修改
     >>>>>>> a94b10b314c646c482f012ea3732ddde931c549e 
     将文件处理之后重新执行  git add -> git commit -m '注释内容'
```
**方式2：推荐使用**
```
  保留生产服务器上所做的改动,仅仅并入新配置项 
  git stash -> git pull -> git stash pop 然后重新提交代码即可 git add -> git commit -m '注释内容' 
  git stash: 将当前的工作区内容保存到Git栈中。
  git stash pop: 从最近的一个stash中读取内容并恢复。
  git stash list: 显示Git栈内的所有备份
```
**方式2：不推荐使用（恢复到之前版本重新更新重新编辑代码！）**
```
  直接 git reset --hard id -> git pull 恢复到远端维修改之前的版本，更新远端最新内容。
```
## 1.5 分支的使用
```
  1、拉取远端分支
  git clone -b 分支名(branch) XXX
  
  2、创建分支
  git checkout -b branchName  创建分支并切换为当前分支git branch branchName -> git checkout branchName
  
  3、分支合并
  git checkout master -> git checkout 要合并的分支名   （如果出现冲突则先解决冲突）
  
  4、删除分支
  git branch -d branchName 删除本地分支
  git push origin -d branchName 删除远端分支
  
  5、查看远端分支
  git baranch 查看本地分支
  git branch -a 查看远端分支    
```
## 1.6 标签的使用

```
  目前所用地方较少，大体与创建分支差不多。主要用于标记版本，如v1、v2、v3
```

查看当前 文档截图：
更多文档：[book](https://github.com/shulongfe)

