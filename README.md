
## 简介

主要写一些layui小demo，上传使用集成软件 xammp, 该文件是从我司项目中街截取出来，目录结构不做详细，页面仅供参考。

- [参考文档 - layui](http://www.layui.com)

## 目录
```
- layui                                     # 集成layui框架，layui官网可下载
  - lay
  - css
  - ...                          

- view                                      # 所有demo页面
  - uploadDemo.html                         # 文件上传添加进度条
  - connection.html                         # 省市区三级联动
  - stepForm.html                           # 分布式表单
  - success.html                            # 操作成功跳转界面

- data                                      # php存放文件夹
  - config.php                              # 用于连接数据库(该文件暂时无用)
  - up.php                                  # 处理文件上传演示用

```

## 运行
```bash
# 页面
普通页面双击直接运行即可

# 上传
将文件放于 apache/tomcat/IIS 等服务器内 
本次调试用的xammp （安装 - 文件放入htdocs - 起服务 - 打开页面即可看到效果）😅

```

## layui 如何通过webpack实现前后台分离开发（需要请联系博主）
```bash
# 代码仓库
document 为前后台分离开发文档，博主根据个人想法所见，有兴趣的小伙伴可以了解一下
 
```

## 其它
```bash
# 觉得不错的小伙伴记得点心

```

更多信息请参考 [使用文档](http://www.layui.com)


