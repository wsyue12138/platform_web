import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import {
	Button
} from 'antd';
import SearchForm from '@components/SearchForm';
import TableContent from '@components/TableContent';
import DrawerMount from '@components/DrawerMount';
import EditModule from './components/EditModule';
import styles from './Account.less';

@connect(({ 
    global,
	login
}) => ({
    global,
	login
}))

class Account extends Component{
    constructor(props){
        super(props)
        this.state = {
            loading:false,
            visible:false
        }
    }

	componentDidMount(){
		console.log(this.props.login)
	}

    onRef = (ref) => {
        this.childModule = ref; 
    }

    //搜索
    handleSearch = (data) => {
        console.log(data)
    }

    //重置
    handleRest = () => {
        console.log('重置')
    }

    //添加
    handleAdd = () => {
		this.setState({visible:true});
        console.log('添加')
    }

    //搜索部分
	searchModule(){
		const searchList = [
			{
				type:'Input',
				id:'search_cid',
				domOptions:{placeholder:'登录工号'},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'search_cname',
				domOptions:{placeholder:'姓名'},
				iconType:'edit'
			},
			{
				type:'Select',
				id:'search_sourceType',
				domOptions:{placeholder:'来源'},
				optionList:[
					{val:1,label:'系统'},
					{val:2,label:'用户'}
				],
				valueName:'val',
				labelName:'label'
			},
            {
                type:'RangePicker',
				id:'search_beginTm',
				domOptions:{placeholder:['操作时间','操作时间']},
				domStyle:{format:"YYYY-MM-DD"}
            },
			{
				type:'Input',
				id:'search_cname1',
				domOptions:{placeholder:'姓名'},
				iconType:'edit'
			},
            {
				type:'Input',
				id:'search_cid11',
				domOptions:{placeholder:'登录工号'},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'search_cname11',
				domOptions:{placeholder:'姓名'},
				iconType:'edit'
			}
			
		]
		
		return <SearchForm 
            {...this.props} 
            searchList={searchList} 
            addBtn={true}
            onSearch={this.handleSearch} 
            onReset={this.handleRest}
            onAdd={this.handleAdd}
        />
	}

    //列表部分
	tableModule(){
		const { loading,pageNum=1,pageSize=10 } = this.state;
        const accountData = {};
		const { list=[
            // {id:0,cid:'558',cname:'阿斯顿发顺丰'},
            // {id:1,cid:'558',cname:'阿斯顿发顺丰'},
            // {id:2,cid:'558',cname:'阿斯顿发顺丰'},
            // {id:3,cid:'558',cname:'阿斯顿发顺丰'},
            // {id:4,cid:'558',cname:'阿斯顿发顺丰'},
            // {id:5,cid:'558',cname:'阿斯顿发顺丰'},
            // {id:6,cid:'558',cname:'阿斯顿发顺丰'},
            // {id:7,cid:'558',cname:'阿斯顿发顺丰'},
            // {id:8,cid:'558',cname:'阿斯顿发顺丰'},
            // {id:9,cid:'558',cname:'阿斯顿发顺丰'}
        ],total=50 } = accountData;
		let columns = [
			{
				title: '登录工号',
    			key: 'jobNum',
    			width:'40%',
    			render: text => {
    				let { cid } = text;
    				return(
    					<span>{cid}</span>
    				)
    			}
			},
			{
				title: '姓名',
    			key: 'personName',
    			width:'40%',
    			render: text => {
    				let { cname } = text;
    				return(
    					<span>{cname}</span>
    				)
    			}
			},
			{
				title: '操作',
    			key: 'operation',
    			render: text => {
    				let { status } = text;
    				return(
    					<Fragment>
    						<Button type="link" onClick={() => this.setState({visible:true})}>修改</Button>
                            <Button type="link">修改</Button>
                            <Button type="link" style={{color:'#ff7875'}}>删除</Button>
    					</Fragment>
    				)
    			}
			}
			
		]
		
		const tableOptions = {
			onceKey:'id',
			loading, 
			columns,
			dataSource:list
		}
		
		const pageOptions = {
			//totalShow:true,
	  		current: pageNum,
	  		pageSize: pageSize,
	  		onChange: (current, pageSize) => {
	  			this.setState({pageNum:current,pageSize},() => {
      				this.getList();
      			});
	  		},
	  		total,
            custom:(
                <Button type="danger" ghost style={{marginRight:12}}>
                    批量删除
                </Button>
            )
		}
		
		return <TableContent tableOptions={tableOptions} pageOptions={pageOptions} />
	}

    //抽屉
	drawerContent(){
		const { visible } = this.state;
		//关闭
		const handleClose = () => {
			this.setState({visible:false});
		}
		//确定
		const handleOk = () => {
			//this.childModule.handleSave();
		}
		let drawerOptions = {
            size:'small',
			content:(<EditModule onRef={this.onRef} />),
			isOk:true,
			okText:'保存',
			onOk:handleOk,
			onCancel:handleClose
		}
		let drawerProps = {
			title:'账号管理-修改',
	        placement:"right",
	        closable:false,
	        destroyOnClose:true,
	        onClose:handleClose,
	        visible:visible
		}
		return(
			<Fragment>
				<DrawerMount  
					drawerProps={drawerProps}
					{...drawerOptions}
				/>
			</Fragment>
		)
	}

    render(){
        return(
            <div>
                {this.searchModule()}
                {this.tableModule()}
                {this.drawerContent()}
            </div>
        )
    }
}

export default Account;