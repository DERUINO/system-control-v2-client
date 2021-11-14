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
                <li class="nav-item">
                    <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Вход</a>
                </li>
            </ul>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Header',
}
</script>

<style scoped lang="scss">
    .header-wrapper {
        .navigation {
            margin-top: 15px;
            margin-bottom: 30px;
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