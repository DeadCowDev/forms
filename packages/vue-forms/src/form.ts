import {
	BaseFormType,
	Form,
	FormOptions,
	FormResult,
} from "@deadcow-enterprises/forms-core";
import { Ref, onMounted, onUnmounted, ref } from "vue";

export function useForm<T extends BaseFormType>(
  config: FormOptions<T>
): Ref<FormResult<T, Event>> {
  const instance = ref(new Form<T, Event>(config));
  const formResult = ref(instance.value.currentState) as Ref<
    FormResult<T, Event>
  >;
  const sub = ref<null | (() => void)>();

  onMounted(() => {
    sub.value = instance.value.listen((newState) => {
      formResult.value = newState;
    });
  });

  onUnmounted(() => {
    sub.value?.();
  });

  return formResult;
}

export function typedTarget<T extends HTMLElement>(
  target: EventTarget | null | undefined
): T | null | undefined {
  return target as T;
}
