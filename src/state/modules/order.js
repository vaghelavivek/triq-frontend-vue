import axios from "../../plugins/apiServices";

export const state = {
  orders: [],
};

export const getters = {
  getOrders(state) {
    return state.orders;
  },
};

export const mutations = {
  SET_ORDERS(state, value) {
    state.orders = value;
  },
};

export const actions = {
  // eslint-disable-next-line no-unused-vars
  async addOrder({state }, data) {
    let resp = await axios.post("/api/order/add-order", data);
    // if (resp.data.status == true) {
    //   state.orders.unshift(resp.data.data.order);
    // }
    return resp;
  },
  async updateOrder({ commit, state }, payload) {
    let resp = await axios.post("/api/order/update-order", payload);
    if (resp.data.status == true) {
      let order = resp.data.data.order;
      const newState = state.orders.map((obj) =>
        obj.id === order.id ? order : obj
      );
      commit("SET_ORDERS", newState);
    }
    return resp;
  },
  async setOrders({ commit }) {
    let resp = await axios.get("/api/order/get-orders");
    if (resp.data.status == true) {
      commit("SET_ORDERS", resp.data.data.orders);
    }
    return resp;
  },
  async deleteOrder({ state, commit }, orderId) {
    let resp = await axios.get("/api/order/delete-order/"+orderId);
    if (resp.data.status == true) {
      const newState = state.orders.filter(function(ser) {
        return ser.id !== orderId;
      });
      commit("SET_ORDERS", newState);
    }
    return resp;
  },
  // eslint-disable-next-line no-empty-pattern
  async getOrderById({},orderId) {
    let resp = await axios.get("/api/order/get-order-by-id/"+orderId);
    return resp;
  },

};