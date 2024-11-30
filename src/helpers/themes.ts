import type { ThemeDefinition } from 'vuetify'

export const MAIN_THEME = 'mainTheme'

export const mainTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#ffffff',
    surface: '#ffffff',
    primary: '#1867c0',
    secondary: '#48a9a6',
    error: '#d50000',
    info: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
  },
}

export const MAIN_DARK_THEME = 'mainDarkTheme'

export const mainDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#0C111B',
    surface: '#1f2937',
    primary: '#6366f1',
    secondary: '#9333ea',
    error: '#ef4444',
    info: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
  },
}
