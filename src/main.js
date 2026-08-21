import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.min.css'

import PrimeVue from 'primevue/config'

const app = createApp(App)

app.use(PrimeVue)

app.mount('#app')