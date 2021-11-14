import Vue from 'vue';
import { send } from '../../tools.js';

export default {
    state: {
        tables: {
            array: [],
            count: 0,
        },
        pages: {
            count: 0,
            current: 1,
        },
        search: {
            value: '',
        }
    },
    mutations: {
        updateTables(state, tables) {
            state.tables.array = tables.data;
            state.tables.count = tables.count;
            state.pages.count = tables.count;
            console.log('get Tables', tables);
        },

        updateAddTable(state, tables) {
            state.tables.array.unshift(tables);
            state.tables.count = state.tables.count + 1;
            console.log('add Table', tables);
        },

        updateDeleteTable(state, tables) {
            Vue.delete(state.tables.array, tables.index);
            console.log('delete Table', tables);
        },

        updateGetOut(state, tables) {
            Vue.set(state.tables.array[tables.index], 'getout', true);
            console.log('update getOut', tables);
        },

        updateGetPageContent(state, pages) {
            state.tables.array = pages.data;
            state.pages.current = pages.currentPage;
            console.log('new Page', pages);
        },

        updateGetSearchedPageContent(state, pages) {
            state.tables.array = pages.data;
            state.pages.current = pages.currentPage;
            console.log('new Searched Page', pages);
        },

        updateSearchValues(state, tables) {
            state.tables.array = tables.data;
            state.tables.count = tables.count;
            state.pages.current = 1;
            console.log('search value', tables);
        }
    },
    getters: {
        allTables(state) {
            return state.tables.array.slice(0, 50);
        },

        pagesCount(state) {
            const count = Math.floor(((state.tables.count - 1) / 50) + 1);
            return state.pages.count = count;
        },
    },
    actions: {
        async getTables(ctx) {
            const res = await send('/tables/gettables');

            ctx.commit('updateTables', res);
        },

        async addTable({commit}, data) {
            const res = await send('/tables/addtable', {
                username: data.users.input.username,
                spec: data.users.input.spec._id,
                room: data.rooms.input._id,
                genre: data.users.input.genre,
            })

            if (res.status === 200) {
                commit('showAlert', {
                    text: res.message,
                    status: 'success'
                });
                commit('updateAddTable', res.data);
            }
        },

        async deleteTable({commit}, data) {
            const res = await send('/tables/deletetable', {
                id: data.id,
            })

            if (res.status === 200) {
                commit('showAlert', {
                    text: res.message,
                    status: 'success'
                });
                commit('updateDeleteTable', data);
            }
        },

        async getOut({commit}, data) {
            const res = await send('/tables/getout', {
                id: data.id,
            })

            if (res.status === 200) {
                commit('showAlert', {
                    text: res.message,
                    status: 'success'
                });
                commit('updateGetOut', data);
            }
        },

        async getPageContent({ commit }, data) {
            const res = await send('/tables/getpaginatedtables', {
                page: data.currentPage - 1,
            })

            if (res.status === 200) {
                commit('updateGetPageContent', { data: res.data, currentPage: data.currentPage });
            }
        },

        async getSearchedPageContent({ commit }, data) {
            const res = await send('/tables/getsearchedpaginatedtables', {
                page: data.currentPage - 1,
                name: data.name,
            })

            if (res.status === 200) {
                commit('updateGetSearchedPageContent', { data: res.data, currentPage: data.currentPage });
            }
        },

        async searchValues({ commit }, data) {
            const res = await send('/tables/getfilteredtables', {
                name: data.value,
            })
            
            if (res.status === 200) {
                commit('updateSearchValues', { data: res.data, count: res.count });
            }
        }
    }
}