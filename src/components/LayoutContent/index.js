import React,{ Component,Fragment } from 'react';
import { Layout, Tabs } from 'antd';
import Redirect from 'umi/redirect';
import { getMenuData } from '@common/menu';
import styles from './style.less';

export default function LayoutContent(props){
  const { routeList=[] } = props;
	return(
		<Fragment>
			<div className={styles['content']} >
              	{routeList}
            </div>
        </Fragment>
	)
}
