# React-forms

## Introduction

This package provides a powerful and flexible solution for creating model-driven forms in React applications. By utilizing this package, developers can easily build complex forms with dynamic validation and conditional logic, all driven by a central model.

## Features

- **Type Safety**: Leverage TypeScript to ensure that your forms are type-safe, reducing runtime errors and improving developer experience.
- **Model-Driven Forms**: Define your forms structure through models, making form creation more intuitive and less error-prone.
- **Zod Validations**: Utilize Zod's comprehensive validation capabilities to enforce a wide array of constraints and custom validations.

## Installation and usage

First install react-forms:

```bash
npm i @deadcow-enterprises/react-forms
yarn add @deadcow-enterprises/react-forms
pnpm add @deadcow-enterprises/react-forms
```

## Usage

```javascript
import { useForm } from "@deadcow-enterprises/react-forms";
import { z } from "zod";

type LoginModel = {
  username: string,
  password: string,
};

function App() {
  const form =useForm<LoginModel>(
		{
		username: {
			value: "",
			validator: z.string().min(1, "Username is required"),
		},
		password: {
			value: "",
			validator: z.string().min(1, "Password is required"),
		},
	});
  const login = (formValue: LoginModel) => {
    // do something with formValue here like send it to the server
    console.log(formValue);
  };
  return (
    <form onSubmit={form.handleSubmit(login)}>
      <label htmlFor="username">
        Username
        <input
          type="text"
          name="username"
          id="username"
          value={form.value.username}
          onChange={(ev) => {
            form.setValue("username", ev.target.value);
          }}
        />
        {form.errors.username?.map((err, i) => (
          <span className="error" key={i}>
            {err}
          </span>
        ))}
      </label>
      <label htmlFor="password">
        Password
        <input
          type="password"
          name="password"
          id="password"
          value={form.value.password}
          onChange={(ev) => {
            form.setValue("password", ev.target.value);
          }}
        />
        {form.errors.password?.map((err, i) => (
          <span className="error" key={i}>
            {err}
          </span>
        ))}
      </label>

      <button>Submit</button>
    </form>
  );
}
```
