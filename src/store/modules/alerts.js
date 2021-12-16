const state = {
    text: '',
    status: '',
    visible: false,
}

const mutations = {
    showAlert(state, data) {
        state.visible = true,
        state.text = data.text;
        state.status = data.status;
        console.log(data);

        setTimeout(() => {
            state.visible = false;
        }, 2000)
    }
}

const getters = {
    toggleAlert(state) {
        return state;
    }
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