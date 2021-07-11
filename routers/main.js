var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    console.log('cookie', req.userInfo);
    if (req.userInfo._id) {
        res.render('infocenter',{
            userInfo:req.userInfo
        });
    } else {
        res.render('login');
    }
})

router.get('/register', function (req, res, next) {
    res.render('register');
})


router.get('/login', function (req, res, next) {
    res.render('login');
})

router.get('/infocenter', function (req, res, next) {
    if (req.userInfo._id) {
        res.render('infocenter',{
            userInfo:req.userInfo
        });
    } else {
        res.render('login');
    }
})

module.exports = router;