import React,{ Component,Fragment } from 'react';
import { Drawer,Button } from 'antd';
import styles from './index.less';

/**
 * content:抽屉内容
 * size: 抽屉宽度（large，medium，small）
 * isFooter：是否显示底部
 * isOk：是否显示确定按钮
 * isCancel:是否显示返回按钮
 * okText：确定按钮文字
 * cancelText:取消按钮文字
 * onOk：确定
 * onCancel:取消
 * drawerProps:抽屉配置参数
 * moreBtnData：更多按钮参数
 * **/

export default function DrawerMount(props){
	
	const footerContent = () => {
		let { 
			isOk=true,
			isCancel=true,
			onOk=() => {return false},
			onCancel= () => {return false},
			okText='确定',
			cancelText='返回',
			moreBtnData=[]
		} = props;
		return (
			<div className={styles.drawerFooter}>
	          	{
	          		isCancel ? (<Button 
	          						style={{marginRight:30}} 
	          						onClick={onCancel}
	          					>
	          						{cancelText}
	          					</Button>
	          				) : ''
	          	}
				{
					isOk ? (<Button 
								type="primary" 
								style={{marginRight:moreBtnData.length ? 30 : 0}} 
								onClick={onOk}
							>
								{okText}
							</Button>
						) : ''
				}
				{
					moreBtnData.map((item,index) => {
						let { type,text,onClick } = item;
						return(
							<Button 
								key={index}
								type={type} 
								style={{marginRight:30}} 
								onClick={onClick}
							>
								{text}
							</Button>
						)
					})
				}
	        </div>
		)
	}
	
	let { 
		content='',
		drawerProps={},
		isFooter=true,
		size='medium'
	} = props;
	let { title='',width=0 } = drawerProps;
	let newTitle = (
		<div className={styles.titleContent}>
			{/* <span className={styles.circularBox}>
				<span></span>
			</span> */}
			<span className={styles.titleTxt}>{title}</span>
		</div>
	)
	drawerProps.title = newTitle;
	drawerProps.maskClosable = false;
	if(!width){
		switch (size){
			case 'large':
				drawerProps.width = 1200;
				break;
			case 'x-medium':
				drawerProps.width = 850;	
				break;		
			case 'medium':
				drawerProps.width = 650;
				break;
			case 'small':
				drawerProps.width = 450;
				break;
			default:
				drawerProps.width = 650;
				break;
		}
	}
	return(
		<Drawer 
			className={styles.drawerMount}
			{...drawerProps}
		>
			<div className={styles.contentBody}>
          		{content}
          	</div>
          	{
          		isFooter ? footerContent() : ''
          	}
        </Drawer>
	)
}
