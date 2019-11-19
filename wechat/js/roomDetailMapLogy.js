/**
 * Created by yangzhenj on 2018/5/23.
 */

var akKey = 'PtTLglRku1tDGsQPoK4HdEFvcd1QIc6e';
var initDatas, nlabels, districts,newMarkers= [];
var oldIndex, ply, tempTime;

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
    //map.centerAndZoom(point, 12);
   // map.enableScrollWheelZoom();
    // 启用滚轮放大缩小
    var searchArr = ['地铁','生活','医院']
    addressToLatLng('海珠新港城',searchArr);
}
loadJScript();  //异步加载地图
/*******根据地址解析***********/
function addressToLatLng(address,type){
    map.clearOverlays();
    var myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint(address, function(point){
        if (point) {
            map.centerAndZoom(point, 14);
            var myIcon = new BMap.Icon("../../img/house_detail/diingwei_icon.png", new BMap.Size(20,20),{imageOffset:0});
            var marker2 = new BMap.Marker(point,{icon:myIcon});
            map.addOverlay(marker2);
            marker2.disableMassClear()
            searchByTab(point,type)
        }else{
            $.alert("您选择地址没有解析到结果!");
            stopScroll($('.weui-mask'))
        }
    }, "广州市");
}
/************范围搜索*****************/
function searchByTab(mPoint,filterName){
    var circle = new BMap.Circle(mPoint,1000,{fillColor:"#3375FF", strokeWeight: 0.5 ,fillOpacity: 0.2, strokeOpacity: 0.8});
    map.addOverlay(circle);
    circle.disableMassClear()
    var arroundMarhers= [];
    var distances = [];

    var local =  new BMap.LocalSearch(map,

        {   pageCapacity:1,//显示一个结果
            renderOptions: {map: map, autoViewport: false,selectFirstResult:true},//panel: "diTieWrap"结果生成到右边 百度的自带
            onInfoHtmlSet:function (res) {
               console.log('indo',res)
            },

            onSearchComplete: function (results) {
                if (local.getStatus() == BMAP_STATUS_SUCCESS) {

                    console.log(results)
                    for (var i = 0; i < results.length; i++) {
                        var resLngLat = results[i].getPoi(0).point
                        arroundMarhers.push(results[i].getPoi(0));

                        var distance = map.getDistance(mPoint,results[i].getPoi(0).point).toFixed(0)+'米,'+arroundMarhers[i].title
                        if(results[i].getPoi(0).type==3){
                            var distance = map.getDistance(mPoint,results[i].getPoi(0).point).toFixed(0)+'米,'+arroundMarhers[i].address+arroundMarhers[i].title+'-地铁站'
                        }
                        distances.push(distance)
                    }
                    console.log(arroundMarhers)
                    console.log(distances)//百度地图步行导航默认速度3.6km/h。走路比较舒服的速度是4.5。

                    distances.forEach(function (item,index) {
                        var mstr = item.split(',')[0]
                        mstr = mstr.substring(0,mstr.length-1)
                        var str = '距离'+item.split(',')[1]+mstr+'米,步行约'+ Math.ceil(mstr*1/72)+'分钟'
                        $('#mapResWrap li').eq(index).text(str)
                    })

                    /******渲染右侧列表***直接使用百度的api 此处是自己渲染*/
                    /*distances.forEach(function (item,index) {
                        var dis = item.split(',')[0]
                        var name = item.split(',')[1];
                        var nindex = index*1+1
                        var tempHtml = ' <div class="tab_item_distance clearfix" >'+
                            '<span class="tab_item_num fl">'+nindex+'</span>'+
                            '<div class="fl" style="font-size: 16px;margin-left: 8px;font-weight: bold">'+name+'</div>'+
                            '<div class="fr" style="font-size: 16px;margin-left: 8px;">'+dis+'</div>'+
                            '</div>'
                        if(filterName=='地铁'){
                            $('#diTieWrap').append(tempHtml)
                        }else if(filterName=='学校'){
                            $('#school').append(tempHtml)
                        }

                    })*/

                }
            },
            onMarkersSet:function (res) {
                console.log(res)

                map.clearOverlays()
                var addPointerArr = []
                res.forEach(function (item,index) {
                    addPointerArr.push(item.point)
                })
                console.log(addPointerArr)
                addPointerArr.forEach(function (item,index) {
                    var myIcon = new BMap.Icon('../../img/house_detail/map_icon'+(index+1)+'.svg', new BMap.Size(32,40),{imageOffset:0});
                    var marker2 = new BMap.Marker(item,{icon:myIcon});



                    newMarkers.push(marker2)
                    map.addOverlay(marker2);


                })
                console.log(arroundMarhers)
                console.log(newMarkers)
                newMarkers.forEach(function (item,index) {
                    var opts = {
                       // width : 200,     // 信息窗口宽度
                        // 信息窗口高度
                        //title : arroundMarhers[index].title , // 信息窗口标题
                    }
                    var content = '<div><div style="font-size: 0.14rem">'+res[index].title+'<a style="margin-left:0.15rem;color: #ff8200;font-size: 0.12rem" href="'+res[index].detailUrl+'">'+'详情>></a></div><div style="font-size: 0.14rem">地址：'+res[index].address+'</div>'
                    var infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象
                    item.addEventListener("click", function(){
                        map.openInfoWindow(infoWindow,item.getPosition()); //开启信息窗口
                    });
                })
                // map.clearOverlays()
            },
        }
    );
    local.searchNearby(filterName,mPoint,1000);



}
