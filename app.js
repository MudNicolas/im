/**
 * 2020.2.25 created by Nicolas
 * 应用程序入口
 */

/**加载express模块 */
var express = require('express');
/**加载模板处理模块  */
var swig = require('swig');

//加载数据库模块
var mongoose = require('mongoose');

//加载body-parser处理前端post的数据
var bodyParser = require('body-parser');

/**创建app应用 */
var app = express();

/**设置静态文件托管 */
//当用户访问的url以/public开始，那么直接返回对应__dirname+'/public'下的文件，所以将css、js文件都放在public文件夹
app.use('/public', express.static(__dirname + '/public'));

/**配置前端应用模板 */
//定义当前应用所使用的模板引擎
//第一个参数表示模板引擎的名称，也是模板文件的后缀；第二个参数表示用于解析处理模板内容的方法
app.engine('html', swig.renderFile);
//设置模板文件存放的目录,第一个参数必须是views，第二个参数是路径
app.set('views', './views');
//注册所使用的模板引擎,第一个参数必须是view engine，第二个参数和app.engine的模板引擎名称一样
app.set('view engine', 'html');
//在开发过程中取消模板缓存
swig.setDefaults({
    cache: false
});

//bodyparser配置
app.use(bodyParser.urlencoded({
    extended: true
}));

//加载cookie模块
var cookies = require('cookies');

app.use(function (req, res, next) {
    req.cookies = new cookies(req, res);

    //解析登录用户的cookie
    req.userInfo = {};
    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
        } catch (e) {}
    }


    next();
})

/**访问首页
 * req request
 * res response
 * next 函数
 */
//app.get('/', function (req, res, next) {
//res.send("blog");
/**读取view目录下的指定文件，解析并返回给客户端
 * 第一个参数表示view目录中的模板文件
 * 第二个参数表示传递给模板使用的数据
 */
// res.render('index');
//})

/**根据不同的功能划分模块 
 * admin.js相当于子路由
 */
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

//链接数据库
mongoose.connect('mongodb://localhost:27845/loginandregister', function (err) {
    if (err) {
        console.log("fail");
    } else {
        console.log("success");
        /**监听http请求 */
        app.listen(8844);
    }
});