import { createPinia } from 'pinia'
import type { App } from 'vue'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' //引入持久化插件
const load = (app: App) => {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate) //使用持久化插件
  app.use(pinia)
}

export default load
