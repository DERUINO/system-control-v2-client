<template>
    <div>
        <Alert :alert_data="alert" />
        <Modal :trigger="trigger" />
        <Header />
        <router-view @alert="showNotify" @modal="showModal"></router-view>
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
        }
    },
    computed: {
        ...mapGetters({
            accessToken: 'globals/accessToken',
        }),
    },
    created() {
        const decodedToken = jwt_decode(this.accessToken);

        this.getUserInfo({ id: decodedToken.id });
    },
    methods: {
        ...mapActions({
            getUserInfo: 'globals/getUserInfo',
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