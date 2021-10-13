import React,{ useState,useEffect,Fragment } from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';
import { setDateFormat } from '@utils/utils';
import styles from './Welcome.less';

const { TabPane } = Tabs;

const Welcome = (props) => {

	
	return(
		<div className={styles.welcomeBox}>
			<div className={styles.welcomeContent}>
			平台通用框架
			</div>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		global:state.global,
		user:state.user
	}
}

export default connect(mapStateToProps)(Welcome);
