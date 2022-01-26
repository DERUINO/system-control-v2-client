<template>
  <div class="chat">
    <div class="chat-container">
        <div class="chat-dialogs">
            <div class="chat-dialog" v-for="(user, userIndex) in preparedUsers" :key="userIndex" @click="selectUser(user._id)">
                {{ user.username }}
            </div>
        </div>
        <div v-if="!recieveId" class="chat-none-selected"><div>выберите диалог</div></div>
        <div class="chat-messages-wrapper" v-else>
            <div class="chat-messages-container" id="messages">
                <div class="chat-messages">
                    <div v-for="(message, messageIndex) in messages" :key="messageIndex" class="chat-message">
                        <div class="message-name">{{ message.authorId }}:</div>
                        <div class="message-text">{{ message.text }}</div>
                    </div>
                </div>
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
            recieveId: null,
            io: null,
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
        }
    },
    async created() {
        this.io = io('http://localhost:5000');

        this.io.emit('userJoined', { userId: this.userInfo._id });

        this.io.on('message:recieved', data => {
            console.log(data);
            this.messages.push(data);

            const scroll = document.getElementById('messages');
            console.log(scroll.scrollTop, scroll.scrollHeight);

            if (scroll.scrollTop !== scroll.scrollHeight) {
               scroll.scrollTop = scroll.scrollHeight + 10000; 
            }
        });

        await this.getAccounts();
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
                    authorId: this.userInfo._id,
                    recieveId: this.recieveId,
                    text: this.message.current
                }

                this.messages.push(data);
                this.message.current = '';

                await this.addMessage(data);

                this.io.emit('message', data);

                const scroll = document.getElementById('messages');
                scroll.scrollTop = scroll.scrollHeight;
            }
        },

        async selectUser(id) {
            this.recieveId = id;

            await this.getMessages({ authorId: this.userInfo._id, recieveId: id });

            const scroll = document.getElementById('messages');
            scroll.scrollTop = scroll.scrollHeight;
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
        min-height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }

    .chat-messages-wrapper {
        width: 80%;
    }

    .chat-messages-container {
        height: 468px;
        overflow: auto;
        padding: 10px;
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