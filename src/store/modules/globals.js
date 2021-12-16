import { getCookie } from '@/tools';

const state = {
    token: getCookie('token') ?? '',
}

const getters = {
    accessToken: state => state.token,
}

const mutations = {

}

const actions = {

}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}