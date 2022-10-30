<script lang="ts" setup>
import { ref } from 'vue';
import TableView from '@/components/TableView.vue';
import * as diff from 'diff';
const csvFileInput = ref(null);
const prnFileInput = ref(null);
const csvContent = ref(null);
const prnContent = ref(null);
const diffContent = ref(null);
const csvJson = ref('');
const prnJson = ref('');
const csvTableView = ref(false);
const prnTableView = ref(false);
function previewFiles(evt: Event) {
  // @ts-ignore
  diffContent.value.innerText = '';
  if (!evt.target) return;
  // @ts-ignore
  const [file] = evt.target.files;
  readFile(file, file.type)
}

// @ts-ignore
function readFile(file, type) {
  const reader = new FileReader();

  reader.addEventListener("load", writeFile.bind(null, reader, type), false);

  if (file) {
    reader.readAsText(file, 'ISO-8859-3');
    reader.removeEventListener("load", writeFile.bind(null, reader, type));
  }
}

// @ts-ignore
function writeFile(reader, type) {
  const content = type === 'text/csv' ? csvContent.value : prnContent.value;
  // console.log(reader.result);
  const text =  parseText(reader.result, type);
  // @ts-ignore
  content.innerText = text;
  type === 'text/csv' ? csvJson.value = text : prnJson.value = text;

}
// @ts-ignore
function parseText(text, type) {
  // @ts-ignore
  const newLines = text.split(/\r?\n|\r|\n/g).filter(i => i);
  const obj = {};
  const csvRegex = /,(?!\s)/g;
  const prnRegex = /(?<!,)\s{2,}|(?<=Postcode|Limit)\s|\s(?=\d{8}|\d{4}\s)/g;
  const regexToUse = type === 'text/csv' ? csvRegex : prnRegex;

  // @ts-ignore
  newLines.forEach((line, idx) => {
    const values = line.split(regexToUse);

    if (idx === 0) {
      // @ts-ignore
      values.forEach(val => obj[val] = [])
    } else {
      const keys = Object.keys(obj);
      // @ts-ignore
      values.forEach((val, i) => {
        // @ts-ignore
        obj[keys[i]].push(parseValues(val, type, keys[i]));
      });
    }
  })

  return JSON.stringify(obj, null, 2);
}

// @ts-ignore
function parseValues(val, type, key) {
  const parsed = val.replace(/["\\]/g, '');

  if (key === 'Birthday') {
    return formatMonth(parsed, type)
  }

  if (key === 'Credit Limit') {
    return formatNumber(parsed, type);
  }
  return parsed;
}

// @ts-ignore
function formatMonth(val, type) {
  let day = '';
  let month = '';
  let year = '';
  if (type === 'text/csv') {
    const arr = val.split('/');
    day = arr[0];
    month = arr[1];
    year = arr[2];
  } else {
    year = val.substring(0, 4);
    month = val.substring(4, 6);
    day = val.substring(6, 8)
  }
  return new Date(`${year}, ${month}, ${day}`).toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
// @ts-ignore
function formatNumber(val, type) {
  let parsed = parseFloat(val).toFixed(2);
  if (type !== 'text/csv') {
    // @ts-ignore
    parsed = parsed / 100;
  }
  // return val; // uncomment to test diff
  return Number(parsed).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function toggleView(type: string) {
  if (type === 'csv') {
    csvTableView.value = !csvTableView.value;
  } else {
    prnTableView.value = !prnTableView.value;
  }
}

function clearJson(type: string) {
  // @ts-ignore
  diffContent.value.innerText = '';
  if (type === 'csv') {
    // @ts-ignore
    csvContent.value.innerText = '';
    csvJson.value = '';
    // @ts-ignore
    csvFileInput.value.value = null;
  } else {
    // @ts-ignore
    prnContent.value.innerText = '';
    prnJson.value = '';
    // @ts-ignore
    prnFileInput.value.value = null;
  }
}

function compareJson() {
  if (!csvJson.value || !prnJson.value) {
    return;
  }
  // @ts-ignore
  diffContent.value.innerText = '';
  if (csvJson.value === prnJson.value) {
    alert('The files are identical')
  }
  const difference = diff.diffJson(csvJson.value, prnJson.value);
  // @ts-ignore
  difference.forEach(el => {
    if (el.added) {
      const codeEL = document.createElement('code');
      codeEL.classList.add('green');
      codeEL.innerText = el.value;
      // @ts-ignore
      diffContent.value.appendChild(codeEL);
    } else if (el.removed) {
      const codeEL = document.createElement('code');
      codeEL.classList.add('red');
      codeEL.innerText = el.value;
      // @ts-ignore
      diffContent.value.appendChild(codeEL);
    } else {
      const codeEL = document.createElement('code');
      codeEL.innerText = el.value;
      // @ts-ignore
      diffContent.value.appendChild(codeEL);
    }
  })
}
</script>

<template>
  <section class="file-compare">
    <header class="file-compare-header">
      <h1>Select files to compare</h1>
    </header>
    <section class="file-compare-body">
      <section
        class="file-compare-block select-csv-file"
        :class="{ 'table-view': csvTableView}">
        <div class="file-compare-inputs">
          <input
            id="csvFile"
            ref="csvFileInput"
            type="file"
            accept=".csv"
            @change="previewFiles">
          <button v-if="csvJson" @click="clearJson('csv')">Clear</button>
          <button v-if="csvJson" @click="toggleView('csv')">Toggle view</button>
        </div>
        <table-view v-if="csvTableView" :json="csvJson" />
        <pre :class="{ hidden: csvTableView }"><code ref="csvContent" class="csv-file-content" /></pre>
      </section>
      <section
        class="file-compare-block select-prn-file"
        :class="{ 'table-view': prnTableView}">
        <div class="file-compare-inputs">
          <input
            id="prnFile"
            ref="prnFileInput"
            type="file"
            accept=".prn"
            @change="previewFiles">
            <button v-if="prnJson" @click="clearJson('prn')">Clear</button>
            <button v-if="prnJson" @click="toggleView('prn')">Toggle view</button>
        </div>
        <table-view v-if="prnTableView" :json="prnJson" />
        <pre :class="{ hidden: prnTableView }"><code ref="prnContent" class="prn-file-content" /></pre>
      </section>
      <section class="file-compare-block json-diff">
        <pre ref="diffContent"></pre>
      </section>
    </section>
    <footer class="file-compare-footer">
      <button @click="compareJson">Compare</button>
    </footer>
  </section>
</template>

<style lang="scss">
.file-compare-body {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(390px, 1fr));
}
.file-compare-block {
  border: 1px solid gray;
  height: 500px;
  overflow: auto;
  width: 100%
}
.file-compare-inputs {
  background: rgba(#fff, .9);
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
}
.json-diff {
  color: gray;
  .red {
    color: red;
  }

  .green {
    color: green;
  }
}
</style>