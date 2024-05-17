import { fileURLToPath, URL } from 'node:url'
import { exec } from 'child_process'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// Define a custom plugin to start the bot
function startBotPlugin() {
  return {
    name: 'start-bot-plugin',
    configResolved() {
      // Start the bot when the config is resolved
      exec('node src/tgbot.mjs', (err, stdout, stderr) => {
        if (err) {
          console.error(`Ошибка при запуске бота: ${err.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), startBotPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    open: true,
  }
})