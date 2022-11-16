import axios from '@/plugins/apiServices.js' 
import router from '@/router';
export const state = {
  authenticated:false,
  user:'',
  idToken:'',
};


// mutations
export const mutations = {
 SET_AUTHENTICATED (state, value) {
        state.authenticated = value
  },
  SET_USER (state, value) {
      state.user = value
  },
  SET_ID_TOKEN(state, value){
      state.idToken = value
  }
}

// getters
export const getters = {
  authenticated(state){
      return state.authenticated
  },
  user(state){
      return state.user
  },
  getIdToken(state){
      return state.idToken
  }
}
//actions
export const actions = {
  /** User login  **/
  async systemLogin({ commit }, data) {
    let resp = await axios.post('/api/login', data)
    if(resp.data.status==true){
      commit('SET_USER',resp.data.data.user_data)
      commit('SET_ID_TOKEN',resp.data.data.accesstoken)
      commit('SET_AUTHENTICATED',true)
    }
    return resp;
  },
  logout({ commit }){
      commit('SET_USER','')
      commit('SET_ID_TOKEN','')
      commit('SET_AUTHENTICATED',false)
      router.push({name: 'login'})
  },
  // eslint-disable-next-line no-empty-pattern
  async checkPhoneExist({}, data) {
    let resp = await axios.post('/api/get-user-by-phone', data)
    return resp;
  },
  async generateToken({ commit }, data) {
    let resp = await axios.post('/api/login-using-firebase', data)
    if(resp.data.status==true){
      commit('SET_USER',resp.data.data.user_data)
      commit('SET_ID_TOKEN',resp.data.data.accesstoken)
      commit('SET_AUTHENTICATED',true)
    }
    return resp;
  },
   // eslint-disable-next-line no-empty-pattern
   async checkEmailExist({}, data) {
    let resp = await axios.post('/api/get-user-by-email', data)
    return resp;
  },
   // eslint-disable-next-line no-empty-pattern
   async registerUser({}, data) {
    let resp = await axios.post('/api/register-user', data)
    return resp;
  },
}
