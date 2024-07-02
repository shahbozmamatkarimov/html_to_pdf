<template>
  <main class="mb-10">
    <div>
    <div>
      <label
        for="import_file"
        class="flex gap-2 bg-white p-1.5 rounded-md border_ced cursor-pointer"
      >
        <img class="h-7 w-7" src="@/assets/svg/word.png" alt="" />
        <p>WORD</p>
      </label>
    </div>
    <button @click="downloadPdf">Download word document</button>
    <!-- <div>
      <select @change="(e) => (store.variantGrid = e.target.value)">
        <option v-for="i in 10" :value="i">{{ i }}</option>
      </select>
    </div> -->
    <div ref="content" id="pdf-content">
      <div
        class="min-w-full md:px-0 px-4"
        v-for="(i, index) in store.wordToHtml"
      >
        <div class="pb-2">
          <h1 class="flex gap-1 grid-cols-2">
            <span class="font-medium">{{ index + 1 }}</span
            >. <span v-html="i[1]"></span>
          </h1>
        </div>
        <div>
          <div
            class="variant_cols grid grid-cols-[repeat(3, minmax(0, 1fr)] items-center mb-4 ml-4"
          >
            <button
              v-for="(variant, v_index) in i"
              v-show="v_index > 1"
              class="flex items-center !min-h-[40px] w-full px-3 rounded-[10px] gap-5"
            >
              {{ variants[v_index - 2] }}
              <p class="!text-start" v-html="variant"></p>
            </button>
          </div>
        </div>
        <p class="bg-[#CCCCCC] h-[1px] sm:mx-0 -mx-4"></p>
      </div>
    </div>
    <input
      @change="importFile"
      class="input_file"
      type="file"
      id="import_file"
    />
  </div>
  <div v-if="store.wordToHtml?.length">
    <p>Tog'ri javoblar:</p>
    <div
    @click="copyToClipboard"
     class="flex gap-3">
      <ul
        class="flex flex-wrap gap-1"
        id="true_answers"
      >
        <li v-for="i in store.newIndices">
          {{ variants[i.indexOf(2)] }}
        </li>
      </ul>
      <button class="bg-black px-5 py-1 text-white rounded-lg">Copy</button>
    </div>
  </div>
  </main>
</template>

<script setup>
import mammoth from "mammoth";
import { usePdf } from "@/composables/usePdf";
const { generatePdf } = usePdf();
const content = ref(null);

const store = reactive({
  variantGrid: 1,
  convertedContent: "",
  wordToHtml: "",
  newIndices: [],
});

const downloadPdf = () => {
  console.log(content.value);
  if (content.value) {
    generatePdf(content.value);
  }
};

function convertFileToHtml(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;
      console.log(arrayBuffer);
      const result = await mammoth.convertToHtml(
        { arrayBuffer },
        {
          styleMap: ["p[style-name='Equation'] => span.math-display:fresh"],
        }
      );
      console.log(result);
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function htmlTableToArray(htmlTable) {
  const rows = htmlTable.match(/<tr>.*?<\/tr>/gs); // Extract rows
  if (!rows) return [];

  let result = rows.map((row) => {
    const cells = row.match(/<td>(.*?)<\/td>/gs); // Extract cells
    if (!cells) return [];
    return cells.map((cell) => cell.replace(/<\/?td>/g, "")); // Remove <td> tags
  });

  result.shift();
  console.log(result);
  // for (let i = 0; i < result.length; i++) {
  // for (let k = result[i].length - 1; k > 2; k--) {
  //   const j = 2 + Math.floor(Math.random() * (k - 1)); // 2-indeksdan boshlab aralashtirish
  //   [result[i][k], result[i][j]] = [result[i][j], result[i][k]];
  // }

  store.newIndices = [];

  for (let i = 0; i < result.length; i++) {
    let currentIndices = [...Array(result[i].length - 2).keys()].map(
      (x) => x + 2
    ); // 2-indeksdan boshlab indekslar
    for (let k = result[i].length - 1; k > 2; k--) {
      const j = 2 + Math.floor(Math.random() * (k - 1)); // 2-indeksdan boshlab aralashtirish
      [result[i][k], result[i][j]] = [result[i][j], result[i][k]];
      [currentIndices[k - 2], currentIndices[j - 2]] = [
        currentIndices[j - 2],
        currentIndices[k - 2],
      ]; // Indekslarga ham swap
    }
    store.newIndices.push(currentIndices);
  }
  console.log(store.newIndices);
  store.wordToHtml = result;
}

async function importFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const result = await convertFileToHtml(file);
  console.log(result);
  store.convertedContent = result.value;
  htmlTableToArray(result.value);
}

function copyToClipboard() {
  let copyText = "";
  for (let i of store.newIndices) {
    copyText += variants[i.indexOf(2)];
  }
  // copyText = `<input type="text" value="${copyText}">`
  console.log(copyText);
  // copyText.select();
  // copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText);
  alert("Copied the text: " + copyText);
}

const variants = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

watch(
  () => store.variantGrid,
  () => {
    document.querySelector(
      ".variant_cols"
    ).className = `variant_cols grid grid-cols-[${store.variantGrid}] items-center mb-4 ml-4`;
  }
);
</script>

<style lang="scss" scoped>
#pdf-content {
  width: 100%;
  // max-width: 800px;
  // margin: auto;
  padding: 20px;
  // background-color: #000;
  // color: #fff;
}
</style>
