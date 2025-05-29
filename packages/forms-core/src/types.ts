import { StandardSchemaV1 } from '@standard-schema/spec';

export type FormError = string[] | undefined;

export type FormListenerFn = () => void;
export interface FormValueOption<T, TForm> {
	value: T;
	validator?:
		| StandardSchemaV1.Props<T>
		| ((currentForm: TForm) => StandardSchemaV1.Props<T>);
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
	ids: { [P in keyof T]?: string };
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

export type FormConfig = {
	focusOnError?: boolean;
	onError?: FormListenerFn;
	onFormValid?: FormListenerFn;
};
