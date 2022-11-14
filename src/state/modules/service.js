import axios from "../../plugins/apiServices";

export const state = {
  services: [],
};

export const getters = {
  getServices(state) {
    return state.services;
  },
};

export const mutations = {
  SET_SERVICES(state, value) {
    state.services = value;
    console.log('state.services',state.services)
  },
};

export const actions = {
  // eslint-disable-next-line no-unused-vars
  async addService({state }, data) {
    let resp = await axios.post("/api/service/add-service", data);
    // if (resp.data.status == true) {
    //   state.services.unshift(resp.data.data.service);
    // }
    return resp;
  },
  async updateService({ commit, state }, payload) {
    let resp = await axios.post("/api/service/update-service", payload);
    if (resp.data.status == true) {
      let service = resp.data.data.service;
      const newState = state.services.map((obj) =>
        obj.id === service.id ? service : obj
      );
      commit("SET_SERVICES", newState);
    }
    return resp;
  },
  async setServices({ commit }) {
    let resp = await axios.get("/api/service/get-services");
    if (resp.data.status == true) {
      commit("SET_SERVICES", resp.data.data.services);
    }
    return resp;
  },
  async deleteService({ state, commit }, serviceId) {
    let resp = await axios.get("/api/service/delete-service/"+serviceId);
    if (resp.data.status == true) {
      const newState = state.services.filter(function(ser) {
        return ser.id !== serviceId;
      });
      commit("SET_SERVICES", newState);
    }
    return resp;
  },
  // eslint-disable-next-line no-empty-pattern
  async getServiceById({},serviceId) {
    let resp = await axios.get("/api/service/get-service-by-id/"+serviceId);
    return resp;
  },
  // eslint-disable-next-line no-empty-pattern
  async getServicesByUser({},userID) {
    let resp = await axios.get("/api/service/get-services-by-userid/"+userID);
    return resp;
  },
};