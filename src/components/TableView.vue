<script lang="ts" setup>
import { computed } from 'vue';
const props = defineProps({
  json: {
    type: String,
    default: ''
  }
})

const objFromJSON = computed(() => {
  return props.json ? JSON.parse(props.json) : '';
})
</script>
<template>
  <ul v-if="objFromJSON" class="table">
    <li
      v-for="(column, key) in objFromJSON"
      :key="key"
      class="table-column"
    >
      <ul class="table-rows">
        <li class="table-row heading">{{ key }}</li>
        <template
          v-for="row in column"
          :key="row"
        >
          <li class="table-row">{{ row }}</li>
        </template>
      </ul>
    </li>
  </ul>
</template>

<style lang="scss">
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.table {
  display: flex;
}
.table-rows {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.table-column {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.table-row {
  flex: 1;
  justify-content: center;
  padding: 0 10px;
  white-space: nowrap;

  &.heading {
    font-weight: bold;
  }

  &:nth-child(odd) {
    background-color: #dfd9d9;
  }
}
</style>
