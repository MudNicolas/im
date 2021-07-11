

var btn = 0;

$(function () {

    document.onkeydown = function (event) { //在按下enter时也可以进行搜索
        var e = event || window.event;
        if (e && e.keyCode == 13&&btn==1) {
           login();
        }
    }

    $(function () {
        $('#username').keyup(function () {
            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;
            if (username == "" || password == "") {
                $('#login-btn').css('background-color', 'grey');
                $('#login-btn').css('cursor', 'not-allowed');
                $('#login-btn').disabled = true;
                btn = 0;
            } else {
                $('#login-btn').css('background-color', 'rgb(0, 121, 184)');
                $('#login-btn').css('cursor', 'pointer');
                $('#login-btn').disabled = false;
                btn = 1;
            }
        })
        $('#password').keyup(function () {
            var password = document.getElementById('password').value;
            var username = document.getElementById('username').value;
            if (username == "" || password == "") {
                $('#login-btn').css('background-color', 'grey');
                $('#login-btn').css('cursor', 'not-allowed');
                $('#login-btn').disabled = true;
                btn = 0;

            } else {
                $('#login-btn').css('background-color', 'rgb(0, 121, 184)');
                $('#login-btn').css('cursor', 'pointer');
                $('#login-btn').disabled = false;
                btn = 1;
            }
        })

        $('#login-btn').on('click', function () {
            if (btn == 1) login();
        });



    })

    function login() {
        $.ajax({
            type: 'post',
            url: 'api/user/login',
            data: {
                username: $('#username').val(),
                password: $('#password').val(),
            },
            dataType: 'json',
            success: function (result) {
                console.log(result);
                if (result.code == 0) {
                    alert("登录成功！");
                    location.href = "infocenter";
                } else {
                    alert(result.message);
                }
            }
        })
    }
})