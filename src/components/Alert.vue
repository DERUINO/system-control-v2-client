<template>
    <transition name="fade">
        <div class="alert-wrapper" v-show="toggleAlert.visible">
            <div class="alert" role="alert" :class="{ 'alert-danger': toggleAlert.status === 'danger', 'alert-success': toggleAlert.status === 'success' }">
                {{ toggleAlert.text }}
            </div>
        </div>
    </transition>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';

export default {
    name: 'Alert',
    data() {
        return {
            text: '',
            status: '',
        }
    },
    computed: {
        ...mapGetters([
            'toggleAlert'
        ]),
    },
    methods: {
    }
}
</script>

<style scoped lang="scss">
    .fade-enter-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
        opacity: 0;
    }

    .alert-wrapper {
        position: fixed;
        bottom: 5%;
        left: 5%;
        z-index: 999;

        .title {
            font-weight: bolder;
        }

        .text {

        }
    }
</style>