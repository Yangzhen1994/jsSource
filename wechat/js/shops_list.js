/*商铺列表js,根据原本的house_list.js修改，去掉多余的部分*/
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
    }

    /*联网加载列表数据*/
    function getListDataFromNet(pdType, pageNum, pageSize, data, successCallback, errorCallback) {
        console.log(data)
        //延时一秒,模拟联网
        setTimeout(function () {
            var url = '../../mock/pdlist1.json';
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

    return mescroll
}

