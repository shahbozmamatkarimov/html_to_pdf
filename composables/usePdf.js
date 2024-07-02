// composables/usePdf.js

// import { ref, onMounted } from 'vue';

export const usePdf = ()=> {
  const loading = ref(false);
  const error = ref(null);
  let html2pdf;

  onMounted(() => {
    import('html2pdf.js').then(module => {
      html2pdf = module.default;
    }).catch(err => {
      console.error('Failed to load html2pdf.js', err);
      error.value = err;
    });
  });

  const generatePdf = async (element) => {
    if (!html2pdf) {
      error.value = new Error('html2pdf.js is not loaded yet.');
      return;
    }
    try {
      loading.value = true;
      error.value = null;

      const options = {
        margin: 1,
        filename: 'document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };

      await html2pdf().set(options).from(element).save();
    } catch (err) {
        console.log(err);
      error.value = err;
    } finally {
        console.log("finished");
      loading.value = false;
    }
  };

  return { loading, error, generatePdf };
}
