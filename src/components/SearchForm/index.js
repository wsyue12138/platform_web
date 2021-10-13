import React,{ Component,Fragment } from 'react';
import { 
	Form,
	Row,
	Col,
	Input,
	Icon,
	Button,
	Select,
	Cascader,
	TimePicker,
	DatePicker
} from 'antd';
import styles from './style.less';

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

/**
 * author：wsyue
 * searchList:表单数组
 * otherBtn:其他按钮
 * onSearch:搜索回调
 * onReset:重置回调
 * onAdd:添加回调
 * addBtn:是否显示添加
 * item：{
 * 		type：表单类型,
 * 		onceStyle:单个form样式
 * 		label:表单标题
 * 		id:表单id
 * 		options：表单操作相关
 * 		domOptions：dom的kpi,
 * 		custom:自定义元素,
 * 		btnTitle:按钮文字,
 * 		iconType：按钮内图标
 * }
 * 
 * **/

 @Form.create()

class SearchFormModule extends Component{

	constructor(props){
		super(props)
		this.searchData = [];
		this.state = {
			showMore:false
		}
	}

	componentDidMount(){
		this.setSearchData();
	}

	//设置查询项
	setSearchData = () => {
		const { searchList=[] } = this.props;
		searchList.map((item,index) => {
			const { id } = item;
			this.searchData.push(id);
		})
	}


	//点击展开
	handleShowMore = () => {
		const { showMore }  = this.state;
		this.setState({showMore:!showMore});
	}

	//搜索
	handleSearch = () => {
		const { form:{validateFields},onSearch } = this.props;
		validateFields(this.searchData,(err, values) => {
	    	onSearch && onSearch(values);
	    });
	}

	//重置
	handleReset = () => {
		const { form,onReset } = this.props;
		form.resetFields(this.searchData);
		onReset && onReset();
	}
	
	//其他
	domModule = (item) => {
		const { custom='' } = item;
		return <Fragment>{custom}</Fragment>;
	}
	
	//input模块
	inputModule = (item) => {
		const { domOptions={},domStyle={},iconType } = item;
		const iconDom = iconType ? <Icon type={iconType} style={{color:'rgba(0, 0, 0, 0.25)'}}/> : '';
		return <Input prefix={iconDom} {...domOptions} allowClear style={domStyle} />;
	}
	
	//日期选择模块
	datePickerModule = (item) => {
		const { domOptions={},domStyle={} } = item;
		return <DatePicker {...domOptions} style={domStyle} />; 
	}
	
	//月份选择模块
	monthPickerModule = (item) => {
		const { domOptions={},domStyle={} } = item;
		return <MonthPicker {...domOptions} month style={domStyle} />; 
	}
	
	//日期区间模块
	rangePickerModule = (item) => {
		const { domOptions={},domStyle={} } = item;
		return <RangePicker {...domOptions} style={domStyle} />; 
	}
	
	//星期模块
	weekPickerModule = (item) => {
		const { domOptions={},domStyle={} } = item;
		return <WeekPicker {...domOptions} week style={domStyle} />;
	}
	
	//时间模块
	timePickerModule = (item) => {
		const { domOptions={},domStyle={} } = item;
		return <TimePicker {...domOptions} style={domStyle} />;
	}
	
	//下拉选择模块
	selectModule = (item) => {
		const { domOptions={},domStyle={},optionList=[],valueName='',labelName='' } = item;
		//domOptions.getPopupContainer = (triggerNode) => triggerNode.parentNode;
		return (
			<Select {...domOptions} allowClear style={domStyle}>
				{
					optionList.map((item,index) => {
						return(
							<Option 
								key={item[valueName]}
								value={item[valueName]}
							>
								{item[labelName]}
							</Option>
						)
					})
				}
			</Select>
		)
	}
	
	//级联选择模块
	cascaderModule = (item) => {
		const { domOptions={},domStyle={} } = item;
		domOptions.getPopupContainer = (triggerNode) => triggerNode.parentNode;
		return <Cascader {...domOptions} allowClear style={domStyle} />
	}
	
	//按钮模块
	buttonModule = (item) => {
		const { domOptions={},domStyle={},btnTitle='',iconType } = item;
		return(
			<Button {...domOptions} style={domStyle}>
          		{ btnTitle }
          		{ iconType ? <Icon type={iconType} /> : ''}
          	</Button>
		)
	}
	
	contentModule = (item,index) => {
		const { form:{getFieldDecorator},searchList=[] } = this.props;
		const { type,id='',onceOptions={},onceStyle={} } = item;
		const _len = searchList.length - 1;
		let onceContent = '';
		switch (type){
			case 'Dom':											//自定义dom
				onceContent = this.domModule(item);
				break;
			case 'Input':										//input输入框
				onceContent = this.inputModule(item);
				break;	
			case 'DatePicker':									//日期选择
				onceContent = this.datePickerModule(item);
				break;	
			case 'MonthPicker':									//月份选择
				onceContent = this.monthPickerModule(item);
				break;
			case 'RangePicker':									//区间选择
				onceContent = this.rangePickerModule(item);
				break;
			case 'WeekPicker':									//星期选择
				onceContent = this.weekPickerModule(item);
				break;	
			case 'TimePicker':									//时间选择
				onceContent = this.timePickerModule(item);
				break;
			case 'Select':										//下拉选择
				onceContent = this.selectModule(item);
				break;
			case 'Cascader':									//级联选择
				onceContent = this.cascaderModule(item);
				break;	
			case 'Button':										//按钮
				onceContent = this.buttonModule(item);
				break;
			default:
				break;
		}
		const idTxt = type === 'Button' || type === 'Dom' ? 'btn_' + index : id;
		let itemStyle = {...onceStyle};
		if(type !== 'Button'){
			if(index !== _len && type !== 'Dom'){
				const nextObj = searchList[index + 1];
				if(nextObj.type === 'Button'){
					itemStyle = {...onceStyle,marginRight:16}
				}
			}
		}else{
			itemStyle = {...onceStyle,width:'100%'}
		}
		
		return(
			<Fragment key={idTxt}>
				{
					type != '' ? (
						<Form.Item style={itemStyle}>
					        {getFieldDecorator(idTxt,onceOptions)(onceContent)}
					    </Form.Item>
					) : ''
				}
			</Fragment>
		)
	}

	//按钮
	btnContent(){
		const { otherBtn } = this.props;
		return(
			<Fragment>
				<Button type="primary" style={{marginRight:16}} onClick={this.handleSearch}>
					搜索
					<Icon type="search" />
				</Button>
				<Button style={{marginRight:16}} onClick={this.handleReset}>
					重置
					<Icon type='sync' />
				</Button>
				{otherBtn}
			</Fragment>
		)
	}
	
	render(){
		const { showMore } = this.state;
		const { searchList=[],addBtn,onAdd } = this.props;
		const copySearchList = JSON.parse(JSON.stringify(searchList));
		const _len = searchList.length;
		let dataList = [];
		if(showMore){
			dataList = [...copySearchList];
		}else{
			dataList = copySearchList.splice(0,4);
		}
		return(
			<div className={styles.searchFormBox}>
				<div className={styles.form_content}>
					<div className={styles.content_right}>
						{
							_len > 4 && (
								<div className={styles.showMore}>
									<span className={styles.showMore_btn} onClick={this.handleShowMore}>
										{showMore ? '收起' : '展开'}
										{ showMore ? (<Icon type="up" style={{marginLeft:4}} />) : (<Icon type="down" style={{marginLeft:4}} />) }
									</span>
								</div>
							)
						}
						{_len >= 4 && this.btnContent()}
					</div>
					<div className={styles.content_left}>
						<Row gutter={16}>
							<Form layout="inline">
								{
									dataList.map((item,index) => {
										return(
											<Col span={6} style={{marginTop:index > 3 ? 12 : 0,height:'32px'}} key={item.id}>
												{this.contentModule(item,index)}
											</Col>
										)
									})
								}
							</Form>
							{ 
								_len < 4 && (
									<div className={styles.copy_btn_box}>
										<div>
											{this.btnContent()}
										</div>
									</div>
								) 
							}
						</Row>
					</div>
				</div>
				{
					addBtn && (
						<div className={styles.search_control}>
							<span className={styles.addBtn} onClick={onAdd}>
								<Icon type="plus" style={{marginRight:6}}/>
								新增
							</span>
						</div>
					)
				}
			</div>
		)
	}
}

export default SearchFormModule;
