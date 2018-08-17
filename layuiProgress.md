
## 简介

ejx_layui采用[layuiAdmin](http://www.layui.com/admin/)作为基础后台管理系统框架结合[webpack(zh-cn)](https://www.webpackjs.com/) 自身的服务和代理功能，构成的一套前后端分离开发模式的框架(目标：实现开发模式上的分离)。

- [在线访问]()

- [使用文档1 - layui](http://www.layui.com)
- [使用文档2 - webpack](https://www.webpackjs.com)


## 目录
```
- config
  - webpack.dev.js                                           # webpack基础配置，和带路配置目录

- dist                                                       # 项目开发目录和构建目录
  - layuiAdmin                                               # js模块 AND 第三方插件
  - view                                                     # 功能模块页面
  - login                                                    # 登录页面

- node_modules                                               # 各种依赖

- nodeJS                                                     # node环境总目录
  - node.exe                                                 # node
  - run.bat                                                  # node运行批处理文件
  
- src                                                        # js打包入口文件
  - index.js

- package.json                                               # 定义项目所需模块
- package-lock.json                                          # 记录项目包安装信息

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
浏览器访问 http://localhost:8888

# 代理配置
webpack.dev.js 文件修改变量ip
 '/api': {
    target: 'http://localhost:8080', // 接口的域名
    secure: false,  // 如果是https接口，需要配置这个参数
    changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
    pathRewrite: {'^/api': ''}
  }

```


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


