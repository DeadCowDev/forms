import { describe, expect, it } from "vitest";
import { typedTarget, useForm } from "./form";
import { withSetup } from "./test-utils";

type FormType = { prop: number };

describe("Vue adapter", () => {
	it("Should get form instance", () => {
		const [sut, app] = withSetup(() => useForm<FormType>({
			prop: {
				value: 1,
			},
		}))
		expect(sut.value.value).toStrictEqual({prop: 1});
		expect(sut.value.errors).toStrictEqual({});
		expect(sut.value.dirty).toBe(false);
		app.unmount()
	})

	it("Should update value on notify", () => {
		const [sut, app] = withSetup(() =>
		useForm<FormType>({
			prop: {
				value: 1,
			},
		})
	);

		sut.value.markAsDirty();
		expect(sut.value.dirty).toBe(true);
		app.unmount()
	})

	it("Should cast event target to event type", () => {
		const input = {};
		const res = typedTarget<HTMLElement>(input as EventTarget);
		expect(res).toBe(input)
	})
})
