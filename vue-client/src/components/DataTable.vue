<template>
  <div>
    <div class="btn-wrapper">
      <small  @click="resetTableData" class="reset-btn">Перезагрузка</small>
    </div>

    <div class="filter-panel">
      <h4>Фильтрация данных</h4>
      <Dropdown
        :list="dropdowns.selectColumn.list"
        :value="dropdowns.selectColumn.value"
        @selected="(v) => setDropdownValue('column', v)"
      />
      <Dropdown
        :list="dropdowns.selectCondition.list"
        :value="dropdowns.selectCondition.value"
        @selected="(v) => setDropdownValue('condition', v)"
        :exlude="dropdowns.selectCondition.exlude"
      />
      <TextInput
        :value="filteringValue"
        @entered="(v) => setFilteringValue(v)"
      />
      <button @click="filterRecords">Применить</button>
    </div>

    <div v-if="data.records.length > 0">
      <table>
        <thead>
          <tr>
            <th>Дата</th>
            <th>Название
              <img
                class="sort sort-asc"
                src="@/assets/sort-az.png"
                @click="sort('name')"
              />
            </th>
            <th>Количество, шт
              <img
                class="sort sort-asc"
                src="@/assets/sort-asc-desc.png"
                @click="sort('amount')"
              />
            </th>
            <th>Расстояние, км
              <img
                class="sort sort-asc"
                src="@/assets/sort-asc-desc.png"
                @click="sort('distance')"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, key) in data.records" :key="key">
            <td>{{ item.the_date }}</td>
            <td class="item-name">{{ item.name }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item.distance }}</td>
          </tr>
        </tbody>
      </table>
      <Pagination
        :total="data.count"
        :perPage="perPage"
        :pageNum="pageNum"
        @next="nextPage"
        @prev="prevPage"
      />
    </div>
    <div v-else>
      <p class="not-found">Ничего не найдено</p>
    </div>
    <DataHint />
  </div>
</template>

<script>
import axios from "axios";
import Pagination from './Pagination';
import Dropdown from './Dropdown';
import TextInput from './TextInput';
import DataHint from './DataHint';

export default {
  name: "DataTable",
  components: {
    Pagination,
    Dropdown,
    TextInput,
    DataHint,
  },
  data() {
    return {
      params: {
        limit: 10,
        offset: 0,
        orderBy: "the_date",
        order: "asc",
        filter: {
          column: "",
          condition: "",
          value: "",
        }
      },
      data: {
        records: [],
        count: 0,
      },
      pageNum: 1,
      order: {
        name: { desc: true },
        amount: { desc: true },
        distance: { desc: true }
      },
      dropdowns: {
        selectColumn: {
          value: "Выберите столбец",
          key: "",
          list: [
            [ "the_date", "Дата" ],
            [ "name", "Название" ],
            [ "amount", "Количество" ],
            [ "distance", "Расстояние" ],
          ],
          exlude: [],
        },
        selectCondition: {
          value: "Выберите условие",
          key: "",
          list: [
            [ "contain", "содержит" ],
            [ "equal", "=" ],
            [ "isMore", ">" ],
            [ "isLess", "<", ],
          ],
          exlude: [],
        }
      },
      filteringValue: "",
    };
  },
  computed: {
    perPage() {
      return this.params.limit;
    },
    selectColumnKey() {
      return this.dropdowns.selectColumn.key;
    },
  },
  watch: {
    selectColumnKey(v) {
      if (v === "name") {
        this.dropdowns.selectCondition.exlude = [];
        this.dropdowns.selectCondition.exlude.push('equal', 'isMore', 'isLess');
      } else if (v == "amount" || v == "distance") {
        this.dropdowns.selectCondition.exlude = [];
        this.dropdowns.selectCondition.exlude.push('contain');
      } else {
        this.dropdowns.selectCondition.exlude = [];
      }
      this.dropdowns.selectCondition.value = "Выберите условие";
      this.dropdowns.selectCondition.key = "";
      this.filteringValue = "";
    }
  },
  created() {
    this.loadCount();
    this.loadData();
  },
  methods: {
    loadCount() {
      axios({
        method: "get",
        url: "http://localhost:8000/count",
        params: this.params,
      })
        .then((response) => {
          this.data.count = response.data.count;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    loadData() {
      axios({
        method: "get",
        url: "http://localhost:8000/data",
        params: this.params,
      })
        .then((response) => {
          this.data.records = response.data.records;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    nextPage() {
      this.params.offset += this.params.limit;
      this.pageNum += 1;
      this.loadData();
    },
    prevPage() {
      this.params.offset -= this.params.limit;
      this.pageNum -= 1;
      this.loadData();
    },
    sort(attr) {
      this.params.orderBy = attr;
      this.order[attr].desc = !this.order[attr].desc;
      this.params.order = this.order[attr].desc ? 'desc' : 'asc';
      this.loadData();
    },
    setDropdownValue(type, value) {
      if (type == "column") {
        this.dropdowns.selectColumn.value = value;
        this.dropdowns.selectColumn.key = this.dropdowns.selectColumn.list.find(item => {
          if (item[1] == value) {
            return item[0];
          }
        })[0];
      } else if (type == "condition") {
        this.dropdowns.selectCondition.value = value;
        this.dropdowns.selectCondition.key = this.dropdowns.selectCondition.list.find(item => {
          if (item[1] == value) {
            return item[0];
          }
        })[0];
      }
    },
    setFilteringValue(value) {
      if (this.dropdowns.selectColumn.key == 'the_date') {
        const parts = value.split('.');
        if (parts.length == 3) {
          this.filteringValue = `${parts[2]}-${parts[1]}-${parts[0]}`;
        } else if (parts.length == 2) {
          this.filteringValue = `${parts[1]}-${parts[0]}`;
        } else if (parts.length == 1) {
          this.filteringValue = `${parts[0]}`;
        }
      } else {
        this.filteringValue = value;
      }
    },
    filterRecords() {
      this.params.filter.column = this.dropdowns.selectColumn.key;
      this.params.filter.condition = this.dropdowns.selectCondition.key;
      this.params.filter.value = this.filteringValue;

      this.loadCount();
      this.loadData();
    },
    resetTableData() {
      this.params.filter.column = "";
      this.params.filter.condition = "";
      this.params.filter.value = "";
      this.params.offset = 0,
      this.params.orderBy = "the_date",
      this.params.order = "asc",
      this.data.count = 0;
      this.pageNum = 1;
      this.order.name.desc = true;
      this.order.amount.desc = true;
      this.order.distance.desc = true;
      this.loadData();
    }
  },
};
</script>

<style scoped lang="scss">
table {
  width: 100%;
  margin: 15px auto;
  border-collapse: collapse;
  border: 1px solid #ececec;

  th,
  td {
    margin: 0;
    text-align: left;
  }
  th {
    padding: 0.7em 1em;
    background-color: #ececec;
  }
  td {
    padding: 0.5em 1em;
  }
  tr:nth-child(2n + 2) {
    background-color: #f6f6f6;
  }
}

.not-found {
  display: block;
  width: 100%;
  padding: 1em;
  text-align: center;
}

.item-name {
  min-width: 280px;
}

.sort {
  margin: 0 .2em;
  cursor: pointer;
  vertical-align: middle;
}

.filter-panel {
  text-align: left;
  border: 1px solid #eee;
  padding: 15px;
  background-color: #f6f6f6;

  > * {
    margin-right: 10px;
  }
  h4 {
    margin: 10px 0;
    text-align: center;
  }
  button {
    font-size: 14px;
    padding: 0.75em 0.8em;
    background-color: rgb(65, 65, 67);
    border: none;
    color: #fff;
    letter-spacing: 0.04em;
    text-transform: lowercase;
    cursor: pointer;
  }
}

.btn-wrapper {
  text-align: right;
}

.reset-btn {
  display: inline-block;
  margin-bottom: 15px;
  font-weight: bold;
  margin-left: auto;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
