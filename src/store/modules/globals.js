import { getCookie, send } from '@/tools';

const state = {
    token: getCookie('token') ?? '',
    user: {},
    accounts: [],
}

const getters = {
    accessToken: state => state.token,
    userInfo: state => state.user,
    accounts: state => state.accounts,
}

const mutations = {
    SET_USER_INFO(state, res) {
        state.user = res;
    },
    SET_ACCOUNTS(state, res) {
        state.accounts = res;
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
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}