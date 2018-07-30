说明，该更改不影响原上传组件的使用，更改略有不同。
第一步: 
创建监听函数:
//创建监听函数
   var xhrOnProgress=function(fun) {
      xhrOnProgress.onprogress = fun; //绑定监听
       //使用闭包实现监听绑
      return function() {
          //通过$.ajaxSettings.xhr();获得XMLHttpRequest对象
          var xhr = $.ajaxSettings.xhr();
           //判断监听函数是否为函数
            if (typeof xhrOnProgress.onprogress !== 'function')
                 return xhr;
             //如果有监听函数并且xhr对象支持绑定时就把监听函数绑定上去
              if (xhrOnProgress.onprogress && xhr.upload) {
                    xhr.upload.onprogress = xhrOnProgress.onprogress;
              }
              return xhr;
       }
   };


第二部:
加载
//选完文件后不自动上传
load.render({
  elem: '#test-upload-change'
  ,url: '/layuiAdmin.std-v1.0.0-beta8/src/views/component/upload/up.php'
  ,auto:false
  ,exts: 'zip|rar|7z'
  ,xhr:xhrOnProgress
  ,progress:function(value){//上传进度回调 value进度值
    console.log(value);
    element.progress('demo', value+'%')//设置页面进度条
   }
  ,bindAction: '#test-upload-change-action'
  ,before: function(input){
  //返回的参数item，即为当前的input DOM对象
    layer.load(); //上传loading
      console.log('文件上传中');
  }
  ,done: function(res){
    console.log(res);
    layer.closeAll();
    layer.msg("上传成功");
  }
});

第三部:
更改upload.js. 这里很重要，写入判断，避免影响原来的js文件。
xhr属性部分为新增的部分。

t.ajax({
  url: l.url,
  type: l.method,
  data: r,
  contentType: !1,
  processData: !1,
  dataType: 'json',
  xhr: l.xhr ? l.xhr(function(e){//此处为新添加功能
      console.log(11111);
      console.log(e);
      var percent=Math.floor((e.loaded / e.total)*100);//计算百分比
      if(l.progress){
        l.progress(percent);//回调将数值返回
      } 
  }) : undefined,
  headers: l.headers || {},
  success: function (t) {
    i++, d(e, t), u()
  },
  error: function () {
    n++, o.msg('请求上传接口出现异常'), m(e), u()
  }
})



