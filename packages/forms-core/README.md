# Forms core

## Introduction

This package provides a powerful and flexible solution for creating model-driven forms. This is the main core of Forms. You can use it in the browser, on the server or wrap it in a framework with minimal code needed.

## Features

- **Type Safety**: Leverage TypeScript to ensure that your forms are type-safe, reducing runtime errors and improving developer experience.
- **Model-Driven Forms**: Define your forms structure through models, making form creation more intuitive and less error-prone.
- **Zod Validations**: Utilize Zod's comprehensive validation capabilities to enforce a wide array of constraints and custom validations.
- **Subscription based form change notifications**: You can check the forms changes after invoking any function or you can listen to changes.
- **Framework-less**: This is not dependent on any framework, you can use it as is or use one of the adapters already implemented.

## Installation and usage

First install forms-core:

```bash
npm i @deadcow-enterprises/forms-core
yarn add @deadcow-enterprises/forms-core
pnpm add @deadcow-enterprises/forms-core
```

## Usage

```javascript
import { Form } from "@deadcow-enterprises/forms-core";
import { z } from "zod";

type LoginModel = {
  username: string,
  password: string,
};

const form = new Form<LoginModel>({
	username: {
		value: "",
		validator: z.string().min(1, "Username is required"),
	},
	password: {
		value: "",
		validator: z.string().min(1, "Password is required"),
	},
});

form.listen((newFormState) => {
	console.log(newFormState);
});
```
