import axios from '@/plugins/apiServices.js' 
export const state = {
  users: [],
  userlists: []
};

export const getters = {
  getUsers(state) {
    return state.users;
  },
  getUserLists(state) {
    return state.userlists;
  },
};

export const mutations = {
  SET_USERDATA(state, value) {
    state.users = value;
  },
  SET_USERLISTS(state, value) {
    state.userlists = value;
  },
};

export const actions = {
  // eslint-disable-next-line no-empty-pattern
  async addUser({}, data) {
    let resp = await axios.post("/api/user/add-user", data);
    return resp;
  },
  async fetchUsers({ commit }) {
    let resp = await axios.get("/api/user/get-users");
    if (resp.data.status == true) {
      commit("SET_USERDATA", resp.data.data.users);
    }
    return resp;
  },
  // eslint-disable-next-line no-empty-pattern
  async getUserById({},id) {
    let resp = await axios.get("/api/user/get-user-by-id/"+id);
    return resp;
  },
  // eslint-disable-next-line no-empty-pattern
  async updateUser({},data) {
    let resp = await axios.post("/api/user/update-user", data);
    return resp;
  },
  // eslint-disable-next-line no-empty-pattern
  async deleteUser({state,commit},data) {
    let resp = await axios.post("/api/user/delete-user", data);
    if (resp.data.status == true) {
      const newState = state.users.filter(function(ser) {
        return ser.id !== data.id;
      });
      commit("SET_USERDATA", newState);
      return resp;
    }
  },
  async fetchUserLists({ commit }) {
  let resp = await axios.get("/api/user/get-user-names-list");
    if (resp.data.status == true) {
      commit("SET_USERLISTS", resp.data.data.users);
    }
    return resp;
  },
};