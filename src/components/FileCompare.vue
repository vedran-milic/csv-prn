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
  console.log(reader.result);
  // @ts-ignore
  content.innerText = parseText(reader.result, type);
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
  console.log(val, parsed);
  if (type !== 'text/csv') {
    // @ts-ignore
    parsed = parsed / 100;
  }
  return Number(parsed).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<template>
  <section class="file-compare">
    <header class="file-compare-header">
      <h1>Select files to compare</h1>
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