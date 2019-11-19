/**
 * Created by yangzhenj on 2018/6/7.
 */
/*******修改头像******/
$('#avator').click(function () {
    $('#uploaderInput').trigger('click')
});
var uploadCount = 0, uploadList = [];

var MAX_HEIGHT = 800;

function render(src, picname, fileObj) {
    // alert(src)
    //alert(picname)
    // 创建一个 Image 对象
    var image = new Image();
    // 绑定 load 事件处理器，加载完成后执行
    image.onload = function () {
        // 获取 canvas DOM 对象
        var canvas = document.createElement("canvas");
        // 如果高度超标
        if (image.height > MAX_HEIGHT && image.height >= image.width) {
            // 宽度等比例缩放 *=
            image.width *= MAX_HEIGHT / image.height;
            image.height = MAX_HEIGHT;
        }
        //考录到用户上传的有可能是横屏图片同样过滤下宽度的图片。
        if (image.width > MAX_HEIGHT && image.width > image.height) {
            // 宽度等比例缩放 *=
            image.height *= MAX_HEIGHT / image.width;
            image.width = MAX_HEIGHT;
        }

        // 获取 canvas的 2d 画布对象,
        var ctx = canvas.getContext("2d");
        // canvas清屏，并设置为上面宽高
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 重置canvas宽高
        canvas.width = image.width;
        canvas.height = image.height;
        // 将图像绘制到canvas上
        ctx.drawImage(image, 0, 0, image.width, image.height);
        var blob = canvas.toDataURL("image/jpeg", 0.5);
        //将转换结果放在要上传的图片数组里
        fileObj.url = blob
        //模拟预览 应该是成功之后
        console.log(blob)

        return fileObj
    };
}

/* weui.uploader('#uploader', {
 url: '${request.contextPath}/livable/upload',
 onBeforeQueued: function (files) {
 // `this` 是轮询到的文件, `files` 是所有文件
 if (["image/jpg", "image/jpeg", "image/png", "image/gif"].indexOf(this.type) < 0) {
 $.alert('请上传图片');
 return false; // 阻止文件添加
 }
 if (this.size > 10* 1024 * 1024) {
 $.alert('请上传不超过10M的图片');
 return false;
 }
 ++uploadCount;
 console.log(1,this)

 },
 onQueued: function () {
 uploadList.push(render(this.url,this.name,this))
 //console.log(this);

 },
 onSuccess: function (ret) {
 console.log(this, ret);

 if (ret.code === layui.cache.code_success) {
 $('#avator').attr('src',this.url);
 // weui.alert(ret.data.name)
 $.ajax({
 url: '${request.contextPath}/livable/user/editPersionalInfo',
 type:'post',
 data:{
 avatar : ret.data.name
 },
 success:function(res) {

 if (res.code == 200) {
 //更新头像
 $("#avatar").attr('src', res.data.avatar);
 }
 },
 error:function (error) {
 console.log(error);
 }
 })
 }
 },
 onError: function (err) {
 console.log(this, err);
 }
 });*/
$(function () {
    // 允许上传的图片类型
    var allowTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
    // 1024KB，也就是 1MB
    var maxSize = 1024 * 1024 * 10;
    // 图片最大宽度
    var maxWidth = 300;
    // 最大上传图片数量
    var maxCount = 1;
    $('#uploaderInput').on('change', function (event) {
        var files = event.target.files;
        // 如果没有选中文件，直接返回
        if (files.length === 0) {
            return;
        }
        for (var i = 0, len = files.length; i < len; i++) {
            var file = files[i];
            var reader = new FileReader();
            // 如果类型不在允许的类型范围内
            if (allowTypes.indexOf(file.type) === -1) {
                $.alert({
                    text: '该类型不允许上传'
                });
                continue;
            }
            if (file.size > maxSize) {
                $.alert({
                    text: '图片太大，不允许上传'
                });
                continue;
            }
            if ($('.weui_uploader_file').length >= maxCount) {
                $.alert({
                    text: '最多只能上传' + maxCount + '张图片'
                });
                return;
            }
            reader.onload = function (e) {
                var img = new Image();
                img.onload = function () {
                    // 不要超出最大宽度
                    var w = Math.min(maxWidth, img.width);
                    // 高度按比例计算
                    var h = img.height * (w / img.width);
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    // 设置 canvas 的宽度和高度
                    canvas.width = w;
                    canvas.height = h;
                    ctx.drawImage(img, 0, 0, w, h);
                    var base64 = canvas.toDataURL('image/png');

                    // 插入到预览区


                    $('.preview_img').find('img').attr('src', base64)
                    var formData = new FormData()
                    formData.append('type', file.type);
                    // size
                    formData.append('size', file.size || "image/jpeg");
                    // name
                    formData.append('name', file.name);
                    // lastModifiedDate
                    formData.append('lastModifiedDate', file.lastModifiedDate);
                    // append 文件
                    formData.append('file', file);
                    /* $.ajax({
                     type:'post',
                     url:'http://www.c1yj.com/weChat/livable/upload',
                     data:formData,
                     contentType : false,
                     processData:false,
                     mimeType:"multipart/form-data",
                     success:function(data){console.log(data)}
                     })*/


                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
});

/*****修改手机号***/
$('.weui-navbar__item').click(function () {
    $('.weui-mask,.weui-dialog').remove()
})

$('.change_phone').click(function () {
    $(this).hide()
    $('.get_new_phone').show(100)
})
function checkEmpty(inputObj, str) {
    var value = $.trim(inputObj.val());
    if (value == "") {
        $.alert(str)
        return false;
    }
    return true;
}
function checkMobile(inputObj, str) {
    var value = $.trim(inputObj.val());
    if(!DcUtils.isMobile(value)){
        $.alert(str)
        return false;
    }
    return true;
}
$('.newphone').blur(function () {
    if(checkEmpty($('.newphone'), '手机号不能为空')){
        checkMobile($('.newphone'), '手机号格式不正确')
    }

})
$('#validateCode,#validateCode1').blur(function () {
    checkEmpty($(this), '验证码不能为空')
})
//保存修改
$('.save_edit_btn').click(function () {
    if ($('.get_new_phone').is(':visible')) {
        if (!checkEmpty($('.newphone'), '手机号不能为空')) {
            return
        }
        if (!checkMobile($('.newphone'), '手机号格式不正确')) {
            return
        }
        if (!checkEmpty($('#validateCode'), '验证码不能为空')) {
            return
        }

        var formData = {};
        formData.nickname = $(".nick_name").val();
        formData.newphone = $(".newphone").val();
        //HttpUtils.post('${request.contextPath}/register/save', formData,regSuccess,regError);
    }

});


/*****修改密码**/
//方式
$('#normalChangeLi').click(function () {
    $('.weui-mask,.weui-dialog').remove()
    $('.save_btn').attr('form', 'defaultWayForm')
    $('.default_way_form').removeClass('hide')
    $('.phone_way_form').addClass('hide')
    $('#normalChange').prev().attr('src', '../../img/login/radio_box_choosed.png')
    $('#phoneChange').prev().attr('src', '../../img/login/radio_box_no.png')
    $(this).css('color', '#ff8200')
    //$(this).prev().find('label').css('color','#8B8EA0')
});
$('#phoneChangeLi').click(function () {
    $('.weui-mask,.weui-dialog').remove()
    $('.save_btn').attr('form', 'phoneWayForm')
    $('.default_way_form').addClass('hide')
    $('.phone_way_form').removeClass('hide')
    $('#phoneChange').prev().attr('src', '../../img/login/radio_box_choosed.png')
    $('#normalChange').prev().attr('src', '../../img/login/radio_box_no.png')
    $(this).css('color', '#ff8200')
    //$(this).prev().find('label').css('color','#8B8EA0')
})
//通过密码
$('.old_password').blur(function () {

    checkEmpty($(this), '旧密码不能为空')
    //$('.old_password').next().attr('src','../../img/login/ok.png')
    //校验旧密码
    /* HttpUtils.get('/checkOldPwd',$(this).val(),function () {
     $('.old_password').next().attr('src','../../img/login/ok.png')
     })*/
})
$('.new_password').keyup(function () {

    var val = $(this).val()
    if (val && val.length >= 6) {
        $(this).next().attr('src', '../../img/login/ok.png')
    } else {
        $(this).next().attr('src', '../../img/login/ok_gray.png')
    }
})
$('.new_password').blur(function () {

    var val = $(this).val()
    if (val && val.length >= 6) {
        $(this).next().attr('src', '../../img/login/ok.png')
    } else if (!val) {
        $.alert('新密码不能为空');
        stopScroll($('.weui-mask'));
        return false
    } else {
        $.alert('新密码不能少于6位');
        stopScroll($('.weui-mask'));
        return false
    }
})
$('.confirm_password').keyup(function () {
    var val = $(this).val()
    if (val == $(this).parent().prev().find('.new_password').val().trim()) {
        $(this).next().attr('src', '../../img/login/ok.png')
    } else {
        $(this).next().attr('src', '../../img/login/ok_gray.png')
    }
})

$('.confirm_password').blur(function () {

    var val = $(this).val()
    if (val && val.length >= 6 && val == $('.new_password').val().trim()) {
        $(this).next().attr('src', '../../img/login/ok.png')
    } else if (!val) {
        $.alert('新密码不能为空');
        stopScroll($('.weui-mask'));
        return false
    } else if (val.length < 6) {
        $.alert('新密码不能少于6位');
        stopScroll($('.weui-mask'));
        return false
    } else if (!val == $('.new_password').val().trim()) {
        $.alert('两次密码不一致');
        stopScroll($('.weui-mask'));
        return false
    }
})
$('.save_btn').click(function () {
    if($(this).attr('form')=='defaultWayForm'){
        if (!checkEmpty($('.old_password'), '旧密码不能为空')) {
            return
        }
        if (!checkEmpty($('.new_password'), '新密码不能为空')) {
            return
        }
        if (!checkEmpty($('.confirm_password'), '确认密码不能为空')) {
            return
        }
        var formData = {};
        formData.old_pwd = $(".old_password").val();
        formData.new_password = $(".new_password").val();
    }else{
        if (!checkEmpty($('.phone_num'), '手机号不能为空')) {
            return
        }
        if(!checkEmpty($('#validateCode1'),'验证码不能为空')){
            return
        }
        if (!checkEmpty($('.new_password').eq(1), '新密码不能为空')) {
            return
        }
        if (!checkEmpty($('.confirm_password').eq(1), '确认密码不能为空')) {
            return
        }
        var formData = {};
        formData.old_pwd = $(".old_password").val();
        formData.new_password = $(".new_password").val();
    }

    /*HttpUtils.post('/changeCode', formData,function () {
     $.alert('修改成功')
     },regError);*/
})

//通过验证码
$('.phone_num').keyup(function () {
    if(DcUtils.isMobile($(this).val())){
        $(this).next().attr('src','../../img/login/ok.png')
    }else{
        $(this).next().attr('src','../../img/login/ok_gray.png')
    }
})
$('.phone_num').blur(function () {
    if( checkEmpty($('.phone_num'), '手机号不能为空')){
        if(checkMobile($('.phone_num'), '手机号格式不正确')){
            $(this).next().attr('src','../../img/login/ok.png')
        }else{
            $(this).next().attr('src','../../img/login/ok_gray.png')
        }

    }
})
function regSuccess() {
    window.location.href = 'login';
}
function regError(data) {
    if (data.code == 4011) {
        showErrorMessage("regvalidcode", "验证码错误");
    } else {
        $.alert('出错了')
    }
}