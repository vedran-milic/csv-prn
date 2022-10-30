<script lang="ts" setup>
import { ref } from 'vue';
import type { Ref } from 'vue';
import TableView from '@/components/TableView.vue';
import useParser from '@/services/parser';
import * as diff from 'diff';

const csvFileInput: Ref<HTMLInputElement | null> = ref(null);
const prnFileInput: Ref<HTMLInputElement | null> = ref(null);
const csvContent: Ref<HTMLElement | null> = ref(null);
const prnContent: Ref<HTMLElement | null> = ref(null);
const diffContent: Ref<HTMLElement | null> = ref(null);
const csvJson = ref('');
const prnJson = ref('');
const diffDisplayed = ref(false);
const csvTableView = ref(false);
const prnTableView = ref(false);

const {
  parseText
} = useParser();

function previewFiles(evt: Event) {
  clearDiffConent();
  if (!evt.target) return;
  // @ts-ignore
  const [file] = (evt.target as HTMLInputElement).files;
  readFile(file, file.type)
}

function readFile(file: File, type: string) {
  const reader = new FileReader();

  reader.addEventListener("load", writeFile.bind(null, reader, type), false);

  if (file) {
    reader.readAsText(file, 'ISO-8859-3');
    reader.removeEventListener("load", writeFile.bind(null, reader, type));
  }
}

function writeFile(reader: FileReader, type: string) {
  const content = type === 'text/csv' ? csvContent.value : prnContent.value;
  const text =  parseText(reader.result, type);
  if (content) {
    content.innerText = text;
  }

  type === 'text/csv' ? csvJson.value = text : prnJson.value = text;
}

function toggleView(type: string) {
  if (type === 'csv') {
    csvTableView.value = !csvTableView.value;
  } else {
    prnTableView.value = !prnTableView.value;
  }
}

function clearDiffConent() {
  if (diffContent.value) diffContent.value.innerText = '';
  diffDisplayed.value = false;
}

function clearJson(type: string) {
  clearDiffConent();
  if (type === 'csv') {
    if (csvContent.value) csvContent.value.innerText = '';
    csvJson.value = '';
    if (csvFileInput.value) csvFileInput.value.value = '';
  } else {
    if(prnContent.value) prnContent.value.innerText = '';
    prnJson.value = '';
    if (prnFileInput.value) prnFileInput.value.value = '';
  }
}

function compareJson() {
  if (!csvJson.value || !prnJson.value) {
    return;
  }
  clearDiffConent();
  if (csvJson.value === prnJson.value) {
    alert('The files are identical')
  }
  const difference = diff.diffJson(csvJson.value, prnJson.value);
  diffDisplayed.value = true;
  difference.forEach(el => {
    if (el.added) {
      const codeEL = document.createElement('code');
      codeEL.classList.add('green');
      codeEL.innerText = el.value;
      if (diffContent.value) diffContent.value.appendChild(codeEL);
    } else if (el.removed) {
      const codeEL = document.createElement('code');
      codeEL.classList.add('red');
      codeEL.innerText = el.value;
      if (diffContent.value) diffContent.value.appendChild(codeEL);
    } else {
      const codeEL = document.createElement('code');
      codeEL.innerText = el.value;
      if (diffContent.value) diffContent.value.appendChild(codeEL);
    }
  })
}
</script>

<template>
  <section class="file-compare">
    <header class="file-compare-header">
      <h1>Compare CSV to PRN</h1>
    </header>
    <section class="file-compare-body">
      <section
        class="file-compare-block select-csv-file"
        :class="{ 'table-view': csvTableView}">
        <header v-if="csvJson" class="file-compare-block-header">
          <h3 class="file-compare-block-title">Json file</h3>
          <button @click="clearJson('csv')">Clear</button>
          <button @click="toggleView('csv')">
            Toggle {{ csvTableView ? 'JSON' : 'table' }}
          </button>
        </header>
        <table-view v-if="csvTableView" :json="csvJson" />
        <div class="file-compare-block-body">
          <pre :class="{ hidden: csvTableView }"><code ref="csvContent" class="csv-file-content" /></pre></div>
        <div class="file-input-container">
          <input
            id="csvFile"
            ref="csvFileInput"
            type="file"
            accept=".csv"
            @change="previewFiles">
            <label v-if="!csvJson" for="csvFile">Click to select CSV file</label>
        </div>
      </section>
      <section
        class="file-compare-block select-prn-file"
        :class="{ 'table-view': prnTableView}">
        <header v-if="prnJson" class="file-compare-block-header">
          <h3 class="file-compare-block-title">Prn file</h3>
            <button @click="clearJson('prn')">Clear</button>
            <button @click="toggleView('prn')">
              Toggle {{ prnTableView ? 'JSON' : 'table' }}
            </button>
        </header>
        <div class="file-compare-block-body">
          <table-view v-if="prnTableView" :json="prnJson" />
          <pre :class="{ hidden: prnTableView }"><code ref="prnContent" class="prn-file-content" /></pre>
        </div>
        <div class="file-input-container">
          <input
            id="prnFile"
            ref="prnFileInput"
            type="file"
            accept=".prn"
            @change="previewFiles">
            <label v-if="!prnJson" for="prnFile">Click to select PRN file</label>
        </div>
      </section>
      <section class="file-compare-block json-diff" :class="{ hidden: !diffDisplayed }">
        <header v-if="prnJson" class="file-compare-block-header">
          <h3 class="file-compare-block-title">Difference</h3>
            <button @click="clearDiffConent">Clear</button>
        </header>
        <div class="file-compare-block-body"><pre ref="diffContent"></pre></div>
      </section>
    </section>
    <footer class="file-compare-footer">
      <button class="compare-button" @click="compareJson">Compare</button>
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
  position: relative;
  width: 100%;

  + .file-compare-block {
    border-left: none;
  }
}
.file-compare-block-header {
  background: rgba(#fff, .9);
  border-bottom: 1px solid #000;
  display: flex;
  padding: 5px 10px;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
}
.file-compare-block-body {
  padding: 0 20px;
  text-align: left;
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
.file-input-container {
  [type=file] {
    appearance: none;
    z-index: -1;
    position: absolute;
    visibility: hidden;
  }
  label {
    align-items: center;
    bottom: 0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%
  }
}
.file-compare-block-title {
  margin: 0 auto 0 0;
  font-size: 16px;
}
button {
  & + button {
    margin-left: 5px;
  }

  &.compare-button {
    font-size: 16p;
    padding: 10px 5px;
    margin: 20px 0;
    width: 300px;
  }
}
pre {
  max-width: 100%;
  overflow: hidden;
}
</style>