1. 文章是后端同学用PHP先读取“movieCard.html”这类的文件获取dom结构插入内容的方式,
   class="article_main"内的都是后端插入内容
2.项目区分三端，由前端来判断位于什么端处理不同的情况
3./Users/liudaisy/wepiao/pepper/bin/webpack/prod.js
output: {
        path: path.resolve(CWD, config.build),
        publicPath: config.static[process.env.MODE],
        chunkFilename: 'js/[name]-[githash].js',
        filename: 'js/[name]-[chunkhash:8].js'
    },
   改成
   output: {
        path: path.resolve(CWD, config.build),
        publicPath: config.static[process.env.MODE],
        chunkFilename: 'js/[name].js',
        filename: 'js/[name].js'
    },
