
const basicMenuData = [
	{
		name: '首页',
        path: 'welcome',
        icon:'home',
        code:'0'
	},
    {
    	name: '系统管理',
        path: 'system',
        icon:'appstore',
        code:'04000000',
        children: [
        	{
                name: '账号管理',
                path: 'account',
                code:'04010000'
            },
            {
                name: '项目管理',
                path: 'project',
                code:'04020000'
            },
            {
                name: '通知管理',
                path: 'notice',
                code:'04020000'
            },
            {
                name: '服务器管理',
                path: 'server',
                code:'04020000'
            }
        ]
    }
]    

function formatter(data, parentPath = '/', parentAuthority) {
    return data.map(item => {
        let { path } = item;
        path = parentPath + item.path;
        const result = {
            ...item,
            path,
            authority: item.authority || parentAuthority,
        };
        if (item.children) {
            result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
        }
        return result;
    });
}

export const getMenuData = (type='basic') => {
	if(type === 'basic'){
		return formatter(basicMenuData);
    }    
	// }else
	// if(type === 'common'){
	// 	return formatter(commonMenuData);
	// }
}
