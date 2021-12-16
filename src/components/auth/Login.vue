<template>
  <div>
      <div class="login-wrapper">
          <div class="login__container">
            <div class="login__title">Авторизация</div>
            <input type="text" v-model="username" placeholder="login">
            <input type="password" v-model="password" placeholder="password">
            <button type="button" @click="login">Войти</button>
            <div class="login__back"><router-link to="/registration">Перейти к регистрации</router-link></div>
          </div>
      </div>
  </div>
</template>

<script>
import { send } from '@/tools';
export default {
    name: 'Login',
    data() {
        return {
            username: '',
            password: '',
        };
    },
    methods: {
        async login() {
            const { username, password } = this;

            const params = {
                username,
                password
            };

            const res = await send('/auth/login', params);

            if (res.status === 200) {
                document.cookie = `token=${res.token}`;
                location.reload()
            } else {
                alert('Неверный логин/пароль');
            }
        },
    }
}
</script>

<style lang="scss">
    .login-wrapper {
        text-align: center;
        max-width: 300px;
        width: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 100vh;
        justify-content: center;

        .login {
            &__title {
                margin-bottom: 10px;
                font-size: 24px;
            }
            &__container {
                display: flex;
                flex-direction: column;

                button {
                    max-width: 200px;
                    width: 100%;
                    margin: 0 auto;
                }
            }
            &__back {
                margin-top: 10px;
                font-size: 14px;
            }
        }
        
        
        input {
            margin-bottom: 10px;
        }
    }
</style>