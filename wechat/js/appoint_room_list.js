/**
 * Created by yangzhenj on 2018/5/26.
 */
$(function(){
    //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
    var mescroll = new MeScroll("mescroll", {

        //上拉加载的配置项
        up: {
            callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
            isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
            noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
            empty: {
                icon: "../mock/img/mescroll-empty.png", //图标,默认null
                tip: "暂无相关数据~", //提示
                btntext: "去逛逛 >", //按钮,默认""
                btnClick: function(){//点击按钮的回调,默认null
                    alert("点击了按钮,具体逻辑自行实现");
                }
            },
            clearEmptyId: "houseList", //相当于同时设置了clearId和empty.warpId; 简化写法;默认null
            toTop:{ //配置回到顶部按钮
                src : "../mock/img/mescroll-totop.png", //默认滚动到1000px显示,可配置offset修改
                //offset : 1000
            },
            page:{
                num : 0 ,
                size : 10 ,
                time : null
            }
        }
    });

    /*初始化菜单*/
    var pdType=0;//全部0;

    //重置列表数据
    //mescroll.resetUpScroll();
    //隐藏回到顶部按钮
    mescroll.hideTopBtn();


    /*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
    function getListData(page){
        //联网加载数据
        getListDataFromNet(pdType, page.num, page.size, function(curPageData){
            //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            //mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
            console.log("pdType="+pdType+", page.num="+page.num+", page.size="+page.size+", curPageData.length="+curPageData.length);

            //方法一(推荐): 后台接口有返回列表的总页数 totalPage
            //mescroll.endByPage(curPageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)

            //方法二(推荐): 后台接口有返回列表的总数据量 totalSize
            //mescroll.endBySize(curPageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)

            //方法三(推荐): 您有其他方式知道是否有下一页 hasNext
            //mescroll.endSuccess(curPageData.length, hasNext); //必传参数(当前页的数据个数, 是否有下一页true/false)

            //方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据,如果传了hasNext,则翻到第二页即可显示无更多数据.
            mescroll.endSuccess(curPageData.length);

            //设置列表数据
            setListData(curPageData);
        }, function(){
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            mescroll.endErr();
        });
    }

    /*设置列表数据*/
    function setListData(curPageData){
        for (var i = 0; i < curPageData.length; i++) {
            var house=curPageData[i];
            var detailUrl = 'http://www.baidu.com?houseId='+house.id;
            var houseId = house.id;
            if(house.vrLook && house.roundLook){
                var vrRound = '<a href="'+house.vrLook+'" class="vr_round">VR</a>'+
                              '<a href="'+house.roundLook+'" class="vr_round">360&deg;</a>'
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
                    tags += '<span class="tag" >' + item + '</span>'
                });
            }

            var html = '<li class="clearfix pr border_bottom weui-cell weui-cell_swiped">'+
                '<a href="' + detailUrl + '">' +
                // '<a  href="www.baidu.com?houstId:2">' +
                '<div class="house_img pr weui-cell__bd">'+
                '<img src="'+house.mainPic+'" alt="">'+vrRound+
                '</div>'+
                '<div class="house_info weui-cell__bd">'+
                '<p class="house_title">'+house.title+'</p>'+
                '<div class="house_tips clearfix">'+
                '<span class="house_area">'+house.houseArea+'m<sup>2</sup></span><span class="line">|</span><span class="house_floors">'+house.belongFloor+'/'+house.totalFloor+'层</span>'+
                '<div class="price fr"><span class="price_before">￥</span>'+house.rent+'<span class="price_after" style="font-size: 0.12rem">元/月</span></div>'+
                '</div>'+
                '<div class="pr has_mestro">'+
                '<img src="../img/house_list/map_icon_gray.png" alt=""><span>'+house.hasMetro+'</span>'+
                '</div>'+
                '<div class="tags">'+tags+
                '</div>'+
                '</div>'+
                '<div class="weui-cell__ft">'+
                '<a class="weui-swiped-btn weui-swiped-btn_warn delete-swipeout cancel_appoint" href="javascript:void(0)" >取消预约</a>'+
                '<a class="weui-swiped-btn weui-swiped-btn_warn delete-swipeout confirm_cancel_appoint hide">确认取消</a>'+
                // '<a class="weui-swiped-btn weui-swiped-btn_default close-swipeout" href="javascript:">关闭</a>'+
                '</div>'+
                '</a>'+
                '</li>'

            $('#houseList').append(html)

        }
        $('.weui-cell_swiped').swipeout();
        //关闭滑动恢复字样
        $('.weui-cell_swiped').on('swipeout-close',function (e) {
            setTimeout(function () {
                $(".cancel_appoint").show();
                $(".confirm_cancel_appoint").hide();

            },300)
        })
        //open 点击才执行 解决划开点击字闪变
        $('.weui-cell_swiped').on('swipeout-open',function (e) {
            setTimeout(function () {
                var obj = $(e.currentTarget)
                hideCancelAppoint(obj)
            },310)
        })
        /*******房源列表点击li跳转*********/ /***阻止点击删除事件冒泡****/
        $('#houseList>li').click(function (e) {
            e= event || window.event
           if(e.target.className.toLocaleLowerCase().indexOf('cancel_appoint')>-1 || e.target.className.toLocaleLowerCase().indexOf('confirm_cancel_appoint')>-1){
                e.stopPropagation()
                return
            }
            window.location.href = $(this).find('a').eq(0).attr('href')
        });


        //mockDel()
    }

    /*联网加载列表数据
     在您的实际项目中,请参考官方写法: http://www.mescroll.com/api.html#tagUpCallback
     请忽略getListDataFromNet的逻辑,这里仅仅是在本地模拟分页数据,本地演示用
     实际项目以您服务器接口返回的数据为准,无需本地处理分页.
     * */
    function getListDataFromNet(pdType,pageNum,pageSize,successCallback,errorCallback) {
        //延时一秒,模拟联网
        setTimeout(function () {
            HttpUtils.get('../mock/pdlist1.json','',function (data) {
                var listData=[];

                //pdType 全部商品0;
                if(pdType==0){
                    //全部商品 (模拟分页数据)
                    for (var i = (pageNum-1)*pageSize; i < pageNum*pageSize; i++) {
                        if(i==data.length) break;
                        listData.push(data[i]);
                    }

                }
                //回调
                successCallback(listData);
            },function () {
                errorCallback
            })
        },1000)
    }


    //模拟左划删除
    function mockDel() {
        var container = document.querySelectorAll('.data-list li');
        for(var i = 0; i < container.length; i++){
            var x, y, X, Y, swipeX, swipeY;
            container[i].addEventListener('touchstart', function(event) {
                x = event.changedTouches[0].pageX;
                y = event.changedTouches[0].pageY;
                swipeX = true;
                swipeY = true ;
            });
            container[i].addEventListener('touchmove', function(event){

                X = event.changedTouches[0].pageX;
                Y = event.changedTouches[0].pageY;
                console.log(x,y)
// 左右滑动
                if(swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0){
// 阻止事件冒泡
                    event.stopPropagation();

                    if(X - x > 10){   //右滑
                        event.preventDefault();
                        this.className = "";    //右滑收起
                    }
                    if(x - X > 10){   //左滑
                        event.preventDefault();
                        var swipeLeft = document.getElementsByClassName("swipeleft");
                        for(var j = 0; j < swipeLeft.length; j++){
                            swipeLeft[j].className = "";
                        }
                        this.className = "swipeleft";   //左滑展开
                    }
                    swipeY = false;
                }
// 上下滑动
                if(swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
                    swipeX = false;
                }
            });
        }
        var i = document.querySelectorAll('.data-list li i');
        i.forEach(function(item, index){
            i[index].onclick = function(){
                this.parentNode.remove();
            };
        });
    }


});

