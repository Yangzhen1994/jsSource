/**
 * Created by yangzhenj on 2018/5/26.
 */
window.onload = function () {
    $('form').submit(function (e) {
        e.preventDefault()
    })
    var mobileExist = false;
    $("#mobile").blur(function(){
        var mobile = $(this).val();
        if(!checkEmpty($(this)) || !checkMobile($(this))){
            $("#validate").addClass("btn_disable");
            $("#validate").attr("disabled",true);
            return;
        }
        $("#validate").removeClass("btn_disable");
        $("#validate").attr("disabled",false);
        HttpUtils.post('${request.contextPath}/mobile/checkexist', {"mobile":mobile}, function(data){
            if(!data.data){
                $("#validate").addClass("btn_disable");
                $("#validate").attr("disabled",true);
                showErrorMessage("mobile","手机号不存在");
                mobileExist = false;
            }else{
                mobileExist = true;
                $("#validate").removeClass("btn_disable");
                $("#validate").attr("disabled",false);
                showErrorMessage("mobile","");
            }
        });
    });
    $("#validate").click(function(){
        /*if(!checkMobile($('#mobile')) || !mobileExist){

            //alert(false)
            return
        }*/
        getYzm('validate',handleFn)

    });

    $('#next_btn').click(function (e) {
        if(checkEmpty($("#mobile"))&&checkMobile($("#mobile"))&&checkEmpty($("#validateCode"))){
            var data = {};
            data.mobile=$("#mobile").val();
            data.validatecode=$("#validatecode").val();
            $('#card1').hide();
            $('#card2').show();
            pushHistory();
            HttpUtils.post("${request.contextPath}/password/checkcode",data,function(){
                $('#card1').hide();
                $('#card2').show();
            },function(data){
                showErrorMessage("validate","验证码不正确");
            });
        }
    })


    $('#register_pwd').keyup(function () {
        if($(this).val().length>=6) {
            showErrorMessage("register_pwd","")
            $('#register_pwd').next().show()

        }else{
            $('#register_pwd').next().hide()
        }
    })
    $('#re_register_pwd').keyup(function () {
        if($(this).val() == $('#register_pwd').val() && $(this).val().length>=6){
            $('#re_register_pwd').next().show()
        }else{
            $('#re_register_pwd').next().hide()
        }
    })
    $('#submit').click(function(){
        if(!checkEmpty($("#register_pwd"))){
            return;
        }
        if(!checkEmpty($("#re_register_pwd"))){
            return;
        }
        var password = $("#register_pwd").val();
        if(password.length<6){
            showErrorMessage("register_pwd","密码长度至少6位")
            return;
        }
        var repassword = $("#re_register_pwd").val();
        if(password != repassword){
            showErrorMessage("re_register_pwd","两次密码不相同")
            return;
        }
        var formData = {};
        formData.mobile = $("#mobile").val();
        formData.validatecode = $("#validatecode").val();
        formData.password = password;
        HttpUtils.post("${request.contextPath}/password/reset",formData,function(){
            window.location.href = '${request.contextPath}/login';
        },function(data){
            alert(data.message);
        });
    });



    window.addEventListener("popstate", function(e) {
        $('#card1').show()
        $('#card2').hide()
    }, false);
    function pushHistory() {
        var state = {
            title: "title",
            url: "#"
        };
        window.history.pushState(state, "title", "#");
    }


    function handleFn() {
        $.alert("验证码已发送,请注意查收",function () {
            $('#validateCode').prop('disabled',false)
        })
    }
}
