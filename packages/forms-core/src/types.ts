import { ZodSchema } from "zod";

export type FormError = string[] | undefined;

export interface FormValueOption<T, TForm> {
  value: T;
  validator?: ZodSchema<T> | ((currentForm: TForm) => ZodSchema<T>);
}

export type FormEvent = {
	preventDefault: () => void;
	stopPropagation: () => void;
}

export type FormOptions<T extends Record<string, any>> = {
  [k in keyof T]: FormValueOption<T[k], T>;
};
export interface FormResult<T, TFormType extends FormEvent = FormEvent> {
  value: T;
  dirty: boolean;
  pristine: boolean;
  loading: boolean;
  errors: { [P in keyof T]?: FormError };
  markAsDirty: () => void;
  updateValidity: () => boolean;
  addError: (k: keyof T, error: string) => void;
  setValue: <K extends keyof T>(k: K, value: T[K]) => FormError;
  reset: (newValue?: T) => void;
  handleSubmit: (cb: (v: T) => void | Promise<void>) => (ev: TFormType) => void;
}

export type BaseFormType = Record<string, any>;

export type OnChangeFormState<T, TForm extends FormEvent = FormEvent> = (newFormValue: FormResult<T, TForm>) => void;
