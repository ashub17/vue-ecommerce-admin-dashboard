import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';
import './style.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');

// Re-verify the cached session against the API without blocking first paint,
// so a revoked role is picked up on the next navigation.
useAuthStore().fetchMe();
