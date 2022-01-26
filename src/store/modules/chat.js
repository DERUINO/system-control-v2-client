import { send } from "../../tools";

const state = {
    messages: [],
}

const getters = {
    messages: state => state.messages
}

const mutations = {
    SET_MESSAGES_LIST(state, res) {
        state.messages = res;
    }
}

const actions = {
    async getMessages({commit}, req) {
        const res = await send('/chat/get_messages', {
            authorId: req.authorId,
            recieveId: req.recieveId
        })

        console.log(res);

        commit('SET_MESSAGES_LIST', res.data);
    },

    async addMessage({commit}, req) {
        const res = await send('/chat/add_message', {
            authorId: req.authorId,
            recieveId: req.recieveId,
            text: req.text
        })

        console.log(res);
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}