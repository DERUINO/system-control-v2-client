<template>
  <div class="chat">
    <div class="chat-messages">
        <div v-for="(message, messageIndex) in message.list" :key="messageIndex" class="chat-message">
            <div class="message-name">{{ message.name }}:</div>
            <div class="message-text">{{ message.text }}</div>
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
import { mapGetters } from 'vuex';

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
        }),
    },
    created() {
        this.io = io('http://localhost:5000');

        this.io.on('message:recieved', data => {
                console.log(data);
                this.message.list.push(data);
            }
        )
    },
    methods: {
        sendMessage() {
            if (this.message.current) {
                console.log(123);
                const data = {
                    id: Date.now(),
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

    .chat-messages {
        width: 100%;
        height: 500px;
        overflow: auto;
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