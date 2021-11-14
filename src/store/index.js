import Vue from 'vue'
import Vuex from 'vuex'
import tables from './modules/tables'
import alerts from './modules/alerts'
import settings from './modules/settings'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        tables,
        alerts,
        settings
    }
})