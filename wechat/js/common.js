/**
 * Created by yangzhenj on 2018/5/26.
 */
/*****rem*****/
var psd_width = 375,
    win_width = document.documentElement.clientWidth,
    viewport = document.querySelector('meta[name="viewport"]'),
    dpr = window.devicePixelRatio || 1,
    scale = 1 / dpr,
    rem;
//console.log(win_width,document.documentElement.clientWidth)
//$(viewport).remove();
//$("head").append('<meta name="format-detection" content="telephone=no, email=no"/><meta name="viewport" content="width=1,user-scalable=no,target-densitydpi=device-dpi">');
var style = document.createElement('style');
rem = win_width / psd_width * 100;
style.innerHTML = "html{font-size:" + rem + "px!important;}";
document.querySelector("head").appendChild(style);
/*********去除form提交*************/

/*********验证码**********/
function getYzm(id,handleYzm) {
    $('.yzm_btn_span').removeClass('border_all')
    var time = null;
    var i = 60;
    $("#" + id).val(i + '秒后重发');
    $("#" + id).addClass("btn_disable");
    $("#" + id).attr("disabled", true);
    $("#" + id).parents('li').find('input').eq(0).prop('disabled',true)
    time = setInterval(function () {
        i--;
        $("#" + id).val(i + '秒后重发');
        if (0 === i) {
            $("#" + id).val('获取验证码');
            $("#" + id).removeClass('btn_disable')
            $('.yzm_btn_span').addClass('border_all')
            $("#" + id).attr('disabled', false)
            clearInterval(time);
        }
    }, 1000);
    //ajax
    var phone = $("#phone").val();
    var url = '';
    //handleYzm()
    HttpUtils.post(url, {'phone': phone}, handleYzm)

}
/**********表单验证************/
function showErrorMessage(id,errorMessage){
    var parent = $("#"+id).parent();
    parent.children("label").remove();
    if(!errorMessage){return}
    if(id=="validateCode" || id=="regvalidCode" || id=="validatecode" || id=='validateCode1'){
        $("#"+id).after("<label class=\"error\" style=\"display:block;right:110px;\"><i class=\"weui-icon-warn\"></i>"+errorMessage+"</label>");
    }else{
        $("#"+id).after("<label class=\"error\" style=\"display:block\"><i class=\"weui-icon-warn\"></i>"+errorMessage+"</label>");
    }
}

function checkEmpty(inputObj){
    var id = inputObj.attr("id");
    var value = $.trim(inputObj.val());
    if(value==""){
        showErrorMessage(id,"不能为空");
        return false;
    }
    showErrorMessage(id,"");
    return true;
}

function checkMobile(inputObj){
    var id = inputObj.attr("id");
    var value = $.trim(inputObj.val());
    if(!DcUtils.isMobile(value)){
        showErrorMessage(id,"不是合法的手机号码");
        return false;
    }
    showErrorMessage(id,"");
    return true;
}
/***获取行政区****/
/*
function getDistrice() {
    HttpUtils.get('../mock/distrct.json','',function (data) {
        return data.data
    })
}*/
/***********/
var startX, startY;
var isFirst = true//判断是否是第一次 下滑
var distop
document.addEventListener('touchstart',function (ev) {
    startX = ev.touches[0].pageX;
    startY = ev.touches[0].pageY;
    if(distop == 0){
        isFirst == true
    }
}, false);

function rejectWxBonus(obj,e) {

    //滑动处理
    distop = obj.find('li').eq(0).position().top
    console.log(distop)
    if(distop == 0){
        isFirst == true
    }else{
        isFirst == false

    }
    console.log(isFirst)
    e = event || window.event
//获取滑动屏幕时的X,Y
    endX = e.changedTouches[0].pageX,
        endY = e.changedTouches[0].pageY;
//获取滑动距离
    distanceX = endX-startX;
    distanceY = endY-startY;
//判断滑动方向

    if(Math.abs(distanceX)<Math.abs(distanceY) && distanceY>0 && isFirst && distop<= 0){//向下
        console.log('禁止微信下拉')
        e.preventDefault()
    }else{
        isFirst = false
        e.stopPropagation()
        console.log(distop)
    }}

/*******禁止滚动*****/
function stopScroll(obj){
    obj.on('touchmove',function (e) {
        e = event || window.event
        e.preventDefault()
    })
}
/***********时间选择方法**********/
/*初始化时间选择(包含年月日)*/
function calendarPick(id,valueWrapId,closeCallback,closeNormalHandle){
    //限制当天也可预约
    /*var yesterday = new Date(new Date()-24*60*60*1000)//取前一天的时间
    var year = yesterday.getFullYear()
    var month = yesterday.getMonth()+1
    if(month<10){month='0'+month}
    var date = yesterday.getDate()*/
    //当天不能预约
    var today = new Date(new Date())
    var year = today.getFullYear()
    var month = today.getMonth()+1
    if(month<10){month='0'+month}
    var date = today.getDate()
    if(date<10){date='0'+date}
    var day2 = year+'-'+month+'-'+date
    //获取明天
    var tomorrow = new Date();
    tomorrow.setTime(tomorrow.getTime()+24*60*60*1000);
    var day3 = tomorrow.getFullYear()+"-" + (tomorrow.getMonth()+1) + "-" + tomorrow.getDate();
    //拼接时间
    //$('#'+id).val(year+'-'+month+'-'+date)
    $("#"+id).calendar({
        minDate:day2,
        closeOnSelect:true,//用户选择一个时间后就自动关闭
        dateFormat:'yyyy-mm-dd',
        onChange:function (p,values,displayValues) {
            console.log(values,displayValues)
            $('#'+valueWrapId).val(values)
            // console.log( $('#'+valueWrapId).val())
        },
        onClose:function (p) {
            console.log( $('#'+valueWrapId).val())
            if(p.params.minDate == $('#'+valueWrapId).val()){
                closeCallback()
            }else if(typeof closeNormalHandle != 'undefined' && closeNormalHandle instanceof Function){
                closeNormalHandle()
            }
        }
    });
    $('#'+id).on('click',function () {
        $('.weui-picker-container').on('touchmove',function (e) {
            console.log(1)
            e=event || window.event;
            e.preventDefault()
        })
    })
}
/*初始化时间选择(包含年月日时间)*/
function timePicker(id,valueWrapId) {
    var year = new Date().getFullYear()
    var month = new Date().getMonth()+1
    if(month<10){month='0'+month}
    var date = new Date().getDate()
    if(date<10){date='0'+date}
    $('#'+id).datetimePicker({
        min:year+'-'+month+'-'+date,
        onChange:function (res) {
            var arr = res.displayValue
            $('#'+valueWrapId).val(res.displayValue[0]+'-'+res.displayValue[1]+'-'+res.displayValue[2])
        }
    })
    $('#'+id).on('click',function () {

        $('.weui-picker-container').on('touchmove',function (e) {
            console.log(1)
            e=event || window.event;
            e.preventDefault()
        })
    })
}
/***根据时间转换为 几小时前 几天前**/
function getDateDiff(date){
    var date  = Date.parse(date.replace(/-/gi,"/"));//转换标准时间不然从八点起算 改完后从00:00
    var dateTimeStamp = new Date(date).getTime()
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if(diffValue < 0){return;}
    var monthC =diffValue/month;
    var weekC =diffValue/(7*day);
    var dayC =diffValue/day;
    var hourC =diffValue/hour;
    var minC =diffValue/minute;
    if(monthC>=1){
        result="" + parseInt(monthC) + "月前";
    }
    else if(weekC>=1){
        result="" + parseInt(weekC) + "周前";
    }
    else if(dayC>=1){
        result=""+ parseInt(dayC) +"天前";
    }
    else if(hourC>=1){
        result=""+ parseInt(hourC) +"小时前";
    }
    else if(minC>=1){
        result=""+ parseInt(minC) +"分钟前";
    }else
        result="刚刚";
    return result;
}
//判断是否微信登陆
function isWx() {
    var ua = window.navigator.userAgent.toLowerCase();
    console.log(ua);//mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}
//是否是安卓
function isAndroid() {
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    return isAndroid
}
//是否ios
function isIos() {
    var u = navigator.userAgent, app = navigator.appVersion;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    return isIOS
}
//替换*  str 开始位置 结束位置
function plusXing (str,frontLen,endLen) {
    var len = str.length-frontLen-endLen;
    var xing = '';
    for (var i=0;i<len;i++) {
        xing+='*';
    }
    return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);
}

//部分机型微信公众号键盘弹回页面出现留白，fixed定位输入框焦点错位情况
function scrollfixed(){
    var bodyscrollnow;
    $(document).on('focusin', function () {
        bodyscrollnow=$(document).scrollTop();
    });

    $(document).on('focusout', function () {
        //软键盘收起的事件处理
        $(window).scrollTop(bodyscrollnow);
    });
}

if(isIos()){
    scrollfixed();
}