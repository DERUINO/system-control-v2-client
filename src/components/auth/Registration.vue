<template>
  <div class="registration-wrapper">
    <div class="registration__container">
        <div class="registration__title">Регистрация</div>
        <input type="text" v-model="username" placeholder="login">
        <input type="email" v-model="email" placeholder="email">
        <input type="password" v-model="password" placeholder="password">
        <input type="password" v-model="confirmpass" placeholder="confirm password">
        <button type="button" @click="register">Зарегистрироваться</button>
        <div class="registration__back"><router-link to="/login">Перейти к авторизации</router-link></div>
    </div>
  </div>
</template>

<script>
import { send } from '@/tools';

export default {
    name: "Registration",
    data() {
        return {
            username: '',
            password: '',
            confirmpass: '',
            email: '',
        };
    },
    methods: {
        async register() {
            const { username, password, confirmpass, email } = this;

            const data = {
                username,
                password,
                confirmpass,
                email,
            };

            const res = await send('/auth/registration', data);

            if (res.status === 200) {
                this.$router.push('/login');
            } else {
                const { errors = [] } = res.errors;
                errors.forEach(error => {
                    alert(error.msg);
                });
            }
        }
    }
}
</script>

<style lang="scss">
    .registration-wrapper {
        text-align: center;
        max-width: 300px;
        width: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 100vh;
        justify-content: center;

        .registration {
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