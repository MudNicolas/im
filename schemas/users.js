var mongoose = require('mongoose');

//定义用户表结构
module.exports = new mongoose.Schema({

    username: String,
    password: String,
    email: String,
    phone: String,
    name: String

})