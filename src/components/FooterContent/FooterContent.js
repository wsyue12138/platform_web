import React,{ Component } from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import styles from './FooterContent.less';

const { Footer } = Layout;

export default class FooterContent extends Component{
	render(){
		return(
			<Footer className={styles['basic-footer']}>
				杭州北冥星眸科技有限公司祝您工作愉快！
			</Footer>
		)
	}
}
