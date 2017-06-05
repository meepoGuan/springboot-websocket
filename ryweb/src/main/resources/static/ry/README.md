# RongCloud Web IM Widget for Angular

---

**Web IM Widget for Angular** 是一个angular插件。通信部分依赖 `RongIMLib`。  
支持IE9+、Chrome、Firefox等

```
npm install -g typescript@1.6.0beta tsd grunt-cli
```

如有必要，使用 `sudo npm`

### 安装依赖库

在项目根目录下执行：

```
npm install
tsd install
```

### 编译 typescript 代码

```
grunt build
```

### 启动demo服务

```
grunt connect
```

## 文件结构说明
```
  |-----------------------
  |  demo实例
  |       [demo/user1]用户1
  |       [demo/user2]用户2
  |       [demo/index]
  |------------------------
  |				[css]样式资源
  |				[images]图片资源
  |       [ts] 源码
  |       [js] 编译后代码
  |-----------------------
  |  doc文档说明
  |				[doc/开发文档]
  |				[doc/客服]关于客服使用的说明
  |-----------------------
  | vendor 依赖 js 插件库
  |
```
