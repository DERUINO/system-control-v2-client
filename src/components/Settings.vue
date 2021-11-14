<template>
  <div class="settings-wrapper">
      <div class="container">
         <div class="title">Редактирование сущностей</div> 
         <div class="navigation">
             <a class="btn btn-secondary" href="#" role="button" @click="changePage('users')" :class="{ active: pages.type === 'users' }">Пользователи</a>
             <a class="btn btn-secondary" href="#" role="button" @click="changePage('rooms')" :class="{ active: pages.type === 'rooms' }">Классы</a>
             <a class="btn btn-secondary" href="#" role="button" @click="changePage('specs')" :class="{ active: pages.type === 'specs' }">Специальности</a>
         </div>
         <div class="users-container pages-container" v-show="pages.type === 'users'">
            <div class="pages-title">Добавить нового пользователя</div>
            <div class="pages-addblock users-addblock">
                <input class="form-control" type="text" placeholder="Имя пользователя" aria-label="default input example" v-model="settings.users.name">
                <multiselect :options="settings.specs.array" v-model="settings.users.spec" placeholder="Выберите специальность" label="name" select-label="" deselect-label=""></multiselect>
                <select class="form-select" v-model="settings.users.genre" @change="changeUserGenre">
                    <option selected value="teacher">Преподаватель</option>
                    <option value="student">Студент</option>
                </select>
                <button type="button" class="btn btn-warning" @click="localAddUser">Добавить</button>
            </div>
            <div class="pages-title current-users">Текущие пользователи</div>
            <div class="users-listblock">
                <div class="listblock" v-for="(user, userIndex) in settings.users.array" :key="user._id" :class="{ teacher: user.genre === 'teacher' }">
                    <div class="delete-listblock">
                        <button type="button" class="btn-close" aria-label="Close" @click="localDeleteUser(user._id, userIndex)"></button>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">{{ user.username }}</h5>
                            <p class="card-text">{{ user.spec.name }}</p>
                            <a href="#" class="btn btn-primary">{{ user.genre }}</a>
                        </div>
                    </div>
                </div>
            </div>
         </div>
         <div class="rooms-container pages-container" v-show="pages.type === 'rooms'">
            <div class="pages-title">Добавить новый класс</div>
            <div class="rooms-addblock pages-addblock">
                <input @keyup.enter="localAddRoom" class="form-control" type="text" placeholder="Название класса" aria-label="default input example" v-model="settings.rooms.name">
                <button type="button" class="btn btn-warning" @click="localAddRoom">Добавить</button>
            </div>
            <div class="pages-title current-rooms">Текущие классы</div>
            <div class="rooms-listblock">
                <div class="listblock" v-for="(room, roomIndex) in settings.rooms.array" :key="room._id">
                    <div class="delete-listblock">
                        <button type="button" class="btn-close btn-close-white" aria-label="Close" @click="localDeleteRoom(room._id, roomIndex)"></button>
                    </div>
                    <button type="button" class="btn btn-primary btn-lg">Класс: {{ room.name }}</button>
                </div>
            </div>
         </div>
         <div class="specs-container pages-container" v-show="pages.type === 'specs'">
            <div class="pages-title">Добавить новую специальность</div>
            <div class="specs-addblock pages-addblock">
                <input class="form-control box-1" type="text" placeholder="Название специальности" v-model="settings.specs.name">
                <input class="form-control box-2" type="text" placeholder="Жанр специальности" v-model="settings.specs.genre">
                <input @keyup.enter="localAddSpec" class="form-control box-3" type="text" placeholder="Описание специальности" v-model="settings.specs.description">
                <button type="button" class="btn btn-warning box-4" @click="localAddSpec">Добавить</button>
            </div>
            <div class="pages-title current-specs">Текущие специальности</div>
            <div class="specs-listblock">
                <div class="listblock" v-for="(spec, specIndex) in settings.specs.array" :key="spec._id">
                    <div class="delete-listblock">
                        <button type="button" class="btn-close" aria-label="Close" @click="localDeleteSpec(spec._id, specIndex)"></button>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">{{ spec.name }}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">{{ spec.genre }}</h6>
                            <p class="card-text">{{ spec.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';
import {send} from '../tools.js';

export default {
    name: 'Settings',
    components: {
        Multiselect
    },
    async mounted() {
        this.getSpecs();
        this.getUsers();
        this.getRooms();
    },
    data() {
        return {
            pages: {
                type: localStorage.getItem('settingsPage') || 'users',
            },
        }
    },
    computed: {
        ...mapState([
            'settings'
        ]),
    },
    methods: {
        ...mapActions([
            'getRooms',
            'getUsers',
            'getSpecs',
            'addUser',
            'deleteUser',
            'addRoom',
            'deleteRoom',
            'addSpec',
            'deleteSpec',
        ]),

        ...mapMutations([
            'showAlert',
            'changeUserGenre',
        ]),

        changePage(type) {
            this.pages.type = type;
            localStorage.setItem('settingsPage', type);
        },

        async localAddUser() {
            if (this.settings.users.name && this.settings.users.spec) {
                this.addUser({
                    name: this.settings.users.name,
                    spec: this.settings.users.spec._id,
                    genre: this.settings.users.genre,
                });
            } else
                this.showAlert({
                    text: 'Заполните все поля',
                    status: 'danger'
                });
        },

        async localAddRoom() {
            if (this.settings.rooms.name) {
                this.addRoom({
                    name: this.settings.rooms.name
                });
            } else
                this.showAlert({
                    text: 'Заполните все поля',
                    status: 'danger'
                });
        },
        
        async localAddSpec() {
            if (this.settings.specs.name && this.settings.specs.genre && this.settings.specs.description) {
                this.addSpec({
                    name: this.settings.specs.name,
                    genre: this.settings.specs.genre,
                    description: this.settings.specs.description,
                });
            } else
                this.showAlert({
                    text: 'Заполните все поля',
                    status: 'danger'
                });
        },

        async localDeleteUser(id, index) {
            const confirmAction = confirm('Подтвердить действие?');

            if (confirmAction) {
                this.deleteUser({
                    id: id,
                    index: index,
                });
            }     
        },

        async localDeleteRoom(id, index) {
            const confirmAction = confirm('Подтвердить действие?');

            if (confirmAction) {
                this.deleteRoom({
                    id: id,
                    index: index,
                });
            }     
        },

        async localDeleteSpec(id, index) {
            const confirmAction = confirm('Подтвердить действие?');

            if (confirmAction) {
                this.deleteSpec({
                    id: id,
                    index: index,
                });
            }     
        },
    }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped lang="scss">
    .settings-wrapper {

        .form-control, .form-select {
            border-color: #e8e8e8 !important;
            font-size: 14px;
        }

        .title {
            font-size: 24px;
            font-weight: bolder;
            margin-bottom: 30px;
        }

        .navigation {
            display: flex;
            align-items: center;
            justify-content: flex-start;

            a {
                margin-right: 5px;

                &.active {
                    background: #0d6efd;
                }
            }
        }

        .pages-container {
            margin-top: 30px;

            .pages-title {
                font-weight: bolder;
                font-size: 18px;
                margin-bottom: 15px;
                margin-left: 5px;

                &.current-users,
                &.current-rooms,
                &.current-specs {
                    margin-top: 30px;
                }
            }

            .pages-addblock {
                display: grid;
                grid-gap: 5px;

                &.users-addblock {
                    grid-template-columns: 1fr 1fr 1fr auto;
                }

                &.rooms-addblock {
                    grid-template-columns: 1fr auto;
                }

                &.specs-addblock {
                    grid-template-areas:
                        "a a b b"
                        "c c c d";

                    .box-1 {
                        grid-area: a;
                    }

                    .box-2 {
                        grid-area: b;
                    }

                    .box-3 {
                        grid-area: c;
                    }

                    .box-4 {
                        grid-area: d;
                    }
                }
            }

            .users-listblock {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                grid-gap: 5px;

                .listblock {
                    position: relative;

                    &.teacher {
                        .card {
                            background: rgba(0, 0, 255, 0.1);
                        }
                    }

                    .delete-listblock {
                        position: absolute;
                        top: 5px;
                        right: 5px;
                        z-index: 2;
                    }
                }
            }

            .rooms-listblock {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                grid-gap: 5px;

                .listblock {
                    position: relative;
                    .delete-listblock {
                        position: absolute;
                        top: -5px;
                        right: 7px;

                        .btn-close {
                            width: 3px;
                            height: 3px;
                        }
                    }
                }

                button {
                    width: 100%;
                }
            }

            .specs-listblock {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                grid-gap: 5px; 

                .listblock {
                    position: relative;
                    .delete-listblock {
                        position: absolute;
                        top: 5px;
                        right: 7px;
                        z-index: 2;
                    }

                    .card {
                        height: 100%;
                        .card-text {
                            display: -webkit-box;
                            -webkit-line-clamp: 4;
                            -webkit-box-orient: vertical;  
                            overflow: hidden;
                        }
                    }
                }
            }
        }
    }
</style>