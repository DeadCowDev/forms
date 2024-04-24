import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { FormEvent } from ".";
import { Form } from "./form";
import { FormResult } from "./types";
type FormTestType = {
	prop1: number,
	prop2: string;
	prop3?: boolean
}

describe("Forms instance", () => {

	let form: Form<FormTestType>;

	beforeEach(() => {
		form = new Form<FormTestType>({
			prop1: {
				value: 0,
				validator: z.number().min(5, "ErrorMessage")
			},
			prop2: {
				value: ""
			},
			prop3: {
				value: false,
				validator: z.boolean()
			}
		});
	})

	it("Should create", () => {
		expect(form).toBeDefined();

		expect(form.currentState.value).toEqual({
			prop1: 0,
			prop2: "",
			prop3: false
		})
		expect(form.currentState.dirty).toBe(false);
		expect(form.currentState.errors).toEqual({});

	})

	it("Should change value of property", () => {
		form.currentState.setValue("prop1", 1);
		form.currentState.setValue("prop2", "Test");
		form.currentState.setValue("prop3", true);
		expect(form.currentState.value.prop1).toBe(1);
		expect(form.currentState.value.prop2).toBe("Test");
		expect(form.currentState.value.prop3).toBe(true);
	})

	it("Should set dirty and pristine after changing property value", () => {
		form.currentState.setValue("prop3", true);
		expect(form.currentState.dirty).toBe(true);
		expect(form.currentState.pristine).toBe(false);
	})

	it("Should update errors after updating validity", () => {
		const valid = form.currentState.updateValidity();
		expect(valid).toBe(false)
		expect(form.currentState.errors.prop1).toEqual(["ErrorMessage"])
	})

	it("Should mark as dirty", () => {
		form.currentState.markAsDirty();
		expect(form.currentState.dirty).toBe(true);
		expect(form.currentState.pristine).toBe(false);
	})

	it("Should reset value", () => {
		form.currentState.setValue("prop1", 100);
		form.currentState.reset();

		expect(form.currentState.dirty).toBe(false);
		expect(form.currentState.pristine).toBe(true);
		expect(form.currentState.value.prop1).toBe(0);
	})

	it("Should add error", () => {
		form.currentState.addError("prop1", "My error from test");
		expect(form.currentState.errors.prop1).toEqual(["My error from test"])
	})

	it("Should not be called if there are errors in handler", () => {
		const fn = vi.fn();
		const ev: FormEvent = {
			preventDefault: vi.fn(),
			stopPropagation:vi.fn(),
		};
		const handler = form.currentState.handleSubmit(fn);

		handler(ev);

		expect(ev.preventDefault).toHaveBeenCalled();
		expect(ev.stopPropagation).toHaveBeenCalled();
		expect(fn).not.toHaveBeenCalled();
		expect(form.currentState.errors).toEqual({
			prop1: ["ErrorMessage"]
		})

	})

	it("Should await handle of valid form", () => {
		form.currentState.setValue("prop1", 100);
		const fn = vi.fn().mockReturnValue(Promise.resolve(true));
		const ev: FormEvent = {
			preventDefault: vi.fn(),
			stopPropagation:vi.fn(),
		};
		const handler = form.currentState.handleSubmit(fn);

		handler(ev);

		expect(ev.preventDefault).toHaveBeenCalled();
		expect(ev.stopPropagation).toHaveBeenCalled();
		expect(fn).toHaveBeenCalledWith({prop1: 100, prop2: "", prop3: false});
	})

	it("Should subscribe to changes", () => {
		let updateCount = 0;
		let formState: FormResult<FormTestType, FormEvent> | undefined;
		const unsubscribe = form.listen((state) => {
			formState = state;
			updateCount++;
		})

		form.currentState.markAsDirty();
		unsubscribe();
		form.currentState.markAsDirty();

		expect(formState).toBeDefined();
		expect(updateCount).toBe(2);
	})

})
