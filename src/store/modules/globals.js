import { getCookie, send } from '@/tools';

const state = {
    token: getCookie('token') ?? '',
    user: {},
}

const getters = {
    accessToken: state => state.token,
    userInfo: state => state.user,
}

const mutations = {
    SET_USER_INFO(state, res) {
        state.user = res;
    },
}

const actions = {
    async getUserInfo({commit}, req) {
        const res = await send('/settings/userinfo', { id: req.id })
        if (res.status === 200) {
            commit('SET_USER_INFO', res.data);
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