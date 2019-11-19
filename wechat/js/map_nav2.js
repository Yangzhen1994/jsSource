// 百度地图API功能 公租房小区展示（11缩放）
var map = new BMap.Map("allmap");
map.centerAndZoom(new BMap.Point(113.482279,23.165242),11);//确定中心点，以及初始的缩放倍数
//map.centerAndZoom("广州",10);
//map.enableScrollWheelZoom();//启动缩放
//map.disableDragging(); //禁止拖拽
//map.disableDoubleClickZoom()//禁止双击放大
//map.disablePinchToZoom()//禁止双指缩放
madeBoundary();//渲染区域

//13个小区名字和对应经纬度
var phArr = [
    {name:"萝岗和苑",jwd:"113.486231,23.194814",href:"http://www.baidu.com/"},
    {name:"棠德花苑",jwd:"113.390626,23.140054",href:"http://www.baidu.com/"},
    {name:"棠悦花园",jwd:"113.395742,23.139154",href:"http://www.baidu.com/"},
    {name:"泰安花园",jwd:"113.39887,23.13605",href:"http://www.baidu.com/"},
    {name:"广氮花园",jwd:"113.400682,23.142285",href:"http://www.baidu.com/"},
    {name:"安厦花园",jwd:"113.435437,23.127704",href:"http://www.baidu.com/"},
    {name:"大田花园",jwd:"113.464761,23.114468",href:"http://www.baidu.com/"},
    {name:"苗和苑",jwd:"113.514377,23.088238",href:"http://www.baidu.com/"},
    {name:"亨元花园",jwd:"113.54539,23.100361",href:"http://www.baidu.com/"},
    {name:"瑞东花园",jwd:"113.472919,23.116195",href:"http://www.baidu.com/"},
    {name:"榕悦花园",jwd:"113.556264,23.113683",href:"http://www.baidu.com/"},
    {name:"佳兆业城市广场",jwd:"113.556855,23.108459",href:"http://www.baidu.com/"},
    {name:"保利瀚林花园",jwd:"113.44729,23.108349",href:"none"}
]

/*console.log(phArr.length);*/

//区域图
function madeBoundary() {
    var datas = new Array("广州市天河区-#65AE76","广州市越秀区-#014D67","广州市荔湾区-#65AE76","广州市白云区-#7DC2C2","广州市海珠区-#EDDE8B","广州市番禺区-#7DC2C2","广州市南沙区-#F2652F","广州市从化区-#F2652F","广州市黄埔区-#014D67","增城区-#65AE76","广州市花都区-#65AE76");
    var bdary = new BMap.Boundary();
    for(var i=0;i<datas.length;i++){
        getBoundary(datas[i],bdary);
    }
}

//设置区域图
function getBoundary(data,bdary){
    data = data.split("-");
    bdary.get(data[0], function(rs){//获取行政区域
        var count = rs.boundaries.length; //行政区域的点有多少个
        var pointArray = [];
        for (var i = 0; i < count; i++) {
            var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight:1, strokeColor: "#F98C19",fillOpacity:0.3,fillColor:data[1]}); //建立多边形覆盖物

            map.addOverlay(ply);  //添加覆盖物
        }
    });
}

// 编写自定义函数,创建标注
function addMarker(point){
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
}


// 复杂的自定义覆盖物
function ComplexCustomOverlay(point, text, num, href){
    this._point = point;
    this._text = text;
    this._num = num;
    this._href = href;
}
ComplexCustomOverlay.prototype = new BMap.Overlay();
ComplexCustomOverlay.prototype.initialize = function(map){
    this._map = map;
    var div = this._div = document.createElement("div");
    div.className ="over_linkbox";
    div.id = "over" + this._num;//覆盖物id
    /*div.onClick = function(){console.log(1)};//覆盖物超链接*/
    /*div.style.display = "block";
    div.style.position = "absolute";
    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
    div.style.backgroundColor = "#EE5D5B";
    div.style.border = "1px solid #BC3B3A";
    div.style.color = "white";
    div.style.height = "18px";
    div.style.padding = "2px";
    div.style.lineHeight = "18px";
    div.style.whiteSpace = "nowrap";
    div.style.MozUserSelect = "none";
    div.style.fontSize = "12px"*/
    var a = this._a = document.createElement("a");
    div.appendChild(a);
    //添加链接，如果判定是还没有指向的几个，另做处理
    if((this._num==12)||(this._num==13)||(this._num==14)){
        a.onclick=function(){alert("暂无链接！")}
        a.ontouchend=function(){alert("暂无链接！")}
    }else{
        a.href = this._href;//覆盖物超链接
        a.ontouchend=function(){window.location.href=this.getAttribute("href");}
    }
    a.appendChild(document.createTextNode(this._text));
    var that = this;

    /*var arrow = this._arrow = document.createElement("div");
    arrow.style.background = "url(http://map.baidu.com/fwmap/upload/r/map/fwmap/static/house/images/label.png) no-repeat";
    arrow.style.position = "absolute";
    arrow.style.width = "11px";
    arrow.style.height = "10px";
    arrow.style.top = "22px";
    arrow.style.left = "10px";
    arrow.style.overflow = "hidden";
    div.appendChild(arrow);*/

    map.getPanes().labelPane.appendChild(div);
    return div;
}
ComplexCustomOverlay.prototype.draw = function(){
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    /*this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
    this._div.style.top  = pixel.y - 30 + "px";*/
    //覆盖物自定义位置偏移，小区太密集
    switch(this._num){
        case 0:
            this._div.style.left = pixel.x - 35 + "px";
            this._div.style.top  = pixel.y - 65 + "px";
            break;
        case 1:
            this._div.style.left = pixel.x - 95 + "px";
            this._div.style.top  = pixel.y - 15 + "px";
            break;
        case 2:
            this._div.style.left = pixel.x - 34 + "px";
            this._div.style.top  = pixel.y - 70 + "px";
            break;
        case 3:
            this._div.style.left = pixel.x - 34 + "px";
            this._div.style.top  = pixel.y + 5 + "px";
            break;
        case 4:
            this._div.style.left = pixel.x + 5 + "px";
            this._div.style.top  = pixel.y - 18 + "px";
            break;
        case 5:
            this._div.style.left = pixel.x - 34 + "px";
            this._div.style.top  = pixel.y + 35 + "px";
            break;
        case 6:
            this._div.style.left = pixel.x - 34 + "px";
            this._div.style.top  = pixel.y + 65 + "px";
            break;
        case 7:
            this._div.style.left = pixel.x - 28 + "px";
            this._div.style.top  = pixel.y + 116 + "px";
            break;
        case 8:
            this._div.style.left = pixel.x - 35  + "px";
            this._div.style.top  = pixel.y + 21 + "px";
            break;
        case 9:
            this._div.style.left = pixel.x - 34 + "px";
            this._div.style.top  = pixel.y - 74 + "px";
            break;
        case 10:
            this._div.style.left = pixel.x - 34 + "px";
            this._div.style.top  = pixel.y - 49 + "px";
            break;
        case 11:
            this._div.style.left = pixel.x + 23 + "px";
            this._div.style.top  = pixel.y - 12 + "px";
            break;
        case 12:
            this._div.style.left = pixel.x - 47 + "px";
            this._div.style.top  = pixel.y + 100 + "px";
            break;
        default:
            this._div.style.left = pixel.x + "px";
            this._div.style.top  = pixel.y - 30 + "px";
    }
}

//渲染标注和覆盖物
for(var i=0;i<phArr.length;i++){
    /*console.log(phArr[i].jwd);*/
    var jwd = phArr[i].jwd.split(",");
    /*addMarker(new BMap.Point(jwd[0],jwd[1]));*/
    map.addOverlay(new ComplexCustomOverlay(new BMap.Point(jwd[0],jwd[1]), phArr[i].name,i,phArr[i].href));
}