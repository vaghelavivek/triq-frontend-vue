import axios from "../../plugins/apiServices";

export const state = {
  profileAttachments: [],
};

export const getters = {
  getProfileAttachments(state) {
    return state.profileAttachments;
  },
};

export const mutations = {
  SET_PROFILE_Attachments(state, value) {
    state.profileAttachments = value;
  },
};

export const actions = {
  async setProfileAttachments({ commit }) {
    let resp = await axios.get("/api/order/get-profile-attachment");
    if (resp.data.status == true) {
      commit("SET_PROFILE_Attachments", resp.data.data.attachments);
    }
    return resp;
  },
};