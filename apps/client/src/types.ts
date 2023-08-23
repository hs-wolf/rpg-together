export enum AppDirections {
  RTL = 'rtl',
  LTR = 'ltr',
}
export enum AppLang {
  EN = 'en',
  PT = 'pt',
}

export enum SnackType {
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}
export interface ISnack {
  type: SnackType
  message: string
}

export interface AdvancedSelectOption {
  id?: string
  name: string
  label: string
}
