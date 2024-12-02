export type CustomDialogType = 'success' | 'error'

export interface ICustomDialogOption {
  width?: number
  type?: CustomDialogType
  title?: string
  message?: string
  html?: string
  cancelLabel?: string
  confirmLabel?: string
  showCancelButton?: boolean
  showConfirmButton?: boolean
}
