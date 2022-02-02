<template>
    <div>
        <Alert :alert_data="alert" />
        <Modal :trigger="trigger" />
        <Header />
        <router-view @alert="showNotify" @modal="showModal" v-if="!isLoading"></router-view>
    </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import { mapGetters, mapActions } from 'vuex';

import Alert from '@/components/Alert'
import Modal from '@/components/Modal'
import Header from '@/components/Header'

export default {
    name: "defaultLayout",
    components: {
        Alert,
        Header,
        Modal,
    },
    data() {
        return {
            alert: {
                text: '',
                status: '',
            },
            trigger: false,
            isLoading: true,
        }
    },
    computed: {
        ...mapGetters({
            accessToken: 'globals/accessToken',
        }),
    },
    async created() {
        const decodedToken = jwt_decode(this.accessToken);

        await this.getUserInfo({ id: decodedToken.id });
        await this.connectToSocket();

        this.isLoading = false;
    },
    methods: {
        ...mapActions({
            getUserInfo: 'globals/getUserInfo',
            connectToSocket: 'globals/connectToSocket'
        }),

        showNotify(data) {
            this.alert.text = data.text;
            this.alert.status = data.status;

            setTimeout( ()=> {
                this.alert.text = null;
            }, 3200)
        },

        showModal() {
            this.trigger = true;
        },
    }
}
</script>

<style>

</style>