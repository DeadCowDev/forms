import { BaseFormType, FormError, FormEvent, FormOptions, FormResult, OnChangeFormState } from "./types";

export class Form<T extends BaseFormType, TFormType extends FormEvent = FormEvent> {
	private initialValue: T;
	private value: T;
	private dirty = false;
	private errors: FormResult<T>["errors"] = {}
	private loading = false;

	private listeners: OnChangeFormState<T, TFormType>[] = [];

	constructor(private readonly config: FormOptions<T>) {
		this.initialValue = this.getValueFromOptions(config);
		this.value = this.getValueFromOptions(config);
	}

	listen(cb: OnChangeFormState<T, TFormType>): () => void{
		this.listeners.push(cb);
		cb(this.currentState);
		return () => {
			this.listeners = this.listeners.filter(l => l !== cb);
		}
	}

	get currentState(): FormResult<T, TFormType> {
		return {
			dirty: this.dirty,
			pristine: !this.dirty,
			errors: this.errors,
			loading: this.loading,
			value: this.value,
			markAsDirty: this.markAsDirty.bind(this),
			addError: this.addError.bind(this),
			reset: this.reset.bind(this),
			updateValidity: this.updateValidity.bind(this),
			handleSubmit: this.handleSubmit.bind(this),
			setValue: this.setValue.bind(this),
		};
	}

	private markAsDirty() {
		this.dirty = true;
		this.notify();
	}

	private updateValidity(): boolean {
		const errors: typeof this.errors = {};

    Object.keys(this.config).forEach((k: keyof T) => {
      const validator = this.config[k].validator;
      const value = this.value[k];
      if (validator) {
        const result =
          typeof validator === "function"
            ? validator(this.value)
            : validator;
        const error = result.safeParse(value);
        if (error.success) {
          return;
        }

        errors[k] = error.error.errors.map((e) => e.message);
      }
    });

		this.errors = errors;
		this.notify();
    return Object.keys(errors).length === 0;
	}

	private addError(k: keyof T, error: string): void {
		const errorsList = this.errors[k] || []
		errorsList.push(error);
		this.errors[k] = errorsList;
		this.notify();
	}

	private reset(newValue?: T): void {
		if (newValue) this.initialValue = newValue;
		this.value = this.initialValue;
		this.errors = {};
		this.dirty = false,
		this.loading = false;
		this.notify();
	}

	private setValue<K extends keyof T>(k: K, value: T[K]): FormError {
		this.dirty = true;
		this.value[k] = value;
		this.notify();

		const propertyValidator = this.config[k].validator;
		if (!propertyValidator) return;

		const validator =
		typeof propertyValidator === "function"
			? propertyValidator(this.value)
			: propertyValidator;
	const validatorResult = validator.safeParse(value);

	if (validatorResult.success) {
		return undefined;
	}

	return validatorResult.error.errors.map((e) => e.message);
	}

	private handleSubmit(cb: (v: T) => void | Promise<void>): (ev: TFormType) => void {
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
		}
	}

	private notify() {
		this.listeners.forEach(l => l(this.currentState))
	}

	private getValueFromOptions(
		v: FormOptions<T>
	): T {
		const result: Record<string, unknown> = {};
		Object.keys(v).forEach((k) => {
			result[k] = v[k]?.value;
		});
		return result as T;
	};

}
