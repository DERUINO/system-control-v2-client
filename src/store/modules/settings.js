import Vue from 'vue';
import { send } from '../../tools.js';

const state = {
    users: {
        array: [],
        name: '',
        spec: null,
        genre: 'teacher',
        input: null,
    },
    rooms: {
        array: [],
        name: '',
        input: null,
    },
    specs: {
        array: [],
        name: '',
        genre: '',
        description: '',
        input: null,
    }
}

const mutations = {
    updateRooms(state, rooms) {
        state.rooms.array = rooms;
    },

    updateUsers(state, users) {
        state.users.array = users;
    },

    updateSpecs(state, specs) {
        state.specs.array = specs;
    },

    changeUserGenre(state, users) {
        state.users.genre = users.target.value;
    },

    updateAddUser(state, users) {
        state.users.array.unshift(users);
        state.users.name = '';
        state.users.spec = null;
        state.users.genre = 'teacher';
        console.log('add User', users);
    },

    updateDeleteUser(state, users) {
        Vue.delete(state.users.array, users.index);
        console.log('delete Table', users);
    },

    updateAddRoom(state, rooms) {
        state.rooms.array.unshift(rooms);
        state.rooms.name = '';
        console.log('add Room', rooms);
    },

    updateDeleteRoom(state, rooms) {
        Vue.delete(state.rooms.array, rooms.index);
        console.log('delete Room', rooms);
    },

    updateAddSpec(state, specs) {
        state.specs.array.unshift(specs);
        state.specs.name = '';
        state.specs.genre = '';
        state.specs.description = '';
        console.log('add Spec', specs);
    },

    updateDeleteSpec(state, specs) {
        Vue.delete(state.specs.array, specs.index);
        console.log('delete Spec', specs);
    },
}

const getters = {
    settings: state => state,
}

const actions = {
    async getRooms(ctx) {
        const res = await send('/settings/getrooms');

        if (res.status === 200)
            ctx.commit('updateRooms', res.data);
    },

    async getUsers(ctx) {
        const res = await send('/settings/getusers');

        if (res.status === 200)
            ctx.commit('updateUsers', res.data);
    },

    async getSpecs(ctx) {
        const res = await send('/settings/getspecs');

        if (res.status === 200)
            ctx.commit('updateSpecs', res.data);
    },

    async addUser({ commit }, data) {
        const res = await send('/settings/adduser', {
            username: data.name,
            spec: data.spec,
            genre: data.genre,
        });
        
        if (res.status === 200) {
            commit('alerts/showAlert', {
                text: res.message,
                status: 'success'
            }, {root: true});
            commit('updateAddUser', res.data);
        }
    },

    async deleteUser({ commit }, data) {
        const res = await send('/settings/deleteuser', {
            userId: data.id,
        })
        
        if (res.status == 200) {
            commit('alerts/showAlert', {
                text: res.message,
                status: 'success'
            }, {root: true});
            commit('updateDeleteUser', {data: res.data, index: data.index});
        }
    },

    async addRoom({ commit }, data) {
        const res = await send('/settings/addroom', {
            name: data.name,
        })
        
        if (res.status == 200) {
            commit('alerts/showAlert', {
                text: res.message,
                status: 'success'
            }, {root: true});
            commit('updateAddRoom', res.data);
        }
    },

    async deleteRoom({ commit }, data) {
        const res = await send('/settings/deleteroom', {
                roomId: data.id,
            }) 
        
        if (res.status == 200) {
            commit('alerts/showAlert', {
                text: res.message,
                status: 'success'
            }, {root: true});
            commit('updateDeleteRoom', {data: res.data, index: data.index});
        }
    },

    async addSpec({ commit }, data) {
        const res = await send('/settings/addspec', {
            name: data.name,
            genre: data.genre,
            description: data.description,
        })
        
        if (res.status == 200) {
            commit('alerts/showAlert', {
                text: res.message,
                status: 'success'
            }, {root: true});
            commit('updateAddSpec', res.data);
        }
    },

    async deleteSpec({ commit }, data) {
        const res = await send('/settings/deletespec', {
                specId: data.id,
            }) 
        
        if (res.status == 200) {
            commit('alerts/showAlert', {
                text: res.message,
                status: 'success'
            }, {root: true});
            commit('updateDeleteSpec', {data: res.data, index: data.index});
        }
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}