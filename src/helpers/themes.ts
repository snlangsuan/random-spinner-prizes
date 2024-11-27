import type { ThemeDefinition } from 'vuetify'

export const MAIN_THEME = 'mainTheme'

export const mainTheme: ThemeDefinition = {
dark: false,
colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#8c0c14',
    secondary: '#d8ae35',
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
