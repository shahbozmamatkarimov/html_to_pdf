import { createI18n } from "vue-i18n";
import uz from "../locales/uz.json";
import ru from "../locales/ru.json";
import en from "../locales/en.json";

import { useLoadingStore } from "@/store";

export default defineNuxtPlugin(({ vueApp }) => {
  const isLoading = useLoadingStore();

  let locale =
    typeof localStorage !== "undefined" ? localStorage.getItem("lang") : "uz";
  isLoading.store.lang = locale ? locale : "uz";
  locale = locale ? locale : "uz";
  if (locale != 'uz' || locale != 'ru') {
    locale = "uz";
  }

  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: locale,
    messages: {
      uz,
      ru,
    },
  });

  vueApp.use(i18n);
});
