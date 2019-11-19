/**
 * Created by yangzhenj on 2018/6/7.
 */
$('#mapDiv').height(document.documentElement.clientHeight - $('.arround_type_list').height())
/***********地图****************************/
var akKey = 'PtTLglRku1tDGsQPoK4HdEFvcd1QIc6e';
var initDatas, nlabels, districts,newMarkers= [];
var centerMarker, ply, tempTime, searchArr;

//百度地图API功能
function loadJScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = 'http://api.map.baidu.com/api?v=2.0&ak=' + akKey + '&callback=init';
    document.body.appendChild(script);
}

window.init = function(){
    window.map = new BMap.Map("mapDiv");            // 创建Map实例
    var point = new BMap.Point(113.32354,23.088981); // 创建点坐标
    //map.centerAndZoom(point, 12);
    // map.enableScrollWheelZoom();
    // 启用滚轮放大缩小
    var filterName = $('.active').text().trim()
    if(filterName=='商超'){
        filterName= ['超市','商场']
    }
    //addressToLatLng('海珠新港城',filterName);
    jiexi(point,filterName);
    $('.arround_type_list .item').on('click',function () {
        $('.arround_type_list .item').removeClass('active')
        $(this).addClass('active');
        /****修改选中未选中图片***/
        var oldSrc = $(this).find('img').attr('src');
        if(oldSrc.indexOf('_w')<0){
            $(this).find('img').attr('src','../../img/house_detail/'+oldSrc.split('/').reverse()[0].split('.')[0]+'_w.png')

        }
        var $ortherLi = $(this).siblings('.item')
        $ortherLi.each(function (index,item) {
            var oldSrc = $(item).find('img').attr('src');
            var newSrc = '../../img/house_detail/'+oldSrc.split('/').reverse()[0].split('.')[0].replace('_w','')+'.png'
            console.log(newSrc)
            $(item).find('img').attr('src',newSrc)
        })
        ply.enableMassClear();
        newMarkers = []
        var filterName = $(this).text().trim()
        if(filterName =='商超'){
            filterName = ['超市','商场']
        }
        //addressToLatLng('海珠新港城', filterName);
        var point = new BMap.Point(113.32354,23.088981); // 创建点坐标
        jiexi(point, filterName);
    })
}
loadJScript();  //异步加载地图
/*******根据地址解析***********/
/*function addressToLatLng(address,type){
    map.clearOverlays();
    var myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint(address, function(point){
        if (point) {
            map.centerAndZoom(point, 15);
            var myIcon = new BMap.Icon("../../img/house_detail/diingwei_icon.png", new BMap.Size(20,20),{imageOffset:0});
            centerMarker = new BMap.Marker(point,{icon:myIcon});
            map.addOverlay(centerMarker);
            centerMarker.disableMassClear()
            searchByTab(point,type)
        }else{
            $.alert("您选择地址没有解析到结果!");
            stopScroll($('.weui-mask'))
        }
    }, "广州市");
}*/
/*******根据坐标解析***********/
function jiexi(point,type){
    map.clearOverlays();
    var myGeo = new BMap.Geocoder();
    console.log(point);
    // 将坐标解析结果显示在地图上,并调整地图视野
    myGeo.getLocation(point, function(address){
        if (address!='') {
            map.centerAndZoom(point, 15);
            var myIcon = new BMap.Icon("../../img/house_detail/diingwei_icon.png", new BMap.Size(20,20),{imageOffset:0});
            centerMarker = new BMap.Marker(point,{icon:myIcon});
            map.addOverlay(centerMarker);
            centerMarker.disableMassClear()
            searchByTab(point,type)
        }else{
            //alert("您选择的坐标没有解析到结果!");
            map.centerAndZoom("广州市",15);
            /*stopScroll($('.weui-mask'))*/
        }
    }, "广州市");
}
/************范围搜索*****************/

function searchByTab(mPoint,filterName){
    ply = new BMap.Circle(mPoint,1000,{fillColor:"#3375FF", strokeWeight: 0.5 ,fillOpacity: 0.2, strokeOpacity: 0.8});
    map.addOverlay(ply);
    ply.disableMassClear()
    var arroundMarhers= [];
    var distances = [];

    var local =  new BMap.LocalSearch(map,

        {  /* pageCapacity:1,//显示一个结果*/
            renderOptions: {map: map, autoViewport: false,selectFirstResult:true},//panel: "diTieWrap"结果生成到右边 百度的自带
            onInfoHtmlSet:function (res) {
                console.log('indo',res)
            },
            onMarkersSet:function (res) {
                console.log(res)
                searchArr = res;
                map.clearOverlays()
                var addPointerArr = []
                res.forEach(function (item,index) {
                    addPointerArr.push(item.point)
                })
                console.log(addPointerArr)
                addPointerArr.forEach(function (item,index) {
                    /*var myIcon = new BMap.Icon('../../img/map/btn_subway.svg', new BMap.Size(32,40),{imageOffset:0});
                    var marker2 = new BMap.Marker(item,{icon:myIcon});*/
                    //var txt = "银湖海岸城", mouseoverTxt = txt + " " + parseInt(Math.random() * 1000,10) + "套" ;

                   // var txt = "银湖海岸城", mouseoverTxt = txt + " " + parseInt(Math.random() * 1000,10) + "套" ;

                    var myCompOverlay = new ComplexCustomOverlay(item,res[index].title,'',index);
                    newMarkers.push(myCompOverlay)

                    map.addOverlay(myCompOverlay);


                })
                console.log(newMarkers)

                // map.clearOverlays()
            },
        }
    );
    local.searchNearby(filterName,mPoint,1000);

    function ComplexCustomOverlay(point, text, mouseoverText,index){
        this._point = point;
        this._text = text;
        this._overText = mouseoverText;
        this.i = index
    }
    ComplexCustomOverlay.prototype = new BMap.Overlay();
    ComplexCustomOverlay.prototype.initialize = function(map){
        this._map = map;
        var div = this._div = document.createElement("div");
        div.style.position = "absolute";
        div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
        div.style.backgroundImage = "linear-gradient(90deg, #FFAB42 0%, #FF8200 100%)";
      /*  div.style.border = "1px solid #BC3B3A";*/
        div.style.color = "white";
        div.style.opacity = "0.9";
        div.style.height = "18px";
        div.style.padding = "5px";
        div.style.lineHeight = "18px";
        div.style.whiteSpace = "nowrap";
        div.style.MozUserSelect = "none";
        div.style.borderRadius = "9px";
        div.style.webkitBorderRadius = "9px";
        div.style.mozBorderRadius = "9px";
        div.style.fontSize = "12px"
        var span = this._span = document.createElement("span");
        div.appendChild(span);
        span.appendChild(document.createTextNode(this._text));
        var that = this;

        var arrow = this._arrow = document.createElement("div");
        arrow.style.background = "url(../../img/map/sanjiao.png) no-repeat";
        arrow.style.backgroundSize = "100% 100%";
        arrow.style.position = "absolute";
        arrow.style.width = "8px";
        arrow.style.height = "6px";
        arrow.style.bottom = "-5px";
        arrow.style.left = "42%";
        arrow.style.overflow = "hidden";
        div.appendChild(arrow);

        map.getPanes().labelPane.appendChild(div);

        div.addEventListener('touchend',function(e){
            var i = $(this).index()
            var content = '<div><div style="font-size: 0.14rem">'+searchArr[i].title+'<a class="pa" style="bottom:0px;right:0px;margin-left:0.15rem;color: #ff8200;font-size: 0.12rem" href="'+searchArr[i].detailUrl+'">'+'详情>></a></div><div style="font-size: 0.14rem">地址：'+searchArr[i].address+'</div>'
            console.log(searchArr[i].point)
            var opts = {
              //  width : 200,
                //height:'',
                //title : searchArr[i].title , // 信息窗口标题
            }
            var infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象
            //移动地图点击标记防止误触
            map.addEventListener('dragging',function () {
                window.isMove = true;
                console.log(isMove + 'dragging')
            })
            map.addEventListener('dragend',function () {
                window.isMove = false;
                console.log(isMove + 'dragend')
            })
            map.openInfoWindow(infoWindow,searchArr[i].point); //开启信息窗口*/
            /* var opts = {
             // width : 200,     // 信息窗口宽度
             // 信息窗口高度
             //title : arroundMarhers[index].title , // 信息窗口标题
             }
             var content = '<div><div style="font-size: 0.14rem">'+searchArr[i].title+'<a class="pa" style="bottom:0px;right:0px;margin-left:0.15rem;color: #ff8200;font-size: 0.12rem" href="'+searchArr[i].detailUrl+'">'+'详情>></a></div><div style="font-size: 0.14rem">地址：'+searchArr[i].address+'</div>'
             console.log(searchArr[i].point)
             var infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象
             //移动地图点击标记防止误触
             map.addEventListener('dragging',function () {
             window.isMove = true;
             console.log(isMove + 'dragging')
             })
             map.addEventListener('dragend',function () {
             window.isMove = false;
             console.log(isMove + 'dragend')
             })
             map.openInfoWindow(infoWindow,searchArr[i].point); //开启信息窗口*/


        })
        return div;
    }
    ComplexCustomOverlay.prototype.draw = function(){
        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._point);
        this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
        this._div.style.top  = pixel.y - 30 + "px";
    }

    //添加监听事件
    ComplexCustomOverlay.prototype.addEventListener = function(event,fun){
        this._div['on'+event] = fun;
    }


}
