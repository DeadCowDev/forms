import { ZodSchema } from 'zod';

export type FormError = string[] | undefined;

export type FormListenerFn = () => void;
export type FormErrorListenerFn = (errors: string[]) => void;
export interface FormValueOption<T, TForm> {
	value: T;
	validator?: ZodSchema<T> | ((currentForm: TForm) => ZodSchema<T>);
	id?: string;
}

export type FormEvent = {
	preventDefault: () => void;
	stopPropagation: () => void;
};

export type FormOptions<T extends Record<string, any>> = {
	[k in keyof T]: FormValueOption<T[k], T>;
};
export interface FormResult<T, TFormType extends FormEvent = FormEvent> {
	value: T;
	dirty: boolean;
	pristine: boolean;
	loading: boolean;
	errors: { [P in keyof T]?: FormError };
	currentErrors: { [P in keyof T]?: FormError };
	ids: { [P in keyof T]?: string };
	notify: () => void;
	markAsDirty: () => void;
	updateValidity: () => boolean;
	addError: (k: keyof T, error: string) => void;
	setValue: <K extends keyof T>(k: K, value: T[K]) => FormError;
	reset: (newValue?: T) => void;
	handleSubmit: (cb: (v: T) => void | Promise<void>) => (ev: TFormType) => void;
}

export type BaseFormType = Record<string, any>;

export type OnChangeFormState<T, TForm extends FormEvent = FormEvent> = (
	newFormValue: FormResult<T, TForm>,
) => void;

export interface FormConfig {
	focusOnError?: boolean;
	onError?: FormErrorListenerFn;
	onFormValid?: FormListenerFn;
}
