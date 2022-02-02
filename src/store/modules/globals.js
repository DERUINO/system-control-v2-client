import { getCookie, send } from '@/tools';
import { io } from 'socket.io-client';

const state = {
    token: getCookie('token') ?? '',
    user: {},
    accounts: [],
    socket: null,
}

const getters = {
    accessToken: state => state.token,
    userInfo: state => state.user,
    accounts: state => state.accounts,
    socket: state => state.socket,
}

const mutations = {
    SET_USER_INFO(state, res) {
        state.user = res;
    },
    SET_ACCOUNTS(state, res) {
        state.accounts = res;
    },
    SET_SOCKET(state, res) {
        state.socket = res;
    }
}

const actions = {
    async getUserInfo({commit}, req) {
        const res = await send('/settings/userinfo', { id: req.id })
        if (res.status === 200) {
            commit('SET_USER_INFO', res.data);
        }
    },

    async getAccounts({commit}, req) {
        const res = await send('/auth/users')
        if (res.status === 200) {
            commit('SET_ACCOUNTS', res.data);
        }
    },

    connectToSocket({commit, getters}) {
        const socket = io('http://localhost:5000');
        
        socket.emit('userJoined', { userId: getters.userInfo._id });

        commit("SET_SOCKET", socket);
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}