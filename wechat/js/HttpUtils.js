
var HttpUtils = {} || HttpUtils;

HttpUtils.loginPage = "/portal/login";
HttpUtils.realNamePage = "/portal/realname";


/**
 * ajax请求
 */
HttpUtils.request = function(url,methodType,reqData,successCallback,errorCallback){
	$.ajax({
		url:url,
		type:methodType,
		data:reqData,
		success:function (data) {
			if(data.code){
				switch(data.code){
					case 200: if(successCallback){successCallback(data);} break;
					case 401: if(errorCallback){errorCallback(data);}
							  window.location.href = HttpUtils.loginPage; 
							  break;
					case 402: if(errorCallback){errorCallback(data);}
							  window.location.href = HttpUtils.realNamePage; 
							  break;
					default:  if(errorCallback){errorCallback(data);} break;
				}
			}else{
				if(successCallback){successCallback(data);}
			}
		}
	});
}

HttpUtils.post = function(url,data,successCallback,errorCallback){
	HttpUtils.request(url,"post",data,successCallback,errorCallback);
}

HttpUtils.get = function(url,data,successCallback,errorCallback){
	HttpUtils.request(url,"get",data,successCallback,errorCallback);
}