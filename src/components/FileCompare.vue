<script lang="ts" setup>
import { ref } from 'vue';
const csvContent = ref('');
const prnContent = ref('');
function previewFiles(evt: Event) {
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
  // @ts-ignore
  content.innerText = parseText(reader.result, type);
}
// @ts-ignore
function parseText(text, type) {
  const newLines = text.split(/\r?\n|\r|\n/g);
  const obj = {};
  const csvRegex = /,(?!\s)/g;
  const prnRegex = /(?<!,)\s{2,}|(?<=Postcode|Limit)\s|\s(?=\d{8})/g;
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
        obj[keys[i]].push(val);
      });
    }
  })

  console.log(JSON.stringify(obj, null, 2));

  return JSON.stringify(obj, null, 2);
}
</script>

<template>
  <section class="file-compare">
    <header class="file-compare-header">
      <h1>Select files to comapre</h1>
    </header>
    <section class="file-compare-body">
      <section class="file-compare-file-block select-csv-file">
        <input
          id="csvFile"
          type="file"
          accept=".csv"
          @change="previewFiles">
        <pre><code ref="csvContent" class="csv-file-content" /></pre>
      </section>
      <section class="file-compare-file-block select-prn-file">
        <input
          id="csvFile"
          type="file"
          accept=".prn"
          @change="previewFiles">
          <pre><code ref="prnContent" class="prn-file-content" /></pre>
      </section>
    </section>
    <footer class="file-compare-footer">
      <button>Compare</button>
    </footer>
  </section>
</template>