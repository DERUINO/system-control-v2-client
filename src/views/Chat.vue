<template>
  <div class="chat">
    <div class="chat-container">
        <div class="chat-dialogs" @click="newMessageVoice">
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
                        <div class="message-name">{{ message.authorId.username }}:</div>
                        <div class="message-text">{{ message.text }}</div>
                    </div>
                </div>
                <div class="chat-messages-bottom"></div>
            </div>
            <div v-show="isNewMessagesButtonVisible" class="chat-messages-unread">new<br>↓</div>
            <div class="chat-send">
                <input type="text" v-model="message.current" @keyup.enter="sendMessage">
                <button type="button" @click="sendMessage">отправить</button>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client';
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
            io: null,
            isScrollEnded: false,
            allMessagesReaded: true,
        }
    },
    computed: {
        ...mapGetters({
            userInfo: 'globals/userInfo',
            messages: 'chat/messages',
            accounts: 'globals/accounts',
        }),

        preparedUsers() {
            return this.accounts.filter(user => user._id !== this.userInfo._id);
        },

        isNewMessagesButtonVisible() {
            return !this.allMessagesReaded && !this.isScrollEnded;
        }
    },
    async created() {
        this.io = io('http://localhost:5000');

        this.io.emit('userJoined', { userId: this.userInfo._id });

        this.io.on('message:recieved', async data => {
            console.log(data);

            new Promise(resolve => {
                resolve();
            }).then(() => {
                this.messages.push(data);
                this.allMessagesReaded = false;
            }).then(() => {
                if (this.isScrollEnded) {
                    this.lastMessageScroll(); 
                }
            })
        });

        await this.getAccounts();
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

                this.messages.push(data);
                this.message.current = '';

                await this.addMessage(data);

                this.io.emit('message', data);

                this.lastMessageScroll();
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
        },

        isScrollBottom() {
            const block = this.$refs.messages;
            if (block.scrollTop === block.scrollHeight - block.clientHeight) {
                this.isScrollEnded = true;
            } else {
                this.isScrollEnded = false;
            }
        },

        scrollEvent() {
            const block = this.$refs.messages;
            block.addEventListener('scroll', this.isScrollBottom);
        },

        // newMessageVoice() {
        //     const sound = new Audio();
        //     sound.src = 'assets/newMessage.ogg';
        //     sound.play();
        // }
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
        margin-top: 30px;
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
        width: 50px;
        height: 50px;
        box-shadow: 0 0 5px rgba(0,0,0,0.5);
        line-height: 1;
        padding-top: 10px;
        text-align: center;
        font-weight: bolder;
        border-radius: 50%;
        background: #e3e3e3;
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
        padding: 0 10px;
        max-height: 100%;
        overflow: auto;
    }

    .chat-message {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        padding-bottom: 10px;

        .message-name {
            font-weight: bolder;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 150px;
        }

        .message-text {
            margin-left: 20px;
        }
    }
}
</style>