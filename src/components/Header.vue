<template>
  <div class="header-wrapper">
      <div class="container">
        <div class="navigation">
            <ul class="nav nav-pills">
                <router-link to="/">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="#">Журнал</a>
                    </li>
                </router-link>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Инструменты</a>
                    <ul class="dropdown-menu">
                        <router-link to="/settings">
                            <li><a class="dropdown-item" href="#">Редактирование</a></li>
                        </router-link>
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Поиск</a>
                </li>
            </ul>
            <div class="navigation__logout">
                <div class="navigation__logout-name">{{ user.username }}</div>
                <div class="navigation__logout-button" @click="logout">выход</div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { deleteCookie } from '@/tools';
import { mapGetters } from 'vuex';

export default {
    name: 'Header',
    computed: {
        ...mapGetters({
            user: 'globals/userInfo',
        }),
    },
    methods: {
        logout() {
            deleteCookie('token');
            location.reload();
        }
    }
}
</script>

<style scoped lang="scss">
    .header-wrapper {
        .navigation {
            margin-top: 15px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;

            &__logout {
                margin-right: 10px;
                text-align: right;

                &-name {
                    font-weight: bolder;
                }

                &-button {
                    font-size: 12px;
                    margin-top: 5px;
                    margin-right: 1px;
                    cursor: pointer;

                    &:hover {
                        color: gray;
                    }
                }
            }
        }

        a {
            text-decoration: none;
            color: inherit;

            &.router-link-exact-active {
               background-color: #0d6efd;
               color: white;
               border-radius: .25rem;

               a {
                background-color: #0d6efd;
                color: white;
                border-radius: .25rem; 
               }
            }
        }
    }
</style>