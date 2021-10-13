import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import { Layout,Modal } from 'antd';
import Store from 'store';
import router from 'umi/router';
import ReconnectingWebSocket from "reconnecting-websocket";
import WebsocketModule from '@components/WebsocketModule';
import { getUserData } from '@utils/utils';
import styles from './style.less';


const { Header } = Layout;

@connect(({
	global,
	login,
	user,
	news,
	single,
	multiple,
	socketetModel
}) => ({
	global,
	login,
	user,
	news,
	single,
	multiple,
	socketetModel
}))

class HeaderContent extends Component{

	state = {
		_ws:null,
		document_title:''
	}

	componentWillMount(){
		//this.setTitle();
		this.timer = null;
		this.childModule = null;
	}

	componentDidMount(){
		const { type='index' } = this.props;
		this.timer = null;
		this.takeOff = false;
		if(type === 'index'){
			// clearInterval(this.timer);
			// this.getNoticeCount();
			// this.setCurrentProduct();
			// this.timer = setInterval(() => {
			// 	this.getNoticeCount();
			// },120000);
		}
	}

	componentWillUnmount(){
		clearTimeout(this.timer);
	}

	//退出
	signOut = () => {
		Store.remove('userData');
		router.replace('/login');
	}

	//退出提醒
	handleSignOut = () => {
		Modal.confirm({
			title: '退出',
			content: '是否确定退出',
			okText: '确认',
			cancelText: '取消',
			onOk:() => {
				this.signOut();
			}
		});
	}

	render(){
		const { type='index',route={} } = this.props;
		const routesData = route.routes ? route.routes : [];
		let userData = getUserData();
		const { name='' } = userData;
		let currentTitle;
		const setTitle = (data) => {
			const { location:{pathname} } = this.props; 
			data.map((item,index) => {
				const { routes=[],path='',title='' } = item;
				if(path === pathname){
					currentTitle = title;
				}else{
					if(routes.length > 0){
						setTitle(routes);
					}
				}
			})
		}
		setTitle(routesData);
		return(
			<div className={styles['header-box']}>
				<Header className={styles['basic-header']}>
					<div className={styles.currentTitle}>{currentTitle}</div>
					<div className={styles.content}>
						<div className={styles.sign_out} onClick={this.handleSignOut}>退出</div>
						<div className={styles.userName}>{name}</div>
					</div>
              		{/* <WebsocketModule headerType={type} /> */}
			        
			    </Header>
		    </div>
		)
	}
}

export default HeaderContent;
