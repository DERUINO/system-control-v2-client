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
            <div class="chat-messages-container" ref="messages">
                <div class="chat-messages" id="messages">
                    <div v-for="(message, messageIndex) in messages" :key="messageIndex" class="chat-message">
                        <div class="message-name">{{ message.authorId.username }}</div>
                        <div class="message-text">{{ message.text }}</div>
                    </div>
                </div>
                <div class="chat-messages-bottom"></div>
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

        preparedMessages() {
            return this.messages.reduce((prevent, current, index, array) => {
                return prevent.authorId?._id === this.userInfo._id
                    ? prevent + 1
                    : 0;
            }, 0)
        },

        isNewMessagesButtonVisible() {
            return !this.allMessagesReaded && !this.isScrollEnded;
        },
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
                    text: this.message.current
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

    .chat-messages {
        margin-top: 60px;
    }

    .chat-messages-profile {
        position: absolute;
        top: 0;
        left: 0;
        background: white;
        width: 100%;
        padding: 15px;
        border-bottom: 1px solid gray;
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

    .chat-messages-wrapper {
        position: relative;
        width: 100%;
        height: 500px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }

    .chat-messages-container {
        padding: 0 30px;
        max-height: 100%;
        overflow: auto;
    }

    .chat-message {
        width: 100%;
        padding-bottom: 10px;

        .message-name {
            font-weight: bolder;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 150px;
        }

        .message-text {
            font-size: 14px;
        }
    }
}
</style>