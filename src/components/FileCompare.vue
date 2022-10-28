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
  content.innerText = reader.result;
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
        <div ref="csvContent" class="csv-file-content"></div>
      </section>
      <section class="file-compare-file-block select-prn-file">
        <input
          id="csvFile"
          type="file"
          accept=".prn"
          @change="previewFiles">
          <div ref="prnContent" class="prn-file-content"></div>
      </section>
    </section>
    <footer class="file-compare-footer">
      <button>Compare</button>
    </footer>
  </section>
</template>