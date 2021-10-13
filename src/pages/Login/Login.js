import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import { Alert, Form, Input, Button, Checkbox, Icon } from 'antd';
import router from 'umi/router';
import Store from 'store';
import { encryption } from '@utils/jsencrypt';
import { getPageQuery } from '@/utils/utils';
import styles from './Login.less';

const FormItem = Form.Item;

const LoginMessage = ({ content }) => (
  <Alert className={styles.alerts} message={content} type="error" showIcon />
);


@connect(({
	login
}) => ({
	login
}))

@Form.create()

class Login extends Component{

	state = {
		rememberData:{remember:true}
	}

	componentWillMount(){
		//禁止重复提交
		this.isSubmit = true;
	}

  	componentDidMount(){
		this.getRememberData();
  	}

	//获取记录账户信息
	getRememberData = () => {
		const rememberData = Store.get('rememberData');
		if(rememberData){
			const data = JSON.parse(rememberData);
			const { remember } = data;
			this.setState({rememberData:data},() => {
				if(!remember){
					Store.remove('rememberData');
				}
			});
		}
	}

	//获取公钥
	getPublicKey = (data) => {
		const { form,dispatch } = this.props;
		let { username,password } = data;
		dispatch({
			type:'user/fetchGetPublicKey',
			callback:(res) => {
				let { success } = res;
				if(success){
					let { data:{publicKey} } = res.data;
					this.handleRequest({userName:username,userPwd:encryption(publicKey,password),publicKey});
				}else{
					this.isSubmit = true;
					form.resetFields(['password']);
				}
			}
		})
	}

	//请求
	handleRequest = (payload) => {
		const { form,dispatch } = this.props;
		dispatch({
			type:'login/fetchLogin',
			payload,
    		callback:(res) => {
    			let { success } = res;
    			if(success){
    				let { data=null } = res.data;
    				this.setLoginData(payload,data);
    			}else{
      				this.setState({isErr:true},() => {
						this.isSubmit = true;
						form.setFields({
                            'password': {
                                value: '',
                                errors: [new Error('用户不存在或密码错误')],
                            },
                        });
					})
    			}
    		}
		})
	}

	//登录处理
	setLoginData = (rememberData,data) => {
		const { account,password,remember } = rememberData;
		const params = getPageQuery();
		let { redirect } = params;
		let obj = {remember};
		if(remember){
			obj.account = account;
			obj.password = window.btoa(password);
		}else{
			obj.account = '';
			obj.password = '';
		}
		this.setUserData(data);
		Store.set('rememberData', JSON.stringify(obj));
		if (redirect) {
			window.location.href = redirect;
		}else{
			router.replace('/');
		}
	}

	//存储个人信息
	setUserData = (data) => {
		const { token,user={} } = data;
		const { account='',name='' } = user;
		const userData = {token,account,name};
		Store.set('userData', JSON.stringify(userData));
	}

	//登录
	handleLogin = (e) => {
		e.preventDefault();
		if(!this.isSubmit){
			return
		}
		this.isSubmit = false;
		const { dispatch,form } = this.props;
		form.validateFields(['account','password','remember'],(err, fieldsValue) => {
			if(err){
				this.isSubmit = true;
    			console.log('err')
    		}
			const { account,password } = fieldsValue;
			this.isSubmit = true;
			if(account === 'admin' && password === '123456'){
				this.setLoginData(fieldsValue,{
					token:'aaaaaa111111',
					user:{account:1,name:'齐天大圣'}
				})
			}else{
				form.setFields({
					'password': {
						value: '',
						errors: [new Error('用户不存在或密码错误')],
					},
				});
			}	
			//this.handleRequest(fieldsValue);
		})
	}

	//本地存储
	setStore = (data) => {
		if(data != null){
			let { token='',user={} } = data;
			let { id=0 } = user;
			let userData = {
				data:{
					token,
					userId:id,
					loginSuccess:0     //0未选择产品  1以选择  2重新选择
				},
				time:new Date().getTime()
			}
			Store.set('userData', JSON.stringify(userData));
		}
	}

	render(){
		const { rememberData } = this.state;
		const { form:{getFieldDecorator} } = this.props;
		const { account='',password='',remember } = rememberData;
		return(
			<div className={styles.loginBox}>
				<div className={styles.container}>
					<div className={styles.content}>
						<div className={styles.main}>
							<div className={styles.block}>
								<div className={styles.login_title}>平台通用框架</div>
								<div className={styles.mainLogin}>
									<Form id='loginForm' onSubmit={this.handleLogin}>
										<div className={styles.account}>
											<FormItem>
												{getFieldDecorator('account', {
													initialValue:remember ? account : undefined,
            										rules: [{ required: true, message: '请输入账号' }],
          										})(
													<Input
														prefix={<Icon type="user" style={{ color: '#333' }} />}
														placeholder="请输入账号"
														style={{width:'100%'}}
														//onFocus={obtain} //获取焦点时候
													/>
												)}
												
											</FormItem>
										</div>
										<div className={styles.password}>
											<FormItem>
												{getFieldDecorator('password', {
													initialValue:remember ? window.atob(password) : undefined,
            										rules: [{ required: true, message: '请输入密码' }],
          										})(
													<Input
														prefix={<Icon type="lock" style={{ color: '#333' }} />}
														placeholder="请输入密码"
														type="password"
														style={{width:'100%'}}
														//onFocus={obtain} //获取焦点时候
													/>
												)}	  
											</FormItem>
										</div>
										<div className={styles.checkbox}>
											<FormItem style={{ marginBottom: 0 }}>
												{getFieldDecorator('remember', {
													valuePropName: 'checked',
													initialValue: remember,
												})(
													<Checkbox className={styles.fff} >记住密码</Checkbox>
												)}	
											</FormItem>
										</div>

										<Button
											type="primary"
											htmlType="submit"
											style={{
												width: '100%',
											}}
										>
											登录
										</Button>
									</Form>
								</div>	
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Login;
