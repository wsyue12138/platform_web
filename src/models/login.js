import {
	userLogin,
	changePwd,
	resetPwd,
	disablePwd,
	unDisablePwd,
	logout
} from '../services/loginApi'
export default {
  namespace: 'login',
  state: {
    fastpermission:undefined,
    permission:undefined,
    token:undefined,
    tokenExpire:undefined,
    user:undefined,
  },

  effects: {
  	//登录
    *fetchLogin({ payload, callback }, { call, put }) {
      // 登录提交
      const response = yield call(userLogin, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'signLogin',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    }
  },

  reducers: {
    signLogin(state, { payload }) {
      const { fastpermission, permission, token, tokenExpire, user } = payload.data;
      	return {
        	...state,
        	fastpermission,
          permission,
          token,
          tokenExpire,
          user,
      	};
    }
  },
};
