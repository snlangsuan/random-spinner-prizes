export type ValueOf<T> = T[keyof T]

export type ConfirmDialogType = 'success' | 'error'

export interface IConfirmDialogOption {
  width?: number
  type?: ConfirmDialogType
  title?: string
  message?: string
  html?: string
  cancelLabel?: string
  confirmLabel?: string
}
