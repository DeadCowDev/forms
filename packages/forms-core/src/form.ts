import {
	BaseFormType,
	FormConfig,
	FormError,
	FormErrorListenerFn,
	FormEvent,
	FormListenerFn,
	FormOptions,
	FormResult,
	OnChangeFormState,
} from './types';
import { generateId } from './utils';

export class Form<
	T extends BaseFormType,
	TFormType extends FormEvent = FormEvent,
> {
	private readonly id = generateId();
	private initialValue: T;
	private value: T;
	private dirty = false;
	private errors: FormResult<T>['errors'] = {};
	private loading = false;
	private readonly ids: FormResult<T>['ids'] = {};

	private listeners: OnChangeFormState<T, TFormType>[] = [];

	private errorListener?: FormErrorListenerFn;
	private formValidListener?: FormListenerFn;

	constructor(
		private readonly config: FormOptions<T>,
		private readonly opts?: FormConfig,
	) {
		this.initialValue = this.getValueFromOptions(config);
		this.value = this.getValueFromOptions(config);
		this.registerFormListeners();
		this.ids = this.setupIds(config);
	}

	private setupIds(v: FormOptions<T>) {
		const result: FormResult<T>['ids'] = {};
		Object.keys(v).forEach((k: keyof T) => {
			const valueId = v[k]?.id ?? generateId();
			result[k] = `form-${this.id}-field-${valueId}`;
		});
		return result;
	}

	private registerFormListeners() {
		this.errorListener = this.opts?.onError;
		this.formValidListener = this.opts?.onFormValid;
	}

	listen(cb: OnChangeFormState<T, TFormType>): () => void {
		this.listeners.push(cb);
		cb(this.currentState);
		return () => {
			this.listeners = this.listeners.filter((l) => l !== cb);
		};
	}

	get currentState(): FormResult<T, TFormType> {
		return {
			dirty: this.dirty,
			pristine: !this.dirty,
			errors: this.errors,
			currentErrors: this.getCurrentErrors(),
			loading: this.loading,
			value: this.value,
			ids: this.ids,
			markAsDirty: this.markAsDirty.bind(this),
			addError: this.addError.bind(this),
			reset: this.reset.bind(this),
			updateValidity: this.updateValidity.bind(this),
			handleSubmit: this.handleSubmit.bind(this),
			setValue: this.setValue.bind(this),
			notify: this.notify.bind(this),
		};
	}

	private markAsDirty() {
		this.dirty = true;
		this.notify();
	}

	private updateValidity(): boolean {
		const errors = this.getCurrentErrors();

		this.errors = errors;
		this.notify();
		this.handleFormErrorsIfAny();
		this.handleFormIfValid();
		return Object.keys(errors).length === 0;
	}

	private getCurrentErrors(): FormResult<T>['errors'] {
		const errors: typeof this.errors = {};

		Object.keys(this.config).forEach((k: keyof T) => {
			const validator = this.config[k].validator;
			const value = this.value[k];
			if (validator) {
				const result =
					typeof validator === 'function' ? validator(this.value) : validator;
				const error = result.safeParse(value);
				if (error.success) {
					return;
				}

				errors[k] = error.error.errors.map((e) => e.message);
			}
		});
		return errors;
	}

	private handleFormErrorsIfAny() {
		if (Object.keys(this.errors).length === 0) {
			return;
		}
		const errorList = Object.values(this.errors)
			.map((e) => e ?? [])
			.flat();
		this.errorListener?.(errorList);

		if (this.opts?.focusOnError) {
			const errorIds = Object.keys(this.errors).map(
				(k: keyof T) => this.ids[k] as string,
			);
			let firstElement: HTMLElement = undefined as unknown as HTMLElement;
			let firstIndex = Infinity;

			errorIds.forEach((id) => {
				const el = id ? document.getElementById(id) : null;
				if (!el) {
					return;
				}
				const index = Array.prototype.indexOf.call(
					document.body.getElementsByTagName('*'),
					el,
				);
				if (index !== -1 && index < firstIndex) {
					firstElement = el;
					firstIndex = index;
				}
			});
			if (firstElement) {
				firstElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
				firstElement.focus();
			}
		}
	}
	private handleFormIfValid() {
		if (Object.keys(this.errors).length !== 0) {
			return;
		}
		this.formValidListener?.();
	}

	private addError(k: keyof T, error: string): void {
		const errorsList = this.errors[k] || [];
		errorsList.push(error);
		this.errors[k] = errorsList;
		this.notify();
	}

	private reset(newValue?: T): void {
		if (newValue) this.initialValue = newValue;
		this.value = this.initialValue;
		this.errors = {};
		(this.dirty = false), (this.loading = false);
		this.notify();
	}

	private setValue<K extends keyof T>(k: K, value: T[K]): FormError {
		this.dirty = true;
		this.value[k] = value;
		this.notify();

		const propertyValidator = this.config[k].validator;
		if (!propertyValidator) return;

		const validator =
			typeof propertyValidator === 'function'
				? propertyValidator(this.value)
				: propertyValidator;
		const validatorResult = validator.safeParse(value);

		if (validatorResult.success) {
			return undefined;
		}

		return validatorResult.error.errors.map((e) => e.message);
	}

	private handleSubmit(
		cb: (v: T) => void | Promise<void>,
	): (ev: TFormType) => void {
		return async (ev) => {
			ev.stopPropagation();
			ev.preventDefault();
			const valid = this.updateValidity();
			if (!valid) {
				return;
			}

			try {
				this.loading = true;
				this.notify();
				const cbResult = cb(this.value);
				if (cbResult instanceof Promise) {
					await cbResult;
				}
			} finally {
				this.loading = false;
				this.notify();
			}
		};
	}

	private notify() {
		this.listeners.forEach((l) => l(this.currentState));
	}

	private getValueFromOptions(v: FormOptions<T>): T {
		const result: Record<string, unknown> = {};
		Object.keys(v).forEach((k) => {
			result[k] = v[k]?.value;
		});
		return result as T;
	}
}
