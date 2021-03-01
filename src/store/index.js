import Vue from 'vue'
import Vuex from 'vuex'
import authAxios from "../auth-axios";
import router from "../router/index.js";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    userId: null,
    registered: false,
  },
  mutations: {
    auth(state, payload) {
      state.token = payload.token;
      state.userId = payload.userId;
      state.registered = payload.registered;
    },
    clearAuth(state) {
      state.token = null;
      state.userId = null;
      state.registered = false;
    }
  },
  actions: {
    async login({commit}, payload) {
      try {
        let response = await authAxios.post('accounts:signInWithPassword?key=AIzaSyDwCwqeShHe4OSqLC17vkF1haz3Up3O2k4', payload );
        commit('auth', {
          token: response.data.idToken,
          userId: response.data.localId,
          registered: response.data.registered
        })
        // console.log(response);
      } catch (e) {
        console.log(e);
      }
    },    
    logout({commit}) {
      commit('clearAuth');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('registered');
        router.push('/');
    },
  },
  modules: {
  }
})
