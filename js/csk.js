$(function(){

			//全选函数
			$('.checkbox-all').click(function(){
				if($(this).prop('checked')){
					$(this).parents('.select-box-title').eq(0).next().find('.checkboxs').prop('checked',true);
				}else{
					$(this).parents('.select-box-title').eq(0).next().find('.checkboxs').prop('checked',false);
				}
				btn_status($(this));
			})
			$('.select-box-title>span').click(function(){
				$(this).prev().prev().click()
			})

			//单个checkbox与全选的关系函数
			$('.select-content').on('click','.checkboxs',function(e){
				var checkedAll = $(this).parents('.select-content').prev().find('.checkbox-all');
				//console.log(checkedAll.attr('id'))
				var checkboxs = $(this).prop('checked');
				if(!checkboxs&&checkedAll.length>0&&checkedAll.prop('checked')){
					checkedAll.prop('checked',false);
				}else if(checkedAll.length>0&&checkboxs&&!checkedAll.prop('checked')){
					var lis = $(this).parents('ul').eq(0).children();
					console.log(lis)
					for(var i=0;i<lis.length;i++){
						if($(lis[i]).find('.checkboxs').prop('checked')){
							if(i==lis.length-1){
								checkedAll.trigger('click')
							}
						}else{
							break;
						}
					}
				}
				stopFunc(e);
			});
			$('.select-content').on('click','li',function(){
				$(this).children('.checkboxs').click();
				btn_status($(this));
			})
			$('.select-content').on('click','label',function(e){
				stopFunc(e);
				var _this = $(this)
				setTimeout(function () {
					btn_status(_this);
				},200)


			})
			// 动态判断改变btn状态
			function btn_status(obj){
				console.log(obj)
				if(obj.parents('.selection-container').hasClass('second')){
					var btn1 =document.getElementsByClassName('right')[2]
					var btn2 =document.getElementsByClassName('left')[3]
					var left_ul = document.getElementsByClassName('unselect-ul')
					var right_ul = document.getElementsByClassName('selected-ul')
					var left_ul_li = left_ul[1].children
					var right_ul_li = right_ul[1].children
				}else if(obj.parents('.selection-container').hasClass('adduser')){
					var btn1 =document.getElementsByClassName('right')[0]
					var btn2 =document.getElementsByClassName('left')[1]
					var left_ul = document.getElementsByClassName('unselect-ul')
					var right_ul = document.getElementsByClassName('selected-ul')
					var left_ul_li = left_ul[0].children
					var right_ul_li = right_ul[0].children
				}else if(obj.parents('.selection-container').hasClass('edituser')){
					var btn1 =document.getElementsByClassName('right')[2]
					var btn2 =document.getElementsByClassName('left')[3]
					var left_ul = document.getElementsByClassName('unselect-ul')
					var right_ul = document.getElementsByClassName('selected-ul')
					var left_ul_li = left_ul[1].children
					var right_ul_li = right_ul[1].children
				}else{
					var btn1 =document.getElementsByClassName('right')[0]
					var btn2 =document.getElementsByClassName('left')[1]
					var left_ul = document.getElementsByClassName('unselect-ul')
					var right_ul = document.getElementsByClassName('selected-ul')
					var left_ul_li = left_ul[0].children
					var right_ul_li = right_ul[0].children
				}

				var left_btn = false
				var right_btn = false
				for(var i=0;i<left_ul_li.length;i++){
					console.log(left_ul_li[i].firstElementChild.checked)
					if(left_ul_li[i].firstElementChild.checked == true){
						left_btn = true
					}
				}
				for(var i=0;i<right_ul_li.length;i++){
					if(right_ul_li[i].firstElementChild.checked == true){
						right_btn = true
					}
				}
				if(left_btn){
					btn1.classList.add('btn-cursor')
				}else{
					btn1.classList.remove('btn-cursor')
				}
				if(right_btn){
					btn2.classList.add('btn-cursor')
				}else{
					btn2.classList.remove('btn-cursor')
				}
				
			}
			//左右移按钮点击事件
			$('.arrow-btn').click(function(){
				var checkboxs,origin,target,num=0;
				if($(this).hasClass('right')){
					origin = $(this).parents('.selection-container').eq(0).find('.unselect-ul')//$('.unselect-ul');
					target = $(this).parents('.selection-container').eq(0).find('.selected-ul')
				}else{
					origin = $(this).parents('.selection-container').eq(0).find('.selected-ul')
					target = $(this).parents('.selection-container').eq(0).find('.unselect-ul')
				}
				checkboxs = origin.find('.checkboxs');
				for(var i=0;i<checkboxs.length;i++){					
					if($(checkboxs[i]).prop('checked')){
						var that = $(checkboxs[i]).parent().clone();
						that.children('input').prop('checked',false);
						target.append(that);
						$(checkboxs[i]).parent().remove();
					}else{
						num++;
					}
				}
				if(checkboxs.length == num){
//					alert('未选中任何一项');
				}else{
					origin.parent().prev().find('.checkbox-all').prop('checked',false);
				}
				btn_status($(this));
			})

		})


		function stopFunc(e){
			e.stopPropagation?e.stopPropagation():e.cancelBubble=true;
		}