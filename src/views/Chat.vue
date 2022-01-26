<template>
  <div class="chat">
    <div class="chat-container">
        <div class="chat-dialogs">
            <div class="chat-dialog" v-for="(user, userIndex) in preparedUsers" :key="userIndex">
                {{ user.username }}
            </div>
        </div>
        <div class="chat-messages">
            <div v-for="(message, messageIndex) in message.list" :key="messageIndex" class="chat-message">
                <div class="message-name">{{ message.name }}:</div>
                <div class="message-text">{{ message.text }}</div>
            </div>
        </div>
    </div>
    <div class="chat-send">
        <input type="text" v-model="message.current">
        <button type="button" @click="sendMessage">send</button>
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
            io: null,
        }
    },
    computed: {
        ...mapGetters({
            userInfo: 'globals/userInfo',
            accounts: 'globals/accounts',
        }),

        preparedUsers() {
            return this.accounts.filter(user => user._id !== this.userInfo._id);
        }
    },
    async created() {
        this.io = io('http://localhost:5000');

        this.io.on('message:recieved', data => {
                console.log(data);
                this.message.list.push(data);
            }
        )

        await this.getAccounts();
    },
    methods: {
        ...mapActions('globals', [
            'getAccounts',
        ]),

        sendMessage() {
            if (this.message.current) {
                const data = {
                    id: this.userInfo._id,
                    recieveId: '61f04446952d20d074c8a90d',
                    text: this.message.current,
                    name: this.userInfo.username
                }

                this.message.list.push(data);

                this.io.emit('message', data);
            }
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

        .chat-dialogs {
            width: 300px;
            border-right: 1px solid gray;
            background: rgba(0,0,0, 0.1);

            .chat-dialog {
                padding: 10px;
                border-bottom: 1px solid rgba(0,0,0,0.2);
            }
        }
    }

    .chat-messages {
        width: 100%;
        height: 500px;
        overflow: auto;
        padding: 10px;
    }

    .chat-message {
        width: 100%;
        display: flex;
        justify-content: flex-start;

        .message-name {
            font-weight: bolder;
        }

        .message-text {
            margin-left: 20px;
        }
    }
}
</style>