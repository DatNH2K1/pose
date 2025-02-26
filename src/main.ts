import { createApp } from 'vue'
import '../src/scss/index.scss'
import App from './App.vue'
import Modable from "modable";
import VueI18n from "@/plugins/i18n.ts";

const app = createApp(App);
app.use(Modable);
app.use(VueI18n);
app.mount('#app')
