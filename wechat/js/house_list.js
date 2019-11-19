/**
 * Created by yangzhenj on 2018/5/26.
 * initId  外层id
 * wrapId  包含内容的一层id
 */

function scrollLoading(initId, wrapId, data, clearEmptyId) {
    //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
    var mescroll = new MeScroll(initId, {
        //上拉加载的配置项
        up: {
            callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
            isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
            noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
            empty: {
                icon: "../../mock/img/mescroll-empty.png", //图标,默认null
                tip: "暂无相关数据~", //提示
               /* btntext: "", //按钮,默认""
                btnClick: function () {//点击按钮的回调,默认null
                    alert("点击了按钮,具体逻辑自行实现");
                }*/
            },
            clearEmptyId: clearEmptyId || wrapId, //相当于同时设置了clearId和empty.warpId; 简化写法;默认null
            toTop: { //配置回到顶部按钮
                src: "../../mock/img/mescroll-totop.png", //默认滚动到1000px显示,可配置offset修改
                //offset : 1000
            },
            page: {
                num: 0,
                size: 10,
                time: null
            },
            htmlNodata:
                '<p class="upwarp-nodata">——— 我是有底线的 ——— </p>'

        }
    });

    /*初始化菜单*/
    var pdType = 0;//全部0;

    //重置列表数据
    //mescroll.resetUpScroll();
    //隐藏回到顶部按钮
    mescroll.hideTopBtn();


    /*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
    function getListData(page) {
        //联网加载数据
        getListDataFromNet(pdType, page.num, page.size, data, function (curPageData) {
            //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            //mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
            console.log("pdType=" + pdType + ", page.num=" + page.num + ", page.size=" + page.size + ", curPageData.length=" + curPageData.length);

            //方法一(推荐): 后台接口有返回列表的总页数 totalPage
            //mescroll.endByPage(curPageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)

            //方法二(推荐): 后台接口有返回列表的总数据量 totalSize
            //mescroll.endBySize(curPageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)

            //方法三(推荐): 您有其他方式知道是否有下一页 hasNext
            //mescroll.endSuccess(curPageData.length, hasNext); //必传参数(当前页的数据个数, 是否有下一页true/false)

            //方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据,如果传了hasNext,则翻到第二页即可显示无更多数据.
            mescroll.endSuccess(curPageData.length);

            //设置列表数据
            setListData(curPageData, wrapId);
        }, function () {
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            mescroll.endErr();
        });
    }

    /*设置列表数据*/
    function setListData(curPageData, id) {
        if (id == 'houseList' || id == 'recommendhouseList' || id == 'maphouseList' || id == 'rentList0' || id == 'rentList1' || id == 'contractHouseList0' || id == 'contractHouseList1' || id == 'myhouse') {
            for (var i = 0; i < curPageData.length; i++) {
                var house = curPageData[i];
                var detailUrl = 'xxxx?houseId=' + house.id //有接口后使用这个
                /*if(id=='houseList' || id=='recommendhouseList' || id=='maphouseList'){

                 }*/

                var stateHtml= '';
                var imgurl= '';
                if (id == 'contractHouseList1') {
                    var detailUrl = "./no_appoint_step1.html?no" //未签约详情页面
                } else if (id == 'contractHouseList0') {
                    var detailUrl = "./contract_manage_detail.html?true"//已经签约详情页面
                } else if (id == 'rentList0' || id == "rentList1") {
                    var detailUrl = './host_myhouse_info.html'
                } else {
                    var detailUrl = '../house_detail/house_detail.html'
                }
                if(id == 'myhouse'){
                    var detailUrl = './user_my_house_resource.html'
                    imgurl = '../../img/state_imgs/zqzt_02@2x.png';
                    stateHtml = '<div class="house_status">'+'<img src="'+imgurl+'" alt=""><span style="right:21%">'+50+'</sapn></div>'

                }
                if (house.vrLook && house.roundLook) {
                    var vrRound = '<div class="both_look"><a href="' + house.vrLook + '" class="vr_round_l"><img src="../../img/house_list/phone_icon/VR.png" alt=""></a><span class="font_org line_i" style="font-size: 0.12rem;font-weight: 420;">/</span><a href="' + house.roundLook + '" class="vr_round"><img src="../../img/house_list/phone_icon/360.png" alt=""></a></div>'
                } else if (house.vrLook) {
                    var vrRound = '<a href="' + house.vrLook + '" class="vr_round"><img src="../../img/house_list/phone_icon/VR.png" alt=""></a>'
                } else if (house.roundLook) {
                    var vrRound = '<a href="' + house.roundLook + '" class="vr_round"><img src="../../img/house_list/phone_icon/360.png" alt=""></a>'
                } else {
                    var vrRound = ''
                }

                if (!house.tags) {
                    var tags = ''
                } else {
                    var tags = ''
                    tagsArr = house.tags.split(',');

                    if (tagsArr.length > 3) {
                        tagsArr = tagsArr.slice(0, 3)
                    }
                    $.each(tagsArr, function (i, item) {
                        tags += '<span class="tag">' + item + '</span>'
                    });
                }

                if(id == 'rentList0'){
                    console.log(1)
                   /* 2、审核中：
                    3、驳回
                    4、未出租：
                    5、已出租：
                    6、已下架*/
                    var state = house.rentState;
                    switch (state){
                        case 2:
                            imgurl = '../../img/state_imgs/kzzt_04@2x.png';
                            stateHtml = '<div class="house_status">'+'<img src="'+imgurl+'" alt="">'+'</div>'
                            break;
                        case 3:
                            imgurl = '../../img/state_imgs/bohui.png';
                            stateHtml = '<div class="house_status">'+'<img src="'+imgurl+'" alt="">'+'</div>'
                            break;
                        case 4:
                            imgurl = '../../img/state_imgs/kzzt_03@2x.png';
                            stateHtml = '<div class="house_status">'+'<img src="'+imgurl+'" alt=""><span>'+33+'</sapn></div>'
                            break;
                        case 5:
                            imgurl = '../../img/state_imgs/zqzt_01@2x.png';
                            stateHtml = '<div class="house_status">'+'<img src="'+imgurl+'" alt=""><span style="right:24%">'+3+'</sapn></div>'
                            break;
                        case 6:
                            imgurl = '../../img/state_imgs/yixiajia@2x.png';
                            stateHtml = '<div class="house_status xiajia">'+'<img src="'+imgurl+'" alt=""></div>'
                            break;
                        default:
                            break;
                    }

                }
                if(id == 'rentList1'){
                            imgurl = '../../img/state_imgs/zqzt_01@2x.png';
                            stateHtml = '<div class="house_status">'+'<img src="'+imgurl+'" alt=""><span style="right:24%">'+3+'</sapn></div>'
                }

                var html = '<li class="clearfix pr border_bottom">' +
                    '<a href="' + detailUrl + '">' +
                    '<div class="house_img pr">' +
                    '<img src="' + house.mainPic + '" alt="">' + vrRound + stateHtml+
                    '</div>' +
                    '<div class="house_info">' +
                    '<p class="house_title">' + house.title + '</p>' +
                    '<div class="house_tips clearfix">' +
                    '<span class="house_area">' + house.houseArea + 'm<sup>2</sup></span><span class="line">|</span><span class="house_floors">' + house.belongFloor + '/' + house.totalFloor + '层</span>' +
                    '<div class="price fr"><span class="price_before">￥</span>' + house.rent + '<span class="price_after" style="font-size: 0.12rem">元/月</span></div>' +
                    '</div>' +
                    '<div class="pr has_mestro">' +
                    '<img src="../../img/house_list/map_icon_gray.png" alt=""><span>' + house.hasMetro + '</span>' +
                    '</div>' +
                    '<div class="tags">' + tags +
                    '</div>' +
                    '</div>' +
                    '</a>' +
                    '</li>';
                var html_contractHouseList = '<li class="clearfix pr">' +
                    '<a href="' + detailUrl + '">' +
                    '<div class="house_img pr">' +
                    '<img src="' + house.mainPic + '" alt="">' + vrRound +
                    '<div class="state_img">' +
                    '<img src="' + house.subPic + '" alt="">' +
                    '<span>' + house.days + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="house_info">' +
                    '<p class="house_title">' + house.title + '</p>' +
                    '<div class="house_tips clearfix">' +
                    '<span class="house_area">' + house.houseArea + 'm<sup>2</sup></span><span class="line">|</span><span class="house_floors">' + house.belongFloor + '/' + house.totalFloor + '层</span>' +
                    '<div class="price fr"><span class="price_before">￥</span>' + house.rent + '<span class="price_after" style="font-size: 0.12rem">元/月</span></div>' +
                    '</div>' +
                    '<div class="pr has_mestro">' +
                    '<img src="../../img/house_list/map_icon_gray.png" alt=""><span>' + house.hasMetro + '</span>' +
                    '</div>' +
                    '<div class="tags">' + tags +
                    '</div>' +
                    '</div>' +
                    '</a>' +
                    '</li>';
                if (id == 'contractHouseList1' || id == 'contractHouseList0') {
                    $('#' + wrapId).append(html_contractHouseList)
                } else {
                    $('#' + wrapId).append(html)
                }


            }
        } else if (id == 'rentingInfoList') {
            for (var i = 0; i < curPageData.length; i++) {
                var info = curPageData[i];
                var detailUrl = './renting_info_detail.html?houseId=' + info.id;

                var rend_state1= '<img class="rend_state1" src="../../img/house_list/rend-success.png" alt="求租成功"/>';
                var rend_state2= '<img class="rend_state2" src="../../img/house_list/rend-invalid.png" alt="已撤销"/>';
                if (info.isMe) {
                    var liStart = '<li class="clearfix border_bottom  isme_li">'
                    var img = '<img src="../../img/wodefabu.svg" alt="" class="fl">'
                    var titleSpan = '<span class="fl title_span isme">' + info.title + '</span>'
                } else {
                    var liStart = '<li class="clearfix border_bottom">'
                    var img = ''
                    var titleSpan = '<span class="fl title_span">' + info.title + '</span>'
                }
                var publish_time = info.publishTime;
                var formatterTime = getDateDiff(publish_time)
                //alert(formatterTime)
                var html = liStart +
                    '<a href="' + detailUrl + '"></a>' + img +
                    '<div class="title clearfix">' + titleSpan +
                    '<span class="fr publish_time">' + formatterTime + '</span>' +
                    '</div>' +
                    '<div class="renting_info_desc clearfix">' +
                    '<span class="price_before fl">￥</span><span class="fl price">' + info.price + '</span><span class="fl price_after">元/月</span>' +
                    '<span class="layout fr">' + info.layout + '</span>' +
                    '</div>' + rend_state1
                    '</li>'
                $('#' + wrapId).append(html)
            }
        } else if (id == 'apponiHouseList' || id == 'apponiHouseList2') {
            for (var i = 0; i < curPageData.length; i++) {
                var house = curPageData[i];
                var detailUrl = 'http://www.baidu.com?houseId=' + house.id;
                var houseId = house.id;
                var state = house.state;
                var imgurl = ''
                var stateHtml = ''
                var yuyueHtml = '';
                if (state != null) {//mock 假的状态对应  具体参照字典表 5已出租 6已下架
                    switch (state) {
                        case 4:
                            yuyueHtml = '<div class="state_img">' +
                            '<img src="' + house.subPic + '" alt="">' +
                            '<span class="appoint_time">' + house.appoint_time + '</span>';
                            state = '../../img/state_imgs/yijujue.svg';
                            break;
                        case 3:
                            yuyueHtml = '<div class="state_img">' +
                                '<img src="' + house.subPic + '" alt="">' +
                                '<span class="appoint_time">' + house.appoint_time + '</span>'
                            state = '../../img/state_imgs/yiwancheng.svg'
                            break;
                        case 1:
                            yuyueHtml = '<div class="state_img">' +
                                '<img src="' + house.subPic + '" alt="">' +
                                '<span class="appoint_time">' + house.appoint_time + '</span>'
                            state = '../../img/state_imgs/yuyuechenggong.svg'
                            break;
                        case 2:
                            yuyueHtml = '<div class="state_img">' +
                                '<img src="' + house.subPic + '" alt="">' +
                                '<span class="appoint_time">' + house.appoint_time + '</span>'
                            state = '../../img/state_imgs/yuyuezhong.svg'
                            break;
                        case 5:
                            imgurl = '../../img/state_imgs/yichuzu@2x.png';
                            stateHtml = '<div class="house_status xiajia">'+'<img src="'+imgurl+'" alt=""></div>'
                            break;
                        case 6:
                            imgurl = '../../img/state_imgs/yixiajia@2x.png';
                            stateHtml = '<div class="house_status xiajia">'+'<img src="'+imgurl+'" alt=""></div>'
                            break;
                        default:
                            state = '../../img/state_imgs/yuyueshenqing.svg'
                            yuyueHtml = '<div class="state_img">' +
                                '<img src="' + house.subPic + '" alt="">' +
                                '<span class="appoint_time">' + house.appoint_time + '</span>'
                            break;
                    }

                }
                if (house.vrLook && house.roundLook) {
                    var vrRound = '<div class="both_look"><a href="' + house.vrLook + '" class="vr_round_l"><img src="../../img/house_list/phone_icon/VR.png" alt=""></a><span class="font_org line_i" style="font-size: 0.12rem;font-weight: 420;">/</span><a href="' + house.roundLook + '" class="vr_round"><img src="../../img/house_list/phone_icon/360.png" alt=""></a></div>'
                } else if (house.vrLook) {
                    var vrRound = '<a href="' + house.vrLook + '" class="vr_round"><img src="../../img/house_list/phone_icon/VR.png" alt=""></a>'
                } else if (house.roundLook) {
                    var vrRound = '<a href="' + house.roundLook + '" class="vr_round"><img src="../../img/house_list/phone_icon/360.png" alt=""></a>'
                } else {
                    var vrRound = ''
                }

                if (!house.tags) {
                    var tags = ''
                } else {
                    var tags = ''
                    tagsArr = house.tags.split(',');

                    if (tagsArr.length > 3) {
                        tagsArr = tagsArr.slice(0, 3)
                    }
                    $.each(tagsArr, function (i, item) {
                        tags += '<span class="tag" >' + item + '</span>'
                    });
                }

                var html = '<li class="clearfix pr border_bottom weui-cell weui-cell_swiped">' +
                    /* '<a href="' + detailUrl + '">' +*/
                    '<a href="./look_house_info.html">' +
                    // '<a  href="www.baidu.com?houstId:2">' +
                    '<div class="house_img pr weui-cell__bd">' +
                    '<img src="' + house.mainPic + '" alt="">' + vrRound + stateHtml +
                    yuyueHtml+
                    '</div>' +
                    '</div>' +
                    '<div class="house_info weui-cell__bd">' +
                    '<p class="house_title">' + house.title + '</p>' +
                    '<div class="house_tips clearfix">' +
                    '<span class="house_area">' + house.houseArea + 'm<sup>2</sup></span><span class="line">|</span><span class="house_floors">' + house.belongFloor + '/' + house.totalFloor + '层</span>' +
                    '<div class="price fr"><span class="price_before">￥</span>' + house.rent + '<span class="price_after" style="font-size: 0.12rem">元/月</span></div>' +
                    '</div>' +
                    '<div class="pr has_mestro">' +
                    '<img src="../../img/house_list/map_icon_gray.png" alt=""><span>' + house.hasMetro + '</span>' +
                    '</div>' +
                    '<div class="tags">' + tags +
                    '</div>' +
                    '<img class="right_state" src="' + state + '" alt=""/>' +
                    '</div>' +
                    '<div class="weui-cell__ft">' +
                    '<a class="weui-swiped-btn weui-swiped-btn_warn delete-swipeout cancel_appoint" href="javascript:void(0)" >取消预约</a>' +
                    '<a class="weui-swiped-btn weui-swiped-btn_warn delete-swipeout confirm_cancel_appoint hide">确认取消</a>' +
                    // '<a class="weui-swiped-btn weui-swiped-btn_default close-swipeout" href="javascript:">关闭</a>'+
                    '</div>' +
                    '</a>' +
                    '</li>'

                $('#' + wrapId).append(html)

            }
            $('.weui-cell_swiped').swipeout();
            //关闭滑动恢复字样
            $('.weui-cell_swiped').on('swipeout-close', function (e) {
                setTimeout(function () {
                    $(".cancel_appoint").show();
                    $(".confirm_cancel_appoint").hide();

                }, 300)
            })
            //open 点击才执行 解决划开点击字闪变
            $('.weui-cell_swiped').on('swipeout-open', function (e) {
                setTimeout(function () {
                    var obj = $(e.currentTarget)
                    hideCancelAppoint(obj)
                }, 310)
            })
            /*******房源列表点击li跳转*********/
            /***阻止点击删除事件冒泡****/
            $('#houseList>li').click(function (e) {
                e = event || window.event
                if (e.target.className.toLocaleLowerCase().indexOf('cancel_appoint') > -1 || e.target.className.toLocaleLowerCase().indexOf('confirm_cancel_appoint') > -1) {
                    e.stopPropagation()
                    return
                }
                window.location.href = $(this).find('a').eq(0).attr('href')
            });
        } else if (id == 'myCollectList') {

            for (var i = 0; i < curPageData.length; i++) {
                var house = curPageData[i];
                var detailUrl = 'http://www.baidu.com?houseId=' + house.id;
                if (id == 'myCollectList') {
                    detailUrl = '../house_detail/house_detail.html'
                }
                var houseId = house.id;
                if (house.vrLook && house.roundLook) {
                    var vrRound = '<div class="both_look"><a href="' + house.vrLook + '" class="vr_round_l"><img src="../../img/house_list/phone_icon/VR.png" alt=""></a><span class="font_org line_i" style="font-size: 0.12rem;font-weight: 420;">/</span><a href="' + house.roundLook + '" class="vr_round"><img src="../../img/house_list/phone_icon/360.png" alt=""></a></div>'
                } else if (house.vrLook) {
                    var vrRound = '<a href="' + house.vrLook + '" class="vr_round"><img src="../../img/house_list/phone_icon/VR.png" alt=""></a>'
                } else if (house.roundLook) {
                    var vrRound = '<a href="' + house.roundLook + '" class="vr_round"><img src="../../img/house_list/phone_icon/360.png" alt=""></a>'
                } else {
                    var vrRound = ''
                }

                if (!house.tags) {
                    var tags = ''
                } else {
                    var tags = ''
                    tagsArr = house.tags.split(',');

                    if (tagsArr.length > 3) {
                        tagsArr = tagsArr.slice(0, 3)
                    }
                    $.each(tagsArr, function (i, item) {
                        tags += '<span class="tag" >' + item + '</span>'
                    });
                }

                var html = '<li class="clearfix pr border_bottom weui-cell weui-cell_swiped">' +
                    '<a href="' + detailUrl + '">' +
                    // '<a  href="www.baidu.com?houstId:2">' +
                    '<div class="house_img pr weui-cell__bd">' +
                    '<img src="' + house.mainPic + '" alt="">' + vrRound +
                    '</div>' +
                    '<div class="house_info weui-cell__bd">' +
                    '<p class="house_title">' + house.title + '</p>' +
                    '<div class="house_tips clearfix">' +
                    '<span class="house_area">' + house.houseArea + 'm<sup>2</sup></span><span class="line">|</span><span class="house_floors">' + house.belongFloor + '/' + house.totalFloor + '层</span>' +
                    '<div class="price fr"><span class="price_before">￥</span>' + house.rent + '<span class="price_after" style="font-size: 0.12rem">元/月</span></div>' +
                    '</div>' +
                    '<div class="pr has_mestro">' +
                    '<img src="../../img/house_list/map_icon_gray.png" alt=""><span>' + house.hasMetro + '</span>' +
                    '</div>' +
                    '<div class="tags">' + tags +
                    '</div>' +
                    '</div>' +
                    '<div class="weui-cell__ft" style="width: 1.28rem;">' +
                    '<a class="weui-swiped-btn weui-swiped-btn_warn delete-swipeout delete_collect" >删除</a>' +
                    '</div>' +
                    '</a>' +
                    '</li>';

                $('#' + wrapId).append(html)

            }
            $('.weui-cell_swiped').swipeout();
            //关闭滑动恢复字样
            /*  $('.weui-cell_swiped').on('swipeout-close',function (e) {
             setTimeout(function () {
             $(".cancel_appoint").show();
             $(".confirm_cancel_appoint").hide();

             },300)
             })*/
            //open 点击才执行 解决划开点击字闪变
            $('.weui-cell_swiped').on('swipeout-open', function (e) {
                setTimeout(function () {
                    var obj = $(e.currentTarget)
                    hideCancelAppoint(obj)
                }, 310)
            })
            /*******房源列表点击li跳转*********/
            /***阻止点击删除事件冒泡****/
            $('#houseList>li').click(function (e) {
                e = event || window.event
                if (e.target.className.toLocaleLowerCase().indexOf('cancel_appoint') > -1 || e.target.className.toLocaleLowerCase().indexOf('delete_collect') > -1) {
                    e.stopPropagation()
                    return
                }
                window.location.href = $(this).find('a').eq(0).attr('href')
            });

        } else if (id == 'rentList2') {
            for (var i = 0; i < curPageData.length; i++) {
                var house = curPageData[i];
                var detailUrl = 'http://www.baidu.com?houseId=' + house.id;
                if (id == 'rentList2') {
                    detailUrl = './host_myhouse_info.html'
                }
                var houseId = house.id;
                if (house.vrLook && house.roundLook) {
                    var vrRound = '<div class="both_look"><a href="' + house.vrLook + '" class="vr_round_l"><img src="../../img/house_list/phone_icon/VR.png" alt=""></a><span class="font_org line_i" style="font-size: 0.12rem;font-weight: 420;">/</span><a href="' + house.roundLook + '" class="vr_round"><img src="../../img/house_list/phone_icon/360.png" alt=""></a></div>'
                } else if (house.vrLook) {
                    var vrRound = '<a href="' + house.vrLook + '" class="vr_round"><img src="../../img/house_list/phone_icon/VR.png" alt=""></a>'
                } else if (house.roundLook) {
                    var vrRound = '<a href="' + house.roundLook + '" class="vr_round"><img src="../../img/house_list/phone_icon/360.png" alt=""></a>'
                } else {
                    var vrRound = ''
                }

                if (!house.tags) {
                    var tags = ''
                } else {
                    var tags = ''
                    tagsArr = house.tags.split(',');

                    if (tagsArr.length > 3) {
                        tagsArr = tagsArr.slice(0, 3)
                    }
                    $.each(tagsArr, function (i, item) {
                        tags += '<span class="tag" >' + item + '</span>'
                    });
                }

                    var imgurl = '../../img/state_imgs/kzzt_03@2x.png';
                    var  stateHtml = '<div class="house_status">'+'<img src="'+imgurl+'" alt=""><span>'+33+'</sapn></div>'

                var html = '<li class="clearfix pr border_bottom weui-cell weui-cell_swiped">' +
                    '<a href="' + detailUrl + '">' +
                    // '<a  href="www.baidu.com?houstId:2">' +
                    '<div class="house_img pr weui-cell__bd">' +
                    '<img src="' + house.mainPic + '" alt="">' + vrRound + stateHtml +
                    '</div>' +
                    '<div class="house_info weui-cell__bd">' +
                    '<p class="house_title">' + house.title + '</p>' +
                    '<div class="house_tips clearfix">' +
                    '<span class="house_area">' + house.houseArea + 'm<sup>2</sup></span><span class="line">|</span><span class="house_floors">' + house.belongFloor + '/' + house.totalFloor + '层</span>' +
                    '<div class="price fr"><span class="price_before">￥</span>' + house.rent + '<span class="price_after" style="font-size: 0.12rem">元/月</span></div>' +
                    '</div>' +
                    '<div class="pr has_mestro">' +
                    '<img src="../../img/house_list/map_icon_gray.png" alt=""><span>' + house.hasMetro + '</span>' +
                    '</div>' +
                    '<div class="tags">' + tags +
                    '</div>' +
                    '</div>' +
                    '<div class="weui-cell__ft">' +
                    '<a class="weui-swiped-btn weui-swiped-btn_gray delete-swipeout info_update" href="javascript:void(0)" >信息变更</a>' +
                    '<a class="weui-swiped-btn weui-swiped-btn_warn delete-swipeout house_cancel">房源下架</a>' +
                    // '<a class="weui-swiped-btn weui-swiped-btn_default close-swipeout" href="javascript:">关闭</a>'+
                    '</div>' +
                    '</a>' +
                    '</li>';

                $('#' + wrapId).append(html)

            }
            $('.weui-cell_swiped').swipeout();
            //关闭滑动恢复字样
            // $('.weui-cell_swiped').on('swipeout-close',function (e) {
            //     setTimeout(function () {
            //         $(".cancel_appoint").show();
            //         $(".confirm_cancel_appoint").hide();
            //
            //     },300)
            // })
            //open 点击才执行 解决划开点击字闪变
            $('.weui-cell_swiped').on('swipeout-open', function (e) {
                setTimeout(function () {
                    var obj = $(e.currentTarget)
                    hideCancelAppoint(obj)
                }, 310)
            })
            /*******房源列表点击li跳转*********/
            /***阻止点击删除事件冒泡****/
            $('#houseList>li').click(function (e) {
                e = event || window.event
                if (e.target.className.toLocaleLowerCase().indexOf('cancel_appoint') > -1 || e.target.className.toLocaleLowerCase().indexOf('confirm_cancel_appoint') > -1) {
                    e.stopPropagation()
                    return
                }
                window.location.href = $(this).find('a').eq(0).attr('href')
            });

        } else if (id == 'newsList') {
            for (var i = 0; i < curPageData.length; i++) {
                var detaliUrl = curPageData[i].url
                if (!detailUrl) {
                    detaliUrl = './news_detail.html'
                }
                var html = '<li class="policy_info_item ">' +
                    '<a href="' + detaliUrl + '" style="display: block;width: 100%;height: 100%">' +
                    '<div class="policy_info_item_img fl">' +
                    '<img src="' + curPageData[i].policyImg + '" alt="">' +
                    '</div>' +
                    '<div class="policy_info_detail fr">' +
                    '<p class="policy_info_title">' + curPageData[i].policyTitle + '</p>' +
                    '<p class="policy_info_content">' + curPageData[i].policyContent + '</p>' +
                    '</div>' +
                    '</a>'
                '</li>';
                $('#' + wrapId).append(html)

            }
            $('.policy_info_content').dotdotdot({
                wrap: 'letter',
                after: 'span.more'
            })
        } else if (id == "addIncome") {
            for (var i = 0; i < curPageData.length; i++) {
                var bill = curPageData[i]
                /*  var detaliUrl = curPageData[i].url
                 if(!detailUrl){
                 detaliUrl='./news_detail.html'
                 }*/
                var html = '<div class="my_income">' +
                    '<div class="title">累加收益：<span style="color: #FF8200;font-weight: bold">'+bill.income+'</span>元</div>' +
                    '<div class="name">'+bill.room+'</div>' +
                    '<div class="time fl">'+bill.start_time+'至'+bill.end_time+'<span>'+bill.payway+'</span></div>' +
                    '<div class="add_inroom">累计收益 :<span style="color: #FF8200;font-weight: bold">'+bill.total_income+'</span>元</div>' +
                    '<div class="add_inroom">剩余收益 :<span style="color: #FF8200;font-weight: bold">'+bill.remain_income+'</span>元</div>' +
                    '</div>'
                $('#' + wrapId).append(html)

            }
        }else if(id=="billList"){
            for (var i = 0; i < curPageData.length; i++) {
                var bill = curPageData[i];
                var state = bill.state;
                var detailUrl = './inline_pay_detail.html?'+bill.index;
                var payMoneyUrl = './pay_detail.html?'+bill.index;
                switch (state){
                    case 0:
                        state = '待支付';
                        var btnHtml = '<button class="go_pay"><a href="'+payMoneyUrl+'" class="font_org">去支付</a></button>'
                        break;
                    case 1:
                        state = '支付成功';
                        var btnHtml = '<button class="pay_detail"><a href="'+detailUrl+'">支付详情</a></button>'
                        break;
                }

                var html = '<div class="paid">' +
                    '<div class="paid_div">' +
                    '<div class="name fl clearfix">第'+bill.index+'期  '+bill.room+' <span class="fr ml0">'+state+'</span></div>' +
                    '<div class="pay_time">打款时间: '+bill.start_time+' 至 '+bill.end_time+'</div>' +
                    '<div class="data">付款日期: '+bill.pay_date+'</div>' +
                    '</div>' +
                    '<div class="rent_income">' +
                    '应付金额：<span style="color: #FF8200;font-weight: bold">'+bill.required_bill+'</span>元' +
                    btnHtml +
                    '</div>' +
                    '</div>'
                $('#' + wrapId).append(html)
            }
        }

        /*******房源列表点击li跳转*********/
        /*******房源列表点击li跳转*********/
        /***阻止点击删除事件冒泡****/
        $('#' + wrapId + '>li').click(function (e) {
            e = event || window.event
            if (e.target.className.toLocaleLowerCase().indexOf('cancel_appoint') > -1 || e.target.className.toLocaleLowerCase().indexOf('delete_collect') > -1) {
                e.stopPropagation()
                return
            }
            window.location.href = $(this).find('a').eq(0).attr('href')
        });
        /* $('#'+wrapId+'>li').click(function () {
         window.location.href = $(this).find('a').eq(0).attr('href')
         })*/

        //mockDel()
    }

    /*联网加载列表数据
     在您的实际项目中,请参考官方写法: http://www.mescroll.com/api.html#tagUpCallback
     请忽略getListDataFromNet的逻辑,这里仅仅是在本地模拟分页数据,本地演示用
     实际项目以您服务器接口返回的数据为准,无需本地处理分页.
     * */
    function getListDataFromNet(pdType, pageNum, pageSize, data, successCallback, errorCallback) {
        console.log(data)
        //延时一秒,模拟联网
        setTimeout(function () {
            if (wrapId == 'rentingInfoList') {
                var url = '../../mock/renting_info.json';
            } else if (wrapId == 'houseList') {
                var url = '../../mock/pdlist1.json';
            } else if (wrapId == 'apponiHouseList') {
                var url = '../../mock/appointlist.json';
            } else if (wrapId == 'apponiHouseList2') {
                var url = '../../mock/yuyueshenqing.json';
            } else if (wrapId == 'myCollectList') {
                var url = '../../mock/pdlist1.json';
            } else if (wrapId == 'rentList0' || wrapId == 'rentList1') {
                var url = '../../mock/house_list.json';
            } else if (wrapId == 'rentList2') {
                var url = '../../mock/house_list.json';
            } else if (wrapId == 'contractHouseList0') {
                var url = '../../mock/contract_list.json';
            } else if (wrapId == 'contractHouseList1') {
                var url = '../../mock/contract_list.json';
            } else if (wrapId == 'recommendhouseList') {
                var url = '../../mock/house_list.json';
            } else if (wrapId == 'maphouseList') {
                var url = '../../mock/map_house.json';
            } else if (wrapId == 'newsList') {
                var url = '../../mock/news.json';
            } else if (wrapId == 'addIncome') {
                var url = '../../mock/host_income.json';
            } else if(wrapId=="billList"){
                var url = '../../mock/billList.json';
            }else if(wrapId=="myhouse"){
                var url = '../../mock/myhouse.json';
            }
            if (data) {
                data.currentPage = pageNum
            }
            HttpUtils.get(url, data, function (data) {
                var listData = [];

                //pdType 全部商品0;
                if (pdType == 0) {
                    //全部商品 (模拟分页数据)
                    for (var i = (pageNum - 1) * pageSize; i < pageNum * pageSize; i++) {
                        if (i == data.length) break;
                        listData.push(data[i]);
                    }

                }
                //回调
                successCallback(listData);
            }, function () {
                errorCallback
            })
        })
    }


    //模拟左划删除没用到
    function mockDel() {
        var container = document.querySelectorAll('.data-list li');
        for (var i = 0; i < container.length; i++) {
            var x, y, X, Y, swipeX, swipeY;
            container[i].addEventListener('touchstart', function (event) {
                x = event.changedTouches[0].pageX;
                y = event.changedTouches[0].pageY;
                swipeX = true;
                swipeY = true;
            });
            container[i].addEventListener('touchmove', function (event) {

                X = event.changedTouches[0].pageX;
                Y = event.changedTouches[0].pageY;
                console.log(x, y)
// 左右滑动
                if (swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0) {
// 阻止事件冒泡
                    event.stopPropagation();

                    if (X - x > 10) {   //右滑
                        event.preventDefault();
                        this.className = "";    //右滑收起
                    }
                    if (x - X > 10) {   //左滑
                        event.preventDefault();
                        var swipeLeft = document.getElementsByClassName("swipeleft");
                        for (var j = 0; j < swipeLeft.length; j++) {
                            swipeLeft[j].className = "";
                        }
                        this.className = "swipeleft";   //左滑展开
                    }
                    swipeY = false;
                }
// 上下滑动
                if (swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
                    swipeX = false;
                }
            });
        }
        var i = document.querySelectorAll('.data-list li i');
        i.forEach(function (item, index) {
            i[index].onclick = function () {
                this.parentNode.remove();
            };
        });
    }


    /**预约列表取消确认取消*****/

    function hideCancelAppoint(obj) {
        obj.find(".cancel_appoint").eq(0).click(function (e) {
            event.stopPropagation();
            console.log($(this).parents('li').eq(0), $(this).parents('li').eq(0).is(":animated"))
            if ($(this).parents('li').eq(0).is(":animated")) {
                return

            } else {

                $(this).hide();
                $(this).next().show()
                console.log(123)

            }


        })
        obj.find('.confirm_cancel_appoint').eq(0).click(function (e) {
            e.stopPropagation();
            //var houstId = $(this).parents("li").eq(0).find("a").eq(0).attr('href').split('?')[1].split('=')[1]
            // HttpUtils.get('../mock/pdlist1.j/son',houstId,function (data) {
            $(this).parents("li").eq(0).remove()
            // },function () {
            //     errorCallback
            // })
        })
        obj.find('.info_update').eq(0).click(function (e) {
            e.stopPropagation();
            //var houstId = $(this).parents("li").eq(0).find("a").eq(0).attr('href').split('?')[1].split('=')[1]
            // HttpUtils.get('../mock/pdlist1.j/son',houstId,function (data) {
            window.location.href = './house_change.html'
            // },function () {
            //     errorCallback
            // })
        })
        obj.find('.house_cancel').eq(0).click(function (e) {
            e.stopPropagation();
            //var houstId = $(this).parents("li").eq(0).find("a").eq(0).attr('href').split('?')[1].split('=')[1]
            // HttpUtils.get('../mock/pdlist1.j/son',houstId,function (data) {
            $(this).parents("li").eq(0).remove()
            // },function () {
            //     errorCallback
            // })
        })
        obj.find('.delete_collect').eq(0).click(function (e) {
            e.stopPropagation();
            // var houstId = $(this).parents("li").eq(0).find("a").eq(0).attr('href').split('?')[1].split('=')[1]
            // HttpUtils.get('../mock/pdlist1.j/son',houstId,function (data) {
            $(this).parents("li").eq(0).remove()
            // },function () {
            //     errorCallback
            // })
        })

    }


    return mescroll
}

