import { BaseFormType, Form, FormOptions, FormResult } from "@deadcow-enterprises/forms-core";
import { FormEvent, useEffect, useState } from "react";

export function useForm<T extends BaseFormType>(config: FormOptions<T>): FormResult<T, FormEvent> {
	const [instance] = useState(new Form<T, FormEvent>(config));
	const [formResult, setFormResult] = useState<FormResult<T, FormEvent>>(instance.currentState);
	useEffect(() => {
		return instance.listen(setFormResult)
	}, [instance]);
	return formResult;
}
