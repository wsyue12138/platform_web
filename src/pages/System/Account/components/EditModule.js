import React,{ Component } from 'react';
class AccountEdit extends Component{
    componentDidMount(){
		this.props.onRef(this);
	}
    render(){
        return(
            <div>编辑</div>
        )
    }
}

export default AccountEdit;