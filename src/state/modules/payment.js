import axios from '@/plugins/apiServices.js' 
// import router from '@/router';
export const state = {
    paymentObject:{}
};


// mutations
/* eslint:disable:no-empty */
export const mutations = {}

// getters
/* eslint:disable:no-empty */
export const getters = {}
//actions
export const actions = {
  // eslint-disable-next-line no-empty-pattern
  async initiateTransaction({}, data) {
    let resp = await axios.post('/api/payment/create-transaction-token', data)
    return resp;
  },
}