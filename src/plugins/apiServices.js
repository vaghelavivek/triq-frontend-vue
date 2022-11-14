import axios from 'axios';
import store from '../state/store'
// import { useStore } from 'vuex'
const customAxios = axios.create({
    baseURL: process.env.VUE_APP_ENVIROMENT != 'local' ? process.env.VUE_APP_API_URL : "http://127.0.0.1:8000",
});
const requestHandler = request => {
    let idToken = store.state.auth.idToken;
    request.headers.Authorization = 'Bearer '+idToken;  
    return request;
};
const responseHandler = response => {
    if(response.status==401){
       store.dispatch('auth/logout')
    }
   return response;
};

const errorHandler = error => {
    if(error.response && error.response.status==401){
       store.dispatch('auth/logout')
    }
    return Promise.reject(error);
};

customAxios.interceptors.request.use(
    (request) => requestHandler(request),
    (error) => errorHandler(error)
);

customAxios.interceptors.response.use(
    (response) => responseHandler(response),
    (error) => errorHandler(error)
 );


export default customAxios;