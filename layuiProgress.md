
## 简介

ejx_layui采用[layuiAdmin](http://www.layui.com/admin/)作为基础后台管理系统框架结合[webpack(zh-cn)](https://www.webpackjs.com/) 自身的服务和代理功能，构成的一套前后端分离开发模式的框架(目标：实现开发模式上的分离)。

- [在线访问]()

- [使用文档1 - layui](http://www.layui.com)
- [使用文档2 - webpack](https://www.webpackjs.com)


## 目录
```
- config
  - webpack.dev.js     ------------------------------------------------qwq

- dist                 ------------------------------------------------12
  - layuiAdmin
  - view               -------------------------------------------------12
  - login

- node_modules

- nodeJS
  - node.exe
  - run.bat
  
- src
  - index.js

- package.json
- package-lock.json

```

## 开发
```bash
# 克隆项目
git clone https://github.com/shulongfei/ejx_layui.git

# 启动node
打开项目中的 nodeJS文件 双击run.bat 打开node环境

# 进入项目
cd ../

# 启动服务
npm run dev
```
浏览器访问 http://localhost:8888




## 发布
```bash

# 构建环境
clone dist/

```

## 其它
```bash
# 可灵活根据项目需求进行webpack管理及项目打包构建配置（目前未做配置）
npm run build

```

更多信息请参考 [使用文档](http://www.layui.com)


