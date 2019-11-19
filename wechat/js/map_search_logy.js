/**
 * Created by yangzhenj on 2018/6/8.
 */
var akKey = 'PtTLglRku1tDGsQPoK4HdEFvcd1QIc6e';
var reqForm = {};
var islocaltion = false;
var clicked16Label = '';
var clickdata;
var isFirst = true;
var mescrolld
//默认排序
reqForm.orderBy = "default";
reqForm.rentWay = []; //方式
reqForm.rentBill = []; //租金
reqForm.houseType = []; //房源类型
reqForm.area = []; //房源面积
reqForm.orientation = []; //房源朝向
reqForm.floor = []; //房源楼层
reqForm.decorattion = []; //房源装修
reqForm.feature = []; //房源特色
reqForm.arround = []; //房源周边
reqForm.state = []; //房源状态
$('.wrap_ul li').click(function () {
    var keyWord = $(this).text().trim();
    var keyWordArr =  reqForm[$(this).parent().attr('id').trim()]
    $(this).toggleClass('default');
    if($(this).hasClass('default')){
        keyWordArr.push(keyWord)
    }else{
        reqForm[$(this).parent().attr('id').trim()] = $.grep(keyWordArr, function(value) {
            return value != keyWord;
        });
    }
});
$('.confirm').on('click',function () {
    $('.mask').css('transform','translateX(100%)')
    findMapCount();
})
$('.clear').on('click',function () {
    resetBtn()
})
function resetBtn(){
    var chkboxs = $(".wrap_ul").find("li");
    chkboxs.removeClass('default');
    reqForm.rentWay = []; //方式
    reqForm.rentBill = []; //租金
    reqForm.houseType = []; //房源类型
    reqForm.area = []; //房源面积
    reqForm.orientation = []; //房源朝向
    reqForm.floor = []; //房源楼层
    reqForm.decorattion = []; //房源装修
    reqForm.feature = []; //房源特色
    reqForm.arround = []; //房源周边
    reqForm.state = []; //房源状态
    findMapCount();
    //$('.mask').css('transform','translateX(100%)')
}
$('#mapDiv').height(document.documentElement.clientHeight - $('.header').height()).css('margin-top',$('.header').height())


$("#searchPopSearch").keydown(function(e) {
    if (e.keyCode == 13) {
        reqForm.keyWords = $(this).val();
        $(this).blur()
        $.closePopup()
        $('#search').val(reqForm.keyWords)
        $(this).val('');

        findMapCount();
    }
});
//百度地图API功能
function loadJScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = 'http://api.map.baidu.com/api?v=2.0&ak=' + akKey + '&callback=init';
    document.body.appendChild(script);
}

window.init = function(){
    window.map = new BMap.Map("mapDiv");            // 创建Map实例
    var point = new BMap.Point(113.262744, 23.135574); // 创建点坐标

    map.setMinZoom(12);
    map.setMaxZoom(16);
    map.centerAndZoom(point, 12);
    // map.enableScrollWheelZoom();
    // 启用滚轮放大缩小
    map.addEventListener('zoomend', function () {
        if(map.getZoom() <=12 ){
            reqForm.coordinate = "";
        }else{
            var conds = [];
            var bounds = map.getBounds();
            var sw = bounds.getSouthWest();
            var ne = bounds.getNorthEast();
            conds.push(sw.lat);
            conds.push(sw.lng);
            conds.push(ne.lat);
            conds.push(ne.lng);
            reqForm.coordinate = conds.join(",");
        }
        findMapCount();
    });
    map.addEventListener('dragend', function () {
        if(map.getZoom() > 12 ){
            var conds = [];
            var bounds = map.getBounds();
            var sw = bounds.getSouthWest();
            var ne = bounds.getNorthEast();
            conds.push(sw.lat);
            conds.push(sw.lng);
            conds.push(ne.lat);
            conds.push(ne.lng);
            reqForm.coordinate = conds.join(",");
            findMapCount();
            //findPage();
        }
    });
}
loadJScript();  //异步加载地图

function findMapCount(){
    var zoomLevel = map.getZoom();
    //alert(zoomLevel)
    var mapLevel = 1;
    if (zoomLevel > 12 && zoomLevel < 16) {
        mapLevel = 2;
    } else if (zoomLevel >= 16) {
        mapLevel = 2
    }
    reqForm.mapLevel = mapLevel;

    var url = '../../mock/map_1.json';
    var params = createParams();
    console.log(params);
    HttpUtils.get(url,params,function(res){
        renderLabels(res.data);
    });
}


function renderLabels(countData) {
    var length = countData.length
    length = Math.round(length / 2)
    if (islocaltion) {
        var point = new BMap.Point(countData[length].lng, countData[length].lat); // 创建点坐标
        map.setCenter(point);
        islocaltion = false;
    }
    map.clearOverlays();  //del覆盖物
    countData.forEach(function (item, index) {
        if (item.roomCount == 0) {
            return false//去除房屋为0的区域
        }
        var this_point = new BMap.Point(item.lng, item.lat);
        var opts = {
            position: this_point,    // 指定文本标注所在的地理位置
            //设置文本偏移量
            offset: new BMap.Size(-50, -50)
        }
        var label;
        if (map.getZoom() >= 16) {
            var html = '<div code="'+item.code +'"><span class="name" style="padding: 0 10px">' + item.name + '</span><span class="count" style="padding: 5px;background-color: #fff;color: black;line-height: 15px">' + item.roomCount + '套</span></div>'
            label = new BMap.Label(html, opts);  // 创建文本标注对象
            label.setStyle({
                'height': '0.25rem',
                'lineHeight': '0.25rem',
                'boxSizing': 'border-box',
                'fontSize': '0.14rem',
                'fontFamily': "微软雅黑",
                'opacity':'0.9',
                'backgroundImage': 'linear-gradient(90deg, #FFAB42 0%, #FF8200 100%)',
                'cursor': 'pointer',
                'textAlign': 'center',
                'color': 'white',
                'border': 'none',
                'padding':'0'
            });
        } else if(map.getZoom() > 12 && map.getZoom() <16){
            var html = '<span code="'+item.code +'" class="name">'+item.name + '</span><span class="count" style="margin-left: 0.05rem">' + item.roomCount + '套</span><img class="sanjiao" src="../../img/map/sanjiao.png" alt=""/>';
            label = new BMap.Label(html, opts);  // 创建文本标注对象
            label.setStyle({
                'boxSizing': 'border-box',
                'padding': '0.06rem 0.14rem',
                'fontSize': '0.12rem',
                'fontFamily': "微软雅黑",
                'backgroundImage': 'linear-gradient(90deg, #FFAB42 0%, #FF8200 100%)',
                'borderRadius': '0.16rem',
                'cursor': 'pointer',
                'textAlign': 'center',
                'color': 'white',
                'border': 'none',
                'opacity':'0.9',
            });
        }else{
            var html = '<p code="'+item.code +'" class="name">'+item.name + '</p><p class="count">' + item.roomCount + '套</p>';
            label = new BMap.Label(html, opts);  // 创建文本标注对象
            label.setStyle({
                'width': '0.8rem',
                'height': '0.8rem',
                'boxSizing': 'border-box',
                'paddingTop': '0.16rem',
                'fontSize': '0.14rem',
                'fontFamily': "微软雅黑",
                'backgroundImage': 'linear-gradient(90deg, #FFAB42 0%, #FF8200 100%)',
                'borderRadius': '50%',
                'cursor': 'pointer',
                'textAlign': 'center',
                'color': 'white',
                'border': 'none'
            });
        }
        map.addOverlay(label);
        // 给每个label添加事件

        label.addEventListener("click", function () {
            var districtId = $(this.content).eq(0).attr("code");
            reqForm.districtId = districtId;
            if (map.getZoom() <= 12) {
                islocaltion = true;
                map.setZoom(14);
            }else if(map.getZoom() > 12 && map.getZoom() < 16){
                islocaltion = true;
                map.setZoom(16);
            }else{//点击小区名 获取当前小区下的房源 请求数据

                this.setStyle({
                    'backgroundImage': ' linear-gradient(132deg, #5BABFF 1%, #3375FF 98%)',
                })
                clicked16Label = this
                var buildName = $(this.content).find('.name').text().trim();
                var count = $(this.content).find('.count').text().trim();
                $('.house_list_header .building_name').text(buildName);
                //此处还应填写小区所在区域等信息 调用接口后补充
                $('.house_list_header .building_count').text(count);
                clickdata = {
                    buildName:buildName,
                    currentPage:1,
                    pageSzie:10
                }
                $('#houseListPop').popup()
                HttpUtils.get('../../mock/map_house.json',clickdata,function (res) {
                    renderHouseList(res)
                })
                mescrolld = scrollLoading('mescroll','maphouseList',clickdata)



            }
        });

    })
}
function createParams(current){
    var params = {};
    for(var key in reqForm){
        if(reqForm[key] instanceof Array){
            params[key] = reqForm[key].join(",");
        }else{
            params[key] = reqForm[key];
        }
    }
    if(current){
        params.pageCurrent = current;
    }else{
        params.pageCurrent = 1;
    }
    params.pageSize =  10;//Global.pageSize ||
    return params;
}
function renderHouseList(curPageData) {
    for (var i = 0; i < curPageData.length; i++) {
        var house=curPageData[i];
        var detailUrl = ''
        if(house.vrLook && house.roundLook){

        }else if(house.vrLook){
            var vrRound = '<a href="'+house.vrLook+'" class="vr_round">VR</a>'
        }else if(house.roundLook){
            var vrRound = '<a href="'+house.roundLook+'" class="vr_round">360&deg;</a>'
        }else{
            var vrRound = ''
        }

        if(!house.tags){
            var tags = ''
        }else{
            var tags = ''
            tagsArr = house.tags.split(',');

            if(tagsArr.length>3){
                tagsArr = tagsArr.slice(0,3)
            }
            $.each(tagsArr, function (i, item) {
                tags += '<span class="tag">' + item + '</span>'
            });
        }

        var html = '<li class="clearfix pr border_bottom">'+
            '<a href="' + detailUrl + '">' +
            '<div class="house_img pr">'+
            '<img src="'+house.mainPic+'" alt="">'+vrRound+
            '</div>'+
            '<div class="house_info">'+
            '<p class="house_title">'+house.title+'</p>'+
            '<div class="house_tips clearfix">'+
            '<span class="house_area">'+house.houseArea+'m<sup>2</sup></span><span class="line">|</span><span class="house_floors">'+house.belongFloor+'/'+house.totalFloor+'层</span>'+
            '<div class="price fr"><span class="price_before">￥</span>'+house.rent+'<span class="price_after" style="font-size: 0.12rem">元/月</span></div>'+
            '</div>'+
            '<div class="pr has_mestro">'+
            '<img src="../../img/house_list/map_icon_gray.png" alt=""><span>'+house.hasMetro+'</span>'+
            '</div>'+
            '<div class="tags">'+tags+
            '</div>'+
            '</div>'+
            '</a>'+
            '</li>'
        $('#maphouseList').append(html)
    }

}
$('#houseListPop .weui-popup__overlay').on('click',function () {
    mescrolld.destroy();
    mescrolld.showEmpty();
    mescrolld.clearDataList();
    /* mescrolld.destroy();*/
    clicked16Label.setStyle({
        'backgroundImage': 'linear-gradient(90deg, #FFAB42 0%, #FF8200 100%)'
    })
    clicked16Label='';
    // $('#mapDiv').css('top','0')
    $.closePopup()
})
function initScroll(){
    if(isFirst){
        isFirst = false
        scrollLoading('mescroll','maphouseList',clickdata)
    }else{
        isFirst = false
    }

}