import { createApp } from 'vue'
import '../src/scss/index.scss'
import App from './App.vue'
import Modable from "modable";

const app = createApp(App);
app.use(Modable);
app.mount('#app')
