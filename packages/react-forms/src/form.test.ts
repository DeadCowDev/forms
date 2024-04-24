import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useForm } from "./form";
type FormType = { prop: number };

describe("React adapter", () => {
	it("Should get form instance", () => {
		const { result } = renderHook(() =>
		useForm<FormType>({
			prop: {
				value: 1,
			},
		})
	);
		const sut = result.current;
		expect(sut.value).toStrictEqual({prop: 1});
    expect(sut.errors).toStrictEqual({});
    expect(sut.dirty).toBe(false);
	})

	it("Should update value on notify", () => {
		const { result } = renderHook(() =>
		useForm<FormType>({
			prop: {
				value: 1,
			},
		})
	);
		act(() => {
			result.current.markAsDirty();
		})
		const sut = result.current;
		expect(sut.dirty).toBe(true);

	})
})
