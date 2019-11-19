/**
 * Created by yangzhenj on 2018/5/26.
 */
window.onload = function () {
    var loginMobileExist = '';
    var regMobileExist = '';
    var isAgree = true
    $('form').submit(function (e) {
        e.preventDefault()
    })
    // 登录方式切换
    $('#normalLoginLi').click(function () {
        $('.login_btn').attr('form','defaultWayForm')
        $('.default_way_form').removeClass('hide')
        $('.phone_way_form').addClass('hide')
        $('#normalLogin').prev().attr('src','../../img/login/radio_box_choosed.png')
        $('#phoneLogin').prev().attr('src','../../img/login/radio_box_no.png')
        $('.radio_area li').eq(0).addClass('way_li_active')
        $('.radio_area li').eq(0).siblings().removeClass('way_li_active')
    });
    $('#phoneLoginLi').click(function () {
        $('.login_btn').attr('form','phoneWayForm')
        $('.default_way_form').addClass('hide')
        $('.phone_way_form').removeClass('hide')
        $('#phoneLogin').prev().attr('src','../../img/login/radio_box_choosed.png')
        $('#normalLogin').prev().attr('src','../../img/login/radio_box_no.png')
        $('.radio_area li').eq(1).addClass('way_li_active')
        $('.radio_area li').eq(1).siblings().removeClass('way_li_active')
    })
    //是否记住密码&是否同意协议
    $('.remember_div').click(function () {
        $('#rememberPwd').prop('checked', !$('#rememberPwd').prop('checked'))
        if($('#rememberPwd').prop('checked')){
            $(this).find('img').attr('src','../../img/login/check_box_choosed.png')
        }else{
            $(this).find('img').attr('src','../../img/login/check_box_no.png')
        }
    })
    $('#agreeDiv').click(function () {
        $('#agreeCheck').prop('checked', !$('#agreeCheck').prop('checked'));
        isAgree = !isAgree
        if($('#agreeCheck').prop('checked')){

            $(this).find('img').attr('src','../../img/login/check_box_choosed.png')
        }else{

            $(this).find('img').attr('src','../../img/login/check_box_no.png')
        }
    })
    /*******表单验证********/
    $("#username").keyup(function(){
        checkEmpty($(this));
    });
    $("#password").keyup(function(){
        checkEmpty($(this));
    });

    $(".phone_num").keyup(function(){
        checkEmpty($(this));
    });
    $(".phone_num").blur(function(){
        if(!checkMobile($(this)) || !checkEmpty($(this))){
            $("#yzm").addClass("btn_disable");
            $("#yzm").attr("disabled",true);
            $('.btn_disable').parent().addClass('disable_span')
        }
        $("#yzm").removeClass("btn_disable");
        $("#yzm").attr("disabled",false);
        $('.btn_disable').parent().removeClass('disable_span')
        var mobile = $(this).val();
        HttpUtils.post('mobile/checkexist', {"mobile":mobile},isExistedMobile);
        //checkMobile($(this));
    });
    $("#validateCode").keyup(function(){
        checkEmpty($(this));
    });
    //获取登录yzm
    $('#yzm').on('click',function () {
        if(!checkMobile($('#phone')) || !loginMobileExist){

            //alert(false)
            return
        }
        getYzm('yzm',handleFn)
    })

    //登录
    $('.login_btn').click(function(){
        var form = $(this).attr('form');
        var formData = {};
        if(form == "defaultWayForm"){
            if(checkEmpty($("#username")) && checkEmpty($("#password"))){
                formData.username = $("#username").val();
                formData.password = $("#password").val();
                HttpUtils.post('login/normal', formData,loginSuccess,loginError);

            }
        }else{
            formData.mobile = $("#phone").val();
            formData.validatecode = $("#validatecode").val();
            HttpUtils.post('login/mobile', formData,loginSuccess,loginError);
        }
    });
    /****注册验证****/
    $('#registerPhone,#regvalidCode,#register_pwd,#re_register_pwd').keyup(function () {
        checkEmpty($(this))
    })
    /*$('#regvalidCode,#register_pwd,#re_register_pwd').blur(function () {
        checkEmpty($(this))
    })*/
    $("#registerPhone").blur(function(){
        var mobile = $(this).val();

        if(!checkEmpty($(this)) || !checkMobile($(this))){
            $("#reg-validate-btn").addClass("btn_disable");
            $("#reg-validate-btn").attr("disabled",true);
            $('.btn_disable').parent().addClass('disable_span')
            return;
        }
        $('.btn_disable').parent().removeClass('disable_span')
        $("#reg-validate-btn").removeClass("btn_disable");
        $("#re_register_pwd").attr("disabled",false);
        HttpUtils.post('mobile/checkexist', {"mobile":mobile},isExistedReMobile);

    });
    //获取注册验证码
    $("#reg-validate-btn").click(function(){
        if(!checkMobile($('#registerPhone')) || !regMobileExist){
            //alert(false)
            return
        }
        getYzm('reg-validate-btn',handleFnRe)
    })
    // 注册
    $('.register_btn').click(function(){
        if(!isAgree){
            $.alert('请同意协议')
            return

        }
        if(!checkEmpty($("#registerPhone")) || !checkMobile($("#registerPhone"))){
            return;
        }
        if(!checkEmpty($("#regvalidCode"))){
            return;
        }
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
        formData.mobile = $("#registerPhone").val();
        formData.authCode = $("#regvalidcode").val();
        formData.password = password;
        HttpUtils.post('${request.contextPath}/register/save', formData,regSuccess,regError);
    });
    function isExistedMobile(data) {
        if(!data.data){
            $("#validate").addClass("btn_disable");
            $("#validate").attr("disabled",true);
            showErrorMessage("mobile","手机号不存在");
            loginMobileExist = false;
        }else{
            loginMobileExist = true;
            $("#validate").removeClass("btn_disable");
            $("#validate").attr("disabled",false);
            showErrorMessage("mobile","");
        }
    }
    function isExistedReMobile(data) {
        if(data.data){
            $("#reg-validate-btn").addClass("btn_disable");
            $("#reg-validate-btn").attr("disabled",true);
            regMobileExist=true;
            showErrorMessage("registerPhone","手机号码已存在");
        }else{
            $("#reg-validate-btn").removeClass("btn_disable");
            $("#reg-validate-btn").attr("disabled",false);
            regMobileExist=false;
            showErrorMessage("registerPhone","");
        }

    }
    function handleFn() {
        $.alert("验证码已发送,请注意查收",function () {
            $('#validateCode').prop('disabled',false)
        })
    }
    function handleFnRe() {
        $.alert("验证码已发送,请注意查收",function () {
            $('#regvalidCode').prop('disabled',false)
        })
    }
    function loginSuccess(data) {
        window.location.href = '${request.contextPath}';
    }
    function loginError(data) {
        if(data.code == 4011){
            showErrorMessage("username",data.message);
        }else{
            showErrorMessage("password",data.message);
        }
    }
    function regSuccess() {
        window.location.href = 'login';
    }
    function regError(data) {
        if(data.code == 4011){
            showErrorMessage("regvalidcode","验证码错误");
        }else{
            $.alert('出错了')
        }
    }



    /*验证码按钮不能点击状态*/
}


