<template>
  <div id="app">
    <Alert :alert_data="alert" />
    <Modal :trigger="trigger" />
    <Header />
    <router-view @alert="showNotify" @modal="showModal"></router-view>
  </div>
</template>

<script>
import { send } from './tools.js'
import Table from '@/components/Table'
import Alert from '@/components/Alert'
import Modal from '@/components/Modal'
import Header from '@/components/Header'

export default {
  name: 'App',
  components: {
    Table,
    Alert,
    Header,
    Modal,
  },
  data() {
    return {
      array: [],
      username: '',
      password: '',
      confirmpass: '',
      email: '',
      authorisation: false,
      users: [],
      alert: {
        text: '',
        status: '',
      },
      trigger: false,
    }
  },
  mounted() {
  },
  methods: {
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

    async registration() {
      const res = await send('/auth/registration', {
        username: this.username,
        password: this.password,
        confirmpass: this.confirmpass,
        email: this.email,
      })

      console.log(res);
    },

    async login() {
      const res = await send('/auth/login', {
        username: this.username,
        password: this.password,
      })

      if (res.status === 200) {
        localStorage.setItem('token', res.token);
        location.reload();
      }

      console.log(res);
    },

    async getData() {
      const res = await fetch(`/auth/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      console.log(res)

    },

    async logout() {
      localStorage.removeItem('token');
      location.reload();
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0  uto;  
  thing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0 auto;
}
</style>
