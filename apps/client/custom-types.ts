export enum SnackType {
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}
export interface ISnack {
  type: SnackType;
  message: string;
}

export type AdvancedSelectOption = {
  name: string;
  label: string;
};
