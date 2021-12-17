<template>
  <div class="table-wrapper">
    <div class="container">
      <div class="title">Добавление записей</div>
      <div class="add-table">
        <div class="input">
          <multiselect
            :options="settings.rooms.array"
            v-model="settings.rooms.input"
            placeholder="Выберите класс"
            label="name"
            track-by="name"
            select-label=""
            deselect-label=""
          ></multiselect>
        </div>
        <div class="input">
          <multiselect
            :options="settings.users.array"
            v-model="settings.users.input"
            label="username"
            track-by="username"
            placeholder="Выберите имя"
            select-label=""
            deselect-label=""
          ></multiselect>
        </div>
        <div class="input submit">
          <button type="button" class="btn btn-warning" @click="localAddTable">
            Добавить
          </button>
        </div>
      </div>
      <div class="search-table">
        <input
          class="form-control"
          type="text"
          placeholder="Поиск по имени"
          aria-label=".form-control-lg example"
          v-model="search.value"
          @input="localSearchValues"
        />
      </div>
      <div class="pagination-wrapper" v-if="tables.count > 50">
        <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li
              class="page-item"
              @click="localGetPageContent(pages.current - 1)"
            >
              <a class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li
              v-for="(page, pageIndex) in pagesCount"
              :key="pageIndex"
              class="page-item"
              @click="localGetPageContent(pageIndex + 1)"
              :class="{ active: pages.current === pageIndex + 1 }"
            >
              <a class="page-link" href="#">{{ pageIndex + 1 }}</a>
            </li>
            <li
              class="page-item"
              @click="localGetPageContent(pages.current + 1)"
            >
              <a class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div class="table">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Имя</th>
              <th scope="col">Специальность</th>
              <th scope="col">Класс</th>
              <th scope="col">Дата взятия</th>
              <th scope="col">Дата сдачи</th>
              <th width="100px"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, rowIndex) in allTables"
              :key="row._id"
              :class="{ complete: row.getout }"
            >
              <th scope="row">
                {{
                  pages.current === 1
                    ? rowIndex + 1
                    : (pages.current - 1) * 50 + (rowIndex + 1)
                }}
              </th>
              <td>{{ row.username }}</td>
              <td>{{ row.spec.name }}</td>
              <td>{{ row.room.name }}</td>
              <td>{{ timestampToDate(row.createdAt) }}</td>
              <td v-if="row.getout">{{ timestampToDate(row.updatedAt) }}</td>
              <td v-else class="td_getout">
                <button
                  type="button"
                  class="btn btn-success"
                  @click="localGetOut(row._id, rowIndex)"
                >
                  Сдать
                </button>
              </td>
              <td class="td_delete">
                <button
                  type="button"
                  class="btn btn-danger"
                  @click="localDeleteTable(row._id, rowIndex)"
                >
                  Удалить
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="no-tables" v-show="allTables.length <= 0">
          Записей не найдено
        </div>
      </div>
      <div class="pagination-wrapper" v-if="tables.count > 50">
        <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li
              class="page-item"
              @click="localGetPageContent(pages.current - 1)"
            >
              <a class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li
              v-for="(page, pageIndex) in pagesCount"
              :key="pageIndex"
              class="page-item"
              @click="localGetPageContent(pageIndex + 1)"
              :class="{ active: currentPage === pageIndex + 1 }"
            >
              <a class="page-link" href="#">{{ pageIndex + 1 }}</a>
            </li>
            <li
              class="page-item"
              @click="localGetPageContent(pages.current + 1)"
            >
              <a class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "Table",
  components: { Multiselect },
  data() {
    return {
      request: false,
      searchTimeout: null,
    };
  },
  computed: {

    ...mapGetters("tables", [
      "pagesCount",
      "tables",
      "pages",
      "search",
      "allTables",
      'currentPage',
    ]),
    ...mapGetters("settings", [
      "settings",
    ]),
  },
  async mounted() {
    await this.getTables();
    await this.getUsers();
    await this.getRooms();
  },
  methods: {
    ...mapActions('tables', [
      "getTables",
      "addTable",
      "deleteTable",
      "getOut",
      "getPageContent",
      "getSearchedPageContent",
      "searchValues",
    ]),

    ...mapActions('settings', [
      "getUsers",
      "getRooms",
    ]),

    ...mapMutations("alerts", [
      "showAlert"
    ]),

    async localSearchValues() {
      if (this.searchTimeout) {
        this.searchTimeout = clearTimeout(this.searchTimeout);
      }

      this.searchTimeout = setTimeout(() => {
        this.searchTimeout = null;
        if (this.search.value.length > 0) {
          this.searchValues({
            value: this.search.value,
          });
        } else {
          this.getTables();
        }
      }, 800);
    },

    localGetPageContent(pageIndex) {
      if (
        pageIndex > 0 &&
        pageIndex !== this.pages.current &&
        pageIndex <= this.pagesCount &&
        !this.search.value
      ) {
        this.getPageContent({
          currentPage: pageIndex,
        });
      } else if (
        pageIndex > 0 &&
        pageIndex !== this.pages.current &&
        pageIndex <= this.pagesCount &&
        this.search.value
      ) {
        this.getSearchedPageContent({
          currentPage: pageIndex,
          name: this.search.value,
        });
      }
    },

    timestampToDate: (date, type = "full") => {
      const resDate = new Date(date).getTime();
      const d = new Date();
      d.setTime(resDate);
      switch (type) {
        case "full":
          return (
            ("0" + d.getDate()).slice(-2) +
            "." +
            ("0" + (d.getMonth() + 1)).slice(-2) +
            "." +
            d.getFullYear() +
            " " +
            ("0" + d.getHours()).slice(-2) +
            ":" +
            ("0" + d.getMinutes()).slice(-2)
          );
        case "justDate":
          return (
            ("0" + d.getDate()).slice(-2) +
            "." +
            ("0" + (d.getMonth() + 1)).slice(-2) +
            "." +
            d.getFullYear()
          );
        case "justTime":
          return (
            ("0" + d.getHours()).slice(-2) +
            ":" +
            ("0" + d.getMinutes()).slice(-2)
          );
      }
    },

    async localAddTable() {
      if (this.settings.users.input && this.settings.rooms.input) {
        this.addTable({
          users: this.settings.users,
          rooms: this.settings.rooms,
        });
      } else {
        this.showAlert({
          text: "Заполните все поля",
          status: "danger",
        });
      }
    },

    async localDeleteTable(id, index) {
      const confirmAction = confirm("Подтвердить действие?");

      if (confirmAction) {
        this.deleteTable({
          id: id,
          index: index,
        });
      }
    },

    async localGetOut(id, index) {
      const confirmAction = confirm("Подтвердить действие?");

      if (confirmAction) {
        this.getOut({
          id: id,
          index: index,
        });
      }
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped lang="scss">
.table-wrapper {
  .btn-success,
  .btn-danger {
    font-size: 12px;
  }

  .title {
    font-size: 24px;
    font-weight: bolder;
    margin-bottom: 30px;
  }

  .add-table {
    display: grid;
    align-items: center;
    width: 100%;
    grid-template-columns: 1fr 1fr auto;
    grid-gap: 5px;

    .input {
    }
  }

  .search-table {
    margin: 15px 0;

    input {
      text-align: center;
    }
  }

  .pagination-wrapper {
    margin-top: 30px;
  }

  .table {
    margin-bottom: 30px;
    .no-tables {
      text-align: center;
    }
  }

  table {
    font-size: 15px;
    tr {
      &.complete {
        background: #e3e3e3;
      }
    }

    th {
      text-align: center;
      vertical-align: middle;
    }

    .td_center {
      text-align: center;
    }

    td {
      text-align: center;
      vertical-align: middle;
    }

    .td_delete {
      width: auto;
    }

    .td_getout {
      text-align: center;
    }
  }
}
</style>
