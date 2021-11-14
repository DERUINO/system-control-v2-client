<template>
    <transition name="fade">
        <div class="modal-wrapper" v-show="show">
            <div class="content">
                <div class="content-header">
                    <div class="title">Подтвердить действие?</div>
                    <div class="close-modal">
                        <button type="button" class="btn-close" aria-label="Close"></button>
                    </div>
                </div>
                <div class="content-body">
                    <div class="text">Удаление сущности</div>
                </div>
                <div class="content-footer">
                    <div class="buttons">
                        <div class="button apply">
                            <button type="button" class="btn btn-primary" @click="modalTrigger(true)">Подтвердить</button>
                        </div>
                        <div class="button deny">
                            <button type="button" class="btn btn-secondary" @click="modalTrigger(false)">Отмена</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import {modalStatus} from '../tools.js';

export default {
    name: 'Modal',
    props: ['trigger'],
    data() {
        return {
            show: false,
        }
    },
    watch: {
    },
    methods: {
    }
}
</script>

<style lang="scss">
    .modal-wrapper {
        position: fixed;
        z-index: 1000;
        top: 0;
        left: 0;
        width: 100%;
        min-height: 100vh;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        padding: 15px;

        .content {
            margin: auto;
            background: white;
            max-width: 400px;
            width: 100%;
            min-width: 200px;
            border: 1px solid gray;
            border-radius: 5px;

            .content-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 15px;
                border-bottom: 1px solid rgba(0,0,0,0.15);

                .title {
                    font-weight: bolder;
                    font-size: 18px;
                }
            }

            .content-body {
                padding: 15px;
                padding-bottom: 30px;
                border-bottom: 1px solid rgba(0,0,0,0.15);

                .text {
                    font-size: 15px;
                }
            }

            .content-footer {
                padding: 15px;
                .buttons {
                    display: flex;
                    justify-content: flex-end;

                    .button {
                        margin-left: 10px;
                    }
                }
            }
        }
    }
</style>