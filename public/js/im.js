$(function () {
    $('#chats').height($(window).height() - 200);

    $('.materialboxed').materialbox();

    Materialize.updateTextFields();
    var serverip = '127.0.0.1'
    if (window.WebSocket) {
        var ws = new WebSocket('ws://' + serverip + ':8888');
        ws.onopen = function (e) {
            console.log('connected');
            $('#sender').on('click', function () {
                if ($('#userInputBox').val() != "") {
                    var message = {
                        user: $("#myNick").text(),
                        msg: $('#userInputBox').val(),
                        isData: false
                    }
                    ws.send(JSON.stringify(message));
                    $('#userInputBox').val("");
                } else {
                    Materialize.toast('消息为空', 2000);
                }
            })
            document.onkeydown = function (e) { // 回车提交表单
                // 兼容FF和IE和Opera
                var theEvent = window.event || e;
                var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
                if (code == 13) {
                    if ($('#userInputBox').val() != "") {
                        var message = {
                            user: $("#myNick").text(),
                            msg: $('#userInputBox').val(),
                            isData: false
                        }
                        ws.send(JSON.stringify(message));
                        $('#userInputBox').val("");
                    } else {
                        Materialize.toast('消息为空', 2000);
                    }
                    return false;
                }
            }
        }
        ws.onclose = function (e) {
            window.location.reload();
            console.log("服务器关闭");

        }
        ws.onerror = function () {
            console.log("连接出错");
        }
        ws.onmessage = function (e) {

            var info = JSON.parse(e.data);
            var nm = "";

            if (!info.isData) {
                if (info.user != $('#myNick').text()) { //others text
                    nm = document.querySelector('#othersChat');
                    nm.content.querySelectorAll('span')[0].innerText = info.user;
                    nm.content.querySelectorAll('span')[1].innerText = info.mes;

                } else {
                    var nm = document.querySelector('#mychat'); //mt text
                    nm.content.querySelectorAll('span')[0].innerText = info.user;
                    nm.content.querySelectorAll('span')[1].innerText = info.mes;

                }
            } else {
                console.log('data');
                if (info.user != $('#myNick').text()) { //other file
                    var nm = document.querySelector('#othersChatImg');
                    nm.content.querySelectorAll('span')[0].innerText = info.user;
                    nm.content.querySelectorAll('img')[1].src = info.mes;

                } else {
                    var nm = document.querySelector('#mychatImg'); //my files
                    nm.content.querySelectorAll('span')[0].innerText = info.user;
                    nm.content.querySelectorAll('img')[1].src = info.mes;
                }
            }
            console.log(nm.content);


            $('.chats').append(nm.content.cloneNode(true));
            $('.chats').scrollTop($('.chats')[0].scrollHeight);
            $('.materialboxed').materialbox();
        }

        var onlineUser = new WebSocket('ws://' + serverip + ':8963');
        onlineUser.onopen = function (e) {
            onlineUser.send($("#myNick").text());
        }
        onlineUser.onclose = function () {
            onlineUser.send($("#myNick").text());
        }
        onlineUser.onmessage = function (e) {
            //console.log(e.data);
            var userStat = JSON.parse(e.data);
            var joinUserMsg = document.querySelector('#userJoined');
            if (userStat.stat == 'join') {
                joinUserMsg.content.querySelectorAll('div')[1].innerText = userStat.name + '加入对话';
            } else {
                joinUserMsg.content.querySelectorAll('div')[1].innerText = userStat.name + '退出对话';
            }
            $('.chats').append(joinUserMsg.content.cloneNode(true));
            $('#userList').text(userStat.userList);
        }
    }

})

function chooseFile() {
    $('#newImg').click();
}
$(function () {
    $("#newImg").on("change", function (e) {
        var e = e || window.event;
        var files = e.target.files;
        var file = files[0];
        e.target.value = null;
        if (file != null) {
            if (window.WebSocket) {
                serverip = '127.0.0.1';
                var ws = new WebSocket('ws://' + serverip + ':8888');
                ws.onopen = function (e) {
                    var reader = new FileReader();
                    var dataURL;
                    var data;
                    reader.readAsDataURL(file);
                    reader.onload = function (ev) {
                        dataURL = ev.target.result;
                        data = {
                            file: dataURL,
                            user: $('#myNick').text(),
                            isData: true
                        }
                        // console.log(data);

                        d = JSON.stringify(data);

                        ws.send(d);

                    }

                }
            }
        }
    })
})