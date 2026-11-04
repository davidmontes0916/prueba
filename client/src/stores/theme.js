import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(localStorage.getItem('theme') === 'dark')

  function toggleTheme() {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark-mode', isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  function initTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark-mode')
    }
  }

  return { isDark, toggleTheme, initTheme }
})
