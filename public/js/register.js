document.onkeydown = function (event) { //在按下enter时也可以进行
    var e = event || window.event;
    if (e && e.keyCode == 13&&btn==1) {
        register();
    }
}

var btn = 0;
var isuser = 0;
var ispass = 0;

$(function () {
    $('#ucheck').hide();
    $('#pcheck').hide();
    $('#username').keyup(function () {
        var username = document.getElementById('username').value;
        
        $.ajax({
            type: 'post',
            url: 'api/user/checkusername',
            data: {
                username: $('#username').val(),
            },
            dataType: 'json',
            success: function (result) {
                console.log(result.code);
                if (result.code != 0) {
                    $('#ucheck').html(result.message);
                    $('#ucheck').show();
                    isuser = 0;
                    btn = 0;
                    $('#login-btn').css('background-color', 'grey');
                    $('#login-btn').css('cursor', 'not-allowed');
                    $('#login-btn').disabled = true;
                } else {
                    $('#ucheck').hide();                   
                    isuser = 1;
                    if (ispass == 1&&   $("#tk").is(':checked')) {
                        $('#login-btn').css('background-color', 'rgb(0, 121, 184)');
                        $('#login-btn').css('cursor', 'pointer');
                        $('#login-btn').disabled = false;
                         btn = 1;
                    }
                }
            }
        });
        if (username == "") {
            $('#login-btn').css('background-color', 'grey');
            $('#login-btn').css('cursor', 'not-allowed');
            $('#login-btn').disabled = true;
            btn = 0;
            isuser = 0;
        }else{
            if(ispass==1 &&   $("#tk").is(':checked') ){
                $('#login-btn').css('background-color', 'rgb(0, 121, 184)');
                        $('#login-btn').css('cursor', 'pointer');
                        $('#login-btn').disabled = false;
                        btn=1;
            }
        }
    })

    $('#password').keyup(function () {
        var password = document.getElementById('password').value;
        var username = document.getElementById('username').value;
        var cpassword = document.getElementById('cpassword').value;

        if (password != cpassword) {
            $('#pcheck').show();
        } else {
            $('#pcheck').hide();
        }

        if ((password == "") || (password != cpassword)) {
            ispass = 0;
            btn = 0;
            $('#login-btn').css('background-color', 'grey');
            $('#login-btn').css('cursor', 'not-allowed');
            $('#login-btn').disabled = true;

        } else {
            ispass = 1;
           
            if (isuser == 1 &&    $("#tk").is(':checked')) {
                $('#login-btn').css('background-color', 'rgb(0, 121, 184)');
                $('#login-btn').css('cursor', 'pointer');
                $('#login-btn').disabled = false; 
                btn = 1;
            }
        }
    })
    $('#cpassword').keyup(function () {
        var password = document.getElementById('password').value;
        var username = document.getElementById('username').value;
        var cpassword = document.getElementById('cpassword').value;

        if (password != cpassword) {
            $('#pcheck').show();
        } else {
            $('#pcheck').hide();
        }

        if ((password == "") || (password != cpassword)) {
            ispass = 0;
            btn = 0;
            $('#login-btn').css('background-color', 'grey');
            $('#login-btn').css('cursor', 'not-allowed');
            $('#login-btn').disabled = true;
        } else {
            ispass = 1;
          
            if (isuser == 1 &&    $("#tk").is(':checked')) {
                $('#login-btn').css('background-color', 'rgb(0, 121, 184)');
                $('#login-btn').css('cursor', 'pointer');
                $('#login-btn').disabled = false; 
                 btn = 1;
            }
        }
    })

    $('#tk').on('click',function(){
        if (isuser==1 && ispass==1 && $("#tk").is(':checked')) {
            $('#login-btn').css('background-color', 'rgb(0, 121, 184)');
            $('#login-btn').css('cursor', 'pointer');
            $('#login-btn').disabled = false; 
             btn = 1;
        }else{
            btn = 0;
            $('#login-btn').css('background-color', 'grey');
            $('#login-btn').css('cursor', 'not-allowed');
            $('#login-btn').disabled = true;
        }
    })


})

function register() {
    //ajax提交数据
    if (btn == 1) {
        $.ajax({
            type: 'post',
            url: 'api/user/register',
            data: {
                username: $('#username').val(),
                password: $('#password').val(),
                email: $('#email').val(),
                phone: $('#phone').val(),
                name: $('#name').val()
            },
            dataType: 'json',
            success: function (result) {
                console.log(result);
                if (result.code==0){
                    alert("注册成功！");
                    location.href='login';
                }
            }
        })
    }
}