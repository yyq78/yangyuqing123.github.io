/**
 * Created by YYQ on 2018/3/18.
 */


    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    $(document).ajaxSend(function(e, xhr, options) {
        xhr.setRequestHeader(header, token);
    });

//打开摄像头
var video=document.getElementById('video');
navigator.mediaDevices.getUserMedia({
    video:true
}).then(function(mediaStream){
    video.srcObject=mediaStream;
    video.onloadedmetadata=function(){
        video.play();
    }
});
var canvas=document.getElementById('canvas');
var context=canvas.getContext("2d");
var snap=document.getElementById('snap');
//截取图像
snap.onclick=function(){
    context.drawImage(video,0,0,300,300);
    video.style.display="none";
    canvas.style.display="inline-block";
    var imgData = canvas.toDataURL();
    //获取图像在前端截取22位以后的字符串作为图像数据
    var imgData1 = imgData.substring(22);
    var username=$.cookie("username");
    var flag=$.cookie("flag");
    console.log(username);
    console.log(flag);
    if(flag==0) {
        $.ajax({
            type: "POST",
            url: '/faceCheck?tag=register',
            dataType: 'json',
            data: {"img": imgData1,
                "username":username
            },
            success: function (data) {
                if (data == 1) {
                    alert("注册成功！");
                    window.location.replace("http://localhost:80/login_register")
                }
                else {
                    alert("注册失败，请重试~");
                    window.location.replace("http://localhost:80/faceCheck")
                }
            },
            error: function () {
                alert("请求失败");
            }
        });
    }
    else{
        $.ajax({
            type: "POST",
            url: '/faceCheck?tag=login',
            dataType: 'json',
            data: {"img": imgData1,
                "username":username
            },
            success: function (data) {
                if (data == 1) {
                    alert("登录成功！");
                    window.location.replace("http://localhost:80/index")
                }
                else {
                    alert("没有这张脸，请重试！");
                    window.location.replace("http://localhost:80/faceCheck")
                }
            },
            error: function () {
                alert("请求失败");
            }
        });
    }
}


