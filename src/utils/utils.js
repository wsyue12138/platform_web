import Store from 'store';
import { parse } from 'querystring';
import {
	Modal
} from 'antd';

//获取跳转地址
export function getPageQuery(){
	return parse(window.location.href.split('?')[1]);;
}

//获取store中个人信息
export function getUserData(){
	const { origin,pathname } = window.location;
	let data = Store.get('userData');
	if(data){
		let userData = JSON.parse(data);
		let { token,account='',name='' } = userData;
		if(token && account && name){         							//登录信息不全
			return userData;
		}else{
			Store.remove('userData');
			window.location.href = origin + pathname + '#/login';
			return {};
		}
	}else{
		Store.remove('userData');
		window.location.href = origin + pathname + '#/login';
		return {};
	}
}

//弹窗提示
export function modalContent(type,content,isBtn){
	let ref = Modal[type]({
		title: content,
		content: '',
		className:isBtn ? '' : 'selfMethod',
		okText:isBtn ? '知道了' : ''
	})
	return ref;
}

//设置权限
export function setAuthority(authorityList=[]){
	let workforceAuthority = {};
	let knowledgeAuthority = {};
	let serviceAuthority = {};
	authorityList.map((item,index) => {
		const { parentCode,permissionCode,permissionType } = item;
		if(parentCode === "05010000" && permissionType !== 1){				//知识库总览
			switch (permissionCode){
				case "05010100":											//导入权限
					knowledgeAuthority.importBtn = true;
					break;
				case "05010200":											//导出权限
					knowledgeAuthority.exportBtn = true;
					break;
				case "05010300":											//审核权限
					knowledgeAuthority.examineBtn = true;
					break;
				case "05010400":											//处理、新增完成权限
					knowledgeAuthority.handleBtn = true;
					break;
				case "05010500":											//生效权限
					knowledgeAuthority.takeEffectBtn = true;
					break;
				case "05010600":											//变更权限
					knowledgeAuthority.changeBtn = true;
					break;
				default:
					break;
			}
		}else
		if(parentCode === "05050000" && permissionType !== 1){
			switch (permissionCode){
				case "05050200":											//工单管理-处理权限
					workforceAuthority.handleBtn = true;
					break;
				default:
					break;
			}
		}else
		if(parentCode === '04020000' && permissionType !== 1){
			switch (permissionCode){
				case "04020200":											//服务功能明细导入、导出权限
					serviceAuthority.handleBtn = true;
					break;
				default:
					break;
			}
		}
	})
	return {workforceAuthority,knowledgeAuthority,serviceAuthority};
}

//换行处理
export function lineBreak(str){
	let content = str.replace(/\\n/g, " \n");
	let newStr = content.replace(/[\r\n]+/g,'@_@');
	let arr = newStr.split('@_@');
	let finalStr = '';
	if(arr.length){
		arr.map((item,index) => {
			if(index === 0){
				finalStr += item.trim();
			}else{
				finalStr += '\n' + item.trim();
			}
		})
	}else{
		finalStr = str.trim();
	}
	return finalStr;
}

//日期格式
export function setDateFormat(timers,type=1){   //type:0 YYYY年MM月DD日; 1 YYYY/MM/DD; 2 YYYY-MM-DD; 3 YYYY:MM:DD; 4 YYYYMMDD
	const timeData = new Date(timers);
	let sign = '';
	if(type === 1){
		sign = '/';
	}else
	if(type === 2){
		sign = '-';
	}else
	if(type === 3){
		sign = ':';
	}
	const Y = timeData.getFullYear();
    const M = (timeData.getMonth()+1 < 10 ? '0' + (timeData.getMonth()+1) : timeData.getMonth()+1);
    const D = (timeData.getDate() < 10 ? '0' + timeData.getDate() : timeData.getDate());
    let timerStr = Y + '' + sign + '' + M + '' + sign + '' + D;
    if(type === 0){
    	timerStr = Y + '年' + M + '月' + D + '日';
    }
    return timerStr;
}

//时间格式
export function setTimeFormat(endTime,startTime=0,type='zh_CN'){
	const endNum = new Date(endTime).getTime();
	const createNum = new Date(startTime).getTime();
	let difference = endNum - createNum;
	let timeTxt = '';
	if(difference > 0){
		let num = parseInt(difference / 1000);
		let h = Math.floor(num / 3600);
		let h1 = num % 3600;
		let m = Math.floor(h1 / 60);
		let s = h1 % 60;
		if(type === 'zh_CN'){
			if(h > 0){
				timeTxt += h + '小时';
			}
			if(m > 0 || h > 0){
				timeTxt += m + '分';
			}
			timeTxt += s + '秒';
		}else{
			if(h > 0){
				timeTxt += h + 'h';
			}
			if(m > 0 || h > 0){
				timeTxt += m + 'm';
			}
			timeTxt += s + 's';
		}

	}else{
		if(type === 'zh_CN'){
			timeTxt = '0秒';
		}else{
			timeTxt = '0s';
		}
	}
	return timeTxt;
}

//百分比处理
export function setPercentage(data,isString=true){
	const num = Number(data);
	const percentage = parseInt(num * 10000) / 100;
	return isString ? percentage + '%' : percentage;
}

//导出方法
export function handleExport(options){
	const { className,method='POST',fileName='导出案例',title='导出',headers,data,action,successCallback,errorCallback } = options;
	let ref = null;
	ref = Modal.info({
		title: '导出中......',
		content: '',
		className:'',
		okText:'知道了'
	});
	let requestData = {
		method,
        headers
	}
	if(method === 'POST'){
		requestData.body = JSON.stringify(data);
	}
    fetch(action, requestData)
        .then(response => response.blob())
        .catch(error => {
        	if(errorCallback){
        		errorCallback();
        	}
       	})
        .then(blob => {
        	if (window.navigator.msSaveOrOpenBlob) {
        		ref.destroy();
				navigator.msSaveBlob(blob, fileName);
			}else {
				ref.destroy();
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a)
                a.click();
			}
			if(successCallback){
				successCallback();
			}
        });
}

//保留两位小数
export function setFixed(data,proportion){
	const a = String(data).indexOf(".");
	const b = (data / proportion);
	let num;
	if(a != -1){
		num = b.toFixed(2);
	}else{
		num = b;
	}
	return num;
}
