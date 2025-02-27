# create-refactor-app
## 前提
本应用是用来原生页面esm化，比如有一个参考的原生页面，需要在其基础上进行重构开发。或者老的前端项目，使用此架子可快速esm化，以及嵌入了部分ci的功能。

## 开发指南
- 将网页下载下来, 确认页面样式,对冗余脚本（广告，监控等）进行清理.
- 页面文件夹移动至`src/page`目录下.
- 使用`/build/generate/global2esm.js`脚本进行模块化转化.
- 使用`npm run test`来测试有无编译问题.

## 工程化
即对build以及dist目录相关介绍.
```sh
build
├── generate
│   └── global2esm.js //批处理global转化为esm
├── upcdn.js // 将打包好的静态文件上传至s3
└── batchEntry.js //根据模板, 批量注册入口和插件
```
dist

```sh
dist
├── pageName  //页面名称
│   ├── assets	//静态资源目录
│   │   ├── 1-star.png
│   │   ├── 3f8ad96bb34fdede-152.css
│   │   ├── 3f8ad96bb34fdede-152.js
│   │   ├── star.png
│   │   ├── through-walls.mp4
│   └── index.html
└── manifest.json // 文件输出清单
```
