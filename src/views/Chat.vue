<template>
  <div class="chat">
    <div class="chat-container">
        <div class="chat-dialogs">
            <div class="chat-dialog" v-for="(user, userIndex) in preparedUsers" :key="userIndex" @click="selectUser(user)">
                {{ user.username }}
            </div>
        </div>
        <div v-show="!dialog.recieveId" class="chat-none-selected"><div>выберите диалог</div></div>
        <div v-show="dialog.recieveId" class="chat-messages-wrapper">
            <div class="chat-messages-profile">{{ dialog.name }}</div>
            <div class="flexbox">
                <div class="chat-messages-container">
                    <div class="chat-messages" ref="messages">
                        <div
                        v-for="(message, messageIndex) in preparedMessages"
                        :key="messageIndex"
                        class="chat-message"
                        :class="{ 'unreaded': message.unread, 'none-concated': !message.concated }">
                            <div class="message-header" v-if="!message.concated">
                                <div class="message-name">{{ message.authorId.username }}</div>
                                <div class="message-date">{{ convertDate(message.createdAt) }}</div>
                            </div>
                            <div class="message-text">{{ message.text }}</div>
                        </div>
                        <div class="chat-messages-bottom"></div>
                    </div>
                </div>
                <div
                    v-show="isNewMessagesButtonVisible"
                    class="chat-messages-unread"
                    @click="lastMessageScroll"
                >
                    <img src="@/assets/arrow-down.svg">
                    <span>{{ unreadMessagesCount }}</span>
                </div>
                <div class="chat-send">
                    <input type="text" v-model="message.current" @keyup.enter="sendMessage">
                    <button type="button" @click="sendMessage">отправить</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: "Chat",
    data() {
        return {
            message: {
                current: '',
                list: [],
            },
            dialog: {
                recieveId: null,
                name: '',
            },
            isScrollEnded: true,
            allMessagesReaded: true,
            unreadMessagesCount: 0,
        }
    },
    computed: {
        ...mapGetters({
            userInfo: 'globals/userInfo',
            messages: 'chat/messages',
            accounts: 'globals/accounts',
            io: 'globals/socket',
        }),

        preparedUsers() {
            return this.accounts.filter(user => user._id !== this.userInfo._id);
        },

        isNewMessagesButtonVisible() {
            return !this.allMessagesReaded && !this.isScrollEnded;
        },

        preparedDate() {
            return new Date(this.userInfo.createdAt) - 10000;
        },

        preparedMessages() {
            let obj = {};

            return this.messages.map(item => {
                if (item.authorId._id === obj.authorId?._id) {
                    return {
                        ...item,
                        concated: true,
                    }
                }

                obj = item;

                return item;
            })
        }
    },
    async created() {
        await this.getAccounts();
        this.watchNewMessage();
    },
    mounted() {
        this.scrollEvent();
    },
    methods: {
        ...mapActions({
            getAccounts: 'globals/getAccounts',
            addMessage: 'chat/addMessage',
            getMessages: 'chat/getMessages',
        }),

        async sendMessage() {
            if (this.message.current) {
                const data = {
                    authorId: {
                        id: this.userInfo._id,
                        username: this.userInfo.username
                    },
                    recieveId: this.dialog.recieveId,
                    text: this.message.current,
                    createdAt: Date.now(),
                }

                this.message.current = '';

                new Promise(resolve => {
                    resolve();
                }).then(() => {
                    this.messages.push(data);
                }).then(() => {
                    this.lastMessageScroll();
                })

                await this.addMessage(data);

                this.io.emit('message', data);
            }
        },

        async selectUser(user) {
            this.dialog = {
                recieveId: user._id,
                name: user.username,
            }

            await this.getMessages({ authorId: this.userInfo._id, recieveId: user._id });

            this.lastMessageScroll();
        },
        
        lastMessageScroll() {
            const e = document.querySelector('.chat-messages-bottom');
            if (!e) return; 
            
            e.scrollIntoView({
                behavior: 'auto',
                block: 'end',
            });

            if (this.unreadMessagesCount > 0) {
                setTimeout(() => {
                    this.messages[this.messages.length - 1].unread = false;
                }, 1000);
            }
        },

        isScrollBottom() {
            const block = this.$refs.messages;
            if (block.scrollTop === block.scrollHeight - block.clientHeight) {
                this.isScrollEnded = true;
                this.allMessagesReaded = true;
                this.unreadMessagesCount = 0;
            } else {
                this.isScrollEnded = false;
            }
        },

        scrollEvent() {
            const block = this.$refs.messages;
            block.addEventListener('scroll', this.isScrollBottom);
        },

        watchNewMessage() {
            this.io.on('message:recieved', async data => {
                new Promise(resolve => {
                    resolve();
                }).then(() => {
                    data.unread = true;
                    this.messages.push(data);
                }).then(() => {
                    this.unreadMessagesCount = this.unreadMessagesCount + 1;
                    this.allMessagesReaded = false;
                    
                    if (this.isScrollEnded) {
                        this.lastMessageScroll(); 
                    }
                    
                })
            });
        },

        convertDate(date) {
            return new Date(date).toLocaleString('ru', { day: 'numeric', month: 'numeric', year: '2-digit', hour: 'numeric', minute: 'numeric' });
        }
    }
}
</script>

<style lang="scss">
.chat {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    min-height: 80vh;
    padding: 0 10%;

    .chat-container {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        border: 1px solid gray;
        height: 500px;

        .chat-none-selected {
            display: flex;
            width: 100%;
            height: 100%;

            div {
                margin: auto;
            }
        }

        .chat-dialogs {
            width: 20%;
            min-width: 300px;
            border-right: 1px solid gray;
            background: rgba(0,0,0, 0.1);

            .chat-dialog {
                cursor: pointer;
                padding: 10px;
                border-bottom: 1px solid rgba(0,0,0,0.2);

                &:hover {
                    background: rgba(0,0,0,0.25);
                }
            }
        }

        .chat-send {
            display: flex;
            width: 100%;

            input {
                width: 100%;
            }
        }
    }

    .chat-messages-wrapper {
        position: relative;
        width: 100%;

        .chat-messages-profile {
            background: white;
            width: 100%;
            padding: 15px;
            border-bottom: 1px solid gray;
        }

        .flexbox {
            height: 100%;

            .chat-messages-container {
                position: relative;
                width: 100%;
                height: 414px;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;

                .chat-messages {
                    max-height: 100%;
                    overflow: auto;
                    display: flex;
                    flex-direction: column;

                    .chat-message {
                        width: 100%;
                        padding: 0 15px;

                        &.unreaded {
                            background: rgba(0,0,0,0.1);
                        }

                        &.none-concated {
                            margin-top: 15px;
                        }

                        .message-header {
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 5px;

                            .message-name {
                                font-weight: bolder;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                max-width: 150px;
                                margin-right: 10px;
                            }

                            .message-date {
                                margin-top: 2px;
                                font-size: 13px;
                                color: gray;
                            }
                        }

                        .message-text {
                            font-size: 14px;
                            margin-bottom: 8px;
                        }
                    }
                }
            }

            .chat-messages-unread {
                position: absolute;
                bottom: 60px;
                right: 50px;
                width: 42px;
                height: 42px;
                box-shadow: 0 0 3px rgba(0,0,0, 0.5);
                line-height: 1;
                padding-top: 10px;
                text-align: center;
                font-weight: bolder;
                border-radius: 50%;
                background: white;
                cursor: pointer;

                &:hover {
                    background: rgba(0,0,0,0.05);
                }

                img {
                    margin-top: 2px;
                    width: 18px;
                }

                span {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: gray;
                    padding: 5px;
                    font-size: 12px;
                    color: white;
                    line-height: 0.8;
                    margin-left: 1px;
                    font-weight: normal;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                }
            }
        }
    }
}
</style>