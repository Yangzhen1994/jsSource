function calendarPick1(id,valueWrapId) {
    var showRateDoms = $('#'+id);
    showRateDoms.focus(function () {
        showRateDoms.blur()
    })
    //var endshowRateDoms = $('#endDateInput');
    showRateDoms.attr('data-year', '1');
    showRateDoms.attr('data-month', '1');
    showRateDoms.attr('data-date', '1');
    //endshowRateDoms.attr('data-year', '1');
    //endshowRateDoms.attr('data-month', '1');
    //endshowRateDoms.attr('data-date', '1');
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    //年
    var arr = [];
    for (var i = year-118; i <= year; i++) {
        arr.push({
            id: i + '',
            value: i + '年'
        });
    }
    ;
    //月
    var arr1 = [];
    for (var j = 1; j <= 12; j++) {
        if (j < 10) {
            j = '0' + j
        }
        arr1.push({
            id: j + '',
            value: j + '月'
        });
    }
    ;
    //日
    var arr2 = [];
    for (var k = 1; k <= 31; k++) {
        if (k < 10) {
            k = '0' + k
        }
        arr2.push({
            id: k + '',
            value: k + '日'
        });
    }
    ;

    showRateDoms.click(function () {
        //var rateIds = showRateDoms.dataset['id'];
        var oneLevelId = showRateDoms.attr('data-year');
        var twoLevelId = showRateDoms.attr('data-month');
        var threeLevelId = showRateDoms.attr('data-date');

        var rateSelect = new IosSelect(3, [arr, arr1, arr2], {
            container: '.container',
            title: '起租日期',
            itemHeight: 38,
            itemShowCount: 5,
            oneLevelId: oneLevelId,
            twoLevelId: twoLevelId,
            threeLevelId: threeLevelId,
            callback: function (selectOneObj, selectTwoObj, selectThreeObj) {
                console.log(selectOneObj, selectTwoObj, selectThreeObj);
                var str = selectOneObj.value.replace('年','-') + selectTwoObj.value.replace('月','-') + selectThreeObj.value.replace('日','')
                showRateDoms.val(str.trim())
                showRateDoms.focus()
            },
            fallback:function () {
                showRateDoms.focus()
            },
            shadowback:function () {
                showRateDoms.focus()
            }
        });
    });
}