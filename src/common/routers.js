const routeList = [
    {
        path: '/login',
        component: '../layouts/UserLayout',
        routes: [
            { path: '/login', title:'登录', component: '../pages/Login/Login' }
        ],
    },
    {
        path:'/',
        Routes: ['./src/components/Authorized'],
        component: '../layouts/BasicLayout',
        routes:[
            { exact:true, path:'/', redirect:'/welcome'},
            { title:'首页', path: '/welcome', component: '../pages/Welcome/Welcome' },
            {
                path:'system',
                component: '../pages/System',
                routes:[
                    { exact:true, path:'/system', redirect:'/system/account' },
                    {
                        title: '账号管理',
                        path: '/system/account',
                        component: '../pages/System/Account/Account'
                    },
                    {
                        title: '项目管理',
                        path: '/system/project',
                        component: '../pages/System/Project/Project'
                    },
                    {
                        title: '通知管理',
                        path: '/system/notice',
                        component: '../pages/System/Notice/Notice'
                    },
                    {
                        title: '服务器管理',
                        path: '/system/server',
                        component: '../pages/System/Server/Server'
                    },
					{
						component: '../pages/404'  
					}
                ]
            },
			{
				component: '../pages/404'  
			}
        ]
    }        
]

exports.routes = routeList;