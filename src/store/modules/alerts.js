export default {
    state: {
        text: '',
        status: '',
        visible: false,
    },
    mutations: {
        showAlert(state, data) {
            state.visible = true,
            state.text = data.text;
            state.status = data.status;
            console.log(data);

            setTimeout(() => {
                state.visible = false;
            }, 2000)
        }
    },
    getters: {
        toggleAlert(state) {
            return state;
        }
    },
    actions: {

    }
}